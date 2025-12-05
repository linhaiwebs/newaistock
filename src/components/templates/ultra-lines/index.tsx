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
      titleDefault: '精度',
      descKey: 'feature1_description',
      descDefault: '正確なデータ分析',
    },
    {
      id: 'clarity',
      icon: TrendingUp,
      titleKey: 'feature2_title',
      titleDefault: '明快さ',
      descKey: 'feature2_description',
      descDefault: '明確な可視化',
    },
    {
      id: 'efficiency',
      icon: BarChart3,
      titleKey: 'feature3_title',
      titleDefault: '効率性',
      descKey: 'feature3_description',
      descDefault: '高速処理',
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
      {/* Top geometric header */}
      <div className="border-b-2 border-zinc-900">
        <div className="max-w-3xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-2 border-zinc-900"></div>
            <div className="w-8 h-8 border-2 border-zinc-900 rounded-full"></div>
            <div className="w-8 h-8 border-2 border-zinc-900 transform rotate-45"></div>
          </div>
          <div className="text-xs text-zinc-500 font-mono uppercase tracking-widest">株式解析</div>
        </div>
      </div>

      <div className="flex-1 px-8 py-20">
        <div className="max-w-3xl mx-auto">
          {/* Oversized title */}
          <div className="mb-24 relative overflow-hidden">
            <h1 className="text-[12rem] md:text-[16rem] font-extralight text-zinc-900 leading-none tracking-tighter -ml-2">
              {getContent('hero_title', '株式')}
            </h1>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-zinc-900"></div>
            <p className="mt-6 text-zinc-600 text-sm font-light uppercase tracking-widest">
              {getContent('hero_subtitle', 'ミニマリストデータ可視化ツール')}
            </p>
          </div>

          {/* Table-style input */}
          <div className="mb-24">
            <table className="w-full border-2 border-zinc-900">
              <thead>
                <tr className="border-b-2 border-zinc-900">
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-900 uppercase tracking-widest">
                    フィールド
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-zinc-900 uppercase tracking-widest">
                    入力
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-zinc-900 uppercase tracking-widest">
                    状態
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-900">
                  <td className="px-6 py-6 text-sm font-light text-zinc-900">
                    株式コード
                  </td>
                  <td className="px-6 py-6">
                    <input
                      type="text"
                      value={diagnosis.stockCode}
                      onChange={(e) => diagnosis.setStockCode(e.target.value)}
                      placeholder={getContent('input_placeholder', '株式コード')}
                      className="w-full px-0 py-2 border-b border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors bg-transparent font-light text-lg"
                      disabled={diagnosis.loading || diagnosis.analyzing}
                    />
                  </td>
                  <td className="px-6 py-6 text-right">
                    <span className="text-xs text-zinc-400 font-mono uppercase">必須</span>
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-6 py-6">
                    <button
                      onClick={diagnosis.handleDiagnose}
                      disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                      className="w-full py-4 border-2 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all font-light uppercase text-sm tracking-[0.3em]"
                    >
                      {diagnosis.loading || diagnosis.analyzing ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{getContent('analyzing_text', '処理中')}</span>
                        </span>
                      ) : (
                        <span>{getContent('submit_button', '実行')}</span>
                      )}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            <p className="mt-6 text-xs text-zinc-500 font-light leading-relaxed">
              {getContent('disclaimer_text', '本ツールは情報提供のみを目的としています')}
            </p>
          </div>

          {/* Features with geometric dividers */}
          <div className="space-y-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={feature.id}>
                  <div className="grid grid-cols-[auto_1fr_auto] gap-8 items-start">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 border-2 border-zinc-900 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-zinc-900" strokeWidth={1} />
                      </div>
                      <div className="w-px h-12 bg-zinc-300"></div>
                    </div>

                    <div className="pt-2">
                      <h3 className="text-zinc-900 font-light text-2xl mb-3 tracking-tight">
                        {getContent(feature.titleKey, feature.titleDefault)}
                      </h3>
                      <p className="text-zinc-600 text-sm font-light leading-loose">
                        {getContent(feature.descKey, feature.descDefault)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 pt-2">
                      <div className="text-6xl font-extralight text-zinc-200">
                        0{index + 1}
                      </div>
                      <div className="w-16 h-px bg-zinc-900"></div>
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
