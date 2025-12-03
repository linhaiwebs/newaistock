import { useEffect, useState } from 'react';
import { BarChart3, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { getAnalyticsConfig, updateAnalyticsConfig } from '../../lib/api';

export function AnalyticsPage() {
  const [config, setConfig] = useState({
    ga4_measurement_id: '',
    google_ads_conversion_id: '',
    conversion_action_id: '',
    enabled: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  async function loadConfig() {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      const data = await getAnalyticsConfig(token);
      if (data) {
        setConfig({
          ga4_measurement_id: data.ga4_measurement_id || '',
          google_ads_conversion_id: data.google_ads_conversion_id || '',
          conversion_action_id: data.conversion_action_id || '',
          enabled: data.enabled || false,
        });
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      setMessage(null);

      const token = localStorage.getItem('adminToken');
      if (!token) return;

      await updateAnalyticsConfig(token, config);
      setMessage({ type: 'success', text: '設定を保存しました' });
    } catch (error) {
      setMessage({ type: 'error', text: '保存に失敗しました' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">アナリティクス設定</h1>
        <p className="text-gray-600">Google Analytics と Google Ads の設定</p>
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
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          )}
          <p className={`text-sm ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
            {message.text}
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <div className="flex items-center justify-between pb-6 border-b">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">トラッキング設定</h2>
              <p className="text-sm text-gray-600">Google Analyticsの有効化と設定</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-700">
              {config.enabled ? '有効' : '無効'}
            </span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Google Analytics 4 測定ID
          </label>
          <input
            type="text"
            value={config.ga4_measurement_id}
            onChange={(e) => setConfig({ ...config, ga4_measurement_id: e.target.value })}
            placeholder="G-XXXXXXXXXX"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <p className="mt-1 text-sm text-gray-500">例: G-1234567890</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Google Ads コンバージョンID
          </label>
          <input
            type="text"
            value={config.google_ads_conversion_id}
            onChange={(e) => setConfig({ ...config, google_ads_conversion_id: e.target.value })}
            placeholder="AW-XXXXXXXXXX"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <p className="mt-1 text-sm text-gray-500">例: AW-123456789</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            コンバージョンアクションID
          </label>
          <input
            type="text"
            value={config.conversion_action_id}
            onChange={(e) => setConfig({ ...config, conversion_action_id: e.target.value })}
            placeholder="AW-XXXXXXXXXX/XXXXX"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <p className="mt-1 text-sm text-gray-500">例: AW-123456789/AbCdEfGhIj</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">イベント名</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• 診断ボタン: <code className="bg-blue-100 px-2 py-0.5 rounded">Bdd</code></li>
            <li>• 転換ボタン: <code className="bg-blue-100 px-2 py-0.5 rounded">Add</code></li>
          </ul>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? '保存中...' : '設定を保存'}
        </button>
      </div>
    </div>
  );
}
