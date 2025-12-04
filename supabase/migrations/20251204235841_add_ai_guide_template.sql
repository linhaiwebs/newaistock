/*
  # Add AI Investment Guide Template

  1. New Template
    - Template name: 'AI 投资引导页'
    - Template key: 'ai-invest-guide'
    - Category: 'ai-guide'
    - Description: Modern tech-style mobile guide page designed for AI stock analysis

  2. Template Content
    - Hero title and subtitle
    - Three feature cards (insight, personalized, monitoring)
    - CTA button text
    - Input placeholder

  3. Footer Configuration
    - Disclaimer and compliance information
    - Investment risk warnings
    - Data accuracy statements
*/

-- Insert the new template
INSERT INTO landing_templates (name, template_key, description, category, is_active, config) VALUES
  (
    'AI 投资引导页',
    'ai-invest-guide',
    '现代科技感移动端引导页，专为 AI 股票分析设计',
    'ai-guide',
    false,
    jsonb_build_object(
      'colors', jsonb_build_object(
        'primary', '#3b82f6',
        'secondary', '#8b5cf6',
        'accent', '#f97316'
      )
    )
  )
ON CONFLICT (template_key) DO NOTHING;

-- Insert template content
WITH ai_guide_template AS (
  SELECT id FROM landing_templates WHERE template_key = 'ai-invest-guide' LIMIT 1
)
INSERT INTO template_content (template_id, content_key, content_value, content_type)
SELECT
  id,
  content_key,
  content_value,
  content_type
FROM ai_guide_template,
LATERAL (VALUES
  ('hero_title', '让你的投资更聪明', 'text'),
  ('hero_subtitle', 'AI 驱动的股票分析助手，为你洞察行情、预测趋势、提升决策效率。', 'text'),
  ('feature_1_title', '智能股票洞察', 'text'),
  ('feature_1_description', '实时解析行情变化，识别关键指标，生成趋势信号。', 'text'),
  ('feature_2_title', '个性化投资建议', 'text'),
  ('feature_2_description', '根据你的持仓、偏好与风险等级，提供量身定制的投资策略。', 'text'),
  ('feature_3_title', '24/7 市场监控', 'text'),
  ('feature_3_description', '全天候追踪股价波动，第一时间提醒重要变化与风险信号。', 'text'),
  ('cta_button', '开始分析', 'text'),
  ('input_placeholder', '请输入股票代码', 'text')
) AS content_data(content_key, content_value, content_type)
ON CONFLICT (template_id, content_key) DO NOTHING;