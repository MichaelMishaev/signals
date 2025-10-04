import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addBTCUSDSignalAndDrill() {
  try {
    // 1. Insert the Signal
    console.log('Inserting BTC/USD signal...');

    const signalData = {
      title: "BTC/USD: Rejection near resistance — bearish opportunity",
      title_ur: "بی ٹی سی/یو ایس ڈی: مزاحمت کے قریب ردِ عمل — بیئرش موقع",
      content: "Bitcoin has rallied above $120,000 but is now approaching a key resistance around $125,500, where sellers may step in. Given weakening momentum and rising risk of reversal, a short bias beneath resistance with invalidation above could offer favorable reward potential. See drill for trade mechanics.",
      content_ur: "بی ٹی سی نے $120,000 سے اوپر ریکوری کی ہے مگر اب وہ کلیدی مزاحمت ~ $125,500 کے قریب پہنچ رہی ہے، جہاں بیئر سیلر غالب آ سکتے ہیں۔ کمزور ہوتی رفتار اور ممکنہ الٹ پھیر کے خطرے کے باعث، مزاحمت کے نیچے شارٹ کا رجحان اور اس کے اوپر ناکامی کی شرط ممکنہ فائدے کے مواقع دے سکتی ہے۔ میکانکس کے لیے ڈرل دیکھیں۔",
      pair: "BTCUSD",
      action: "SELL",
      entry: 124800.0,
      stop_loss: 126200.0,
      take_profit: 119000.0,
      current_price: 122500.0,
      confidence: 58,
      market: "CRYPTO",
      status: "ACTIVE",
      priority: "MEDIUM",
      author: "LiveCryptoAnalyst",
      author_ur: "لائیو کرپٹو اینالسٹ",
      author_image: "/images/analysts/livecrypto.jpg",
      chart_image: "/images/charts/btcusd/2025-10-04-signal-2001.png",
      published_date: "2025-10-04",
      key_levels: {
        support: [120000.0, 119000.0],
        resistance: [125500.0, 126200.0],
        notes: "Watch for price to test ~125,500 overhead — invalidation if sustained above 126,200."
      },
      analyst_stats: {
        successRate: 53,
        totalSignals: 250,
        totalPips: null
      }
    };

    const { data: signal, error: signalError } = await supabase
      .from('signals')
      .insert([signalData])
      .select()
      .single();

    if (signalError) {
      console.error('Error inserting signal:', signalError);
      throw signalError;
    }

    console.log('✅ Signal created successfully!');
    console.log('Signal ID:', signal.id);
    console.log('Title:', signal.title);

    // 2. Insert the Drill
    console.log('\nInserting drill for signal...');

    const drillData = {
      signal_id: signal.id,
      title: "Trading Rejection at Resistance: A BTC/USD Case Study",
      title_ur: "مزاحمت پر ردِ عمل کی تجارت: BTC/USD کیس اسٹڈی",
      description: "In-depth case study and trade analytics: learn how to spot, validate, and manage a rejection near a major resistance zone in BTC/USD.",
      description_ur: "تفصیلی کیس اسٹڈی اور تجزیاتی تجارتی مضمون: جانیں کہ کس طرح ایک اہم مزاحمت زون کے قریب ردِ عمل کی شناخت، تصدیق، اور مینجمنٹ کریں BTC/USD پر۔",
      type: "ANALYTICS",
      content: `## 1. Market Background & Rationale
Bitcoin has broken past $120k and is pushing toward a resistance cluster near **$125,500**, as noted in recent technical outlooks. The bullish momentum is starting to show fatigue, making a reversal more plausible.

## 2. Trade Setup & Rules
- **Resistance zone**: 125,500 to 126,200
- Wait for a **bearish confirmation candle** (e.g. pin bar, engulfing, rejection wick) near that zone
- **Entry**: 124,800 (below resistance)
- **Stop Loss**: 126,200 (above the resistance zone)
- **Take Profit**: 119,000 (major support beneath)
- **Risk / Reward**: ~1 : 4 (approx 1,400 risk for ~5,800 reward)

## 3. Execution & Analytics Metrics
- **MFE (Max Favorable Excursion)**: track how far price moves toward TP after entry
- **MAE (Max Adverse Excursion)**: track how far price goes against you before reversal or stop
- **Duration**: hours/days trade stays open
- **Volume / Momentum analysis**: observing weakening volume or bearish divergence as supporting evidence
- **Partial exits / trailing stop**: consider securing partial gains at intermediate levels

## 4. Invalidation Logic & Exit Conditions
- If BTC **sustains a close above 126,200**, the setup is invalidated (bullish takeover).
- Optionally, close partial position at ~121,500 to lock gains, and trail stop on the remainder.

## 5. Hypothetical Trade Flow
1. BTC pushes up to test ~125,500 zone
2. Rejection candle forms with upper wick and volume fade
3. Enter short at ~124,800
4. Price dips, reaches interim support ~122,500, then continues down toward target zone ~119,000
5. MFE may reach ~2,000-3,000 before reversal, MAE perhaps ~800 in bounce attempts

## 6. Learning Points & Best Practices
- Always wait for bearish confirmation — don't preemptively assume rejection.
- Use asymmetric targets (bigger potential reward vs controlled risk).
- Monitor MFE/MAE to tune exit strategies (when to tighten stops or take partial profits).
- Volume divergence and momentum indicators (RSI, MACD) should align with reversal hypothesis.

## 7. Reflection Questions
1. What price behavior will invalidate this trade?
2. At what point might you partial exit?
3. If your SL = 1,400 USD and TP = 5,800 USD, what is your RR ratio?
`,
      content_ur: `## 1. مارکیٹ پس منظر اور منطق
بی ٹی سی نے $120,000 کی سطح عبور کی ہے اور اب وہ **$125,500** کے قریب ایک مزاحمتی زون کی جانب بڑھ رہا ہے، جیسا کہ حالیہ تکنیکی جائزوں میں بیان کیا گیا ہے۔ بیل مارکیٹ کی رفتار اب کمزور ہو رہی ہے، جو الٹ پھیر کا امکان بڑھاتی ہے۔

## 2. تجارتی سیٹ اپ اور اصول
- **مزاحمت زون**: 125,500 تا 126,200
- مزاحمت کے قریب **بیئرش تصدیقی موم بتی** کا انتظار کریں (جیسے pin bar، engulfing)
- **انٹری**: 124,800 (مزاحمت سے نیچے)
- **سٹاپ لاس**: 126,200 (مزاحمت سے اوپر)
- **ٹیک پرافٹ**: 119,000 (ذیلی اہم سپورٹ)
- **رسک / انعام**: تقریباً 1 : 4 (۱,۴۰۰ رسک بمقابلہ ~۵,۸۰۰ فائدہ)

## 3. عمل درآمد اور تجزیاتی میٹرکس
- **MFE (زیادہ سے زیادہ مفید حرکات)**: داخلے کے بعد قیمت ٹارگٹ کی طرف کتنی دوری تک جاتی ہے
- **MAE (زیادہ نقصان)**: تجارت کے دوران قیمت آپ کی برخلاف کتنی دوری تک جاتی ہے
- **دورانیہ**: تجارت کتنے گھنٹے یا دن جاری رہتی ہے
- **حجم / رفتار کا تجزیہ**: کم ہوتی حجم یا بیئرش divergence کو معاون شواہد کے طور پر دیکھیں
- **جزوی اخراج / trailing stop**: درمیانی سطحوں پر کچھ حصے کا منافع محفوظ کرنا اور باقی پر ٹریل کرنا

## 4. ناکامی کی حکمت عملی اور خروج کی شرائط
- اگر بی ٹی سی نے **126,200 سے اوپر بقایا بند کیا** تو سیٹ اپ منسوخ شمار کریں
- اختیاری طور پر، ~121,500 سطح پر جزوی پوزیشن بند کریں اور باقی پر ٹریل اسٹاپ اپنائیں

## 5. مفروضاتی تجارتی بہاؤ
1. بی ٹی سی ~125,500 زون کو ٹیسٹ کرنے کے لیے اوپر بڑھے
2. ردِ عمل کی موم بتی بنتی ہے جس میں اوپری وِک اور کم حجم ظاہر ہوتا ہے
3. ~124,800 پر شارٹ انٹری ہوتی ہے
4. قیمت گر کر درمیانی سپورٹ ~122,500 کو چھوتی ہے، پھر ہدف ~119,000 کی طرف حرکت کرتی ہے
5. دورانِ تجارت، MFE ممکنہ طور پر ~2,000-3,000 تک پہنچتی ہے، MAE ممکنہ طور پر ~800 باؤنس کی صورت میں

## 6. اسباق اور بہترین طریقے
- تصدیق کا انتظار کریں — ردِ عمل سے پہلے فرض نہ کریں
- غیر متناسب اہداف استعمال کریں (زیادہ فائدہ بمقابلہ محدود نقص)
- MFE/MAE کی نگرانی سے SL ایڈجسٹمنٹ حکمت عملی بہتر کرو
- حجم divergence اور رفتار اشارے (RSI, MACD) ردِ عمل کے مفروضے کے مطابق ہوں

## 7. غور و فکر کے سوالات
1. کون سی قیمت کی حرکت اس تجارت کو منسوخ کرتی ہے؟
2. کس مرحلے پر آپ جزوی اخراج کریں گے؟
3. اگر آپ کا SL = 1,400 USD اور TP = 5,800 USD ہے، تو RR تناسب کیا ہے؟
`,
      order_index: 1,
      is_active: true,
      image_url: "/images/charts/btcusd/2025-10-04-signal-2001-markups.png"
    };

    const { data: drill, error: drillError } = await supabase
      .from('drills')
      .insert([drillData])
      .select()
      .single();

    if (drillError) {
      console.error('Error inserting drill:', drillError);
      throw drillError;
    }

    console.log('✅ Drill created successfully!');
    console.log('Drill ID:', drill.id);
    console.log('Title:', drill.title);

    console.log('\n🎉 Successfully added BTC/USD signal and drill!');
    console.log(`\nSignal ID: ${signal.id}`);
    console.log(`Drill ID: ${drill.id}`);
    console.log(`\nAPI Endpoints:`);
    console.log(`  View signal: GET /api/signals/${signal.id}`);
    console.log(`  View drill:  GET /api/drills/${drill.id}`);
    console.log(`  View all signals: GET /api/signals`);
    console.log(`  View drills for signal: GET /api/drills?signal_id=${signal.id}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.details) console.error('Details:', error.details);
    if (error.hint) console.error('Hint:', error.hint);
    process.exit(1);
  }
}

addBTCUSDSignalAndDrill();
