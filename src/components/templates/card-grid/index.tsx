import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { TrendingUp, BarChart3, PieChart, LineChart, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { DiagnosisLoadingScreen } from '../shared/DiagnosisLoadingScreen';
import { DiagnosisResult } from '../shared/DiagnosisResult';
import { getTemplateTheme } from '../../../types/theme';

export function TemplateCardGrid({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const theme = getTemplateTheme('card-grid');

  const features = [
    {
      id: 'trend',
      icon: TrendingUp,
      titleKey: 'feature1_title',
      titleDefault: 'Trend Tracking',
      descKey: 'feature1_description',
      descDefault: 'Monitor market trends',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      id: 'data',
      icon: BarChart3,
      titleKey: 'feature2_title',
      titleDefault: 'Data Analysis',
      descKey: 'feature2_description',
      descDefault: 'Comprehensive analytics',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      id: 'charts',
      icon: PieChart,
      titleKey: 'feature3_title',
      titleDefault: 'Visual Charts',
      descKey: 'feature3_description',
      descDefault: 'Interactive visualizations',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      id: 'reports',
      icon: LineChart,
      titleKey: 'feature4_title',
      titleDefault: 'Smart Reports',
      descKey: 'feature4_description',
      descDefault: 'Detailed insights',
      bgColor: 'bg-rose-100',
      iconColor: 'text-rose-600',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col">
      <div className="flex-1 px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getContent('hero_title', 'Stock Analysis Dashboard')}
            </h1>
            <p className="text-gray-600 text-sm">
              {getContent('hero_subtitle', 'Your market data workspace')}
            </p>
          </div>

          <div className="mb-8 bg-white rounded-2xl p-6 shadow-xl">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stock Code
                </label>
                <input
                  type="text"
                  value={diagnosis.stockCode}
                  onChange={(e) => diagnosis.setStockCode(e.target.value)}
                  placeholder={getContent('input_placeholder', 'Enter code')}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                  disabled={diagnosis.loading || diagnosis.analyzing}
                />
              </div>

              <button
                onClick={diagnosis.handleDiagnose}
                disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {diagnosis.loading || diagnosis.analyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{getContent('analyzing_text', 'Analyzing...')}</span>
                  </span>
                ) : (
                  <span>{getContent('submit_button', 'Analyze')}</span>
                )}
              </button>
            </div>

            <p className="mt-4 text-xs text-gray-500 text-center">
              {getContent('disclaimer_text', 'Information tool only')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className={`${feature.bgColor} rounded-2xl p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={`w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md`}>
                      <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-bold text-sm mb-1">
                        {getContent(feature.titleKey, feature.titleDefault)}
                      </h3>
                      <p className="text-gray-700 text-xs">
                        {getContent(feature.descKey, feature.descDefault)}
                      </p>
                    </div>
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
