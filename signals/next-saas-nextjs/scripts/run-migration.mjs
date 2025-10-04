import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('Running migration to update price columns for crypto support...\n');

    // Read SQL file
    const sql = readFileSync('scripts/update-price-columns-for-crypto.sql', 'utf8');

    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      if (statement.toLowerCase().includes('select')) {
        // For SELECT statements, show results
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement });
        if (error) {
          console.error('Error executing query:', error);
          // Try alternative method
          console.log('Trying alternative execution method...');
          continue;
        }
        console.log('Query result:', data);
      } else {
        // For ALTER statements, execute directly
        console.log('Executing:', statement.substring(0, 80) + '...');

        // Use Supabase SQL editor or direct PostgreSQL connection
        // Since Supabase client doesn't support direct SQL execution,
        // we need to use the management API or run this manually
        console.log('⚠️  Please run this SQL manually in Supabase SQL Editor:');
        console.log('\n' + statement + ';\n');
      }
    }

    console.log('\n✅ Migration script prepared!');
    console.log('\n📝 Next steps:');
    console.log('1. Open Supabase Dashboard: https://app.supabase.com');
    console.log('2. Go to SQL Editor');
    console.log('3. Run the following SQL:\n');
    console.log('─'.repeat(60));
    console.log(readFileSync('scripts/update-price-columns-for-crypto.sql', 'utf8'));
    console.log('─'.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

runMigration();
