const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'signals/next-saas-nextjs/.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupDrillsTable() {
  console.log('🔄 Setting up drills table...');

  try {
    // Create drills table
    const { data: createResult, error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        -- Create drills table with foreign key relationship to signals
        CREATE TABLE IF NOT EXISTS drills (
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
      `
    });

    if (createError) {
      console.error('❌ Error creating drills table:', createError);
      return;
    }

    console.log('✅ Drills table created successfully');

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

    console.log(`📊 Found ${signals.length} signals with drill data`);

    // Insert drill data
    const drillsToInsert = [];

    signals.forEach(signal => {
      // Technical Analysis drill
      drillsToInsert.push({
        signal_id: signal.id,
        title: `${signal.pair} Technical Analysis Deep Dive`,
        description: `Complete breakdown of the technical factors driving this ${signal.action} signal`,
        type: 'CASE_STUDY',
        content: `Technical analysis for ${signal.pair}: ${signal.content}`,
        order_index: 1,
        is_active: true,
        image_url: `/images/drills/${signal.pair.toLowerCase().replace('/', '')}-case-study.jpg`
      });

      // Analytics Dashboard drill
      drillsToInsert.push({
        signal_id: signal.id,
        title: 'Real-Time Analytics Dashboard',
        description: `Live performance metrics and analytics for ${signal.pair}`,
        type: 'ANALYTICS',
        content: `Interactive dashboard showing real-time performance data for ${signal.pair}`,
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

    console.log(`✅ Inserted ${drillsToInsert.length} drills successfully`);

    // Verify the data
    const { data: drillCount, error: countError } = await supabase
      .from('drills')
      .select('*', { count: 'exact', head: true });

    if (!countError) {
      console.log(`📈 Total drills in database: ${drillCount}`);
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

setupDrillsTable();