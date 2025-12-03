import { useState } from 'react';
import { Database, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { clearAICache } from '../../lib/api';

export function CachePage() {
  const [stockCode, setStockCode] = useState('');
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleClearAll() {
    if (!confirm('すべてのキャッシュを削除しますか？この操作は取り消せません。')) return;

    try {
      setClearing(true);
      setMessage(null);

      const token = localStorage.getItem('adminToken');
      if (!token) return;

      await clearAICache(token);
      setMessage({ type: 'success', text: 'すべてのキャッシュを削除しました' });
    } catch (error) {
      setMessage({ type: 'error', text: 'キャッシュの削除に失敗しました' });
    } finally {
      setClearing(false);
    }
  }

  async function handleClearSpecific() {
    if (!stockCode) {
      setMessage({ type: 'error', text: '銘柄コードを入力してください' });
      return;
    }

    if (!confirm(`銘柄コード ${stockCode} のキャッシュを削除しますか？`)) return;

    try {
      setClearing(true);
      setMessage(null);

      const token = localStorage.getItem('adminToken');
      if (!token) return;

      await clearAICache(token, stockCode);
      setMessage({ type: 'success', text: `銘柄コード ${stockCode} のキャッシュを削除しました` });
      setStockCode('');
    } catch (error) {
      setMessage({ type: 'error', text: 'キャッシュの削除に失敗しました' });
    } finally {
      setClearing(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">キャッシュ管理</h1>
        <p className="text-gray-600">AI診断結果のキャッシュを管理</p>
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
              <h2 className="text-xl font-semibold text-gray-900">特定のキャッシュを削除</h2>
              <p className="text-sm text-gray-600">銘柄コード別にキャッシュをクリア</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                銘柄コード
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
              {clearing ? '削除中...' : 'キャッシュを削除'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">すべてのキャッシュを削除</h2>
              <p className="text-sm text-gray-600">全診断結果をクリア</p>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800">
              この操作はすべてのAI診断結果キャッシュを削除します。次回の診断時にすべての銘柄で新しい分析が実行されます。
            </p>
          </div>

          <button
            onClick={handleClearAll}
            disabled={clearing}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            {clearing ? '削除中...' : 'すべて削除'}
          </button>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">キャッシュについて</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• キャッシュされた診断結果は7日間保存されます</li>
          <li>• キャッシュにより、同じ銘柄の診断が高速化されます</li>
          <li>• 市場状況が大きく変わった場合は、キャッシュを削除して最新の分析を取得してください</li>
          <li>• キャッシュを削除すると、次回の診断時にAI分析が再実行されます</li>
        </ul>
      </div>
    </div>
  );
}
