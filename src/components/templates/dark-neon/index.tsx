import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { Zap, TrendingUp, Activity, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { DiagnosisLoadingScreen } from '../shared/DiagnosisLoadingScreen';
import { DiagnosisResult } from '../shared/DiagnosisResult';
import { getTemplateTheme } from '../../../types/theme';

export function TemplateDarkNeon({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const theme = getTemplateTheme('dark-neon');

  const features = [
    {
      id: 'electric',
      icon: Zap,
      titleKey: 'feature1_title',
      titleDefault: '電光速度',
      descKey: 'feature1_description',
      descDefault: '超高速データ処理',
      neonColor: 'shadow-[0_0_30px_rgba(16,185,129,0.6)]',
      borderColor: 'border-emerald-500',
      textColor: 'text-emerald-400',
    },
    {
      id: 'pulse',
      icon: Activity,
      titleKey: 'feature2_title',
      titleDefault: 'リアルタイムパルス',
      descKey: 'feature2_description',
      descDefault: 'ライブ市場モニタリング',
      neonColor: 'shadow-[0_0_30px_rgba(236,72,153,0.6)]',
      borderColor: 'border-pink-500',
      textColor: 'text-pink-400',
    },
    {
      id: 'surge',
      icon: TrendingUp,
      titleKey: 'feature3_title',
      titleDefault: '市場サージ',
      descKey: 'feature3_description',
      descDefault: 'トレンド検出システム',
      neonColor: 'shadow-[0_0_30px_rgba(59,130,246,0.6)]',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-400',
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
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col">
      {/* Cyberpunk grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>

      {/* Neon scan lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-px bg-gradient-to-b from-transparent via-emerald-500 to-transparent"
          style={{
            left: `${Math.random() * 100}%`,
            height: `${20 + Math.random() * 60}%`,
            top: `${-10 + Math.random() * 20}%`,
            animationDelay: `${Math.random() * 3}s`,
            animation: 'neon-line 3s ease-in-out infinite',
            opacity: 0.3,
          }}
        />
      ))}

      {/* Angled layout container */}
      <div className="relative flex-1 px-6 py-12 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {/* Title with hexagonal frame */}
          <div className="mb-12 relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 border-4 border-emerald-500 transform rotate-45" style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}></div>
            <div className="relative pl-16">
              <h1 className="text-5xl md:text-6xl font-black text-white mb-3 tracking-wider uppercase transform -skew-x-6" style={{ textShadow: '0 0 30px rgba(16,185,129,0.8), 0 0 60px rgba(16,185,129,0.5)' }}>
                {getContent('hero_title', '株式マトリックス')}
              </h1>
              <p className="text-emerald-400 text-sm tracking-[0.3em] uppercase" style={{ textShadow: '0 0 10px rgba(16,185,129,0.5)' }}>
                {getContent('hero_subtitle', 'サイバー市場分析システム')}
              </p>
            </div>
          </div>

          {/* Angled input section with cyberpunk frame */}
          <div className="mb-12 transform -skew-x-3">
            <div className="border-4 border-emerald-500 relative bg-black/80 backdrop-blur-sm" style={{ boxShadow: '0 0 40px rgba(16,185,129,0.4), inset 0 0 40px rgba(16,185,129,0.1)' }}>
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 -translate-x-1 -translate-y-1"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 translate-x-1 -translate-y-1"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 -translate-x-1 translate-y-1"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 translate-x-1 translate-y-1"></div>

              <div className="p-8 transform skew-x-3">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 bg-emerald-400 animate-pulse" style={{ boxShadow: '0 0 10px rgba(16,185,129,0.8)' }}></div>
                      <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase">Input Required</span>
                    </div>
                    <input
                      type="text"
                      value={diagnosis.stockCode}
                      onChange={(e) => diagnosis.setStockCode(e.target.value)}
                      placeholder={getContent('input_placeholder', '> コード入力_')}
                      className="w-full px-5 py-4 bg-black border-4 border-emerald-500/50 text-emerald-400 placeholder-emerald-700 focus:outline-none focus:border-emerald-400 font-mono uppercase tracking-wider transform transition-all hover:border-emerald-400"
                      style={{ boxShadow: 'inset 0 0 20px rgba(16,185,129,0.2)' }}
                      disabled={diagnosis.loading || diagnosis.analyzing}
                    />
                  </div>

                  <button
                    onClick={diagnosis.handleDiagnose}
                    disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                    className="w-full py-5 bg-black border-4 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black uppercase tracking-[0.3em] text-sm relative overflow-hidden group"
                    style={{ boxShadow: '0 0 30px rgba(16,185,129,0.5)' }}
                  >
                    <span className="relative z-10">
                      {diagnosis.loading || diagnosis.analyzing ? (
                        <span className="flex items-center justify-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>{getContent('analyzing_text', 'スキャン中...')}</span>
                        </span>
                      ) : (
                        <span>{getContent('submit_button', 'スキャン開始')}</span>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-emerald-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                  </button>
                </div>

                <p className="mt-6 text-xs text-emerald-600 text-center font-mono uppercase tracking-wide">
                  {getContent('disclaimer_text', '[情報のみ] [助言なし]')}
                </p>
              </div>
            </div>
          </div>

          {/* Hexagonal features grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className={`border-4 ${feature.borderColor} bg-black/60 backdrop-blur-sm p-6 relative ${feature.neonColor} hover:bg-black/80 transition-all transform hover:-translate-y-2`}
                  style={{
                    clipPath: 'polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%)',
                    animationDelay: `${index * 0.15}s`,
                  }}
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className={`w-16 h-16 border-4 ${feature.borderColor} flex items-center justify-center ${feature.neonColor} transform rotate-45`}>
                      <Icon className={`w-8 h-8 ${feature.textColor} transform -rotate-45`} />
                    </div>
                    <div>
                      <h3 className="text-white font-black uppercase tracking-wide mb-2 text-sm">
                        {getContent(feature.titleKey, feature.titleDefault)}
                      </h3>
                      <p className={`text-xs ${feature.textColor}/80 font-mono`}>
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

      <style>{`
        @keyframes neon-line {
          0%, 100% { opacity: 0.2; transform: translateY(0); }
          50% { opacity: 0.5; transform: translateY(100px); }
        }
      `}</style>
    </div>
  );
}
