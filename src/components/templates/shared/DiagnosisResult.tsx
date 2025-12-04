import { ArrowLeft, ArrowRight, TrendingUp } from 'lucide-react';
import { DecorativeBackground } from './DecorativeBackground';

interface DiagnosisResultProps {
  stockName: string | null;
  stockCode: string;
  result: string;
  redirectUrl: string | null;
  onBack: () => void;
  onConversion: () => void;
  themeColor: string;
}

export function DiagnosisResult({
  stockName,
  stockCode,
  result,
  redirectUrl,
  onBack,
  onConversion,
  themeColor,
}: DiagnosisResultProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <DecorativeBackground color={themeColor} opacity={0.1} />

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors mb-4 group animate-fade-in"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-normal">戻る</span>
        </button>

        <div className="mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="p-3 rounded-xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}CC 100%)`,
              }}
            >
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-light text-gray-900">
                {stockName || 'AI診断結果'}
              </h2>
              {stockCode && (
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${themeColor}20`,
                      color: themeColor,
                    }}
                  >
                    {stockCode}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        <div
          className="bg-white/80 backdrop-blur-sm border rounded-2xl p-8 mb-4 shadow-xl animate-slide-up relative overflow-hidden"
          style={{
            animationDelay: '0.2s',
            borderColor: `${themeColor}30`,
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: `linear-gradient(90deg, ${themeColor} 0%, ${themeColor}80 100%)`,
            }}
          />

          <div className="text-gray-900 whitespace-pre-wrap leading-loose text-base">
            {result}
          </div>

          <div
            className="absolute bottom-0 right-0 w-32 h-32 opacity-5 pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${themeColor} 0%, transparent 70%)`,
            }}
          />
        </div>

        {redirectUrl && (
          <button
            onClick={onConversion}
            className="w-full group relative overflow-hidden py-4 px-10 rounded-full transition-all duration-300 flex items-center justify-center gap-3 font-normal shadow-lg hover:shadow-2xl text-base animate-fade-in transform hover:scale-105"
            style={{
              animationDelay: '0.3s',
              backgroundColor: themeColor,
              color: 'white',
            }}
          >
            <span className="relative z-10">詳細を見る</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />

            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)',
                animation: 'shimmer 2s infinite',
              }}
            />
          </button>
        )}
      </div>
    </div>
  );
}
