/*
  # Fix Analytics Config updated_by Field

  1. Changes
    - Make `updated_by` field in `analytics_config` table nullable
    - This allows saving analytics configuration even when the JWT user doesn't exist in admin_users
    - Preserves the foreign key relationship for audit purposes when possible

  2. Reason
    - Previous constraint required valid admin_users.id reference
    - JWT tokens may contain user IDs that don't exist in admin_users table
    - Failing to save config due to FK constraint caused data loss appearance

  3. Solution
    - Remove NOT NULL constraint from updated_by
    - Keep foreign key relationship but allow NULL values
    - Update any existing records with invalid references to NULL
*/

-- First, update any existing records that have invalid updated_by references
UPDATE analytics_config
SET updated_by = NULL
WHERE updated_by IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM admin_users WHERE id = analytics_config.updated_by
  );

-- Drop the existing foreign key constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'analytics_config_updated_by_fkey'
    AND table_name = 'analytics_config'
  ) THEN
    ALTER TABLE analytics_config DROP CONSTRAINT analytics_config_updated_by_fkey;
  END IF;
END $$;

-- Re-add the foreign key constraint but allow NULL values
ALTER TABLE analytics_config
ADD CONSTRAINT analytics_config_updated_by_fkey
FOREIGN KEY (updated_by) REFERENCES admin_users(id)
ON DELETE SET NULL;

-- Ensure the column is nullable (in case it wasn't already)
ALTER TABLE analytics_config ALTER COLUMN updated_by DROP NOT NULL;
