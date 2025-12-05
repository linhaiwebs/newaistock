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
      titleDefault: 'Neural Analysis',
      descKey: 'feature1_description',
      descDefault: 'AI-powered market data processing',
    },
    {
      id: 'quantum',
      icon: TrendingUp,
      titleKey: 'feature2_title',
      titleDefault: 'Quantum Speed',
      descKey: 'feature2_description',
      descDefault: 'Real-time data visualization',
    },
    {
      id: 'matrix',
      icon: BarChart3,
      titleKey: 'feature3_title',
      titleDefault: 'Data Matrix',
      descKey: 'feature3_description',
      descDefault: 'Multi-dimensional analysis',
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
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900/20 via-slate-950 to-slate-950"></div>

      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute top-20 left-10 w-32 h-32 border-2 border-cyan-500/30 transform rotate-45 rounded-lg"></div>
      <div className="absolute bottom-40 right-20 w-24 h-24 border-2 border-sky-500/30 transform -rotate-12 rounded-lg"></div>

      <div className="relative flex-1 px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50"></div>
                <h1 className="relative text-3xl font-bold text-white tracking-tight">
                  {getContent('hero_title', 'AI Stock Analysis')}
                </h1>
              </div>
            </div>
            <p className="text-cyan-200/80 text-sm">
              {getContent('hero_subtitle', 'Next-generation market data visualization')}
            </p>
          </div>

          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-sky-500/20 blur-xl"></div>
            <div className="relative bg-slate-900/50 backdrop-blur-sm border border-cyan-500/30 rounded-2xl p-6 shadow-2xl">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="text"
                    value={diagnosis.stockCode}
                    onChange={(e) => diagnosis.setStockCode(e.target.value)}
                    placeholder={getContent('input_placeholder', 'Enter stock code')}
                    className="w-full px-6 py-4 bg-slate-950/80 border border-cyan-500/50 rounded-xl text-white placeholder-cyan-300/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/50 transition-all"
                    disabled={diagnosis.loading || diagnosis.analyzing}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>

                <button
                  onClick={diagnosis.handleDiagnose}
                  disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                  className="relative group w-full py-4 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-sky-500 group-hover:from-cyan-400 group-hover:to-sky-400 transition-all"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-400 opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {diagnosis.loading || diagnosis.analyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{getContent('analyzing_text', 'Analyzing...')}</span>
                      </>
                    ) : (
                      <span>{getContent('submit_button', 'Start Analysis')}</span>
                    )}
                  </span>
                </button>
              </div>

              <p className="mt-4 text-xs text-cyan-300/60 text-center">
                {getContent('disclaimer_text', 'Information tool only. Not investment advice.')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="group relative"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-sky-500/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-slate-900/40 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-5 hover:border-cyan-400/50 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <div className="absolute inset-0 bg-cyan-500/30 blur-md"></div>
                        <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-500 to-sky-600 rounded-lg flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">
                          {getContent(feature.titleKey, feature.titleDefault)}
                        </h3>
                        <p className="text-cyan-200/70 text-sm">
                          {getContent(feature.descKey, feature.descDefault)}
                        </p>
                      </div>
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
