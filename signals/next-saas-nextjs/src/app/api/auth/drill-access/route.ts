import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { sendMagicLinkEmail, sendVerificationCodeEmail } from "@/lib/email";
import { magicLinkCache } from "@/lib/redis";
import { normalizeEmail, isValidEmail } from "@/utils/email";

export async function POST(request: NextRequest) {
  try {
    const { email, name, source, action, returnUrl } = await request.json();

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Normalize email for consistent database storage and lookup
    const normalizedEmail = normalizeEmail(email);

    // Rate limiting for email actions
    if (action === "send-magic-link" || action === "resend-verification") {
      // Whitelist test emails (skip rate limiting)
      const whitelistedEmails = ["345287@gmail.com"];
      const isWhitelisted = whitelistedEmails.includes(normalizedEmail);

      const clientIP = request.headers.get("x-forwarded-for") ||
                      request.headers.get("x-real-ip") ||
                      "unknown";

      // Check rate limits (skip for whitelisted emails)
      if (!isWhitelisted) {
        const now = Date.now();
        const emailKey = `rate_limit_email:${normalizedEmail}`;
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
    }

    // Get Prisma client with proper error handling
    const prisma = getPrisma();

    // If Prisma not configured, create a mock user for email sending
    let user: any = null;

    if (prisma) {
      try {
        // Check if user exists (using normalized email)
        user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
        });

        // If user doesn't exist, create one
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: normalizedEmail,
              name: name || undefined,
              // No password for drill-only users (magic link only)
            },
          });
        }
      } catch (dbError: any) {
        console.warn("[drill-access] Database connection failed:", dbError?.message || dbError);
        // Use mock user if database fails
        user = {
          id: `temp_${normalizedEmail}`,
          email: normalizedEmail,
          name: name || null,
        };
      }
    } else {
      // Mock user when database is not available
      console.log("[drill-access] Database not configured - using mock user");
      user = {
        id: `temp_${normalizedEmail}`,
        email: normalizedEmail,
        name: name || null,
      };
    }

    // Handle different actions
    switch (action) {
      case "send-magic-link":
      case "resend-verification": {
        // Send magic link for drill access (use normalized email)
        const baseUrl = request.headers.get("origin") || process.env.NEXTAUTH_URL || "";
        const result = await sendMagicLinkEmail(normalizedEmail, baseUrl, returnUrl);

        if (!result.success) {
          // Enhanced error logging for production debugging
          console.error("========================================");
          console.error("[DRILL-ACCESS] EMAIL SENDING FAILED");
          console.error("========================================");
          console.error("Timestamp:", new Date().toISOString());
          console.error("Email Address:", normalizedEmail);
          console.error("Error Message:", result.error);
          console.error("Error Details:", JSON.stringify(result, null, 2));
          console.error("");
          console.error("Environment Configuration:");
          console.error("  NODE_ENV:", process.env.NODE_ENV);
          console.error("  RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);
          console.error("  RESEND_API_KEY prefix:", process.env.RESEND_API_KEY?.substring(0, 10) + "...");
          console.error("  RESEND_API_KEY length:", process.env.RESEND_API_KEY?.length);
          console.error("  EMAIL_FROM:", process.env.EMAIL_FROM);
          console.error("  NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
          console.error("");
          console.error("Request Details:");
          console.error("  Origin:", request.headers.get("origin"));
          console.error("  User-Agent:", request.headers.get("user-agent"));
          console.error("  X-Forwarded-For:", request.headers.get("x-forwarded-for"));
          console.error("========================================");

          return NextResponse.json(
            {
              error: "Failed to send verification email",
              details: result.error,
              // Include full error details for debugging (consider removing in production)
              debugInfo: {
                errorType: (result as any).exceptionType,
                errorCode: (result as any).exceptionCode,
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV
              },
              // In development, still provide the magic link for testing
              ...(process.env.NODE_ENV === 'development' && result.magicLink ? {
                developmentLink: result.magicLink,
                message: "Email failed but here's your magic link for testing"
              } : {})
            },
            { status: 500 }
          );
        }

        // Track drill access request (only if database is available)
        if (prisma && typeof user.id === 'string' && !user.id.startsWith('temp_')) {
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
          } catch (dbError: any) {
            console.warn("Failed to track drill access:", dbError?.message || dbError);
            // Continue without tracking - not critical for email sending
          }
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
        // Send verification code as fallback (use normalized email)
        const result = await sendVerificationCodeEmail(normalizedEmail);

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
        // Check if user has verified email (use normalized email)
        if (!prisma) {
          // Without database, return basic response
          return NextResponse.json({
            success: true,
            hasAccess: false,
            emailVerified: false,
            drillProgress: null,
          });
        }

        let verifiedUser;
        try {
          verifiedUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
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
        } catch (dbError: any) {
          console.warn("[verify-access] Database connection failed:", dbError?.message || dbError);
          // Database not available - return basic response
          return NextResponse.json({
            success: true,
            hasAccess: false,
            emailVerified: false,
            drillProgress: null,
          });
        }

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
  } catch (error: any) {
    console.error("Drill access error:", error);
    console.error("Error stack:", error?.stack);
    console.error("Error message:", error?.message);
    console.error("Error details:", {
      name: error?.name,
      message: error?.message,
      code: error?.code
    });
    return NextResponse.json(
      { error: "An error occurred processing your request", details: error?.message },
      { status: 500 }
    );
  }
}