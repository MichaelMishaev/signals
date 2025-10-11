import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { normalizeEmail } from "@/utils/email";

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

    // Get Prisma client with proper error handling
    const prisma = getPrisma();

    // If Prisma is not configured, skip database check
    // This allows the gate to work without a database (email verification only)
    if (!prisma) {
      console.log("[check-email-status] Database not configured - skipping DB check");
      return NextResponse.json({
        verified: false,
        exists: false,
      });
    }

    // Check if user exists and is verified
    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: {
          id: true,
          email: true,
          emailVerified: true,
          name: true,
        },
      });
    } catch (dbError: any) {
      console.warn("[check-email-status] Database connection failed:", dbError?.message || dbError);
      // Database not available - return not verified
      return NextResponse.json({
        verified: false,
        exists: false,
      });
    }

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

  } catch (error: any) {
    console.error("Error checking email status:", error);
    console.error("Error stack:", error?.stack);
    console.error("Error message:", error?.message);
    return NextResponse.json(
      { error: "Failed to check email status", details: error?.message },
      { status: 500 }
    );
  }
}
