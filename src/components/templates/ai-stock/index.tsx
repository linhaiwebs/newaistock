import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { TrendingUp, FileText, LayoutDashboard, Loader2 } from 'lucide-react';
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
      titleDefault: 'AI株式トレンド解読',
      descKey: 'feature1_description',
      descDefault: 'AIが公開データを分析し、市場トレンドの変化を理解しやすくします。',
      iconBgColor: 'bg-red-500',
      rotation: 'rotate-2'
    },
    {
      id: 'news',
      icon: FileText,
      titleKey: 'feature2_title',
      titleDefault: '市場ニュースのスマート整理',
      descKey: 'feature2_description',
      descDefault: '公開された財務ニュースとホットトピックを自動的にまとめ、重要な情報を素早く把握します。',
      iconBgColor: 'bg-purple-500',
      rotation: '-rotate-1'
    },
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      titleKey: 'feature3_title',
      titleDefault: 'パーソナライズされたデータパネル',
      descKey: 'feature3_description',
      descDefault: 'あなたが注目する株式とセクターの公開データを表示し、カスタマイズされた表示方法をサポートします。',
      iconBgColor: 'bg-orange-500',
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
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-6 py-8">
        <div className="max-w-md mx-auto">
          {/* Tech Illustration Area */}
          <div className="mb-8 relative h-48 flex items-center justify-center overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-20"></div>

            {/* Tech decorative elements */}
            <div className="relative z-10 flex items-center justify-center gap-4 flex-wrap p-4">
              {/* Data panel icon */}
              <div className="w-20 h-20 bg-blue-500 rounded-xl flex items-center justify-center transform rotate-12 shadow-lg">
                <LayoutDashboard className="w-10 h-10 text-white" />
              </div>

              {/* Chart icon */}
              <div className="w-20 h-20 bg-orange-500 rounded-xl flex items-center justify-center transform -rotate-6 shadow-lg">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>

              {/* AI chip icon */}
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 border-2 border-white rounded-sm"></div>
              </div>

              {/* Document icon */}
              <div className="w-16 h-16 bg-yellow-400 rounded-xl flex items-center justify-center transform rotate-45 shadow-lg">
                <FileText className="w-8 h-8 text-white transform -rotate-45" />
              </div>

              {/* Particle effects */}
              <div className="absolute top-4 left-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-6 right-8 w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-8 right-12 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          {/* Title and Subtitle */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-medium text-gray-900 mb-3 leading-tight">
              {getContent('hero_title', '株式情報をもっとわかりやすく')}
            </h1>
            <p className="text-base text-gray-600 leading-relaxed px-2">
              {getContent('hero_subtitle', 'AIが公開市場データを理解し、ニュースを整理し、より直感的な株式トレンドを表示します。')}
            </p>
          </div>

          {/* Colorful Striped Container with Feature Cards */}
          <div
            className="relative w-4/5 mx-auto rounded-[2rem] py-12 px-6 mb-8"
            style={{
              background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b9d 20%, #c471ed 40%, #12c2e9 60%, #feca57 80%, #ff9a56 100%)',
            }}
          >
            <div className="space-y-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.id}
                    className={`bg-white rounded-2xl p-6 shadow-lg flex gap-4 items-start ${feature.rotation} transition-transform hover:scale-105`}
                  >
                    {/* Icon */}
                    <div className={`${feature.iconBgColor} w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {getContent(feature.titleKey, feature.titleDefault)}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {getContent(feature.descKey, feature.descDefault)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stock Input Form */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl px-6 py-8">
            <h2 className="text-xl font-medium text-gray-900 text-center mb-6">
              {getContent('form_title', '株式コードを入力してください')}
            </h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={diagnosis.stockCode}
                onChange={(e) => diagnosis.setStockCode(e.target.value)}
                placeholder={getContent('input_placeholder', '株式コードを入力')}
                className="w-full px-5 py-3 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
                disabled={diagnosis.loading || diagnosis.analyzing}
              />
              <button
                onClick={diagnosis.handleDiagnose}
                disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-full font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {diagnosis.loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span>{getContent('submit_button', '分析開始')}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer footerConfig={template.footerConfig} variant="default" />
    </div>
  );
}
