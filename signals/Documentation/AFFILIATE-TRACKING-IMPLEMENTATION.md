# Affiliate Tracking System - Implementation Complete ✅

**Version**: 1.0
**Date**: 2025-10-13
**Status**: ✅ **IMPLEMENTATION COMPLETE - READY FOR QA**

---

## 🎯 Executive Summary

A complete affiliate tracking system has been implemented for the Exness affiliate link `https://one.exnessonelink.com/a/c_8f0nxidtbt`. The system tracks every click on all CTA buttons across the platform and provides detailed analytics for conversion attribution.

### What Was Implemented

✅ **Fixed all affiliate links** - All buttons now use the real Exness affiliate URL (no more placeholders)
✅ **Click tracking system** - Every click is tracked with full attribution data
✅ **Database schema** - Complete schema for clicks and conversions
✅ **API endpoints** - Click tracking and Exness postback receiver
✅ **UTM parameters** - Automatic UTM generation for all links
✅ **Session tracking** - User sessions and context captured
✅ **Test suite** - Comprehensive E2E tests
✅ **QA documentation** - Complete test plan for validation

---

## 📊 Can You Track Clicks? YES! ✅

### Answer to Your Questions

**Q1: Do buttons have the affiliate link?**
✅ **YES** - All buttons now open `https://one.exnessonelink.com/a/c_8f0nxidtbt` with tracking parameters

**Q2: Can we track how many people clicked?**
✅ **YES** - You can track:
- Total clicks (overall and per signal)
- Unique visitors
- Click sources (which button/page)
- Button variants (which design)
- User sessions
- Timestamps
- User context (browser, IP, referrer)
- Conversions (via Exness postback)
- Click-to-conversion time
- Commission tracking

---

## 📁 Files Created/Modified

### New Files Created ✨

```
Database Schema:
├── supabase-migrations/affiliate-tracking-system.sql

Utilities:
├── src/utils/affiliateTracking.ts

API Endpoints:
├── src/app/api/track-affiliate-click/route.ts
└── src/app/api/exness-postback/route.ts

Tests:
└── tests/e2e/affiliate-tracking-system.spec.ts

Documentation:
├── Documentation/AFFILIATE-TRACKING-QA-PLAN.md
└── Documentation/AFFILIATE-TRACKING-IMPLEMENTATION.md (this file)
```

### Files Modified 🔧

```
Configuration:
├── src/config/gates.ts (✅ Updated affiliate URL)
└── src/config/popups.ts (✅ Updated affiliate URL)

Components:
├── src/app/[locale]/signal/[id]/SignalPageClient.tsx (✅ Added tracking)
├── src/components/tradesignal/SignalsFeed.tsx (✅ Added tracking)
├── src/components/shared/gates/BrokerGateModal.tsx (✅ Added tracking)
└── src/components/shared/popups/BrokerPopups.tsx (✅ Added tracking)
```

---

## 🗄️ Database Schema

### Tables Created

#### 1. `affiliate_clicks`
Stores every click on affiliate links with full attribution:

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key |
| `click_id` | VARCHAR(100) | Unique click identifier |
| `signal_id` | INTEGER | Signal ID (if applicable) |
| `source` | VARCHAR(50) | Click source (signal_page_cta, homepage_feed, etc.) |
| `button_variant` | VARCHAR(50) | Button design variant |
| `utm_source` | VARCHAR(100) | UTM source parameter |
| `utm_medium` | VARCHAR(100) | UTM medium parameter |
| `utm_campaign` | VARCHAR(100) | UTM campaign parameter |
| `utm_content` | VARCHAR(100) | UTM content parameter |
| `utm_term` | VARCHAR(100) | UTM term parameter |
| `user_agent` | TEXT | Browser user agent |
| `ip_address` | VARCHAR(45) | User IP address |
| `referrer` | TEXT | HTTP referrer |
| `page_path` | VARCHAR(500) | Page where click occurred |
| `locale` | VARCHAR(10) | User language/locale |
| `session_id` | VARCHAR(100) | User session ID |
| `clicked_at` | TIMESTAMP | Click timestamp |
| `metadata` | JSONB | Additional flexible data |
| `created_at` | TIMESTAMP | Record creation time |

**Indexes**: click_id, signal_id, source, clicked_at, session_id

---

#### 2. `affiliate_conversions`
Stores conversion events from Exness postback notifications:

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key |
| `click_id` | VARCHAR(100) | Links to affiliate_clicks |
| `exness_user_id` | VARCHAR(100) | Exness user ID |
| `exness_transaction_id` | VARCHAR(100) | Unique transaction ID |
| `conversion_type` | VARCHAR(50) | Event type (registration, deposit, etc.) |
| `conversion_value` | DECIMAL(10,2) | Value (deposit amount) |
| `currency` | VARCHAR(10) | Currency code |
| `commission_amount` | DECIMAL(10,2) | Your commission |
| `commission_status` | VARCHAR(20) | Status (pending, approved, paid) |
| `converted_at` | TIMESTAMP | Conversion time |
| `received_at` | TIMESTAMP | Postback received time |
| `raw_postback` | JSONB | Complete postback data |
| `is_verified` | BOOLEAN | Verification status |
| `verified_at` | TIMESTAMP | Verification time |
| `created_at` | TIMESTAMP | Record creation time |

**Indexes**: click_id, exness_user_id, conversion_type, converted_at, commission_status

---

#### 3. `affiliate_stats_daily` (View)
Aggregated daily statistics:

```sql
SELECT * FROM affiliate_stats_daily WHERE date = CURRENT_DATE;
```

Returns:
- Date
- Source
- Total clicks
- Unique visitors
- Unique sessions
- Signals clicked
- Button variants used
- Conversions
- Conversion rate (%)

---

## 🔗 Tracking Sources

All buttons are categorized by source for attribution:

| Source | Description |
|--------|-------------|
| `signal_page_cta` | Bottom sticky CTA button on signal pages |
| `signal_page_home_button` | Home button on signal pages (navigation tracking) |
| `homepage_feed` | CTA buttons in homepage signal feed |
| `gate_modal_broker` | Broker gate modal button |
| `popup_idle` | Idle popup (after 1 min inactivity) |
| `popup_content_access` | Content access popup |
| `popup_fourth_action` | Fourth action popup |
| `popup_exit_intent` | Exit intent popup |
| `banner_side` | Sidebar banner ads |
| `banner_footer` | Footer banner ads |
| `banner_between_signals` | Between-signals banner ads |

---

## 🔧 API Endpoints

### 1. POST `/api/track-affiliate-click`

**Purpose**: Track every click on affiliate links

**Request**:
```json
{
  "clickId": "1697452800000_123_abc123def",
  "signalId": 123,
  "source": "signal_page_cta",
  "buttonVariant": "urgent-countdown",
  "utmParams": {
    "source": "signals_platform",
    "medium": "cta_button",
    "campaign": "signal_123",
    "content": "button_urgent-countdown"
  },
  "metadata": {
    "signalPair": "EUR/USD",
    "signalAction": "BUY",
    "signalConfidence": 87,
    "sessionId": "session_abc123",
    "timestamp": "2025-10-13T10:30:00Z"
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Click tracked successfully",
  "clickId": "1697452800000_123_abc123def",
  "data": { ... }
}
```

**GET `/api/track-affiliate-click`** - Health check:
```json
{
  "status": "ok",
  "endpoint": "/api/track-affiliate-click",
  "supabaseConfigured": true,
  "totalClicks": 1250,
  "methods": ["POST", "GET"]
}
```

---

### 2. POST `/api/exness-postback`

**Purpose**: Receive conversion notifications from Exness

**Request** (from Exness servers):
```json
{
  "cid": "1697452800000_123_abc123def",
  "event": "registration",
  "user_id": "exness_user_123",
  "transaction_id": "txn_1697452900000",
  "amount": "100.00",
  "currency": "USD",
  "commission": "15.00",
  "timestamp": "2025-10-13T10:35:00Z"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Conversion tracked successfully",
  "data": { ... }
}
```

**GET `/api/exness-postback`** - Test endpoint:
```json
{
  "status": "ok",
  "endpoint": "/api/exness-postback",
  "description": "Exness S2S postback receiver",
  "totalConversions": 47,
  "recentConversions": [ ... ],
  "instructions": {
    "configureInExness": "Add this URL to Exness Partner account",
    "format": "https://yourdomain.com/api/exness-postback",
    "requiredParams": ["cid", "event"],
    ...
  }
}
```

---

## 🛠️ Utility Functions

### `trackAffiliateClick()`

**Main tracking function** - Call this before opening affiliate links:

```typescript
import { trackAffiliateClick } from '@/utils/affiliateTracking';

// Track click and get affiliate URL
const affiliateUrl = await trackAffiliateClick({
  signalId: 123,
  source: 'signal_page_cta',
  buttonVariant: 'urgent-countdown',
  metadata: {
    signalPair: 'EUR/USD',
    signalAction: 'BUY',
  },
});

// Open affiliate link
window.open(affiliateUrl, '_blank');
```

### Other Utilities

```typescript
// Generate unique click ID
const clickId = generateClickId(signalId);

// Build UTM parameters
const utmParams = buildUTMParams(source, signalId, buttonVariant);

// Build complete affiliate URL
const url = buildAffiliateUrl(clickId, utmParams, customParams);

// Get session ID
const sessionId = getSessionId();

// Get user context
const context = getUserContext();
```

---

## 📈 How to View Analytics

### Method 1: Database Queries (Supabase)

```sql
-- Total clicks today
SELECT COUNT(*) as total_clicks
FROM affiliate_clicks
WHERE DATE(clicked_at) = CURRENT_DATE;

-- Clicks by source
SELECT source, COUNT(*) as clicks
FROM affiliate_clicks
GROUP BY source
ORDER BY clicks DESC;

-- Top performing signals
SELECT signal_id, COUNT(*) as clicks
FROM affiliate_clicks
WHERE signal_id IS NOT NULL
GROUP BY signal_id
ORDER BY clicks DESC
LIMIT 10;

-- Conversion rate by source
SELECT
  ac.source,
  COUNT(DISTINCT ac.click_id) as clicks,
  COUNT(DISTINCT acv.id) as conversions,
  ROUND((COUNT(DISTINCT acv.id)::NUMERIC / COUNT(DISTINCT ac.click_id)::NUMERIC) * 100, 2) as conversion_rate
FROM affiliate_clicks ac
LEFT JOIN affiliate_conversions acv ON ac.click_id = acv.click_id
GROUP BY ac.source
ORDER BY conversion_rate DESC;

-- Daily stats (using view)
SELECT * FROM affiliate_stats_daily
ORDER BY date DESC
LIMIT 30;

-- Recent conversions with click details
SELECT
  ac.click_id,
  ac.signal_id,
  ac.source,
  ac.clicked_at,
  acv.conversion_type,
  acv.conversion_value,
  acv.commission_amount,
  acv.converted_at,
  (acv.converted_at - ac.clicked_at) as time_to_convert
FROM affiliate_clicks ac
INNER JOIN affiliate_conversions acv ON ac.click_id = acv.click_id
ORDER BY acv.converted_at DESC
LIMIT 20;
```

---

### Method 2: Exness Partner Dashboard

1. Log into [Exness Partner Account](https://www.exnessaffiliates.com/)
2. Navigate to **Statistics** or **Reports**
3. View:
   - Total clicks
   - Registrations
   - First deposits
   - Commissions earned
   - Conversion rates

---

### Method 3: Build Custom Dashboard (Future)

Create a dashboard page to visualize:
- Real-time click count
- Top performing signals
- Button variant A/B testing results
- Conversion funnel
- Revenue tracking

---

## 🚀 Deployment Steps

### Step 1: Run Database Migration

```sql
-- Connect to your Supabase project SQL editor
-- Copy and run the entire contents of:
-- /supabase-migrations/affiliate-tracking-system.sql
```

**Verify**:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('affiliate_clicks', 'affiliate_conversions');
```

---

### Step 2: Set Environment Variables

Add to `.env.local` or production environment:

```bash
# Exness Postback Security
EXNESS_POSTBACK_SECRET=your_random_secret_token_here

# Optional: Notification webhooks
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

---

### Step 3: Deploy Code

```bash
# Install dependencies (if any new)
npm install

# Build for production
npm run build

# Deploy to your hosting (Vercel, etc.)
git add .
git commit -m "feat: implement complete affiliate tracking system"
git push
```

---

### Step 4: Configure Exness Postback

1. Log into [Exness Partner Account](https://www.exnessaffiliates.com/)
2. Go to **Marketing → Network Integration → Postback URLs**
3. Add postback URL:

**Registration Event**:
```
https://yourdomain.com/api/exness-postback?cid={cid}&event=registration&user_id={user_id}&transaction_id={transaction_id}
```

**First Deposit Event**:
```
https://yourdomain.com/api/exness-postback?cid={cid}&event=first_deposit&user_id={user_id}&transaction_id={transaction_id}&amount={amount}&currency={currency}&commission={commission}
```

4. Test postback using Exness's test feature
5. Verify conversion appears in your database

---

### Step 5: Run QA Tests

Follow the complete QA plan:
```bash
# Run automated tests
npm run test:e2e tests/e2e/affiliate-tracking-system.spec.ts

# Manual testing checklist
# See: /Documentation/AFFILIATE-TRACKING-QA-PLAN.md
```

---

## 📊 Example Tracking Flow

### User Journey

```
1. User visits homepage
   └─ Session ID created: session_1697452800_abc123

2. User clicks signal in feed
   ├─ Click tracked:
   │  ├─ click_id: 1697452800000_10_xyz789
   │  ├─ source: homepage_feed
   │  ├─ signal_id: 10
   │  └─ button_variant: urgent-countdown
   └─ Affiliate URL opened:
      └─ https://one.exnessonelink.com/a/c_8f0nxidtbt?
         cid=1697452800000_10_xyz789&
         utm_source=signals_platform&
         utm_medium=feed&
         utm_campaign=signal_10&
         utm_content=button_urgent-countdown&
         signal_id=10&
         source=homepage_feed

3. User lands on Exness site
   └─ Exness tracks click with cid parameter

4. User signs up on Exness
   └─ Exness sends postback:
      POST https://yourdomain.com/api/exness-postback
      {
        "cid": "1697452800000_10_xyz789",
        "event": "registration",
        "user_id": "exness_user_123",
        ...
      }

5. Conversion stored in database
   └─ Linked to original click via click_id

6. You can now query:
   └─ SELECT * FROM affiliate_clicks ac
      JOIN affiliate_conversions acv ON ac.click_id = acv.click_id
      WHERE ac.signal_id = 10;

   Result: Full attribution from click to conversion!
```

---

## ✅ Next Steps

### Immediate (Required)

1. **Run database migration**
   - Execute `/supabase-migrations/affiliate-tracking-system.sql`
   - Verify tables created

2. **Deploy code to production**
   - Push changes to repository
   - Deploy via your CI/CD pipeline

3. **Run QA tests**
   - Follow `/Documentation/AFFILIATE-TRACKING-QA-PLAN.md`
   - Test all buttons manually
   - Run automated E2E tests

4. **Configure Exness postback**
   - Add postback URL in Partner account
   - Test with Exness's test tool

5. **Monitor first clicks**
   - Wait for real user clicks
   - Check database for data
   - Verify Exness Partner dashboard shows clicks

---

### Short-term (Recommended)

6. **Build analytics dashboard**
   - Create `/dashboard` page
   - Display real-time stats
   - Show charts and graphs

7. **Set up alerts**
   - Slack/email notifications for conversions
   - Daily summary reports
   - Error monitoring

8. **A/B test button variants**
   - Compare conversion rates
   - Optimize button copy/design

---

### Long-term (Optional)

9. **Advanced analytics**
   - Cohort analysis
   - Customer lifetime value (CLV)
   - Attribution modeling

10. **Revenue tracking**
    - Commission calculations
    - Payout tracking
    - ROI reporting

---

## 🐛 Troubleshooting

### Issue: Tracking API returns 500

**Solution**:
- Check Supabase connection
- Verify environment variables
- Check server logs for errors

---

### Issue: Clicks not appearing in database

**Solution**:
- Verify database migration ran successfully
- Check Supabase permissions
- Test API endpoint directly:
  ```bash
  curl -X POST http://localhost:5000/api/track-affiliate-click \
    -H "Content-Type: application/json" \
    -d '{"clickId": "test_123", "source": "test"}'
  ```

---

### Issue: Affiliate link doesn't open

**Solution**:
- Check browser console for errors
- Verify `GATE_CONFIG.brokerUrl` is correct
- Test `trackAffiliateClick()` function directly

---

### Issue: Postback not received

**Solution**:
- Verify postback URL configured correctly in Exness
- Check production URL is accessible (not localhost)
- Test postback endpoint:
  ```bash
  curl -X POST https://yourdomain.com/api/exness-postback \
    -H "Content-Type: application/json" \
    -d '{"cid": "test_123", "event": "registration"}'
  ```
- Check Exness Partner account for postback test logs

---

## 📞 Support

For questions or issues:
1. Review QA plan: `/Documentation/AFFILIATE-TRACKING-QA-PLAN.md`
2. Check automated tests: `/tests/e2e/affiliate-tracking-system.spec.ts`
3. Review utility functions: `/src/utils/affiliateTracking.ts`
4. Check API endpoints: `/src/app/api/track-affiliate-click/route.ts`

---

## 🎉 Summary

**Your affiliate tracking system is complete and ready to use!**

✅ All buttons use real Exness affiliate links
✅ Every click is tracked with full attribution
✅ Database stores all click and conversion data
✅ UTM parameters auto-generated
✅ Conversion tracking via Exness postback
✅ Comprehensive testing suite
✅ Complete documentation

**You can now track exactly how many people clicked your affiliate links and who converted!** 🚀

---

**Implementation Date**: 2025-10-13
**Status**: ✅ **COMPLETE - READY FOR QA**
**Next Action**: Run QA tests and deploy to production
