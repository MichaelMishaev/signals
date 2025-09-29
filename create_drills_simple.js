const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'signals/next-saas-nextjs/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkDrillsTable() {
  console.log('🔄 Checking drills table...');

  try {
    // Try to query the drills table
    const { data: drills, error } = await supabase
      .from('drills')
      .select('count', { count: 'exact', head: true });

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('relation "public.drills" does not exist')) {
        console.log('❌ Drills table does not exist');
        console.log('');
        console.log('🚨 MANUAL STEP REQUIRED:');
        console.log('');
        console.log('1. Go to your Supabase Dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Copy and paste this SQL query:');
        console.log('');
        console.log('----------------------------------------');
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

CREATE INDEX IF NOT EXISTS idx_drills_signal_id ON drills(signal_id);
CREATE INDEX IF NOT EXISTS idx_drills_is_active ON drills(is_active);

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
        console.log('----------------------------------------');
        console.log('');
        console.log('4. Click "Run" to execute the SQL');
        console.log('5. After running, refresh admin panel to see the new drills from database!');
        return;
      } else {
        console.error('❌ Error checking drills table:', error);
        return;
      }
    }

    console.log('✅ Drills table exists!');
    console.log('📊 Current drill count:', drills);

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

checkDrillsTable();