import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { TrendingUp, BarChart3, LineChart, Loader2 } from 'lucide-react';
import Footer from '../shared/Footer';
import { DiagnosisLoadingScreen } from '../shared/DiagnosisLoadingScreen';
import { DiagnosisResult } from '../shared/DiagnosisResult';
import { getTemplateTheme } from '../../../types/theme';
import { TechStockIllustration } from '../../ui/TechStockIllustration';

export function TemplateAiStock({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const theme = getTemplateTheme('default');

  const features = [
    {
      id: 'trend',
      icon: TrendingUp,
      titleKey: 'feature1_title',
      titleDefault: 'Market Data Visualization',
      descKey: 'feature1_description',
      descDefault: 'View publicly available market data and trends for informational purposes only.',
      iconGradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
      rotation: 'rotate-2'
    },
    {
      id: 'analysis',
      icon: BarChart3,
      titleKey: 'feature2_title',
      titleDefault: 'Trend Analysis',
      descKey: 'feature2_description',
      descDefault: 'Historical data comparison and chart review. Not investment advice.',
      iconGradient: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
      rotation: '-rotate-1'
    },
    {
      id: 'data',
      icon: LineChart,
      titleKey: 'feature3_title',
      titleDefault: 'Data Access 24/7',
      descKey: 'feature3_description',
      descDefault: 'Access market data visualization anytime. Educational tool only.',
      iconGradient: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
      rotation: 'rotate-1'
    }
  ];

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
        color="#3b82f6"
        stages={diagnosis.progressStages}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* SVG Tech Illustration Header */}
      <div className="w-full h-48 overflow-hidden">
        <TechStockIllustration className="w-full h-full object-cover" />
      </div>

      {/* Main Content Container - White with Rounded Top */}
      <div className="flex-1 bg-white rounded-t-[2rem] px-6 py-8 -mt-8">
        <div className="max-w-md mx-auto">
          {/* Title and Subtitle */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
              {getContent('hero_title', 'AI Stock Data Analysis Tool')}
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              {getContent('hero_subtitle', 'Analytical tool providing market data visualization for informational purposes')}
            </p>
          </div>

          {/* Diagnosis Input Section */}
          <div className="mb-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={diagnosis.stockCode}
                onChange={(e) => diagnosis.setStockCode(e.target.value)}
                placeholder={getContent('input_placeholder', 'Enter stock code')}
                className="w-full px-5 py-3 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 placeholder-gray-400 shadow-sm"
                disabled={diagnosis.loading || diagnosis.analyzing}
              />
              <button
                onClick={diagnosis.handleDiagnose}
                disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-6 rounded-full font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
              >
                {diagnosis.loading || diagnosis.analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{getContent('analyzing_text', 'Analyzing...')}</span>
                  </>
                ) : (
                  <span>{getContent('submit_button', 'Analyze Stock Data')}</span>
                )}
              </button>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 text-xs text-gray-500 text-center leading-relaxed">
              {getContent('disclaimer_text', 'This is a data analysis tool only. Not investment advice. We do not hold financial licenses.')}
            </div>
          </div>

          {/* Feature Cards with Individual Backgrounds */}
          <div className="space-y-4 mb-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className={`inline-block ${feature.rotation} transition-transform hover:scale-105`}
                >
                  <div className="bg-white rounded-2xl p-4 shadow-lg flex gap-3 items-start border-2 border-gray-100">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: feature.iconGradient }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        {getContent(feature.titleKey, feature.titleDefault)}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {getContent(feature.descKey, feature.descDefault)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2">
            <div className="w-8 h-1 bg-gray-900 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      <Footer footerConfig={template.footerConfig} variant="default" />
    </div>
  );
}
