// Apply Urdu columns migration to Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  console.log('🔄 Adding Urdu translation columns to Supabase...\n');

  const migrations = [
    {
      name: 'Add Urdu columns to signals table',
      sql: `
        ALTER TABLE public.signals
          ADD COLUMN IF NOT EXISTS title_ur TEXT,
          ADD COLUMN IF NOT EXISTS content_ur TEXT,
          ADD COLUMN IF NOT EXISTS author_ur TEXT;
      `
    },
    {
      name: 'Add Urdu columns to drills table',
      sql: `
        ALTER TABLE public.drills
          ADD COLUMN IF NOT EXISTS title_ur TEXT,
          ADD COLUMN IF NOT EXISTS description_ur TEXT,
          ADD COLUMN IF NOT EXISTS content_ur TEXT;
      `
    }
  ];

  for (const migration of migrations) {
    console.log(`📝 ${migration.name}...`);

    const { error } = await supabase.rpc('exec_sql', { sql: migration.sql }).catch(() => ({
      error: { message: 'RPC function not available - using direct query instead' }
    }));

    if (error) {
      // If RPC doesn't work, try using the SQL query directly
      // Note: This might not work if Supabase doesn't allow ALTER TABLE via client
      console.log(`   ⚠️  RPC method failed, trying alternative approach...`);
      console.log(`   ℹ️  You may need to run this SQL manually in Supabase SQL Editor:`);
      console.log(`\n${migration.sql}\n`);
    } else {
      console.log(`   ✅ Success!\n`);
    }
  }

  // Verify columns exist by trying to query them
  console.log('🔍 Verifying columns...\n');

  const { data: signalData, error: signalError } = await supabase
    .from('signals')
    .select('id, title_ur, content_ur, author_ur')
    .limit(1);

  if (signalError) {
    console.log('❌ Signals table verification failed:', signalError.message);
    console.log('\n📋 MANUAL MIGRATION REQUIRED:');
    console.log('Please run the following SQL in your Supabase SQL Editor:');
    console.log('https://supabase.com/dashboard/project/avxygvzqfyxpzdxwmefe/sql/new\n');
    console.log(migrations.map(m => m.sql).join('\n'));
    process.exit(1);
  } else {
    console.log('✅ Signals table: Urdu columns verified!');
  }

  const { data: drillData, error: drillError } = await supabase
    .from('drills')
    .select('id, title_ur, description_ur, content_ur')
    .limit(1);

  if (drillError) {
    console.log('❌ Drills table verification failed:', drillError.message);
    console.log('\n📋 MANUAL MIGRATION REQUIRED:');
    console.log('Please run the following SQL in your Supabase SQL Editor:');
    console.log('https://supabase.com/dashboard/project/avxygvzqfyxpzdxwmefe/sql/new\n');
    console.log(migrations.map(m => m.sql).join('\n'));
    process.exit(1);
  } else {
    console.log('✅ Drills table: Urdu columns verified!');
  }

  console.log('\n🎉 Migration completed successfully!');
  console.log('You can now update translations at http://localhost:5001/admin/translations\n');
}

main().catch(error => {
  console.error('\n❌ Migration failed:', error.message);
  console.log('\n📋 MANUAL MIGRATION REQUIRED:');
  console.log('Please run the following SQL in your Supabase SQL Editor:');
  console.log('https://supabase.com/dashboard/project/avxygvzqfyxpzdxwmefe/sql/new\n');
  console.log(`
ALTER TABLE public.signals
  ADD COLUMN IF NOT EXISTS title_ur TEXT,
  ADD COLUMN IF NOT EXISTS content_ur TEXT,
  ADD COLUMN IF NOT EXISTS author_ur TEXT;

ALTER TABLE public.drills
  ADD COLUMN IF NOT EXISTS title_ur TEXT,
  ADD COLUMN IF NOT EXISTS description_ur TEXT,
  ADD COLUMN IF NOT EXISTS content_ur TEXT;
  `);
  process.exit(1);
});
