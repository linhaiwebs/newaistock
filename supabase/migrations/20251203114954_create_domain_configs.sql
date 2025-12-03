/*
  # Create Domain Configuration System

  1. New Tables
    - `domain_configs`
      - `id` (uuid, primary key)
      - `domain` (text, unique) - The domain name
      - `site_name` (text) - Display name for the site
      - `site_description` (text) - SEO description
      - `google_ads_publisher_id` (text, nullable) - Google Ads Publisher ID
      - `google_verification_code` (text, nullable) - Google verification meta tag
      - `google_analytics_id` (text, nullable) - GA tracking ID
      - `robots_config` (jsonb) - Custom robots.txt rules
      - `ads_txt_content` (text, nullable) - Additional ads.txt entries
      - `seo_config` (jsonb) - SEO metadata (keywords, og tags, etc)
      - `is_active` (boolean) - Whether this domain config is active
      - `is_default` (boolean) - Whether this is the default fallback config
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `domain_configs` table
    - Add policy for authenticated admins to manage domains
    - Public read access for active domain configs
*/

CREATE TABLE IF NOT EXISTS domain_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text UNIQUE NOT NULL,
  site_name text NOT NULL,
  site_description text NOT NULL DEFAULT '',
  google_ads_publisher_id text,
  google_verification_code text,
  google_analytics_id text,
  robots_config jsonb DEFAULT '{
    "allow": ["/"],
    "disallow": ["/admin", "/api"],
    "crawlDelay": null,
    "customRules": []
  }'::jsonb,
  ads_txt_content text,
  seo_config jsonb DEFAULT '{
    "title": "",
    "keywords": [],
    "author": "",
    "ogImage": "",
    "twitterCard": "summary_large_image",
    "locale": "ja_JP",
    "language": "ja"
  }'::jsonb,
  is_active boolean DEFAULT true,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE domain_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active domain configs"
  ON domain_configs
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage domain configs"
  ON domain_configs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_domain_configs_domain ON domain_configs(domain);
CREATE INDEX IF NOT EXISTS idx_domain_configs_is_default ON domain_configs(is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_domain_configs_is_active ON domain_configs(is_active) WHERE is_active = true;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM domain_configs WHERE is_default = true) THEN
    INSERT INTO domain_configs (
      domain,
      site_name,
      site_description,
      seo_config,
      robots_config,
      is_active,
      is_default
    ) VALUES (
      'localhost',
      'AI株式診断',
      '最新のAI技術を活用した株式分析システム。銘柄コードを入力するだけで、詳細な投資分析レポートを即座に生成します。',
      '{
        "title": "AI株式診断 | 最新のAI技術で株式を分析",
        "keywords": ["AI", "株式分析", "株価診断", "投資", "日本株", "テクニカル分析"],
        "author": "AI Stock Analysis Team",
        "ogImage": "/og-image.jpg",
        "twitterCard": "summary_large_image",
        "locale": "ja_JP",
        "language": "ja"
      }'::jsonb,
      '{
        "allow": ["/"],
        "disallow": ["/admin", "/api"],
        "crawlDelay": null,
        "customRules": []
      }'::jsonb,
      true,
      true
    );
  END IF;
END $$;
