import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { TrendingUp, BarChart3, Brain, Target, Zap, Loader2, ArrowRight, ArrowLeft, Home, DollarSign, Bitcoin, Settings } from 'lucide-react';
import Footer from '../shared/Footer';
import { GradientBackground } from '../shared/GradientBackground';
import { FeaturePill } from '../shared/FeaturePill';
import { useState } from 'react';

export function TemplateProfessional({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());

  const features = [
    { id: 'stocks', icon: TrendingUp, label: getContent('feature_stocks', 'Stocks'), color: 'bg-gray-700' },
    { id: 'bond', icon: BarChart3, label: getContent('feature_bond', 'Bond'), color: 'bg-rose-700' },
    { id: 'realestate', icon: Home, label: getContent('feature_realestate', 'Real Estate'), color: 'bg-gray-700' },
    { id: 'etfs', icon: Target, label: getContent('feature_etfs', 'ETFs'), color: 'bg-pink-700' },
    { id: 'mutualfund', icon: Brain, label: getContent('feature_mutualfund', 'Mutual Fund'), color: 'bg-gray-700' },
    { id: 'commodity', icon: DollarSign, label: getContent('feature_commodity', 'Commodity'), color: 'bg-gray-700' },
    { id: 'crypto', icon: Bitcoin, label: getContent('feature_crypto', 'Cryptocurrency'), color: 'bg-gray-700' },
    { id: 'other', icon: Settings, label: getContent('feature_other', 'Other'), color: 'bg-rose-800' },
  ];

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  if (diagnosis.showResult) {
    return (
      <div className="min-h-screen bg-[#2a2a2a]">
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
      <div className="min-h-screen bg-[#2a2a2a] flex items-center justify-center">
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

      <div className="relative z-10">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {getContent('hero_title', 'Which assets are you most interested in?')}
            </h1>
          </div>

          <div className="max-w-2xl mx-auto mb-16">
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {features.map(feature => (
                <FeaturePill
                  key={feature.id}
                  icon={feature.icon}
                  label={feature.label}
                  selected={selectedFeatures.has(feature.id)}
                  onClick={() => toggleFeature(feature.id)}
                  colorClass={feature.color}
                />
              ))}
            </div>

            <p className="text-center text-white/60 text-base mb-12">
              {getContent('selection_hint', 'Please pick 3 most desired categories.')}
            </p>

            <div className="bg-gray-800/40 rounded-3xl p-8 border border-gray-700/50">
              <label className="block text-sm font-semibold text-white mb-3">
                股票代码
              </label>
              <input
                type="text"
                value={diagnosis.stockCode}
                onChange={(e) => diagnosis.setStockCode(e.target.value)}
                placeholder="例: 1031"
                className="w-full px-6 py-4 text-lg border-2 border-gray-600 rounded-2xl focus:border-rose-400 focus:ring-2 focus:ring-rose-400/30 outline-none transition-all bg-white text-gray-900 placeholder-gray-400"
                disabled={diagnosis.loading || diagnosis.analyzing}
              />

              <button
                onClick={diagnosis.handleDiagnose}
                disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                className="w-full mt-6 bg-rose-500 hover:bg-rose-600 text-white py-4 px-8 rounded-full font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                {diagnosis.loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{getContent('loading_text', 'Loading...')}</span>
                  </>
                ) : (
                  <>
                    <span>{getContent('hero_button_text', 'Continue')}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <button
                className="w-full mt-4 bg-transparent hover:bg-gray-800/50 text-rose-400 py-4 px-8 rounded-full font-semibold text-lg border-2 border-rose-500/60 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>{getContent('none_button_text', 'None of the above')}</span>
                <span className="text-xl">×</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 border-t border-gray-800">
          <Footer footerConfig={template.footerConfig} variant="professional" />
        </div>
      </div>
    </div>
  );
}
