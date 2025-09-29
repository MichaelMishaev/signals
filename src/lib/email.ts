import nodemailer from "nodemailer";
import { magicLinkCache, verificationCache } from "./redis";

// Create reusable transporter
const createTransporter = () => {
  if (process.env.NODE_ENV === "development") {
    // Use Ethereal Email for development
    return nodemailer.createTransporter({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: process.env.EMAIL_DEV_USER || "ethereal.user",
        pass: process.env.EMAIL_DEV_PASS || "ethereal.pass",
      },
    });
  }

  // Production email configuration
  return nodemailer.createTransporter({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
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
export const sendMagicLinkEmail = async (email: string, baseUrl: string) => {
  const token = generateMagicLinkToken();
  const magicLink = `${baseUrl}/api/auth/verify-magic?token=${token}`;

  // Store token in Redis with 10-minute expiry
  await magicLinkCache.set(token, email, 600);

  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || "Signals App <noreply@signals.com>",
    to: email,
    subject: "Sign in to Signals",
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
    const info = await transporter.sendMail(mailOptions);
    console.log("Magic link sent:", info.messageId);
    if (process.env.NODE_ENV === "development") {
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    }
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

  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || "Signals App <noreply@signals.com>",
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
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification code sent:", info.messageId);
    if (process.env.NODE_ENV === "development") {
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    }
    return { success: true, code };
  } catch (error) {
    console.error("Error sending verification code:", error);
    return { success: false, error };
  }
};

// Send welcome email after successful registration
export const sendWelcomeEmail = async (email: string, name?: string) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || "Signals App <noreply@signals.com>",
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
            <p>Your account has been successfully created. You can now access all drills and track your progress.</p>
            <p style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/drill" class="button">Start Learning</a>
            </p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
          </div>
        </body>
      </html>
    `,
    text: `Welcome to Signals${name ? `, ${name}` : ""}!\n\nYour account has been successfully created. You can now access all drills and track your progress.\n\nVisit ${process.env.NEXTAUTH_URL}/drill to start learning.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { success: false, error };
  }
};