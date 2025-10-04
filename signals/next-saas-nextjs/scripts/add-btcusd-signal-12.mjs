import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const signalData = {
  title: "BTC/USD: Resistance rejection near 117,443 — short bias",
  title_ur: "بی ٹی سی/یو ایس ڈی: 117,443 مزاحمت کے قریب ردِ عمل — شارٹ رجحان",
  content: "Bitcoin is trading around $122,490 and is facing strong resistance clusters at ~116,134 and ~117,443 (Barchart levels). If price tests these zones and fails to break decisively, a short under the resistance may be favorable. Supports to watch are ~113,340 and ~112,030. Invalidate if price closes and remains above 117,443.75.",
  content_ur: "بی ٹی سی تقریباً $122,490 پر تجارت کر رہا ہے اور اسے ~116,134 اور ~117,443 (Barchart سطحیں) پر مضبوط مزاحمت کا سامنا ہے۔ اگر قیمت ان زونوں کا ٹیسٹ کرے اور مؤثر انداز سے نہ توڑ سکے، تو مزاحمت کے نیچے شارٹ کرنا موزوں ہو سکتا ہے۔ دیکھیے ~113,340 اور ~112,030 کی سپورٹ۔ اگر قیمت 117,443.75 سے اوپر بند اور برقرار رہے، تو سیٹ اپ منسوخ ہو جائے گا۔",
  pair: "BTCUSD",
  action: "SELL",
  entry: 116500.0,
  stop_loss: 118000.0,
  take_profit: 113340.22,
  current_price: 122490.0,
  confidence: 60,
  market: "CRYPTO",
  status: "ACTIVE",
  priority: "MEDIUM",
  author: "DataAnchoredAnalyst",
  author_ur: "ڈیٹا اینکرڈ اینالسٹ",
  author_image: "/images/analysts/dataanchored.jpg",
  chart_image: "/images/charts/btcusd/2025-10-04-signal-factual.png",
  key_levels: {
    support: [113340.22, 112030.93],
    resistance: [116134.46, 117443.75, 115391.98],
    notes: "Main resistance pivot cluster from Barchart. Invalidate on sustained close above 117,443.75"
  },
  analyst_stats: {
    successRate: 56,
    totalSignals: 220,
    totalPips: null
  },
  published_date: "2025-10-04T18:00:00+03:00",
  pips: 0 // Starting at 0 since signal is fresh
};

const drillsData = [
  {
    title: "Case Study: Pivot Resistance Rejection at 117,443",
    title_ur: "کیس اسٹڈی: 117,443 پِیوٹ مزاحمت پر ردِ عمل",
    description: "Analysis of the reaction at Barchart pivot resistance and trade setup beneath it",
    description_ur: "Barchart پِیوٹ مزاحمت پر ردِ عمل اور اس کے نیچے تجارتی سیٹ اپ کا تجزیہ",
    type: "CASE_STUDY",
    content: `## Market Context & Pivot Levels
BTC/USD is under pressure after failing to sustain above ~$117,750 in recent tests. Barchart's pivot resistances are 116,134.46 and 117,443.75, with support zones at 113,340.22 and 112,030.93.

## Setup Logic & Entry Plan
- Wait for a test/retry of the resistance cluster 116,134–117,443
- Look for rejection patterns (wick, bearish candle) near resistance
- Entry: 116,500
- Stop Loss: 118,000 (above pivot resistance)
- Take Profit: 113,340.22 (first support level)

## Hypothetical Trade Flow
1. Price rallies into resistance band
2. A reversal candle (wick, bearish engulfing) occurs
3. Short entry triggered ~116,500
4. Price drops toward support ~113,340

## Invalidation / Exit Conditions
- Sustained close above 117,443.75 invalidates the short premise
- Consider partial exit near intermediate support if price weakens before target

## Lessons & Insights
- Pivot levels (from Barchart) are used by many traders—strength in their significance
- Always wait for confirmation of rejection before entering
- Combine rejection with volume, candle strength, divergence signals to strengthen the case`,
    content_ur: `## مارکیٹ کا پس منظر اور پِیوٹ لیول
BTC/USD نے حالیہ ٹیسٹ پر ~$117,750 سے اوپر برقرار نہ رہ کر دباؤ کا سامنا کیا ہے۔ Barchart کی پِیوٹ مزاحمتیں 116,134.46 اور 117,443.75 ہیں، اور سپورٹ زون 113,340.22 اور 112,030.93 پر ہے۔

## سیٹ اپ منطق اور انٹری پلان
- 116,134–117,443 مزاحمت کلسٹر کا ٹیسٹ دیکھیں
- ردِ عمل کے پیٹرن تلاش کریں (وِک، بیئرش موم بتی) مزاحمت کے قریب
- انٹری: 116,500
- سٹاپ لاس: 118,000 (پیوٹ مزاحمت سے اوپر)
- ٹیک پرافٹ: 113,340.22 (پہلی سپورٹ لیول)

## مفروضاتی تجارتی بہاؤ
1. قیمت مزاحمت بینڈ کی طرف بڑھتی ہے
2. ردِ عمل کی موم بتی (وِک، bearish engulfing) بنتی ہے
3. ~116,500 پر شارٹ انٹری ٹریگر ہوتی ہے
4. قیمت سپورٹ ~113,340 کی طرف گرنے کی کوشش کرتی ہے

## ناکافی / خروج کی شرائط
- 117,443.75 سے مستحکم بند قیمت ردِ عمل کی شرط منسوخ کرتی ہے
- اگر قیمت ہدف سے پہلے کمزور ہو جائے، جزوی خروج پر غور کریں

## اسباق اور بصیرتیں
- Barchart پِیوٹ سطحیں بہت سے تاجروں کے استعمال میں ہوتی ہیں — ان کی اہمیت ہوتی ہے
- داخلے سے پہلے ردِ عمل کی تصدیق کا انتظار کریں
- ردِ عمل کو حجم، موم بتی کی طاقت، divergence کے ساتھ ملا کر مضبوط کریں`,
    order_index: 1,
    is_active: true,
    image_url: "/images/charts/btcusd/2025-10-04-pivot-rejection.png"
  },
  {
    title: "Analytics: Real-Time Metrics & Trade Tracking",
    title_ur: "تجزیات: حقیقی وقت میٹرکس اور ٹریڈ ٹریکنگ",
    description: "Live-style tracking of MFE, MAE, RR, candle strength, progression over time",
    description_ur: "لائیو طرز کی ٹریکنگ:MFE, MAE, RR, موم بتی کی طاقت، وقت کے ساتھ ترقی",
    type: "ANALYTICS",
    content: `### Real-Time Metrics Plan
- **Entry**: 116,500
- **Stop Loss**: 118,000
- **Take Profit**: 113,340.22

#### Metrics to monitor live:
- **MFE** (Max Favorable Excursion): highest favorable price move from entry
- **MAE** (Max Adverse Excursion): deepest drawdown against entry before reversal
- **Unrealized P&L** = (CurrentPrice − Entry) × direction factor
- **RR Ratio** = (Entry − TP) / (SL − Entry) (for short direction)
- **Candle / Wick Strength**: ratio of body vs wick on rejection candles
- **Volume Drop / Divergence**: check if volume falls or RSI divergences at resistance test

#### Example Timeline (Hypothetical)
| Time | Price | Unrealized P&L | MFE | MAE | Notes |
|---|---|---|---|---|---|
| T0 | 116,500 | 0 | 0 | 0 | Entry baseline |
| T1 | 117,200 | −700 | 0 | −700 | adverse move toward stop |
| T2 | 116,800 | −300 | 0 | −700 | pullback from resistance zone |
| T3 | 116,100 | +400 | +400 | −700 | move toward TP |

Use these metrics to decide whether to early exit, tighten stop, or scale out positions.`,
    content_ur: `### حقیقی وقت میٹرکس کا منصوبہ
- **انٹری**: 116,500
- **سٹاپ لاس**: 118,000
- **ٹیک پرافٹ**: 113,340.22

#### لائیو مانیٹر کرنے والی میٹرکس:
- **MFE**: داخلے سے زیادہ سے زیادہ مفید حرکت
- **MAE**: داخلے کے خلاف سب سے بڑی رخی حرکت قبل الٹ پھیر
- **غیر محسوس P&L** = (موجودہ قیمت − انٹری) × سمت کا فیکٹر
- **RR تناسب** = (انٹری − TP) / (SL − انٹری) (شارٹ سمت کے لیے)
- **موم بتی/وِک طاقت**: ردِ عمل موم بتی پر باڈی بمقابلہ وِک کا تناسب
- **حجم کمی / divergence**: دیکھیں اگر مزاحمت ٹیسٹ پر حجم کم ہو یا RSI divergence ہو

#### مثال ٹائم لائن (مفروضاتی)
| وقت | قیمت | غیر محسوس P&L | MFE | MAE | نوٹس |
|---|---|---|---|---|---|
| T0 | 116,500 | 0 | 0 | 0 | انٹری بنیادی نقطہ |
| T1 | 117,200 | −700 | 0 | −700 | اسٹاپ کی طرف adverse حرکت |
| T2 | 116,800 | −300 | 0 | −700 | مزاحمت زون سے پل بیک |
| T3 | 116,100 | +400 | +400 | −700 | ہدف کی جانب حرکت |

ان میٹرکس کو استعمال کریں کہ آپ جلد خروج، اسٹاپ سختی یا پوزیشن سکیل آؤٹ کریں۔`,
    order_index: 2,
    is_active: true,
    image_url: "/images/drills/real-metrics-tracking.png"
  },
  {
    title: "Blog Insight: Why 117,443 Holds Weight in BTC Charts",
    title_ur: "بلاگ بصیرت: کیوں BTC چارٹس میں 117,443 اہمیت رکھتا ہے",
    description: "Market commentary on institutional flows, pivot significance, trader behavior at that level",
    description_ur: "بازار کا تبصرہ: ادارہ جاتی بہاؤ، پِیوٹ کی اہمیت، تاجروں کا رویہ اس سطح پر",
    type: "BLOG",
    content: `Bitcoin has struggled repeatedly to maintain price above the **117,443.75** pivot resistance from Barchart. That level acts as a magnet for sellers because many trader algorithms reference pivot resistance zones.

CoinTelegraph analysts note that BTC is squeezed between $114,000 support and $117,200 resistance — a range where traders are watching for decisive breakouts. If BTC fails to clear 117,443, this resistance becomes a launchpad for bearish reversals.

Institutions often place sell orders at pivot resistances, making "fade the resistance" trades viable. As liquidity accumulates above resistance, traps are set for breakouts that fail — giving short entries strong edge if invalidation is properly defined.

Remember: pivot resistances get stronger with repeated tests. A breakout must be clean and accompanied by volume, else they act as ceilings.`,
    content_ur: `Bitcoin مسلسل  **117,443.75** پِیوٹ مزاحمت سے اوپر برقرار رہنے میں دشواری کا سامنا کر رہا ہے۔ یہ سطح بیچنے والوں کے لیے مقناطیس کی طرح کام کرتی ہے کیونکہ کئی تجارتی الگورتھم پِیوٹ مزاحمت زون کو حوالہ بناتے ہیں۔

CoinTelegraph کے تجزیہ کار نوٹ کرتے ہیں کہ BTC $114,000 سپورٹ اور $117,200 مزاحمت کے درمیان مقید ہے — ایک ایسی حد جہاں تاجر فیصلہ کن بریک آؤٹ کے لیے منتظر ہیں۔ اگر BTC 117,443 کو صاف طور پر نہ کرے، تو یہ مزاحمت بیئرش الٹ پھیر کا آغاز بن سکتی ہے۔

اداریاتی سرمایہ کار اکثر پِیوٹ مزاحمتوں پر بیچنے کے آرڈرز لگاتے ہیں، جس سے "fade resistance" تجارت مؤثر ہو جاتی ہے، بشرطیکہ ناکامی کی تعریف واضح ہو۔

یاد رکھیں: پِیوٹ مزاحمتیں بار بار ٹیسٹ ہونے پر مضبوط ہوتی جاتی ہیں۔ بریک آؤٹ کو صاف اور حجم کے ہمراہ ہونا چاہیے، ورنہ وہ چھت کے طور پر کام کرتی ہیں۔`,
    order_index: 3,
    is_active: true,
    image_url: "/images/drills/blog-insight-117443.png"
  }
];

async function addSignalAndDrills() {
  try {
    console.log('🚀 Adding BTC/USD Signal #12 with 3 drills...\n');

    // 1. Insert signal
    console.log('📊 Inserting signal...');
    const { data: signal, error: signalError } = await supabase
      .from('signals')
      .insert([signalData])
      .select()
      .single();

    if (signalError) {
      console.error('❌ Error inserting signal:', signalError);
      process.exit(1);
    }

    console.log(`✅ Signal inserted with ID: ${signal.id}`);
    console.log(`   Title: ${signal.title}`);
    console.log(`   Pair: ${signal.pair}`);
    console.log(`   Entry: $${signal.entry.toLocaleString()}`);
    console.log(`   Stop Loss: $${signal.stop_loss.toLocaleString()}`);
    console.log(`   Take Profit: $${signal.take_profit.toLocaleString()}`);
    console.log(`   Risk/Reward: ${((signal.entry - signal.take_profit) / (signal.stop_loss - signal.entry)).toFixed(2)}:1\n`);

    // 2. Insert drills
    console.log('📚 Inserting drills...');
    const drillsWithSignalId = drillsData.map(drill => ({
      ...drill,
      signal_id: signal.id
    }));

    const { data: drills, error: drillsError } = await supabase
      .from('drills')
      .insert(drillsWithSignalId)
      .select();

    if (drillsError) {
      console.error('❌ Error inserting drills:', drillsError);
      process.exit(1);
    }

    console.log(`✅ ${drills.length} drills inserted successfully:`);
    drills.forEach((drill, index) => {
      console.log(`   ${index + 1}. [${drill.type}] ${drill.title} (ID: ${drill.id})`);
    });

    console.log('\n🎉 Success! Signal and drills added to database.\n');
    console.log('📝 Summary:');
    console.log(`   Signal ID: ${signal.id}`);
    console.log(`   Drill IDs: ${drills.map(d => d.id).join(', ')}`);
    console.log(`   Market: ${signal.market}`);
    console.log(`   Analyst: ${signal.author}`);
    console.log(`   Status: ${signal.status}`);
    console.log('\n🔗 Test URLs:');
    console.log(`   English: http://localhost:5001/en/signal/${signal.id}`);
    console.log(`   Urdu:    http://localhost:5001/ur/signal/${signal.id}`);
    console.log(`   API:     http://localhost:5001/api/signals/${signal.id}`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

addSignalAndDrills();
