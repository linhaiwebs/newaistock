import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { BarChart3, Loader2, ArrowRight, Sparkles, TrendingUp, Zap, ArrowLeft } from 'lucide-react';
import { FeatureCard } from '../shared/FeatureCard';

export function TemplateModern({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();

  if (diagnosis.showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={diagnosis.resetDiagnosis}
            className="flex items-center gap-2 text-violet-600 hover:text-violet-700 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
          </button>

          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-6">
              ✨ {getContent('result_title', 'AI诊断结果')}
            </h2>

            <div className="prose max-w-none mb-8">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {diagnosis.result}
              </div>
            </div>

            {diagnosis.redirectUrl && (
              <button
                onClick={diagnosis.handleConversion}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>{getContent('result_button_text', '探索更多 →')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (diagnosis.analyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-12 text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full mb-6 animate-pulse">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-2">
                {getContent('analyzing_title', '🤖 AI正在思考...')}
              </h2>
              <p className="text-gray-600">
                {getContent('analyzing_description', '分析中，马上就好！')}
              </p>
            </div>

            {diagnosis.result && (
              <div className="mt-8 pt-8 border-t border-violet-100 text-left">
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed animate-fadeIn">
                  {diagnosis.result}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-fuchsia-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl mb-8 shadow-2xl animate-float">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
              {getContent('hero_title', '🚀 智能股票分析')}
            </span>
          </h1>
          <p className="text-2xl text-gray-700 mb-3">
            {getContent('hero_subtitle', '让AI成为你的投资顾问')}
          </p>
          <p className="text-lg text-gray-600">
            {getContent('hero_description', '新一代投资者的选择，科技驱动财富增长')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              銘柄コード
            </label>
            <input
              type="text"
              value={diagnosis.stockCode}
              onChange={(e) => diagnosis.setStockCode(e.target.value)}
              placeholder="例: 1031"
              className="w-full px-6 py-4 text-lg border-2 border-violet-200 rounded-2xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all bg-white/50"
              disabled={diagnosis.loading || diagnosis.analyzing}
            />

            <button
              onClick={diagnosis.handleDiagnose}
              disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
              className="w-full mt-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white py-4 px-8 rounded-2xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-3"
            >
              {diagnosis.loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>読み込み中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>{getContent('hero_button_text', '开始探索')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6" />}
            title={getContent('feature_1_title', '🎯 精准预测')}
            description={getContent('feature_1_description', 'AI算法分析海量数据，预测市场趋势')}
            variant="modern"
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title={getContent('feature_2_title', '⚡ 闪电分析')}
            description={getContent('feature_2_description', '秒级响应，实时获取投资建议')}
            variant="modern"
          />
          <FeatureCard
            icon={<BarChart3 className="w-6 h-6" />}
            title={getContent('feature_3_title', '📊 可视化报告')}
            description={getContent('feature_3_description', '直观的数据可视化，让决策更简单')}
            variant="modern"
          />
        </div>
      </div>

      <div className="mt-16 text-center text-sm text-gray-600">
        <p>{getContent('footer_text', 'Made with ❤️ by AI Stock Analysis')}</p>
      </div>
    </div>
  );
}
