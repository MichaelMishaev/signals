# 🎯 Custom Drills - Complete Guide

## ✅ **YES! Now Supports Custom Drills**

You can now import:
- **1 Signal** + **Any Number of Custom Drills**
- Or just a signal (3 drills auto-generated)

---

## 🎨 **Two Import Methods**

### **Method 1: Auto-Generated Drills** (Default)
Just provide signal data. System auto-generates 3 drills:
1. Technical Analysis Deep Dive (CASE_STUDY)
2. Real-Time Analytics Dashboard (ANALYTICS)
3. Market Context & News (BLOG)

**JSON**:
```json
{
  "title": "EUR/USD BUY Signal",
  "pair": "EUR/USD",
  "action": "BUY",
  "entry": 1.0850,
  "confidence": 87,
  "market": "FOREX",
  "author": "Ahmad Ali"
}
```

### **Method 2: Custom Drills** (Full Control)
Provide your own drills in the JSON:

**JSON**:
```json
{
  "title": "EUR/USD BUY Signal",
  "pair": "EUR/USD",
  "action": "BUY",
  "entry": 1.0850,
  "confidence": 87,
  "market": "FOREX",
  "author": "Ahmad Ali",
  "drills": [
    {
      "title": "My Custom Analysis",
      "description": "Detailed technical breakdown",
      "type": "CASE_STUDY",
      "content": "# Full analysis here...\n\nYour content...",
      "order_index": 1
    },
    {
      "title": "Performance Metrics",
      "description": "Live analytics dashboard",
      "type": "ANALYTICS",
      "content": "# Dashboard content...",
      "order_index": 2
    }
  ]
}
```

---

## 📊 **Drill Structure**

### **Required Fields**:
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | String | Drill title | "EUR/USD Technical Analysis" |
| `description` | String | Short description | "Complete breakdown of factors" |
| `type` | String | Drill type | "CASE_STUDY", "BLOG", or "ANALYTICS" |
| `content` | String | Main content (Markdown) | "# Analysis\n\nDetails here..." |

### **Optional Fields**:
| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `title_ur` | String | Urdu title | null |
| `description_ur` | String | Urdu description | null |
| `content_ur` | String | Urdu content | null |
| `order_index` | Number | Display order | Auto (1, 2, 3...) |
| `is_active` | Boolean | Show/hide drill | true |
| `image_url` | String | Drill image path | null |

---

## 🔧 **Drill Types**

### **CASE_STUDY**
For detailed analysis and breakdowns:
- Technical analysis
- Trade setup explanations
- Historical patterns
- Strategy deep dives

### **ANALYTICS**
For data and metrics:
- Performance dashboards
- Statistics and charts
- Real-time tracking
- Risk-reward calculations

### **BLOG**
For narrative content:
- Market commentary
- News analysis
- Educational content
- Expert opinions

---

## 📝 **Complete Example**

See: `sample-signal-with-drills.json`

```json
{
  "title": "EUR/USD Strong BUY Signal",
  "title_ur": "EUR/USD مضبوط خریداری کا سگنل",
  "content": "Technical analysis shows bullish momentum...",
  "pair": "EUR/USD",
  "action": "BUY",
  "entry": 1.0850,
  "stop_loss": 1.0820,
  "take_profit": 1.0920,
  "confidence": 87,
  "market": "FOREX",
  "status": "ACTIVE",
  "priority": "HIGH",
  "author": "Ahmad Ali",
  "drills": [
    {
      "title": "EUR/USD Technical Deep Dive",
      "title_ur": "EUR/USD تکنیکی تجزیہ",
      "description": "Complete technical analysis breakdown",
      "description_ur": "مکمل تکنیکی تجزیہ",
      "type": "CASE_STUDY",
      "content": "# Technical Analysis\n\n## Overview\nDetailed analysis here...\n\n## Key Levels\n- Entry: 1.0850\n- Stop Loss: 1.0820\n- Take Profit: 1.0920",
      "content_ur": "# تکنیکی تجزیہ\n\nتفصیلی تجزیہ...",
      "order_index": 1,
      "is_active": true,
      "image_url": "/images/drills/eurusd-analysis.jpg"
    },
    {
      "title": "Performance Dashboard",
      "description": "Live metrics and tracking",
      "type": "ANALYTICS",
      "content": "# Dashboard\n\nReal-time metrics...",
      "order_index": 2
    },
    {
      "title": "Market Context",
      "description": "Fundamental factors",
      "type": "BLOG",
      "content": "# Why This Trade\n\nMarket analysis...",
      "order_index": 3
    }
  ]
}
```

---

## 🚀 **How to Import**

### **Via Admin Interface**:
1. Go to: `https://www.pipguru.club/admin/signal-import`
2. Password: `6262`
3. Paste your JSON (with or without drills)
4. Click "Import Signal & Generate Drills"
5. Get live URL instantly!

### **Via CLI Tool**:
```bash
node import-signals-from-json.js my-signal-with-drills.json
```

---

## 💡 **Pro Tips**

### **Content Formatting**:
- Use Markdown for `content` field
- Support for headers, lists, bold, italic
- Line breaks with `\n\n`
- Example:
  ```json
  "content": "# Title\n\n## Subtitle\n\n- Point 1\n- Point 2\n\n**Bold text**"
  ```

### **Order Control**:
- Use `order_index` to control display order
- Start from 1
- Gaps are OK (1, 3, 5)
- If omitted, auto-assigned (1, 2, 3...)

### **Bilingual Content**:
- Always include both English and Urdu
- Users will see their preferred language
- Falls back to English if Urdu missing

### **Drill Limits**:
- **No limit** on number of drills
- Typical: 2-5 drills per signal
- More drills = more content for users

---

## ✅ **Validation**

### **What Gets Checked**:
✅ Signal required fields (title, pair, action, etc.)
✅ Drill required fields (title, description, type, content)
✅ Valid enum values (action, market, type, status)
✅ Number ranges (confidence 0-100)

### **What's NOT Checked**:
- Content quality
- Markdown syntax
- Image URLs existence
- Urdu translations accuracy

---

## 🎯 **Use Cases**

### **Quick Import** (Auto-Drills):
```json
{
  "title": "Quick Signal",
  "pair": "BTC/USDT",
  "action": "BUY",
  "entry": 45000,
  "confidence": 85,
  "market": "CRYPTO",
  "author": "Trader"
}
```
→ Gets 3 auto-generated drills

### **Custom Educational Content**:
```json
{
  "title": "Educational Signal",
  "pair": "EUR/USD",
  ...
  "drills": [
    { "type": "CASE_STUDY", "title": "Lesson 1", ... },
    { "type": "CASE_STUDY", "title": "Lesson 2", ... },
    { "type": "CASE_STUDY", "title": "Lesson 3", ... },
    { "type": "ANALYTICS", "title": "Practice", ... }
  ]
}
```
→ Uses your custom lessons

### **Minimal Analytics**:
```json
{
  "title": "Quick Update",
  "pair": "USD/JPY",
  ...
  "drills": [
    { "type": "ANALYTICS", "title": "Quick Stats", ... }
  ]
}
```
→ Just 1 drill with stats

---

## 🐛 **Troubleshooting**

### "Missing required field: title"
- **In signal**: Add signal title
- **In drill**: Add drill title to each drill object

### "type must be one of: CASE_STUDY, BLOG, ANALYTICS"
- Use exact uppercase spelling
- Check for typos

### "drills array is empty"
- Either remove `drills` field entirely (for auto-generation)
- Or provide at least 1 drill object

### Custom drills not showing
- Check `is_active` is `true` or omitted
- Verify drill has `content` field
- Check database for created drills

---

## 📦 **Sample Files**

- **Signal only**: `sample-signals.json`
- **Signal + Drills**: `sample-signal-with-drills.json`

Both files in project root!

---

## 🔗 **Related Docs**

- **Signal Import Guide**: `SIGNAL-IMPORT-GUIDE.md`
- **Signals Management**: `SIGNALS-MANAGEMENT.md`

---

**Created**: 2025-10-10
**Version**: 2.0 (Custom Drills Support)
