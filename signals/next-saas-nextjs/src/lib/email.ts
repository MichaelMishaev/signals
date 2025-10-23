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

// Validate and sanitize EMAIL_FROM environment variable
const validateEmailFrom = (emailFrom: string | undefined): string => {
  if (!emailFrom) {
    console.warn('[email.ts] EMAIL_FROM not set, using default');
    return "Signals <onboarding@resend.dev>";
  }

  // Remove extra quotes that might be added by hosting platforms
  let sanitized = emailFrom.trim();

  // Remove leading/trailing double quotes
  if (sanitized.startsWith('"') && sanitized.endsWith('"')) {
    sanitized = sanitized.slice(1, -1);
  }

  // Remove escaped characters
  sanitized = sanitized.replace(/\\</g, '<').replace(/\\>/g, '>');

  // Validate format: "Name <email@domain.com>" or "email@domain.com"
  const validFormat = /^(?:"?[^"<>]*"?\s*<[^<>@]+@[^<>@]+\.[^<>@]+>|[^<>@]+@[^<>@]+\.[^<>@]+)$/;

  if (!validFormat.test(sanitized)) {
    console.error('[email.ts] Invalid EMAIL_FROM format:', emailFrom);
    console.error('[email.ts] After sanitization:', sanitized);
    console.error('[email.ts] Using fallback email address');
    return "Signals <onboarding@resend.dev>";
  }

  return sanitized;
};

// Send magic link email
export const sendMagicLinkEmail = async (email: string, baseUrl: string, returnUrl?: string) => {
  const token = generateMagicLinkToken();
  const magicLink = `${baseUrl}/api/auth/verify-magic?token=${token}`;

  // Log magic link generation for debugging
  console.log(`[email.ts] Generating magic link for: ${email}`);
  console.log(`[email.ts] Base URL: ${baseUrl}`);
  console.log(`[email.ts] Return URL: ${returnUrl || baseUrl}`);
  console.log(`[email.ts] Magic Link: ${magicLink}`);

  // Store token with email and return URL in Redis with 10-minute expiry
  const tokenData = {
    email,
    returnUrl: returnUrl || baseUrl,
    timestamp: Date.now()
  };

  try {
    await magicLinkCache.set(token, JSON.stringify(tokenData), 600);
  } catch (redisError) {
    console.warn("Redis cache failed (magic link will still work in dev mode):", redisError);
    // Continue without Redis - in dev mode the token is logged to console
  }

  // Check if Resend API key is configured
  const isEmailConfigured = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_YOUR_API_KEY";

  // Whitelist for production email testing (always send real emails to these addresses)
  const WHITELISTED_EMAILS = ['345287@gmail.com'];
  const isWhitelisted = WHITELISTED_EMAILS.includes(email.toLowerCase());

  // In development mode OR using test domain (onboarding@resend.dev), bypass email sending
  // EXCEPTION: Always send real emails to whitelisted addresses (for testing)
  const isUsingTestDomain = process.env.EMAIL_FROM?.includes("resend.dev");
  const isDevelopment = process.env.NODE_ENV === "development";

  // Bypass email sending if:
  // 1. Not configured, OR
  // 2. Using test domain AND not whitelisted, OR
  // 3. Development mode AND not whitelisted
  const shouldBypassEmail = !isEmailConfigured ||
                           (isUsingTestDomain && !isWhitelisted) ||
                           (isDevelopment && !isWhitelisted);

  if (shouldBypassEmail) {
    // Development mode: Log the magic link instead of sending email
    console.log("\n======================================");
    console.log("MAGIC LINK GENERATED (Development Mode)");
    console.log("======================================");
    console.log(`Email: ${email}`);
    console.log(`Magic Link: ${magicLink}`);
    console.log(`Token: ${token}`);
    console.log("Token stored in cache for 10 minutes");
    if (isUsingTestDomain) {
      console.log("\n⚠️  Using Resend test domain (onboarding@resend.dev)");
      console.log("To send real emails:");
      console.log("1. Verify a domain at https://resend.com/domains");
      console.log("2. Update EMAIL_FROM in .env to use your domain");
    }
    console.log("======================================\n");

    // Still return success so the flow continues
    return {
      success: true,
      token,
      message: "Magic link generated (check server console)",
      magicLink // Include link for testing
    };
  }

  // If whitelisted, log that we're sending a real email
  if (isWhitelisted) {
    console.log(`\n🔥 WHITELISTED EMAIL - Sending real email to: ${email}`);
  }

  const validatedEmailFrom = validateEmailFrom(process.env.EMAIL_FROM);
  console.log('[email.ts] Using EMAIL_FROM:', validatedEmailFrom);

  const emailData = {
    from: validatedEmailFrom,
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
      // Enhanced error logging for production debugging
      console.error("========================================");
      console.error("RESEND API ERROR - MAGIC LINK");
      console.error("========================================");
      console.error("Error Type:", typeof error);
      console.error("Error Object:", JSON.stringify(error, null, 2));
      console.error("Error Properties:", Object.keys(error || {}));

      // Log specific error properties that Resend might return
      if (typeof error === 'object' && error !== null) {
        console.error("Error Message:", (error as any).message);
        console.error("Error Name:", (error as any).name);
        console.error("Error Code:", (error as any).code);
        console.error("Error Status:", (error as any).statusCode || (error as any).status);
      }

      console.error("Email Configuration:");
      console.error("  From:", emailData.from);
      console.error("  To:", emailData.to);
      console.error("  API Key Exists:", !!process.env.RESEND_API_KEY);
      console.error("  API Key Prefix:", process.env.RESEND_API_KEY?.substring(0, 10) + "...");
      console.error("  Environment:", process.env.NODE_ENV);
      console.error("========================================");

      return {
        success: false,
        error: typeof error === 'string' ? error : JSON.stringify(error),
        errorDetails: error
      };
    }

    console.log("Magic link sent via Resend:", data?.id);
    return { success: true, token };
  } catch (error: any) {
    console.error("========================================");
    console.error("EXCEPTION CAUGHT - MAGIC LINK EMAIL");
    console.error("========================================");
    console.error("Exception Type:", typeof error);
    console.error("Exception Constructor:", error?.constructor?.name);
    console.error("Exception Message:", error?.message);
    console.error("Exception Name:", error?.name);
    console.error("Exception Code:", error?.code);
    console.error("Exception Stack:", error?.stack);
    console.error("Full Exception Object:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    console.error("========================================");
    return {
      success: false,
      error: error?.message || String(error),
      exceptionType: error?.constructor?.name,
      exceptionCode: error?.code
    };
  }
};

// Send verification code email (fallback)
export const sendVerificationCodeEmail = async (email: string) => {
  const code = generateVerificationCode();

  // Store code in Redis with 10-minute expiry
  try {
    await verificationCache.set(email, code, 600);
  } catch (redisError) {
    console.warn("Redis cache failed (verification code will still be logged):", redisError);
    // Continue without Redis - in dev mode the code is logged to console
  }

  // Check if Resend is configured
  const isEmailConfigured = process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== "re_YOUR_API_KEY";

  // Whitelist for production email testing
  const WHITELISTED_EMAILS = ['345287@gmail.com'];
  const isWhitelisted = WHITELISTED_EMAILS.includes(email.toLowerCase());

  const isUsingTestDomain = process.env.EMAIL_FROM?.includes("resend.dev");
  const isDevelopment = process.env.NODE_ENV === "development";

  const shouldBypassEmail = !isEmailConfigured ||
                           (isUsingTestDomain && !isWhitelisted) ||
                           (isDevelopment && !isWhitelisted);

  if (shouldBypassEmail) {
    console.log("\n======================================");
    console.log("VERIFICATION CODE (Development Mode)");
    console.log("======================================");
    console.log(`Email: ${email}`);
    console.log(`Code: ${code}`);
    console.log("Code stored in cache for 10 minutes");
    if (isUsingTestDomain) {
      console.log("\n⚠️  Using Resend test domain - real emails disabled");
    }
    console.log("======================================\n");
    return { success: true, code };
  }

  // If whitelisted, log that we're sending a real email
  if (isWhitelisted) {
    console.log(`\n🔥 WHITELISTED EMAIL - Sending real verification code to: ${email}`);
  }

  const validatedEmailFrom = validateEmailFrom(process.env.EMAIL_FROM);

  const emailData = {
    from: validatedEmailFrom,
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
      console.error("Resend error (verification code):", JSON.stringify(error, null, 2));
      console.error("Email data attempted:", {
        from: emailData.from,
        to: emailData.to,
        hasApiKey: !!process.env.RESEND_API_KEY
      });
      return {
        success: false,
        error: typeof error === 'string' ? error : JSON.stringify(error)
      };
    }

    console.log("Verification code sent via Resend:", data?.id);
    return { success: true, code };
  } catch (error: any) {
    console.error("Error sending verification code:", error);
    console.error("Error details:", {
      message: error?.message,
      name: error?.name,
      stack: error?.stack
    });
    return {
      success: false,
      error: error?.message || String(error)
    };
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

  const validatedEmailFrom = validateEmailFrom(process.env.EMAIL_FROM);

  const emailData = {
    from: validatedEmailFrom,
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