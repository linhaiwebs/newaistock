import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { Cloud, TrendingUp, Droplets, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { DiagnosisLoadingScreen } from '../shared/DiagnosisLoadingScreen';
import { DiagnosisResult } from '../shared/DiagnosisResult';
import { getTemplateTheme } from '../../../types/theme';

export function TemplateGlassMorph({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const theme = getTemplateTheme('glass-morph');

  const features = [
    {
      id: 'transparent',
      icon: Cloud,
      titleKey: 'feature1_title',
      titleDefault: 'クリスタルクリア',
      descKey: 'feature1_description',
      descDefault: '透明なデータ可視化',
      layer: 'z-30',
      offset: '-top-4 -left-4',
    },
    {
      id: 'fluid',
      icon: Droplets,
      titleKey: 'feature2_title',
      titleDefault: '流動的インターフェース',
      descKey: 'feature2_description',
      descDefault: 'スムーズなユーザー体験',
      layer: 'z-20',
      offset: 'top-0 left-0',
    },
    {
      id: 'modern',
      icon: TrendingUp,
      titleKey: 'feature3_title',
      titleDefault: 'モダンデザイン',
      descKey: 'feature3_description',
      descDefault: '現代的な美学',
      layer: 'z-10',
      offset: 'top-4 left-4',
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
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 relative overflow-hidden flex flex-col">
      {/* Floating color blobs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      {/* Layered glass cards layout */}
      <div className="relative flex-1 px-6 py-12 flex items-center justify-center">
        <div className="w-full max-w-2xl relative">
          {/* Title layer */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/40 rounded-3xl p-8 mb-8 shadow-2xl transform hover:scale-105 transition-transform">
            <h1 className="text-5xl font-light text-blue-900 mb-3 text-center">
              {getContent('hero_title', 'クリスタル株式分析')}
            </h1>
            <p className="text-blue-600 text-sm text-center">
              {getContent('hero_subtitle', '透明なデータ可視化ツール')}
            </p>
          </div>

          {/* Main input layer - prominent */}
          <div className="backdrop-blur-2xl bg-white/30 border border-white/50 rounded-3xl p-10 mb-8 shadow-2xl relative z-20">
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  value={diagnosis.stockCode}
                  onChange={(e) => diagnosis.setStockCode(e.target.value)}
                  placeholder={getContent('input_placeholder', '株式コードを入力')}
                  className="w-full px-6 py-4 backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl text-blue-900 text-lg placeholder-blue-400/60 focus:outline-none focus:bg-white/50 focus:border-blue-300 transition-all shadow-inner"
                  disabled={diagnosis.loading || diagnosis.analyzing}
                />
              </div>

              <button
                onClick={diagnosis.handleDiagnose}
                disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                className="w-full py-4 backdrop-blur-md bg-blue-500/80 hover:bg-blue-600/80 border border-white/40 rounded-2xl text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {diagnosis.loading || diagnosis.analyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{getContent('analyzing_text', '分析中...')}</span>
                  </span>
                ) : (
                  <span>{getContent('submit_button', '株式分析')}</span>
                )}
              </button>
            </div>

            <p className="mt-6 text-xs text-blue-700 text-center">
              {getContent('disclaimer_text', '本ツールは情報提供のみを目的としています')}
            </p>
          </div>

          {/* Overlapping feature cards */}
          <div className="relative">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className={`absolute ${feature.offset} ${feature.layer} w-full`}
                  style={{
                    transform: `translateY(${index * 120}px)`,
                  }}
                >
                  <div className="backdrop-blur-lg bg-white/25 border border-white/40 rounded-2xl p-6 shadow-lg hover:bg-white/35 hover:scale-105 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-14 h-14 backdrop-blur-md bg-white/40 border border-white/50 rounded-2xl flex items-center justify-center shadow-inner">
                        <Icon className="w-7 h-7 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-blue-900 font-medium text-lg mb-1">
                          {getContent(feature.titleKey, feature.titleDefault)}
                        </h3>
                        <p className="text-blue-700 text-sm">
                          {getContent(feature.descKey, feature.descDefault)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Spacer for overlapping cards */}
          <div style={{ height: `${features.length * 120 + 80}px` }}></div>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
