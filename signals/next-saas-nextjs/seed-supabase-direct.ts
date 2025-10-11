import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://avxygvzqfyxpzdxwmefe.supabase.co';
const supabaseKey = 'sb_secret_Ci7ZL06_YdZFdoB9h3SmFg_cX3INlEp';

const supabase = createClient(supabaseUrl, supabaseKey);

const now = new Date().toISOString();

const signals = [
  {
    title: 'EUR/USD Strong BUY Signal - Bullish Momentum',
    title_ur: 'EUR/USD مضبوط خریداری کا سگنل - تیزی کا رجحان',
    content: 'Technical analysis shows strong bullish momentum with RSI oversold recovery and key support at 1.0820. Multiple indicators confirm upward trend. Expected target at 1.0920 with tight stop loss management for optimal risk-reward ratio.',
    content_ur: 'تکنیکی تجزیہ مضبوط تیزی کا رجحان ظاہر کرتا ہے۔ RSI اوور سولڈ سے بحالی اور 1.0820 پر اہم سپورٹ۔ متعدد اشارے اوپر کے رجحان کی تصدیق کرتے ہیں۔',
    pair: 'EUR/USD',
    action: 'BUY',
    entry: 1.0850,
    stop_loss: 1.0820,
    take_profit: 1.0920,
    current_price: 1.0865,
    confidence: 87,
    market: 'FOREX',
    status: 'ACTIVE',
    priority: 'HIGH',
    author: 'Ahmad Ali',
    author_ur: 'احمد علی',
    published_date: now,
    created_at: now,
    updated_at: now,
    key_levels: { resistance: [1.0900, 1.0920], support: [1.0820, 1.0800] },
    analyst_stats: { successRate: 85, totalSignals: 120, totalPips: 1450 }
  },
  {
    title: 'GBP/USD Breakout - Strong Buy Opportunity',
    title_ur: 'GBP/USD بریک آؤٹ - مضبوط خریداری کا موقع',
    content: 'British Pound showing exceptional strength against USD. Key resistance broken at 1.2650 with strong volume confirmation. Technical setup suggests continuation to 1.2750 target.',
    content_ur: 'برطانوی پاؤنڈ USD کے مقابلے میں غیر معمولی طاقت دکھا رہا ہے۔ 1.2650 پر اہم مزاحمت ٹوٹ گئی۔',
    pair: 'GBP/USD',
    action: 'BUY',
    entry: 1.2675,
    stop_loss: 1.2640,
    take_profit: 1.2750,
    current_price: 1.2690,
    confidence: 82,
    market: 'FOREX',
    status: 'ACTIVE',
    priority: 'HIGH',
    author: 'Sarah Mitchell',
    author_ur: 'سارہ مچل',
    published_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    created_at: now,
    updated_at: now,
    key_levels: { resistance: [1.2750, 1.2800], support: [1.2640, 1.2600] },
    analyst_stats: { successRate: 80, totalSignals: 95, totalPips: 980 }
  },
  {
    title: 'BTC/USDT Bullish Breakout - Crypto Rally Continues',
    title_ur: 'BTC/USDT تیزی کا بریک آؤٹ - کرپٹو ریلی جاری',
    content: 'Bitcoin breaking above key resistance with massive volume surge. Institutional buying evident. Strong bullish momentum suggests move towards $46,500. Risk management essential given crypto volatility.',
    content_ur: 'بٹ کوائن بڑے حجم کے اضافے کے ساتھ اہم مزاحمت سے اوپر جا رہا ہے۔',
    pair: 'BTC/USDT',
    action: 'BUY',
    entry: 45000,
    stop_loss: 44500,
    take_profit: 46500,
    current_price: 45250,
    confidence: 91,
    market: 'CRYPTO',
    status: 'ACTIVE',
    priority: 'HIGH',
    author: 'Ahmad Ali',
    author_ur: 'احمد علی',
    published_date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    created_at: now,
    updated_at: now,
    key_levels: { resistance: [46000, 46500], support: [44500, 44000] },
    analyst_stats: { successRate: 88, totalSignals: 150, totalPips: 2100 }
  },
];

async function seedSupabase() {
  console.log('🌱 Seeding Supabase directly...\n');

  try {
    // Check connection
    const { count: beforeCount } = await supabase.from('signals').select('*', { count: 'exact', head: true });
    console.log(`📊 Current signals in database: ${beforeCount}\n`);

    // Delete existing signals
    const { error: deleteError } = await supabase.from('signals').delete().neq('id', 0);
    if (deleteError) {
      console.warn('⚠️  Delete warning:', deleteError.message);
    } else {
      console.log('🗑️  Cleared existing signals\n');
    }

    // Insert new signals
    console.log('📊 Inserting signals...\n');
    let successCount = 0;

    for (const signal of signals) {
      const { data, error } = await supabase.from('signals').insert([signal]).select();

      if (error) {
        console.error(`❌ Failed to insert ${signal.pair}:`, error.message);
      } else {
        successCount++;
        console.log(`✅ ${successCount}. Inserted signal: ${signal.pair} ${signal.action} (ID: ${data[0].id})`);
      }
    }

    // Verify
    const { count: afterCount } = await supabase.from('signals').select('*', { count: 'exact', head: true });
    console.log(`\n🎉 Successfully seeded ${successCount} signals!`);
    console.log(`📈 Total signals in database: ${afterCount}\n`);

  } catch (error: any) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedSupabase()
  .then(() => {
    console.log('✨ Seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  });
