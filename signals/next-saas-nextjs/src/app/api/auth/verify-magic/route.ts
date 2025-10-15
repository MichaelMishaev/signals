import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { magicLinkCache } from "@/lib/redis";
import { signIn } from "next-auth/react";
import { normalizeEmail } from "@/utils/email";

export async function GET(request: NextRequest) {
  try {
    // Get Prisma client with proper error handling
    const prisma = getPrisma();
    if (!prisma) {
      console.error("[verify-magic] Database not configured");
      // Use the base URL to construct redirect (Next.js will add locale via middleware)
      const errorUrl = new URL("/auth/error", request.url);
      errorUrl.searchParams.set("error", "DatabaseError");
      return NextResponse.redirect(errorUrl);
    }

    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      const errorUrl = new URL("/auth/error", request.url);
      errorUrl.searchParams.set("error", "InvalidToken");
      return NextResponse.redirect(errorUrl);
    }

    // Get token data from Redis
    const tokenDataStr = await magicLinkCache.get(token);

    if (!tokenDataStr) {
      const errorUrl = new URL("/auth/error", request.url);
      errorUrl.searchParams.set("error", "ExpiredToken");
      return NextResponse.redirect(errorUrl);
    }

    // Parse token data
    let tokenData;
    try {
      tokenData = JSON.parse(tokenDataStr);
    } catch {
      // Handle legacy tokens that just stored email
      tokenData = { email: tokenDataStr, returnUrl: "/" };
    }

    const { email, returnUrl } = tokenData;

    // Normalize email for database lookup
    const normalizedEmail = normalizeEmail(email);

    // Delete token after use
    await magicLinkCache.delete(token);

    // Update user's email verification status
    await prisma.user.update({
      where: { email: normalizedEmail },
      data: {
        emailVerified: new Date(),
      },
    });

    // Create a session token for automatic sign-in and redirect to original drill
    const response = NextResponse.redirect(new URL(returnUrl || "/", request.url));

    // Set verification cookie that lasts 30 days (use normalized email)
    response.cookies.set("email_verified", normalizedEmail, {
      httpOnly: false, // Need to read from client-side
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/", // Ensure cookie is available across all paths
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    response.cookies.set("verification_message", "Email verified! You now have full access to all drills.", {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/", // Ensure cookie is available across all paths
      maxAge: 60, // 1 minute (just for showing message)
    });

    // Set flag to update gate state on client (use normalized email)
    response.cookies.set("gate_email_verified", normalizedEmail, {
      httpOnly: false,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/", // Ensure cookie is available across all paths
      maxAge: 60, // 1 minute (just for updating gate state)
    });

    return response;
  } catch (error) {
    console.error("Magic link verification error:", error);
    const errorUrl = new URL("/auth/error", request.url);
    errorUrl.searchParams.set("error", "VerificationFailed");
    return NextResponse.redirect(errorUrl);
  }
}