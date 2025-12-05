/*
  # Remove footer_config columns

  1. Changes
    - Remove `footer_config` column from `domain_configs` table
    - Remove `footer_config` column from `landing_templates` table
  
  2. Reason
    - Footer configuration has been replaced with the new footer_pages system
    - All footers now globally use the footer_pages table with copyright text from site_content
    - This simplifies the architecture and removes redundant configuration
*/

-- Remove footer_config from domain_configs
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'domain_configs' AND column_name = 'footer_config'
  ) THEN
    ALTER TABLE domain_configs DROP COLUMN footer_config;
  END IF;
END $$;

-- Remove footer_config from landing_templates
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'landing_templates' AND column_name = 'footer_config'
  ) THEN
    ALTER TABLE landing_templates DROP COLUMN footer_config;
  END IF;
END $$;
