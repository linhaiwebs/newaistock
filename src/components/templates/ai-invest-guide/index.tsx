import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { TrendingUp, Sparkles, Clock, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { DiagnosisLoadingScreen } from '../shared/DiagnosisLoadingScreen';
import { DiagnosisResult } from '../shared/DiagnosisResult';
import { TechIllustration } from './TechIllustration';
import { useState } from 'react';

export function TemplateAiInvestGuide({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const [stockCode, setStockCode] = useState('');

  const handleAnalyze = () => {
    if (stockCode.trim()) {
      diagnosis.handleDiagnose(stockCode.trim());
    }
  };

  if (diagnosis.showResult && diagnosis.result) {
    return (
      <DiagnosisResult
        stockName={diagnosis.result.stockName}
        stockCode={diagnosis.result.stockCode}
        result={diagnosis.result}
        onBack={diagnosis.handleBack}
        onConversion={diagnosis.handleConversion}
        accentColor="#3b82f6"
      />
    );
  }

  if (diagnosis.analyzing) {
    return (
      <DiagnosisLoadingScreen
        color="#3b82f6"
        progressStages={diagnosis.progressStages}
      />
    );
  }

  const features = [
    {
      id: 'insight',
      icon: TrendingUp,
      title: getContent('feature_1_title', '智能股票洞察'),
      description: getContent('feature_1_description', '实时解析行情变化，识别关键指标，生成趋势信号。'),
      bgGradient: 'from-orange-50 via-pink-50 to-purple-50',
      iconBg: 'bg-red-500',
    },
    {
      id: 'personalized',
      icon: Sparkles,
      title: getContent('feature_2_title', '个性化投资建议'),
      description: getContent('feature_2_description', '根据你的持仓、偏好与风险等级，提供量身定制的投资策略。'),
      bgGradient: 'from-pink-50 via-purple-50 to-blue-50',
      iconBg: 'bg-purple-500',
    },
    {
      id: 'monitoring',
      icon: Clock,
      title: getContent('feature_3_title', '24/7 市场监控'),
      description: getContent('feature_3_description', '全天候追踪股价波动，第一时间提醒重要变化与风险信号。'),
      bgGradient: 'from-orange-50 via-rose-50 to-pink-50',
      iconBg: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TechIllustration />

      <div className="flex-1 px-6 pb-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 text-center mt-8 mb-4">
            {getContent('hero_title', '让你的投资更聪明')}
          </h1>

          <p className="text-base font-normal text-gray-600 text-center leading-relaxed mb-8">
            {getContent('hero_subtitle', 'AI 驱动的股票分析助手，为你洞察行情、预测趋势、提升决策效率。')}
          </p>

          <div className="space-y-4 mb-8">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`bg-gradient-to-r ${feature.bgGradient} rounded-2xl shadow-md p-5 border border-gray-100 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${feature.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={stockCode}
              onChange={(e) => setStockCode(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAnalyze();
                }
              }}
              placeholder={getContent('input_placeholder', '请输入股票代码')}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              disabled={diagnosis.loading}
            />

            <button
              onClick={handleAnalyze}
              disabled={diagnosis.loading || !stockCode.trim()}
              className="w-full bg-black hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {diagnosis.loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>分析中...</span>
                </>
              ) : (
                <span>{getContent('cta_button', '开始分析')}</span>
              )}
            </button>
          </div>
        </div>
      </div>

      <Footer footerConfig={template.footerConfig} />
    </div>
  );
}
