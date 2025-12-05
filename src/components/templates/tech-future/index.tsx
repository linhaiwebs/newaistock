import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { TrendingUp, BarChart3, Activity, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { DiagnosisLoadingScreen } from '../shared/DiagnosisLoadingScreen';
import { DiagnosisResult } from '../shared/DiagnosisResult';
import { getTemplateTheme } from '../../../types/theme';

export function TemplateTechFuture({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const theme = getTemplateTheme('tech-future');

  const features = [
    {
      id: 'neural',
      icon: Activity,
      titleKey: 'feature1_title',
      titleDefault: 'ニューラル分析',
      descKey: 'feature1_description',
      descDefault: 'AI駆動の市場データ処理',
    },
    {
      id: 'quantum',
      icon: TrendingUp,
      titleKey: 'feature2_title',
      titleDefault: '量子速度処理',
      descKey: 'feature2_description',
      descDefault: 'リアルタイムデータ可視化',
    },
    {
      id: 'matrix',
      icon: BarChart3,
      titleKey: 'feature3_title',
      titleDefault: 'データマトリックス',
      descKey: 'feature3_description',
      descDefault: '多次元分析システム',
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
    <div className="min-h-screen bg-black flex flex-col lg:flex-row overflow-hidden">
      {/* Left side - Data visualization animation */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 relative overflow-hidden items-center justify-center">
        {/* Matrix rain effect */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 w-px h-full"
              style={{
                left: `${i * 5}%`,
                background: 'linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.5), transparent)',
                animation: `slide ${3 + Math.random() * 2}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Floating grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] [perspective:1000px] [transform:rotateX(60deg)_scale(2)] opacity-30"></div>

        {/* Central glow */}
        <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>

        {/* Scanning lines */}
        <div className="absolute inset-0 flex flex-col justify-around opacity-30">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              style={{
                animation: `pulse ${2 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* 3D rotating text */}
        <div className="relative z-10 text-center">
          <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 [text-shadow:0_0_30px_rgba(6,182,212,0.5)]">
            AI 株式
          </h2>
          <div className="text-cyan-400 text-sm font-mono tracking-[0.3em] opacity-70">
            NEXT GENERATION ANALYSIS
          </div>
        </div>
      </div>

      {/* Right side - Input and features */}
      <div className="flex-1 flex flex-col bg-black">
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Title section */}
            <div className="mb-10 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                <div className="text-cyan-400 text-xs font-mono tracking-widest">SYSTEM READY</div>
              </div>

              <h1 className="text-4xl font-bold text-white leading-tight">
                {getContent('hero_title', 'AI株式市場分析')}
              </h1>
              <p className="text-cyan-400/70 text-sm leading-relaxed">
                {getContent('hero_subtitle', '次世代テクノロジーによる市場可視化')}
              </p>
            </div>

            {/* Input section with terminal style */}
            <div className="mb-10 bg-slate-950 border border-cyan-500/30 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]">
              <div className="bg-slate-900/50 px-4 py-2 flex items-center gap-2 border-b border-cyan-500/30">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <div className="ml-2 text-xs text-cyan-400/60 font-mono">terminal.exe</div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <div className="text-cyan-400 text-xs font-mono">$ analyze --stock</div>
                  <input
                    type="text"
                    value={diagnosis.stockCode}
                    onChange={(e) => diagnosis.setStockCode(e.target.value)}
                    placeholder={getContent('input_placeholder', '株式コードを入力_')}
                    className="w-full px-4 py-3 bg-black/50 border border-cyan-500/50 text-white placeholder-cyan-500/30 focus:outline-none focus:border-cyan-400 font-mono text-lg tracking-wider"
                    disabled={diagnosis.loading || diagnosis.analyzing}
                  />
                </div>

                <button
                  onClick={diagnosis.handleDiagnose}
                  disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                >
                  {diagnosis.loading || diagnosis.analyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{getContent('analyzing_text', '分析中...')}</span>
                    </span>
                  ) : (
                    <span>{getContent('submit_button', '診断開始')}</span>
                  )}
                </button>

                <p className="text-xs text-cyan-500/50 font-mono text-center">
                  {getContent('disclaimer_text', '本ツールは情報提供のみを目的としています')}
                </p>
              </div>
            </div>

            {/* Features as timeline */}
            <div className="relative space-y-6">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500 via-cyan-500/50 to-transparent"></div>

              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.id} className="relative pl-16 group">
                    <div className="absolute left-0 w-12 h-12 bg-slate-950 border-2 border-cyan-500 rounded-full flex items-center justify-center group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>

                    <div className="bg-slate-950/50 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-400/50 transition-all">
                      <h3 className="text-white font-semibold mb-1 text-sm">
                        {getContent(feature.titleKey, feature.titleDefault)}
                      </h3>
                      <p className="text-cyan-400/70 text-xs">
                        {getContent(feature.descKey, feature.descDefault)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Footer />
      </div>

      <style>{`
        @keyframes slide {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
}
