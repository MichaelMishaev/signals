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

-- Create index on signal_id for better query performance
CREATE INDEX IF NOT EXISTS idx_drills_signal_id ON drills(signal_id);

-- Create index on is_active for filtering
CREATE INDEX IF NOT EXISTS idx_drills_is_active ON drills(is_active);

-- Insert sample drills for signals that have complete drill data
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
  AND s.current_price IS NOT NULL
ON CONFLICT DO NOTHING;

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
  AND s.current_price IS NOT NULL
ON CONFLICT DO NOTHING;