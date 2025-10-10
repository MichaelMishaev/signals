import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { verificationCache } from "@/lib/redis";

export async function POST(request: NextRequest) {
  try {
    // Get Prisma client with proper error handling
    const prisma = getPrisma();
    if (!prisma) {
      console.error("[verify-code] Database not configured");
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      );
    }

    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    // Get stored code from Redis
    const storedCode = await verificationCache.get(email);

    if (!storedCode) {
      return NextResponse.json(
        { error: "Verification code expired or not found" },
        { status: 400 }
      );
    }

    // Verify code
    if (storedCode !== code) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Delete code after successful verification
    await verificationCache.delete(email);

    // Update user's email verification status
    const user = await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Code verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}