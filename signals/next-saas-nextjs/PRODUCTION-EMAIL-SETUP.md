# Production Email Setup Guide

## ⚠️ Common Production Error

If you see this error in production:

```json
{
  "statusCode": 422,
  "name": "validation_error",
  "message": "Invalid `from` field. The email address needs to follow the `email@example.com` or `Name <email@example.com>` format."
}
```

This means your `EMAIL_FROM` environment variable is **malformed** in production.

---

## ✅ Correct EMAIL_FROM Format

### Option 1: Name + Email (Recommended)
```bash
EMAIL_FROM="Signals <noreply@pipguru.club>"
```

### Option 2: Email Only
```bash
EMAIL_FROM="noreply@pipguru.club"
```

### ❌ WRONG Formats (Will Fail)

```bash
# Double quotes
EMAIL_FROM=""Signals <noreply@pipguru.club>""  ❌

# Escaped characters
EMAIL_FROM="Signals \<noreply@pipguru.club\>"  ❌

# No quotes around name with spaces
EMAIL_FROM=Signals <noreply@pipguru.club>  ❌

# Empty or undefined
EMAIL_FROM=""  ❌
```

---

## 🚀 Platform-Specific Setup

### Vercel

1. **Go to:** Project Settings → Environment Variables
2. **Add:**
   ```
   Key: EMAIL_FROM
   Value: Signals <noreply@pipguru.club>
   ```
3. **Important:** Do NOT add extra quotes in Vercel UI
4. **Redeploy** your application

### Netlify

1. **Go to:** Site Settings → Environment Variables
2. **Add:**
   ```
   Key: EMAIL_FROM
   Value: Signals <noreply@pipguru.club>
   ```
3. **Deploy** again

### Railway

1. **Go to:** Project → Variables
2. **Add:**
   ```
   EMAIL_FROM=Signals <noreply@pipguru.club>
   ```
3. **Redeploy**

### Docker / Docker Compose

```yaml
# docker-compose.yml
environment:
  - EMAIL_FROM=Signals <noreply@pipguru.club>
  # Or use quotes:
  - EMAIL_FROM="Signals <noreply@pipguru.club>"
```

### AWS / EC2 / Elastic Beanstalk

```bash
# .env file
EMAIL_FROM="Signals <noreply@pipguru.club>"
```

---

## 📋 Production Checklist

### Step 1: Verify Domain with Resend

1. Go to [Resend Domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain: `pipguru.club`
4. Add DNS records they provide:
   ```
   Type: TXT
   Name: resend._domainkey
   Value: [provided by Resend]

   Type: TXT
   Name: @
   Value: [provided by Resend]
   ```
5. Wait for verification (usually 5-30 minutes)

### Step 2: Update Environment Variables

```bash
# Production environment (.env.production or hosting platform)
EMAIL_FROM="Signals <noreply@pipguru.club>"
RESEND_API_KEY="re_YOUR_PRODUCTION_API_KEY"
NODE_ENV="production"
```

### Step 3: Test Email Sending

```bash
# Run manual test
node test-whitelisted-email.js

# Or use curl
curl -X POST https://www.pipguru.club/api/auth/drill-access \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your@email.com",
    "action": "send-magic-link",
    "source": "test"
  }'
```

### Step 4: Check Logs

Look for this line in your production logs:
```
[email.ts] Using EMAIL_FROM: Signals <noreply@pipguru.club>
```

If you see:
```
[email.ts] Invalid EMAIL_FROM format: ...
[email.ts] Using fallback email address
```

Your `EMAIL_FROM` is still malformed.

---

## 🔧 Validation Added

The code now includes automatic validation that:

1. **Removes extra quotes:**
   ```typescript
   ""Signals <email@domain.com>"" → "Signals <email@domain.com>"
   ```

2. **Removes escaped characters:**
   ```typescript
   "Signals \<email@domain.com\>" → "Signals <email@domain.com>"
   ```

3. **Validates format:**
   - ✅ `"Signals <email@domain.com>"`
   - ✅ `"email@domain.com"`
   - ❌ `"Signals < email@domain.com>"` (space in brackets)
   - ❌ `"@domain.com"` (missing local part)

4. **Falls back safely:**
   - If validation fails → uses default: `"Signals <onboarding@resend.dev>"`
   - Logs error to console for debugging

---

## 🐛 Debugging Production Issues

### Check Environment Variable

```javascript
// Add this temporarily to your API route
console.log('Raw EMAIL_FROM:', process.env.EMAIL_FROM);
console.log('EMAIL_FROM type:', typeof process.env.EMAIL_FROM);
console.log('EMAIL_FROM length:', process.env.EMAIL_FROM?.length);
```

### Common Issues

| Issue | Symptom | Fix |
|-------|---------|-----|
| Extra quotes | `""Signals <...>""` | Remove outer quotes in hosting platform |
| Escaped brackets | `Signals \<...\>` | Don't escape in env variables |
| Missing value | `undefined` | Set EMAIL_FROM in hosting platform |
| Wrong domain | Using `resend.dev` | Update to your verified domain |

### Test in Production

1. **Submit email** on your live site
2. **Check browser console** for response
3. **Check server logs** for validation messages
4. **Check Resend dashboard** for email delivery status

---

## 📧 Email Providers Comparison

### Resend (Current)
- ✅ 100 emails/day free
- ✅ Simple API
- ❌ Requires domain verification for production
- ❌ Test domain has limitations

### SendGrid
- ✅ 100 emails/day free
- ✅ No domain verification required (initially)
- ❌ More complex API
- ❌ Stricter spam policies

### Postmark
- ✅ Professional email service
- ✅ Great deliverability
- ❌ No free tier (paid only)
- ❌ More expensive

### Gmail SMTP
- ✅ Free with Gmail account
- ✅ Easy to set up
- ❌ 500 emails/day limit
- ❌ Requires app-specific password
- ❌ Not recommended for production

---

## 🎯 Recommended Production Setup

```bash
# 1. Verify domain at Resend
# Domain: pipguru.club

# 2. Set environment variables
EMAIL_FROM="Signals <noreply@pipguru.club>"
RESEND_API_KEY="re_YOUR_PRODUCTION_KEY"
NODE_ENV="production"

# 3. Deploy

# 4. Test with real email
curl -X POST https://www.pipguru.club/api/auth/drill-access \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","action":"send-magic-link"}'

# 5. Check inbox (including spam folder)
```

---

## 🔍 Quick Troubleshooting

### Email not arriving?

1. **Check Resend Dashboard:**
   - Go to [resend.com/emails](https://resend.com/emails)
   - Look for your email
   - Check delivery status

2. **Check Domain Verification:**
   - Go to [resend.com/domains](https://resend.com/domains)
   - Ensure `pipguru.club` shows "Verified"

3. **Check DNS Records:**
   ```bash
   # Check TXT records
   dig TXT resend._domainkey.pipguru.club
   dig TXT pipguru.club
   ```

4. **Check Server Logs:**
   ```
   [email.ts] Using EMAIL_FROM: ...
   🔥 WHITELISTED EMAIL - Sending real email to: ...
   Magic link sent via Resend: em_xxx
   ```

5. **Test EMAIL_FROM validation:**
   ```bash
   # In production logs, you should see:
   [email.ts] Using EMAIL_FROM: Signals <noreply@pipguru.club>

   # NOT this:
   [email.ts] Invalid EMAIL_FROM format
   [email.ts] Using fallback email address
   ```

---

## 📝 Summary

### Before Deploying:
- [x] Verify domain at resend.com/domains
- [x] Set EMAIL_FROM correctly in hosting platform
- [x] Set RESEND_API_KEY (production key)
- [x] Set NODE_ENV="production"
- [x] Test locally first

### After Deploying:
- [x] Check deployment logs for EMAIL_FROM validation
- [x] Test email sending with real address
- [x] Check Resend dashboard for delivery
- [x] Monitor error logs

### If Issues:
- [x] Check exact EMAIL_FROM value in hosting platform
- [x] Ensure no extra quotes or escaped characters
- [x] Verify domain is verified at Resend
- [x] Check Resend dashboard for API errors
- [x] Review server logs for validation messages

---

**Need Help?**
- Resend Docs: https://resend.com/docs
- Resend Support: https://resend.com/support
- Check server logs for detailed error messages

**Last Updated:** 2025-10-23
