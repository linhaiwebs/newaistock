/*
  # Add Footer Configuration to Templates

  1. Schema Changes
    - Add `footer_config` JSONB column to `landing_templates` table
    - Create GIN index on `footer_config` for efficient JSONB queries
    - Set default empty object for existing templates

  2. Default Footer Configurations by Category
    - Stock Analysis: Investment risk disclaimers and compliance statements
    - Cryptocurrency: High-risk warnings and regulatory uncertainties
    - Forex Trading: Leverage risks and market volatility warnings
    - Commodities: Market risks and futures contract warnings
    - Options Trading: Derivatives high-risk warnings
    - General: Generic information service disclaimers

  3. Data Migration
    - Populate default footer configs for all existing templates based on their category
    - Ensure all templates have valid footer configuration
*/

-- Add footer_config column to landing_templates
ALTER TABLE landing_templates
ADD COLUMN IF NOT EXISTS footer_config JSONB DEFAULT '{}'::jsonb;

-- Create GIN index for efficient JSONB queries
CREATE INDEX IF NOT EXISTS idx_landing_templates_footer_config
ON landing_templates USING gin(footer_config);

-- Add column comment
COMMENT ON COLUMN landing_templates.footer_config IS 'Template-specific footer configuration including disclaimers, compliance statements, and legal notices';

-- Update existing templates with category-specific default footer configurations

-- Stock Analysis templates
UPDATE landing_templates
SET footer_config = jsonb_build_object(
  'disclaimer_title', '免責事項・投資リスク',
  'tool_nature', '本サービスは、AIによる株式分析ツールであり、投資助言や金融商品の販売を目的としたものではありません。提供される情報は、一般的な情報提供のみを目的としています。',
  'investment_disclaimer', '投資判断の最終的な責任は、お客様ご自身にあります。本サービスの情報に基づいて行われた投資の結果について、当社は一切の責任を負いません。株式投資には価格変動リスク、信用リスク等、様々なリスクが伴います。',
  'user_responsibility', 'お客様は、自己の責任において本サービスをご利用ください。投資判断に際しては、必ず複数の情報源を参照し、独自の分析を行うことを強く推奨します。',
  'license_statement', '本サービスは日本国内の法令に準拠して運営されています。金融商品取引業の登録は行っておりません。',
  'compliance_statement', '当社は、金融商品取引法その他の関係法令を遵守し、適切なサービス提供に努めています。本サービスは情報提供のみを目的としており、投資勧誘には該当しません。',
  'google_ads_compliance', '本ウェブサイトは、Google広告ポリシーに準拠した運営を行っています。投資助言を行うものではなく、教育・情報提供を目的としています。',
  'risk_warning', '株式投資には元本割れのリスクがあります。過去の実績は将来の運用成果を保証するものではありません。投資は必ず余裕資金で行い、生活に必要な資金を投資に回さないでください。',
  'data_accuracy', '本サービスで提供される情報は、信頼できると判断した情報源から取得していますが、その正確性、完全性、適時性を保証するものではありません。市場の急激な変動や予期せぬ事象により、情報が古くなる可能性があります。',
  'updated_date', '2024年12月',
  'contact_info', ''
)
WHERE category = 'stock-analysis' AND (footer_config = '{}'::jsonb OR footer_config IS NULL);

-- Cryptocurrency templates
UPDATE landing_templates
SET footer_config = jsonb_build_object(
  'disclaimer_title', '暗号資産取引に関する重要な警告',
  'tool_nature', '本サービスは、暗号資産（仮想通貨）の分析ツールであり、投資助言や暗号資産の販売・交換を目的としたものではありません。情報提供のみを目的としています。',
  'investment_disclaimer', '暗号資産取引には非常に高いリスクが伴います。価格の急激な変動により、投資額の全額を失う可能性があります。本サービスの情報に基づいて行われた取引の結果について、当社は一切の責任を負いません。',
  'user_responsibility', '暗号資産取引は、お客様の自己責任において行ってください。取引を行う前に、十分な知識を習得し、リスクを理解することが不可欠です。生活に必要な資金や借入金での取引は絶対に行わないでください。',
  'license_statement', '本サービスは、暗号資産交換業の登録を行っておりません。暗号資産の売買、交換、保管等のサービスは提供していません。',
  'compliance_statement', '暗号資産の規制環境は国や地域によって異なり、今後変更される可能性があります。お客様の居住地の法令を確認し、遵守する責任があります。',
  'google_ads_compliance', '本ウェブサイトは、Google広告ポリシーに準拠した運営を行っています。暗号資産の購入を勧誘するものではなく、教育・情報提供を目的としています。',
  'risk_warning', '暗号資産は、法定通貨ではありません。価格の変動が極めて大きく、24時間365日取引されているため、短時間で大きな損失を被る可能性があります。また、ハッキングや取引所の破綻などの技術的・運営的リスクも存在します。',
  'data_accuracy', '暗号資産市場は極めて変動が激しく、本サービスで提供される情報は瞬時に古くなる可能性があります。リアルタイムの情報は各取引所でご確認ください。',
  'updated_date', '2024年12月',
  'contact_info', ''
)
WHERE category = 'crypto' AND (footer_config = '{}'::jsonb OR footer_config IS NULL);

-- Forex Trading templates
UPDATE landing_templates
SET footer_config = jsonb_build_object(
  'disclaimer_title', '外国為替証拠金取引（FX）リスク警告',
  'tool_nature', '本サービスは、外国為替市場の分析ツールであり、投資助言や金融商品の販売を目的としたものではありません。提供される情報は、教育・情報提供のみを目的としています。',
  'investment_disclaimer', 'FX取引には、レバレッジ効果により、預託した証拠金以上の損失が発生する可能性があります。本サービスの情報に基づいて行われた取引の結果について、当社は一切の責任を負いません。',
  'user_responsibility', 'FX取引は、お客様の自己責任において行ってください。取引を開始する前に、FXの仕組み、リスク、コストを十分に理解することが重要です。余裕資金での取引を心がけ、生活に必要な資金を投じないでください。',
  'license_statement', '本サービスは、金融商品取引業の登録を行っておりません。FX取引の執行、証拠金の受け入れ等のサービスは提供していません。',
  'compliance_statement', '当社は、金融商品取引法その他の関係法令を遵守し、適切なサービス提供に努めています。本サービスは情報提供のみを目的としており、取引の勧誘には該当しません。',
  'google_ads_compliance', '本ウェブサイトは、Google広告ポリシーに準拠した運営を行っています。FX取引を勧誘するものではなく、教育・情報提供を目的としています。',
  'risk_warning', 'FX取引には、為替変動リスク、金利変動リスク、流動性リスク等、様々なリスクが存在します。特にレバレッジを利用した取引では、相場が不利な方向に動いた場合、短時間で証拠金の大部分または全部を失う可能性があります。',
  'data_accuracy', '外国為替市場は、24時間取引されており、市場の急激な変動により、本サービスで提供される情報が古くなる可能性があります。最新の相場情報は、各FX業者の取引画面でご確認ください。',
  'updated_date', '2024年12月',
  'contact_info', ''
)
WHERE category = 'forex' AND (footer_config = '{}'::jsonb OR footer_config IS NULL);

-- Commodities templates
UPDATE landing_templates
SET footer_config = jsonb_build_object(
  'disclaimer_title', '商品先物取引リスク警告',
  'tool_nature', '本サービスは、商品先物市場の分析ツールであり、投資助言や商品先物取引の勧誘を目的としたものではありません。情報提供のみを目的としています。',
  'investment_disclaimer', '商品先物取引には、証拠金以上の損失が発生する可能性があります。本サービスの情報に基づいて行われた取引の結果について、当社は一切の責任を負いません。',
  'user_responsibility', '商品先物取引は、お客様の自己責任において行ってください。取引を行う前に、商品先物取引の仕組み、リスク、費用を十分に理解することが必要です。特に、レバレッジ取引のリスクを十分に認識してください。',
  'license_statement', '本サービスは、商品先物取引業の登録を行っておりません。商品先物取引の執行、証拠金の受け入れ等のサービスは提供していません。',
  'compliance_statement', '当社は、商品先物取引法その他の関係法令を遵守し、適切なサービス提供に努めています。本サービスは情報提供のみを目的としており、取引の勧誘には該当しません。',
  'google_ads_compliance', '本ウェブサイトは、Google広告ポリシーに準拠した運営を行っています。商品先物取引を勧誘するものではなく、教育・情報提供を目的としています。',
  'risk_warning', '商品先物取引には、価格変動リスク、流動性リスク、決済リスク等が存在します。天候、政治情勢、経済状況等の要因により、商品価格は急激に変動する可能性があります。証拠金取引のため、相場が不利な方向に動いた場合、投資額を超える損失が発生する可能性があります。',
  'data_accuracy', '商品市場は、世界各地の様々な要因により価格が変動します。本サービスで提供される情報は、信頼できると判断した情報源から取得していますが、その正確性を保証するものではありません。',
  'updated_date', '2024年12月',
  'contact_info', ''
)
WHERE category = 'commodities' AND (footer_config = '{}'::jsonb OR footer_config IS NULL);

-- Options Trading templates
UPDATE landing_templates
SET footer_config = jsonb_build_object(
  'disclaimer_title', 'オプション取引重要リスク警告',
  'tool_nature', '本サービスは、オプション取引の分析ツールであり、投資助言やオプション商品の販売を目的としたものではありません。情報提供のみを目的としています。',
  'investment_disclaimer', 'オプション取引は、デリバティブ商品であり、極めて高いリスクを伴います。特にオプションの売り建ては、理論上無限の損失が発生する可能性があります。本サービスの情報に基づいて行われた取引の結果について、当社は一切の責任を負いません。',
  'user_responsibility', 'オプション取引は、十分な知識と経験を持つ投資家向けの商品です。取引を行う前に、オプションの仕組み、リスク、戦略を十分に理解することが不可欠です。初心者の方は、まず基礎知識を習得することを強く推奨します。',
  'license_statement', '本サービスは、金融商品取引業の登録を行っておりません。オプション取引の執行、証拠金の受け入れ等のサービスは提供していません。',
  'compliance_statement', '当社は、金融商品取引法その他の関係法令を遵守し、適切なサービス提供に努めています。本サービスは情報提供のみを目的としており、取引の勧誘には該当しません。',
  'google_ads_compliance', '本ウェブサイトは、Google広告ポリシーに準拠した運営を行っています。オプション取引を勧誘するものではなく、教育・情報提供を目的としています。',
  'risk_warning', 'オプションの買い方は、支払ったプレミアムの全額を失う可能性があります。オプションの売り方は、プレミアム収入を大きく上回る損失が発生する可能性があり、特に裸売りの場合、損失は理論上無限大となります。複雑な戦略を用いる場合、想定外の損失が発生するリスクが高まります。',
  'data_accuracy', 'オプション市場は複雑であり、価格はボラティリティ、時間的価値の減衰、金利等の多くの要因に影響されます。本サービスで提供される情報は、参考情報であり、実際の取引価格とは異なる可能性があります。',
  'updated_date', '2024年12月',
  'contact_info', ''
)
WHERE category = 'options' AND (footer_config = '{}'::jsonb OR footer_config IS NULL);

-- General templates
UPDATE landing_templates
SET footer_config = jsonb_build_object(
  'disclaimer_title', '免責事項',
  'tool_nature', '本サービスは、情報提供を目的としたツールです。投資助言、金融商品の販売、取引の勧誘を目的としたものではありません。',
  'investment_disclaimer', '本サービスで提供される情報は、一般的な情報提供のみを目的としています。特定の投資行動を推奨するものではありません。投資判断の最終的な責任は、お客様ご自身にあります。',
  'user_responsibility', 'お客様は、自己の責任において本サービスをご利用ください。投資判断に際しては、必ず複数の情報源を参照し、独自の分析を行うことを推奨します。',
  'license_statement', '本サービスは、金融商品取引業の登録を行っておりません。',
  'compliance_statement', '当社は、関係法令を遵守し、適切なサービス提供に努めています。',
  'google_ads_compliance', '本ウェブサイトは、Google広告ポリシーに準拠した運営を行っています。',
  'risk_warning', '投資には様々なリスクが伴います。投資を行う際は、リスクを十分に理解し、余裕資金で行ってください。',
  'data_accuracy', '本サービスで提供される情報は、信頼できると判断した情報源から取得していますが、その正確性、完全性を保証するものではありません。',
  'updated_date', '2024年12月',
  'contact_info', ''
)
WHERE (category = 'general' OR category IS NULL) AND (footer_config = '{}'::jsonb OR footer_config IS NULL);