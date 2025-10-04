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

async function migrateSupabase() {
  console.log('Attempting to update Supabase schema for crypto prices...\n');

  const sql = `
    ALTER TABLE signals
      ALTER COLUMN entry TYPE DECIMAL(15,5),
      ALTER COLUMN stop_loss TYPE DECIMAL(15,5),
      ALTER COLUMN take_profit TYPE DECIMAL(15,5),
      ALTER COLUMN current_price TYPE DECIMAL(15,5);
  `;

  console.log('SQL to execute:');
  console.log('─'.repeat(60));
  console.log(sql);
  console.log('─'.repeat(60));
  console.log();

  // Try using Supabase SQL runner (this may not work with client library)
  try {
    // Attempt direct SQL execution
    const { data, error } = await supabase.rpc('exec_sql', { query: sql });

    if (error) {
      throw error;
    }

    console.log('✅ Migration successful!');
    console.log('Result:', data);
  } catch (error) {
    console.log('⚠️  Cannot execute SQL directly via Supabase client.');
    console.log('Error:', error.message);
    console.log('\n📝 Please run this SQL manually:');
    console.log('\n1. Go to: https://app.supabase.com/project/avxygvzqfyxpzdxwmefe/sql');
    console.log('2. Paste and run the following SQL:\n');
    console.log('─'.repeat(60));
    console.log(sql.trim());
    console.log('─'.repeat(60));
    console.log('\n3. Then run: node scripts/add-btcusd-signal-2001.mjs\n');
  }
}

migrateSupabase();
