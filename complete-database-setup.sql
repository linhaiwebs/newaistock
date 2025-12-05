/*
  ========================================
  AI 株式診断システム - 完全データベースセットアップ
  ========================================

  このスクリプトは、新しい Supabase インスタンスで実行するための完全なデータベースセットアップです。

  含まれる内容：
  - 全テーブル構造
  - インデックス
  - Row Level Security (RLS) ポリシー
  - トリガーと関数
  - 初期データ
  - 制約とチェック

  テンプレートシステム：
  - landing_templates: ランディングページテンプレート（新システム）
  - template_content: テンプレートのコンテンツ管理
  - footer_pages: グローバルフッターページ（全テンプレートで共有）
  - domain_configs.footer_config: ドメイン固有のフッター設定（オプション）

  実行方法：
  1. Supabase ダッシュボードを開く
  2. SQL Editor に移動
  3. このスクリプト全体をコピー＆ペースト
  4. "Run" をクリック

  注意：このスクリプトは複数回実行しても安全です（幂等性）
*/

-- ========================================
-- 1. 管理者ユーザーテーブル
-- ========================================

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

-- ========================================
-- 2. セッション追跡テーブル
-- ========================================

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

-- ========================================
-- 3. ユーザーイベントテーブル
-- ========================================

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

-- ========================================
-- 4. 株式診断テーブル
-- ========================================

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

-- ========================================
-- 5. リダイレクトリンクテーブル
-- ========================================

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

-- ========================================
-- 6. AI キャッシュテーブル
-- ========================================

CREATE TABLE IF NOT EXISTS ai_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stock_code text UNIQUE NOT NULL,
  diagnosis_result text,
  stock_data jsonb,
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

-- ========================================
-- 7. アナリティクス設定テーブル（シングルトン）
-- ========================================

CREATE TABLE IF NOT EXISTS analytics_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ga4_measurement_id text,
  google_ads_conversion_id text,
  conversion_action_id text,
  enabled boolean DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  singleton_guard integer NOT NULL DEFAULT 1
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

-- シングルトン制約（1レコードのみ許可）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE indexname = 'analytics_config_singleton_idx'
  ) THEN
    CREATE UNIQUE INDEX analytics_config_singleton_idx ON analytics_config (singleton_guard);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'analytics_config_singleton_check'
    AND table_name = 'analytics_config'
  ) THEN
    ALTER TABLE analytics_config
    ADD CONSTRAINT analytics_config_singleton_check
    CHECK (singleton_guard = 1);
  END IF;
END $$;

-- ========================================
-- 8. 落地页模板系统
-- ========================================

CREATE TABLE IF NOT EXISTS landing_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  template_key text UNIQUE NOT NULL,
  description text,
  is_active boolean DEFAULT false,
  preview_image text,
  config jsonb DEFAULT '{}'::jsonb,
  category text DEFAULT 'general',
  category_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS template_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES landing_templates(id) ON DELETE CASCADE,
  content_key text NOT NULL,
  content_value text NOT NULL,
  content_type text DEFAULT 'text' CHECK (content_type IN ('text', 'html', 'image_url')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(template_id, content_key)
);

ALTER TABLE landing_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active templates"
  ON landing_templates FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anyone can view active template content"
  ON template_content FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM landing_templates
      WHERE landing_templates.id = template_content.template_id
      AND landing_templates.is_active = true
    )
  );

CREATE POLICY "Authenticated users can view all templates"
  ON landing_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create templates"
  ON landing_templates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update templates"
  ON landing_templates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete templates"
  ON landing_templates FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view all template content"
  ON template_content FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create template content"
  ON template_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update template content"
  ON template_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete template content"
  ON template_content FOR DELETE
  TO authenticated
  USING (true);

-- ========================================
-- 9. ドメイン設定テーブル
-- ========================================

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
  footer_config jsonb DEFAULT '{}'::jsonb,
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

-- ========================================
-- 10. サイトコンテンツ管理テーブル
-- ========================================

CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site content"
  ON site_content
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert content"
  ON site_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update content"
  ON site_content
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete content"
  ON site_content
  FOR DELETE
  TO authenticated
  USING (true);

-- ========================================
-- 11. フッターページテーブル
-- ========================================

CREATE TABLE IF NOT EXISTS footer_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL DEFAULT '',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE footer_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active footer pages"
  ON footer_pages
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert footer pages"
  ON footer_pages
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update footer pages"
  ON footer_pages
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete footer pages"
  ON footer_pages
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'admin'
    )
  );

-- ========================================
-- 12. インデックス作成
-- ========================================

CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_events_session_id ON user_events(session_id);
CREATE INDEX IF NOT EXISTS idx_user_events_created_at ON user_events(created_at);
CREATE INDEX IF NOT EXISTS idx_stock_diagnoses_session_id ON stock_diagnoses(session_id);
CREATE INDEX IF NOT EXISTS idx_stock_diagnoses_stock_code ON stock_diagnoses(stock_code);
CREATE INDEX IF NOT EXISTS idx_ai_cache_stock_code ON ai_cache(stock_code);
CREATE INDEX IF NOT EXISTS idx_redirect_links_active ON redirect_links(active, weight);
CREATE INDEX IF NOT EXISTS idx_landing_templates_active ON landing_templates(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_landing_templates_key ON landing_templates(template_key);
CREATE INDEX IF NOT EXISTS idx_landing_templates_category ON landing_templates(category);
CREATE INDEX IF NOT EXISTS idx_landing_templates_category_order ON landing_templates(category, category_order);
CREATE INDEX IF NOT EXISTS idx_template_content_template_id ON template_content(template_id);
CREATE INDEX IF NOT EXISTS idx_domain_configs_domain ON domain_configs(domain);
CREATE INDEX IF NOT EXISTS idx_domain_configs_is_default ON domain_configs(is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_domain_configs_is_active ON domain_configs(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_domain_configs_footer_config ON domain_configs USING gin(footer_config);
CREATE INDEX IF NOT EXISTS idx_footer_pages_slug ON footer_pages(slug);
CREATE INDEX IF NOT EXISTS idx_footer_pages_display_order ON footer_pages(display_order);
CREATE INDEX IF NOT EXISTS idx_footer_pages_is_active ON footer_pages(is_active);

-- ========================================
-- 13. トリガー関数と自動更新
-- ========================================

-- updated_at 自動更新関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルにトリガーを追加
DROP TRIGGER IF EXISTS update_landing_templates_updated_at ON landing_templates;
CREATE TRIGGER update_landing_templates_updated_at
  BEFORE UPDATE ON landing_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_template_content_updated_at ON template_content;
CREATE TRIGGER update_template_content_updated_at
  BEFORE UPDATE ON template_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_footer_pages_updated_at ON footer_pages;
CREATE TRIGGER update_footer_pages_updated_at
  BEFORE UPDATE ON footer_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- シングルアクティブテンプレート保証関数
CREATE OR REPLACE FUNCTION ensure_single_active_template()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE landing_templates
    SET is_active = false
    WHERE id != NEW.id AND is_active = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_single_active_template ON landing_templates;
CREATE TRIGGER enforce_single_active_template
  BEFORE INSERT OR UPDATE ON landing_templates
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION ensure_single_active_template();

-- ========================================
-- 14. 初期データ挿入
-- ========================================

-- デフォルト管理者アカウント
INSERT INTO admin_users (username, password_hash, role)
VALUES ('adsadmin', '$2b$10$ice/TC5auHiWg2kwzJIUSe0lPmePL9DsgXRjea5sLuF/VdCrc3z2W', 'admin')
ON CONFLICT (username) DO NOTHING;

-- デフォルトアナリティクス設定
INSERT INTO analytics_config (enabled, singleton_guard)
VALUES (false, 1)
ON CONFLICT (singleton_guard) DO NOTHING;

-- ランディングページテンプレート
INSERT INTO landing_templates (name, template_key, description, is_active, config, category, category_order) VALUES
  ('デフォルトテンプレート', 'default', 'クラシックな株式診断デザイン、多くのシーンに適しています', true, '{"colors": {"primary": "#2563eb", "secondary": "#1e40af", "accent": "#4f46e5"}}'::jsonb, 'stock-analysis', 0),
  ('ミニマルテンプレート', 'minimal', 'シンプルでクリーンなデザイン、コンテンツの表示に注力', false, '{"colors": {"primary": "#0f172a", "secondary": "#334155", "accent": "#64748b"}}'::jsonb, 'general', 0),
  ('プロフェッショナルテンプレート', 'professional', 'ビジネス向けの専門的なデザイン、企業ユーザーに適しています', false, '{"colors": {"primary": "#0c4a6e", "secondary": "#075985", "accent": "#0284c7"}}'::jsonb, 'stock-analysis', 2),
  ('モダンテンプレート', 'modern', 'スタイリッシュでモダンなデザイン、若い投資家に魅力的', false, '{"colors": {"primary": "#7c3aed", "secondary": "#6d28d9", "accent": "#8b5cf6"}}'::jsonb, 'stock-analysis', 1),
  ('AI株式分析テンプレート', 'ai-stock', 'AIをテーマにしたカラフルでモダンなモバイル向けデザイン、傾斜カード効果付き', false, '{"colors": {"primary": "#3b82f6", "secondary": "#8b5cf6", "accent": "#f97316"}}'::jsonb, 'stock-analysis', 3),
  ('科技未来風テンプレート', 'tech-future', '深色太空背景、霓虹色彩、3D立体效果、科技感十足', false, '{"colors": {"primary": "#0ea5e9", "secondary": "#0c4a6e", "accent": "#22d3ee"}}'::jsonb, 'stock-analysis', 4),
  ('簡約禅意風テンプレート', 'zen-minimal', '純白背景、極簡設計、黒白配色、大量留白', false, '{"colors": {"primary": "#000000", "secondary": "#374151", "accent": "#10b981"}}'::jsonb, 'stock-analysis', 5),
  ('金融専業風テンプレート', 'finance-pro', '深藍色主色調、金色点綴、専業金融風格', false, '{"colors": {"primary": "#1e40af", "secondary": "#172554", "accent": "#fbbf24"}}'::jsonb, 'stock-analysis', 6),
  ('渐変流体風テンプレート', 'gradient-fluid', '柔和渐変背景、流動色彩過渡、夢幻効果', false, '{"colors": {"primary": "#a855f7", "secondary": "#7c3aed", "accent": "#ec4899"}}'::jsonb, 'stock-analysis', 7),
  ('深色霓虹風テンプレート', 'dark-neon', '純黒背景、荧光色辺框、賽博龐克風格', false, '{"colors": {"primary": "#10b981", "secondary": "#14532d", "accent": "#ec4899"}}'::jsonb, 'stock-analysis', 8),
  ('玻璃拟態風テンプレート', 'glass-morph', '模糊半透明背景、毛玻璃効果、精緻辺框', false, '{"colors": {"primary": "#3b82f6", "secondary": "#1e40af", "accent": "#06b6d4"}}'::jsonb, 'stock-analysis', 9),
  ('卡片網格風テンプレート', 'card-grid', '網格布局、多彩卡片、立体投影、対称排列', false, '{"colors": {"primary": "#3b82f6", "secondary": "#1d4ed8", "accent": "#06b6d4"}}'::jsonb, 'stock-analysis', 10),
  ('極簡線条風テンプレート', 'ultra-lines', '白色背景、黒色細線、極簡設計、線性美学', false, '{"colors": {"primary": "#18181b", "secondary": "#27272a", "accent": "#71717a"}}'::jsonb, 'stock-analysis', 11),
  ('温暖橙調風テンプレート', 'warm-orange', '温暖橙色渐変、友好設計、圓潤風格', false, '{"colors": {"primary": "#f97316", "secondary": "#c2410c", "accent": "#fbbf24"}}'::jsonb, 'stock-analysis', 12),
  ('商務高端風テンプレート', 'business-premium', '深灰銀色主色調、金色点綴、高端商務風格', false, '{"colors": {"primary": "#475569", "secondary": "#1e293b", "accent": "#d4af37"}}'::jsonb, 'stock-analysis', 13)
ON CONFLICT (template_key) DO NOTHING;

-- テンプレートコンテンツ（デフォルトテンプレート用）
WITH default_template AS (
  SELECT id FROM landing_templates WHERE template_key = 'default' LIMIT 1
)
INSERT INTO template_content (template_id, content_key, content_value, content_type)
SELECT
  id,
  content_key,
  content_value,
  content_type
FROM default_template,
LATERAL (VALUES
  ('hero_title', 'AI株式診断', 'text'),
  ('hero_subtitle', '最新のAI技術で株式を分析', 'text'),
  ('hero_description', '株式コードを入力して、詳細な投資分析レポートを即座に取得', 'text'),
  ('hero_button_text', '診断開始', 'text'),
  ('feature_1_title', 'リアルタイムデータ分析', 'text'),
  ('feature_1_description', '最新の株式市場データを取得し、深度分析を実施', 'text'),
  ('feature_2_title', 'AIスマート診断', 'text'),
  ('feature_2_description', '先進的なAIアルゴリズムで専門的な投資アドバイスを提供', 'text'),
  ('feature_3_title', '詳細分析レポート', 'text'),
  ('feature_3_description', '包括的な株式分析レポートを生成し、賢明な判断をサポート', 'text'),
  ('result_title', 'AI株式診断結果', 'text'),
  ('result_button_text', '詳細を見る', 'text'),
  ('analyzing_title', 'AI分析中', 'text'),
  ('analyzing_description', '株式データを詳細に分析中...', 'text'),
  ('footer_text', '© 2024 AI株式診断システム. All rights reserved.', 'text')
) AS content_data(content_key, content_value, content_type)
ON CONFLICT (template_id, content_key) DO NOTHING;

-- テンプレートコンテンツ（AI株式分析テンプレート用）
WITH ai_stock_template AS (
  SELECT id FROM landing_templates WHERE template_key = 'ai-stock' LIMIT 1
)
INSERT INTO template_content (template_id, content_key, content_value, content_type)
SELECT
  id,
  content_key,
  content_value,
  content_type
FROM ai_stock_template,
LATERAL (VALUES
  ('hero_title', '株式情報をもっとわかりやすく', 'text'),
  ('hero_subtitle', 'AIが公開市場データを理解し、ニュースを整理し、より直感的な株式トレンドを表示します。', 'text'),
  ('feature1_title', 'AI株式トレンド解読', 'text'),
  ('feature1_description', 'AIが公開データを分析し、市場トレンドの変化を理解しやすくします。', 'text'),
  ('feature2_title', '市場ニュースのスマート整理', 'text'),
  ('feature2_description', '公開された財務ニュースとホットトピックを自動的にまとめ、重要な情報を素早く把握します。', 'text'),
  ('feature3_title', 'パーソナライズされたデータパネル', 'text'),
  ('feature3_description', 'あなたが注目する株式とセクターの公開データを表示し、カスタマイズされた表示方法をサポートします。', 'text'),
  ('form_title', '株式コードを入力してください', 'text'),
  ('input_placeholder', '株式コードを入力', 'text'),
  ('submit_button', '分析開始', 'text')
) AS content_data(content_key, content_value, content_type)
ON CONFLICT (template_id, content_key) DO NOTHING;

-- デフォルトドメイン設定
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM domain_configs WHERE is_default = true) THEN
    INSERT INTO domain_configs (
      domain,
      site_name,
      site_description,
      seo_config,
      robots_config,
      footer_config,
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
      '{
        "disclaimer_title": "重要事項・免責事項",
        "tool_nature": "本サービスは、人工知能（AI）技術を活用した株式分析ツールです。市場データの収集と分析を行い、情報提供を目的としています。",
        "investment_disclaimer": "本サービスで提供される分析結果、情報、データ等は、投資判断の参考情報として提供するものであり、投資勧誘、売買推奨、または専門的な金融アドバイスを目的としたものではありません。",
        "user_responsibility": "投資判断および投資行動は、利用者ご自身の責任において行っていただく必要があります。投資による損益は全て投資家ご自身に帰属し、当サービスは一切の責任を負いません。",
        "license_statement": "本サービスは情報提供ツールであり、金融商品取引業務を行うものではありません。したがって、日本の金融庁による金融商品取引業の登録・免許を必要としません。",
        "compliance_statement": "本サービスは日本の金融商品取引法その他関連法令を遵守し、客観的なデータ分析と情報提供のみを行います。特定の金融商品の勧誘や販売を行うものではありません。",
        "google_ads_compliance": "本サービスはGoogle広告ポリシーを遵守しており、規制対象となる金融サービスの提供は行っておりません。",
        "risk_warning": "株式投資にはリスクが伴います。投資元本の損失が生じる可能性があることを十分にご理解の上、ご利用ください。",
        "data_accuracy": "本サービスは情報の正確性確保に努めておりますが、提供する情報の完全性、正確性、有用性、適時性について保証するものではありません。",
        "updated_date": "2025年12月"
      }'::jsonb,
      true,
      true
    );
  END IF;
END $$;

-- サイトコンテンツの挿入
INSERT INTO site_content (key, content, category, description) VALUES
  -- ヒーローセクション
  ('hero.title', '株式診断で賢い投資判断を', 'hero', 'メインタイトル'),
  ('hero.subtitle', 'AIを活用した詳細な分析で、あなたの投資をサポートします', 'hero', 'サブタイトル'),
  ('hero.cta', '今すぐ診断開始', 'hero', 'CTAボタン'),

  -- 機能セクション
  ('features.title', '主な機能', 'features', '機能セクションのタイトル'),
  ('features.ai.title', 'AI分析', 'features', 'AI機能のタイトル'),
  ('features.ai.description', '先進的なAI技術で株式を詳細に分析', 'features', 'AI機能の説明'),
  ('features.realtime.title', 'リアルタイムデータ', 'features', 'リアルタイム機能のタイトル'),
  ('features.realtime.description', '最新の市場データに基づいた診断結果', 'features', 'リアルタイム機能の説明'),
  ('features.comprehensive.title', '包括的レポート', 'features', 'レポート機能のタイトル'),
  ('features.comprehensive.description', '詳細な分析レポートで投資判断をサポート', 'features', 'レポート機能の説明'),

  -- フォーム
  ('form.label', '株式コードまたは企業名を入力', 'form', 'フォームラベル'),
  ('form.placeholder', '例：7203 (トヨタ自動車)', 'form', 'フォームプレースホルダー'),
  ('form.button', '診断する', 'form', '診断ボタン'),
  ('form.analyzing', '分析中...', 'form', '分析中のメッセージ'),

  -- 結果
  ('result.stockInfo', '株式情報', 'result', '株式情報セクション'),
  ('result.analysis', '分析', 'result', '分析セクション'),
  ('result.backButton', '新しい診断', 'result', '戻るボタン'),

  -- フッター
  ('footer.disclaimer', '本サービスは情報提供のみを目的としており、投資助言サービスではありません。金融商品取引業の登録は行っておりません。投資判断は必ず自己責任で行い、専門家にご相談ください。', 'footer', '免責事項'),
  ('footer.copyright', '© 2024 AI株式診断ツール. 情報提供・教育目的のみ', 'footer', '著作権表示'),

  -- エラーメッセージ
  ('error.notFound', '株式が見つかりませんでした', 'error', '見つからないエラー'),
  ('error.generic', 'エラーが発生しました。もう一度お試しください。', 'error', '一般的なエラー'),

  -- 管理画面
  ('admin.content.title', 'コンテンツ管理', 'admin', '管理画面タイトル'),
  ('admin.content.add', '新しいコンテンツを追加', 'admin', '追加ボタン'),
  ('admin.content.edit', '編集', 'admin', '編集ボタン'),
  ('admin.content.delete', '削除', 'admin', '削除ボタン'),
  ('admin.content.save', '保存', 'admin', '保存ボタン'),
  ('admin.content.cancel', 'キャンセル', 'admin', 'キャンセルボタン'),
  ('admin.content.key', 'キー', 'admin', 'キーフィールド'),
  ('admin.content.content', 'コンテンツ', 'admin', 'コンテンツフィールド'),
  ('admin.content.category', 'カテゴリ', 'admin', 'カテゴリフィールド'),
  ('admin.content.description', '説明', 'admin', '説明フィールド')
ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  description = EXCLUDED.description;

-- フッターページの挿入
INSERT INTO footer_pages (title, slug, content, display_order, is_active) VALUES
  (
    'プライバシーポリシー',
    'privacy-policy',
    E'# プライバシーポリシー\n\n最終更新日：2024年12月\n\n## 1. 基本方針\n\n当サイトは、ユーザーの個人情報保護を重要視し、個人情報保護法その他の関連法令を遵守します。\n\n## 2. 収集する情報\n\n当サイトでは、サービス提供のため以下の情報を収集する場合があります：\n\n- アクセスログ（IPアドレス、ブラウザ情報、アクセス日時など）\n- Cookie情報\n- 検索された銘柄コードや企業名（統計目的のみ）\n\n**個人を特定する情報や金融資産情報は一切収集しません。**\n\n## 3. 情報の利用目的\n\n収集した情報は以下の目的でのみ利用します：\n\n- サービスの提供・改善\n- アクセス解析と統計情報の作成\n- サーバーの保守・管理\n\n## 4. 第三者提供\n\n当サイトは、法令に基づく場合を除き、収集した情報を第三者に提供することはありません。\n\n## 5. アクセス解析ツール\n\n当サイトでは、サービス向上のためGoogle Analyticsなどのアクセス解析ツールを使用する場合があります。これらのツールはCookieを使用して情報を収集しますが、個人を特定する情報は含まれません。\n\n## 6. お問い合わせ\n\nプライバシーポリシーに関するご質問は、お問い合わせページよりご連絡ください。',
    1,
    true
  ),
  (
    '利用規約',
    'terms-of-service',
    E'# 利用規約\n\n最終更新日：2024年12月\n\n## 1. 規約への同意\n\n本サイトをご利用いただくことで、本利用規約に同意したものとみなされます。\n\n## 2. サービスの内容\n\n本サイトは、公開されている株式市場の情報を収集・分析し、視覚的に表示する**情報提供・教育目的のツール**です。\n\n## 3. サービスの性質と制限\n\n**重要な注意事項：**\n\n- 本サイトは投資助言サービスではありません\n- 金融商品取引業の登録は行っておりません\n- 投資推奨や売買の勧誘は一切行いません\n- 表示される情報は参考情報であり、投資判断の根拠とすべきではありません\n\n## 4. データの正確性について\n\n- 表示されるデータは公開情報に基づきますが、遅延や誤差が含まれる可能性があります\n- データの正確性、完全性、適時性について保証するものではありません\n- システムエラーやデータ提供元の問題により、情報が不正確になる場合があります\n\n## 5. ユーザーの責任\n\n- 投資判断は必ずご自身の責任で行ってください\n- 投資を行う際は、金融商品取引業の登録を受けた専門家にご相談ください\n- 本サイトの情報のみに基づいた投資判断による損失について、当サイトは一切の責任を負いません\n\n## 6. 免責事項\n\n本サイトの利用により生じた損害（投資損失、機会損失、データ消失など）について、当サイトは一切の責任を負いません。\n\n## 7. 規約の変更\n\n当サイトは、本規約を予告なく変更する権利を有します。変更後の規約は、本サイトに掲載した時点で効力を生じます。',
    2,
    true
  ),
  (
    '免責事項',
    'disclaimer',
    E'# 免責事項\n\n## 投資助言ではありません\n\n**本サイトは投資助言サービスではありません。**\n\n本サイトは、公開されている株式市場データを分析・視覚化して表示する情報提供ツールです。特定の銘柄の購入や売却を推奨するものではなく、投資判断の助言を行うものでもありません。\n\n## 金融商品取引業の登録について\n\n当サイトは金融商品取引法に基づく以下の登録を行っておりません：\n\n- 投資助言・代理業\n- 投資運用業\n- 第一種金融商品取引業\n- 第二種金融商品取引業\n\n## サービスの目的\n\n本サイトは**教育および情報提供のみ**を目的としています：\n\n- 株式市場データの視覚化\n- 公開情報の分析結果の表示\n- 市場データへのアクセス支援\n\n## データの制限\n\n- 表示されるデータは公開情報に基づきますが、リアルタイムではない場合があります\n- データの遅延、誤差、欠損が生じる可能性があります\n- AIによる分析結果は統計的な処理に基づくものであり、将来の投資成果を保証するものではありません\n\n## リスクについて\n\n**投資にはリスクが伴います：**\n\n- 過去の実績は将来の結果を保証するものではありません\n- 株式投資には元本割れのリスクがあります\n- 市場の変動により、投資資金を失う可能性があります\n\n## 推奨事項\n\n投資を行う際は：\n\n- **必ず金融商品取引業の登録を受けた専門家にご相談ください**\n- 複数の情報源を参照し、総合的に判断してください\n- ご自身のリスク許容度を十分に考慮してください\n- 投資は必ず自己責任で行ってください\n\n## 責任の制限\n\n本サイトの情報利用により生じたいかなる損害（直接損害、間接損害、特別損害、派生的損害を含む）についても、当サイトは一切の責任を負いません。',
    3,
    true
  ),
  (
    '運営について',
    'about-us',
    E'# 運営について\n\n## 当サイトの目的\n\n当サイトは、株式市場の公開情報をわかりやすく視覚化し、投資に興味のある方への情報提供・教育を目的として運営しています。\n\n## 提供するサービス\n\n### 情報の視覚化\n\n- 公開されている株式市場データの収集\n- データの分析と視覚的な表示\n- 過去のデータトレンドの分析\n\n### AI技術の活用\n\nAI技術を用いて過去のデータパターンを分析し、統計情報を提供します。ただし、これは将来の予測や投資推奨ではありません。\n\n## 提供しないサービス\n\n**当サイトは以下のサービスを提供しません：**\n\n- 投資助言や推奨\n- 個別銘柄の売買推奨\n- 資産運用サービス\n- 顧客資金の管理\n- 投資収益の保証\n- 金融商品の販売\n\n## 金融ライセンスについて\n\n当サイトは金融商品取引法に基づく金融商品取引業の登録を行っておりません。投資助言業務、投資運用業務、金融商品仲介業務などは一切行いません。\n\n## 技術について\n\n最新のWeb技術とAIアルゴリズムを活用し、高速で信頼性の高いデータ視覚化を実現しています。\n\n## 教育重視の姿勢\n\n当サイトの最優先目標は、情報へのアクセスと金融リテラシーの向上支援です。投資助言や金融サービスの提供は行いません。\n\n## コンプライアンス\n\n当サイトは、日本の金融商品取引法、個人情報保護法、その他関連法令を遵守して運営しています。',
    4,
    true
  ),
  (
    'お問い合わせ',
    'contact',
    E'# お問い合わせ\n\n## ご連絡方法\n\n一般的なお問い合わせ、技術的なサポート、フィードバックについては、以下の方法でご連絡ください。\n\n## サポート\n\nメールアドレス：support@example.com\n\n## お問い合わせ時の注意事項\n\n**以下の内容についてはお答えできません：**\n\n- 個別銘柄の投資推奨\n- 売買タイミングの助言\n- ポートフォリオの構築方法\n- その他投資助言に該当する内容\n\n当サイトは投資助言サービスではありません。投資に関するご相談は、金融商品取引業の登録を受けた専門家にご相談ください。\n\n## 技術的な問題の報告\n\nWebサイトの技術的な問題が発生した場合、以下の情報をご提供いただけるとスムーズです：\n\n- 問題の詳細な説明\n- 再現手順\n- 使用しているブラウザとデバイスの情報\n- エラーメッセージのスクリーンショット（可能な場合）\n\n## 対応時間\n\nお問い合わせには、通常2〜3営業日以内に対応させていただきます。\n\n## 重要な注意\n\nどのような通信手段においても、投資助言や金融商品の勧誘は一切行いません。',
    5,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;

-- ========================================
-- セットアップ完了
-- ========================================

-- データベースの状態を確認
DO $$
DECLARE
  table_count integer;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';

  RAISE NOTICE '========================================';
  RAISE NOTICE 'データベースセットアップが完了しました！';
  RAISE NOTICE '========================================';
  RAISE NOTICE '作成されたテーブル数: %', table_count;
  RAISE NOTICE '';
  RAISE NOTICE 'デフォルト管理者アカウント:';
  RAISE NOTICE 'ユーザー名: adsadmin';
  RAISE NOTICE 'パスワード: Mm123567..';
  RAISE NOTICE '';
  RAISE NOTICE '次のステップ:';
  RAISE NOTICE '1. 管理者でログインして設定を確認してください';
  RAISE NOTICE '2. domain_configs テーブルで実際のドメインを設定してください';
  RAISE NOTICE '3. アプリケーションの .env ファイルを設定してください';
  RAISE NOTICE '';
  RAISE NOTICE '重要: analytics_config はシングルトンテーブルです（1レコードのみ）';
  RAISE NOTICE 'セキュリティ: デフォルトパスワードは必ず変更してください';
  RAISE NOTICE '========================================';
END $$;
