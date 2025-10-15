# Environment Variables Guide

## Email Configuration (Resend)

### Development vs Production

| Environment | Variable | Value | Status |
|-------------|----------|-------|--------|
| **Development** | `EMAIL_FROM` | `onboarding@resend.dev` | Limited to whitelisted emails only |
| **Production** | `EMAIL_FROM` | `noreply@pipguru.club` | Requires domain verification ✅ |

### Required Variables

```env
# Resend API Configuration
RESEND_API_KEY=re_xxxxxxxxxxxx           # Your Resend API key
EMAIL_FROM=noreply@pipguru.club          # Must match verified domain

# Application URLs
NEXT_PUBLIC_APP_URL=https://your-app.railway.app  # Your production URL
```

## Railway Deployment Setup

### Step 1: Access Environment Variables

1. Go to [Railway Dashboard](https://railway.app/)
2. Select your project
3. Click on your service (usually named after your app)
4. Navigate to **Variables** tab

### Step 2: Current Configuration (Development)

```env
EMAIL_FROM=onboarding@resend.dev
```

**Limitations:**
- Only works with whitelisted email addresses
- Cannot send to real users
- Shows "via resend.dev" in email clients
- Not suitable for production

### Step 3: Production Configuration

After domain verification is complete:

```env
EMAIL_FROM=noreply@pipguru.club
```

**Benefits:**
- Send to any email address
- Professional sender address
- No "via" warnings
- Better email deliverability

### Step 4: Alternative Sender Addresses

Choose based on your use case:

```env
# Generic no-reply (recommended for automated emails)
EMAIL_FROM=noreply@pipguru.club

# Team communications
EMAIL_FROM=team@pipguru.club

# Trading signals
EMAIL_FROM=signals@pipguru.club

# Support emails
EMAIL_FROM=support@pipguru.club

# Marketing/notifications
EMAIL_FROM=hello@pipguru.club
```

## Other Email-Related Variables (Optional)

### Reply-To Address
If you want users to reply to a different address:

```env
EMAIL_REPLY_TO=support@pipguru.club
```

### Email Service Configuration
```env
# Resend Configuration
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_AUDIENCE_ID=aud_xxxxxxxxxxxx      # For newsletter subscriptions

# Email Rate Limiting (optional)
EMAIL_RATE_LIMIT_PER_HOUR=100
EMAIL_RATE_LIMIT_PER_DAY=1000
```

## Current Email Implementation

### File: `src/lib/email.ts`

Current usage in your codebase:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDrillAccessEmail(email: string, accessLink: string) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',  // ← This needs update
    to: email,
    subject: 'Your Drill Access Link',
    html: `<p>Click here to access: <a href="${accessLink}">${accessLink}</a></p>`
  });
}
```

### File: `src/app/api/auth/drill-access/route.ts`

Current endpoint that sends emails:

```typescript
// POST /api/auth/drill-access
// Sends access link via email
```

## How to Update Variables in Railway

### Method 1: Railway Dashboard (Recommended)

1. **Navigate**: Railway Dashboard → Your Project → Service → Variables
2. **Find Variable**: Locate `EMAIL_FROM`
3. **Edit**: Click on the variable to edit
4. **Update**: Change value to `noreply@pipguru.club`
5. **Save**: Railway automatically redeploys

### Method 2: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Set variable
railway variables set EMAIL_FROM=noreply@pipguru.club

# Verify
railway variables
```

### Method 3: Environment File (Local Development)

Create `.env.local` in your project root:

```env
# Local development
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=onboarding@resend.dev  # For local testing

# Or test with verified domain
EMAIL_FROM=noreply@pipguru.club
```

**Important**: Never commit `.env.local` to git (already in `.gitignore`)

## Verification Checklist

After updating variables:

- [ ] Domain verified in Resend dashboard (shows ✅ Verified)
- [ ] `EMAIL_FROM` updated to `noreply@pipguru.club` in Railway
- [ ] Application redeployed (automatic in Railway)
- [ ] Test email sent successfully
- [ ] Email received from correct domain
- [ ] No "via resend.dev" warning in email client
- [ ] Email not in spam folder

## Testing Email Configuration

### Test Script

Create a test file to verify email sending:

```typescript
// test-email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: 'your-test-email@gmail.com',
      subject: 'Test Email from pipguru.club',
      html: '<p>This is a test email. If you receive this, email configuration is working!</p>'
    });

    console.log('✅ Email sent successfully!');
    console.log('Email ID:', data.id);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

testEmail();
```

Run test:
```bash
npx tsx test-email.ts
```

### Test via API Endpoint

```bash
# Test drill access endpoint
curl -X POST https://your-app.railway.app/api/auth/drill-access \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-test-email@gmail.com"
  }'

# Check response
# Should return: {"success": true, "message": "Access link sent"}
```

## Common Issues

### Issue: "Domain not verified"
**Solution**: Complete DNS verification in Resend dashboard first

### Issue: "Invalid from address"
**Solution**: Ensure EMAIL_FROM uses verified domain (@pipguru.club)

### Issue: Variable updated but still using old value
**Solution**: Railway should auto-redeploy; manually trigger if needed

### Issue: Email not received
**Solutions**:
- Check spam folder
- Verify Resend API key is correct
- Check Railway logs for errors
- Confirm domain is verified

## Security Best Practices

1. **Never commit API keys**: Use environment variables only
2. **Rotate keys regularly**: Generate new Resend API key every 90 days
3. **Use different keys**: Separate keys for development and production
4. **Monitor usage**: Check Resend dashboard for unusual activity
5. **Rate limiting**: Implement email rate limiting to prevent abuse

## Monitoring Email Delivery

### Resend Dashboard Metrics

Track in [Resend Dashboard](https://resend.com/emails):
- Total emails sent
- Delivery rate
- Bounce rate
- Spam complaints
- Open rate (if tracking enabled)

### Railway Logs

Monitor email sending:
```bash
# View logs
railway logs

# Filter for email-related logs
railway logs | grep -i "email"
```

## Next Steps After Configuration

1. ✅ Verify domain in Resend (DNS records)
2. ✅ Update EMAIL_FROM variable in Railway
3. ✅ Wait for automatic redeployment
4. ✅ Send test email
5. ✅ Monitor delivery in Resend dashboard
6. ✅ Update email templates if needed
7. ✅ Set up email analytics (optional)
8. ✅ Implement reply-to addresses (optional)

## Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Resend Domain Verification](https://resend.com/docs/dashboard/domains/introduction)
- [Email Best Practices](https://resend.com/docs/send-with-resend)

---

**Quick Command Reference:**

```bash
# Railway CLI
railway login
railway link
railway variables
railway variables set EMAIL_FROM=noreply@pipguru.club
railway logs

# Local testing
npm run dev  # Port 5000
```
