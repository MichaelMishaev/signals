# How to Resend Verification Email

## For Users:

### When you see this screen:

```
🔒 Verify Your Email to Access More Drills

You've viewed your free drill. Verify your email to unlock all detailed
analysis, case studies, and premium trading insights.

ℹ️ Check your email for the magic link
```

### The resend button will appear below:

```
Didn't receive it? Check spam folder or resend below

┌─────────────────────────────────────┐
│  Resend Verification Email          │  ← Click this button
└─────────────────────────────────────┘

Sending to: your@email.com
```

### Button States:

1. **Ready to Send:**
   - Button is blue/purple gradient
   - Says "Resend Verification Email"
   - Click to send another email

2. **Sending:**
   - Button shows "Sending..."
   - Disabled during send

3. **Cooldown (60 seconds):**
   - Button shows "Resend in 45s" (counts down)
   - Disabled until countdown reaches 0

4. **Ready Again:**
   - After 60 seconds, button becomes active again
   - Can resend once more

## Technical Details:

### How It Works:

1. **Submit Email:**
   - User enters email in gate modal
   - Email submission stored in `localStorage` as `pending_email_verification`

2. **Page Refresh/Navigate:**
   - If user refreshes page or closes tab
   - On return, hook restores pending state from `localStorage`
   - Resend button automatically appears

3. **Spam Prevention:**
   - **Frontend:** 60-second cooldown per click
   - **Backend:** 3 emails per hour per email address
   - **Backend:** 10 emails per hour per IP address

### Code Flow:

```typescript
// On page load/mount
useEffect(() => {
  // Restore pending verification from localStorage
  const pendingData = localStorage.getItem('pending_email_verification');
  if (pendingData) {
    const { email, timestamp } = JSON.parse(pendingData);

    // Valid for 24 hours
    if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
      setPendingVerification(true);
      setPendingEmail(email);
      // ✅ Resend button now shows!
    }
  }
}, []);
```

### Files Modified:

1. **`/src/hooks/useGateFlow.ts`**
   - Added `restorePendingVerification()` function
   - Runs on component mount
   - Restores `pendingVerification` and `pendingEmail` from localStorage

2. **`/src/app/[locale]/signal/[id]/SignalPageClient.tsx`**
   - Resend button already implemented
   - Shows when `pendingVerification && pendingEmail` are true
   - Now these values persist across page refreshes!

### localStorage Structure:

```json
{
  "pending_email_verification": {
    "email": "user@example.com",
    "timestamp": 1729683600000
  }
}
```

- **Expiry:** 24 hours
- **Cleared When:** Email is successfully verified
- **Purpose:** Show resend button even after page refresh

## Testing:

### Test Scenario 1: Fresh Submit
1. Enter email in gate modal
2. Submit
3. ✅ Resend button appears immediately

### Test Scenario 2: Page Refresh
1. Submit email
2. Refresh browser (F5 or Cmd+R)
3. ✅ Resend button still visible
4. ✅ Email address still displayed

### Test Scenario 3: Close and Reopen
1. Submit email
2. Close browser tab
3. Return to page within 24 hours
4. ✅ Resend button visible
5. ✅ Can resend verification email

### Test Scenario 4: After 24 Hours
1. Submit email
2. Wait 24 hours (or manually change timestamp)
3. Refresh page
4. ✅ Pending verification cleared
5. ❌ Resend button not shown (expired)

## User Instructions:

### If you don't see the resend button:

1. **Check if you submitted an email:**
   - The button only appears AFTER you've submitted an email
   - If you just landed on this page without submitting, enter your email first

2. **Check browser console:**
   - Press F12 (or Cmd+Option+I on Mac)
   - Look for: `[useGateFlow] Restored pending verification: your@email.com`
   - If not present, try submitting email again

3. **Clear localStorage and retry:**
   ```javascript
   // In browser console:
   localStorage.clear();
   location.reload();
   ```
   - Then submit your email again

4. **Check expiry:**
   - Pending verification expires after 24 hours
   - If expired, just submit your email again

## For Developers:

### Add More Whitelisted Emails:

```typescript
// In src/lib/email.ts:56
const WHITELISTED_EMAILS = [
  '345287@gmail.com',
  'another@email.com',  // Add here
  'test@company.com',   // Add here
];
```

### Change Cooldown Duration:

```typescript
// In src/app/[locale]/signal/[id]/SignalPageClient.tsx:172
setResendCooldown(60);  // Change from 60 to desired seconds
```

### Change Expiry Duration:

```typescript
// In src/hooks/useGateFlow.ts:83
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;  // Change here
```

## Troubleshooting:

### Button Not Showing:

**Problem:** Resend button doesn't appear after email submission

**Solutions:**
1. Check browser console for errors
2. Verify `localStorage.getItem('pending_email_verification')` exists
3. Check if page was hard-refreshed (Cmd+Shift+R clears cache)
4. Try submitting email again

### Button Always Disabled:

**Problem:** Button shows but won't click

**Possible Causes:**
1. Still in 60-second cooldown (wait for countdown)
2. Currently sending (shows "Sending...")
3. Network error (check console)

**Solutions:**
1. Wait for cooldown to finish
2. Check network tab in DevTools
3. Try refreshing page

### Email Not Arriving:

**Problem:** Clicked resend, but no email received

**Check:**
1. Spam/junk folder
2. Email address is correct (shown below button)
3. Resend dashboard for errors
4. Server logs for: `🔥 WHITELISTED EMAIL - Sending real email to: ...`

---

**Last Updated:** 2025-10-23
**Version:** 2.0 (with localStorage persistence)
