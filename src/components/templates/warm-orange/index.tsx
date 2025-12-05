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
      titleDefault: 'ユーザーフレンドリー',
      descKey: 'feature1_description',
      descDefault: '分かりやすいデータ',
    },
    {
      id: 'bright',
      icon: Sun,
      titleKey: 'feature2_title',
      titleDefault: '明るいインサイト',
      descKey: 'feature2_description',
      descDefault: '明確な市場概要',
    },
    {
      id: 'growth',
      icon: TrendingUp,
      titleKey: 'feature3_title',
      titleDefault: '成長追跡',
      descKey: 'feature3_description',
      descDefault: '関心事をモニタリング',
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex flex-col relative overflow-hidden">
      {/* Soft background decorations */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-orange-200 rounded-full opacity-40 blur-2xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-yellow-200 rounded-full opacity-40 blur-2xl"></div>

      {/* Cartoon-style chat bubble layout */}
      <div className="relative flex-1 px-6 py-12 flex items-center justify-center">
        <div className="max-w-lg w-full">
          {/* Cute mascot illustration placeholder */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full mb-4 shadow-2xl animate-bounce" style={{ animationDuration: '2s' }}>
              <Sun className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-orange-900 mb-2">
              {getContent('hero_title', 'やさしい株式分析')}
            </h1>
            <p className="text-orange-700 text-sm">
              {getContent('hero_subtitle', '温かくフレンドリーな市場データツール')}
            </p>
          </div>

          {/* Main input bubble */}
          <div className="mb-8 bg-white rounded-3xl p-8 shadow-2xl border-4 border-orange-200 relative">
            <div className="absolute -top-4 left-12 w-8 h-8 bg-white border-l-4 border-t-4 border-orange-200 transform rotate-45"></div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-orange-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  <span>株式コード</span>
                </label>
                <input
                  type="text"
                  value={diagnosis.stockCode}
                  onChange={(e) => diagnosis.setStockCode(e.target.value)}
                  placeholder={getContent('input_placeholder', '株式コードを入力')}
                  className="w-full px-5 py-4 bg-orange-50 border-3 border-orange-200 rounded-2xl text-orange-900 text-lg placeholder-orange-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                  disabled={diagnosis.loading || diagnosis.analyzing}
                />
              </div>

              <button
                onClick={diagnosis.handleDiagnose}
                disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                className="w-full bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white py-4 px-6 rounded-full font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-2xl hover:scale-105"
              >
                {diagnosis.loading || diagnosis.analyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>{getContent('analyzing_text', '分析中...')}</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>{getContent('submit_button', '診断開始')}</span>
                    <span className="text-2xl">✨</span>
                  </span>
                )}
              </button>
            </div>

            <p className="mt-5 text-xs text-orange-600 text-center">
              {getContent('disclaimer_text', '本ツールは情報提供のみを目的としています')}
            </p>
          </div>

          {/* Feature chat bubbles */}
          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isLeft = index % 2 === 0;
              return (
                <div
                  key={feature.id}
                  className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className={`max-w-sm bg-white rounded-3xl p-5 shadow-lg border-2 border-orange-100 hover:border-orange-300 hover:scale-105 transition-all relative ${isLeft ? 'rounded-bl-none' : 'rounded-br-none'}`}>
                    {isLeft && (
                      <div className="absolute -bottom-2 left-4 w-6 h-6 bg-white border-l-2 border-b-2 border-orange-100 transform rotate-12"></div>
                    )}
                    {!isLeft && (
                      <div className="absolute -bottom-2 right-4 w-6 h-6 bg-white border-r-2 border-b-2 border-orange-100 transform -rotate-12"></div>
                    )}

                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-md">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-orange-900 font-bold text-base mb-1">
                          {getContent(feature.titleKey, feature.titleDefault)}
                        </h3>
                        <p className="text-orange-700 text-sm">
                          {getContent(feature.descKey, feature.descDefault)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cute pagination dots */}
          <div className="mt-10 flex justify-center gap-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${i === 0 ? 'bg-orange-400 scale-125' : 'bg-orange-200'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
