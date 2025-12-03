/*
  # Add Stock Data Cache Column

  1. Changes
    - Add `stock_data` column to `ai_cache` table to store complete stock information
    - This allows caching of full stock data (basic, current, range, historical) for 5 minutes
    - Reduces load on Kabutan website and improves response time

  2. Notes
    - Uses JSONB for efficient storage and querying
    - Existing diagnosis_result column remains for AI diagnosis caching
    - No data migration needed as this is a new feature
*/

-- Add stock_data column to ai_cache table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ai_cache' AND column_name = 'stock_data'
  ) THEN
    ALTER TABLE ai_cache ADD COLUMN stock_data jsonb;
  END IF;
END $$;

-- Make diagnosis_result nullable since some cache entries may only have stock_data
DO $$
BEGIN
  ALTER TABLE ai_cache ALTER COLUMN diagnosis_result DROP NOT NULL;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;
