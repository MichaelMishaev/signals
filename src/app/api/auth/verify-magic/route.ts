import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { magicLinkCache } from "@/lib/redis";
import { signIn } from "next-auth/react";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(
        new URL("/auth/error?error=InvalidToken", request.url)
      );
    }

    // Get email from Redis using token
    const email = await magicLinkCache.get(token);

    if (!email) {
      return NextResponse.redirect(
        new URL("/auth/error?error=ExpiredToken", request.url)
      );
    }

    // Delete token after use
    await magicLinkCache.delete(token);

    // Update user's email verification status
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
      },
    });

    // Create a session token for automatic sign-in
    // This would typically be handled by NextAuth's signIn method
    // For now, redirect to sign-in page with email pre-filled
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("email", email);
    signInUrl.searchParams.set("verified", "true");

    return NextResponse.redirect(signInUrl);
  } catch (error) {
    console.error("Magic link verification error:", error);
    return NextResponse.redirect(
      new URL("/auth/error?error=VerificationFailed", request.url)
    );
  }
}