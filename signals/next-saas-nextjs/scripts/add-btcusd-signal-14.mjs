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
  title: "BTC/USD: Resistance test near 121,180 — possible reversal",
  title_ur: "بی ٹی سی/یو ایس ڈی: 121,180 کے نزدیک مزاحمت ٹیسٹ — ممکنہ الٹ پھیر",
  content: "Bitcoin is trading near ~$121,990 (Investing). Barchart shows standard deviation resistance ~ 121,180.71 USD and pivot R2 at ~ 120,745.81 USD. If BTC fails to hold above ~121,500–122,500, a short entry beneath that band may work. Support zones to watch: ~115,352 USD (MarketScreener). Invalidate if sustained breakout above ~123,375 USD.",
  content_ur: "Bitcoin تقریباً ~$121,990 پر تجارت کر رہا ہے (Investing). Barchart کا standard deviation مزاحمت ~ 121,180.71 USD اور pivot R2 ~ 120,745.81 USD دکھاتے ہیں۔ اگر BTC ~121,500–122,500 کے اندر مؤثر انداز میں برقرار نہ رہے، تو اس زون کے نیچے شارٹ انٹری ممکن ہے۔ سپورٹ زون کو مانیٹر کریں: ~115,352 USD (MarketScreener). اگر قیمت ~123,375 USD سے اوپر مستحکم بریک کرے تو سیٹ اپ منسوخ ہوگا۔",
  pair: "BTCUSD",
  action: "SELL",
  entry: 122200.0,
  stop_loss: 123800.0,
  take_profit: 115352.0,
  current_price: 121990.0,
  confidence: 58,
  market: "CRYPTO",
  status: "ACTIVE",
  priority: "MEDIUM",
  author: "RealTechAnalyst",
  author_ur: "ریئل ٹیک اینالسٹ",
  author_image: "/images/analysts/realtech.jpg",
  chart_image: "/images/charts/btcusd/signal_realtest_1219.png",
  key_levels: {
    support: [115352.0],
    resistance: [121180.71, 123375.0, 120745.81],
    notes: "Resistance around 121,180 (std dev); invalidation if breaks above 123,375"
  },
  analyst_stats: {
    successRate: 60,
    totalSignals: 240,
    totalPips: 0
  },
  published_date: "2025-10-04T19:00:00+03:00",
  pips: 0 // Starting at 0 since signal is fresh
};

const drillsData = [
  {
    title: "CASE_STUDY: Resistance Testing & Rejection at 121k zone",
    title_ur: "کیس اسٹڈی: 121k زون پر مزاحمت ٹیسٹ اور ردِ عمل",
    description: "Examine price reaction at the resistance band and plan for short entry",
    description_ur: "مزاحمتی بینڈ پر قیمت کا ردِ عمل دیکھیں اور شارٹ انٹری کی منصوبہ بندی کریں",
    type: "CASE_STUDY",
    content: `## Market Context & Resistance Levels
As of now, BTC/USD is ~ 121,990 USD (Investing). Barchart shows resistance at ~ 121,180.71 (std dev) and pivot R2 ~ 120,745.81. MarketScreener shows further resistance up to ~ 123,375 USD and support at ~ 115,352.

## Setup & Entry Plan
- Wait for price test of 121,180–123,375 band
- Look for reversal signals (long upper wick, bearish engulfing)
- Entry: 122,200 (just under resistance zone)
- Stop Loss: 123,800 (above resistance cluster)
- Take Profit: 115,352 (major support)

## Hypothetical Flow & Decision Points
1. Price heads toward 122,000–123,000 region
2. Rejection occurs (wick, reversal candle) under resistance
3. Enter short at 122,200
4. Price falls toward support ~115,352

## Invalidation / Exit Conditions
- Sustained breakout and close above 123,375 invalidates short premise
- Consider partial exits or stops if price shows weakness before TP

## Lessons & Observations
- Use multiple sources (std dev, pivots, historical resistance) to pinpoint zones
- Always wait for confirmation before entry
- Combine price action + momentum + volume for stronger signals`,
    content_ur: `## مارکیٹ کا پس منظر اور مزاحمت کی سطحیں
ابھی BTC/USD تقریباً ~ 121,990 USD ہے (Investing)۔ Barchart نے مزاحمت ~ 121,180.71 (std dev) اور pivot R2 ~ 120,745.81 دکھائی ہے۔ MarketScreener مزاحمت ~ 123,375 USD اور سپورٹ ~ 115,352 USD دکھاتا ہے۔

## سیٹ اپ اور انٹری پلان
- 121,180–123,375 زون کا ٹیسٹ دیکھیں
- ردِ عمل کے اشارے تلاش کریں (طویل وِک، بیئرش engulfing)
- انٹری: 122,200 (مزاحمت زون کے نیچے)
- سٹاپ لاس: 123,800 (مزاحمت کلسٹر کے اوپر)
- ٹیک پرافٹ: 115,352 (اہم سپورٹ)

## مفروضاتی بہاؤ اور فیصلہ نقاط
1. قیمت ~122,000–123,000 زون کی طرف بڑھتی ہے
2. ردِ عمل (وِک، الٹ پھیر موم بتی) بنتی ہے
3. ~122,200 پر شارٹ انٹری ہوتی ہے
4. قیمت ~115,352 کی سپورٹ کی طرف گرنے کی کوشش کرتی ہے

## منسوخی / خروج کی شرائط
- اگر قیمت 123,375 سے اوپر مستحکم بریک کرے تو شارٹ خیال منسوخ ہوگا
- اگر قیمت TP تک پہنچنے سے پہلے کمزور ہو، تو جزوی اخراج یا محفوظ کریں

## اسباق اور مشاہدات
- متعدد ذرائع استعمال کریں (std dev, pivots, تاریخی مزاحمت) زون کی نشاندہی کے لیے
- داخلے سے پہلے تصدیق کا انتظار کریں
- قیمت کا رجحان + رفتار + حجم کو ملا کر سگنل مضبوط کریں`,
    order_index: 1,
    is_active: true,
    image_url: "/images/charts/btcusd/drill_case_rejection.png"
  },
  {
    title: "ANALYTICS: Real-Time Metrics & Trade Monitoring",
    title_ur: "تجزیات: حقیقی وقت میٹرکس و ٹریڈ مانیٹرنگ",
    description: "Track MFE, MAE, unrealized P&L, and progression during the trade",
    description_ur: "تجارت کے دوران MFE، MAE، غیر محسوس منافع / نقصان اور پیش رفت ٹریک کریں",
    type: "ANALYTICS",
    content: `### Metrics Template
- **Entry**: 122,200
- **Stop Loss**: 123,800
- **Take Profit**: 115,352

#### Metrics to monitor live:
- **MFE (Max Favorable Excursion):** highest favorable move from entry
- **MAE (Max Adverse Excursion):** deepest drawdown against entry
- **Unrealized P&L** = (Entry – CurrentPrice) for short direction
- **RR Ratio** = (Entry – TP) / (SL – Entry)
- **Candle / Wick strength** at resistance tests
- **Volume & momentum divergence** during the approach to entry zone

#### Example Timeline (Hypothetical)
| Time | Price | Unrealized P&L | MFE | MAE | Notes |
|---|---|---|---|---|---|
| T0 | 122,200 | 0 | 0 | 0 | Entry point |
| T1 | 123,000 | –800 | 0 | –800 | adverse move approaching resistance |
| T2 | 122,500 | –300 | 0 | –800 | pullback from upper zone |
| T3 | 121,800 | +400 | +400 | –800 | move toward TP |

Use these metrics to adjust stops, consider partial exits, or confirm continuation.`,
    content_ur: `### میٹرکس ٹیمپلیٹ
- **انٹری**: 122,200
- **سٹاپ لاس**: 123,800
- **ٹیک پرافٹ**: 115,352

#### لائیو مانیٹر کرنے والی میٹرکس:
- **MFE**: داخلے سے زیادہ مفید حرکت
- **MAE**: داخلے کے خلاف سب سے بڑی رخی حرکت
- **غیر محسوس منافع / نقصان** = (انٹری – موجودہ قیمت) شارٹ سمت کے لحاظ سے
- **RR تناسب** = (انٹری – TP) ÷ (SL – انٹری)
- **موم بتی / وِک طاقت** ردِ عمل ٹیسٹ پر
- **حجم اور رفتار divergence** داخلے زون کی جھلک پر

#### مثال ٹائم لائن (مفروضاتی)
| وقت | قیمت | غیر محسوس P&L | MFE | MAE | نوٹس |
|---|---|---|---|---|---|
| T0 | 122,200 | 0 | 0 | 0 | داخلے کی نقطہ |
| T1 | 123,000 | –800 | 0 | –800 | مزاحمت کی طرف adverse حرکت |
| T2 | 122,500 | –300 | 0 | –800 | مزاحمت زون سے واپس |
| T3 | 121,800 | +400 | +400 | –800 | ہدف کی جانب حرکت |

ان میٹرکس کو استعمال کریں SL ایڈجسٹمنٹ، جزوی اخراج یا تسلسل کی تصدیق کے لیے۔`,
    order_index: 2,
    is_active: true,
    image_url: "/images/drills/drill_analytics_chart.png"
  },
  {
    title: "BLOG: Understanding Std Dev & Pivot Resistance Zones",
    title_ur: "بلاگ: اسٹینڈرڈ ڈیوی ایشن اور پِیوٹ مزاحمت زون کی سمجھ",
    description: "Exploring why standard deviation and pivot resistances matter in crypto trade zones",
    description_ur: "یہ سمجھنا کہ اسٹینڈرڈ ڈیوی ایشن اور پِیوٹ مزاحمت زون کریپٹو تجارت میں کیوں اہم ہیں",
    type: "BLOG",
    content: `In this setup, resistance at **121,180.71** (standard deviation level from Barchart) acts as a statistical barrier. Pivot R2 ~ 120,745.81 is another key level that many traders watch.

When price approaches statistical resistances or pivots, traders often expect increased order flow, possible reversals, or traps. Using both in tandem gives higher confidence zones.

In crypto markets, volatility amplifies behavior around these levels — rejections, fake breakouts, or strong momentum bursts are common. Always define invalidation zones (e.g. above 123,375 in this case) and confirm direction with price action / volume.

Statistical resistance levels (like standard deviation bands) often coincide with traders' perception zones, making them powerful reference points in designing entries and exits.`,
    content_ur: `اس سیٹ اپ میں، مزاحمت **121,180.71** (Barchart کی standard deviation سطح) بطور شماریاتی رکاوٹ کام کرتی ہے۔ Pivot R2 ~ 120,745.81 ایک اور اہم سطح ہے جسے بہت سے تاجر مانیٹر کرتے ہیں۔

جب قیمت شماریاتی مزاحمتوں یا pivots کے قریب پہنچتی ہے، تو تاجر عام طور پر آرڈر بہاؤ، ممکنہ الٹ پھیر یا پھنساؤ کی توقع کرتے ہیں۔ دونوں کو ملانے سے زیادہ اعتماد والے زون بن جاتے ہیں۔

کریپٹو مارکیٹ میں، اتار چڑھاؤ ان سطحوں کے گرد ردِ عمل کو تقویت دیتا ہے — ردِ عمل، جھوٹی بریک آؤٹ، یا رفتار کے ہولے پھیر معمول ہیں۔ ہمیشہ منسوخی زون (مثلاً اس کیس میں 123,375 سے اوپر) کی تعریف کریں اور سمت کی تصدیق قیمت حرکت / حجم کے ساتھ کریں۔`,
    order_index: 3,
    is_active: true,
    image_url: "/images/drills/blog_stddev_pivot.png"
  }
];

async function addSignalAndDrills() {
  try {
    console.log('🚀 Adding BTC/USD Signal #14 with 3 drills...\n');

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
