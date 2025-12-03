import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { BarChart3, Loader2, ArrowRight, ArrowLeft, Circle, Square, Triangle } from 'lucide-react';
import Footer from '../shared/Footer';

export function TemplateDefault({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();

  if (diagnosis.showResult) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <button
            onClick={diagnosis.resetDiagnosis}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>

          <div className="mb-8">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              {getContent('result_title', 'Analysis Result')}
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-12 h-1 bg-orange-500"></div>
              <Circle className="w-3 h-3 text-orange-500 fill-orange-500" />
            </div>
          </div>

          <div className="bg-gray-50 rounded-none p-8 mb-8 border-l-4 border-orange-500">
            <div className="text-gray-800 whitespace-pre-wrap leading-loose text-base">
              {diagnosis.result}
            </div>
          </div>

          {diagnosis.redirectUrl && (
            <button
              onClick={diagnosis.handleConversion}
              className="bg-gray-900 hover:bg-gray-800 text-white py-4 px-10 rounded-none transition-all duration-200 flex items-center gap-3 group font-medium"
            >
              <span>{getContent('result_button_text', 'Learn More')}</span>
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
                <div className="w-16 h-16 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                {getContent('analyzing_title', 'Analyzing')}
              </h2>
              <p className="text-gray-600 text-lg">
                {getContent('analyzing_description', 'Processing data...')}
              </p>
            </div>

            {diagnosis.result && (
              <div className="mt-8 pt-8 border-t border-gray-200 text-left">
                <div className="text-gray-800 whitespace-pre-wrap leading-loose">
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
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-4xl mb-20">
          <div className="flex items-start gap-4 mb-8">
            <div className="flex flex-col gap-2 pt-2">
              <Circle className="w-3 h-3 text-orange-500 fill-orange-500" />
              <Square className="w-3 h-3 text-orange-500 fill-orange-500" />
              <Triangle className="w-3 h-3 text-orange-500 fill-orange-500" />
            </div>
            <div>
              <h1 className="text-7xl font-bold text-gray-900 mb-6 leading-tight">
                {getContent('hero_title', 'Stock Analysis')}
              </h1>
              <div className="w-24 h-1 bg-orange-500 mb-6"></div>
              <p className="text-2xl text-gray-700 mb-3 font-light">
                {getContent('hero_subtitle', 'Clear insights, better decisions')}
              </p>
              <p className="text-lg text-gray-500">
                {getContent('hero_description', 'Simple and effective analysis for modern investors')}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mb-20">
          <div className="bg-gray-50 p-8 border-l-4 border-orange-500">
            <label className="block text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
              Stock Code
            </label>
            <input
              type="text"
              value={diagnosis.stockCode}
              onChange={(e) => diagnosis.setStockCode(e.target.value)}
              placeholder="例: 1031"
              className="w-full px-6 py-4 text-xl border-2 border-gray-300 rounded-none focus:border-orange-500 focus:outline-none transition-colors bg-white text-gray-900"
              disabled={diagnosis.loading || diagnosis.analyzing}
            />

            <button
              onClick={diagnosis.handleDiagnose}
              disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
              className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white py-4 px-8 rounded-none font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3 group"
            >
              {diagnosis.loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>{getContent('hero_button_text', 'Analyze')}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
          <div className="group">
            <div className="mb-4">
              <div className="w-12 h-12 bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                01
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {getContent('feature_1_title', 'Data-Driven')}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {getContent('feature_1_description', 'Comprehensive analysis based on accurate market data')}
            </p>
          </div>

          <div className="group">
            <div className="mb-4">
              <div className="w-12 h-12 bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                02
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {getContent('feature_2_title', 'Fast Results')}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {getContent('feature_2_description', 'Get instant insights without the complexity')}
            </p>
          </div>

          <div className="group">
            <div className="mb-4">
              <div className="w-12 h-12 bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                03
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              {getContent('feature_3_title', 'Clear Insights')}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {getContent('feature_3_description', 'Easy to understand recommendations for action')}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <Footer footerConfig={template.footerConfig} variant="default" />
      </div>
    </div>
  );
}
