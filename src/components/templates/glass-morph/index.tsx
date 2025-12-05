import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { Cloud, TrendingUp, Droplets, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { DiagnosisLoadingScreen } from '../shared/DiagnosisLoadingScreen';
import { DiagnosisResult } from '../shared/DiagnosisResult';
import { getTemplateTheme } from '../../../types/theme';

export function TemplateGlassMorph({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const theme = getTemplateTheme('glass-morph');

  const features = [
    {
      id: 'transparent',
      icon: Cloud,
      titleKey: 'feature1_title',
      titleDefault: 'Crystal Clear',
      descKey: 'feature1_description',
      descDefault: 'Transparent data visualization',
    },
    {
      id: 'fluid',
      icon: Droplets,
      titleKey: 'feature2_title',
      titleDefault: 'Fluid Interface',
      descKey: 'feature2_description',
      descDefault: 'Smooth user experience',
    },
    {
      id: 'modern',
      icon: TrendingUp,
      titleKey: 'feature3_title',
      titleDefault: 'Modern Design',
      descKey: 'feature3_description',
      descDefault: 'Contemporary aesthetics',
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
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 relative overflow-hidden flex flex-col">
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      <div className="relative flex-1 px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-light text-blue-900 mb-3">
              {getContent('hero_title', 'Stock Analysis')}
            </h1>
            <p className="text-blue-600 text-sm">
              {getContent('hero_subtitle', 'Elegant market data tool')}
            </p>
          </div>

          <div className="mb-10">
            <div className="backdrop-blur-xl bg-white/30 border border-white/50 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-5">
                <div>
                  <input
                    type="text"
                    value={diagnosis.stockCode}
                    onChange={(e) => diagnosis.setStockCode(e.target.value)}
                    placeholder={getContent('input_placeholder', 'Enter stock code')}
                    className="w-full px-6 py-4 backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl text-blue-900 placeholder-blue-400/60 focus:outline-none focus:bg-white/50 focus:border-blue-300 transition-all shadow-inner"
                    disabled={diagnosis.loading || diagnosis.analyzing}
                  />
                </div>

                <button
                  onClick={diagnosis.handleDiagnose}
                  disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                  className="w-full py-4 backdrop-blur-md bg-blue-500/80 hover:bg-blue-600/80 border border-white/40 rounded-2xl text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {diagnosis.loading || diagnosis.analyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{getContent('analyzing_text', 'Analyzing...')}</span>
                    </span>
                  ) : (
                    <span>{getContent('submit_button', 'Analyze Stock')}</span>
                  )}
                </button>
              </div>

              <p className="mt-5 text-xs text-blue-700 text-center">
                {getContent('disclaimer_text', 'Data visualization for informational purposes')}
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="backdrop-blur-lg bg-white/20 border border-white/40 rounded-2xl p-6 hover:bg-white/30 transition-all shadow-lg"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-14 h-14 backdrop-blur-md bg-white/40 border border-white/50 rounded-2xl flex items-center justify-center shadow-inner">
                      <Icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-blue-900 font-medium text-lg mb-1">
                        {getContent(feature.titleKey, feature.titleDefault)}
                      </h3>
                      <p className="text-blue-700 text-sm">
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
