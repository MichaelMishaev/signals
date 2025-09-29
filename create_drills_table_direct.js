const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'signals/next-saas-nextjs/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createDrillsTable() {
  console.log('🔄 Creating drills table...');

  try {
    // First, try to create the table using individual SQL commands
    console.log('📝 Creating drills table structure...');

    // Create the table
    const { data: tableResult, error: tableError } = await supabase
      .from('drills') // This will fail if table doesn't exist, which is expected
      .select('count', { count: 'exact', head: true });

    if (tableError && tableError.code === 'PGRST116') {
      console.log('✅ Table does not exist, need to create it via SQL editor');
      console.log('');
      console.log('🚨 MANUAL STEP REQUIRED:');
      console.log('Please go to your Supabase Dashboard → SQL Editor and run this SQL:');
      console.log('');
      console.log('-- Create drills table');
      console.log(`CREATE TABLE IF NOT EXISTS drills (
  id SERIAL PRIMARY KEY,
  signal_id INTEGER NOT NULL REFERENCES signals(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('CASE_STUDY', 'ANALYTICS', 'BLOG')),
  content TEXT NOT NULL,
  order_index INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_drills_signal_id ON drills(signal_id);
CREATE INDEX IF NOT EXISTS idx_drills_is_active ON drills(is_active);

-- Insert sample drills for signals with complete drill data
INSERT INTO drills (signal_id, title, description, type, content, order_index, is_active, image_url)
SELECT
  s.id,
  s.pair || ' Technical Analysis Deep Dive',
  'Complete breakdown of the technical factors driving this ' || s.action || ' signal',
  'CASE_STUDY',
  'Technical analysis for ' || s.pair || ': ' || s.content,
  1,
  true,
  '/images/drills/' || LOWER(REPLACE(s.pair, '/', '')) || '-case-study.jpg'
FROM signals s
WHERE s.key_levels IS NOT NULL
  AND s.analyst_stats IS NOT NULL
  AND s.current_price IS NOT NULL;

-- Insert analytics drills
INSERT INTO drills (signal_id, title, description, type, content, order_index, is_active, image_url)
SELECT
  s.id,
  'Real-Time Analytics Dashboard',
  'Live performance metrics and analytics for ' || s.pair,
  'ANALYTICS',
  'Interactive dashboard showing real-time performance data for ' || s.pair,
  2,
  true,
  '/images/drills/analytics-dashboard.jpg'
FROM signals s
WHERE s.key_levels IS NOT NULL
  AND s.analyst_stats IS NOT NULL
  AND s.current_price IS NOT NULL;`);
      console.log('');
      console.log('After running that SQL, the drills table will be created and populated!');
      return;
    }

    if (tableError) {
      console.error('❌ Unexpected error checking table:', tableError);
      return;
    }

    console.log('✅ Drills table already exists!');
    console.log(\`📊 Current drill count: \${tableResult}\`);

  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// Also create a function to populate drills if table exists but is empty
async function populateDrillsIfEmpty() {
  try {
    const { count, error } = await supabase
      .from('drills')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.log('❌ Cannot check drills count:', error.message);
      return;
    }

    if (count === 0) {
      console.log('📝 Table exists but is empty, populating with drill data...');

      // Get signals with drill data
      const { data: signals, error: signalsError } = await supabase
        .from('signals')
        .select('*')
        .not('key_levels', 'is', null)
        .not('analyst_stats', 'is', null)
        .not('current_price', 'is', null);

      if (signalsError) {
        console.error('❌ Error fetching signals:', signalsError);
        return;
      }

      const drillsToInsert = [];

      signals.forEach(signal => {
        // Technical Analysis drill
        drillsToInsert.push({
          signal_id: signal.id,
          title: \`\${signal.pair} Technical Analysis Deep Dive\`,
          description: \`Complete breakdown of the technical factors driving this \${signal.action} signal\`,
          type: 'CASE_STUDY',
          content: \`Technical analysis for \${signal.pair}: \${signal.content}\`,
          order_index: 1,
          is_active: true,
          image_url: \`/images/drills/\${signal.pair.toLowerCase().replace('/', '')}-case-study.jpg\`
        });

        // Analytics Dashboard drill
        drillsToInsert.push({
          signal_id: signal.id,
          title: 'Real-Time Analytics Dashboard',
          description: \`Live performance metrics and analytics for \${signal.pair}\`,
          type: 'ANALYTICS',
          content: \`Interactive dashboard showing real-time performance data for \${signal.pair}\`,
          order_index: 2,
          is_active: true,
          image_url: '/images/drills/analytics-dashboard.jpg'
        });
      });

      const { data: insertResult, error: insertError } = await supabase
        .from('drills')
        .insert(drillsToInsert);

      if (insertError) {
        console.error('❌ Error inserting drills:', insertError);
        return;
      }

      console.log(\`✅ Inserted \${drillsToInsert.length} drills successfully\`);
    } else {
      console.log(\`✅ Drills table already has \${count} drills\`);
    }

  } catch (error) {
    console.error('💥 Error populating drills:', error);
  }
}

createDrillsTable().then(() => {
  // If table exists, try to populate it
  populateDrillsIfEmpty();
});