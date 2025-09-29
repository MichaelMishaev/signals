# 📧 Email Verification Setup Guide

## Quick Setup (5 minutes)

### Option 1: Resend (Recommended - Easiest & Free)

1. **Sign up for Resend (FREE)**
   - Go to: https://resend.com/signup
   - Create account (no credit card needed)
   - You get 100 emails/day, 3,000/month FREE

2. **Get your API Key**
   - After signup, go to: https://resend.com/api-keys
   - Click "Create API Key"
   - Copy the key (starts with `re_`)

3. **Update .env file**
   ```env
   RESEND_API_KEY="re_YOUR_ACTUAL_API_KEY_HERE"
   EMAIL_FROM="Signals <onboarding@resend.dev>"
   ```

4. **Restart server**
   ```bash
   npm run dev
   ```

5. **Test it!**
   - Go to http://localhost:5001/drill-test
   - Enter your email
   - Check your inbox for the magic link!

---

### Option 2: Gmail with App Password (Alternative)

1. **Enable 2-Factor Authentication**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Create App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Signals App"
   - Copy the 16-character password

3. **Update .env file**
   ```env
   # Comment out Resend and use Gmail instead
   # RESEND_API_KEY="re_YOUR_API_KEY"

   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT="587"
   EMAIL_SERVER_USER="your-gmail@gmail.com"
   EMAIL_SERVER_PASSWORD="xxxx xxxx xxxx xxxx"  # App password
   EMAIL_FROM="Signals <your-gmail@gmail.com>"
   ```

4. **Update email.ts to use nodemailer**
   (Gmail setup requires switching back to nodemailer)

---

## How It Works

1. **User enters email** on any drill page
2. **Magic link is sent** to their email
3. **User clicks link** to verify
4. **Email is marked as verified** in database
5. **User gets full access** to all features

## Testing Flow

1. Navigate to any drill: http://localhost:5001/signal/6
2. Enter name and email in the modal
3. Check email inbox for verification link
4. Click the link to verify
5. You're verified! ✅

## Features Included

- ✅ Magic link authentication
- ✅ 6-digit code fallback
- ✅ Session management with Redis
- ✅ Database tracking (PostgreSQL)
- ✅ Automatic user creation
- ✅ Email verification status
- ✅ Development mode (logs to console)

## Troubleshooting

### Emails not sending?
- Check API key is correct in .env
- Make sure you restarted the server after updating .env
- Check server console for error messages

### "Email not configured" message?
- This appears when RESEND_API_KEY is not set
- The magic link will be logged to console instead
- Perfect for testing without email setup!

### Rate limits?
- Resend Free: 100 emails/day
- Gmail: 500 emails/day
- SendGrid Free: 100 emails/day

## Support Links

- Resend Docs: https://resend.com/docs
- Gmail App Passwords: https://support.google.com/mail/answer/185833
- SendGrid Setup: https://sendgrid.com/docs/for-developers/sending-email/quickstart-nodejs/

---

**Ready to go! 🚀** Just sign up for Resend and add your API key to start sending real verification emails.