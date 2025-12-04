# デプロイメントファイル索引

このドキュメントは、新しいドメインへのデプロイに関連するすべてのファイルの概要を提供します。

## 📁 作成されたファイル

### 1. `complete-database-setup.sql` ⭐ 最重要
**目的**: 完全なデータベースセットアップスクリプト

**含まれる内容**:
- 全11テーブルの作成
- インデックス（14個）
- RLS ポリシー（30+ 個）
- トリガーと関数
- 初期データ（テンプレート、コンテンツ、設定）

**使用タイミング**:
- 新しい Supabase プロジェクトの初期セットアップ
- データベースを完全にリセットする場合

**実行方法**:
```
1. Supabase Dashboard → SQL Editor
2. ファイルの全内容をコピー＆ペースト
3. "Run" をクリック
```

**実行時間**: 約 10-15 秒

---

### 2. `add-new-domain.sql`
**目的**: 既存のデータベースに新しいドメインを追加

**含まれる内容**:
- ドメイン設定（domain_configs）の INSERT 文
- SEO 設定
- フッター免責事項
- robots.txt 設定

**使用タイミング**:
- 既にデータベースがセットアップされている状態で
- 新しいドメインを追加する場合

**カスタマイズが必要な箇所**:
```sql
domain → 'YOUR_DOMAIN_HERE.com' を実際のドメインに変更
site_name → サイト名を変更
site_description → 説明文を変更
```

---

### 3. `DATABASE-DEPLOYMENT-GUIDE.md`
**目的**: 詳細なデプロイメント手順書

**含まれる内容**:
- ステップバイステップのデプロイ手順
- 各テーブルの詳細説明
- トラブルシューティングガイド
- セキュリティチェックリスト
- 本番環境への展開手順

**対象読者**:
- 初めてデプロイする人
- 詳細な説明が必要な人
- トラブルが発生した場合

**ページ数**: 約 8 ページ相当

---

### 4. `QUICK-DEPLOY.md`
**目的**: 1分でデプロイするためのクイックガイド

**含まれる内容**:
- 5ステップの簡潔な手順
- コピー＆ペーストできるコマンド
- よくある質問

**対象読者**:
- 経験者
- 素早くデプロイしたい人

**所要時間**: 約 5-10 分

---

### 5. `DEPLOYMENT-FILES-INDEX.md`
**目的**: このファイル（デプロイメントファイルの索引）

**含まれる内容**:
- すべてのファイルの概要
- 使用シナリオ別のガイド

---

## 🎯 使用シナリオ別ガイド

### シナリオ 1: 完全に新しい Supabase プロジェクト

```
使用ファイル:
1. complete-database-setup.sql（必須）
2. QUICK-DEPLOY.md（手順参照）

手順:
1. complete-database-setup.sql を実行
2. 管理者を作成（reset-admin-password.js）
3. .env を設定
4. アプリを起動
```

**所要時間**: 10-15 分

---

### シナリオ 2: 既存データベースに新しいドメインを追加

```
使用ファイル:
1. add-new-domain.sql（必須）

手順:
1. add-new-domain.sql をカスタマイズ
2. Supabase SQL Editor で実行
3. アプリを再起動（必要に応じて）
```

**所要時間**: 2-3 分

---

### シナリオ 3: データベース構造を理解したい

```
使用ファイル:
1. DATABASE-DEPLOYMENT-GUIDE.md（必須）
2. complete-database-setup.sql（参照）

読む順序:
1. ガイドの「作成されるテーブル」セクション
2. SQL ファイルのコメント部分
3. 各テーブルの RLS ポリシー
```

---

### シナリオ 4: トラブルシューティング

```
使用ファイル:
1. DATABASE-DEPLOYMENT-GUIDE.md の「トラブルシューティング」セクション

よくあるエラー:
- "already exists" → 正常（スキップされます）
- "duplicate key" → 正常（既存データがある場合）
- 外部キー制約 → データベースをリセットして再実行
```

---

## 📊 データベース構造概要

### テーブル階層

```
admin_users (管理者)
    ↓
analytics_config (アナリティクス設定) ※シングルトン

user_sessions (セッション)
    ↓
user_events (イベント)
stock_diagnoses (診断結果)

redirect_links (リダイレクトリンク)
ai_cache (AI キャッシュ)
templates (テンプレート)

landing_templates (ランディングページテンプレート)
    ↓
template_content (テンプレートコンテンツ)

domain_configs (ドメイン設定)
site_content (サイトコンテンツ)
```

### レコード数の目安

| テーブル | 初期 | 1ヶ月後 | 1年後 |
|---------|------|---------|-------|
| admin_users | 1 | 5 | 10 |
| analytics_config | 1 | 1 | 1 ※常に1 |
| user_sessions | 0 | 1,000 | 50,000 |
| user_events | 0 | 5,000 | 200,000 |
| stock_diagnoses | 0 | 500 | 20,000 |
| domain_configs | 1 | 3 | 10 |
| site_content | 50+ | 60 | 100 |

---

## 🔐 セキュリティ要件

### 必須のセキュリティ設定

1. **RLS の有効化** ✅ すべてのテーブルで設定済み
2. **強力なパスワード** ⚠️ 管理者作成時に設定
3. **環境変数の保護** ⚠️ .env ファイルをコミットしない
4. **API キーの保護** ⚠️ クライアント側に露出させない

### チェックリスト

デプロイ後に確認:

```
□ すべてのテーブルで RLS が有効
□ 管理者パスワードが安全
□ .env が .gitignore に含まれている
□ Supabase の Row Level Security ポリシーが正しい
□ 本番環境の API キーが分離されている
```

---

## 📈 パフォーマンス最適化

### インデックスが設定されているカラム

- `user_sessions.session_id` - セッション検索
- `user_events.session_id` - イベント検索
- `stock_diagnoses.stock_code` - 株式コード検索
- `ai_cache.stock_code` - キャッシュ検索
- `domain_configs.domain` - ドメイン検索

### キャッシュ戦略

- AI 診断結果: 5分間キャッシュ（ai_cache テーブル）
- 株式データ: 5分間キャッシュ（stock_data カラム）
- テンプレート: アプリケーションレベルでキャッシュ

---

## 🔄 更新とメンテナンス

### データベーススキーマの更新

新しい機能を追加する場合:

1. 新しいマイグレーションファイルを作成
2. `supabase/migrations/` に配置
3. Supabase SQL Editor で実行

### 定期的なメンテナンス

- **毎日**: ログの確認
- **毎週**: キャッシュのクリーンアップ
- **毎月**: 使用されていないセッションの削除
- **四半期**: インデックスの最適化

```sql
-- 古いセッションを削除（30日以上前）
DELETE FROM user_sessions
WHERE created_at < NOW() - INTERVAL '30 days';

-- 期限切れキャッシュを削除
DELETE FROM ai_cache
WHERE expiry_date < NOW();
```

---

## 📞 サポートとリソース

### 問題が発生した場合

1. **DATABASE-DEPLOYMENT-GUIDE.md** のトラブルシューティングを確認
2. Supabase Dashboard のログを確認
3. SQL エラーメッセージを確認

### 追加リソース

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🎉 成功の確認

デプロイが成功したかを確認する方法:

```sql
-- テーブル数を確認（11個あるはず）
SELECT COUNT(*)
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';

-- RLS が有効かを確認
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true;

-- 初期データを確認
SELECT COUNT(*) FROM site_content; -- 50+ あるはず
SELECT COUNT(*) FROM analytics_config; -- 1 あるはず
SELECT COUNT(*) FROM landing_templates; -- 4 あるはず
```

すべてのチェックが成功したら、デプロイ完了です！🎊

---

**最終更新**: 2025年12月4日
**バージョン**: 1.0.0
