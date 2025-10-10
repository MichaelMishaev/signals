'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SignalImportData {
  title: string;
  title_ur?: string;
  content: string;
  content_ur?: string;
  pair: string;
  action: 'BUY' | 'SELL';
  entry: number;
  stop_loss?: number;
  take_profit?: number;
  confidence: number;
  market: 'FOREX' | 'CRYPTO' | 'PSX' | 'COMMODITIES';
  status?: 'ACTIVE' | 'CLOSED' | 'CANCELLED';
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  author: string;
  author_ur?: string;
  published_date?: string;
}

export default function SignalImportPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const sampleJson = {
    // ═══════════════════════════════════════════════════════════════
    // 📊 SIGNAL = Main trading recommendation (BUY/SELL decision)
    // ═══════════════════════════════════════════════════════════════
    // A "signal" is the core trading recommendation that tells traders:
    // - WHAT to trade (pair)
    // - WHEN to enter (entry price)
    // - WHERE to exit (stop loss & take profit)
    // - WHY to trade it (content/analysis)

    title: "EUR/USD Strong BUY Signal - Bullish Momentum",
    title_ur: "EUR/USD مضبوط خریداری کا سگنل - تیزی کا رجحان",
    content: "Technical analysis shows strong bullish momentum with RSI oversold recovery and key support at 1.0820. Multiple indicators confirm upward trend. ECB policy supporting euro strength while USD shows weakness across major pairs.",
    content_ur: "تکنیکی تجزیہ مضبوط تیزی کا رجحان ظاہر کرتا ہے۔ RSI اوور سولڈ سے بحالی اور 1.0820 پر اہم سپورٹ۔",
    pair: "EUR/USD",
    action: "BUY",
    entry: 1.0850,
    stop_loss: 1.0820,
    take_profit: 1.0920,
    confidence: 87,
    market: "FOREX",
    status: "ACTIVE",
    priority: "HIGH",
    author: "Ahmad Ali",
    author_ur: "احمد علی",
    published_date: new Date().toISOString(),

    // ═══════════════════════════════════════════════════════════════
    // 🎓 DRILLS = Educational deep-dives for each signal
    // ═══════════════════════════════════════════════════════════════
    // "Drills" are educational content pieces that help users understand:
    // - HOW the signal was identified (technical analysis)
    // - WHY it's likely to work (market context)
    // - WHAT to monitor (performance tracking)
    //
    // Each drill is a separate learning module that adds value to the signal.
    // Think of it as: Signal = "What to do", Drills = "Why & How"

    drills: [
      // ─────────────────────────────────────────────────────────
      // DRILL 1: Technical Analysis (CASE_STUDY type)
      // ─────────────────────────────────────────────────────────
      // PURPOSE: Deep technical breakdown of the signal
      // USE CASE: Help traders understand the technical setup
      {
        title: "EUR/USD Technical Analysis Deep Dive",
        title_ur: "EUR/USD تکنیکی تجزیہ کی گہرائی",
        description: "Complete breakdown of technical factors driving this BUY signal. Learn the indicators, patterns, and levels behind the recommendation.",
        description_ur: "اس خریداری کے سگنل کو چلانے والے تکنیکی عوامل کی مکمل تفصیل۔",
        type: "CASE_STUDY",
        content: `# EUR/USD Technical Analysis

## 🎯 Signal Overview
Entry: 1.0850 | Stop Loss: 1.0820 | Take Profit: 1.0920
Risk:Reward Ratio: 1:2.33 (Excellent)

## 📊 Technical Indicators

### RSI (Relative Strength Index)
- Current: 58 (Bullish zone)
- Previous: 28 (Oversold - recovered)
- Signal: Bullish divergence confirming upward momentum

### Moving Averages
- 20 EMA: 1.0830 (Price above = bullish)
- 50 EMA: 1.0795 (Golden cross forming)
- 200 EMA: 1.0750 (Long-term uptrend)

### Support & Resistance
- Key Support: 1.0820 (Previous resistance, now support)
- Target 1: 1.0920 (Next resistance level)
- Target 2: 1.0980 (Psychological barrier)

## 💡 Trading Strategy
1. Enter at 1.0850 with tight stop at 1.0820
2. First target: 1.0920 (70 pips profit)
3. Trail stop to breakeven once +30 pips
4. Partial profit at 1.0900, hold rest for 1.0920

## ⚠️ Risk Management
- Risk: 30 pips (1.0850 - 1.0820)
- Reward: 70 pips (1.0920 - 1.0850)
- Position sizing: Max 2% of account`,
        content_ur: "# EUR/USD تکنیکی تجزیہ\n\nتفصیلی تکنیکی تجزیہ یہاں...",
        order_index: 1,
        is_active: true
      },

      // ─────────────────────────────────────────────────────────
      // DRILL 2: Performance Tracking (ANALYTICS type)
      // ─────────────────────────────────────────────────────────
      // PURPOSE: Real-time monitoring and metrics
      // USE CASE: Help users track signal performance
      {
        title: "Real-Time Performance Dashboard",
        title_ur: "حقیقی وقت کی کارکردگی ڈیش بورڈ",
        description: "Live performance metrics, profit tracking, and signal health monitoring. Track this signal in real-time.",
        description_ur: "لائیو کارکردگی کے میٹرکس اور سگنل کی صحت کی نگرانی۔",
        type: "ANALYTICS",
        content: `# Performance Dashboard - EUR/USD BUY

## 🟢 Signal Status: ACTIVE

### Current Metrics
- **Entry Price**: 1.0850
- **Current Price**: Monitor live
- **P&L**: Track in real-time
- **Time in Trade**: Updates automatically

### Risk Analysis
- **Stop Loss**: 1.0820 (30 pips below)
- **Take Profit**: 1.0920 (70 pips above)
- **Risk Amount**: 30 pips
- **Reward Potential**: 70 pips
- **R:R Ratio**: 1:2.33 ✅

### Signal Health Score: 87/100
- ✅ Technical Setup: Strong (9/10)
- ✅ Market Conditions: Favorable (8/10)
- ✅ Risk Management: Optimal (10/10)
- ⚠️ Volatility: Moderate (7/10)

### Historical Performance
Similar EUR/USD signals with 85%+ confidence:
- Win Rate: 72%
- Average Profit: 54 pips
- Average Hold Time: 18 hours
- Best Outcome: +120 pips
- Worst Outcome: -30 pips (stopped out)

### What to Monitor
1. ⚡ Price approaching stop loss (Alert at 1.0830)
2. 🎯 Price approaching take profit (Alert at 1.0910)
3. 📰 Major EUR or USD news releases
4. 📊 Volume changes and momentum shifts`,
        content_ur: "# کارکردگی ڈیش بورڈ\n\nحقیقی وقت کی تازہ کاریاں...",
        order_index: 2,
        is_active: true
      },

      // ─────────────────────────────────────────────────────────
      // DRILL 3: Market Context (BLOG type)
      // ─────────────────────────────────────────────────────────
      // PURPOSE: Fundamental analysis and news context
      // USE CASE: Help traders understand WHY this trade makes sense
      {
        title: "Market Context: Why EUR/USD is Rising",
        title_ur: "مارکیٹ کا سیاق و سباق: EUR/USD کیوں بڑھ رہا ہے",
        description: "Understanding the fundamental factors and market forces driving euro strength against the dollar.",
        description_ur: "ڈالر کے مقابلے میں یورو کی مضبوطی کو چلانے والے بنیادی عوامل کو سمجھنا۔",
        type: "BLOG",
        content: `# Market Context: Euro Strength Returns

## 🌍 What's Happening

The euro is showing renewed strength against the US dollar, driven by a powerful combination of technical and fundamental factors. This isn't just a random price move - there are real economic forces at play.

## 💼 Fundamental Drivers

### 1. European Central Bank (ECB) Policy
The ECB has maintained a hawkish stance, keeping interest rates elevated to combat inflation. Recent comments from ECB President Christine Lagarde suggest rates will remain "higher for longer," supporting euro demand.

### 2. Economic Data Surprises
- 📈 Eurozone GDP growth: +0.4% (Expected: +0.2%)
- 📊 Manufacturing PMI: 48.5 (Better than forecast)
- 💼 Unemployment: 6.4% (Historical lows)
- 💰 Inflation: Trending down but above target

### 3. US Dollar Weakness
The dollar is showing weakness across ALL major pairs:
- Fed dovish pivot expectations
- US Treasury yields declining
- Risk-on sentiment in global markets
- Concerns about US debt levels

## 🔍 Technical + Fundamental Alignment

This is a rare situation where both technical and fundamental analysis agree:
- **Technical**: Breakout above 1.0800, bullish indicators
- **Fundamental**: ECB hawkish, Fed dovish, euro economic data improving

## 📅 What's Next?

### This Week
- Wednesday: ECB Meeting Minutes (watch for policy hints)
- Thursday: US Jobless Claims (USD impact)
- Friday: Eurozone CPI (inflation data)

### Price Targets
- Short-term: 1.0920 (our take profit)
- Medium-term: 1.1000 (psychological level)
- Resistance: 1.0950-1.1000 zone

## ⚠️ Risk Factors to Watch

1. **Surprise Fed Hawkishness**: If Fed suddenly turns hawkish, USD could strengthen
2. **Geopolitical Events**: Ukraine, Middle East tensions affect risk sentiment
3. **Economic Data Misses**: Poor Eurozone data could reverse the trend
4. **Technical Breakdown**: Break below 1.0820 invalidates this setup

## 💡 Trading Wisdom

Remember: Markets are forward-looking. By the time news is public, it's often priced in. This signal captures the current momentum while managing risk with tight stops.

**Trade the chart, but understand the story.**`,
        content_ur: "# مارکیٹ کا سیاق و سباق\n\nیورو کی مضبوطی کی وجوہات...",
        order_index: 3,
        is_active: true
      },

      // ─────────────────────────────────────────────────────────
      // DRILL 4: Trading Psychology (BLOG type)
      // ─────────────────────────────────────────────────────────
      // PURPOSE: Mental preparation and discipline
      // USE CASE: Help traders manage emotions and follow the plan
      {
        title: "Psychology: How to Trade This Signal",
        title_ur: "نفسیات: اس سگنل کی تجارت کیسے کریں",
        description: "Master the mental game. Learn how to manage emotions, stick to your plan, and avoid common psychological traps.",
        description_ur: "جذبات کو کنٹرول کریں اور اپنے منصوبے پر قائم رہیں۔",
        type: "BLOG",
        content: `# Trading Psychology for This Signal

## 🧠 Mental Preparation

This EUR/USD signal offers excellent risk:reward (1:2.33), but your success depends on DISCIPLINE, not just analysis.

## ✅ The Right Mindset

### Before Entering
- ✓ "I understand my risk: 30 pips maximum"
- ✓ "My position size is calculated for 2% account risk"
- ✓ "I will follow my stop loss NO MATTER WHAT"
- ✓ "I will take profit at 1.0920 or trail my stop"

### While in the Trade
- ✓ "Price movement is normal, don't panic"
- ✓ "My analysis is done, now let the market work"
- ✓ "I won't move my stop loss further away"
- ✓ "I won't take profit early out of fear"

## 🚫 Common Psychological Traps

### Trap #1: Moving Stop Loss
**Scenario**: Price drops to 1.0830 (10 pips from stop)
**Wrong Response**: "Let me move my stop to 1.0810 to give it more room"
**Right Response**: "My stop is calculated. If hit, the setup was wrong."

### Trap #2: Taking Profit Too Early
**Scenario**: Price hits 1.0890 (+40 pips profit)
**Wrong Response**: "Nice profit! Let me close now before it reverses"
**Right Response**: "My target is 1.0920. Trail stop to breakeven and wait."

### Trap #3: Revenge Trading
**Scenario**: Signal hits stop loss (-30 pips)
**Wrong Response**: "I'll double my size on the next signal to recover"
**Right Response**: "One loss is normal. I'll analyze what went wrong and move on."

### Trap #4: Overconfidence
**Scenario**: Signal is up +50 pips
**Wrong Response**: "I'm a genius! Let me add more positions"
**Right Response**: "Follow the plan. Stick to position sizing rules."

## 📋 Your Action Checklist

### Before Entry (Do this NOW)
- [ ] Calculate exact position size for 2% risk
- [ ] Set stop loss order at 1.0820
- [ ] Set take profit order at 1.0920
- [ ] Write down your plan (physically or digitally)
- [ ] Set price alerts at 1.0830 and 1.0910

### During the Trade
- [ ] Check position max 3 times per day
- [ ] Don't watch every tick (it causes anxiety)
- [ ] Follow your trailing stop plan
- [ ] Ignore tips from other traders
- [ ] Don't tell others about your trade (reduces pressure)

### After the Trade
- [ ] Journal the outcome (win or loss)
- [ ] Did you follow your plan? (Yes/No)
- [ ] What emotions did you feel?
- [ ] What would you do differently?

## 💪 The Winning Formula

**Success = Good Analysis × Emotional Discipline × Risk Management**

You already have the analysis (this signal). You have the risk management (stop loss & position sizing). The ONLY variable left is YOUR DISCIPLINE.

## 🎯 Remember

- You don't need to win every trade
- You need to win MORE than you lose
- You need to cut losses FAST and let profits RUN
- The market will always be here tomorrow

**Trade with your head, not your heart.**`,
        content_ur: "# تجارتی نفسیات\n\nجذباتی نظم و ضبط کی اہمیت...",
        order_index: 4,
        is_active: true
      },

      // ─────────────────────────────────────────────────────────
      // DRILL 5: Risk Management (CASE_STUDY type)
      // ─────────────────────────────────────────────────────────
      // PURPOSE: Position sizing and money management
      // USE CASE: Help traders calculate proper position sizes
      {
        title: "Risk Management: Calculate Your Position Size",
        title_ur: "رسک مینجمنٹ: اپنی پوزیشن سائز کا حساب لگائیں",
        description: "Learn how to calculate the exact position size for this trade based on your account size and risk tolerance.",
        description_ur: "اپنے اکاؤنٹ کے سائز کی بنیاد پر صحیح پوزیشن سائز کا حساب لگانا سیکھیں۔",
        type: "CASE_STUDY",
        content: `# Position Sizing Calculator for EUR/USD Signal

## 📊 The 2% Rule

**Never risk more than 2% of your account on a single trade.**

This signal has a 30-pip stop loss (1.0850 entry - 1.0820 stop = 30 pips)

## 🧮 Calculation Examples

### Example 1: $10,000 Account
- Account Size: $10,000
- Risk per trade: 2% = $200
- Stop Loss: 30 pips
- Position Size: $200 ÷ 30 pips = **$6.67 per pip**
- Lot Size: **0.67 standard lots** (or 6.7 mini lots)

### Example 2: $5,000 Account
- Account Size: $5,000
- Risk per trade: 2% = $100
- Stop Loss: 30 pips
- Position Size: $100 ÷ 30 pips = **$3.33 per pip**
- Lot Size: **0.33 standard lots** (or 3.3 mini lots)

### Example 3: $1,000 Account
- Account Size: $1,000
- Risk per trade: 2% = $20
- Stop Loss: 30 pips
- Position Size: $20 ÷ 30 pips = **$0.67 per pip**
- Lot Size: **0.067 standard lots** (or 0.67 mini lots)

## 📐 The Formula

\`\`\`
Position Size = (Account Size × Risk %) ÷ Stop Loss in Pips
\`\`\`

## 💰 Profit Potential

Using the 2% risk model:

### If You Win (Target: 1.0920 = +70 pips)
- $10,000 account: Profit = $467 (4.67% gain)
- $5,000 account: Profit = $233 (4.66% gain)
- $1,000 account: Profit = $47 (4.70% gain)

### If You Lose (Stop: 1.0820 = -30 pips)
- ALL accounts: Loss = 2% (by design)

## ✅ Why This Works

1. **Consistent Risk**: You always risk the same %
2. **Scale with Account**: Position grows as account grows
3. **Survive Drawdowns**: Can survive 10+ losses in a row
4. **Compound Growth**: Winners are bigger than losers

## ⚠️ What NOT To Do

### ❌ Don't: "I'll risk $500 because I'm confident"
**Why not**: One bad trade can wipe out 5% of your account

### ❌ Don't: "I'll just trade 1 lot on everything"
**Why not**: Sometimes 1 lot is too much, sometimes too little

### ❌ Don't: "I'll calculate it later"
**Why not**: You'll likely overtrade or undertrade

## 🎯 Action Steps

1. **Know your account size** (exact number)
2. **Calculate 2% of that** (risk per trade)
3. **Divide by 30 pips** (this signal's stop)
4. **Enter that position size** (not more, not less)
5. **Set your stop at 1.0820** (no exceptions)

## 💡 Pro Tip

Write your position size calculation on paper BEFORE entering the trade. This removes emotion from the decision.

**Example:**
"Account: $10,000 | Risk: $200 | Stop: 30 pips | Size: 0.67 lots"

Then enter exactly that. No more, no less.`,
        content_ur: "# پوزیشن سائزنگ\n\nصحیح سائز کا حساب...",
        order_index: 5,
        is_active: true
      }
    ]
  };

  const validateSignal = (data: any): string[] => {
    const errors: string[] = [];

    // Required fields
    if (!data.title) errors.push('Missing required field: title');
    if (!data.content) errors.push('Missing required field: content');
    if (!data.pair) errors.push('Missing required field: pair');
    if (!data.action) errors.push('Missing required field: action');
    if (data.entry === undefined || data.entry === null) errors.push('Missing required field: entry');
    if (data.confidence === undefined || data.confidence === null) errors.push('Missing required field: confidence');
    if (!data.market) errors.push('Missing required field: market');
    if (!data.author) errors.push('Missing required field: author');

    // Validate enums
    if (data.action && !['BUY', 'SELL'].includes(data.action)) {
      errors.push('action must be either "BUY" or "SELL"');
    }

    if (data.market && !['FOREX', 'CRYPTO', 'PSX', 'COMMODITIES'].includes(data.market)) {
      errors.push('market must be one of: FOREX, CRYPTO, PSX, COMMODITIES');
    }

    if (data.status && !['ACTIVE', 'CLOSED', 'CANCELLED'].includes(data.status)) {
      errors.push('status must be one of: ACTIVE, CLOSED, CANCELLED');
    }

    if (data.priority && !['HIGH', 'MEDIUM', 'LOW'].includes(data.priority)) {
      errors.push('priority must be one of: HIGH, MEDIUM, LOW');
    }

    // Validate numbers
    if (data.confidence !== undefined && (data.confidence < 0 || data.confidence > 100)) {
      errors.push('confidence must be between 0 and 100');
    }

    if (data.entry !== undefined && isNaN(data.entry)) {
      errors.push('entry must be a valid number');
    }

    return errors;
  };

  const handleImport = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setValidationErrors([]);

    try {
      // Clean citation references from JSON input (e.g., :contentReference[oaicite:1]{index=1})
      const cleanedInput = jsonInput.replace(/:contentReference\[oaicite:\d+\]\{index:\d+\}/g, '');

      // Parse JSON
      let signalData: SignalImportData;
      try {
        signalData = JSON.parse(cleanedInput);
      } catch (e) {
        setError('Invalid JSON format. Please check your JSON syntax.');
        setIsLoading(false);
        return;
      }

      // Validate
      const errors = validateSignal(signalData);
      if (errors.length > 0) {
        setValidationErrors(errors);
        setIsLoading(false);
        return;
      }

      // Add default values
      signalData.status = signalData.status || 'ACTIVE';
      signalData.priority = signalData.priority || 'MEDIUM';
      signalData.published_date = signalData.published_date || new Date().toISOString();

      // Send to API
      const response = await fetch('/api/admin/signal-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signalData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to import signal');
        setIsLoading(false);
        return;
      }

      setResult(data);
      setJsonInput(''); // Clear input on success
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSample = () => {
    setJsonInput(JSON.stringify(sampleJson, null, 2));
    setError(null);
    setResult(null);
    setValidationErrors([]);
  };

  const handleClear = () => {
    setJsonInput('');
    setError(null);
    setResult(null);
    setValidationErrors([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mb-4 inline-block"
          >
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            📥 Signal Import Tool
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Paste JSON to create a new signal with auto-generated drills
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                1. Paste JSON Data
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleUseSample}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Use Sample
                </button>
                <button
                  onClick={handleClear}
                  className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Clear
                </button>
              </div>
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Paste your signal JSON here..."
              className="w-full h-96 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="mt-4">
              <button
                onClick={handleImport}
                disabled={isLoading || !jsonInput.trim()}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? '⏳ Processing...' : '🚀 Import Signal & Generate Drills'}
              </button>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">
                  ❌ Validation Errors:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((err, idx) => (
                    <li key={idx} className="text-sm text-red-700 dark:text-red-400">
                      {err}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Instructions & Result Section */}
          <div className="space-y-6">
            {/* Instructions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                📖 Instructions
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Required Fields:</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">title</code> - Signal title (English)</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">content</code> - Signal description</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">pair</code> - Trading pair (e.g., "EUR/USD")</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">action</code> - "BUY" or "SELL"</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">entry</code> - Entry price (number)</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">confidence</code> - 0-100</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">market</code> - FOREX, CRYPTO, PSX, or COMMODITIES</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">author</code> - Author name</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Optional Fields:</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">title_ur</code> - Urdu title</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">content_ur</code> - Urdu description</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">stop_loss</code> - Stop loss price</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">take_profit</code> - Take profit price</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">status</code> - ACTIVE, CLOSED, CANCELLED</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">priority</code> - HIGH, MEDIUM, LOW</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">author_ur</code> - Urdu author name</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">drills</code> - Array of custom drills (see sample)</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Custom Drills (Optional):</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Include a <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">drills</code> array to add custom drills. If omitted, 3 drills are auto-generated.
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">title</code> - Drill title (required)</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">description</code> - Short description (required)</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">type</code> - CASE_STUDY, BLOG, or ANALYTICS (required)</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">content</code> - Drill content/markdown (required)</li>
                    <li>• <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">order_index</code> - Display order (optional)</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    💡 Tip: Click "Use Sample" to see a complete example
                  </p>
                </div>
              </div>
            </div>

            {/* Success Result */}
            {result && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-green-900 dark:text-green-300 mb-4">
                  ✅ Success!
                </h2>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-green-800 dark:text-green-400 mb-2">Signal Created:</h3>
                    <div className="bg-white dark:bg-gray-800 rounded p-3 text-sm">
                      <p className="text-gray-900 dark:text-white font-medium">{result.signal.title}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                        ID: {result.signal.id} | {result.signal.pair} | {result.signal.action}
                      </p>
                    </div>
                  </div>

                  {result.drills && result.drills.length > 0 && (
                    <div>
                      <h3 className="font-medium text-green-800 dark:text-green-400 mb-2">
                        Drills Generated: ({result.drills.length})
                      </h3>
                      <div className="space-y-2">
                        {result.drills.map((drill: any, idx: number) => (
                          <div key={idx} className="bg-white dark:bg-gray-800 rounded p-2 text-sm">
                            <p className="text-gray-900 dark:text-white font-medium">{drill.title}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">
                              Type: {drill.type} | ID: {drill.id}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-green-200 dark:border-green-800">
                    <a
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                    >
                      🔗 View Signal on Live Site
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
