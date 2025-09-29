import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendMagicLinkEmail, sendVerificationCodeEmail } from "@/lib/email";
import { verificationCache, magicLinkCache } from "@/lib/redis";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, type = "magic-link" } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified" },
        { status: 400 }
      );
    }

    // Check rate limiting - prevent spam
    const recentAttemptKey = `rate-limit:${email}`;
    const recentAttempt = await verificationCache.get(recentAttemptKey);

    if (recentAttempt) {
      return NextResponse.json(
        { error: "Please wait before requesting another verification email" },
        { status: 429 }
      );
    }

    // Set rate limit - 1 minute between requests
    await verificationCache.set(recentAttemptKey, "1", 60);

    // Send verification based on type
    let result;
    if (type === "code") {
      result = await sendVerificationCodeEmail(email);
    } else {
      const baseUrl = request.headers.get("origin") || process.env.NEXTAUTH_URL || "";
      result = await sendMagicLinkEmail(email, baseUrl);
    }

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Verification ${type === "code" ? "code" : "link"} sent to ${email}`,
      type,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification" },
      { status: 500 }
    );
  }
}