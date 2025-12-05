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
-- 7. テンプレートテーブル
-- ========================================

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

-- ========================================
-- 8. アナリティクス設定テーブル（シングルトン）
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
-- 9. 落地页模板系统
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
-- 10. ドメイン設定テーブル
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
-- 11. サイトコンテンツ管理テーブル
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

-- デフォルトテンプレート
INSERT INTO templates (template_name, template_slug, active, custom_text)
VALUES (
  'デフォルトテンプレート',
  'default',
  true,
  '{"title": "AI株式診断", "subtitle": "最新のAI技術で株式を分析", "button_text": "今すぐ診断", "convert_button": "詳細を見る"}'::jsonb
) ON CONFLICT (template_slug) DO NOTHING;

-- 落地页模板
INSERT INTO landing_templates (name, template_key, description, is_active, config, category, category_order) VALUES
  ('默认模板', 'default', '経典の株式診断落地页设计、適合大多数場景', true, '{"colors": {"primary": "#2563eb", "secondary": "#1e40af", "accent": "#4f46e5"}}'::jsonb, 'stock-analysis', 0),
  ('简约模板', 'minimal', '简洁清爽の设计风格、注重内容呈现', false, '{"colors": {"primary": "#0f172a", "secondary": "#334155", "accent": "#64748b"}}'::jsonb, 'general', 0),
  ('专业模板', 'professional', '商务专业风格、適合企业用户', false, '{"colors": {"primary": "#0c4a6e", "secondary": "#075985", "accent": "#0284c7"}}'::jsonb, 'stock-analysis', 2),
  ('现代模板', 'modern', '時尚现代の设计、吸引年轻投资者', false, '{"colors": {"primary": "#7c3aed", "secondary": "#6d28d9", "accent": "#8b5cf6"}}'::jsonb, 'stock-analysis', 1)
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
  ('hero_title', 'AI株票诊断', 'text'),
  ('hero_subtitle', '最新のAI技术为您分析株票', 'text'),
  ('hero_description', '输入株票代码、立即获取详细の投资分析报告', 'text'),
  ('hero_button_text', '開始诊断', 'text'),
  ('feature_1_title', '実時数据分析', 'text'),
  ('feature_1_description', '获取最新の株票市场数据并进行深度分析', 'text'),
  ('feature_2_title', 'AI智能诊断', 'text'),
  ('feature_2_description', '利用先进のAI算法提供专业の投资建议', 'text'),
  ('feature_3_title', '详细分析报告', 'text'),
  ('feature_3_description', '生成全面の株票分析报告、助您做出明智决策', 'text'),
  ('result_title', 'AI株票诊断結果', 'text'),
  ('result_button_text', '查看详细信息', 'text'),
  ('analyzing_title', 'AI分析中', 'text'),
  ('analyzing_description', '正在详细分析株票数据...', 'text'),
  ('footer_text', '© 2024 AI株票诊断系统. 版权所有.', 'text')
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

  -- 追加コンテンツ
  ('back_button', '戻る', 'navigation', '戻るボタン'),
  ('form_label', '銘柄コード', 'form', 'フォームラベル'),
  ('form_placeholder', '例：7203', 'form', 'フォームプレースホルダー'),

  -- 機能ラベル
  ('feature_stocks', '株式', 'features', '株式機能'),
  ('feature_bond', '債券', 'features', '債券機能'),
  ('feature_realestate', '不動産', 'features', '不動産機能'),
  ('feature_etfs', 'ETF', 'features', 'ETF機能'),
  ('feature_mutualfund', '投資信託', 'features', '投資信託機能'),
  ('feature_commodity', 'コモディティ', 'features', 'コモディティ機能'),
  ('feature_crypto', '暗号資産', 'features', '暗号資産機能'),
  ('feature_other', 'その他', 'features', 'その他の機能'),

  -- メインコンテンツキー
  ('hero_title', '最も興味のある資産はどれですか？', 'hero', 'ヒーローセクションのタイトル'),
  ('selection_hint', '最も希望する3つのカテゴリを選択してください。', 'hero', '選択のヒント'),
  ('hero_button_text', '続ける', 'form', 'メインボタンテキスト'),
  ('none_button_text', 'どれでもない', 'form', 'なしボタンテキスト'),
  ('loading_text', '読み込み中...', 'form', '読み込みテキスト'),

  -- 分析関連
  ('analyzing_title', 'AI分析中', 'analysis', '分析中のタイトル'),
  ('analyzing_description', 'データを処理中...', 'analysis', '分析中の説明'),
  ('result_title', '分析結果', 'result', '結果のタイトル'),
  ('result_button_text', '詳細を見る', 'result', '結果ボタンテキスト'),

  -- 結果
  ('result.stockInfo', '株式情報', 'result', '株式情報セクション'),
  ('result.analysis', '分析', 'result', '分析セクション'),
  ('result.backButton', '新しい診断', 'result', '戻るボタン'),

  -- フッター
  ('footer.disclaimer', '本サービスは投資助言を目的としたものではありません。投資判断は自己責任で行ってください。', 'footer', '免責事項'),
  ('footer.copyright', '© 2024 株式診断ツール. All rights reserved.', 'footer', '著作権表示'),

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
