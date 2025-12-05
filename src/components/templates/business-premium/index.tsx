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
      titleDefault: 'プレミアム品質',
      descKey: 'feature1_description',
      descDefault: 'プロフェッショナルグレードの分析',
    },
    {
      id: 'enterprise',
      icon: BarChart3,
      titleKey: 'feature2_title',
      titleDefault: 'エンタープライズデータ',
      descKey: 'feature2_description',
      descDefault: '包括的な市場情報',
    },
    {
      id: 'advanced',
      icon: TrendingUp,
      titleKey: 'feature3_title',
      titleDefault: '高度なツール',
      descKey: 'feature3_description',
      descDefault: '洗練されたアルゴリズム',
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
      {/* Premium brand bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-3 px-6 border-b-4 border-amber-500">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 flex items-center justify-center font-black text-slate-900 text-xl">
              P
            </div>
            <div>
              <div className="text-amber-500 text-xs font-bold tracking-wider uppercase">Premium</div>
              <div className="text-slate-400 text-[10px] uppercase tracking-wide">Professional Edition</div>
            </div>
          </div>
          <div className="text-slate-400 text-xs font-mono">v2.0</div>
        </div>
      </div>

      {/* Magazine-style multi-column layout */}
      <div className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Editorial header */}
          <div className="mb-12 pb-8 border-b-2 border-slate-300">
            <div className="flex items-start justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-12 bg-gradient-to-b from-slate-900 to-amber-500"></div>
                  <h1 className="text-5xl font-bold text-slate-900 leading-tight">
                    {getContent('hero_title', 'エグゼクティブ株式分析')}
                  </h1>
                </div>
                <p className="text-slate-600 text-base font-medium leading-relaxed">
                  {getContent('hero_subtitle', 'プロフェッショナル市場情報プラットフォーム')}
                </p>
              </div>
              <div className="flex-shrink-0 w-32 h-32 bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
                <div className="text-amber-500 text-6xl font-black">株</div>
              </div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Left column - main input */}
            <div className="bg-white shadow-2xl border-2 border-slate-200">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex items-center justify-between border-b-4 border-amber-500">
                <h2 className="text-white font-bold text-xs uppercase tracking-widest">分析リクエスト</h2>
                <div className="px-3 py-1 bg-amber-500 text-slate-900 text-xs font-black uppercase tracking-wide">PRO</div>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-3 uppercase tracking-wide flex items-center justify-between">
                      <span>株式シンボル</span>
                      <span className="text-amber-600">必須</span>
                    </label>
                    <input
                      type="text"
                      value={diagnosis.stockCode}
                      onChange={(e) => diagnosis.setStockCode(e.target.value)}
                      placeholder={getContent('input_placeholder', 'シンボル入力')}
                      className="w-full px-5 py-4 border-2 border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 font-semibold text-lg transition-all"
                      disabled={diagnosis.loading || diagnosis.analyzing}
                    />
                  </div>

                  <button
                    onClick={diagnosis.handleDiagnose}
                    disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                    className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white py-4 px-6 font-bold text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg border-2 border-amber-500"
                  >
                    {diagnosis.loading || diagnosis.analyzing ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{getContent('analyzing_text', '処理中...')}</span>
                      </span>
                    ) : (
                      <span>{getContent('submit_button', '分析実行')}</span>
                    )}
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {getContent('disclaimer_text', '本ツールは情報提供のみを目的としています')}
                  </p>
                </div>
              </div>
            </div>

            {/* Right column - features as editorial sidebar */}
            <div className="space-y-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className="bg-white shadow-lg border-l-4 border-amber-500 hover:shadow-xl transition-all"
                  >
                    <div className="p-6 flex items-start gap-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                        <Icon className="w-8 h-8 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-2">
                          Feature {String(index + 1).padStart(2, '0')}
                        </div>
                        <h3 className="text-slate-900 font-bold text-base mb-2">
                          {getContent(feature.titleKey, feature.titleDefault)}
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {getContent(feature.descKey, feature.descDefault)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom decorative strip */}
          <div className="flex items-center justify-between pt-8 border-t-2 border-slate-300">
            <div className="flex gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-2 h-2 ${i < 3 ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
              ))}
            </div>
            <div className="text-slate-500 text-xs font-mono uppercase tracking-widest">Professional Analysis</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
