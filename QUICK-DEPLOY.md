# クイックデプロイガイド

新しいドメインに素早くデプロイするための簡潔なガイドです。

## 1分でデプロイ

### ステップ 1: Supabase でスクリプト実行

```bash
# 1. Supabase Dashboard を開く
# 2. SQL Editor に移動
# 3. complete-database-setup.sql の全内容をコピー＆ペースト
# 4. "Run" をクリック
```

### ステップ 2: 管理者を作成

```bash
node reset-admin-password.js
# デフォルトユーザー名: admin
# パスワードを入力してください
```

### ステップ 3: 環境変数を設定

`.env` ファイルを編集：

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
JWT_SECRET=your_random_secret_here
SILICONFLOW_API_KEY=your_ai_api_key_here
PORT=4000
NODE_ENV=production
```

### ステップ 4: ドメインを追加

SQL Editor で実行：

```sql
INSERT INTO domain_configs (
  domain,
  site_name,
  site_description,
  seo_config,
  footer_config,
  is_active
) VALUES (
  'your-new-domain.com',
  'AI株式診断',
  'AIによる株式分析サービス',
  '{
    "title": "AI株式診断",
    "keywords": ["AI", "株式分析", "投資"],
    "locale": "ja_JP"
  }'::jsonb,
  '{
    "disclaimer_title": "重要事項・免責事項",
    "tool_nature": "本サービスは、人工知能（AI）技術を活用した株式分析ツールです。",
    "investment_disclaimer": "投資判断の参考情報として提供するものであり、投資勧誘を目的としたものではありません。",
    "risk_warning": "株式投資にはリスクが伴います。"
  }'::jsonb,
  true
);
```

### ステップ 5: アプリを起動

```bash
npm run build
npm start
```

## 完了！

アプリケーションが起動しました。

- フロントエンド: `http://your-domain.com`
- 管理画面: `http://your-domain.com/admin`

## よくある質問

### Q: Analytics を設定するには？

管理画面 → Analytics → Google Analytics ID を入力

### Q: テンプレートを変更するには？

管理画面 → Templates → 好きなテンプレートを選択

### Q: コンテンツを編集するには？

管理画面 → Content → キーを選択して編集

## サポート

問題が発生した場合は、`DATABASE-DEPLOYMENT-GUIDE.md` の詳細ガイドを参照してください。
