import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { Sparkles, Loader2, ArrowRight, ArrowLeft, Brain, Target, Zap } from 'lucide-react';
import Footer from '../shared/Footer';
import { GradientBackground } from '../shared/GradientBackground';
import { StockDecorations } from '../shared/StockDecorations';

export function TemplateProfessional({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();

  if (diagnosis.showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-900 via-purple-900 to-indigo-900">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <button
            onClick={diagnosis.resetDiagnosis}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">返回</span>
          </button>

          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              {getContent('result_title', '分析结果')}
            </h2>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-2xl">
            <div className="text-gray-800 whitespace-pre-wrap leading-loose text-base">
              {diagnosis.result}
            </div>
          </div>

          {diagnosis.redirectUrl && (
            <button
              onClick={diagnosis.handleConversion}
              className="bg-rose-400 hover:bg-rose-500 text-white py-4 px-10 rounded-2xl transition-all duration-200 flex items-center gap-3 group font-semibold shadow-lg hover:shadow-xl"
            >
              <span>{getContent('result_button_text', '了解更多')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (diagnosis.analyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="w-16 h-16 border-4 border-white/20 border-t-rose-400 rounded-full animate-spin"></div>
              </div>
              <h2 className="text-4xl font-bold text-white mb-3">
                {getContent('analyzing_title', 'AI分析中')}
              </h2>
              <p className="text-white/70 text-lg">
                {getContent('analyzing_description', '正在处理数据...')}
              </p>
            </div>

            {diagnosis.result && (
              <div className="mt-8 pt-8 border-t border-white/20 text-left">
                <div className="text-white/90 whitespace-pre-wrap leading-loose">
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
    <div className="min-h-screen relative overflow-hidden">
      <GradientBackground variant="professional" />
      <StockDecorations variant="professional" />

      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {getContent('hero_title', 'AI股票诊断')}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light">
              {getContent('hero_subtitle', '智能分析 精准决策')}
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {getContent('feature_1_title', '实时数据')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getContent('feature_1_description', '获取最新市场数据')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {getContent('feature_2_title', 'AI分析')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getContent('feature_2_description', '智能算法深度诊断')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all md:col-span-2 lg:col-span-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {getContent('feature_3_title', '精准建议')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getContent('feature_3_description', '专业投资参考意见')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center text-white/60 text-sm mb-10">
              本工具仅供参考，不构成投资建议。投资有风险，决策需谨慎。
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
              <label className="block text-sm font-semibold text-white mb-3">
                股票代码
              </label>
              <input
                type="text"
                value={diagnosis.stockCode}
                onChange={(e) => diagnosis.setStockCode(e.target.value)}
                placeholder="例: 1031"
                className="w-full px-6 py-4 text-lg border-3 border-rose-400 rounded-2xl focus:border-rose-300 focus:ring-4 focus:ring-rose-400/30 outline-none transition-all bg-white text-gray-900 placeholder-gray-400 font-medium"
                disabled={diagnosis.loading || diagnosis.analyzing}
              />

              <button
                onClick={diagnosis.handleDiagnose}
                disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                className="w-full mt-6 bg-rose-400 hover:bg-rose-500 text-white py-4 px-8 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
              >
                {diagnosis.loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>加载中...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>{getContent('hero_button_text', '立即分析')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border-t border-white/10">
          <Footer footerConfig={template.footerConfig} variant="professional" />
        </div>
      </div>
    </div>
  );
}
