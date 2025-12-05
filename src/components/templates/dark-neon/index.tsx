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
      titleDefault: 'Electric Speed',
      descKey: 'feature1_description',
      descDefault: 'Lightning-fast data processing',
      neonColor: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
      borderColor: 'border-emerald-500',
    },
    {
      id: 'pulse',
      icon: Activity,
      titleKey: 'feature2_title',
      titleDefault: 'Real-time Pulse',
      descKey: 'feature2_description',
      descDefault: 'Live market monitoring',
      neonColor: 'shadow-[0_0_20px_rgba(236,72,153,0.5)]',
      borderColor: 'border-pink-500',
    },
    {
      id: 'surge',
      icon: TrendingUp,
      titleKey: 'feature3_title',
      titleDefault: 'Market Surge',
      descKey: 'feature3_description',
      descDefault: 'Trend detection system',
      neonColor: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
      borderColor: 'border-blue-500',
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
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a0a0a_1px,transparent_1px),linear-gradient(to_bottom,#0a0a0a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>

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

      <div className="relative flex-1 px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mb-2 tracking-wider uppercase" style={{ textShadow: '0 0 20px rgba(16,185,129,0.8)' }}>
              {getContent('hero_title', 'Stock Matrix')}
            </h1>
            <p className="text-emerald-400 text-sm tracking-widest" style={{ textShadow: '0 0 10px rgba(16,185,129,0.5)' }}>
              {getContent('hero_subtitle', 'CYBER MARKET ANALYSIS')}
            </p>
          </div>

          <div className="mb-10">
            <div className="border-2 border-emerald-500 rounded-none p-6 relative" style={{ boxShadow: '0 0 30px rgba(16,185,129,0.3), inset 0 0 30px rgba(16,185,129,0.1)' }}>
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400"></div>

              <div className="space-y-5">
                <div>
                  <input
                    type="text"
                    value={diagnosis.stockCode}
                    onChange={(e) => diagnosis.setStockCode(e.target.value)}
                    placeholder={getContent('input_placeholder', '> ENTER CODE_')}
                    className="w-full px-4 py-3 bg-black border-2 border-emerald-500/50 text-emerald-400 placeholder-emerald-700 focus:outline-none focus:border-emerald-400 font-mono uppercase tracking-wider"
                    style={{ boxShadow: 'inset 0 0 10px rgba(16,185,129,0.2)' }}
                    disabled={diagnosis.loading || diagnosis.analyzing}
                  />
                </div>

                <button
                  onClick={diagnosis.handleDiagnose}
                  disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                  className="w-full py-4 bg-black border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all font-bold uppercase tracking-widest"
                  style={{ boxShadow: '0 0 20px rgba(16,185,129,0.5)' }}
                >
                  {diagnosis.loading || diagnosis.analyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{getContent('analyzing_text', 'SCANNING...')}</span>
                    </span>
                  ) : (
                    <span>{getContent('submit_button', 'INITIATE SCAN')}</span>
                  )}
                </button>
              </div>

              <p className="mt-4 text-xs text-emerald-600 text-center font-mono">
                {getContent('disclaimer_text', '[INFO ONLY] [NO ADVICE]')}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className={`border-2 ${feature.borderColor} bg-black/50 p-5 relative ${feature.neonColor} hover:bg-black/80 transition-all`}
                  style={{
                    animationDelay: `${index * 0.15}s`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 border-2 ${feature.borderColor} flex items-center justify-center ${feature.neonColor}`}>
                      <Icon className={`w-6 h-6 ${feature.borderColor.replace('border-', 'text-')}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold uppercase tracking-wide mb-1">
                        {getContent(feature.titleKey, feature.titleDefault)}
                      </h3>
                      <p className={`text-sm ${feature.borderColor.replace('border-', 'text-')}/80`}>
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
    </div>
  );
}
