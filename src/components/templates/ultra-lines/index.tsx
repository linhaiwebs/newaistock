import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { TrendingUp, BarChart3, Activity, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { DiagnosisLoadingScreen } from '../shared/DiagnosisLoadingScreen';
import { DiagnosisResult } from '../shared/DiagnosisResult';
import { getTemplateTheme } from '../../../types/theme';

export function TemplateUltraLines({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const theme = getTemplateTheme('ultra-lines');

  const features = [
    {
      id: 'precision',
      icon: Activity,
      titleKey: 'feature1_title',
      titleDefault: 'Precision',
      descKey: 'feature1_description',
      descDefault: 'Accurate data analysis',
    },
    {
      id: 'clarity',
      icon: TrendingUp,
      titleKey: 'feature2_title',
      titleDefault: 'Clarity',
      descKey: 'feature2_description',
      descDefault: 'Clear visualization',
    },
    {
      id: 'efficiency',
      icon: BarChart3,
      titleKey: 'feature3_title',
      titleDefault: 'Efficiency',
      descKey: 'feature3_description',
      descDefault: 'Fast processing',
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
      <div className="border-b border-zinc-200">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border border-zinc-900 rounded-sm"></div>
              <span className="text-sm font-medium text-zinc-900">STOCK TOOL</span>
            </div>
            <div className="text-xs text-zinc-500">v1.0</div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 py-16">
        <div className="max-w-md mx-auto">
          <div className="mb-16">
            <h1 className="text-5xl font-extralight text-zinc-900 mb-4 tracking-tight">
              {getContent('hero_title', 'Stock Analysis')}
            </h1>
            <div className="w-12 h-px bg-zinc-900 mb-4"></div>
            <p className="text-zinc-600 text-sm font-light">
              {getContent('hero_subtitle', 'Minimalist data visualization tool')}
            </p>
          </div>

          <div className="mb-16 border border-zinc-200 p-8">
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-zinc-900 uppercase tracking-wider">
                    Input
                  </label>
                  <span className="text-xs text-zinc-400">Required</span>
                </div>
                <input
                  type="text"
                  value={diagnosis.stockCode}
                  onChange={(e) => diagnosis.setStockCode(e.target.value)}
                  placeholder={getContent('input_placeholder', 'Stock code')}
                  className="w-full px-0 py-3 border-b border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors bg-transparent font-light"
                  disabled={diagnosis.loading || diagnosis.analyzing}
                />
              </div>

              <button
                onClick={diagnosis.handleDiagnose}
                disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                className="w-full py-4 border border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all font-light uppercase text-sm tracking-widest"
              >
                {diagnosis.loading || diagnosis.analyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{getContent('analyzing_text', 'Processing')}</span>
                  </span>
                ) : (
                  <span>{getContent('submit_button', 'Execute')}</span>
                )}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-100">
              <p className="text-xs text-zinc-500 font-light leading-relaxed">
                {getContent('disclaimer_text', 'This tool provides information only. Not investment advice.')}
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="border-l-2 border-zinc-900 pl-6 py-2"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <Icon className="w-5 h-5 text-zinc-900" strokeWidth={1} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-zinc-900 font-light text-lg mb-1">
                        {getContent(feature.titleKey, feature.titleDefault)}
                      </h3>
                      <p className="text-zinc-600 text-sm font-light">
                        {getContent(feature.descKey, feature.descDefault)}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-xs text-zinc-400 font-mono">
                      0{index + 1}
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
