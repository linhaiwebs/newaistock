import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { TrendingUp, BarChart3, Award, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { DiagnosisLoadingScreen } from '../shared/DiagnosisLoadingScreen';
import { DiagnosisResult } from '../shared/DiagnosisResult';
import { getTemplateTheme } from '../../../types/theme';

export function TemplateBusinessPremium({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const theme = getTemplateTheme('business-premium');

  const features = [
    {
      id: 'premium',
      icon: Award,
      titleKey: 'feature1_title',
      titleDefault: 'Premium Quality',
      descKey: 'feature1_description',
      descDefault: 'Professional-grade analysis',
    },
    {
      id: 'enterprise',
      icon: BarChart3,
      titleKey: 'feature2_title',
      titleDefault: 'Enterprise Data',
      descKey: 'feature2_description',
      descDefault: 'Comprehensive market info',
    },
    {
      id: 'advanced',
      icon: TrendingUp,
      titleKey: 'feature3_title',
      titleDefault: 'Advanced Tools',
      descKey: 'feature3_description',
      descDefault: 'Sophisticated algorithms',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 flex flex-col">
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 py-2 px-6 border-b border-slate-600">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            <span className="text-xs text-slate-200 font-semibold tracking-wide">PREMIUM</span>
          </div>
          <div className="text-xs text-slate-400">Professional Edition</div>
        </div>
      </div>

      <div className="flex-1 px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-slate-600 to-amber-500"></div>
              <h1 className="text-3xl font-bold text-slate-900">
                {getContent('hero_title', 'Executive Stock Analysis')}
              </h1>
              <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-slate-600"></div>
            </div>
            <p className="text-slate-600 text-sm font-medium">
              {getContent('hero_subtitle', 'Professional market intelligence platform')}
            </p>
          </div>

          <div className="mb-10 bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-white font-bold text-sm uppercase tracking-wider">Analysis Input</h2>
              <div className="px-2 py-1 bg-amber-500 rounded text-xs font-bold text-slate-900">PRO</div>
            </div>
            <div className="p-8">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    Stock Symbol
                  </label>
                  <input
                    type="text"
                    value={diagnosis.stockCode}
                    onChange={(e) => diagnosis.setStockCode(e.target.value)}
                    placeholder={getContent('input_placeholder', 'Enter symbol')}
                    className="w-full px-5 py-4 border-2 border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-600 font-semibold text-lg transition-all"
                    disabled={diagnosis.loading || diagnosis.analyzing}
                  />
                </div>

                <button
                  onClick={diagnosis.handleDiagnose}
                  disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                  className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-800 hover:to-slate-700 text-white py-4 px-6 rounded-lg font-bold text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg border border-amber-500/30"
                >
                  {diagnosis.loading || diagnosis.analyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{getContent('analyzing_text', 'Processing...')}</span>
                    </span>
                  ) : (
                    <span>{getContent('submit_button', 'Execute Analysis')}</span>
                  )}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {getContent('disclaimer_text', 'Professional tool for market data visualization. Information purposes only.')}
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
                  className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="flex items-center">
                    <div className="w-20 bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center py-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 px-6 py-5">
                      <h3 className="text-slate-900 font-bold text-base mb-1">
                        {getContent(feature.titleKey, feature.titleDefault)}
                      </h3>
                      <p className="text-slate-600 text-sm">
                        {getContent(feature.descKey, feature.descDefault)}
                      </p>
                    </div>
                    <div className="w-1 h-16 bg-gradient-to-b from-transparent via-amber-500 to-transparent"></div>
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
