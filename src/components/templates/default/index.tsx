import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { TrendingUp, BarChart3, Brain, Target, Zap, Loader2, ArrowRight, ArrowLeft, Home, DollarSign, Bitcoin, Settings } from 'lucide-react';
import Footer from '../shared/Footer';
import { GradientBackground } from '../shared/GradientBackground';
import { FeatureCard } from '../shared/FeatureCard';
import { useState } from 'react';

export function TemplateDefault({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());

  const features = [
    { id: 'stocks', icon: TrendingUp, label: getContent('feature_stocks', 'Stocks'), gradient: 'card-gradient-blue', iconColor: 'text-blue-700' },
    { id: 'bond', icon: BarChart3, label: getContent('feature_bond', 'Bond'), gradient: 'card-gradient-purple', iconColor: 'text-purple-700' },
    { id: 'realestate', icon: Home, label: getContent('feature_realestate', 'Real Estate'), gradient: 'card-gradient-green', iconColor: 'text-green-700' },
    { id: 'etfs', icon: Target, label: getContent('feature_etfs', 'ETFs'), gradient: 'card-gradient-cyan', iconColor: 'text-cyan-700' },
    { id: 'mutualfund', icon: Brain, label: getContent('feature_mutualfund', 'Mutual Fund'), gradient: 'card-gradient-amber', iconColor: 'text-amber-700' },
    { id: 'commodity', icon: DollarSign, label: getContent('feature_commodity', 'Commodity'), gradient: 'card-gradient-rose', iconColor: 'text-rose-700' },
    { id: 'crypto', icon: Bitcoin, label: getContent('feature_crypto', 'Cryptocurrency'), gradient: 'card-gradient-blue', iconColor: 'text-blue-700' },
    { id: 'other', icon: Settings, label: getContent('feature_other', 'Other'), gradient: 'card-gradient-purple', iconColor: 'text-purple-700' },
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
      <div className="min-h-screen relative overflow-hidden">
        <GradientBackground variant="default" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
          <button
            onClick={diagnosis.resetDiagnosis}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">{getContent('back_button', '戻る')}</span>
          </button>

          <div className="mb-8">
            <h2 className="text-5xl font-bold text-gray-900 mb-4 text-left">
              {getContent('result_title', '分析结果')}
            </h2>
          </div>

          <div className="glass-morphism rounded-2xl p-10 mb-8 shadow-2xl">
            <div className="text-gray-900 whitespace-pre-wrap leading-loose text-lg">
              {diagnosis.result}
            </div>
          </div>

          {diagnosis.redirectUrl && (
            <button
              onClick={diagnosis.handleConversion}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-5 px-12 rounded-2xl transition-all duration-200 flex items-center gap-3 group font-bold shadow-lg hover:shadow-xl text-lg"
            >
              <span>{getContent('result_button_text', '了解更多')}</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (diagnosis.analyzing) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <GradientBackground variant="default" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                {getContent('analyzing_title', 'AI分析中')}
              </h2>
              <p className="text-gray-700 text-xl">
                {getContent('analyzing_description', '正在处理数据...')}
              </p>
            </div>

            {diagnosis.result && (
              <div className="mt-12 glass-morphism rounded-2xl p-8 text-left">
                <div className="text-gray-900 whitespace-pre-wrap leading-loose text-lg">
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
      <GradientBackground variant="default" />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight text-left">
              {getContent('hero_title', 'Which assets are you most interested in?')}
            </h1>
            <p className="text-xl text-gray-700 text-left">
              AIを活用した詳細な株式分析をお試しください
            </p>
          </div>

          <div className="mb-16">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-12">
              {features.map(feature => (
                <FeatureCard
                  key={feature.id}
                  icon={feature.icon}
                  title={feature.label}
                  selected={selectedFeatures.has(feature.id)}
                  onClick={() => toggleFeature(feature.id)}
                  gradientClass={feature.gradient}
                  iconColor={feature.iconColor}
                />
              ))}
            </div>

            <div className="max-w-2xl mx-auto glass-morphism rounded-2xl p-10 shadow-2xl">
              <label className="block text-lg font-bold text-gray-900 mb-4">
                {getContent('form_label', '株式コード')}
              </label>
              <input
                type="text"
                value={diagnosis.stockCode}
                onChange={(e) => diagnosis.setStockCode(e.target.value)}
                placeholder={getContent('form_placeholder', '例: 1031')}
                className="w-full px-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all bg-white text-gray-900 placeholder-gray-400 shadow-sm"
                disabled={diagnosis.loading || diagnosis.analyzing}
              />

              <button
                onClick={diagnosis.handleDiagnose}
                disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-5 px-8 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl"
              >
                {diagnosis.loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>{getContent('loading_text', 'Loading...')}</span>
                  </>
                ) : (
                  <>
                    <span>{getContent('hero_button_text', 'Continue')}</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300/50">
          <Footer footerConfig={template.footerConfig} variant="default" />
        </div>
      </div>
    </div>
  );
}
