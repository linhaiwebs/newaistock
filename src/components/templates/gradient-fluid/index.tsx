import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { Sparkles, TrendingUp, Waves, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { DiagnosisLoadingScreen } from '../shared/DiagnosisLoadingScreen';
import { DiagnosisResult } from '../shared/DiagnosisResult';
import { getTemplateTheme } from '../../../types/theme';

export function TemplateGradientFluid({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const theme = getTemplateTheme('gradient-fluid');

  const features = [
    {
      id: 'smooth',
      icon: Waves,
      titleKey: 'feature1_title',
      titleDefault: 'スムーズフロー',
      descKey: 'feature1_description',
      descDefault: 'シームレスなデータストリーミング',
      gradient: 'from-purple-400 via-pink-400 to-purple-500',
      angle: 15,
    },
    {
      id: 'dynamic',
      icon: TrendingUp,
      titleKey: 'feature2_title',
      titleDefault: '動的インサイト',
      descKey: 'feature2_description',
      descDefault: '適応的可視化システム',
      gradient: 'from-fuchsia-400 via-purple-400 to-pink-400',
      angle: -10,
    },
    {
      id: 'elegant',
      icon: Sparkles,
      titleKey: 'feature3_title',
      titleDefault: '優雅なデザイン',
      descKey: 'feature3_description',
      descDefault: '美しいユーザー体験',
      gradient: 'from-pink-400 via-fuchsia-400 to-violet-400',
      angle: 8,
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-fuchsia-50 relative overflow-hidden flex flex-col">
      {/* Liquid blobs background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Wave-like layout with parallax effect */}
      <div className="relative flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Title with wave effect */}
          <div className="text-center mb-12 transform hover:scale-105 transition-transform duration-500">
            <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-4">
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 bg-clip-text text-transparent transform hover:skew-y-2 transition-transform">
                {getContent('hero_title', 'AI株式')}
              </span>
              <span className="block bg-gradient-to-r from-fuchsia-600 via-purple-600 to-pink-600 bg-clip-text text-transparent transform hover:-skew-y-2 transition-transform">
                フロー
              </span>
            </h1>
            <p className="text-purple-700 text-sm">
              {getContent('hero_subtitle', '流れるようなデータ可視化体験')}
            </p>
          </div>

          {/* Circular input container */}
          <div className="mb-16 relative mx-auto max-w-md">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 via-pink-400 to-fuchsia-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
            <div className="relative bg-white/90 backdrop-blur-xl rounded-full p-8 shadow-2xl">
              <div className="space-y-5">
                <input
                  type="text"
                  value={diagnosis.stockCode}
                  onChange={(e) => diagnosis.setStockCode(e.target.value)}
                  placeholder={getContent('input_placeholder', '株式コードを入力')}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full text-purple-900 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-center font-semibold"
                  disabled={diagnosis.loading || diagnosis.analyzing}
                />

                <button
                  onClick={diagnosis.handleDiagnose}
                  disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                  className="relative w-full py-4 rounded-full font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 group-hover:scale-105 transition-transform"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {diagnosis.loading || diagnosis.analyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{getContent('analyzing_text', '分析中...')}</span>
                      </>
                    ) : (
                      <span>{getContent('submit_button', '診断開始')}</span>
                    )}
                  </span>
                </button>
              </div>

              <p className="mt-5 text-xs text-purple-600 text-center">
                {getContent('disclaimer_text', '本ツールは情報提供のみを目的としています')}
              </p>
            </div>
          </div>

          {/* Features in radial layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="group relative"
                  style={{
                    transform: `rotate(${feature.angle}deg)`,
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'rotate(0deg) scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = `rotate(${feature.angle}deg)`;
                  }}
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-3xl blur opacity-30 group-hover:opacity-50 transition-opacity`}></div>
                  <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl p-6 hover:bg-white/90 transition-all text-center">
                    <div className={`inline-flex w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-full items-center justify-center shadow-lg mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-purple-900 font-bold text-base mb-2">
                      {getContent(feature.titleKey, feature.titleDefault)}
                    </h3>
                    <p className="text-purple-700 text-xs">
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
