import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { BarChart3, Loader2, ArrowRight, ArrowLeft, Waves, Mountain, Fan } from 'lucide-react';

export function TemplateProfessional({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();

  if (diagnosis.showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-indigo-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-900/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <path d="M100,20 Q150,50 100,80 Q50,50 100,20" fill="#e11d48" opacity="0.3"/>
            <path d="M100,40 Q150,70 100,100 Q50,70 100,40" fill="#e11d48" opacity="0.2"/>
            <path d="M100,60 Q150,90 100,120 Q50,90 100,60" fill="#e11d48" opacity="0.1"/>
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={diagnosis.resetDiagnosis}
            className="flex items-center gap-2 text-indigo-700 hover:text-indigo-900 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">戻る</span>
          </button>

          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg">
                <Fan className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-indigo-900">
                  {getContent('result_title', '診断結果')}
                </h2>
                <div className="flex gap-1 mt-2">
                  <div className="w-8 h-1 bg-rose-400"></div>
                  <div className="w-4 h-1 bg-pink-400"></div>
                  <div className="w-2 h-1 bg-indigo-400"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 mb-8 shadow-xl border-2 border-rose-200/50 relative">
            <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
              <Mountain className="w-full h-full text-indigo-900" />
            </div>
            <div className="relative text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">
              {diagnosis.result}
            </div>
          </div>

          {diagnosis.redirectUrl && (
            <button
              onClick={diagnosis.handleConversion}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <span className="relative font-semibold text-lg">{getContent('result_button_text', 'もっと見る')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (diagnosis.analyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-900/10 to-transparent"></div>

        <div className="absolute top-20 right-20 w-32 h-32 opacity-10 animate-pulse">
          <Waves className="w-full h-full text-indigo-600" />
        </div>

        <div className="relative max-w-xl mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 mb-6 shadow-2xl animate-pulse">
              <Fan className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-indigo-900 mb-2">
              {getContent('analyzing_title', '分析中...')}
            </h2>
            <p className="text-indigo-700">
              {getContent('analyzing_description', 'しばらくお待ちください')}
            </p>
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-rose-400 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>

          {diagnosis.result && (
            <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 text-left shadow-xl border-2 border-rose-200/50">
              <div className="text-gray-800 whitespace-pre-wrap text-base leading-relaxed">
                {diagnosis.result}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-indigo-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-900/10 to-transparent"></div>

      <div className="absolute top-20 right-20 w-64 h-64 opacity-5">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="80" fill="none" stroke="#e11d48" strokeWidth="1"/>
          <circle cx="100" cy="100" r="60" fill="none" stroke="#ec4899" strokeWidth="1"/>
          <circle cx="100" cy="100" r="40" fill="none" stroke="#6366f1" strokeWidth="1"/>
        </svg>
      </div>

      <div className="absolute bottom-20 left-20 w-48 h-48 opacity-5">
        <Mountain className="w-full h-full text-indigo-900" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 mb-8 shadow-2xl relative group">
            <Fan className="w-12 h-12 text-white group-hover:rotate-180 transition-transform duration-700" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 blur-xl opacity-50"></div>
          </div>
          <h1 className="text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-900 via-rose-700 to-pink-600 bg-clip-text text-transparent">
              {getContent('hero_title', '和風投資診断')}
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-16 h-1 bg-rose-400"></div>
            <div className="w-8 h-1 bg-pink-400"></div>
            <div className="w-4 h-1 bg-indigo-400"></div>
          </div>
          <p className="text-2xl text-indigo-800 mb-3 font-medium">
            {getContent('hero_subtitle', '伝統と革新が織りなす投資分析')}
          </p>
          <p className="text-lg text-indigo-600">
            {getContent('hero_description', '日本の美意識で市場を読む')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl p-8 border-2 border-rose-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <Waves className="w-full h-full text-indigo-600" />
            </div>
            <label className="block text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2 relative">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
                <BarChart3 className="w-3 h-3 text-white" />
              </div>
              銘柄コード
            </label>
            <input
              type="text"
              value={diagnosis.stockCode}
              onChange={(e) => diagnosis.setStockCode(e.target.value)}
              placeholder="例: 1031"
              className="w-full px-6 py-4 text-lg border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all bg-white/70 text-gray-900 relative"
              disabled={diagnosis.loading || diagnosis.analyzing}
            />

            <button
              onClick={diagnosis.handleDiagnose}
              disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
              className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white py-4 px-8 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group relative overflow-hidden"
            >
              {diagnosis.loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>読み込み中...</span>
                </>
              ) : (
                <>
                  <Fan className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  <span>{getContent('hero_button_text', '診断を始める')}</span>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border-2 border-rose-200/30 hover:border-rose-300/50 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="#e11d48"/>
              </svg>
            </div>
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 mb-4 group-hover:scale-110 transition-transform shadow-lg relative">
              <Mountain className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-indigo-900 mb-2 relative">
              {getContent('feature_1_title', '富士の如く')}
            </h3>
            <p className="text-indigo-700 leading-relaxed relative">
              {getContent('feature_1_description', '不動の分析で、確かな投資判断をサポートします')}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border-2 border-pink-200/30 hover:border-pink-300/50 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
              <Waves className="w-full h-full text-pink-600" />
            </div>
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 mb-4 group-hover:scale-110 transition-transform shadow-lg relative">
              <Waves className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-indigo-900 mb-2 relative">
              {getContent('feature_2_title', '波の如く')}
            </h3>
            <p className="text-indigo-700 leading-relaxed relative">
              {getContent('feature_2_description', '市場の流れを読み、柔軟に対応します')}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border-2 border-indigo-200/30 hover:border-indigo-300/50 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
              <Fan className="w-full h-full text-indigo-600" />
            </div>
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 mb-4 group-hover:scale-110 transition-transform shadow-lg relative">
              <Fan className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-indigo-900 mb-2 relative">
              {getContent('feature_3_title', '扇の如く')}
            </h3>
            <p className="text-indigo-700 leading-relaxed relative">
              {getContent('feature_3_description', '広い視野で、多角的に分析します')}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-16 text-center pb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-1 bg-rose-400"></div>
          <div className="w-4 h-1 bg-pink-400"></div>
          <div className="w-2 h-1 bg-indigo-400"></div>
        </div>
        <p className="text-sm text-indigo-600">{getContent('footer_text', '和の心で紡ぐ投資の未来')}</p>
      </div>
    </div>
  );
}
