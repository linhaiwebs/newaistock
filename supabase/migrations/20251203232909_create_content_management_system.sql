/*
  # コンテンツ管理システムの作成

  1. 新しいテーブル
    - `site_content`
      - `id` (uuid, primary key) - レコードID
      - `key` (text, unique) - コンテンツキー（コードで参照用）
      - `content` (text) - 日本語のコンテンツ
      - `category` (text) - カテゴリ（hero、features、form等）
      - `description` (text) - 説明文
      - `created_at` (timestamptz) - 作成日時
      - `updated_at` (timestamptz) - 更新日時
  
  2. セキュリティ
    - `site_content`テーブルのRLSを有効化
    - 全ユーザーが読み取り可能
    - 認証されたユーザーのみが編集可能
*/

-- コンテンツテーブルの作成
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'general',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 更新日時を自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーの作成
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLSの有効化
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- 全ユーザーが読み取り可能
CREATE POLICY "Anyone can view site content"
  ON site_content
  FOR SELECT
  TO public
  USING (true);

-- 認証されたユーザーが挿入可能
CREATE POLICY "Authenticated users can insert content"
  ON site_content
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 認証されたユーザーが更新可能
CREATE POLICY "Authenticated users can update content"
  ON site_content
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 認証されたユーザーが削除可能
CREATE POLICY "Authenticated users can delete content"
  ON site_content
  FOR DELETE
  TO authenticated
  USING (true);

-- デフォルトの日本語コンテンツを挿入
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
  ('result.title', '診断結果', 'result', '結果のタイトル'),
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
ON CONFLICT (key) DO NOTHING;
