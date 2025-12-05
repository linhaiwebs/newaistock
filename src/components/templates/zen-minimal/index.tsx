import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { TrendingUp, BarChart3, Activity, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { DiagnosisLoadingScreen } from '../shared/DiagnosisLoadingScreen';
import { DiagnosisResult } from '../shared/DiagnosisResult';
import { getTemplateTheme } from '../../../types/theme';

export function TemplateZenMinimal({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const theme = getTemplateTheme('zen-minimal');

  const features = [
    {
      id: 'clarity',
      icon: Activity,
      titleKey: 'feature1_title',
      titleDefault: 'Clear Vision',
      descKey: 'feature1_description',
      descDefault: 'Simple data presentation',
    },
    {
      id: 'focus',
      icon: TrendingUp,
      titleKey: 'feature2_title',
      titleDefault: 'Pure Focus',
      descKey: 'feature2_description',
      descDefault: 'Essential information only',
    },
    {
      id: 'balance',
      icon: BarChart3,
      titleKey: 'feature3_title',
      titleDefault: 'Perfect Balance',
      descKey: 'feature3_description',
      descDefault: 'Harmonious analysis',
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
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-8 py-16">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-light text-black mb-4 tracking-wide">
              {getContent('hero_title', 'Stock Analysis')}
            </h1>
            <div className="w-16 h-px bg-black mx-auto mb-6"></div>
            <p className="text-gray-600 text-sm font-light">
              {getContent('hero_subtitle', 'Simplicity in data visualization')}
            </p>
          </div>

          <div className="mb-16">
            <div className="border border-gray-200 rounded-none p-8">
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    value={diagnosis.stockCode}
                    onChange={(e) => diagnosis.setStockCode(e.target.value)}
                    placeholder={getContent('input_placeholder', 'Stock code')}
                    className="w-full px-0 py-3 border-b border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors bg-transparent"
                    disabled={diagnosis.loading || diagnosis.analyzing}
                  />
                </div>

                <button
                  onClick={diagnosis.handleDiagnose}
                  disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                  className="w-full py-4 border-2 border-black text-black hover:bg-black hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all font-light tracking-wide"
                >
                  {diagnosis.loading || diagnosis.analyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{getContent('analyzing_text', 'Processing...')}</span>
                    </span>
                  ) : (
                    <span>{getContent('submit_button', 'Begin Analysis')}</span>
                  )}
                </button>
              </div>

              <p className="mt-6 text-xs text-gray-500 text-center font-light">
                {getContent('disclaimer_text', 'Educational tool only')}
              </p>
            </div>
          </div>

          <div className="space-y-12">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.id} className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-full border border-gray-300 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-black" strokeWidth={1} />
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-black font-light text-lg mb-2">
                      {getContent(feature.titleKey, feature.titleDefault)}
                    </h3>
                    <p className="text-gray-600 text-sm font-light leading-relaxed">
                      {getContent(feature.descKey, feature.descDefault)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 flex justify-center gap-2">
            <div className="w-12 h-px bg-black"></div>
            <div className="w-2 h-px bg-gray-300"></div>
            <div className="w-2 h-px bg-gray-300"></div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
