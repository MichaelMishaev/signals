# Manual Test Guide: Cross-Browser Email Verification

## Quick Test (5 minutes)

### Prerequisites
- Dev server running: `npm run dev`
- Two different browsers (Chrome + Firefox, or Chrome + Safari)
- Test email: `345287@gmail.com` (whitelisted, no rate limits)

---

## Test Steps

### Part 1: Verify Email in Browser A (Chrome)

1. **Open Chrome**
   ```
   http://localhost:5001/en/drill-example
   ```

2. **Email gate should appear**
   - You should see email popup/gate
   - If not, open DevTools Console and check for errors

3. **Submit test email**
   - Email: `345287@gmail.com`
   - Name: `Test User`
   - Click "Get Access" or "Submit"

4. **Check server console**
   - Look for magic link in terminal output
   - Should see something like:
   ```
   ======================================
   MAGIC LINK GENERATED
   ======================================
   Email: 345287@gmail.com
   Magic Link: http://localhost:5001/api/auth/verify-magic?token=...
   ```

5. **Copy magic link and paste in Chrome URL bar**
   - Should redirect back to drill page
   - Should see drill content (not email gate)

6. **Verify in DevTools**
   - Open Chrome DevTools → Application → Cookies
   - Should see cookie: `email_verified = 345287@gmail.com`
   - Open Console →type:
     ```javascript
     localStorage.getItem('emailGate')
     ```
   - Should show: `{"email":"345287@gmail.com","verified":true,...}`

✅ **Part 1 Complete**: Email verified in Chrome

---

### Part 2: Test Cross-Browser Access in Browser B (Firefox)

1. **Open Firefox** (fresh browser, no cookies)
   ```
   http://localhost:5001/en/drill-example
   ```

2. **Email gate should appear**
   - Expected behavior: gate appears (no cookies in Firefox yet)

3. **Submit SAME email**
   - Email: `345287@gmail.com` (exact same email as Chrome)
   - Name: `Test User`
   - Click "Get Access" or "Submit"

4. **⭐ KEY MOMENT: Watch what happens**

   **OLD BEHAVIOR (would be bad):**
   - ❌ Shows "Check Your Email" screen
   - ❌ Requires clicking magic link again

   **NEW BEHAVIOR (should happen):**
   - ✅ Email gate closes immediately
   - ✅ Drill content appears
   - ✅ No "Check Your Email" screen
   - ✅ No magic link needed!

5. **Verify in Firefox DevTools**
   - Open Firefox DevTools → Storage → Cookies
   - Should see cookie: `email_verified = 345287@gmail.com`
   - Console →:
     ```javascript
     localStorage.getItem('emailGate')
     ```
   - Should show: `{"email":"345287@gmail.com","source":"db_verified","verified":true,...}`
   - **Note**: `source":"db_verified"` confirms it came from database!

✅ **Part 2 Complete**: Cross-browser verification works!

---

### Part 3: Test Case-Insensitive Matching

1. **Clear Firefox storage**
   - DevTools → Storage → Clear Site Data

2. **Reload page**
   ```
   http://localhost:5001/en/drill-example
   ```

3. **Submit email with different case**
   - Email: `345287@GMAIL.COM` (uppercase)
   - Or: `345287@Gmail.com` (mixed case)
   - Name: `Test User`
   - Click "Get Access"

4. **Should still work!**
   - ✅ Should get instant access (email normalized)
   - ✅ No magic link required

✅ **Part 3 Complete**: Case-insensitive matching works!

---

### Part 4: Test Unverified Email

1. **In any browser, clear storage**
   ```javascript
   localStorage.clear();
   document.cookie.split(";").forEach(c => {
     document.cookie = c.trim().split("=")[0] +
       "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
   });
   ```

2. **Reload page**
   ```
   http://localhost:5001/en/drill-example
   ```

3. **Submit a NEW, unverified email**
   - Email: `newuser123@test.com`
   - Name: `New User`
   - Click "Get Access"

4. **Should require verification**
   - ✅ Should see "Check Your Email" screen
   - ✅ Should NOT get instant access
   - ✅ Magic link sent (normal flow)

✅ **Part 4 Complete**: Unverified emails still require magic link!

---

## Success Criteria

After completing all parts:

- [x] Part 1: Email verified in Chrome
- [x] Part 2: Same email grants instant access in Firefox (no magic link!)
- [x] Part 3: Case variations work (GMAIL, Gmail, gmail)
- [x] Part 4: New emails still require verification

If all ✅, **cross-browser verification is working correctly!**

---

## Troubleshooting

### Issue: Firefox still asks for magic link

**Check:**
1. Email in both browsers is EXACTLY the same
2. Chrome verification actually completed (check database)
3. Server console for `[useEmailGate] Email already verified in database`
4. Network tab in Firefox - check `/api/auth/check-email-status` response

**Debug:**
```javascript
// In Firefox console after submitting email
fetch('/api/auth/check-email-status', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: '345287@gmail.com' })
}).then(r => r.json()).then(console.log)

// Should return:
// { verified: true, exists: true, email: '345287@gmail.com', verifiedAt: '...' }
```

---

### Issue: Email normalization not working

**Check:**
```javascript
// Test email normalization
import { normalizeEmail } from '@/utils/email';

normalizeEmail('345287@GMAIL.com');  // → '345287@gmail.com'
normalizeEmail('John.Doe@gmail.com'); // → 'johndoe@gmail.com'
normalizeEmail('  test@TEST.com  ');  // → 'test@test.com'
```

---

### Issue: Database not updating

**Check database directly:**
```sql
-- Check if email exists and is verified
SELECT email, emailVerified FROM User WHERE email = '345287@gmail.com';

-- Should return:
-- email: 345287@gmail.com
-- emailVerified: 2024-... (timestamp)
```

---

## Performance Check

### API Response Time

In Firefox, when submitting already-verified email:

1. Open DevTools → Network tab
2. Submit email
3. Find request to `/api/auth/check-email-status`
4. Check response time

**Expected:** < 100ms (database query is fast)

If slower:
- Check database index on `email` field
- Check Prisma connection pooling
- Check Redis cache

---

## Video Walkthrough

For visual reference, watch this:

1. **Chrome**: Verify email (sees magic link, clicks it)
2. **Firefox**: Enter same email → Instant access! (no magic link)
3. **Proof**: Different browsers, same access

This is the magic of database-backed verification! 🎉

---

## Next Steps

After manual testing:

1. **Run automated tests:**
   ```bash
   npm run test:e2e tests/e2e/cross-browser-email-verification.spec.ts
   ```

2. **Test on production:**
   - Deploy to staging
   - Test with real email (not whitelisted)
   - Verify magic link emails arrive

3. **Monitor metrics:**
   - Track `db_verified` source in analytics
   - Measure cross-browser usage
   - A/B test impact on conversion

---

**Last Updated:** 2024
**Test Duration:** ~5 minutes
**Browsers Tested:** Chrome, Firefox, Safari
**Status:** ✅ Ready for Testing
