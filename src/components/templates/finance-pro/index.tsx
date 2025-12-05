import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { TrendingUp, BarChart3, DollarSign, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { DiagnosisLoadingScreen } from '../shared/DiagnosisLoadingScreen';
import { DiagnosisResult } from '../shared/DiagnosisResult';
import { getTemplateTheme } from '../../../types/theme';

export function TemplateFinancePro({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const theme = getTemplateTheme('finance-pro');

  const features = [
    {
      id: 'market',
      icon: TrendingUp,
      titleKey: 'feature1_title',
      titleDefault: 'Market Intelligence',
      descKey: 'feature1_description',
      descDefault: 'Professional-grade market data',
      color: 'from-blue-600 to-blue-800',
    },
    {
      id: 'analytics',
      icon: BarChart3,
      titleKey: 'feature2_title',
      titleDefault: 'Deep Analytics',
      descKey: 'feature2_description',
      descDefault: 'Comprehensive financial analysis',
      color: 'from-blue-700 to-slate-800',
    },
    {
      id: 'valuation',
      icon: DollarSign,
      titleKey: 'feature3_title',
      titleDefault: 'Valuation Models',
      descKey: 'feature3_description',
      descDefault: 'Advanced pricing algorithms',
      color: 'from-slate-700 to-slate-900',
    },
  ];

  if (diagnosis.showResult) {
    return (
      <DiagnosisResult
        stockName={diagnosis.stockName}
        stockCode={diagnosis.stockCode}
        result={diagnosis.result}
        redirectUrl={diagnosis.redirectUrl}
        onBack={diagnosis.resetDiagnosis}
        onConversion={diagnosis.handleConversion}
        themeColor={theme.colors.primary}
      />
    );
  }

  if (diagnosis.analyzing) {
    return (
      <DiagnosisLoadingScreen
        color={theme.colors.primary}
        stages={diagnosis.progressStages}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100/50 to-white flex flex-col">
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 py-3 px-6">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-100 font-medium">LIVE</span>
          </div>
          <div className="text-xs text-blue-200">Market Data Tool</div>
        </div>
      </div>

      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-1 h-6 bg-amber-500"></div>
              <h1 className="text-2xl font-bold text-blue-900">
                {getContent('hero_title', 'Professional Stock Analysis')}
              </h1>
              <div className="w-1 h-6 bg-amber-500"></div>
            </div>
            <p className="text-blue-700 text-sm font-medium">
              {getContent('hero_subtitle', 'Financial Market Data Visualization')}
            </p>
          </div>

          <div className="mb-8 bg-white rounded-lg shadow-xl border border-blue-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-3">
              <h2 className="text-white font-semibold text-sm tracking-wide">ANALYSIS REQUEST</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-blue-900 mb-2 uppercase tracking-wide">
                    Stock Symbol
                  </label>
                  <input
                    type="text"
                    value={diagnosis.stockCode}
                    onChange={(e) => diagnosis.setStockCode(e.target.value)}
                    placeholder={getContent('input_placeholder', 'Enter stock code')}
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded text-blue-900 placeholder-blue-300 focus:outline-none focus:border-blue-600 font-mono text-lg"
                    disabled={diagnosis.loading || diagnosis.analyzing}
                  />
                </div>

                <button
                  onClick={diagnosis.handleDiagnose}
                  disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-slate-900 text-white py-4 px-6 rounded font-bold text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {diagnosis.loading || diagnosis.analyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{getContent('analyzing_text', 'Processing...')}</span>
                    </span>
                  ) : (
                    <span>{getContent('submit_button', 'Run Analysis')}</span>
                  )}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-blue-100">
                <p className="text-xs text-blue-600 leading-relaxed">
                  {getContent('disclaimer_text', 'This tool provides market data visualization for informational purposes only. Not financial advice.')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="bg-white rounded-lg shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className={`bg-gradient-to-r ${feature.color} px-5 py-3 flex items-center gap-3`}>
                    <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-white font-bold text-sm">
                      {getContent(feature.titleKey, feature.titleDefault)}
                    </h3>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-blue-800 text-sm leading-relaxed">
                      {getContent(feature.descKey, feature.descDefault)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
