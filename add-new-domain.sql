/*
  新しいドメインを追加する簡易スクリプト

  使用方法:
  1. 下記の YOUR_DOMAIN_HERE を実際のドメイン名に置き換える
  2. サイト名と説明をカスタマイズ
  3. Supabase SQL Editor で実行
*/

INSERT INTO domain_configs (
  domain,
  site_name,
  site_description,
  google_ads_publisher_id,
  google_verification_code,
  google_analytics_id,
  robots_config,
  ads_txt_content,
  seo_config,
  footer_config,
  is_active,
  is_default
) VALUES (
  -- ここを変更: 実際のドメイン名
  'YOUR_DOMAIN_HERE.com',

  -- ここを変更: サイト名
  'AI株式診断',

  -- ここを変更: サイトの説明
  '最新のAI技術を活用した株式分析システム。銘柄コードを入力するだけで、詳細な投資分析レポートを即座に生成します。',

  -- Google Ads Publisher ID（オプション）
  NULL,

  -- Google 所有権確認コード（オプション）
  NULL,

  -- Google Analytics ID（オプション）
  NULL,

  -- robots.txt 設定
  '{
    "allow": ["/"],
    "disallow": ["/admin", "/api"],
    "crawlDelay": null,
    "customRules": []
  }'::jsonb,

  -- ads.txt コンテンツ（オプション）
  NULL,

  -- SEO 設定
  '{
    "title": "AI株式診断 | 最新のAI技術で株式を分析",
    "keywords": ["AI", "株式分析", "株価診断", "投資", "日本株", "テクニカル分析"],
    "author": "AI Stock Analysis Team",
    "ogImage": "/og-image.jpg",
    "twitterCard": "summary_large_image",
    "locale": "ja_JP",
    "language": "ja"
  }'::jsonb,

  -- フッター設定（免責事項）
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

  -- アクティブ状態
  true,

  -- デフォルトドメインではない
  false
)
ON CONFLICT (domain) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  site_description = EXCLUDED.site_description,
  is_active = EXCLUDED.is_active;

-- 確認
SELECT domain, site_name, is_active, created_at
FROM domain_configs
ORDER BY created_at DESC
LIMIT 5;
