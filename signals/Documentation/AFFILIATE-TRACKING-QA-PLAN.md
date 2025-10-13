# Affiliate Tracking System - QA Test Plan

**Version**: 1.0
**Date**: 2025-10-13
**Status**: Ready for Testing

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Test Environment Setup](#test-environment-setup)
3. [Manual Testing Checklist](#manual-testing-checklist)
4. [Automated Testing](#automated-testing)
5. [Database Validation](#database-validation)
6. [Exness Integration Testing](#exness-integration-testing)
7. [Performance Testing](#performance-testing)
8. [Security Testing](#security-testing)
9. [Sign-Off Criteria](#sign-off-criteria)

---

## 1. Overview

### Purpose
Validate that all affiliate link tracking functionality works correctly across the platform, ensuring accurate click tracking and conversion attribution.

### Scope
- All CTA buttons across the platform
- API endpoints for tracking and postbacks
- Database schema and data integrity
- Exness affiliate link integration
- UTM parameter generation
- Session and user context tracking

### Out of Scope
- Exness Partner dashboard (external system)
- Payment/commission processing

---

## 2. Test Environment Setup

### Prerequisites

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
echo "EXNESS_POSTBACK_SECRET=your_secret_token" >> .env.local

# 3. Run database migrations
# Connect to your Supabase project and run:
# /supabase-migrations/affiliate-tracking-system.sql

# 4. Start development server
npm run dev
```

### Verification
- [ ] Server running on http://localhost:5000
- [ ] Database tables created: `affiliate_clicks`, `affiliate_conversions`
- [ ] Environment variables loaded
- [ ] Browser DevTools Network tab open

---

## 3. Manual Testing Checklist

### 3.1 Configuration Validation

**Test**: Verify configuration files updated
- [ ] `/src/config/gates.ts` contains Exness URL: `https://one.exnessonelink.com/a/c_8f0nxidtbt`
- [ ] `/src/config/popups.ts` contains Exness URL
- [ ] No placeholder URLs remaining (`broker-signup-url.com`, `platform.example.com`)

**Expected Result**: ✅ All config files use real Exness affiliate link

---

### 3.2 Signal Page CTA Buttons

**Test 1**: Bottom sticky CTA button
1. Navigate to any signal page: `/en/signal/10`
2. Scroll to find the sticky bottom button
3. Open DevTools Network tab
4. Click the "START LEARNING" or "VIEW ANALYSIS" button
5. Verify:
   - [ ] Network request to `/api/track-affiliate-click` (200 OK)
   - [ ] Request body contains:
     - `clickId` (unique)
     - `source`: `"signal_page_cta"`
     - `signalId`: `10`
     - `buttonVariant`: one of `["urgent-countdown", "live-pulse", "profit-alert", "rocket-launch"]`
     - `utmParams` with all fields
   - [ ] New tab opens to `https://one.exnessonelink.com/a/c_8f0nxidtbt?cid=...`
   - [ ] URL contains all UTM parameters
   - [ ] Console log: `"Opening Exness affiliate link for [PAIR]"`

**Expected Result**: ✅ Click tracked, affiliate link opened with tracking parameters

---

**Test 2**: Top CTA button (if present)
1. Same as Test 1 but for top button
2. Verify same tracking behavior

**Expected Result**: ✅ Click tracked correctly

---

**Test 3**: Home button tracking
1. On signal page, click "Home" button (top left)
2. Verify:
   - [ ] Network request to `/api/track-affiliate-click`
   - [ ] Request body contains:
     - `source`: `"signal_page_home_button"`
     - `metadata.action`: `"navigation_home"`
   - [ ] Page navigates to home

**Expected Result**: ✅ Navigation tracked (URL doesn't change, just tracking logged)

---

### 3.3 Homepage Signal Feed

**Test**: Feed CTA buttons
1. Navigate to homepage: `/en`
2. Wait for signals to load in sidebar
3. Open DevTools Network tab
4. Click any signal's CTA button (BUY NOW / SELL NOW)
5. Verify:
   - [ ] Network request to `/api/track-affiliate-click`
   - [ ] Request body contains:
     - `source`: `"homepage_feed"`
     - `signalId`: (signal ID)
     - `buttonVariant`: (variant name)
   - [ ] New tab opens to Exness affiliate link
   - [ ] URL contains tracking parameters

**Expected Result**: ✅ Click tracked, affiliate link opened

---

### 3.4 Gate Modals

**Test 1**: Email Gate
1. View 1 signal drill (first drill is free)
2. Try to view 2nd drill
3. Email gate should appear
4. Enter email and continue
5. **Note**: Email gate doesn't have broker link (only collects email)

**Expected Result**: ✅ Email gate works (no affiliate tracking here)

---

**Test 2**: Broker Gate
1. After providing email, view 8 more drills (total 9 drills)
2. Try to view 10th drill
3. Broker gate modal should appear
4. Open DevTools Network tab
5. Click "Open Broker Account" button
6. Verify:
   - [ ] Network request to `/api/track-affiliate-click`
   - [ ] Request body contains:
     - `source`: `"gate_modal_broker"`
     - `metadata.gateType`: `"broker_gate"`
   - [ ] New tab opens to Exness affiliate link
   - [ ] Alert message appears: "Complete your broker signup..."

**Expected Result**: ✅ Broker gate tracks click correctly

---

### 3.5 Popup System

**Test 1**: Idle Popup
1. Stay on homepage for 60 seconds without interaction
2. Idle popup should appear
3. Open DevTools Network tab
4. Click "Start Trading Now" button
5. Verify:
   - [ ] Network request to `/api/track-affiliate-click`
   - [ ] Request body contains `source`: `"popup_idle"`
   - [ ] New tab opens to Exness affiliate link
   - [ ] Popup closes

**Expected Result**: ✅ Idle popup tracks click

---

**Test 2**: Fourth Action Popup
1. Perform 4 actions (click 4 signals, buttons, etc.)
2. Fourth action popup should appear
3. Click "Open Account Now" button
4. Verify:
   - [ ] Network request with `source`: `"popup_fourth_action"`
   - [ ] Affiliate link opens

**Expected Result**: ✅ Fourth action popup tracks click

---

**Test 3**: Exit Intent Popup (Email subscribers only)
1. Provide email first (trigger email gate)
2. Move mouse cursor outside browser viewport (upward)
3. Exit intent popup should appear
4. Click "Claim My Bonus" button
5. Verify:
   - [ ] Network request with `source`: `"popup_exit_intent"`
   - [ ] Affiliate link opens

**Expected Result**: ✅ Exit intent popup tracks click

---

### 3.6 Banner Ads

**Test**: Banner click tracking
1. Navigate to any page with banners (signal page sidebar, footer)
2. Click a banner ad
3. Verify:
   - [ ] Affiliate link opens in new tab
   - [ ] Tracking may vary (banners use `AdBanner` component)

**Expected Result**: ✅ Banner links work (tracking may differ)

---

## 4. Automated Testing

### Run E2E Tests

```bash
# Run all affiliate tracking tests
npm run test:e2e tests/e2e/affiliate-tracking-system.spec.ts

# Run specific test suite
npx playwright test --grep "Signal Page Tracking"

# Run with UI
npx playwright test --ui
```

### Test Coverage

- [ ] API endpoint tests (click tracking, postback, health check)
- [ ] Signal page button tracking
- [ ] Homepage feed button tracking
- [ ] Tracking utilities (clickId generation, UTM building, session management)
- [ ] URL building with parameters
- [ ] End-to-end user journey

**Expected Result**: ✅ All tests pass

---

## 5. Database Validation

### 5.1 Verify Tables Exist

```sql
-- Connect to Supabase and run:
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('affiliate_clicks', 'affiliate_conversions');
```

**Expected Result**: ✅ Both tables exist

---

### 5.2 Test Data Insertion

```sql
-- Test affiliate_clicks insertion
INSERT INTO affiliate_clicks (
  click_id, source, signal_id, button_variant,
  utm_source, utm_medium, utm_campaign,
  user_agent, ip_address
) VALUES (
  'test_click_' || extract(epoch from now()),
  'test_suite',
  123,
  'test_button',
  'test_source',
  'test_medium',
  'test_campaign',
  'Mozilla/5.0',
  '127.0.0.1'
);

-- Verify insertion
SELECT * FROM affiliate_clicks ORDER BY created_at DESC LIMIT 1;
```

**Expected Result**: ✅ Data inserted successfully

---

### 5.3 Verify Indexes

```sql
-- Check indexes exist
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename IN ('affiliate_clicks', 'affiliate_conversions');
```

**Expected Result**: ✅ All indexes created (click_id, signal_id, source, etc.)

---

### 5.4 Test View

```sql
-- Query daily stats view
SELECT * FROM affiliate_stats_daily
WHERE date = CURRENT_DATE;
```

**Expected Result**: ✅ View returns aggregated statistics

---

## 6. Exness Integration Testing

### 6.1 Test Postback Endpoint (Local)

```bash
# Test with curl
curl -X POST http://localhost:5000/api/exness-postback \
  -H "Content-Type: application/json" \
  -d '{
    "cid": "test_click_'$(date +%s)'",
    "event": "registration",
    "user_id": "test_user_123",
    "transaction_id": "txn_'$(date +%s)'",
    "amount": "100.00",
    "currency": "USD",
    "commission": "15.00",
    "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Conversion tracked successfully",
  "data": { ... }
}
```

**Verify**:
- [ ] Response is 200 OK
- [ ] Database has new record in `affiliate_conversions`

---

### 6.2 Configure Postback in Exness Partner Account

**Steps**:
1. Log into your Exness Partner account
2. Navigate to: **Marketing → Network Integration → Postback URLs**
3. Add new postback:
   - **Event Type**: Registration
   - **Postback URL**: `https://yourdomain.com/api/exness-postback?cid={cid}&event=registration&user_id={user_id}&transaction_id={transaction_id}`
4. Test postback using Exness's test tool
5. Verify you receive notification in your database

**Expected Result**: ✅ Postback configuration works

---

### 6.3 Test Real Conversion (Staging)

1. Create a test click:
   - Click any affiliate button
   - Note the `click_id` from Network tab
2. In Exness Partner account:
   - Trigger a test conversion with your `click_id`
3. Wait for postback (should be immediate)
4. Query database:
   ```sql
   SELECT * FROM affiliate_conversions
   WHERE click_id = 'your_click_id';
   ```

**Expected Result**: ✅ Conversion appears in database

---

## 7. Performance Testing

### 7.1 Click Tracking Performance

**Test**: Measure tracking delay
1. Open DevTools Performance tab
2. Click affiliate button
3. Measure time from click to API response

**Expected Result**: ✅ Tracking completes < 500ms (doesn't block user action)

---

### 7.2 Concurrent Clicks

**Test**: Simulate multiple simultaneous clicks
```javascript
// Run in browser console
for (let i = 0; i < 10; i++) {
  fetch('/api/track-affiliate-click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clickId: `load_test_${Date.now()}_${i}`,
      source: 'load_test',
      signalId: 123
    })
  });
}
```

**Expected Result**: ✅ All requests complete successfully

---

### 7.3 Database Query Performance

```sql
-- Test index performance
EXPLAIN ANALYZE
SELECT * FROM affiliate_clicks
WHERE click_id = 'some_click_id';

-- Should use index scan, not sequential scan
```

**Expected Result**: ✅ Queries use indexes (fast lookups)

---

## 8. Security Testing

### 8.1 Postback Endpoint Security

**Test 1**: Verify secret token validation
```bash
# Try without secret (should warn but may allow in dev)
curl -X POST http://localhost:5000/api/exness-postback \
  -H "Content-Type: application/json" \
  -d '{"cid": "test", "event": "registration"}'

# Try with wrong secret
curl -X POST http://localhost:5000/api/exness-postback \
  -H "Content-Type": "application/json" \
  -d '{"cid": "test", "event": "registration", "secret": "wrong_token"}'
```

**Expected Result**: ✅ Unauthorized requests are logged/rejected (in production)

---

**Test 2**: SQL Injection protection
```bash
# Try SQL injection in click_id
curl -X POST http://localhost:5000/api/track-affiliate-click \
  -H "Content-Type: application/json" \
  -d '{"clickId": "test\'; DROP TABLE affiliate_clicks; --", "source": "test"}'
```

**Expected Result**: ✅ No SQL injection (ORM handles escaping)

---

### 8.2 XSS Protection

**Test**: Inject script in metadata
```javascript
fetch('/api/track-affiliate-click', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    clickId: 'test_xss',
    source: 'test',
    metadata: {
      malicious: '<script>alert("XSS")</script>'
    }
  })
});
```

**Expected Result**: ✅ Metadata stored safely (JSONB, no execution)

---

## 9. Sign-Off Criteria

### ✅ Must Pass

- [ ] All manual tests pass (no critical failures)
- [ ] All automated E2E tests pass
- [ ] Database schema created successfully
- [ ] API endpoints return correct responses
- [ ] Affiliate links contain correct tracking parameters
- [ ] No console errors in browser
- [ ] No server errors in logs
- [ ] Tracking doesn't block user actions (non-blocking)

### ✅ Nice to Have

- [ ] Exness postback configured and tested
- [ ] Performance benchmarks met (< 500ms)
- [ ] Security tests pass
- [ ] Documentation complete

### ❌ Blockers

- Configuration still has placeholder URLs
- API endpoints return 500 errors
- Database migration fails
- Affiliate links don't open
- Tracking requests fail consistently

---

## 10. Test Execution Log

| Date | Tester | Test Section | Status | Notes |
|------|--------|-------------|--------|-------|
| 2025-10-13 | [Name] | 3.1 Config Validation | ⏳ Pending | |
| 2025-10-13 | [Name] | 3.2 Signal Page CTA | ⏳ Pending | |
| 2025-10-13 | [Name] | 3.3 Homepage Feed | ⏳ Pending | |
| 2025-10-13 | [Name] | 3.4 Gate Modals | ⏳ Pending | |
| 2025-10-13 | [Name] | 3.5 Popups | ⏳ Pending | |
| 2025-10-13 | [Name] | 4. Automated Tests | ⏳ Pending | |
| 2025-10-13 | [Name] | 5. Database Validation | ⏳ Pending | |
| 2025-10-13 | [Name] | 6. Exness Integration | ⏳ Pending | |
| 2025-10-13 | [Name] | 7. Performance | ⏳ Pending | |
| 2025-10-13 | [Name] | 8. Security | ⏳ Pending | |

**Legend**: ⏳ Pending | ✅ Pass | ⚠️ Warning | ❌ Fail

---

## 11. Bug Tracking Template

### Bug Report Format

**Bug ID**: BUG-001
**Severity**: [Critical / High / Medium / Low]
**Section**: [e.g., Signal Page CTA]
**Description**: [Clear description of the issue]
**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Result**: [What should happen]
**Actual Result**: [What actually happens]
**Screenshots**: [If applicable]
**Browser/Environment**: [Chrome 120, Firefox 121, etc.]
**Status**: [Open / In Progress / Fixed / Closed]

---

## 12. Post-Deployment Validation

### Production Checklist

After deploying to production:

- [ ] Smoke test all CTA buttons
- [ ] Verify one real click reaches database
- [ ] Check Exness Partner dashboard for click registration
- [ ] Monitor error logs for 24 hours
- [ ] Verify analytics dashboard shows data
- [ ] Test postback with real conversion (if possible)

---

**QA Sign-Off**

**Tested By**: _____________________
**Date**: _____________________
**Status**: ⏳ Pending / ✅ Approved / ❌ Rejected
**Comments**: _____________________
