/**
 * Affiliate Tracking System - Database Schema
 *
 * Purpose: Track affiliate link clicks and conversions from Exness
 * Created: 2025-10-13
 *
 * Tables:
 * 1. affiliate_clicks - Track every click on affiliate links
 * 2. affiliate_conversions - Track conversions from Exness postbacks
 * 3. affiliate_stats_daily - Aggregated daily statistics (view)
 */

-- ============================================================================
-- Table: affiliate_clicks
-- Purpose: Track every click on Exness affiliate links
-- ============================================================================
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id BIGSERIAL PRIMARY KEY,

  -- Click identification
  click_id VARCHAR(100) UNIQUE NOT NULL,

  -- Source information
  signal_id INTEGER,
  source VARCHAR(50) NOT NULL, -- 'signal_page_cta', 'homepage_feed', 'gate_modal', 'popup_idle', etc.
  button_variant VARCHAR(50), -- 'urgent-countdown', 'live-pulse', etc.

  -- UTM Parameters
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  utm_content VARCHAR(100),
  utm_term VARCHAR(100),

  -- User context
  user_agent TEXT,
  ip_address VARCHAR(45),
  referrer TEXT,
  page_path VARCHAR(500),
  locale VARCHAR(10),

  -- Session tracking
  session_id VARCHAR(100),

  -- Timestamps
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Metadata
  metadata JSONB, -- Additional flexible data

  -- Indexes for fast lookups
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for affiliate_clicks
CREATE INDEX idx_affiliate_clicks_click_id ON affiliate_clicks(click_id);
CREATE INDEX idx_affiliate_clicks_signal_id ON affiliate_clicks(signal_id);
CREATE INDEX idx_affiliate_clicks_source ON affiliate_clicks(source);
CREATE INDEX idx_affiliate_clicks_clicked_at ON affiliate_clicks(clicked_at DESC);
CREATE INDEX idx_affiliate_clicks_session_id ON affiliate_clicks(session_id);

-- ============================================================================
-- Table: affiliate_conversions
-- Purpose: Track conversions received from Exness postback notifications
-- ============================================================================
CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id BIGSERIAL PRIMARY KEY,

  -- Exness tracking
  click_id VARCHAR(100), -- Links back to affiliate_clicks
  exness_user_id VARCHAR(100),
  exness_transaction_id VARCHAR(100) UNIQUE,

  -- Conversion details
  conversion_type VARCHAR(50) NOT NULL, -- 'registration', 'first_deposit', 'qualified_deposit', etc.
  conversion_value DECIMAL(10, 2), -- Deposit amount or commission value
  currency VARCHAR(10) DEFAULT 'USD',

  -- Commission tracking
  commission_amount DECIMAL(10, 2),
  commission_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'paid'

  -- Timestamps
  converted_at TIMESTAMP WITH TIME ZONE,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Raw postback data
  raw_postback JSONB, -- Store complete postback for debugging

  -- Verification
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for affiliate_conversions
CREATE INDEX idx_affiliate_conversions_click_id ON affiliate_conversions(click_id);
CREATE INDEX idx_affiliate_conversions_exness_user_id ON affiliate_conversions(exness_user_id);
CREATE INDEX idx_affiliate_conversions_conversion_type ON affiliate_conversions(conversion_type);
CREATE INDEX idx_affiliate_conversions_converted_at ON affiliate_conversions(converted_at DESC);
CREATE INDEX idx_affiliate_conversions_commission_status ON affiliate_conversions(commission_status);

-- ============================================================================
-- View: affiliate_stats_daily
-- Purpose: Aggregated daily statistics for dashboard
-- ============================================================================
CREATE OR REPLACE VIEW affiliate_stats_daily AS
SELECT
  DATE(clicked_at) as date,
  source,
  COUNT(*) as total_clicks,
  COUNT(DISTINCT ip_address) as unique_visitors,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(DISTINCT signal_id) as signals_clicked,
  COUNT(DISTINCT button_variant) as button_variants_used,
  -- Join with conversions
  COALESCE((
    SELECT COUNT(*)
    FROM affiliate_conversions ac
    WHERE ac.click_id = ANY(
      SELECT click_id FROM affiliate_clicks ac2
      WHERE DATE(ac2.clicked_at) = DATE(affiliate_clicks.clicked_at)
      AND ac2.source = affiliate_clicks.source
    )
  ), 0) as conversions,
  -- Conversion rate
  CASE
    WHEN COUNT(*) > 0 THEN
      ROUND((COALESCE((
        SELECT COUNT(*)
        FROM affiliate_conversions ac
        WHERE ac.click_id = ANY(
          SELECT click_id FROM affiliate_clicks ac2
          WHERE DATE(ac2.clicked_at) = DATE(affiliate_clicks.clicked_at)
          AND ac2.source = affiliate_clicks.source
        )
      ), 0)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
    ELSE 0
  END as conversion_rate
FROM affiliate_clicks
GROUP BY DATE(clicked_at), source
ORDER BY date DESC, total_clicks DESC;

-- ============================================================================
-- Function: Link click to conversion
-- Purpose: Helper function to find clicks that led to conversions
-- ============================================================================
CREATE OR REPLACE FUNCTION get_click_conversion_details(input_click_id VARCHAR)
RETURNS TABLE (
  click_id VARCHAR,
  signal_id INTEGER,
  source VARCHAR,
  clicked_at TIMESTAMP WITH TIME ZONE,
  conversion_type VARCHAR,
  conversion_value DECIMAL,
  converted_at TIMESTAMP WITH TIME ZONE,
  time_to_convert INTERVAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ac.click_id,
    ac.signal_id,
    ac.source,
    ac.clicked_at,
    acv.conversion_type,
    acv.conversion_value,
    acv.converted_at,
    acv.converted_at - ac.clicked_at as time_to_convert
  FROM affiliate_clicks ac
  LEFT JOIN affiliate_conversions acv ON ac.click_id = acv.click_id
  WHERE ac.click_id = input_click_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Comments for documentation
-- ============================================================================
COMMENT ON TABLE affiliate_clicks IS 'Tracks every click on Exness affiliate links with full attribution';
COMMENT ON TABLE affiliate_conversions IS 'Stores conversion events received from Exness postback notifications';
COMMENT ON VIEW affiliate_stats_daily IS 'Daily aggregated statistics for affiliate performance monitoring';

-- ============================================================================
-- Sample queries for testing
-- ============================================================================

-- Query 1: Top performing signals by clicks
-- SELECT signal_id, COUNT(*) as clicks FROM affiliate_clicks GROUP BY signal_id ORDER BY clicks DESC LIMIT 10;

-- Query 2: Conversion funnel
-- SELECT source, COUNT(*) as clicks,
--   (SELECT COUNT(*) FROM affiliate_conversions WHERE click_id IN (SELECT click_id FROM affiliate_clicks WHERE source = ac.source)) as conversions
-- FROM affiliate_clicks ac GROUP BY source;

-- Query 3: Recent conversions with click details
-- SELECT * FROM get_click_conversion_details('your_click_id_here');

-- ============================================================================
-- Grant permissions (adjust based on your auth setup)
-- ============================================================================
-- GRANT SELECT, INSERT ON affiliate_clicks TO authenticated;
-- GRANT SELECT ON affiliate_conversions TO authenticated;
-- GRANT SELECT ON affiliate_stats_daily TO authenticated;
