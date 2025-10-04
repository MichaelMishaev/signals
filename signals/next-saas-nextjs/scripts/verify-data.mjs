import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verify() {
  // Get the signal
  const { data: signal, error: signalError } = await supabase
    .from('signals')
    .select('*')
    .eq('id', 10)
    .single();

  if (signalError) {
    console.error('Error fetching signal:', signalError);
    return;
  }

  console.log('✅ Signal Found:');
  console.log('═══════════════════════════════════════════');
  console.log('ID:', signal.id);
  console.log('Title (EN):', signal.title);
  console.log('Title (UR):', signal.title_ur);
  console.log('Pair:', signal.pair);
  console.log('Action:', signal.action);
  console.log('Entry:', signal.entry);
  console.log('Stop Loss:', signal.stop_loss);
  console.log('Take Profit:', signal.take_profit);
  console.log('Confidence:', signal.confidence + '%');
  console.log('Status:', signal.status);
  console.log('Support Levels:', JSON.stringify(signal.key_levels?.support));
  console.log('Resistance Levels:', JSON.stringify(signal.key_levels?.resistance));
  console.log('Analyst Stats:', JSON.stringify(signal.analyst_stats));

  // Get the drill
  const { data: drill, error: drillError } = await supabase
    .from('drills')
    .select('*')
    .eq('signal_id', 10)
    .single();

  if (drillError) {
    console.error('\nError fetching drill:', drillError);
    return;
  }

  console.log('\n✅ Drill Found:');
  console.log('═══════════════════════════════════════════');
  console.log('ID:', drill.id);
  console.log('Title (EN):', drill.title);
  console.log('Title (UR):', drill.title_ur);
  console.log('Description (EN):', drill.description.substring(0, 80) + '...');
  console.log('Description (UR):', drill.description_ur.substring(0, 80) + '...');
  console.log('Type:', drill.type);
  console.log('Order Index:', drill.order_index);
  console.log('Active:', drill.is_active);

  const content = JSON.parse(drill.content);
  console.log('\nDrill Content Sections:');
  content.sections.forEach((section, i) => {
    console.log(`  ${i + 1}. ${section.title}`);
  });

  console.log('\nAnalytics Data:');
  console.log('  Risk/Reward:', content.analytics.riskRewardRatio);
  console.log('  Stop Loss Pips:', content.analytics.stopLossPips);
  console.log('  Take Profit Pips:', content.analytics.takeProfitPips);
  console.log('  Historical Success Rate:', content.analytics.historicalSuccessRate + '%');
  console.log('  Average Duration:', content.analytics.averageDuration);

  console.log('\n🎉 Both signal and drill verified successfully!');
}

verify();
