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

async function fixSignal14Images() {
  try {
    console.log('🔧 Fixing Signal #14 - Removing fake image URLs...\n');

    // 1. Update signal #14 - remove fake image paths
    console.log('📊 Updating Signal #14...');
    const { data: signal, error: signalError } = await supabase
      .from('signals')
      .update({
        chart_image: null,
        author_image: null // Will fallback to default avatar
      })
      .eq('id', 14)
      .select()
      .single();

    if (signalError) {
      console.error('❌ Error updating signal:', signalError);
      process.exit(1);
    }

    console.log(`✅ Signal #14 updated:`);
    console.log(`   - chart_image: ${signal.chart_image} (was: /images/charts/btcusd/signal_realtest_1219.png)`);
    console.log(`   - author_image: ${signal.author_image} (will use default /images/avatar/avatar-1.png)\n`);

    // 2. Update drills - remove fake image_url paths
    console.log('📚 Updating Drills for Signal #14...');
    const { data: drills, error: drillsError } = await supabase
      .from('drills')
      .update({
        image_url: null
      })
      .eq('signal_id', 14)
      .select();

    if (drillsError) {
      console.error('❌ Error updating drills:', drillsError);
      process.exit(1);
    }

    console.log(`✅ Updated ${drills.length} drills:`);
    drills.forEach((drill) => {
      console.log(`   - Drill #${drill.id} (${drill.type}): image_url set to NULL`);
    });

    console.log('\n🎉 Success! All fake image URLs removed.\n');
    console.log('📝 Summary:');
    console.log('   - Signal chart_image: NULL (no fake chart)');
    console.log('   - Signal author_image: NULL (will use default avatar)');
    console.log('   - All drill image_url: NULL (no fake drill images)');
    console.log('\n✅ Page will now display ONLY real data - no mocked/fake images!');
    console.log('\n🔗 Test URL: http://localhost:5001/en/signal/14');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

fixSignal14Images();
