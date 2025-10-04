# How to Add New Signals & Drills

Quick guide for adding new trading signals and educational drills to the database.

---

## Quick Start

### Option 1: Use the Template Script (Recommended)

1. Copy the template script:
   ```bash
   cp scripts/add-eurusd-signal-drill.mjs scripts/add-new-signal.mjs
   ```

2. Edit the signal data in the new script

3. Run it:
   ```bash
   node scripts/add-new-signal.mjs
   ```

### Option 2: Manual Database Insert

Use the Supabase dashboard or SQL client to insert directly.

---

## Signal Data Structure

### Required Fields

```javascript
{
  title: "Signal title in English",
  title_ur: "اردو میں سگنل کا عنوان",
  content: "Detailed analysis in English",
  content_ur: "اردو میں تفصیلی تجزیہ",
  pair: "EUR/USD",              // Trading pair
  action: "BUY" | "SELL",       // Trade direction
  entry: 1.1740,                // Entry price (float)
  stop_loss: 1.1775,            // Stop loss price (float)
  take_profit: 1.1680,          // Take profit price (float)
  confidence: 65,               // 1-100
  market: "FOREX" | "CRYPTO" | "PSX" | "COMMODITIES",
  author: "Analyst Name",
  author_ur: "تجزیہ کار کا نام",
  published_date: "2025-10-04"  // YYYY-MM-DD format
}
```

### Optional Fields

```javascript
{
  current_price: 1.1740,        // Current market price
  status: "ACTIVE" | "CLOSED" | "CANCELLED",  // Default: ACTIVE
  priority: "HIGH" | "MEDIUM" | "LOW",        // Default: MEDIUM
  author_image: "/images/analysts/name.jpg",
  chart_image: "/images/charts/chart-name.jpg",
  key_levels: {
    support: [1.1710, 1.1680],
    resistance: [1.1750, 1.1775, 1.1800]
  },
  analyst_stats: {
    successRate: 58,
    totalSignals: 120,
    totalPips: 1450
  }
}
```

---

## Drill Data Structure

### Required Fields

```javascript
{
  signal_id: 10,                // Reference to parent signal
  title: "Drill title in English",
  title_ur: "اردو میں ڈرل کا عنوان",
  description: "Brief description in English",
  description_ur: "اردو میں مختصر تفصیل",
  type: "CASE_STUDY" | "ANALYTICS" | "BLOG",
  content: JSON.stringify({ /* see below */ }),
  order_index: 1,               // Display order
  is_active: true
}
```

### Content Structure (for ANALYTICS type)

```javascript
{
  sections: [
    {
      title: "Section Title",
      content: "Section content text",
      order: 1,
      charts: ["Chart description 1", "Chart description 2"]  // Optional
    }
  ],
  analytics: {
    stopLossPips: 35,
    takeProfitPips: 60,
    riskRewardRatio: 1.71,
    entryPrice: 1.1740,
    stopLoss: 1.1775,
    takeProfit: 1.1680,
    confidence: 65,
    historicalSuccessRate: 67,
    averageDuration: "2-4 hours",
    volumeConfirmation: "Required",
    keyLevel: "1.1729-1.1750 resistance"
  }
}
```

### Optional Fields

```javascript
{
  content_ur: JSON.stringify({ /* localized content */ }),
  image_url: "/images/drills/drill-image.jpg"
}
```

---

## Common Drill Types

### ANALYTICS
Interactive dashboard with metrics, charts, and performance data.
- Real-time price tracking
- MFE/MAE analysis
- Historical performance
- Risk metrics

### CASE_STUDY
Deep-dive educational content analyzing a specific trade setup.
- Background and context
- Technical analysis breakdown
- Entry/exit strategy
- Post-trade review

### BLOG
Article-style educational content.
- Trading psychology
- Strategy explanations
- Market commentary
- Educational guides

---

## Validation Rules

### Signal Validation
- ✅ `action` must be "BUY" or "SELL"
- ✅ `confidence` must be 1-100
- ✅ `market` must be FOREX, CRYPTO, PSX, or COMMODITIES
- ✅ `status` must be ACTIVE, CLOSED, or CANCELLED
- ✅ `priority` must be HIGH, MEDIUM, or LOW
- ✅ `published_date` must be valid date string

### Drill Validation
- ✅ `signal_id` must reference existing signal
- ✅ `type` must be CASE_STUDY, ANALYTICS, or BLOG
- ✅ `content` must be valid JSON string
- ✅ Drill will be deleted if parent signal is deleted (CASCADE)

---

## Example: Complete Signal + Drill

```javascript
// Signal
const signal = {
  title: "GBP/USD: Bullish Reversal at Support",
  title_ur: "جی‌بی‌پی/یو‌ڈی: سپورٹ پر تیزی کی واپسی",
  content: `GBP/USD has reached key support at 1.2650. Multiple indicators suggest oversold conditions with bullish divergence on RSI. Expecting bounce to 1.2750 resistance.`,
  content_ur: `جی‌بی‌پی/یو‌ڈی 1.2650 پر اہم سپورٹ تک پہنچ گیا ہے۔ متعدد اشارے زیادہ فروخت کی صورتحال کی تجویز کرتے ہیں۔`,
  pair: "GBP/USD",
  action: "BUY",
  entry: 1.2650,
  stop_loss: 1.2600,
  take_profit: 1.2750,
  confidence: 78,
  market: "FOREX",
  priority: "HIGH",
  author: "Sarah Mitchell",
  author_ur: "سارہ مچل",
  published_date: new Date().toISOString().split('T')[0],
  key_levels: {
    support: [1.2600, 1.2550],
    resistance: [1.2750, 1.2800]
  },
  analyst_stats: {
    successRate: 82,
    totalSignals: 145,
    totalPips: 2100
  }
};

// Drill
const drill = {
  signal_id: null, // Will be set after signal creation
  title: "Support Zone Trading — Timing the Perfect Entry",
  title_ur: "سپورٹ زون ٹریڈنگ — بہترین انٹری کا وقت",
  description: "Learn how to identify and trade support zones with confluence factors",
  description_ur: "سنگم عوامل کے ساتھ سپورٹ زونز کی شناخت اور تجارت سیکھیں",
  type: "CASE_STUDY",
  content: JSON.stringify({
    sections: [
      {
        title: "What is a Support Zone?",
        content: "A support zone is a price area where buying pressure historically exceeds selling pressure...",
        order: 1
      },
      {
        title: "Multiple Timeframe Analysis",
        content: "We identified this support on the daily chart, confirmed by weekly pivot...",
        order: 2
      }
    ]
  }),
  order_index: 1,
  is_active: true
};
```

---

## Best Practices

### Content Quality
1. **Be Specific:** Include actual price levels, not vague references
2. **Add Context:** Explain WHY the signal is valid
3. **Risk Management:** Always specify stop loss and take profit
4. **Honesty:** Set realistic confidence levels (65-85% is common)

### Translations
1. **Professional Translation:** Use native speakers for Urdu content
2. **Technical Terms:** Keep some English terms (e.g., "Stop Loss", "RSI")
3. **Numbers:** Keep numbers in Western format (1.1740, not ۱.۱۷۴۰)
4. **Consistency:** Match tone and detail level in both languages

### Drills
1. **Educational Value:** Focus on teaching, not just describing
2. **Interactive Elements:** Include quizzes, charts, metrics
3. **Progressive Difficulty:** Start simple, build complexity
4. **Actionable Takeaways:** End with clear rules/guidelines

### Images
1. **Chart Images:** 1200x800px, annotated with levels
2. **Analyst Photos:** 200x200px, professional headshot
3. **Drill Images:** 800x600px, descriptive graphics
4. **Format:** JPG for photos, PNG for charts/graphics

---

## Scripts Available

### Main Scripts
- `add-eurusd-signal-drill.mjs` - Template for adding signal + drill
- `add-drill-only.mjs` - Add drill to existing signal
- `verify-data.mjs` - Verify signal/drill was added correctly

### Running Scripts
```bash
# Add new signal and drill
node scripts/add-eurusd-signal-drill.mjs

# Add drill only (if signal exists)
node scripts/add-drill-only.mjs

# Verify the data
node scripts/verify-data.mjs
```

---

## Troubleshooting

### Common Errors

**Error: Missing required field**
- Check all required fields are present
- Verify spelling matches database column names

**Error: violates check constraint "drills_type_check"**
- Type must be exactly: `CASE_STUDY`, `ANALYTICS`, or `BLOG`
- Check for typos like `ANALYTICS_CASE_STUDY`

**Error: foreign key constraint**
- Signal must exist before creating drill
- Verify signal_id is correct

**Error: invalid JSON**
- Use `JSON.stringify()` for content field
- Test JSON validity with `JSON.parse()`

### Database Issues

**Signal not appearing?**
- Check status is "ACTIVE"
- Verify is_active is true (for drills)
- Check published_date is not in future

**Missing translations?**
- Ensure title_ur, content_ur are populated
- API should fall back to English if missing
- Check locale parameter in API call

---

## API Testing

After adding signal/drill, test with:

```bash
# Get signal (English)
curl http://localhost:5000/api/signals/10

# Get signal (Urdu)
curl http://localhost:5000/api/signals/10?locale=ur

# Get drill
curl http://localhost:5000/api/drills/18

# Get all drills for signal
curl http://localhost:5000/api/drills?signal_id=10

# Get all active signals
curl http://localhost:5000/api/signals?status=ACTIVE
```

---

## Next Steps

1. ✅ Create signal data
2. ✅ Create drill data (if applicable)
3. ✅ Run insert script
4. ✅ Verify with verification script
5. ✅ Test API endpoints
6. 📸 Create visual assets (images)
7. 🎨 Test frontend display
8. 📝 Document in `/Documentation/popups/`

---

**Last Updated:** 2025-10-04
**Maintained By:** Development Team
