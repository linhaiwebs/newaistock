import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { Leaf, Loader2, ArrowRight, ArrowLeft, Sun, Trees, Sprout } from 'lucide-react';

export function TemplateMinimal({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();

  if (diagnosis.showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl"></div>

        <div className="relative max-w-3xl mx-auto px-4 py-16">
          <div className="mb-8">
            <button
              onClick={diagnosis.resetDiagnosis}
              className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">戻る</span>
            </button>
            <div className="flex items-center gap-3 mb-4">
              <Leaf className="w-8 h-8 text-emerald-600" />
              <h2 className="text-4xl font-bold text-emerald-900">
                {getContent('result_title', '分析結果')}
              </h2>
            </div>
            <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-xl border border-emerald-100">
            <div className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">
              {diagnosis.result}
            </div>
          </div>

          {diagnosis.redirectUrl && (
            <button
              onClick={diagnosis.handleConversion}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group"
            >
              <span className="font-semibold text-lg">{getContent('result_button_text', 'さらに詳しく')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (diagnosis.analyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative max-w-xl mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-6 shadow-lg animate-pulse">
              <Sprout className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-emerald-900 mb-2">
              {getContent('analyzing_title', '分析中...')}
            </h2>
            <p className="text-emerald-700">
              {getContent('analyzing_description', 'データを丁寧に分析しています')}
            </p>
          </div>

          {diagnosis.result && (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 text-left shadow-xl border border-emerald-100">
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mb-8 shadow-2xl animate-float">
            <Trees className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              {getContent('hero_title', '自然派投資分析')}
            </span>
          </h1>
          <p className="text-2xl text-emerald-800 mb-3 font-medium">
            {getContent('hero_subtitle', '心穏やかに、確かな投資を')}
          </p>
          <p className="text-lg text-emerald-600">
            {getContent('hero_description', '自然のリズムで市場を読み解く')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-emerald-100">
            <label className="block text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              銘柄コード
            </label>
            <input
              type="text"
              value={diagnosis.stockCode}
              onChange={(e) => diagnosis.setStockCode(e.target.value)}
              placeholder="例: 1031"
              className="w-full px-6 py-4 text-lg border-2 border-emerald-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 outline-none transition-all bg-white/70 text-gray-800 placeholder-emerald-400"
              disabled={diagnosis.loading || diagnosis.analyzing}
            />

            <button
              onClick={diagnosis.handleDiagnose}
              disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
              className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 px-8 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
            >
              {diagnosis.loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>読み込み中...</span>
                </>
              ) : (
                <>
                  <Sprout className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>{getContent('hero_button_text', '分析を始める')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Sun className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 mb-2">
              {getContent('feature_1_title', '明るい未来を見通す')}
            </h3>
            <p className="text-emerald-700 leading-relaxed">
              {getContent('feature_1_description', '太陽のように明るく確かな分析で、投資の未来を照らします')}
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Trees className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 mb-2">
              {getContent('feature_2_title', '着実な成長をサポート')}
            </h3>
            <p className="text-emerald-700 leading-relaxed">
              {getContent('feature_2_description', '木々のように、じっくりと確実に資産を育てます')}
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 mb-2">
              {getContent('feature_3_title', '自然のリズムで')}
            </h3>
            <p className="text-emerald-700 leading-relaxed">
              {getContent('feature_3_description', '自然の摂理に学び、市場の流れを読み解きます')}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-16 text-center text-sm text-emerald-600 pb-8">
        <p>{getContent('footer_text', '自然と調和する投資分析サービス')}</p>
      </div>
    </div>
  );
}
