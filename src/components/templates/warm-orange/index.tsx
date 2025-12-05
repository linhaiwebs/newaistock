import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { Sun, TrendingUp, Heart, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { DiagnosisLoadingScreen } from '../shared/DiagnosisLoadingScreen';
import { DiagnosisResult } from '../shared/DiagnosisResult';
import { getTemplateTheme } from '../../../types/theme';

export function TemplateWarmOrange({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const theme = getTemplateTheme('warm-orange');

  const features = [
    {
      id: 'friendly',
      icon: Heart,
      titleKey: 'feature1_title',
      titleDefault: 'User Friendly',
      descKey: 'feature1_description',
      descDefault: 'Easy to understand data',
    },
    {
      id: 'bright',
      icon: Sun,
      titleKey: 'feature2_title',
      titleDefault: 'Bright Insights',
      descKey: 'feature2_description',
      descDefault: 'Clear market overview',
    },
    {
      id: 'growth',
      icon: TrendingUp,
      titleKey: 'feature3_title',
      titleDefault: 'Growth Tracking',
      descKey: 'feature3_description',
      descDefault: 'Monitor your interests',
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex flex-col">
      <div className="absolute top-10 right-10 w-32 h-32 bg-orange-200 rounded-full opacity-40 blur-2xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-yellow-200 rounded-full opacity-40 blur-2xl"></div>

      <div className="relative flex-1 px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full mb-4 shadow-lg">
              <Sun className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-orange-900 mb-2">
              {getContent('hero_title', 'Stock Analysis')}
            </h1>
            <p className="text-orange-700 text-sm">
              {getContent('hero_subtitle', 'Warm and friendly market data tool')}
            </p>
          </div>

          <div className="mb-10 bg-white rounded-3xl p-8 shadow-xl border-2 border-orange-100">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-orange-900 mb-2">
                  Stock Code
                </label>
                <input
                  type="text"
                  value={diagnosis.stockCode}
                  onChange={(e) => diagnosis.setStockCode(e.target.value)}
                  placeholder={getContent('input_placeholder', 'Enter stock code')}
                  className="w-full px-5 py-3 bg-orange-50 border-2 border-orange-200 rounded-2xl text-orange-900 placeholder-orange-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                  disabled={diagnosis.loading || diagnosis.analyzing}
                />
              </div>

              <button
                onClick={diagnosis.handleDiagnose}
                disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                className="w-full bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white py-4 px-6 rounded-2xl font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {diagnosis.loading || diagnosis.analyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{getContent('analyzing_text', 'Analyzing...')}</span>
                  </span>
                ) : (
                  <span>{getContent('submit_button', 'Start Analysis')}</span>
                )}
              </button>
            </div>

            <p className="mt-5 text-xs text-orange-600 text-center">
              {getContent('disclaimer_text', 'Educational information tool only')}
            </p>
          </div>

          <div className="space-y-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="bg-white rounded-3xl p-6 shadow-lg border-2 border-orange-100 hover:border-orange-300 hover:shadow-xl transition-all"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-md">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-orange-900 font-bold text-lg mb-1">
                        {getContent(feature.titleKey, feature.titleDefault)}
                      </h3>
                      <p className="text-orange-700 text-sm">
                        {getContent(feature.descKey, feature.descDefault)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-orange-400' : 'bg-orange-200'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
