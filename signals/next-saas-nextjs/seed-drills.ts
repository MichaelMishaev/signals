import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://avxygvzqfyxpzdxwmefe.supabase.co';
const supabaseKey = 'sb_secret_Ci7ZL06_YdZFdoB9h3SmFg_cX3INlEp';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDrills() {
  console.log('🌱 Seeding drills for signals...\n');

  try {
    // Get all signals
    const { data: signals, error: signalsError } = await supabase
      .from('signals')
      .select('id, pair, action, title');

    if (signalsError) {
      console.error('❌ Error fetching signals:', signalsError);
      return;
    }

    console.log(`📊 Found ${signals?.length} signals\n`);

    let totalInserted = 0;

    for (const signal of signals || []) {
      const drills = [
        {
          signal_id: signal.id,
          title: `${signal.pair} Technical Analysis Deep Dive`,
          title_ur: `${signal.pair} تکنیکی تجزیہ گہرائی میں`,
          description: `Complete breakdown of the technical factors driving this ${signal.action} signal`,
          description_ur: `اس ${signal.action} سگنل کو چلانے والے تکنیکی عوامل کی مکمل تفصیل`,
          type: 'CASE_STUDY',
          content: `This comprehensive case study examines the ${signal.pair} ${signal.action} opportunity in detail.\n\nKey Technical Indicators:\n- RSI showing bullish/bearish divergence\n- Moving averages alignment confirms trend\n- Volume analysis supports the move\n- Fibonacci levels identify key targets\n\nMarket Context:\n- Overall market sentiment is favorable\n- Economic calendar events support the direction\n- Institutional positioning aligns with our analysis\n\nRisk Management:\n- Proper position sizing is critical\n- Stop loss placement protects capital\n- Take profit targets based on technical levels`,
          content_ur: `یہ جامع کیس اسٹڈی ${signal.pair} ${signal.action} موقع کی تفصیل سے جانچ کرتی ہے۔`,
          order_index: 1,
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          signal_id: signal.id,
          title: 'Real-Time Analytics Dashboard',
          title_ur: 'ریئل ٹائم تجزیاتی ڈیش بورڈ',
          description: `Live performance metrics and analytics for ${signal.pair}`,
          description_ur: `${signal.pair} کے لیے لائیو کارکردگی میٹرکس اور تجزیات`,
          type: 'ANALYTICS',
          content: `Interactive dashboard showing real-time performance data for ${signal.pair}. This drill provides detailed analytics and insights into the signal's performance.`,
          content_ur: `${signal.pair} کے لیے ریئل ٹائم کارکردگی ڈیٹا دکھانے والا انٹرایکٹو ڈیش بورڈ۔`,
          order_index: 2,
          is_active: true,
          created_at: new Date().toISOString()
        },
        {
          signal_id: signal.id,
          title: `Market Insights: ${signal.pair} Analysis`,
          title_ur: `مارکیٹ بصیرت: ${signal.pair} تجزیہ`,
          description: `Expert commentary and market insights for this trading opportunity`,
          description_ur: `اس تجارتی موقع کے لیے ماہر تبصرہ اور مارکیٹ کی بصیرت`,
          type: 'BLOG',
          content: `Market Commentary for ${signal.pair}\n\nIn this analysis, we explore the fundamental and technical factors influencing ${signal.pair}.\n\nFundamental Analysis:\n- Economic data releases impact\n- Central bank policy considerations\n- Geopolitical factors affecting the pair\n\nTechnical Setup:\n- Chart patterns confirm the direction\n- Key support and resistance levels\n- Momentum indicators show strength\n\nTrader Psychology:\n- Market sentiment analysis\n- Positioning data insights\n- Risk appetite considerations\n\nConclusion:\nThis ${signal.action} opportunity presents a favorable risk-reward setup for traders who follow proper risk management principles.`,
          content_ur: `${signal.pair} کے لیے مارکیٹ کی تفسیر`,
          order_index: 3,
          is_active: true,
          created_at: new Date().toISOString()
        }
      ];

      for (const drill of drills) {
        const { error } = await supabase.from('drills').insert([drill]);
        if (error) {
          console.error(`❌ Failed to insert drill for signal ${signal.id}:`, error.message);
        } else {
          totalInserted++;
        }
      }

      console.log(`✅ Added 3 drills for signal ${signal.id} (${signal.pair})`);
    }

    console.log(`\n🎉 Successfully seeded ${totalInserted} drills!`);

  } catch (error: any) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDrills()
  .then(() => {
    console.log('\n✨ Drill seeding completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed:', error);
    process.exit(1);
  });
