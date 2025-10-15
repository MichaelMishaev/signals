# Email Testing Checklist

## Pre-Verification Testing (Development)

### Current Status
- Using: `onboarding@resend.dev`
- Limitation: Whitelist-only
- Purpose: Testing during development

### Development Testing Steps

- [ ] **Whitelist Test Email**
  - Go to Resend Dashboard → Domains → resend.dev
  - Add your test email to whitelist
  - Save changes

- [ ] **Test Email Sending**
  ```bash
  curl -X POST http://localhost:5000/api/auth/drill-access \
    -H "Content-Type: application/json" \
    -d '{"email": "your-whitelisted-email@gmail.com"}'
  ```

- [ ] **Verify Email Received**
  - Check inbox for email
  - Verify subject line
  - Check sender shows "onboarding@resend.dev"
  - Test link functionality

- [ ] **Check Railway Logs**
  ```bash
  railway logs | grep -i "email"
  ```

---

## DNS Verification Checklist

### Step 1: Resend Dashboard Setup

- [ ] **Access Resend Domain Settings**
  - Go to [Resend Dashboard](https://resend.com/domains)
  - Locate `pipguru.club` domain
  - Note current status (should be "Not Started")

- [ ] **Copy DNS Records**
  - [ ] Copy SPF record (TXT)
  - [ ] Copy DKIM record (TXT)
  - [ ] Copy MX record (optional)
  - Take screenshot for reference

### Step 2: DNS Configuration

- [ ] **Identify Domain Provider**
  - Determine where pipguru.club is registered
  - Log in to domain provider dashboard

- [ ] **Add SPF Record**
  - Type: TXT
  - Name: @ (or root domain)
  - Value: [from Resend dashboard]
  - TTL: 3600
  - Save

- [ ] **Add DKIM Record**
  - Type: TXT
  - Name: resend._domainkey
  - Value: [from Resend dashboard]
  - TTL: 3600
  - Save

- [ ] **Add MX Record (Optional)**
  - Type: MX
  - Name: @
  - Priority: 10
  - Value: [from Resend dashboard]
  - TTL: 3600
  - Save

### Step 3: Verify DNS Propagation

- [ ] **Wait Initial Period**
  - Wait at least 5-10 minutes
  - DNS changes take time to propagate

- [ ] **Check DNS Records via Command Line**
  ```bash
  # Check SPF record
  dig TXT pipguru.club

  # Check DKIM record
  dig TXT resend._domainkey.pipguru.club

  # Alternative with nslookup
  nslookup -type=TXT pipguru.club
  nslookup -type=TXT resend._domainkey.pipguru.club
  ```

- [ ] **Use Online DNS Checker**
  - Go to [dnschecker.org](https://dnschecker.org/)
  - Search: `pipguru.club` (TXT record)
  - Search: `resend._domainkey.pipguru.club` (TXT record)
  - Verify records appear globally

- [ ] **Check Resend Verification Status**
  - Return to Resend Dashboard
  - Click "Verify" button
  - Status should change from "Not Started" to "Verified" ✅
  - If still pending, wait longer (up to 30 minutes)

---

## Post-Verification Configuration

### Step 4: Update Environment Variables

- [ ] **Access Railway Dashboard**
  - Go to [Railway Dashboard](https://railway.app/)
  - Select your project
  - Click on service
  - Navigate to "Variables" tab

- [ ] **Update EMAIL_FROM Variable**
  - Find `EMAIL_FROM` variable
  - Current value: `onboarding@resend.dev`
  - New value: `noreply@pipguru.club`
  - Click Save

- [ ] **Verify Automatic Redeployment**
  - Railway should trigger automatic redeploy
  - Check "Deployments" tab
  - Wait for deployment to complete
  - Verify build succeeds

- [ ] **Check Deployment Logs**
  ```bash
  railway logs
  # Look for successful startup
  # No email-related errors
  ```

---

## Production Email Testing

### Step 5: Functional Testing

- [ ] **Test Email to Gmail**
  ```bash
  curl -X POST https://your-app.railway.app/api/auth/drill-access \
    -H "Content-Type: application/json" \
    -d '{"email": "test@gmail.com"}'
  ```

  **Verify:**
  - [ ] Email received in inbox (not spam)
  - [ ] Sender shows: noreply@pipguru.club
  - [ ] No "via resend.dev" warning
  - [ ] Subject line correct
  - [ ] Link works properly
  - [ ] Branding looks professional

- [ ] **Test Email to Outlook/Hotmail**
  ```bash
  curl -X POST https://your-app.railway.app/api/auth/drill-access \
    -H "Content-Type: application/json" \
    -d '{"email": "test@outlook.com"}'
  ```

  **Verify:**
  - [ ] Email received
  - [ ] Not marked as spam
  - [ ] Sender authentication passes

- [ ] **Test Email to Yahoo**
  ```bash
  curl -X POST https://your-app.railway.app/api/auth/drill-access \
    -H "Content-Type: application/json" \
    -d '{"email": "test@yahoo.com"}'
  ```

  **Verify:**
  - [ ] Email received
  - [ ] Deliverability good

- [ ] **Test Email to Custom Domain**
  ```bash
  curl -X POST https://your-app.railway.app/api/auth/drill-access \
    -H "Content-Type: application/json" \
    -d '{"email": "test@yourdomain.com"}'
  ```

### Step 6: Deliverability Testing

- [ ] **Check Email Headers**
  - Open email in Gmail
  - Click three dots → Show original
  - Verify SPF: PASS
  - Verify DKIM: PASS
  - Verify DMARC: PASS (if configured)

- [ ] **Spam Score Testing**
  - Send test email to: `check-auth@verifier.port25.com`
  - Wait for automated reply
  - Review spam score and authentication results
  - Score should be low (closer to 0 is better)

- [ ] **Check Resend Dashboard**
  - Go to [Resend Emails](https://resend.com/emails)
  - View sent emails list
  - Check delivery status (should be "Delivered")
  - No bounce or spam complaints

### Step 7: Edge Case Testing

- [ ] **Test Invalid Email**
  ```bash
  curl -X POST https://your-app.railway.app/api/auth/drill-access \
    -H "Content-Type: application/json" \
    -d '{"email": "invalid-email"}'
  ```

  **Expected:** Error message, no email sent

- [ ] **Test Nonexistent Email**
  ```bash
  curl -X POST https://your-app.railway.app/api/auth/drill-access \
    -H "Content-Type: application/json" \
    -d '{"email": "nonexistent@fakesadfjkl.com"}'
  ```

  **Expected:**
  - API returns success (email system accepts)
  - Resend dashboard shows "Bounced" status

- [ ] **Test Rate Limiting** (if implemented)
  - Send 5+ emails rapidly
  - Verify rate limiting kicks in
  - Check appropriate error message

- [ ] **Test Multiple Recipients** (if supported)
  - Send to multiple emails
  - Verify all receive emails

---

## Monitoring & Analytics Setup

### Step 8: Set Up Monitoring

- [ ] **Enable Resend Webhooks** (optional)
  - Go to Resend Dashboard → Webhooks
  - Add webhook URL: `https://your-app.railway.app/api/webhooks/resend`
  - Subscribe to events:
    - email.sent
    - email.delivered
    - email.bounced
    - email.complained

- [ ] **Set Up Email Analytics**
  - Track emails sent per day
  - Monitor bounce rates
  - Track delivery rates
  - Set up alerts for high bounce rates

- [ ] **Create Dashboard in Railway**
  - Monitor email-related API calls
  - Track response times
  - Set up error alerts

### Step 9: Performance Testing

- [ ] **Measure Email Send Time**
  ```bash
  # Time the request
  time curl -X POST https://your-app.railway.app/api/auth/drill-access \
    -H "Content-Type: application/json" \
    -d '{"email": "test@gmail.com"}'
  ```

  **Expected:** < 2 seconds response time

- [ ] **Test Concurrent Requests**
  - Send 10 emails simultaneously
  - Verify all are processed
  - No rate limit errors
  - Check Resend dashboard for all deliveries

- [ ] **Load Testing** (if needed)
  ```bash
  # Using Apache Bench
  ab -n 100 -c 10 -p data.json -T "application/json" \
    https://your-app.railway.app/api/auth/drill-access
  ```

---

## Troubleshooting Checklist

### Common Issues

- [ ] **Emails Going to Spam**
  - **Check:** SPF, DKIM, DMARC records
  - **Solution:** Ensure all DNS records correct
  - **Action:** Ask recipients to mark as "Not Spam"
  - **Long-term:** Build domain reputation

- [ ] **"Domain not verified" Error**
  - **Check:** Resend dashboard verification status
  - **Solution:** Complete DNS verification first
  - **Action:** Wait for DNS propagation

- [ ] **"Invalid from address" Error**
  - **Check:** EMAIL_FROM variable value
  - **Solution:** Must use @pipguru.club domain
  - **Action:** Update Railway environment variable

- [ ] **Email Not Received**
  - **Check:** Spam folder
  - **Check:** Resend dashboard delivery status
  - **Check:** Railway logs for errors
  - **Solution:** Verify domain, check API key

- [ ] **Slow Email Delivery**
  - **Check:** Resend API response time
  - **Check:** Railway server location
  - **Solution:** May be normal (1-30 seconds)

---

## Production Readiness Checklist

### Final Verification

- [ ] **Domain Verification**
  - ✅ Domain shows "Verified" in Resend
  - ✅ All DNS records propagated globally
  - ✅ No verification warnings

- [ ] **Configuration**
  - ✅ EMAIL_FROM = noreply@pipguru.club
  - ✅ RESEND_API_KEY is production key
  - ✅ Environment variables set in Railway
  - ✅ Application deployed successfully

- [ ] **Testing Complete**
  - ✅ Gmail delivery working
  - ✅ Outlook delivery working
  - ✅ Yahoo delivery working
  - ✅ No emails in spam
  - ✅ Authentication headers pass
  - ✅ Edge cases handled

- [ ] **Monitoring**
  - ✅ Resend dashboard accessible
  - ✅ Railway logs readable
  - ✅ Error tracking enabled
  - ✅ Analytics configured (optional)

- [ ] **Documentation**
  - ✅ DNS records documented
  - ✅ Environment variables documented
  - ✅ Testing procedures documented
  - ✅ Team knows how to check email status

---

## Quick Reference Commands

### Check DNS
```bash
dig TXT pipguru.club
dig TXT resend._domainkey.pipguru.club
```

### Test Email (Local)
```bash
curl -X POST http://localhost:5000/api/auth/drill-access \
  -H "Content-Type: application/json" \
  -d '{"email": "test@gmail.com"}'
```

### Test Email (Production)
```bash
curl -X POST https://your-app.railway.app/api/auth/drill-access \
  -H "Content-Type: application/json" \
  -d '{"email": "test@gmail.com"}'
```

### View Railway Logs
```bash
railway logs
railway logs --follow
railway logs | grep -i "email"
```

### Check Email Headers (Gmail)
1. Open email
2. Three dots → Show original
3. Review authentication results

---

## Success Criteria

Email system is production-ready when:

1. ✅ Domain verified in Resend
2. ✅ Emails sent from @pipguru.club
3. ✅ 95%+ delivery rate
4. ✅ < 5% spam placement rate
5. ✅ SPF/DKIM/DMARC passing
6. ✅ < 2s average send time
7. ✅ No "via resend.dev" warnings
8. ✅ All edge cases handled
9. ✅ Monitoring in place
10. ✅ Team trained on troubleshooting

---

## Resources

- **Resend Dashboard**: https://resend.com/domains
- **Railway Dashboard**: https://railway.app/
- **DNS Checker**: https://dnschecker.org/
- **Email Header Analyzer**: https://mxtoolbox.com/EmailHeaders.aspx
- **Spam Test**: check-auth@verifier.port25.com

---

**Next Steps:**
1. Complete DNS verification
2. Update environment variables
3. Run through this checklist
4. Launch to production
5. Monitor delivery rates
