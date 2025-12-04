# データベースデプロイメントガイド

## 概要

このガイドでは、新しい Supabase インスタンスに完全なデータベーススキーマをデプロイする方法を説明します。

## 前提条件

- Supabase アカウント
- 新しい Supabase プロジェクト（または既存のプロジェクト）

## デプロイ手順

### ステップ 1: Supabase ダッシュボードにアクセス

1. [Supabase Dashboard](https://app.supabase.com) にログイン
2. プロジェクトを選択（または新規作成）

### ステップ 2: SQL エディターを開く

1. 左側のメニューから「SQL Editor」をクリック
2. 「New query」をクリック

### ステップ 3: スクリプトを実行

1. `complete-database-setup.sql` ファイルを開く
2. **全内容をコピー**
3. SQL Editor にペースト
4. 「Run」ボタンをクリック

### ステップ 4: 実行結果を確認

実行が成功すると、以下のメッセージが表示されます：

```
データベースセットアップが完了しました！
作成されたテーブル数: 11
```

## 作成されるテーブル

| テーブル名 | 説明 | レコード制限 |
|-----------|------|------------|
| `admin_users` | 管理者ユーザー | 無制限 |
| `user_sessions` | ユーザーセッション追跡 | 無制限 |
| `user_events` | イベントトラッキング | 無制限 |
| `stock_diagnoses` | 株式診断結果 | 無制限 |
| `redirect_links` | リダイレクトリンク管理 | 無制限 |
| `ai_cache` | AI 結果キャッシュ | 無制限 |
| `templates` | ページテンプレート | 無制限 |
| `analytics_config` | アナリティクス設定 | **1レコードのみ** |
| `landing_templates` | ランディングページテンプレート | 無制限 |
| `template_content` | テンプレートコンテンツ | 無制限 |
| `domain_configs` | ドメイン別設定 | 無制限 |
| `site_content` | サイトコンテンツ管理 | 無制限 |

## 初期データ

スクリプトは以下の初期データを自動的に作成します：

### 1. アナリティクス設定
- デフォルト設定（無効状態）
- **重要**: このテーブルは常に1レコードのみ

### 2. テンプレート
- デフォルトテンプレート（有効）
- 4つのランディングページテンプレート（default, minimal, professional, modern）

### 3. ドメイン設定
- localhost 用のデフォルト設定
- 日本語の免責事項を含む

### 4. サイトコンテンツ
- 50+ の日本語コンテンツエントリ
- ヒーロー、機能、フォーム、結果、管理画面用のテキスト

## 次のステップ

### 1. 管理者ユーザーの作成

管理画面にアクセスするには、管理者ユーザーが必要です：

```sql
-- パスワードハッシュは bcrypt で生成してください
INSERT INTO admin_users (username, password_hash, role)
VALUES ('admin', '$2a$10$...your_hashed_password...', 'admin');
```

または、プロジェクトに含まれる `reset-admin-password.js` スクリプトを使用：

```bash
node reset-admin-password.js
```

### 2. ドメイン設定のカスタマイズ

実際のドメインを追加：

```sql
INSERT INTO domain_configs (
  domain,
  site_name,
  site_description,
  is_active,
  is_default
) VALUES (
  'your-domain.com',
  'あなたのサイト名',
  'あなたのサイトの説明',
  true,
  false
);
```

### 3. 環境変数の設定

アプリケーションの `.env` ファイルを更新：

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Server Configuration
PORT=4000
NODE_ENV=production

# JWT Secret
JWT_SECRET=your_jwt_secret

# AI API
SILICONFLOW_API_KEY=your_api_key
```

## 重要な機能

### シングルトンテーブル（analytics_config）

`analytics_config` テーブルには**常に1レコードのみ**が存在します。

- 複数のレコードを挿入しようとすると、データベースエラーが発生します
- これはデータベースレベルの制約で保証されています
- アプリケーションは UPSERT パターンで更新します

### Row Level Security (RLS)

すべてのテーブルで RLS が有効になっています：

- **公開アクセス**: 匿名ユーザーは追跡データを挿入、アクティブなコンテンツを読み取り可能
- **管理者アクセス**: 認証ユーザーはすべてのデータを管理可能
- **セキュリティ**: データは適切なポリシーで保護されています

### 自動更新トリガー

以下のテーブルは `updated_at` が自動更新されます：

- `landing_templates`
- `template_content`
- `site_content`

## トラブルシューティング

### エラー: "already exists"

テーブルやインデックスが既に存在する場合、スクリプトはスキップします。これは正常な動作です。

### エラー: "duplicate key value"

初期データが既に存在する場合、`ON CONFLICT DO NOTHING` により安全にスキップされます。

### 外部キー制約エラー

スクリプトは依存関係の順序で実行されるため、通常このエラーは発生しません。エラーが発生した場合は、データベースを空にしてから再実行してください。

## データベースのリセット

すべてのテーブルを削除して再作成する場合：

```sql
-- 警告: すべてのデータが削除されます！
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- その後、complete-database-setup.sql を実行
```

## サポート

問題が発生した場合：

1. Supabase Dashboard の「Logs」セクションでエラーログを確認
2. SQL Editor でエラーメッセージを確認
3. データベースの権限設定を確認

## セキュリティチェックリスト

デプロイ後、以下を確認してください：

- [ ] RLS がすべてのテーブルで有効
- [ ] 管理者パスワードが安全に設定されている
- [ ] 環境変数が安全に管理されている
- [ ] API キーが `.env` ファイルにのみ存在（コミットされていない）
- [ ] Supabase の Row Level Security ポリシーが適切に設定されている

## 本番環境への展開

本番環境にデプロイする前に：

1. **バックアップ**: 既存のデータがある場合はバックアップを作成
2. **テスト**: 開発環境で完全にテスト
3. **ドメイン設定**: 本番ドメインを `domain_configs` に追加
4. **アナリティクス**: Google Analytics と Google Ads の ID を設定
5. **監視**: Supabase のログとメトリクスを監視

## 完了

データベースのセットアップが完了しました！アプリケーションを起動して、すべての機能が正常に動作することを確認してください。
