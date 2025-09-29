import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendMagicLinkEmail, sendVerificationCodeEmail } from "@/lib/email";
import { magicLinkCache } from "@/lib/redis";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, name, source, action, returnUrl } = await request.json();

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Rate limiting for email actions
    if (action === "send-magic-link" || action === "resend-verification") {
      const clientIP = request.headers.get("x-forwarded-for") ||
                      request.headers.get("x-real-ip") ||
                      "unknown";

      // Check rate limits
      const now = Date.now();
      const emailKey = `rate_limit_email:${email}`;
      const ipKey = `rate_limit_ip:${clientIP}`;

      try {
        // Get current counts from Redis
        const [emailCount, ipCount] = await Promise.all([
          magicLinkCache.get(emailKey),
          magicLinkCache.get(ipKey)
        ]);

        // Parse existing data or initialize
        let emailData = emailCount ? JSON.parse(emailCount) : { count: 0, timestamp: now };
        let ipData = ipCount ? JSON.parse(ipCount) : { count: 0, timestamp: now };

        // Reset counters if more than 1 hour has passed
        const HOUR = 60 * 60 * 1000;
        if (now - emailData.timestamp > HOUR) {
          emailData = { count: 0, timestamp: now };
        }
        if (now - ipData.timestamp > HOUR) {
          ipData = { count: 0, timestamp: now };
        }

        // Check limits: 3 emails per hour per email, 10 per hour per IP
        if (emailData.count >= 3) {
          return NextResponse.json(
            {
              error: "Too many email requests",
              message: "You can only request 3 verification emails per hour. Please try again later.",
              cooldownMinutes: Math.ceil((HOUR - (now - emailData.timestamp)) / (60 * 1000))
            },
            { status: 429 }
          );
        }

        if (ipData.count >= 10) {
          return NextResponse.json(
            {
              error: "Too many requests from this IP",
              message: "Too many requests from your location. Please try again later.",
              cooldownMinutes: Math.ceil((HOUR - (now - ipData.timestamp)) / (60 * 1000))
            },
            { status: 429 }
          );
        }

        // Increment counters
        emailData.count++;
        ipData.count++;

        // Store updated counts
        await Promise.all([
          magicLinkCache.set(emailKey, JSON.stringify(emailData), 3600), // 1 hour
          magicLinkCache.set(ipKey, JSON.stringify(ipData), 3600) // 1 hour
        ]);

      } catch (redisError) {
        console.warn("Redis rate limiting failed, proceeding:", redisError);
        // Continue without rate limiting if Redis fails
      }
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create one
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || undefined,
          // No password for drill-only users (magic link only)
        },
      });
    }

    // Handle different actions
    switch (action) {
      case "send-magic-link":
      case "resend-verification": {
        // Send magic link for drill access
        const baseUrl = request.headers.get("origin") || process.env.NEXTAUTH_URL || "";
        const result = await sendMagicLinkEmail(email, baseUrl, returnUrl);

        if (!result.success) {
          return NextResponse.json(
            { error: "Failed to send verification email", details: result.error },
            { status: 500 }
          );
        }

        // Track drill access request
        try {
          await prisma.drillProgress.upsert({
            where: {
              userId_drillId: {
                userId: user.id,
                drillId: source || "general",
              },
            },
            update: {
              attempts: { increment: 1 },
              lastAttempt: new Date(),
            },
            create: {
              userId: user.id,
              drillId: source || "general",
              attempts: 1,
            },
          });
        } catch (dbError) {
          console.error("Failed to track drill access:", dbError);
        }

        // Check if we're in development mode without email configured
        if (result.magicLink) {
          return NextResponse.json({
            success: true,
            message: result.message || "Magic link generated (check server console)",
            requiresVerification: true,
            // Include the magic link in development for easier testing
            developmentLink: result.magicLink
          });
        }

        return NextResponse.json({
          success: true,
          message: "Magic link sent! Check your email to verify access.",
          requiresVerification: true,
        });
      }

      case "send-code": {
        // Send verification code as fallback
        const result = await sendVerificationCodeEmail(email);

        if (!result.success) {
          return NextResponse.json(
            { error: "Failed to send verification code" },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: "Verification code sent! Check your email.",
          code: process.env.NODE_ENV === "development" ? result.code : undefined,
        });
      }

      case "verify-access": {
        // Check if user has verified email
        const verifiedUser = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            emailVerified: true,
            drillProgress: {
              where: {
                drillId: source || "general",
              },
            },
          },
        });

        if (!verifiedUser) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        const hasAccess = !!verifiedUser.emailVerified;
        const drillProgress = verifiedUser.drillProgress[0];

        return NextResponse.json({
          success: true,
          hasAccess,
          emailVerified: !!verifiedUser.emailVerified,
          drillProgress: drillProgress ? {
            attempts: drillProgress.attempts,
            completed: drillProgress.completed,
            score: drillProgress.score,
            lastAttempt: drillProgress.lastAttempt,
          } : null,
        });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Drill access error:", error);
    return NextResponse.json(
      { error: "An error occurred processing your request" },
      { status: 500 }
    );
  }
}