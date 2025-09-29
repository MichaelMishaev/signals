import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { sendMagicLinkEmail, sendWelcomeEmail } from "@/lib/email";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, sendMagicLink = true } = await request.json();

    // Validate input
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password if provided
    let hashedPassword = null;
    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters long" },
          { status: 400 }
        );
      }
      hashedPassword = await bcrypt.hash(password, 12);
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        emailVerified: sendMagicLink ? null : new Date(), // Mark as verified if not using magic link
      },
    });

    // Send verification email
    if (sendMagicLink) {
      const baseUrl = request.headers.get("origin") || process.env.NEXTAUTH_URL || "";
      const result = await sendMagicLinkEmail(email, baseUrl);

      if (!result.success) {
        // Delete user if email fails
        await prisma.user.delete({ where: { id: user.id } });
        return NextResponse.json(
          { error: "Failed to send verification email" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Registration successful! Check your email for the magic link.",
        requiresVerification: true,
      });
    } else {
      // Send welcome email for immediate access
      await sendWelcomeEmail(email, name);

      return NextResponse.json({
        success: true,
        message: "Registration successful! You can now sign in.",
        requiresVerification: false,
      });
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}