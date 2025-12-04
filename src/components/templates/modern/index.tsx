import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { TrendingUp, BarChart3, Activity, LineChart, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { AILogo } from '../../ui/AILogo';
import { useState } from 'react';

export function TemplateModern({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());

  const features = [
    {
      id: 'technical',
      icon: TrendingUp,
      title: '技術分析',
      description: 'チャート分析',
      bgColor: 'bg-blue-50',
      iconBgColor: 'bg-white',
      iconColor: 'text-gray-800',
      hasArrow: true
    },
    {
      id: 'market',
      icon: BarChart3,
      title: '市場データ',
      description: 'リアルタイム情報',
      bgColor: 'bg-sky-50',
      iconBgColor: 'bg-white',
      iconColor: 'text-gray-800',
      hasArrow: true
    },
    {
      id: 'risk',
      icon: Activity,
      title: 'リスク評価',
      description: '投資リスク分析',
      bgColor: 'bg-indigo-50',
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
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <button
            onClick={diagnosis.resetDiagnosis}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-normal">戻る</span>
          </button>

          <div className="mb-8">
            <h2 className="text-4xl font-light text-gray-900 mb-4 text-left">
              分析結果
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-8 shadow-sm">
            <div className="text-gray-900 whitespace-pre-wrap leading-loose text-base">
              {diagnosis.result}
            </div>
          </div>

          {diagnosis.redirectUrl && (
            <button
              onClick={diagnosis.handleConversion}
              className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-10 rounded-full transition-all duration-200 flex items-center gap-3 group font-normal shadow-md hover:shadow-lg text-base"
            >
              <span>詳細を見る</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (diagnosis.analyzing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center mb-6">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                AI分析中
              </h2>
              <p className="text-gray-600 text-lg">
                市場データを深く解析中...
              </p>
            </div>

            {diagnosis.result && (
              <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-8 text-left shadow-sm">
                <div className="text-gray-900 whitespace-pre-wrap leading-loose text-base">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-white flex flex-col">
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
              <AILogo className="w-12 h-12" theme="blue" />
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
                className="w-full px-5 py-3 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
                disabled={diagnosis.loading || diagnosis.analyzing}
              />
              <button
                onClick={diagnosis.handleDiagnose}
                disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-full font-normal text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
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

      <Footer footerConfig={template.footerConfig} variant="modern" />
    </div>
  );
}
