/*
  # 创建落地页模板系统

  1. 新建表
    - `landing_templates` - 存储落地页模板
      - `id` (uuid, 主键)
      - `name` (文本, 模板名称)
      - `template_key` (文本, 唯一标识)
      - `description` (文本, 模板描述)
      - `is_active` (布尔值, 是否激活)
      - `preview_image` (文本, 预览图URL)
      - `config` (jsonb, 模板配置)
      - `created_at` (时间戳)
      - `updated_at` (时间戳)

    - `template_content` - 存储模板自定义文案
      - `id` (uuid, 主键)
      - `template_id` (uuid, 外键关联landing_templates)
      - `content_key` (文本, 内容键名)
      - `content_value` (文本, 内容值)
      - `content_type` (文本, 内容类型: text/html/image_url)
      - `created_at` (时间戳)
      - `updated_at` (时间戳)

  2. 安全策略
    - 启用 RLS
    - 管理员可以完全操作
    - 公开访问激活的模板和内容

  3. 初始数据
    - 插入4个默认模板
    - 插入默认文案内容
*/

-- 创建落地页模板表
CREATE TABLE IF NOT EXISTS landing_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  template_key text UNIQUE NOT NULL,
  description text,
  is_active boolean DEFAULT false,
  preview_image text,
  config jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 创建模板内容表
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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_landing_templates_active ON landing_templates(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_landing_templates_key ON landing_templates(template_key);
CREATE INDEX IF NOT EXISTS idx_template_content_template_id ON template_content(template_id);

-- 启用 RLS
ALTER TABLE landing_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_content ENABLE ROW LEVEL SECURITY;

-- 公开访问策略：任何人都可以查看激活的模板和内容
CREATE POLICY "任何人可以查看激活的模板"
  ON landing_templates FOR SELECT
  USING (is_active = true);

CREATE POLICY "任何人可以查看激活模板的内容"
  ON template_content FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM landing_templates
      WHERE landing_templates.id = template_content.template_id
      AND landing_templates.is_active = true
    )
  );

-- 管理员策略：认证用户可以查看和修改所有模板
CREATE POLICY "认证用户可以查看所有模板"
  ON landing_templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "认证用户可以创建模板"
  ON landing_templates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "认证用户可以更新模板"
  ON landing_templates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "认证用户可以删除模板"
  ON landing_templates FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "认证用户可以查看所有模板内容"
  ON template_content FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "认证用户可以创建模板内容"
  ON template_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "认证用户可以更新模板内容"
  ON template_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "认证用户可以删除模板内容"
  ON template_content FOR DELETE
  TO authenticated
  USING (true);

-- 插入默认模板
INSERT INTO landing_templates (name, template_key, description, is_active, config) VALUES
  ('默认模板', 'default', '经典的股票诊断落地页设计，适合大多数场景', true, '{"colors": {"primary": "#2563eb", "secondary": "#1e40af", "accent": "#4f46e5"}}'::jsonb),
  ('简约模板', 'minimal', '简洁清爽的设计风格，注重内容呈现', false, '{"colors": {"primary": "#0f172a", "secondary": "#334155", "accent": "#64748b"}}'::jsonb),
  ('专业模板', 'professional', '商务专业风格，适合企业用户', false, '{"colors": {"primary": "#0c4a6e", "secondary": "#075985", "accent": "#0284c7"}}'::jsonb),
  ('现代模板', 'modern', '时尚现代的设计，吸引年轻投资者', false, '{"colors": {"primary": "#7c3aed", "secondary": "#6d28d9", "accent": "#8b5cf6"}}'::jsonb);

-- 为默认模板插入内容
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
  ('hero_title', 'AI股票诊断', 'text'),
  ('hero_subtitle', '最新的AI技术为您分析股票', 'text'),
  ('hero_description', '输入股票代码，立即获取详细的投资分析报告', 'text'),
  ('hero_button_text', '开始诊断', 'text'),
  ('feature_1_title', '实时数据分析', 'text'),
  ('feature_1_description', '获取最新的股票市场数据并进行深度分析', 'text'),
  ('feature_2_title', 'AI智能诊断', 'text'),
  ('feature_2_description', '利用先进的AI算法提供专业的投资建议', 'text'),
  ('feature_3_title', '详细分析报告', 'text'),
  ('feature_3_description', '生成全面的股票分析报告，助您做出明智决策', 'text'),
  ('result_title', 'AI股票诊断结果', 'text'),
  ('result_button_text', '查看详细信息', 'text'),
  ('analyzing_title', 'AI分析中', 'text'),
  ('analyzing_description', '正在详细分析股票数据...', 'text'),
  ('footer_text', '© 2024 AI股票诊断系统. 版权所有.', 'text')
) AS content_data(content_key, content_value, content_type);

-- 为简约模板插入内容
WITH minimal_template AS (
  SELECT id FROM landing_templates WHERE template_key = 'minimal' LIMIT 1
)
INSERT INTO template_content (template_id, content_key, content_value, content_type)
SELECT
  id,
  content_key,
  content_value,
  content_type
FROM minimal_template,
LATERAL (VALUES
  ('hero_title', '股票诊断', 'text'),
  ('hero_subtitle', '简单、快速、准确', 'text'),
  ('hero_description', '输入股票代码，立即获取分析结果', 'text'),
  ('hero_button_text', '立即诊断', 'text'),
  ('result_title', '诊断结果', 'text'),
  ('result_button_text', '了解更多', 'text'),
  ('analyzing_title', '分析中...', 'text'),
  ('analyzing_description', '请稍候', 'text'),
  ('footer_text', 'AI股票诊断', 'text')
) AS content_data(content_key, content_value, content_type);

-- 为专业模板插入内容
WITH professional_template AS (
  SELECT id FROM landing_templates WHERE template_key = 'professional' LIMIT 1
)
INSERT INTO template_content (template_id, content_key, content_value, content_type)
SELECT
  id,
  content_key,
  content_value,
  content_type
FROM professional_template,
LATERAL (VALUES
  ('hero_title', '专业股票投资分析平台', 'text'),
  ('hero_subtitle', '基于人工智能的投资决策支持系统', 'text'),
  ('hero_description', '为专业投资者和机构提供深度市场洞察', 'text'),
  ('hero_button_text', '开始专业分析', 'text'),
  ('feature_1_title', '机构级数据', 'text'),
  ('feature_1_description', '接入全球主要市场的实时数据源', 'text'),
  ('feature_2_title', '量化分析', 'text'),
  ('feature_2_description', '多维度量化指标和技术分析模型', 'text'),
  ('feature_3_title', '风险评估', 'text'),
  ('feature_3_description', '全面的风险评估和投资组合优化建议', 'text'),
  ('result_title', '专业分析报告', 'text'),
  ('result_button_text', '查看完整报告', 'text'),
  ('analyzing_title', '专业分析进行中', 'text'),
  ('analyzing_description', '正在运行多维度分析模型...', 'text'),
  ('footer_text', '© 2024 专业投资分析平台', 'text')
) AS content_data(content_key, content_value, content_type);

-- 为现代模板插入内容
WITH modern_template AS (
  SELECT id FROM landing_templates WHERE template_key = 'modern' LIMIT 1
)
INSERT INTO template_content (template_id, content_key, content_value, content_type)
SELECT
  id,
  content_key,
  content_value,
  content_type
FROM modern_template,
LATERAL (VALUES
  ('hero_title', '🚀 智能股票分析', 'text'),
  ('hero_subtitle', '让AI成为你的投资顾问', 'text'),
  ('hero_description', '新一代投资者的选择，科技驱动财富增长', 'text'),
  ('hero_button_text', '开始探索', 'text'),
  ('feature_1_title', '🎯 精准预测', 'text'),
  ('feature_1_description', 'AI算法分析海量数据，预测市场趋势', 'text'),
  ('feature_2_title', '⚡ 闪电分析', 'text'),
  ('feature_2_description', '秒级响应，实时获取投资建议', 'text'),
  ('feature_3_title', '📊 可视化报告', 'text'),
  ('feature_3_description', '直观的数据可视化，让决策更简单', 'text'),
  ('result_title', '✨ AI诊断结果', 'text'),
  ('result_button_text', '探索更多 →', 'text'),
  ('analyzing_title', '🤖 AI正在思考...', 'text'),
  ('analyzing_description', '分析中，马上就好！', 'text'),
  ('footer_text', 'Made with ❤️ by AI Stock Analysis', 'text')
) AS content_data(content_key, content_value, content_type);

-- 创建触发器函数用于更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为表添加触发器
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

-- 创建函数：确保只有一个模板被激活
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

-- 添加触发器确保唯一激活
DROP TRIGGER IF EXISTS enforce_single_active_template ON landing_templates;
CREATE TRIGGER enforce_single_active_template
  BEFORE INSERT OR UPDATE ON landing_templates
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION ensure_single_active_template();