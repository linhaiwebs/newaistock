/*
  # 追加の日本語コンテンツ

  1. 追加コンテンツ
    - テンプレートで使用される追加のキー
    - デフォルトテンプレートの機能ラベル
    - フォームとボタンのテキスト
*/

-- 既存のキーを削除して再挿入（キーが既に存在する場合）
INSERT INTO site_content (key, content, category, description) VALUES
  -- デフォルトテンプレートのキー
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
  ('result_button_text', '詳細を見る', 'result', '結果ボタンテキスト')
ON CONFLICT (key) DO UPDATE SET
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  description = EXCLUDED.description;
