import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { TrendingUp, BarChart3, Activity, LineChart, ArrowRight, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { AILogo } from '../../ui/AILogo';
import { DiagnosisLoadingScreen } from '../shared/DiagnosisLoadingScreen';
import { DiagnosisResult } from '../shared/DiagnosisResult';
import { getTemplateTheme } from '../../../types/theme';
import { useState } from 'react';

export function TemplateProfessional({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
  const theme = getTemplateTheme('professional');

  const features = [
    {
      id: 'technical',
      icon: TrendingUp,
      title: '技術分析',
      description: 'チャート分析',
      bgColor: 'bg-rose-50',
      iconBgColor: 'bg-white',
      iconColor: 'text-gray-800',
      hasArrow: true
    },
    {
      id: 'market',
      icon: BarChart3,
      title: '市場データ',
      description: 'リアルタイム情報',
      bgColor: 'bg-pink-50',
      iconBgColor: 'bg-white',
      iconColor: 'text-gray-800',
      hasArrow: true
    },
    {
      id: 'risk',
      icon: Activity,
      title: 'リスク評価',
      description: '投資リスク分析',
      bgColor: 'bg-red-50',
      iconBgColor: 'bg-white',
      iconColor: 'text-gray-800',
      hasArrow: true
    },
    {
      id: 'trend',
      icon: LineChart,
      title: 'トレンド分析',
      description: '過去データ比較',
      bgColor: 'bg-gray-100',
      iconBgColor: 'bg-white',
      iconColor: 'text-gray-800',
      hasArrow: true
    },
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
        color="#f43f5e"
        stages={diagnosis.progressStages}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50/30 via-white to-white flex flex-col">
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-light text-gray-900 mb-6 leading-tight">
            {getContent('hero_title', '今日はどのようにお手伝いしましょうか？')}
          </h1>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {features.slice(0, 2).map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => toggleFeature(feature.id)}
                  className={`${feature.bgColor} rounded-3xl p-4 text-left relative transition-all hover:shadow-md border border-gray-300`}
                >
                  <div className={`${feature.iconBgColor} w-8 h-8 rounded-full flex items-center justify-center mb-3`}>
                    <Icon className={`w-4 h-4 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-base font-light text-gray-900 mb-1">{feature.title}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">{feature.description}</p>
                    {feature.hasArrow && (
                      <ArrowRight className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-gray-900 rounded-3xl px-6 py-8 mb-4">
            <div className="flex items-center justify-center mb-4">
              <AILogo className="w-12 h-12" theme="rose" />
            </div>
            <h2 className="text-white text-xl font-light text-center mb-6">
              新しいチャットを開始
            </h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={diagnosis.stockCode}
                onChange={(e) => diagnosis.setStockCode(e.target.value)}
                placeholder="株式コードを入力"
                className="w-full px-5 py-3 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white text-gray-900 placeholder-gray-400"
                disabled={diagnosis.loading || diagnosis.analyzing}
              />
              <button
                onClick={diagnosis.handleDiagnose}
                disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 px-6 rounded-full font-normal text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {diagnosis.loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>開始</span>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {features.slice(2, 4).map((feature) => {
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => toggleFeature(feature.id)}
                  className={`${feature.bgColor} rounded-3xl p-4 text-left relative transition-all hover:shadow-md border border-gray-300`}
                >
                  <div className={`${feature.iconBgColor} w-8 h-8 rounded-full flex items-center justify-center mb-3`}>
                    <Icon className={`w-4 h-4 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-base font-light text-gray-900 mb-1">{feature.title}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">{feature.description}</p>
                    {feature.hasArrow && (
                      <ArrowRight className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Footer footerConfig={template.footerConfig} variant="professional" />
    </div>
  );
}
