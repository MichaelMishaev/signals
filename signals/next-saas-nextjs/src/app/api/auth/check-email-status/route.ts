import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { normalizeEmail } from "@/utils/email";

const prisma = new PrismaClient();

/**
 * Check if email is verified in database
 * This enables cross-browser verification
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Normalize email for consistent lookup
    const normalizedEmail = normalizeEmail(email);

    // Check if user exists and is verified
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        emailVerified: true,
        name: true,
      },
    });

    if (!user) {
      // User doesn't exist - return not verified
      // Don't reveal that the email doesn't exist for privacy
      return NextResponse.json({
        verified: false,
        exists: false,
      });
    }

    const isVerified = !!user.emailVerified;

    if (isVerified) {
      // User is verified! Return success with email for caching
      return NextResponse.json({
        verified: true,
        exists: true,
        email: user.email,
        verifiedAt: user.emailVerified,
      });
    }

    // User exists but not verified
    return NextResponse.json({
      verified: false,
      exists: true,
    });

  } catch (error) {
    console.error("Error checking email status:", error);
    return NextResponse.json(
      { error: "Failed to check email status" },
      { status: 500 }
    );
  }
}
