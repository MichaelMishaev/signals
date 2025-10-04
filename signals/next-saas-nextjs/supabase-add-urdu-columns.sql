-- ========================================
-- Add Urdu Translation Columns
-- ========================================
-- Run this SQL in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/avxygvzqfyxpzdxwmefe/sql/new

-- Add Urdu columns to signals table
ALTER TABLE public.signals
  ADD COLUMN IF NOT EXISTS title_ur TEXT,
  ADD COLUMN IF NOT EXISTS content_ur TEXT,
  ADD COLUMN IF NOT EXISTS author_ur TEXT;

-- Add Urdu columns to drills table
ALTER TABLE public.drills
  ADD COLUMN IF NOT EXISTS title_ur TEXT,
  ADD COLUMN IF NOT EXISTS description_ur TEXT,
  ADD COLUMN IF NOT EXISTS content_ur TEXT;

-- Verify columns were added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'signals' AND column_name LIKE '%_ur';

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'drills' AND column_name LIKE '%_ur';
