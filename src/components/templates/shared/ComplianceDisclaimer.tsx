import { FooterConfig } from '../../../types/template';

interface ComplianceDisclaimerProps {
  config: FooterConfig;
  variant?: 'default' | 'modern' | 'minimal' | 'professional';
}

export default function ComplianceDisclaimer({ config, variant = 'default' }: ComplianceDisclaimerProps) {
  const variantStyles = {
    default: {
      container: 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200/50',
      title: 'text-gray-900 font-bold',
      text: 'text-gray-700',
      sectionTitle: 'text-gray-800 font-semibold',
      divider: 'border-gray-300',
    },
    modern: {
      container: 'bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30',
      title: 'text-cyan-400 font-bold font-mono',
      text: 'text-gray-300 font-mono text-sm',
      sectionTitle: 'text-cyan-300 font-semibold font-mono',
      divider: 'border-cyan-500/30',
    },
    minimal: {
      container: 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200',
      title: 'text-green-900 font-bold',
      text: 'text-green-800',
      sectionTitle: 'text-green-800 font-semibold',
      divider: 'border-green-300',
    },
    professional: {
      container: 'bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200',
      title: 'text-rose-900 font-bold',
      text: 'text-rose-800',
      sectionTitle: 'text-rose-800 font-semibold',
      divider: 'border-rose-300',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={`rounded-xl p-8 shadow-lg ${styles.container}`}>
      <h3 className={`text-2xl mb-6 ${styles.title}`}>
        {config.disclaimer_title}
      </h3>

      <div className={`${styles.text} space-y-3 mb-6`}>
        <p className="leading-relaxed">{config.tool_nature}</p>
      </div>

      <div className={`space-y-5 ${styles.text}`}>
        <div className={`border-t pt-5 ${styles.divider}`}>
          <h4 className={`text-base mb-3 ${styles.sectionTitle}`}>投資に関する免責事項</h4>
          <p className="text-sm leading-relaxed">{config.investment_disclaimer}</p>
        </div>

        <div className={`border-t pt-5 ${styles.divider}`}>
          <h4 className={`text-base mb-3 ${styles.sectionTitle}`}>利用者の責任</h4>
          <p className="text-sm leading-relaxed">{config.user_responsibility}</p>
        </div>

        <div className={`border-t pt-5 ${styles.divider}`}>
          <h4 className={`text-base mb-3 ${styles.sectionTitle}`}>金融ライセンスについて</h4>
          <p className="text-sm leading-relaxed">{config.license_statement}</p>
        </div>

        <div className={`border-t pt-5 ${styles.divider}`}>
          <h4 className={`text-base mb-3 ${styles.sectionTitle}`}>法令遵守</h4>
          <p className="text-sm leading-relaxed">{config.compliance_statement}</p>
        </div>

        <div className={`border-t pt-5 ${styles.divider}`}>
          <h4 className={`text-base mb-3 ${styles.sectionTitle}`}>Google広告ポリシー</h4>
          <p className="text-sm leading-relaxed">{config.google_ads_compliance}</p>
        </div>

        <div className={`border-t pt-5 ${styles.divider}`}>
          <h4 className={`text-base mb-3 ${styles.sectionTitle}`}>リスク警告</h4>
          <p className="text-sm leading-relaxed">{config.risk_warning}</p>
        </div>

        <div className={`border-t pt-5 ${styles.divider}`}>
          <h4 className={`text-base mb-3 ${styles.sectionTitle}`}>データの正確性</h4>
          <p className="text-sm leading-relaxed">{config.data_accuracy}</p>
        </div>

        {config.contact_info && (
          <div className={`border-t pt-5 ${styles.divider}`}>
            <h4 className={`text-base mb-3 ${styles.sectionTitle}`}>お問い合わせ</h4>
            <p className="text-sm leading-relaxed">{config.contact_info}</p>
          </div>
        )}

        <div className={`border-t pt-5 text-xs opacity-75 ${styles.divider}`}>
          <p>最終更新: {config.updated_date}</p>
        </div>
      </div>
    </div>
  );
}
