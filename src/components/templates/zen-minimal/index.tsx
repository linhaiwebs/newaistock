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
      titleDefault: '明晰な視界',
      descKey: 'feature1_description',
      descDefault: 'シンプルなデータ表示',
    },
    {
      id: 'focus',
      icon: TrendingUp,
      titleKey: 'feature2_title',
      titleDefault: '純粋な集中',
      descKey: 'feature2_description',
      descDefault: '本質的な情報のみ',
    },
    {
      id: 'balance',
      icon: BarChart3,
      titleKey: 'feature3_title',
      titleDefault: '完璧なバランス',
      descKey: 'feature3_description',
      descDefault: '調和のとれた分析',
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
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-zinc-50 flex flex-col relative overflow-hidden">
      {/* Subtle ink wash background */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-stone-200/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-radial from-zinc-200/30 to-transparent rounded-full blur-3xl"></div>

      {/* Vertical title on right (Japanese style) */}
      <div className="hidden md:block absolute right-12 top-1/4 writing-mode-vertical-rl">
        <h1 className="text-4xl font-light text-stone-800 tracking-widest opacity-20">
          株式禅
        </h1>
      </div>

      <div className="flex-1 flex items-center justify-start px-8 md:px-16 py-16">
        <div className="w-full max-w-2xl">
          {/* Title section - asymmetric placement */}
          <div className="mb-24 ml-0 md:ml-24">
            <div className="space-y-6">
              <div className="w-20 h-px bg-stone-800"></div>

              <h1 className="text-5xl md:text-6xl font-extralight text-stone-900 leading-tight tracking-tight">
                {getContent('hero_title', '株式禅')}
              </h1>

              <p className="text-stone-600 text-sm font-light ml-1 max-w-xs leading-loose">
                {getContent('hero_subtitle', '心を込めたデータ可視化')}
              </p>
            </div>
          </div>

          {/* Input section - offset to center-left */}
          <div className="mb-20 ml-0 md:ml-12">
            <div className="max-w-md space-y-8">
              <div className="space-y-4">
                <label className="block text-stone-700 text-xs font-light tracking-widest uppercase opacity-60">
                  Code
                </label>
                <input
                  type="text"
                  value={diagnosis.stockCode}
                  onChange={(e) => diagnosis.setStockCode(e.target.value)}
                  placeholder={getContent('input_placeholder', '株式コード')}
                  className="w-full px-0 py-4 border-b-2 border-stone-300 text-stone-900 text-lg placeholder-stone-400 focus:outline-none focus:border-stone-800 transition-colors bg-transparent font-light"
                  disabled={diagnosis.loading || diagnosis.analyzing}
                />
              </div>

              <button
                onClick={diagnosis.handleDiagnose}
                disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                className="px-12 py-4 border border-stone-800 text-stone-800 hover:bg-stone-800 hover:text-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 font-light tracking-widest text-sm"
              >
                {diagnosis.loading || diagnosis.analyzing ? (
                  <span className="flex items-center justify-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{getContent('analyzing_text', '分析中')}</span>
                  </span>
                ) : (
                  <span>{getContent('submit_button', '診断開始')}</span>
                )}
              </button>

              <p className="text-xs text-stone-500 font-light leading-loose">
                {getContent('disclaimer_text', '本ツールは情報提供のみを目的としています')}
              </p>
            </div>
          </div>

          {/* Features - horizontal scroll on mobile, flowing on desktop */}
          <div className="ml-0 md:ml-32">
            <div className="flex md:flex-col gap-12 md:gap-16 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className="flex-shrink-0 w-64 md:w-auto flex items-start gap-5"
                    style={{
                      marginLeft: index * 20,
                    }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full border border-stone-300 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-stone-700" strokeWidth={1} />
                      </div>
                    </div>

                    <div className="flex-1 space-y-2">
                      <h3 className="text-stone-900 font-light text-base">
                        {getContent(feature.titleKey, feature.titleDefault)}
                      </h3>
                      <p className="text-stone-600 text-sm font-light leading-relaxed">
                        {getContent(feature.descKey, feature.descDefault)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Decorative elements */}
          <div className="mt-24 ml-0 md:ml-48 flex items-center gap-4">
            <div className="w-16 h-px bg-stone-300"></div>
            <div className="w-2 h-2 rounded-full bg-stone-400"></div>
            <div className="w-8 h-px bg-stone-300"></div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
