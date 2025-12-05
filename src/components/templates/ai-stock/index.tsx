import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { TrendingUp, FileText, LayoutDashboard, Loader2, Sparkles, Users, Rocket, Heart, Star, Zap } from 'lucide-react';
import Footer from '../shared/Footer';
import { DiagnosisLoadingScreen } from '../shared/DiagnosisLoadingScreen';
import { DiagnosisResult } from '../shared/DiagnosisResult';
import { getTemplateTheme } from '../../../types/theme';

export function TemplateAiStock({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();
  const theme = getTemplateTheme('default');

  const features = [
    {
      id: 'trend',
      icon: TrendingUp,
      titleKey: 'feature1_title',
      titleDefault: 'Intelligent Conversations',
      descKey: 'feature1_description',
      descDefault: 'Engage in meaningful and context-aware discussions.',
      iconGradient: 'linear-gradient(135deg, #FF6B9D 0%, #FFA07A 100%)',
      rotation: 'rotate-2'
    },
    {
      id: 'news',
      icon: Sparkles,
      titleKey: 'feature2_title',
      titleDefault: 'Personalized Assistance',
      descKey: 'feature2_description',
      descDefault: 'Receive recommendations and solutions based on your preferences.',
      iconGradient: 'linear-gradient(135deg, #C471ED 0%, #F64F59 100%)',
      rotation: '-rotate-1'
    },
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      titleKey: 'feature3_title',
      titleDefault: '24/7 Availability',
      descKey: 'feature3_description',
      descDefault: 'Available around the clock to assist you with your questions and tasks.',
      iconGradient: 'linear-gradient(135deg, #FFA751 0%, #FFE259 100%)',
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
      {/* Animated Banner Section */}
      <div className="w-full bg-black overflow-hidden py-6">
        <div className="flex animate-scroll-left whitespace-nowrap">
          {/* First set of animated elements */}
          <div className="flex gap-0 items-center">
            <div className="w-24 h-16 bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div className="w-20 h-16 bg-gradient-to-r from-pink-400 to-pink-500 flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div className="w-28 h-16 bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="w-24 h-16 bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="w-20 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center">
              <Star className="w-7 h-7 text-white" />
            </div>
            <div className="w-26 h-16 bg-gradient-to-r from-orange-500 to-red-400 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="w-24 h-16 bg-gradient-to-r from-pink-500 to-purple-400 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="w-20 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
              <LayoutDashboard className="w-7 h-7 text-white" />
            </div>
          </div>

          {/* Duplicate for seamless loop */}
          <div className="flex gap-0 items-center">
            <div className="w-24 h-16 bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div className="w-20 h-16 bg-gradient-to-r from-pink-400 to-pink-500 flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div className="w-28 h-16 bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="w-24 h-16 bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div className="w-20 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center">
              <Star className="w-7 h-7 text-white" />
            </div>
            <div className="w-26 h-16 bg-gradient-to-r from-orange-500 to-red-400 flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="w-24 h-16 bg-gradient-to-r from-pink-500 to-purple-400 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div className="w-20 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center">
              <LayoutDashboard className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container - White with Rounded Top */}
      <div className="flex-1 bg-white rounded-t-[2rem] px-6 py-8">
        <div className="max-w-md mx-auto">
          {/* Title and Subtitle */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
              {getContent('hero_title', 'Make your life easier')}
            </h1>
            <p className="text-sm text-gray-600 leading-relaxed">
              {getContent('hero_subtitle', 'Your smart companion for everyday tasks.')}
            </p>
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
                    {/* Icon with Gradient Background */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: feature.iconGradient }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
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
          <div className="flex justify-center gap-2 mb-8">
            <div className="w-8 h-1 bg-gray-900 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
          </div>

          {/* CTA Button */}
          <button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-4 px-6 rounded-full font-semibold text-base transition-all duration-200 shadow-lg">
            {getContent('submit_button', 'Start Chatting')}
          </button>
        </div>
      </div>

      <Footer footerConfig={template.footerConfig} variant="default" />
    </div>
  );
}
