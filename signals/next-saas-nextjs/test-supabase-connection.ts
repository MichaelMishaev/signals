import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://avxygvzqfyxpzdxwmefe.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_Ci7ZL06_YdZFdoB9h3SmFg_cX3INlEp';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseKey.substring(0, 15) + '...\n');

  try {
    // Test query for signals
    const { data, error, count } = await supabase
      .from('signals')
      .select('*', { count: 'exact' })
      .limit(5);

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log('✅ Successfully connected!');
    console.log('📊 Total signals:', count);
    console.log('\n📝 Sample signals:');
    console.log(JSON.stringify(data, null, 2));

    // Test fetching signal 1 specifically
    console.log('\n🔍 Testing signal ID 1:');
    const { data: signal1, error: error1 } = await supabase
      .from('signals')
      .select('*')
      .eq('id', 1)
      .single();

    if (error1) {
      console.error('❌ Error fetching signal 1:', error1);
    } else {
      console.log('✅ Found signal 1:');
      console.log(JSON.stringify(signal1, null, 2));
    }
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}

testConnection();
