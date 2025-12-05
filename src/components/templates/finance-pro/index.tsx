import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { TrendingUp, BarChart3, DollarSign, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { DiagnosisLoadingScreen } from '../shared/DiagnosisLoadingScreen';
import { DiagnosisResult } from '../shared/DiagnosisResult';
import { getTemplateTheme } from '../../../types/theme';

export function TemplateFinancePro({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const theme = getTemplateTheme('finance-pro');

  const features = [
    {
      id: 'market',
      icon: TrendingUp,
      titleKey: 'feature1_title',
      titleDefault: 'マーケットインテリジェンス',
      descKey: 'feature1_description',
      descDefault: 'プロ品質の市場データ',
      color: 'from-blue-600 to-blue-800',
    },
    {
      id: 'analytics',
      icon: BarChart3,
      titleKey: 'feature2_title',
      titleDefault: '深層分析',
      descKey: 'feature2_description',
      descDefault: '包括的な財務分析',
      color: 'from-blue-700 to-slate-800',
    },
    {
      id: 'valuation',
      icon: DollarSign,
      titleKey: 'feature3_title',
      titleDefault: '評価モデル',
      descKey: 'feature3_description',
      descDefault: '高度な価格算定アルゴリズム',
      color: 'from-slate-700 to-slate-900',
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
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Terminal-style header with ticker */}
      <div className="bg-black border-b border-emerald-500/30 py-2 px-4 font-mono text-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">NIKKEI</span>
              <span className="text-white">▲ 33,456</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">TOPIX</span>
              <span className="text-white">▲ 2,456</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">USD/JPY</span>
              <span className="text-white">148.50</span>
            </div>
          </div>
          <div className="text-emerald-400/60">TERMINAL v2.0</div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left sidebar - navigation */}
        <div className="hidden lg:block w-20 bg-slate-950 border-r border-slate-700">
          <div className="flex flex-col items-center gap-6 py-8">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-black">
              F
            </div>
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                  {i}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content - 3 column layout */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Center column - main input */}
          <div className="flex-1 p-6 lg:p-8">
            <div className="max-w-xl mx-auto">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 text-xs font-mono">SYSTEM ACTIVE</span>
                </div>

                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  {getContent('hero_title', 'プロフェッショナル株式分析')}
                </h1>
                <p className="text-slate-400 text-sm font-mono">
                  {getContent('hero_subtitle', '金融市場データ可視化ツール')}
                </p>
              </div>

              {/* Terminal-style input box */}
              <div className="mb-8 bg-slate-950 border border-emerald-500/30 rounded-lg overflow-hidden shadow-xl">
                <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-emerald-500/30">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <span className="text-xs text-emerald-400 font-mono">stock_analyzer.sh</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">bash</span>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <div className="text-emerald-400 text-sm font-mono mb-2">
                      $ ./analyze --code
                    </div>
                    <input
                      type="text"
                      value={diagnosis.stockCode}
                      onChange={(e) => diagnosis.setStockCode(e.target.value)}
                      placeholder={getContent('input_placeholder', '株式コードを入力')}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-emerald-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono tracking-wide"
                      disabled={diagnosis.loading || diagnosis.analyzing}
                    />
                  </div>

                  <button
                    onClick={diagnosis.handleDiagnose}
                    disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20"
                  >
                    {diagnosis.loading || diagnosis.analyzing ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{getContent('analyzing_text', '実行中...')}</span>
                      </span>
                    ) : (
                      <span>{getContent('submit_button', '分析実行')}</span>
                    )}
                  </button>

                  <p className="text-xs text-slate-500 font-mono text-center">
                    {getContent('disclaimer_text', '本ツールは情報提供のみを目的としています')}
                  </p>
                </div>
              </div>

              {/* Features in table format */}
              <div className="space-y-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.id}
                      className="bg-slate-900/50 border border-slate-700 hover:border-emerald-500/50 transition-colors p-4 flex items-center gap-4"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded flex items-center justify-center">
                        <Icon className="w-5 h-5 text-black" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-emerald-400 font-semibold text-sm mb-1">
                          {getContent(feature.titleKey, feature.titleDefault)}
                        </h3>
                        <p className="text-slate-400 text-xs font-mono">
                          {getContent(feature.descKey, feature.descDefault)}
                        </p>
                      </div>
                      <div className="text-emerald-500/50 text-xs font-mono">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right sidebar - info panel */}
          <div className="hidden xl:block w-64 bg-slate-950 border-l border-slate-700 p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-emerald-400 text-xs font-mono mb-3 uppercase">System Status</h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">CPU</span>
                    <span className="text-white">24%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Memory</span>
                    <span className="text-white">1.2GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Latency</span>
                    <span className="text-emerald-400">12ms</span>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-700"></div>

              <div>
                <h3 className="text-emerald-400 text-xs font-mono mb-3 uppercase">Market Hours</h3>
                <div className="text-xs text-slate-400 font-mono space-y-1">
                  <div>Tokyo: CLOSED</div>
                  <div>London: OPEN</div>
                  <div>NY: OPEN</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
