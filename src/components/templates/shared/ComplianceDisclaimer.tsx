import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FooterConfig } from '../../../types/template';

interface ComplianceDisclaimerProps {
  config: FooterConfig;
  variant?: 'default' | 'modern' | 'minimal' | 'professional';
}

export default function ComplianceDisclaimer({ config, variant = 'default' }: ComplianceDisclaimerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const variantStyles = {
    default: {
      container: 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200',
      title: 'text-gray-900 font-semibold',
      text: 'text-gray-700',
      button: 'bg-orange-500 hover:bg-orange-600 text-white',
      sectionTitle: 'text-gray-800 font-medium',
      divider: 'border-gray-300',
    },
    modern: {
      container: 'bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30',
      title: 'text-cyan-400 font-bold font-mono',
      text: 'text-gray-300 font-mono text-sm',
      button: 'bg-cyan-500 hover:bg-cyan-400 text-black font-mono',
      sectionTitle: 'text-cyan-300 font-semibold font-mono',
      divider: 'border-cyan-500/30',
    },
    minimal: {
      container: 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200',
      title: 'text-green-900 font-semibold',
      text: 'text-green-800',
      button: 'bg-green-600 hover:bg-green-700 text-white',
      sectionTitle: 'text-green-800 font-medium',
      divider: 'border-green-300',
    },
    professional: {
      container: 'bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200',
      title: 'text-rose-900 font-semibold',
      text: 'text-rose-800',
      button: 'bg-rose-600 hover:bg-rose-700 text-white',
      sectionTitle: 'text-rose-800 font-medium',
      divider: 'border-rose-300',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`rounded-lg p-6 shadow-lg ${styles.container}`}>
      <h3 className={`text-xl mb-4 ${styles.title}`}>
        {config.disclaimer_title}
      </h3>

      <div className={`${styles.text} space-y-2 mb-4`}>
        <p>{config.tool_nature}</p>
        <p className="text-sm opacity-90">
          {config.investment_disclaimer.substring(0, 120)}...
        </p>
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${styles.button}`}
      >
        {isExpanded ? (
          <>
            <ChevronUp size={18} />
            <span>閉じる</span>
          </>
        ) : (
          <>
            <ChevronDown size={18} />
            <span>完全な免責事項を表示</span>
          </>
        )}
      </button>

      {isExpanded && (
        <div className={`mt-6 space-y-4 ${styles.text} animate-fadeIn`}>
          <div className={`border-t pt-4 ${styles.divider}`}>
            <h4 className={`text-base mb-2 ${styles.sectionTitle}`}>投資に関する免責事項</h4>
            <p className="text-sm leading-relaxed">{config.investment_disclaimer}</p>
          </div>

          <div className={`border-t pt-4 ${styles.divider}`}>
            <h4 className={`text-base mb-2 ${styles.sectionTitle}`}>利用者の責任</h4>
            <p className="text-sm leading-relaxed">{config.user_responsibility}</p>
          </div>

          <div className={`border-t pt-4 ${styles.divider}`}>
            <h4 className={`text-base mb-2 ${styles.sectionTitle}`}>金融ライセンスについて</h4>
            <p className="text-sm leading-relaxed">{config.license_statement}</p>
          </div>

          <div className={`border-t pt-4 ${styles.divider}`}>
            <h4 className={`text-base mb-2 ${styles.sectionTitle}`}>法令遵守</h4>
            <p className="text-sm leading-relaxed">{config.compliance_statement}</p>
          </div>

          <div className={`border-t pt-4 ${styles.divider}`}>
            <h4 className={`text-base mb-2 ${styles.sectionTitle}`}>Google広告ポリシー</h4>
            <p className="text-sm leading-relaxed">{config.google_ads_compliance}</p>
          </div>

          <div className={`border-t pt-4 ${styles.divider}`}>
            <h4 className={`text-base mb-2 ${styles.sectionTitle}`}>リスク警告</h4>
            <p className="text-sm leading-relaxed">{config.risk_warning}</p>
          </div>

          <div className={`border-t pt-4 ${styles.divider}`}>
            <h4 className={`text-base mb-2 ${styles.sectionTitle}`}>データの正確性</h4>
            <p className="text-sm leading-relaxed">{config.data_accuracy}</p>
          </div>

          {config.contact_info && (
            <div className={`border-t pt-4 ${styles.divider}`}>
              <h4 className={`text-base mb-2 ${styles.sectionTitle}`}>お問い合わせ</h4>
              <p className="text-sm leading-relaxed">{config.contact_info}</p>
            </div>
          )}

          <div className={`border-t pt-4 text-xs opacity-75 ${styles.divider}`}>
            <p>最終更新: {config.updated_date}</p>
          </div>
        </div>
      )}
    </div>
  );
}
