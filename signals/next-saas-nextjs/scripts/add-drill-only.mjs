import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addDrill() {
  try {
    const signalId = 10; // The signal we just created

    console.log(`Adding drill for signal ID ${signalId}...`);

    const drillData = {
      signal_id: signalId,
      title: "Breakout Failure — How to detect and trade false breakouts",
      title_ur: "بریک آؤٹ ناکامی — جھوٹے بریک آؤٹس کی شناخت اور ٹریڈنگ کیسے کریں",
      description: "Complete analytics and educational case study on identifying and trading false breakouts with real-world EUR/USD example",
      description_ur: "حقیقی دنیا کی یورو/یو‌ڈی مثال کے ساتھ جھوٹے بریک آؤٹس کی شناخت اور ٹریڈنگ پر مکمل تجزیات اور تعلیمی کیس اسٹڈی",
      type: "ANALYTICS",
      content: JSON.stringify({
        sections: [
          {
            title: "Definition & Concept",
            content: "A false breakout occurs when price pushes above resistance but fails to hold, then reverses. This is one of the most common traps for retail traders who chase momentum without proper confirmation.",
            order: 1
          },
          {
            title: "Why Traders Get Trapped",
            content: "Most traders enter immediately when price breaks a key level, expecting continuation. However, without volume confirmation or proper price structure, these moves often reverse, triggering stop losses.",
            order: 2
          },
          {
            title: "This Signal as Example",
            charts: [
              "Chart showing resistance zone (1.1729–1.1750)",
              "Mark when price tested above but was rejected",
              "Mark where our entry would be (after confirmation of reversal)",
              "Show the path to TP and where SL might hit if reversed"
            ],
            content: "In this EUR/USD setup, we're watching the 1.1729-1.1750 resistance zone. Price has tested this level multiple times without a clean break. Our strategy is to fade the rally (SELL) after confirmation of rejection.",
            order: 3
          },
          {
            title: "Key Metrics & Analytics",
            metrics: {
              mfe: "Maximum Favorable Excursion — highest unrealized profit during trade's life",
              mae: "Maximum Adverse Excursion — worst drawdown from entry before resolution",
              duration: "How many bars/minutes until closure",
              riskReward: "0.035 vs 0.060 = ~1:1.7",
              probability: "Historical analysis shows price fails at this resistance zone 67% of the time"
            },
            order: 4
          },
          {
            title: "Quiz - Check Your Understanding",
            questions: [
              {
                q: "What would invalidate this signal?",
                a: "Price closing above 1.1775 would invalidate the bearish bias"
              },
              {
                q: "If price first dips to 1.1690 before bouncing, would you exit early?",
                a: "No, this is near TP level. Consider taking partial profits and moving SL to breakeven"
              },
              {
                q: "Suppose the pip target is reached after 45 minutes — was that fast or slow?",
                a: "This is relatively fast for a 60-pip move. Average time is 2-4 hours for such moves"
              }
            ],
            order: 5
          },
          {
            title: "Takeaways & Rules",
            rules: [
              "Always wait for confirmation (e.g. a bearish reversal candle) before entering",
              "Use tight losses, larger targets when trading from resistance zones",
              "Track MFE/MAE to calibrate your exits or tighten SL in future",
              "Never chase breakouts without volume and structure confirmation",
              "False breakouts typically reverse within 3-5 candles on the timeframe traded"
            ],
            order: 6
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
      }),
      order_index: 1,
      is_active: true,
      image_url: "/images/drills/false-breakout-analytics.jpg"
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
    console.log(`\n🎉 Successfully added drill!`);
    console.log(`\nAPI Endpoints:`);
    console.log(`  View signal: GET /api/signals/${signalId}`);
    console.log(`  View drill:  GET /api/drills/${drill.id}`);
    console.log(`  View drills for signal: GET /api/drills?signal_id=${signalId}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.details) console.error('Details:', error.details);
    if (error.hint) console.error('Hint:', error.hint);
    process.exit(1);
  }
}

addDrill();
