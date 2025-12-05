import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';
import { getDomain, createDomain, updateDomain, AuthError } from '../../lib/api';
import { requireValidToken } from '../../lib/auth';

export function DomainForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    domain: '',
    site_name: '',
    site_description: '',
    google_ads_publisher_id: '',
    google_verification_code: '',
    google_analytics_id: '',
    is_active: true,
    is_default: false,
  });

  useEffect(() => {
    if (id) {
      loadDomain();
    }
  }, [id]);

  async function loadDomain() {
    try {
      const token = requireValidToken();
      const data = await getDomain(token, id!);
      setFormData({
        domain: data.domain || '',
        site_name: data.site_name || '',
        site_description: data.site_description || '',
        google_ads_publisher_id: data.google_ads_publisher_id || '',
        google_verification_code: data.google_verification_code || '',
        google_analytics_id: data.google_analytics_id || '',
        is_active: data.is_active ?? true,
        is_default: data.is_default ?? false,
      });
    } catch (error) {
      console.error('Failed to load domain:', error);
      if (error instanceof AuthError || (error instanceof Error && (error.message === 'NO_TOKEN' || error.message === 'TOKEN_EXPIRED'))) {
        setError('认证已过期，请重新登录。');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setError('加载域名配置失败。');
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = requireValidToken();

      if (id) {
        await updateDomain(token, id, formData);
      } else {
        await createDomain(token, formData);
      }

      localStorage.removeItem('activeTemplate');

      try {
        const channel = new BroadcastChannel('template-updates');
        channel.postMessage('template-updated');
        channel.close();
      } catch (e) {
        console.warn('BroadcastChannel not supported');
      }

      navigate('/admin/domains');
    } catch (error) {
      console.error('Failed to save domain:', error);
      if (error instanceof AuthError || (error instanceof Error && (error.message === 'NO_TOKEN' || error.message === 'TOKEN_EXPIRED'))) {
        setError('认证已过期，请重新登录。');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setError(id ? '更新域名配置失败。' : '创建域名配置失败。');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{id ? '编辑域名配置' : '添加域名配置'}</h1>
          <p className="text-gray-600 mt-1">配置域名的SEO设置和Google集成</p>
        </div>
        <button
          onClick={() => navigate('/admin/domains')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            域名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.domain}
            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            站点名称 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.site_name}
            onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="AI株式診断"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            站点描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={formData.site_description}
            onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="最新のAI技術を活用した株式分析システム"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Ads Publisher ID
            </label>
            <input
              type="text"
              value={formData.google_ads_publisher_id}
              onChange={(e) => setFormData({ ...formData, google_ads_publisher_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ca-pub-xxxxxxxxxxxxxxxx"
            />
            <p className="mt-2 text-xs text-gray-500">
              配置后将自动生成 ads.txt 文件。未配置时访问 /ads.txt 将显示"未配置"提示。
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Google Analytics ID
            </label>
            <input
              type="text"
              value={formData.google_analytics_id}
              onChange={(e) => setFormData({ ...formData, google_analytics_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="G-XXXXXXXXXX"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Verification Code
          </label>
          <input
            type="text"
            value={formData.google_verification_code}
            onChange={(e) => setFormData({ ...formData, google_verification_code: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="google-site-verification: google..."
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">激活</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_default}
              onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">设为默认</span>
          </label>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? '保存中...' : '保存'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/domains')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
