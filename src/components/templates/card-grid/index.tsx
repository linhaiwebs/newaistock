import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { TrendingUp, BarChart3, PieChart, LineChart, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { DiagnosisLoadingScreen } from '../shared/DiagnosisLoadingScreen';
import { DiagnosisResult } from '../shared/DiagnosisResult';
import { getTemplateTheme } from '../../../types/theme';

export function TemplateCardGrid({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const theme = getTemplateTheme('card-grid');

  const features = [
    {
      id: 'trend',
      icon: TrendingUp,
      titleKey: 'feature1_title',
      titleDefault: 'トレンド追跡',
      descKey: 'feature1_description',
      descDefault: '市場トレンドをモニタリング',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      size: 'large',
    },
    {
      id: 'data',
      icon: BarChart3,
      titleKey: 'feature2_title',
      titleDefault: 'データ分析',
      descKey: 'feature2_description',
      descDefault: '包括的な分析',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      size: 'medium',
    },
    {
      id: 'charts',
      icon: PieChart,
      titleKey: 'feature3_title',
      titleDefault: 'ビジュアルチャート',
      descKey: 'feature3_description',
      descDefault: 'インタラクティブな可視化',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
      size: 'medium',
    },
    {
      id: 'reports',
      icon: LineChart,
      titleKey: 'feature4_title',
      titleDefault: 'スマートレポート',
      descKey: 'feature4_description',
      descDefault: '詳細なインサイト',
      bgColor: 'bg-rose-100',
      iconColor: 'text-rose-600',
      size: 'small',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col p-6">
      {/* Masonry/Pinterest-style grid layout */}
      <div className="flex-1 max-w-4xl mx-auto w-full">
        {/* Title card - one of many cards */}
        <div className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 shadow-xl text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            {getContent('hero_title', '株式ダッシュボード')}
          </h1>
          <p className="text-blue-100 text-sm">
            {getContent('hero_subtitle', 'あなたの市場データワークスペース')}
          </p>
        </div>

        {/* Main input card - featured */}
        <div className="mb-4 bg-white rounded-2xl p-6 shadow-xl border-4 border-blue-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                分析開始
              </label>
              <input
                type="text"
                value={diagnosis.stockCode}
                onChange={(e) => diagnosis.setStockCode(e.target.value)}
                placeholder={getContent('input_placeholder', 'コード入力')}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors font-semibold"
                disabled={diagnosis.loading || diagnosis.analyzing}
              />
            </div>

            <button
              onClick={diagnosis.handleDiagnose}
              disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-2xl"
            >
              {diagnosis.loading || diagnosis.analyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{getContent('analyzing_text', '分析中...')}</span>
                </span>
              ) : (
                <span>{getContent('submit_button', '分析')}</span>
              )}
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-500 text-center">
            {getContent('disclaimer_text', '本ツールは情報提供のみを目的としています')}
          </p>
        </div>

        {/* Masonry grid of feature cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const cardHeight = feature.size === 'large' ? 'row-span-2' : feature.size === 'medium' ? 'row-span-1' : 'row-span-1';
            return (
              <div
                key={feature.id}
                className={`${feature.bgColor} rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer ${cardHeight} ${index === 0 ? 'md:col-span-2' : ''}`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="flex flex-col items-center text-center gap-3 h-full justify-center">
                  <div className={`w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-md`}>
                    <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-bold text-sm mb-1">
                      {getContent(feature.titleKey, feature.titleDefault)}
                    </h3>
                    <p className="text-gray-700 text-xs">
                      {getContent(feature.descKey, feature.descDefault)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional info cards */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-blue-600">24/7</div>
            <div className="text-xs text-gray-600 mt-1">常時稼働</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-emerald-600">AI</div>
            <div className="text-xs text-gray-600 mt-1">AI分析</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <div className="text-2xl font-bold text-amber-600">速い</div>
            <div className="text-xs text-gray-600 mt-1">高速処理</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
