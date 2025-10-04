-- Migration: Update price columns to support cryptocurrency prices
-- Bitcoin can exceed $100,000, current DECIMAL(10,5) only supports up to 99,999
-- New DECIMAL(15,5) supports up to 9,999,999,999.99999

-- Update signals table
ALTER TABLE signals
  ALTER COLUMN entry TYPE DECIMAL(15,5),
  ALTER COLUMN stop_loss TYPE DECIMAL(15,5),
  ALTER COLUMN take_profit TYPE DECIMAL(15,5),
  ALTER COLUMN current_price TYPE DECIMAL(15,5);

-- Verify the changes
SELECT column_name, data_type, numeric_precision, numeric_scale
FROM information_schema.columns
WHERE table_name = 'signals'
  AND column_name IN ('entry', 'stop_loss', 'take_profit', 'current_price');
