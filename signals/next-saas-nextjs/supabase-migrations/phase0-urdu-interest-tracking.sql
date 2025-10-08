-- Phase 0: Urdu Interest Tracking Table
-- Purpose: Track user interest in Urdu translation before investing in full implementation
-- Created: 2025-10-08

-- Create table for tracking Urdu interest clicks
CREATE TABLE IF NOT EXISTS urdu_interest_tracking (
  id BIGSERIAL PRIMARY KEY,
  event TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  user_agent TEXT,
  ip TEXT,
  page_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries on timestamp
CREATE INDEX IF NOT EXISTS idx_urdu_interest_timestamp ON urdu_interest_tracking(timestamp);

-- Create index for faster queries on event type
CREATE INDEX IF NOT EXISTS idx_urdu_interest_event ON urdu_interest_tracking(event);

-- Enable Row Level Security (RLS)
ALTER TABLE urdu_interest_tracking ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for tracking)
CREATE POLICY "Allow anonymous insert for tracking"
  ON urdu_interest_tracking
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated reads (for admin dashboard)
CREATE POLICY "Allow authenticated read for admins"
  ON urdu_interest_tracking
  FOR SELECT
  TO authenticated
  USING (true);

-- Comment the table
COMMENT ON TABLE urdu_interest_tracking IS 'Phase 0: Tracks user interest in Urdu translation feature to validate demand before full implementation';

-- Comment the columns
COMMENT ON COLUMN urdu_interest_tracking.event IS 'Event type (e.g., "urdu_interest_clicked")';
COMMENT ON COLUMN urdu_interest_tracking.timestamp IS 'When the event occurred';
COMMENT ON COLUMN urdu_interest_tracking.user_agent IS 'Browser user agent string';
COMMENT ON COLUMN urdu_interest_tracking.ip IS 'User IP address (anonymized if needed)';
COMMENT ON COLUMN urdu_interest_tracking.page_path IS 'Page where the event occurred';
