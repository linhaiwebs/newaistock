/*
  # AI株式分析テンプレートの追加

  1. 新しいテンプレート
    - AIをテーマにしたカラフルでモダンなモバイル向けデザイン
    - 傾斜カード効果付き
    - カテゴリ: stock-analysis
    - テンプレートキー: ai-stock
  
  2. テンプレートコンテンツ
    - hero_title: メインタイトル
    - hero_subtitle: サブタイトル説明
    - feature1_title: AI株式トレンド解読
    - feature1_description: 機能1の説明
    - feature2_title: 市場ニュースのスマート整理
    - feature2_description: 機能2の説明
    - feature3_title: パーソナライズされたデータパネル
    - feature3_description: 機能3の説明
    - form_title: フォームタイトル
    - input_placeholder: 入力フィールドのプレースホルダー
    - submit_button: 送信ボタンテキスト

  3. 特徴
    - カラフルなグラデーション背景
    - 傾斜効果のある3つのフィーチャーカード
    - テクノロジーイラスト
    - 情報提供のみ、投資アドバイスなし
*/

-- AI株式分析テンプレートを追加
INSERT INTO landing_templates (
  name,
  template_key,
  description,
  is_active,
  config,
  category,
  category_order
) VALUES (
  'AI株式分析テンプレート',
  'ai-stock',
  'AIをテーマにしたカラフルでモダンなモバイル向けデザイン、傾斜カード効果付き',
  false,
  '{"colors": {"primary": "#3b82f6", "secondary": "#8b5cf6", "accent": "#f97316"}}'::jsonb,
  'stock-analysis',
  3
) ON CONFLICT (template_key) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  config = EXCLUDED.config,
  category = EXCLUDED.category,
  category_order = EXCLUDED.category_order,
  updated_at = now();

-- テンプレートコンテンツを追加
WITH template AS (
  SELECT id FROM landing_templates WHERE template_key = 'ai-stock' LIMIT 1
)
INSERT INTO template_content (template_id, content_key, content_value, content_type)
SELECT
  template.id,
  content_key,
  content_value,
  content_type
FROM template,
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
) AS t(content_key, content_value, content_type)
ON CONFLICT (template_id, content_key) DO UPDATE SET
  content_value = EXCLUDED.content_value,
  content_type = EXCLUDED.content_type,
  updated_at = now();
