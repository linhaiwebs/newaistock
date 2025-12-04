/*
  # Add Template Categories

  This migration adds category support to the landing_templates table.

  1. Changes to landing_templates table
    - Add `category` column (text) - The category classification (e.g., 'stock-analysis', 'crypto', 'forex')
    - Add `category_order` column (integer) - Order position within the category for sorting
    - Set default category to 'general' for existing templates
    - Add index on category for efficient filtering queries

  2. Data Migration
    - Update existing templates with appropriate categories based on their use case
    - Set category_order to maintain current display order

  ## Notes
  - Category is nullable to support templates without specific categorization
  - category_order defaults to 0, allowing manual ordering within categories
  - Existing templates will default to 'general' category
*/

-- Add category column to landing_templates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'landing_templates' AND column_name = 'category'
  ) THEN
    ALTER TABLE landing_templates ADD COLUMN category text DEFAULT 'general';
  END IF;
END $$;

-- Add category_order column to landing_templates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'landing_templates' AND column_name = 'category_order'
  ) THEN
    ALTER TABLE landing_templates ADD COLUMN category_order integer DEFAULT 0;
  END IF;
END $$;

-- Create index on category for efficient filtering
CREATE INDEX IF NOT EXISTS idx_landing_templates_category ON landing_templates(category);

-- Create composite index for category ordering queries
CREATE INDEX IF NOT EXISTS idx_landing_templates_category_order ON landing_templates(category, category_order);

-- Update existing templates with appropriate categories
-- Default template is stock analysis
UPDATE landing_templates 
SET category = 'stock-analysis', category_order = 0 
WHERE name = 'default' AND category = 'general';

-- Modern template is stock analysis
UPDATE landing_templates 
SET category = 'stock-analysis', category_order = 1 
WHERE name = 'modern' AND category = 'general';

-- Professional template is stock analysis
UPDATE landing_templates 
SET category = 'stock-analysis', category_order = 2 
WHERE name = 'professional' AND category = 'general';

-- Minimal template is general purpose
UPDATE landing_templates 
SET category = 'general', category_order = 0 
WHERE name = 'minimal' AND category = 'general';