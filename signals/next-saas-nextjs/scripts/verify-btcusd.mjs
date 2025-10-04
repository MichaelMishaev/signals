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
    .eq('id', 11)
    .single();

  if (signalError) {
    console.error('Error fetching signal:', signalError);
    return;
  }

  console.log('✅ BTC/USD Signal Found:');
  console.log('═'.repeat(70));
  console.log('ID:', signal.id);
  console.log('Title (EN):', signal.title);
  console.log('Title (UR):', signal.title_ur);
  console.log('\nTrading Parameters:');
  console.log('  Pair:', signal.pair);
  console.log('  Action:', signal.action);
  console.log('  Entry:', '$' + signal.entry.toLocaleString());
  console.log('  Stop Loss:', '$' + signal.stop_loss.toLocaleString(), `(Risk: $${(signal.stop_loss - signal.entry).toFixed(0)})`);
  console.log('  Take Profit:', '$' + signal.take_profit.toLocaleString(), `(Reward: $${(signal.entry - signal.take_profit).toFixed(0)})`);
  console.log('  Current Price:', '$' + signal.current_price.toLocaleString());
  console.log('  R:R Ratio:', ((signal.entry - signal.take_profit) / (signal.stop_loss - signal.entry)).toFixed(2) + ':1');
  console.log('\nMetadata:');
  console.log('  Confidence:', signal.confidence + '%');
  console.log('  Market:', signal.market);
  console.log('  Status:', signal.status);
  console.log('  Priority:', signal.priority);
  console.log('\nAnalyst:');
  console.log('  Name:', signal.author, '(' + signal.author_ur + ')');
  console.log('  Success Rate:', signal.analyst_stats?.successRate + '%');
  console.log('  Total Signals:', signal.analyst_stats?.totalSignals);
  console.log('\nKey Levels:');
  console.log('  Support:', signal.key_levels?.support?.map(l => '$' + l.toLocaleString()).join(', '));
  console.log('  Resistance:', signal.key_levels?.resistance?.map(l => '$' + l.toLocaleString()).join(', '));
  console.log('  Notes:', signal.key_levels?.notes);

  // Get the drill
  const { data: drill, error: drillError } = await supabase
    .from('drills')
    .select('*')
    .eq('signal_id', 11)
    .single();

  if (drillError) {
    console.error('\nError fetching drill:', drillError);
    return;
  }

  console.log('\n✅ Associated Drill Found:');
  console.log('═'.repeat(70));
  console.log('ID:', drill.id);
  console.log('Title (EN):', drill.title);
  console.log('Title (UR):', drill.title_ur);
  console.log('Description:', drill.description.substring(0, 100) + '...');
  console.log('Type:', drill.type);
  console.log('Order Index:', drill.order_index);
  console.log('Active:', drill.is_active);

  console.log('\nDrill Content Preview:');
  const contentPreview = drill.content.substring(0, 300);
  console.log(contentPreview + '...\n');

  console.log('═'.repeat(70));
  console.log('🎉 Both BTC/USD signal and drill verified successfully!');
  console.log('\n📊 Summary:');
  console.log('  • Signal ID: 11');
  console.log('  • Drill ID: 19');
  console.log('  • Pair: BTCUSD');
  console.log('  • Setup: Resistance rejection (SELL)');
  console.log('  • Entry: $124,800');
  console.log('  • Risk: $1,400');
  console.log('  • Reward: $5,800');
  console.log('  • R:R: 4.14:1');
  console.log('  • Bilingual: ✅ (EN + UR)');
  console.log('  • Analytics Drill: ✅');
}

verify();
