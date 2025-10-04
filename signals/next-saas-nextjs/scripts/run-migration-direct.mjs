import pg from 'pg';
import * as dotenv from 'dotenv';

// Try .env.local first, then .env
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const { Client } = pg;

async function runMigration() {
  // Get DATABASE_URL from environment
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('❌ DATABASE_URL not found in .env.local');
    console.log('\nPlease run the SQL manually in Supabase Dashboard:');
    console.log('https://app.supabase.com → SQL Editor\n');
    console.log('SQL to run:');
    console.log('─'.repeat(60));
    console.log(`ALTER TABLE signals
  ALTER COLUMN entry TYPE DECIMAL(15,5),
  ALTER COLUMN stop_loss TYPE DECIMAL(15,5),
  ALTER COLUMN take_profit TYPE DECIMAL(15,5),
  ALTER COLUMN current_price TYPE DECIMAL(15,5);`);
    console.log('─'.repeat(60));
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('✅ Connected!\n');

    console.log('Running migration...');

    // Run the ALTER statements
    await client.query(`
      ALTER TABLE signals
        ALTER COLUMN entry TYPE DECIMAL(15,5),
        ALTER COLUMN stop_loss TYPE DECIMAL(15,5),
        ALTER COLUMN take_profit TYPE DECIMAL(15,5),
        ALTER COLUMN current_price TYPE DECIMAL(15,5);
    `);

    console.log('✅ Migration completed successfully!\n');

    // Verify the changes
    const result = await client.query(`
      SELECT column_name, data_type, numeric_precision, numeric_scale
      FROM information_schema.columns
      WHERE table_name = 'signals'
        AND column_name IN ('entry', 'stop_loss', 'take_profit', 'current_price')
      ORDER BY column_name;
    `);

    console.log('Verified column types:');
    console.table(result.rows);

  } catch (error) {
    console.error('❌ Error running migration:', error.message);
    console.log('\nPlease run the SQL manually in Supabase Dashboard instead.');
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
