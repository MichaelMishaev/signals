import { Resend } from "resend";
import { magicLinkCache, verificationCache } from "./redis";

// Lazy initialize Resend client to avoid build-time errors
let resend: Resend | null = null;
const getResendClient = () => {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === "re_YOUR_API_KEY") {
      // Return null instead of throwing - caller should handle this
      return null;
    }
    resend = new Resend(apiKey);
  }
  return resend;
};

// Generate 6-digit verification code
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate secure magic link token
export const generateMagicLinkToken = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Send magic link email
export const sendMagicLinkEmail = async (email: string, baseUrl: string, returnUrl?: string) => {
  const token = generateMagicLinkToken();
  const magicLink = `${baseUrl}/api/auth/verify-magic?token=${token}`;

  // Store token with email and return URL in Redis with 10-minute expiry
  const tokenData = {
    email,
    returnUrl: returnUrl || baseUrl,
    timestamp: Date.now()
  };
  await magicLinkCache.set(token, JSON.stringify(tokenData), 600);

  // Check if Resend API key is configured
  const isEmailConfigured = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_YOUR_API_KEY";

  if (!isEmailConfigured) {
    // Development mode: Log the magic link instead of sending email
    console.log("\n======================================");
    console.log("MAGIC LINK GENERATED (Email not configured)");
    console.log("======================================");
    console.log(`Email: ${email}`);
    console.log(`Magic Link: ${magicLink}`);
    console.log(`Token: ${token}`);
    console.log("Token stored in cache for 10 minutes");
    console.log("======================================\n");

    // Still return success so the flow continues
    return {
      success: true,
      token,
      message: "Magic link generated (check server console)",
      magicLink // Include link for testing
    };
  }

  const emailData = {
    from: process.env.EMAIL_FROM || "Signals <onboarding@resend.dev>", // Use resend.dev domain initially
    to: email,
    subject: "Sign in to Signals - Verify Your Email",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #0070f3;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            }
            .code-box {
              background: #f4f4f4;
              padding: 15px;
              border-radius: 5px;
              font-size: 18px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Sign in to Signals</h2>
            <p>Click the button below to sign in to your account:</p>
            <p style="text-align: center;">
              <a href="${magicLink}" class="button">Sign In</a>
            </p>
            <p>Or copy and paste this URL into your browser:</p>
            <p style="word-break: break-all; color: #0070f3;">${magicLink}</p>
            <p style="color: #666; font-size: 14px;">
              This link will expire in 10 minutes. If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `Sign in to Signals\n\nClick this link to sign in: ${magicLink}\n\nThis link will expire in 10 minutes.`,
  };

  try {
    const client = getResendClient();

    if (!client) {
      // Resend not configured - return development mode response
      console.warn("Resend client not available, returning development magic link");
      return {
        success: true,
        token,
        message: "Magic link generated (email service not configured)",
        magicLink
      };
    }

    const { data, error } = await client.emails.send(emailData);

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    console.log("Magic link sent via Resend:", data?.id);
    return { success: true, token };
  } catch (error) {
    console.error("Error sending magic link:", error);
    return { success: false, error };
  }
};

// Send verification code email (fallback)
export const sendVerificationCodeEmail = async (email: string) => {
  const code = generateVerificationCode();

  // Store code in Redis with 10-minute expiry
  await verificationCache.set(email, code, 600);

  // Check if Resend is configured
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_YOUR_API_KEY") {
    console.log("\n======================================");
    console.log("VERIFICATION CODE (Email not configured)");
    console.log("======================================");
    console.log(`Email: ${email}`);
    console.log(`Code: ${code}`);
    console.log("Code stored in cache for 10 minutes");
    console.log("======================================\n");
    return { success: true, code };
  }

  const emailData = {
    from: process.env.EMAIL_FROM || "Signals <onboarding@resend.dev>",
    to: email,
    subject: "Your Signals Verification Code",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .code-box {
              background: #f4f4f4;
              padding: 20px;
              border-radius: 5px;
              font-size: 24px;
              font-weight: bold;
              text-align: center;
              margin: 20px 0;
              letter-spacing: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Verification Code for Signals</h2>
            <p>Use this verification code to complete your sign in:</p>
            <div class="code-box">${code}</div>
            <p style="color: #666; font-size: 14px;">
              This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        </body>
      </html>
    `,
    text: `Your Signals verification code is: ${code}\n\nThis code will expire in 10 minutes.`,
  };

  try {
    const client = getResendClient();

    if (!client) {
      console.warn("Resend client not available, returning development code");
      return { success: true, code };
    }

    const { data, error } = await client.emails.send(emailData);

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    console.log("Verification code sent via Resend:", data?.id);
    return { success: true, code };
  } catch (error) {
    console.error("Error sending verification code:", error);
    return { success: false, error };
  }
};

// Send welcome email after successful registration
export const sendWelcomeEmail = async (email: string, name?: string) => {
  // Check if Resend is configured
  const isEmailConfigured = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_YOUR_API_KEY";

  if (!isEmailConfigured) {
    console.log("\n======================================");
    console.log("WELCOME EMAIL (Email not configured)");
    console.log("======================================");
    console.log(`Email: ${email}`);
    console.log(`Name: ${name || "N/A"}`);
    console.log("Email service not configured - skipping");
    console.log("======================================\n");
    return { success: true, message: "Welcome email skipped (not configured)" };
  }

  const emailData = {
    from: process.env.EMAIL_FROM || "Signals <onboarding@resend.dev>",
    to: email,
    subject: "Welcome to Signals!",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #0070f3;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Welcome to Signals${name ? `, ${name}` : ""}!</h2>
            <p>Your account has been successfully created. You can now access all trading signals and track your performance.</p>
            <p style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL}" class="button">View Signals</a>
            </p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
          </div>
        </body>
      </html>
    `,
    text: `Welcome to Signals${name ? `, ${name}` : ""}!\n\nYour account has been successfully created. You can now access all trading signals and track your performance.\n\nVisit ${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL} to get started.`,
  };

  try {
    const client = getResendClient();

    if (!client) {
      console.warn("Resend client not available, skipping welcome email");
      return { success: true, message: "Welcome email skipped (email service not configured)" };
    }

    const { data, error } = await client.emails.send(emailData);

    if (error) {
      console.error("Resend error sending welcome email:", error);
      return { success: false, error };
    }

    console.log("Welcome email sent via Resend:", data?.id);
    return { success: true };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error };
  }
};