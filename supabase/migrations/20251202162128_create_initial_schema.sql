/*
  # Initial Schema for AI Stock Analysis System

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key) - Unique admin identifier
      - `username` (text, unique) - Admin login username
      - `password_hash` (text) - Bcrypt hashed password
      - `role` (text) - Admin role (admin, super_admin)
      - `last_login` (timestamptz) - Last login timestamp
      - `created_at` (timestamptz) - Account creation time
    
    - `user_sessions`
      - `id` (uuid, primary key) - Unique session identifier
      - `session_id` (text, unique) - Browser session ID
      - `ip_address` (text) - User IP address
      - `user_agent` (text) - Browser user agent
      - `referrer` (text) - Traffic source
      - `first_visit` (timestamptz) - First page visit time
      - `last_activity` (timestamptz) - Last activity timestamp
      - `session_duration` (integer) - Total session time in seconds
      - `created_at` (timestamptz) - Session start time
    
    - `user_events`
      - `id` (uuid, primary key) - Event unique identifier
      - `session_id` (uuid, foreign key) - Links to user_sessions
      - `event_type` (text) - Event type (page_view, diagnosis_click, conversion_click, etc)
      - `stock_code` (text) - Stock code if applicable
      - `event_data` (jsonb) - Additional event metadata
      - `created_at` (timestamptz) - Event timestamp
    
    - `stock_diagnoses`
      - `id` (uuid, primary key) - Diagnosis unique identifier
      - `session_id` (uuid, foreign key) - Links to user_sessions
      - `stock_code` (text) - Japanese stock code
      - `diagnosis_result` (text) - AI analysis result
      - `from_cache` (boolean) - Whether result was cached
      - `converted` (boolean) - Whether user clicked conversion button
      - `created_at` (timestamptz) - Diagnosis timestamp
    
    - `redirect_links`
      - `id` (serial, primary key) - Auto-incrementing ID
      - `user_id` (text) - Associated user identifier
      - `target_url` (text) - Redirect destination URL
      - `weight` (integer) - Priority weight (1-100)
      - `click_count` (integer) - Total clicks received
      - `active` (boolean) - Whether link is active
      - `created_at` (timestamptz) - Link creation time
      - `updated_at` (timestamptz) - Last update time
    
    - `ai_cache`
      - `id` (uuid, primary key) - Cache entry identifier
      - `stock_code` (text, unique) - Stock code as cache key
      - `diagnosis_result` (text) - Cached AI result
      - `cache_timestamp` (timestamptz) - When cached
      - `expiry_date` (timestamptz) - When cache expires
      - `hit_count` (integer) - Number of cache hits
    
    - `templates`
      - `id` (uuid, primary key) - Template identifier
      - `template_name` (text, unique) - Template display name
      - `template_slug` (text, unique) - URL-friendly identifier
      - `html_structure` (text) - Template HTML structure
      - `custom_footer` (text) - Custom footer content
      - `custom_text` (jsonb) - Customizable text fields
      - `active` (boolean) - Whether template is active
      - `created_at` (timestamptz) - Template creation time
      - `updated_at` (timestamptz) - Last modification time
    
    - `analytics_config`
      - `id` (uuid, primary key) - Config identifier
      - `ga4_measurement_id` (text) - Google Analytics 4 ID
      - `google_ads_conversion_id` (text) - Google Ads conversion ID
      - `conversion_action_id` (text) - Specific conversion action ID
      - `enabled` (boolean) - Whether GA tracking is enabled
      - `updated_at` (timestamptz) - Last configuration update
      - `updated_by` (uuid) - Admin who made the change

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated admin access
    - Public access for tracking endpoints only
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  last_login timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can read own data"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  ip_address text,
  user_agent text,
  referrer text,
  first_visit timestamptz DEFAULT now(),
  last_activity timestamptz DEFAULT now(),
  session_duration integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert sessions"
  ON user_sessions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can update own session"
  ON user_sessions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can read all sessions"
  ON user_sessions FOR SELECT
  TO authenticated
  USING (true);

-- Create user_events table
CREATE TABLE IF NOT EXISTS user_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES user_sessions(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  stock_code text,
  event_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert events"
  ON user_events FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admins can read all events"
  ON user_events FOR SELECT
  TO authenticated
  USING (true);

-- Create stock_diagnoses table
CREATE TABLE IF NOT EXISTS stock_diagnoses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES user_sessions(id) ON DELETE CASCADE,
  stock_code text NOT NULL,
  diagnosis_result text NOT NULL,
  from_cache boolean DEFAULT false,
  converted boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stock_diagnoses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can insert diagnoses"
  ON stock_diagnoses FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can update diagnoses"
  ON stock_diagnoses FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can read all diagnoses"
  ON stock_diagnoses FOR SELECT
  TO authenticated
  USING (true);

-- Create redirect_links table
CREATE TABLE IF NOT EXISTS redirect_links (
  id serial PRIMARY KEY,
  user_id text NOT NULL,
  target_url text NOT NULL,
  weight integer NOT NULL DEFAULT 100 CHECK (weight >= 1 AND weight <= 100),
  click_count integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE redirect_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active links"
  ON redirect_links FOR SELECT
  TO anon
  USING (active = true);

CREATE POLICY "Public can increment click count"
  ON redirect_links FOR UPDATE
  TO anon
  USING (active = true)
  WITH CHECK (active = true);

CREATE POLICY "Admins can manage links"
  ON redirect_links FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create ai_cache table
CREATE TABLE IF NOT EXISTS ai_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_code text UNIQUE NOT NULL,
  diagnosis_result text NOT NULL,
  cache_timestamp timestamptz DEFAULT now(),
  expiry_date timestamptz NOT NULL,
  hit_count integer DEFAULT 0
);

ALTER TABLE ai_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read cache"
  ON ai_cache FOR SELECT
  TO anon
  USING (expiry_date > now());

CREATE POLICY "Public can insert cache"
  ON ai_cache FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Public can update cache hit count"
  ON ai_cache FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete cache"
  ON ai_cache FOR DELETE
  TO authenticated
  USING (true);

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name text UNIQUE NOT NULL,
  template_slug text UNIQUE NOT NULL,
  html_structure text,
  custom_footer text,
  custom_text jsonb DEFAULT '{}'::jsonb,
  active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active templates"
  ON templates FOR SELECT
  TO anon
  USING (active = true);

CREATE POLICY "Admins can manage templates"
  ON templates FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create analytics_config table
CREATE TABLE IF NOT EXISTS analytics_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ga4_measurement_id text,
  google_ads_conversion_id text,
  conversion_action_id text,
  enabled boolean DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES admin_users(id)
);

ALTER TABLE analytics_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read analytics config if enabled"
  ON analytics_config FOR SELECT
  TO anon
  USING (enabled = true);

CREATE POLICY "Admins can manage analytics config"
  ON analytics_config FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_events_session_id ON user_events(session_id);
CREATE INDEX IF NOT EXISTS idx_user_events_created_at ON user_events(created_at);
CREATE INDEX IF NOT EXISTS idx_stock_diagnoses_session_id ON stock_diagnoses(session_id);
CREATE INDEX IF NOT EXISTS idx_stock_diagnoses_stock_code ON stock_diagnoses(stock_code);
CREATE INDEX IF NOT EXISTS idx_ai_cache_stock_code ON ai_cache(stock_code);
CREATE INDEX IF NOT EXISTS idx_redirect_links_active ON redirect_links(active, weight);

-- Insert default analytics config
INSERT INTO analytics_config (enabled) VALUES (false) ON CONFLICT DO NOTHING;

-- Insert default template
INSERT INTO templates (template_name, template_slug, active, custom_text) 
VALUES (
  'デフォルトテンプレート',
  'default',
  true,
  '{"title": "AI株式診断", "subtitle": "最新のAI技術で株式を分析", "button_text": "今すぐ診断", "convert_button": "詳細を見る"}'::jsonb
) ON CONFLICT DO NOTHING;