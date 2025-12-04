/*
  # Fix Footer Config Empty Objects

  1. Problem
    - The footer_config column defaults to empty JSONB object '{}'
    - Empty objects are not caught by the `footerConfig || defaultFooterConfig` check
    - This causes the footer to display only titles with no content

  2. Solution
    - Update all domain_configs records with empty or incomplete footer_config
    - Set complete default footer configuration with all required fields

  3. Changes
    - Update existing records with empty footer_config
    - Ensure localhost and any other domains have complete configuration
    
  4. Security
    - No RLS changes needed (existing policies apply)
*/

-- Update all records that have empty or null footer_config
UPDATE domain_configs
SET footer_config = jsonb_build_object(
  'disclaimer_title', '重要事項・免責事項',
  'tool_nature', '本サービスは、人工知能（AI）技術を活用した株式分析ツールです。市場データの収集と分析を行い、情報提供を目的としています。',
  'investment_disclaimer', '本サービスで提供される分析結果、情報、データ等は、投資判断の参考情報として提供するものであり、投資勧誘、売買推奨、または専門的な金融アドバイスを目的としたものではありません。',
  'user_responsibility', '投資判断および投資行動は、利用者ご自身の責任において行っていただく必要があります。投資による損益は全て投資家ご自身に帰属し、当サービスは一切の責任を負いません。',
  'license_statement', '本サービスは情報提供ツールであり、金融商品取引業務を行うものではありません。したがって、日本の金融庁による金融商品取引業の登録・免許を必要としません。',
  'compliance_statement', '本サービスは日本の金融商品取引法その他関連法令を遵守し、客観的なデータ分析と情報提供のみを行います。特定の金融商品の勧誘や販売を行うものではありません。',
  'google_ads_compliance', '本サービスはGoogle広告ポリシーを遵守しており、規制対象となる金融サービスの提供は行っておりません。',
  'risk_warning', '株式投資にはリスクが伴います。投資元本の損失が生じる可能性があることを十分にご理解の上、ご利用ください。',
  'data_accuracy', '本サービスは情報の正確性確保に努めておりますが、提供する情報の完全性、正確性、有用性、適時性について保証するものではありません。',
  'updated_date', '2025年12月'
)
WHERE footer_config IS NULL 
   OR footer_config = '{}'::jsonb
   OR NOT (footer_config ? 'disclaimer_title');