import { BarChart3, Loader2 } from 'lucide-react';

interface DiagnosisFormProps {
  stockCode: string;
  setStockCode: (code: string) => void;
  loading: boolean;
  analyzing: boolean;
  onDiagnose: () => void;
  getContent: (key: string, defaultValue?: string) => string;
}

export function DiagnosisForm({
  stockCode,
  setStockCode,
  loading,
  analyzing,
  onDiagnose,
  getContent
}: DiagnosisFormProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {getContent('input_label', '股票代码')}
        </label>
        <input
          type="text"
          value={stockCode}
          onChange={(e) => setStockCode(e.target.value)}
          placeholder={getContent('input_placeholder', '例如: 1031')}
          className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
          disabled={loading || analyzing}
        />

        <button
          onClick={onDiagnose}
          disabled={!stockCode || loading || analyzing}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{getContent('loading_text', '加载中...')}</span>
            </>
          ) : (
            <>
              <BarChart3 className="w-5 h-5" />
              <span>{getContent('hero_button_text', '开始诊断')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
