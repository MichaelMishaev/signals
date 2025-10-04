# Signal & Drill JSON Format Documentation

This directory contains the exact JSON structure required for inserting signals and drills into the database.

## 🤖 For AI/LLM Agents

**IMPORTANT INSTRUCTIONS FOR GENERATIVE AI:**

1. **One Signal = Multiple Drills (2-3 recommended)**
   - Each drill becomes a separate **TAB** on the signal detail page
   - Use different `type` values: `CASE_STUDY`, `ANALYTICS`, `BLOG`
   - Set `order_index` to control tab order (1, 2, 3...)

2. **Workflow:**
   - Step 1: Create **ONE signal** → Get `signal.id` from response
   - Step 2: Create **MULTIPLE drills** using the same `signal_id`
   - Step 3: Each drill = New tab on `/signal/{id}` page

3. **Example for AI to follow:**
   ```
   Signal ID 8 created
   → Drill 1: type="CASE_STUDY", order_index=1 (Tab 1)
   → Drill 2: type="ANALYTICS", order_index=2 (Tab 2)
   → Drill 3: type="BLOG", order_index=3 (Tab 3)
   Result: 3 tabs on signal detail page
   ```

---

## 📁 Files

- `signal-format.json` - Template for creating a new trading signal
- `drill-format.json` - Template for creating ONE drill linked to a signal
- `multi-drill-example.json` - ⭐ **COMPLETE EXAMPLE** showing 1 signal + 3 drills (recommended for AI)

---

## 📄 Complete JSON Examples

### Signal JSON Example
```json
{
  "title": "BTC/USD: Rejection near 116k resistance — short bias",
  "title_ur": "بی ٹی سی/یو ایس ڈی: 116k مزاحمت کے قریب ردِ عمل — شارٹ رجحان",
  "content": "Bitcoin is trading at ~$122,559 and facing resistance in the ~116,000–121,000 zone.",
  "content_ur": "بی ٹی سی تقریباً $122,559 پر ہے اور ~116,000–121,000 کے مزاحمت زون کا سامنا کر رہا ہے۔",
  "pair": "BTCUSD",
  "action": "SELL",
  "entry": 115800,
  "stop_loss": 121200,
  "take_profit": 113340,
  "current_price": 122559,
  "confidence": 62,
  "market": "CRYPTO",
  "status": "ACTIVE",
  "priority": "MEDIUM",
  "author": "LiveDataAnalyst",
  "author_ur": "لائیو ڈیٹا اینالسٹ",
  "author_image": "/images/analysts/livedata.jpg",
  "chart_image": "/images/charts/btcusd/2025-10-04-signal-3001.png",
  "key_levels": {
    "support": [113340.22, 112030.93],
    "resistance": [116134.46, 117443.75, 121000.0],
    "notes": "Key resistance zone 116k–121k; invalidation if breaks above 121k convincingly"
  },
  "analyst_stats": {
    "successRate": 57,
    "totalSignals": 180,
    "totalPips": 0
  },
  "published_date": "2025-10-04T16:30:00+03:00"
}
```

### Drill JSON Examples (Create 2-3 per signal)

**Drill 1: CASE_STUDY**
```json
{
  "signal_id": 12,
  "title": "Trading Rejection at Resistance — BTC/USD Real Levels Drill",
  "title_ur": "مزاحمت پر ردِ عمل کی تجارت — BTC/USD حقیقی سطحوں کا ڈرل",
  "description": "A case study + analytics drill using real BTC/USD levels",
  "description_ur": "حقیقی BTC/USD سطحوں کے ساتھ کیس اسٹڈی + تجزیاتی ڈرل",
  "type": "CASE_STUDY",
  "content": "## 1. Market Backdrop & Price Context\nBTC/USD sits at ~122,559. Resistance clusters appear from **116,000 to 121,000**...",
  "content_ur": "## 1. مارکیٹ پس منظر اور قیمت کا تناظر\nبی ٹی سی / یو ایس ڈی تقریباً $122,559 پر ہے...",
  "order_index": 1,
  "is_active": true,
  "image_url": "/images/charts/btcusd/2025-10-04-signal-3001-markups.png"
}
```

**Drill 2: ANALYTICS**
```json
{
  "signal_id": 12,
  "title": "Real-Time Performance Metrics Dashboard",
  "description": "Live analytics: MFE, MAE, R:R ratio tracking",
  "type": "ANALYTICS",
  "content": "# Live Analytics Dashboard\n\n## Current Trade Status\n**Entry**: 115,800\n**Current**: 122,559\n**Unrealized P&L**: -6,759 points...",
  "order_index": 2,
  "is_active": true,
  "image_url": "/images/drills/analytics-dashboard.png"
}
```

**Drill 3: BLOG**
```json
{
  "signal_id": 12,
  "title": "Market Psychology at Major Resistance Zones",
  "description": "Understanding crowd behavior and trading psychology",
  "type": "BLOG",
  "content": "# The Psychology of Resistance Trading\n\n## Why Round Numbers Matter\nWhen BTC approaches major levels like $125k...",
  "order_index": 3,
  "is_active": true,
  "image_url": "/images/drills/psychology.png"
}
```

---

## 🚀 How to Use

### Step 1: Create a Signal

**Endpoint:** `POST http://localhost:5000/api/signals`

**Request:**
```bash
curl -X POST http://localhost:5000/api/signals \
  -H "Content-Type: application/json" \
  -d @signal-format.json
```

**Response:**
```json
{
  "signal": {
    "id": 8,
    "title": "BTC/USD: Rejection under key resistance — short opportunity",
    "pair": "BTCUSD",
    ...
  },
  "message": "Signal created successfully"
}
```

**⚠️ IMPORTANT:** Save the returned `id` value (e.g., `8`) - you'll need it for the drill!

---

### Step 2: Create Drills (Multiple Tab-Separated Content)

**Endpoint:** `POST http://localhost:5000/api/drills`

**🎯 IMPORTANT:** One signal can have **multiple drills** that appear as **separate tabs** on the signal detail page.

**Best Practice:**
- Create **2-3 drills per signal** for rich educational content
- Each drill appears as a separate tab (e.g., "CASE STUDY", "ANALYTICS", "BLOG")
- Use `order_index` to control tab order (1, 2, 3...)

#### Example: Creating 3 Drills for Signal ID 8

**Drill 1: CASE_STUDY (order_index: 1)**
```bash
curl -X POST http://localhost:5001/api/drills \
  -H "Content-Type: application/json" \
  -d '{
    "signal_id": 8,
    "title": "Technical Analysis Deep Dive",
    "description": "Complete breakdown of the setup",
    "type": "CASE_STUDY",
    "content": "# Market Context\n\nDetailed analysis...",
    "order_index": 1,
    "is_active": true
  }'
```

**Drill 2: ANALYTICS (order_index: 2)**
```bash
curl -X POST http://localhost:5001/api/drills \
  -H "Content-Type: application/json" \
  -d '{
    "signal_id": 8,
    "title": "Real-Time Performance Metrics",
    "description": "Live analytics dashboard",
    "type": "ANALYTICS",
    "content": "# Key Metrics\n\nMFE, MAE, RR ratio...",
    "order_index": 2,
    "is_active": true
  }'
```

**Drill 3: BLOG (order_index: 3)**
```bash
curl -X POST http://localhost:5001/api/drills \
  -H "Content-Type: application/json" \
  -d '{
    "signal_id": 8,
    "title": "Market Commentary & Insights",
    "description": "Expert analysis and context",
    "type": "BLOG",
    "content": "# Why This Setup Works\n\nMarket insights...",
    "order_index": 3,
    "is_active": true
  }'
```

**Result:** Signal page shows 3 tabs:
```
📚 CASE STUDY  |  📊 ANALYTICS  |  📝 BLOG
```

---

## 📋 Signal Fields Reference

| Field | Type | Required | Valid Values | Notes |
|-------|------|----------|--------------|-------|
| `title` | string | ✅ | Any text | English title |
| `title_ur` | string | ⚪ | Any text | Urdu title |
| `content` | string | ✅ | Any text | Signal description (English) |
| `content_ur` | string | ⚪ | Any text | Signal description (Urdu) |
| `pair` | string | ✅ | e.g., "BTCUSD", "EURUSD" | Trading pair |
| `action` | string | ✅ | "BUY" or "SELL" | Trade direction |
| `entry` | number | ✅ | Any number | Entry price |
| `stop_loss` | number | ✅ | Any number | Stop loss price |
| `take_profit` | number | ✅ | Any number | Take profit price |
| `current_price` | number | ⚪ | Any number | Current market price |
| `confidence` | number | ✅ | 0-100 | Confidence percentage |
| `market` | string | ✅ | "FOREX", "CRYPTO", "COMMODITIES", "PSX" | Market category |
| `status` | string | ⚪ | "ACTIVE", "CLOSED", "CANCELLED" | Default: "ACTIVE" |
| `priority` | string | ⚪ | "HIGH", "MEDIUM", "LOW" | Default: "MEDIUM" |
| `author` | string | ✅ | Any text | Analyst name (English) |
| `author_ur` | string | ⚪ | Any text | Analyst name (Urdu) |
| `author_image` | string | ⚪ | URL/path | Analyst photo |
| `chart_image` | string | ⚪ | URL/path | Chart image |
| `key_levels` | object | ⚪ | `{support: [], resistance: []}` | Technical levels |
| `analyst_stats` | object | ⚪ | `{successRate, totalSignals, totalPips}` | Performance stats |
| `published_date` | string | ✅ | ISO 8601 date | Publication timestamp |

---

## 📋 Drill Fields Reference

| Field | Type | Required | Valid Values | Notes |
|-------|------|----------|--------------|-------|
| `signal_id` | number | ✅ | Signal ID | From signal creation response |
| `title` | string | ✅ | Any text | Drill title (English) |
| `title_ur` | string | ⚪ | Any text | Drill title (Urdu) |
| `description` | string | ✅ | Any text | Short description (English) |
| `description_ur` | string | ⚪ | Any text | Short description (Urdu) |
| `type` | string | ✅ | "CASE_STUDY", "ANALYTICS", "BLOG" | Drill category |
| `content` | string | ✅ | Markdown text | Main content (English) |
| `content_ur` | string | ⚪ | Markdown text | Main content (Urdu) |
| `order_index` | number | ✅ | 1, 2, 3... | Display order |
| `is_active` | boolean | ⚪ | true/false | Default: true |
| `image_url` | string | ⚪ | URL/path | Featured image for drill |

---

## 📊 Optional Parameters Guide: Graphs, Charts & Visual Data

### Overview of Optional Visual Elements

Both **Signals** and **Drills** support optional visual elements that enhance the trading analysis experience. Here's a complete guide to using these features.

---

### 🎯 Signal-Level Optional Parameters

#### 1. Chart Images (`chart_image`)
Display a trading chart image in the analytics drill.

**Example:**
```json
{
  "chart_image": "/images/charts/btcusd/2025-10-04-signal-3001.png"
}
```

**Usage:**
- Place chart images in `/public/images/charts/[pair]/`
- Supported formats: PNG, JPG, WEBP
- Recommended size: 1200x600px or larger
- Displayed in ANALYTICS drills automatically

---

#### 2. Key Levels Data (`key_levels`)
JSON structure for support and resistance levels that create interactive level displays.

**Complete Structure:**
```json
{
  "key_levels": {
    "support": [113340.22, 112030.93, 110500.00],
    "resistance": [116134.46, 117443.75, 121000.00],
    "notes": "Key resistance zone 116k–121k; invalidation if breaks above 121k convincingly"
  }
}
```

**Field Details:**
| Field | Type | Description |
|-------|------|-------------|
| `support` | number[] | Array of support price levels (ascending order) |
| `resistance` | number[] | Array of resistance price levels (ascending order) |
| `notes` | string | Optional notes about the levels |

**Visual Result:**
Creates a split-panel display showing:
- **Support Levels** (Red background) - S1, S2, S3...
- **Resistance Levels** (Green background) - R1, R2, R3...

**Example with Multiple Levels:**
```json
{
  "key_levels": {
    "support": [1.0800, 1.0820, 1.0850],
    "resistance": [1.0920, 1.0950, 1.0980],
    "notes": "Strong support cluster at 1.08; resistance near 1.095"
  }
}
```

---

#### 3. Analyst Statistics (`analyst_stats`)
Performance metrics displayed in ANALYTICS drills.

**Complete Structure:**
```json
{
  "analyst_stats": {
    "successRate": 78,
    "totalSignals": 150,
    "totalPips": 1250
  }
}
```

**Field Details:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `successRate` | number | ✅ | Win rate percentage (0-100) |
| `totalSignals` | number | ✅ | Total signals published |
| `totalPips` | number | ⚪ | Total pips gained (optional) |

**Visual Result:**
Creates a 3-column statistics panel showing:
- **78%** Success Rate
- **150** Signals Published
- **+1250** Total Pips

**Example Without Pips:**
```json
{
  "analyst_stats": {
    "successRate": 65,
    "totalSignals": 200
  }
}
```
*Note: If `totalPips` is omitted or null, only 2 columns display.*

---

#### 4. Color Schemes (`colors`)
Custom color coding for signal display (future feature).

```json
{
  "colors": {
    "primary": "#10B981",
    "secondary": "#3B82F6",
    "accent": "#F59E0B"
  }
}
```
*Currently in schema but not yet implemented in UI.*

---

### 🖼️ Drill-Level Optional Parameters

#### 1. Featured Image (`image_url`)
Hero image displayed at the top of the drill content.

**Example:**
```json
{
  "image_url": "/images/drills/btcusd-analysis-2025-10.png"
}
```

**Best Practices:**
- Store in `/public/images/drills/`
- Use descriptive filenames: `[pair]-[type]-[date].png`
- Recommended size: 1200x400px (banner style)
- Formats: PNG, JPG, WEBP

**Example Drill with Image:**
```json
{
  "signal_id": 12,
  "title": "BTC/USD Technical Breakdown",
  "description": "Detailed chart analysis with key levels",
  "type": "CASE_STUDY",
  "content": "# Analysis\n\nDetailed content here...",
  "order_index": 1,
  "is_active": true,
  "image_url": "/images/drills/btcusd-breakdown-2025-10-04.png"
}
```

---

#### 2. Urdu Translations
Optional multilingual support for Pakistani/Urdu-speaking users.

**Fields:**
- `title_ur` - Urdu version of title
- `description_ur` - Urdu version of description
- `content_ur` - Urdu version of full content

**Example:**
```json
{
  "title": "BTC/USD Technical Analysis",
  "title_ur": "بی ٹی سی/یو ایس ڈی تکنیکی تجزیہ",
  "description": "Complete breakdown of the technical setup",
  "description_ur": "تکنیکی سیٹ اپ کی مکمل تفصیل",
  "content": "# Market Context\n\nDetailed analysis...",
  "content_ur": "# مارکیٹ کا پس منظر\n\nتفصیلی تجزیہ..."
}
```

---

### 📈 Complete Example: Signal with All Optional Parameters

```json
{
  "title": "BTC/USD: Rejection near 116k resistance",
  "title_ur": "بی ٹی سی/یو ایس ڈی: 116k مزاحمت کے قریب ردِ عمل",
  "content": "Bitcoin facing strong resistance...",
  "content_ur": "بٹ کوائن مضبوط مزاحمت کا سامنا کر رہا ہے...",
  "pair": "BTCUSD",
  "action": "SELL",
  "entry": 115800,
  "stop_loss": 121200,
  "take_profit": 113340,
  "current_price": 122559,
  "confidence": 62,
  "market": "CRYPTO",
  "status": "ACTIVE",
  "priority": "MEDIUM",
  "author": "LiveDataAnalyst",
  "author_ur": "لائیو ڈیٹا اینالسٹ",
  "published_date": "2025-10-04T16:30:00+03:00",

  // ✨ OPTIONAL: Chart image
  "chart_image": "/images/charts/btcusd/btc-2025-10-04.png",

  // ✨ OPTIONAL: Author image
  "author_image": "/images/analysts/livedata.jpg",

  // ✨ OPTIONAL: Technical levels for graph display
  "key_levels": {
    "support": [113340.22, 112030.93, 110000.00],
    "resistance": [116134.46, 117443.75, 121000.00],
    "notes": "Major resistance zone 116k-121k"
  },

  // ✨ OPTIONAL: Analyst performance metrics
  "analyst_stats": {
    "successRate": 57,
    "totalSignals": 180,
    "totalPips": 890
  },

  // ✨ OPTIONAL: Color scheme (future feature)
  "colors": {
    "primary": "#EF4444",
    "secondary": "#10B981"
  }
}
```

---

### 📊 Complete Example: Analytics Drill with Chart Data

```json
{
  "signal_id": 12,
  "title": "Real-Time Performance Dashboard",
  "title_ur": "حقیقی وقت کی کارکردگی ڈیش بورڈ",
  "description": "Live analytics with MFE, MAE, and R:R tracking",
  "description_ur": "MFE، MAE اور R:R ٹریکنگ کے ساتھ لائیو تجزیات",
  "type": "ANALYTICS",
  "content": "# Live Trade Analytics\n\n## Current Status\n- Entry: 115,800\n- Current: 122,559\n- Unrealized P&L: -6,759 points\n\n## Key Metrics\n- **MFE (Maximum Favorable Excursion):** +450 points\n- **MAE (Maximum Adverse Excursion):** -6,800 points\n- **R:R Ratio:** 1:2.3\n- **Win Probability:** 62%\n\n## Technical Analysis\nPrice is testing the resistance zone. Watch for:\n1. Break above 121k = invalidation\n2. Rejection = continuation lower\n3. Consolidation = wait for clarity",
  "content_ur": "# لائیو ٹریڈ تجزیات\n\n[Urdu content...]",
  "order_index": 2,
  "is_active": true,

  // ✨ OPTIONAL: Featured drill image
  "image_url": "/images/drills/analytics-dashboard-btc.png"
}
```

**What Gets Displayed:**
1. **Drill image** - Banner at top of drill
2. **Signal chart** - From parent signal's `chart_image`
3. **Key levels table** - From parent signal's `key_levels`
4. **Analyst stats** - From parent signal's `analyst_stats`
5. **Markdown content** - Formatted drill content

---

### 🎨 Image Organization Best Practices

```
public/
├── images/
│   ├── charts/           # Signal chart images
│   │   ├── btcusd/
│   │   │   ├── btc-2025-10-04-signal-3001.png
│   │   │   └── btc-2025-10-05-signal-3002.png
│   │   ├── eurusd/
│   │   └── xauusd/
│   │
│   ├── drills/           # Drill featured images
│   │   ├── analytics-dashboard.png
│   │   ├── case-study-btc-breakdown.png
│   │   └── blog-market-psychology.png
│   │
│   └── analysts/         # Analyst profile images
│       ├── livedata.jpg
│       ├── forexexpert.jpg
│       └── cryptoanalyst.jpg
```

---

### ⚡ Quick Reference: When to Use Optional Parameters

| Feature | Use When | Example Use Case |
|---------|----------|------------------|
| `chart_image` | You have a trading chart screenshot | TradingView chart with annotations |
| `key_levels` | Signal has support/resistance levels | Forex/Crypto levels for analysis |
| `analyst_stats` | Showing analyst track record | Performance metrics display |
| `image_url` (drill) | Drill needs visual context | Featured image for blog/case study |
| `author_image` | Personalizing analyst identity | Analyst profile photo |
| `*_ur` fields | Supporting Urdu-speaking users | Pakistani trader audience |

---

### 🚀 Minimal vs. Complete Examples

**Minimal Signal (Required Only):**
```json
{
  "title": "EUR/USD BUY Signal",
  "content": "Euro showing strength",
  "pair": "EURUSD",
  "action": "BUY",
  "entry": 1.0850,
  "stop_loss": 1.0820,
  "take_profit": 1.0920,
  "confidence": 75,
  "market": "FOREX",
  "author": "ForexExpert",
  "published_date": "2025-10-04T10:00:00Z"
}
```

**Complete Signal (All Optionals):**
```json
{
  "title": "EUR/USD BUY Signal",
  "title_ur": "یورو/ڈالر خریداری سگنل",
  "content": "Euro showing strength",
  "content_ur": "یورو طاقت دکھا رہا ہے",
  "pair": "EURUSD",
  "action": "BUY",
  "entry": 1.0850,
  "stop_loss": 1.0820,
  "take_profit": 1.0920,
  "current_price": 1.0870,
  "confidence": 75,
  "market": "FOREX",
  "status": "ACTIVE",
  "priority": "HIGH",
  "author": "ForexExpert",
  "author_ur": "فاریکس ماہر",
  "author_image": "/images/analysts/forex-expert.jpg",
  "chart_image": "/images/charts/eurusd/eur-2025-10-04.png",
  "published_date": "2025-10-04T10:00:00Z",
  "key_levels": {
    "support": [1.0820, 1.0800, 1.0780],
    "resistance": [1.0920, 1.0950, 1.0980]
  },
  "analyst_stats": {
    "successRate": 78,
    "totalSignals": 150,
    "totalPips": 1250
  }
}
```

---

## 💡 Tips

### Market Types
- **FOREX**: Currency pairs (EURUSD, GBPJPY, etc.)
- **CRYPTO**: Cryptocurrencies (BTCUSD, ETHUSD, etc.)
- **COMMODITIES**: Gold, Oil, etc. (XAUUSD, XAGUSD, etc.)
- **PSX**: Pakistan Stock Exchange

### Drill Types (Use Multiple Per Signal!)
- **CASE_STUDY**: Educational breakdown with technical analysis (Tab 1)
- **ANALYTICS**: Live performance metrics and charts (Tab 2)
- **BLOG**: Market commentary and insights (Tab 3)

**💡 Pro Tip:** Always create at least 2 drills per signal for better user engagement

### Content Formatting
- Drill `content` supports **Markdown** syntax
- Use `\n` for line breaks in JSON
- Headings: `# Heading`, `## Subheading`
- Lists: `- Item 1`, `- Item 2`

### Date Format
- Use ISO 8601: `2025-10-04T11:00:00+03:00`
- Include timezone offset
- UTC example: `2025-10-04T08:00:00Z`

---

## 🔄 Complete Workflow Example (With Multiple Drills)

```bash
# 1. Create signal
curl -X POST http://localhost:5001/api/signals \
  -H "Content-Type: application/json" \
  -d '{
    "title": "EUR/USD: Bullish Breakout",
    "content": "Euro showing strength...",
    "pair": "EURUSD",
    "action": "BUY",
    "entry": 1.0850,
    "stop_loss": 1.0820,
    "take_profit": 1.0920,
    "confidence": 75,
    "market": "FOREX",
    "author": "ForexExpert",
    "published_date": "2025-10-04T10:00:00Z"
  }'

# Response: { "signal": { "id": 9, ... } }

# 2. Create FIRST drill (Tab 1: CASE_STUDY)
curl -X POST http://localhost:5001/api/drills \
  -H "Content-Type: application/json" \
  -d '{
    "signal_id": 9,
    "title": "EUR/USD Technical Breakdown",
    "description": "Complete analysis of the bullish setup",
    "type": "CASE_STUDY",
    "content": "# Overview\n\nThe euro is breaking above key resistance at 1.0850...",
    "order_index": 1,
    "is_active": true
  }'

# 3. Create SECOND drill (Tab 2: ANALYTICS)
curl -X POST http://localhost:5001/api/drills \
  -H "Content-Type: application/json" \
  -d '{
    "signal_id": 9,
    "title": "Live Performance Dashboard",
    "description": "Real-time metrics and trade analysis",
    "type": "ANALYTICS",
    "content": "# Key Metrics\n\n- Entry: 1.0850\n- Risk: 30 pips\n- Reward: 70 pips\n- RR: 1:2.3",
    "order_index": 2,
    "is_active": true
  }'

# 4. Create THIRD drill (Tab 3: BLOG)
curl -X POST http://localhost:5001/api/drills \
  -H "Content-Type: application/json" \
  -d '{
    "signal_id": 9,
    "title": "ECB Policy Impact on EUR",
    "description": "Market context and fundamental analysis",
    "type": "BLOG",
    "content": "# Why Euro is Strengthening\n\nECB hints at policy shift...",
    "order_index": 3,
    "is_active": true
  }'

# ✅ Result: Signal /signal/9 will have 3 tabs!
```

---

## 📞 Support

For issues or questions:
- Check the API routes: `/src/app/api/signals/route.ts` and `/src/app/api/drills/route.ts`
- Review database schema in Supabase
- Test with demo data first before production signals
