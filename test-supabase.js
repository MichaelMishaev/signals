const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://avxygvzqfyxpzdxwmefe.supabase.co';
const supabaseKey = 'sb_secret_Ci7ZL06_YdZFdoB9h3SmFg_cX3INlEp'; // Use service role key to bypass RLS

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');

  try {
    // Try to fetch from signals table
    const { data, error } = await supabase
      .from('signals')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Error:', error.message);
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('\n⚠️  The signals table does not exist in your Supabase database.');
        console.log('Please create it in the Supabase dashboard with this SQL:\n');
        console.log(`CREATE TABLE signals (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  pair TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('BUY', 'SELL')),
  entry DECIMAL,
  stop_loss DECIMAL,
  take_profit DECIMAL,
  current_price DECIMAL,
  confidence INTEGER,
  market TEXT,
  status TEXT DEFAULT 'ACTIVE',
  pips INTEGER DEFAULT 0,
  priority TEXT DEFAULT 'MEDIUM',
  author TEXT,
  author_image TEXT,
  chart_image TEXT,
  key_levels JSONB,
  analyst_stats JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_date TIMESTAMPTZ
);`);
      }
    } else {
      console.log('✅ Successfully connected to Supabase!');
      console.log('Signals in database:', data ? data.length : 0);
    }
  } catch (err) {
    console.log('❌ Connection failed:', err.message);
  }
}

testConnection();