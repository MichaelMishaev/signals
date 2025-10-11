import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDrills() {
  console.log('🔍 Checking which signals have drills...\n');

  // Get all signals with drills
  const { data: drills, error } = await supabase
    .from('drills')
    .select('signal_id, title, type')
    .eq('is_active', true)
    .order('signal_id', { ascending: true });

  if (error) {
    console.error('Error:', error);
    return;
  }

  // Group by signal_id
  const bySignal = drills?.reduce((acc: any, drill) => {
    if (!acc[drill.signal_id]) {
      acc[drill.signal_id] = [];
    }
    acc[drill.signal_id].push(drill);
    return acc;
  }, {}) || {};

  console.log('📊 Signals with drills:\n');
  Object.keys(bySignal).sort((a, b) => Number(a) - Number(b)).forEach(signalId => {
    const drillCount = bySignal[signalId].length;
    const types = bySignal[signalId].map((d: any) => d.type).join(', ');
    console.log(`  Signal ${signalId}: ${drillCount} drill(s) - [${types}]`);
  });

  console.log(`\n✅ Total: ${Object.keys(bySignal).length} signals have drills`);
}

checkDrills();
