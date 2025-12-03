import { TemplateProps } from '../../../types/template';
import { useStockDiagnosis } from '../../../hooks/useStockDiagnosis';
import { BarChart3, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

export function TemplateMinimal({ template, getContent }: TemplateProps) {
  const diagnosis = useStockDiagnosis();

  if (diagnosis.showResult) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="mb-8">
            <button
              onClick={diagnosis.resetDiagnosis}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回</span>
            </button>
            <h2 className="text-3xl font-bold mb-4">
              {getContent('result_title', '诊断结果')}
            </h2>
          </div>

          <div className="bg-slate-800 rounded-lg p-8 mb-8">
            <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
              {diagnosis.result}
            </div>
          </div>

          {diagnosis.redirectUrl && (
            <button
              onClick={diagnosis.handleConversion}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>{getContent('result_button_text', '了解更多')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  if (diagnosis.analyzing) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="mb-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-slate-600 border-t-white mb-4"></div>
            <h2 className="text-2xl font-bold mb-2">
              {getContent('analyzing_title', '分析中...')}
            </h2>
            <p className="text-slate-400">
              {getContent('analyzing_description', '请稍候')}
            </p>
          </div>

          {diagnosis.result && (
            <div className="bg-slate-800 rounded-lg p-6 text-left">
              <div className="text-slate-300 whitespace-pre-wrap text-sm">
                {diagnosis.result}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">
            {getContent('hero_title', '股票诊断')}
          </h1>
          <p className="text-lg text-slate-400 mb-2">
            {getContent('hero_subtitle', '简单、快速、准确')}
          </p>
          <p className="text-sm text-slate-500">
            {getContent('hero_description', '输入股票代码，立即获取分析结果')}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <label className="block text-sm text-slate-400 mb-2">
            銘柄コード
          </label>
          <input
            type="text"
            value={diagnosis.stockCode}
            onChange={(e) => diagnosis.setStockCode(e.target.value)}
            placeholder="例: 1031"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-slate-500 focus:outline-none transition-colors"
            disabled={diagnosis.loading || diagnosis.analyzing}
          />

          <button
            onClick={diagnosis.handleDiagnose}
            disabled={!diagnosis.stockCode || diagnosis.loading || diagnosis.analyzing}
            className="w-full mt-4 bg-white text-slate-900 py-3 px-6 rounded-lg font-semibold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {diagnosis.loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>読み込み中...</span>
              </>
            ) : (
              <>
                <BarChart3 className="w-5 h-5" />
                <span>{getContent('hero_button_text', '立即诊断')}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
