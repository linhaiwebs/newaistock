import { ArrowRight, ArrowLeft } from 'lucide-react';

interface ResultViewProps {
  result: string;
  stockName: string;
  redirectUrl: string;
  onConversion: () => void;
  onBack: () => void;
  getContent: (key: string, defaultValue?: string) => string;
}

export function ResultView({
  result,
  stockName,
  redirectUrl,
  onConversion,
  onBack,
  getContent
}: ResultViewProps) {
  const formatResult = (text: string): string => {
    return text
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              {getContent('result_title', 'AI股票诊断结果')}
            </h2>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回</span>
            </button>
          </div>

          {stockName && (
            <div className="mb-6 pb-6 border-b">
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-gray-900">{stockName}</span> の分析結果
              </p>
            </div>
          )}

          <div className="prose max-w-none mb-8">
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-base">
              {formatResult(result)}
            </div>
          </div>

          {redirectUrl && (
            <div className="mt-8 pt-6 border-t">
              <button
                onClick={onConversion}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <span>{getContent('result_button_text', '查看详细信息')}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
