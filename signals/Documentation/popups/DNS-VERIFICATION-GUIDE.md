# DNS Verification Guide for Resend Email (pipguru.club)

## Current Status
- **Domain**: pipguru.club
- **Verification Status**: Not Started ❌
- **Current Email**: onboarding@resend.dev (development only)
- **Target Email**: noreply@pipguru.club (production)

## Step 1: Get DNS Records from Resend

1. Log in to your [Resend Dashboard](https://resend.com/domains)
2. Find your domain: **pipguru.club**
3. Click on the domain to view required DNS records
4. You should see 3 types of records to add:
   - **SPF Record** (TXT)
   - **DKIM Record** (TXT)
   - **MX Record** (optional, for receiving emails)

The records will look something like this:

```
Type: TXT
Name: @ (or your domain)
Value: v=spf1 include:amazonses.com ~all

Type: TXT
Name: resend._domainkey
Value: [long string provided by Resend]

Type: MX (optional)
Name: @
Priority: 10
Value: feedback-smtp.us-east-1.amazonses.com
```

## Step 2: Add DNS Records to Your Domain Provider

### Find Your Domain Provider
Your domain `pipguru.club` is registered with one of these providers:
- GoDaddy
- Namecheap
- Cloudflare
- Google Domains
- Other registrar

### Adding Records (Generic Instructions)

1. Log in to your domain registrar's control panel
2. Navigate to DNS Management / DNS Settings
3. Add each record provided by Resend:

#### For SPF Record:
- **Type**: TXT
- **Host/Name**: @ (or leave blank for root domain)
- **Value**: Copy from Resend dashboard
- **TTL**: 3600 (or default)

#### For DKIM Record:
- **Type**: TXT
- **Host/Name**: resend._domainkey
- **Value**: Copy from Resend dashboard
- **TTL**: 3600 (or default)

#### For MX Record (Optional):
- **Type**: MX
- **Host/Name**: @
- **Priority**: 10
- **Value**: Copy from Resend dashboard
- **TTL**: 3600 (or default)

### Provider-Specific Instructions

<details>
<summary><b>Cloudflare</b></summary>

1. Go to Cloudflare Dashboard
2. Select your domain (pipguru.club)
3. Click "DNS" in the left sidebar
4. Click "Add record"
5. For each record:
   - Select type (TXT or MX)
   - Enter Name (@ or resend._domainkey)
   - Enter Content/Value
   - Proxy status: DNS only (gray cloud) ⚠️ Important!
   - Click Save
</details>

<details>
<summary><b>GoDaddy</b></summary>

1. Log in to GoDaddy
2. Go to "My Products"
3. Find pipguru.club and click "DNS"
4. Click "Add" to add new records
5. Select type and enter details
6. Click Save
</details>

<details>
<summary><b>Namecheap</b></summary>

1. Log in to Namecheap
2. Go to Domain List
3. Click "Manage" next to pipguru.club
4. Go to "Advanced DNS" tab
5. Click "Add New Record"
6. Enter record details
7. Click green checkmark to save
</details>

## Step 3: Wait for DNS Propagation

- **Typical Time**: 5-30 minutes
- **Maximum Time**: Up to 48 hours (rare)
- **Check Status**: Return to Resend dashboard to see verification status

You can check DNS propagation using:
- [DNS Checker](https://dnschecker.org/)
- Command line: `dig TXT pipguru.club` or `nslookup -type=TXT pipguru.club`

## Step 4: Update Environment Variables

Once domain is verified (status shows ✅ Verified), update your Railway environment variables:

### Current Configuration
```env
EMAIL_FROM=onboarding@resend.dev  # Development only
```

### New Configuration
```env
EMAIL_FROM=noreply@pipguru.club   # Production ready
```

Or choose a different sender name:
```env
EMAIL_FROM=signals@pipguru.club
EMAIL_FROM=team@pipguru.club
EMAIL_FROM=support@pipguru.club
```

### How to Update in Railway

1. Go to [Railway Dashboard](https://railway.app/)
2. Select your project
3. Click on your service
4. Go to "Variables" tab
5. Find `EMAIL_FROM` variable
6. Update value to: `noreply@pipguru.club`
7. Click "Save" - this will trigger automatic redeployment

## Step 5: Test Email Sending

After domain verification and variable update:

### Test with Existing Endpoint
```bash
# Test drill access email
curl -X POST https://your-app.railway.app/api/auth/drill-access \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-test-email@gmail.com"
  }'
```

### Check for Success
- Email should arrive from noreply@pipguru.club
- Check spam folder if not in inbox
- Verify sender shows "pipguru.club" not "resend.dev"

## Troubleshooting

### Issue: Verification Stuck at "Not Started"
**Solution**: DNS records not added yet or DNS not propagated
- Double-check all records are added correctly
- Wait 30 minutes and check again
- Use DNS checker tools to verify propagation

### Issue: Verification Shows "Failed"
**Solution**: Incorrect DNS records
- Verify exact values match Resend dashboard
- Check for extra spaces or characters
- Ensure TXT record quotes are correct

### Issue: Domain Verified but Emails Not Sending
**Solution**: Environment variable not updated or app not redeployed
- Confirm EMAIL_FROM uses @pipguru.club
- Check Railway deployment logs
- Manually trigger redeploy if needed

### Issue: Emails Going to Spam
**Solution**: Domain is new, needs reputation building
- Add DMARC record (optional but recommended)
- Send low volume initially
- Ask recipients to mark as "Not Spam"
- Consider adding custom domain to Resend's dedicated IP pool

## Optional: Add DMARC Record (Recommended)

DMARC helps with email deliverability:

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@pipguru.club
```

This tells email providers how to handle unauthenticated emails from your domain.

## Quick Reference Checklist

- [ ] Log in to Resend dashboard
- [ ] Copy SPF record value
- [ ] Copy DKIM record value
- [ ] Log in to domain registrar
- [ ] Add SPF TXT record
- [ ] Add DKIM TXT record
- [ ] Add MX record (optional)
- [ ] Wait for DNS propagation (5-30 min)
- [ ] Check verification status in Resend
- [ ] Update EMAIL_FROM in Railway to noreply@pipguru.club
- [ ] Redeploy application
- [ ] Send test email
- [ ] Verify email received with correct sender

## Need Help?

If you encounter issues:

1. **Check Resend Status**: Verification status should show "Verified" ✅
2. **Check Railway Logs**: Look for email-related errors
3. **Check DNS Records**: Use `dig TXT pipguru.club` to verify
4. **Contact Resend Support**: They can verify DNS records on their end

## Resources

- [Resend Domain Verification Docs](https://resend.com/docs/dashboard/domains/introduction)
- [DNS Propagation Checker](https://dnschecker.org/)
- [Resend Dashboard](https://resend.com/domains)
- [Railway Dashboard](https://railway.app/)

---

**Next Steps After Verification:**
1. Test email with real address
2. Update any email templates if needed
3. Monitor delivery rates in Resend dashboard
4. Consider setting up email analytics
