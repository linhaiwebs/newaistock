import { useState } from 'react';
import { Database, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { clearAICache } from '../../lib/api';

export function CachePage() {
  const [stockCode, setStockCode] = useState('');
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleClearAll() {
    if (!confirm('确定要删除所有缓存吗？此操作无法撤销。')) return;

    try {
      setClearing(true);
      setMessage(null);

      const token = localStorage.getItem('adminToken');
      if (!token) return;

      await clearAICache(token);
      setMessage({ type: 'success', text: '已删除所有缓存' });
    } catch (error) {
      setMessage({ type: 'error', text: '删除缓存失败' });
    } finally {
      setClearing(false);
    }
  }

  async function handleClearSpecific() {
    if (!stockCode) {
      setMessage({ type: 'error', text: '请输入股票代码' });
      return;
    }

    if (!confirm(`确定要删除股票代码 ${stockCode} 的缓存吗？`)) return;

    try {
      setClearing(true);
      setMessage(null);

      const token = localStorage.getItem('adminToken');
      if (!token) return;

      await clearAICache(token, stockCode);
      setMessage({ type: 'success', text: `已删除股票代码 ${stockCode} 的缓存` });
      setStockCode('');
    } catch (error) {
      setMessage({ type: 'error', text: '删除缓存失败' });
    } finally {
      setClearing(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">缓存管理</h1>
        <p className="text-gray-600">管理AI诊断结果缓存</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <p className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
            {message.text}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">删除特定缓存</h2>
              <p className="text-sm text-gray-600">按股票代码清除缓存</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                股票代码
              </label>
              <input
                type="text"
                value={stockCode}
                onChange={(e) => setStockCode(e.target.value)}
                placeholder="例: 1031"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <button
              onClick={handleClearSpecific}
              disabled={clearing || !stockCode}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              {clearing ? '删除中...' : '删除缓存'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">删除所有缓存</h2>
              <p className="text-sm text-gray-600">清除所有诊断结果</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800">
              此操作将删除所有AI诊断结果缓存。下次诊断时将对所有股票执行新的分析。
            </p>
          </div>

          <button
            onClick={handleClearAll}
            disabled={clearing}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            {clearing ? '删除中...' : '全部删除'}
          </button>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">关于缓存</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• 缓存的诊断结果保存7天</li>
          <li>• 缓存可加快同一股票的诊断速度</li>
          <li>• 如果市场情况发生重大变化，请删除缓存以获取最新分析</li>
          <li>• 删除缓存后，下次诊断时将重新执行AI分析</li>
        </ul>
      </div>
    </div>
  );
}
