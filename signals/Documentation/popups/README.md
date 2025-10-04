# Signals & Drills Documentation

This directory contains documentation for trading signals and educational drills in the NextSaaS trading platform.

---

## 📁 Directory Contents

### Documentation Files

1. **`signal-10-eurusd-breakdown.md`**
   - Complete documentation for EUR/USD resistance breakdown signal
   - Includes drill details and analytics
   - Bilingual (English + Urdu)
   - API endpoints reference

2. **`HOW-TO-ADD-SIGNALS-DRILLS.md`**
   - Step-by-step guide for adding new signals
   - Data structure templates
   - Validation rules
   - Best practices
   - Troubleshooting guide

3. **`README.md`** (this file)
   - Directory overview
   - Quick links
   - Status tracking

---

## 🚀 Quick Start

### Adding a New Signal + Drill

```bash
# 1. Navigate to scripts directory
cd /Users/michaelmishayev/Desktop/signals/signals/next-saas-nextjs

# 2. Copy the template
cp scripts/add-eurusd-signal-drill.mjs scripts/add-my-signal.mjs

# 3. Edit your signal data
# (Open scripts/add-my-signal.mjs and modify the data)

# 4. Run the script
node scripts/add-my-signal.mjs

# 5. Verify it worked
node scripts/verify-data.mjs
```

### Just Adding a Drill to Existing Signal

```bash
# 1. Edit the drill-only script
# Set the signal_id to your target signal

# 2. Run it
node scripts/add-drill-only.mjs
```

---

## 📊 Current Signals & Drills

### Signal #10: EUR/USD Resistance Breakdown
- **Status:** ✅ Active
- **Type:** FOREX
- **Action:** SELL
- **Drill ID:** 18 (ANALYTICS)
- **Created:** 2025-10-04
- **Documentation:** [`signal-10-eurusd-breakdown.md`](./signal-10-eurusd-breakdown.md)

**Quick Access:**
- View: `GET /api/signals/10`
- Drill: `GET /api/drills/18`

### Signal #11: BTC/USD Resistance Rejection
- **Status:** ✅ Active
- **Type:** CRYPTO
- **Action:** SELL
- **Entry:** $124,800 | **SL:** $126,200 | **TP:** $119,000
- **Risk:Reward:** 4.14:1 (excellent!)
- **Drill ID:** 19 (ANALYTICS - Case Study)
- **Created:** 2025-10-04
- **Documentation:** [`BTCUSD-SIGNAL-2001-SETUP.md`](./BTCUSD-SIGNAL-2001-SETUP.md)

**Quick Access:**
- View: `GET /api/signals/11`
- Drill: `GET /api/drills/19`

---

## 🗄️ Database Schema

### Signals Table
- **Primary Key:** `id` (auto-increment)
- **Required:** title, content, pair, action, entry, stop_loss, take_profit, confidence, market, author, published_date
- **Optional:** title_ur, content_ur, author_ur, current_price, status, priority, author_image, chart_image, key_levels, analyst_stats, colors
- **Constraints:**
  - action: BUY | SELL
  - status: ACTIVE | CLOSED | CANCELLED
  - priority: HIGH | MEDIUM | LOW
  - market: FOREX | CRYPTO | PSX | COMMODITIES

### Drills Table
- **Primary Key:** `id` (auto-increment)
- **Foreign Key:** `signal_id` → signals(id) ON DELETE CASCADE
- **Required:** signal_id, title, description, type, content
- **Optional:** title_ur, description_ur, content_ur, order_index, is_active, image_url
- **Constraints:**
  - type: CASE_STUDY | ANALYTICS | BLOG

---

## 🌐 API Endpoints

### Signals
```
GET  /api/signals          - List all signals (with filters)
GET  /api/signals/:id      - Get single signal
POST /api/signals          - Create new signal (admin)
```

**Query Parameters:**
- `status` - Filter by status (ACTIVE, CLOSED, CANCELLED)
- `market` - Filter by market (FOREX, CRYPTO, etc.)
- `author` - Filter by analyst name
- `locale` - Language (en, ur)
- `limit` - Results per page (default: 10)
- `offset` - Pagination offset (default: 0)

### Drills
```
GET  /api/drills           - List all drills
GET  /api/drills/:id       - Get single drill
POST /api/drills           - Create new drill (admin)
```

**Query Parameters:**
- `signal_id` - Filter by parent signal
- `limit` - Results per page
- `locale` - Language (en, ur)

---

## 🎨 Drill Types Explained

### ANALYTICS
Interactive dashboard showing real-time metrics and performance data.

**Best For:**
- Live trade tracking
- Performance metrics (MFE/MAE)
- Historical analysis
- Risk calculations

**Content Structure:**
```javascript
{
  sections: [...],
  analytics: {
    stopLossPips, takeProfitPips, riskRewardRatio,
    entryPrice, stopLoss, takeProfit, confidence,
    historicalSuccessRate, averageDuration, etc.
  }
}
```

### CASE_STUDY
Deep educational analysis of a specific trade setup.

**Best For:**
- Trade breakdowns
- Technical analysis lessons
- Strategy explanations
- Post-trade reviews

**Content Structure:**
```javascript
{
  sections: [
    { title, content, order, charts?, images? }
  ]
}
```

### BLOG
Article-style educational content.

**Best For:**
- Trading psychology
- Market commentary
- Strategy guides
- Educational series

**Content Structure:**
```javascript
{
  sections: [
    { title, content, order }
  ],
  author?, publishDate?, tags?
}
```

---

## 🌍 Internationalization (i18n)

### Supported Languages
- 🇬🇧 English (primary)
- 🇵🇰 Urdu (اردو)

### Translation Fields
**Signals:**
- `title` / `title_ur`
- `content` / `content_ur`
- `author` / `author_ur`

**Drills:**
- `title` / `title_ur`
- `description` / `description_ur`
- `content` / `content_ur`

### Usage
Add `?locale=ur` to any API endpoint:
```bash
curl http://localhost:5000/api/signals/10?locale=ur
```

### Fallback Behavior
If Urdu translation is missing, API returns English version.

---

## 📝 Content Guidelines

### Signals
1. **Title:** Clear, concise (40-60 chars)
2. **Content:** Include rationale and context (100-300 words)
3. **Confidence:** Be realistic (65-85% common)
4. **Key Levels:** Always include support/resistance
5. **Analyst Stats:** Keep updated for credibility

### Drills
1. **Educational Focus:** Teach concepts, don't just describe
2. **Progressive Complexity:** Start simple, build up
3. **Interactive:** Include quizzes, charts, metrics
4. **Actionable:** End with clear takeaways
5. **Visual:** Reference charts and diagrams

### Translations
1. **Professional Quality:** Use native speakers
2. **Technical Terms:** Keep some English (Stop Loss, RSI)
3. **Consistency:** Match tone in both languages
4. **Numbers:** Use Western format (1.1740)

---

## 🔧 Available Scripts

### Location
`/signals/next-saas-nextjs/scripts/`

### Files
- `add-eurusd-signal-drill.mjs` - Template for signal + drill
- `add-drill-only.mjs` - Add drill to existing signal
- `verify-data.mjs` - Verify inserted data
- `migrate-supabase-urdu.mjs` - Urdu translation migration
- `test-translation-flow.mjs` - Test translation system

### Usage
```bash
node scripts/[script-name].mjs
```

---

## 🖼️ Visual Assets

### Directory Structure
```
public/images/
├── analysts/          # Analyst headshots (200x200px)
├── charts/            # Trading charts (1200x800px)
└── drills/            # Drill images (800x600px)
```

### Naming Convention
- Analysts: `firstname-lastname.jpg`
- Charts: `pair-setup-type.jpg` (e.g., `eurusd-resistance-breakdown.jpg`)
- Drills: `concept-name.jpg` (e.g., `false-breakout-analytics.jpg`)

### Format Guidelines
- Photos: JPG (quality 85%)
- Charts: PNG (for annotations)
- Max file size: 500KB

---

## 🧪 Testing

### Manual Testing
```bash
# Start dev server
npm run dev

# Test API endpoints
curl http://localhost:5000/api/signals/10
curl http://localhost:5000/api/drills/18

# Test with locale
curl http://localhost:5000/api/signals/10?locale=ur
```

### Verification Script
```bash
node scripts/verify-data.mjs
```

Expected output:
- ✅ Signal found with all fields
- ✅ Drill found and linked
- ✅ Translations present
- ✅ Analytics data structured correctly

---

## 📋 Checklist for New Signal

- [ ] Create signal data (all required fields)
- [ ] Add Urdu translations
- [ ] Create drill data (if applicable)
- [ ] Prepare visual assets
- [ ] Run insert script
- [ ] Verify with verification script
- [ ] Test API endpoints
- [ ] Test frontend display
- [ ] Document in this directory
- [ ] Update README status section

---

## 🐛 Common Issues

### "Missing Supabase environment variables"
**Fix:** Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
```

### "violates check constraint drills_type_check"
**Fix:** Type must be exactly `CASE_STUDY`, `ANALYTICS`, or `BLOG`

### "foreign key constraint fails"
**Fix:** Ensure parent signal exists before creating drill

### Signal not showing in API
**Fix:** Check status is `ACTIVE` and `is_active` is `true`

---

## 📚 Additional Resources

- [NextSaaS Documentation](../README.md)
- [Supabase Docs](https://supabase.com/docs)
- [Database Schema](../../database/create-tables.sql)
- [API Routes](../../src/app/api/)

---

## 🤝 Contributing

When adding new signals/drills:

1. Follow the templates in [`HOW-TO-ADD-SIGNALS-DRILLS.md`](./HOW-TO-ADD-SIGNALS-DRILLS.md)
2. Document in this directory
3. Update this README's status section
4. Test thoroughly before deploying
5. Add visual assets to `/public/images/`

---

## 📅 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-10-04 | Initial documentation<br>Added Signal #10 (EUR/USD)<br>Created template scripts |

---

## 📞 Support

For questions or issues:
1. Check [`HOW-TO-ADD-SIGNALS-DRILLS.md`](./HOW-TO-ADD-SIGNALS-DRILLS.md)
2. Review error messages carefully
3. Test with verification script
4. Check database directly via Supabase

---

**Last Updated:** 2025-10-04
**Status:** 📗 Active Development
