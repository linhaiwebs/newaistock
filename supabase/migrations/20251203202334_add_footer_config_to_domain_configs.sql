/*
  # Add Footer Configuration to Domain Configs

  1. Changes
    - Add `footer_config` JSONB column to `domain_configs` table
    - Populate default configuration with comprehensive Japanese compliance disclaimer
    - Create index for efficient querying

  2. Footer Config Structure
    - disclaimer_title: Title for the disclaimer section
    - tool_nature: Description of the tool's AI-driven nature
    - license_statement: Statement about not requiring financial licenses
    - compliance_statement: Compliance with Japanese financial laws
    - google_ads_compliance: Google Ads policy compliance
    - risk_warning: Investment risk warnings
    - data_accuracy: Data accuracy disclaimer
    - contact_info: Optional contact information

  3. Security
    - No RLS changes needed (existing policies apply)
*/

-- Add footer_config column to domain_configs
ALTER TABLE domain_configs 
ADD COLUMN IF NOT EXISTS footer_config JSONB DEFAULT '{}'::jsonb;

-- Create index for footer_config queries
CREATE INDEX IF NOT EXISTS idx_domain_configs_footer_config ON domain_configs USING gin(footer_config);

-- Update default domain configuration with detailed Japanese disclaimer
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
WHERE domain = 'localhost' OR domain = 'default';

-- Add comment to the column
COMMENT ON COLUMN domain_configs.footer_config IS 'JSONB configuration for footer disclaimer content including compliance statements';