import { LoadingBar } from '../shared/LoadingBar';

interface AnalyzingViewProps {
  result: string;
  getContent: (key: string, defaultValue?: string) => string;
}

export function AnalyzingView({ result, getContent }: AnalyzingViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {getContent('analyzing_title', 'AI分析中')}
            </h2>
            <p className="text-gray-600">
              {getContent('analyzing_description', '正在详细分析股票数据...')}
            </p>
          </div>

          <div className="space-y-6 mb-8">
            <LoadingBar label="株価データを取得中..." delay={0} />
            <LoadingBar label="テクニカル指標を分析中..." delay={1000} />
            <LoadingBar label="市場トレンドを評価中..." delay={2000} />
            <LoadingBar label="投資判断を生成中..." delay={3000} />
          </div>

          {result && (
            <div className="mt-8 pt-8 border-t">
              <div className="prose max-w-none">
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed animate-fadeIn">
                  {result}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
