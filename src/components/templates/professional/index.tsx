import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { BarChart3, Loader2, ArrowRight, Shield, Database, TrendingUp, Activity, Target, Award, ArrowLeft } from 'lucide-react';
import { FeatureCard } from '../shared/FeatureCard';

export function TemplateProfessional({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();

  if (diagnosis.showResult) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-gray-200 py-4 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-sky-700" />
              <span className="text-xl font-bold text-gray-900">AI股票分析平台</span>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <button
            onClick={diagnosis.resetDiagnosis}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回首页</span>
          </button>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {getContent('result_title', '专业分析报告')}
            </h2>

            <div className="prose max-w-none mb-8">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {diagnosis.result}
              </div>
            </div>

            {diagnosis.redirectUrl && (
              <button
                onClick={diagnosis.handleConversion}
                className="w-full bg-sky-700 hover:bg-sky-800 text-white py-4 px-8 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>{getContent('result_button_text', '查看完整报告')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <footer className="bg-white border-t border-gray-200 py-8 px-6 mt-12">
          <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">
            <p className="mb-2">免责声明：本报告仅供参考，不构成投资建议。投资有风险，入市需谨慎。</p>
            <p>© 2024 专业投资分析平台. 版权所有.</p>
          </div>
        </footer>
      </div>
    );
  }

  if (diagnosis.analyzing) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-gray-200 py-4 px-6">
          <div className="max-w-6xl mx-auto flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-sky-700" />
            <span className="text-xl font-bold text-gray-900">AI股票分析平台</span>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {getContent('analyzing_title', '专业分析进行中')}
              </h2>
              <p className="text-gray-600">
                {getContent('analyzing_description', '正在运行多维度分析模型...')}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <Database className="w-6 h-6 text-sky-700 mx-auto mb-2" />
                <div className="text-xs text-gray-600">数据采集</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <Activity className="w-6 h-6 text-sky-700 mx-auto mb-2" />
                <div className="text-xs text-gray-600">技术分析</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-sky-700 mx-auto mb-2" />
                <div className="text-xs text-gray-600">趋势评估</div>
              </div>
              <div className="text-center p-4 bg-slate-50 rounded-lg">
                <Target className="w-6 h-6 text-sky-700 mx-auto mb-2" />
                <div className="text-xs text-gray-600">风险评级</div>
              </div>
            </div>

            {diagnosis.result && (
              <div className="mt-8 pt-8 border-t">
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
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
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-sky-700" />
            <span className="text-xl font-bold text-gray-900">AI股票分析平台</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span>专业服务</span>
            <span>关于我们</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {getContent('hero_title', '专业股票投资分析平台')}
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {getContent('hero_subtitle', '基于人工智能的投资决策支持系统')}
          </p>
          <p className="text-gray-500">
            {getContent('hero_description', '为专业投资者和机构提供深度市场洞察')}
          </p>

          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-sky-700" />
              <span>机构级安全</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Database className="w-4 h-4 text-sky-700" />
              <span>实时数据</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Award className="w-4 h-4 text-sky-700" />
              <span>专业认证</span>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              銘柄コード
            </label>
            <input
              type="text"
              value={diagnosis.stockCode}
              onChange={(e) => diagnosis.setStockCode(e.target.value)}
              placeholder="例: 1031"
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-sky-700 focus:ring-4 focus:ring-sky-100 outline-none transition-all"
              disabled={diagnosis.loading || diagnosis.analyzing}
            />

            <button
              onClick={diagnosis.handleDiagnose}
              disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
              className="w-full mt-6 bg-sky-700 hover:bg-sky-800 text-white py-4 px-8 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
            >
              {diagnosis.loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>読み込み中...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-5 h-5" />
                  <span>{getContent('hero_button_text', '开始专业分析')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Database className="w-6 h-6" />}
            title={getContent('feature_1_title', '机构级数据')}
            description={getContent('feature_1_description', '接入全球主要市场的实时数据源')}
            variant="professional"
          />
          <FeatureCard
            icon={<Activity className="w-6 h-6" />}
            title={getContent('feature_2_title', '量化分析')}
            description={getContent('feature_2_description', '多维度量化指标和技术分析模型')}
            variant="professional"
          />
          <FeatureCard
            icon={<Target className="w-6 h-6" />}
            title={getContent('feature_3_title', '风险评估')}
            description={getContent('feature_3_description', '全面的风险评估和投资组合优化建议')}
            variant="professional"
          />
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 py-8 px-6 mt-16">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-600">
          <p className="mb-2">免责声明：本服务仅供参考，不构成投资建议。投资有风险，入市需谨慎。</p>
          <p>{getContent('footer_text', '© 2024 专业投资分析平台')}</p>
        </div>
      </footer>
    </div>
  );
}
