import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { Sparkles, TrendingUp, Waves, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { DiagnosisLoadingScreen } from '../shared/DiagnosisLoadingScreen';
import { DiagnosisResult } from '../shared/DiagnosisResult';
import { getTemplateTheme } from '../../../types/theme';

export function TemplateGradientFluid({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const theme = getTemplateTheme('gradient-fluid');

  const features = [
    {
      id: 'smooth',
      icon: Waves,
      titleKey: 'feature1_title',
      titleDefault: 'Smooth Flow',
      descKey: 'feature1_description',
      descDefault: 'Seamless data streaming',
      gradient: 'from-purple-400 via-pink-400 to-purple-500',
    },
    {
      id: 'dynamic',
      icon: TrendingUp,
      titleKey: 'feature2_title',
      titleDefault: 'Dynamic Insights',
      descKey: 'feature2_description',
      descDefault: 'Adaptive visualization',
      gradient: 'from-fuchsia-400 via-purple-400 to-pink-400',
    },
    {
      id: 'elegant',
      icon: Sparkles,
      titleKey: 'feature3_title',
      titleDefault: 'Elegant Design',
      descKey: 'feature3_description',
      descDefault: 'Beautiful user experience',
      gradient: 'from-pink-400 via-fuchsia-400 to-violet-400',
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-fuchsia-50 relative overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative flex-1 px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent mb-3">
              {getContent('hero_title', 'Stock Analysis')}
            </h1>
            <p className="text-purple-700 text-sm">
              {getContent('hero_subtitle', 'Fluid market data visualization')}
            </p>
          </div>

          <div className="mb-10 relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-400 rounded-3xl blur opacity-30"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
              <div className="space-y-5">
                <div className="relative">
                  <input
                    type="text"
                    value={diagnosis.stockCode}
                    onChange={(e) => diagnosis.setStockCode(e.target.value)}
                    placeholder={getContent('input_placeholder', 'Enter stock code')}
                    className="w-full px-6 py-4 bg-white rounded-2xl text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-inner"
                    disabled={diagnosis.loading || diagnosis.analyzing}
                  />
                </div>

                <button
                  onClick={diagnosis.handleDiagnose}
                  disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                  className="relative w-full py-4 rounded-2xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-fuchsia-600"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {diagnosis.loading || diagnosis.analyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{getContent('analyzing_text', 'Analyzing...')}</span>
                      </>
                    ) : (
                      <span>{getContent('submit_button', 'Start Analysis')}</span>
                    )}
                  </span>
                </button>
              </div>

              <p className="mt-5 text-xs text-purple-600 text-center">
                {getContent('disclaimer_text', 'Informational purposes only')}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="relative group"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity`}></div>
                  <div className="relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 hover:bg-white/80 transition-all">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-purple-900 font-semibold text-lg mb-1">
                          {getContent(feature.titleKey, feature.titleDefault)}
                        </h3>
                        <p className="text-purple-700 text-sm">
                          {getContent(feature.descKey, feature.descDefault)}
                        </p>
                      </div>
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
