import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Plus, Edit2, Trash2, AlertCircle, CheckCircle, Star, ExternalLink } from 'lucide-react';
import { getDomains, deleteDomain, clearDomainCache, AuthError } from '../../lib/api';
import { requireValidToken } from '../../lib/auth';

interface DomainConfig {
  id: string;
  domain: string;
  site_name: string;
  site_description: string;
  google_ads_publisher_id?: string;
  google_verification_code?: string;
  google_analytics_id?: string;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
}

export function DomainsPage() {
  const [domains, setDomains] = useState<DomainConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDomains();
  }, []);

  async function loadDomains() {
    try {
      setError('');
      const token = requireValidToken();
      const data = await getDomains(token);
      setDomains(data);
    } catch (error) {
      console.error('Failed to load domains:', error);
      if (error instanceof AuthError || (error instanceof Error && (error.message === 'NO_TOKEN' || error.message === 'TOKEN_EXPIRED'))) {
        setError('认证已过期，请重新登录。');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setError('加载域名列表失败。');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, domain: string, isDefault: boolean) {
    if (isDefault) {
      setError('无法删除默认域名配置。');
      return;
    }

    if (!confirm(`确定要删除域名 "${domain}" 吗？`)) return;

    try {
      setError('');
      const token = requireValidToken();
      await deleteDomain(token, id);
      setSuccess('域名删除成功！');
      setTimeout(() => setSuccess(''), 3000);
      loadDomains();
    } catch (error) {
      console.error('Failed to delete domain:', error);
      if (error instanceof AuthError || (error instanceof Error && (error.message === 'NO_TOKEN' || error.message === 'TOKEN_EXPIRED'))) {
        setError('认证已过期，请重新登录。');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setError('删除域名失败。');
      }
    }
  }

  async function handleClearCache(domain?: string) {
    try {
      setError('');
      const token = requireValidToken();
      await clearDomainCache(token, domain);
      setSuccess(domain ? `域名 ${domain} 缓存已清除！` : '所有缓存已清除！');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to clear cache:', error);
      setError('清除缓存失败。');
    }
  }

  function handleEdit(id: string) {
    navigate(`/admin/domains/${id}/edit`);
  }

  function handleAdd() {
    navigate('/admin/domains/new');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">域名管理</h1>
          <p className="text-gray-600">配置多域名和Google Ads合规文件</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          添加域名
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {domains.map((domain) => (
          <div
            key={domain.id}
            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg ${
              domain.is_default ? 'ring-2 ring-yellow-500' : ''
            }`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">{domain.domain}</h3>
                    {domain.is_default && (
                      <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                        <Star className="w-3 h-3" />
                        默认
                      </span>
                    )}
                    {!domain.is_active && (
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                        未激活
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mb-1">{domain.site_name}</p>
                  <p className="text-sm text-gray-600 mb-3">{domain.site_description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Google Ads:</span>{' '}
                      <span className="font-medium text-gray-900">
                        {domain.google_ads_publisher_id || '未配置'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">ads.txt:</span>{' '}
                      <span className={`font-medium ${domain.google_ads_publisher_id ? 'text-green-600' : 'text-gray-400'}`}>
                        {domain.google_ads_publisher_id ? '已配置' : '未配置'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Google Analytics:</span>{' '}
                      <span className="font-medium text-gray-900">
                        {domain.google_analytics_id || '未配置'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">验证码:</span>{' '}
                      <span className="font-medium text-gray-900">
                        {domain.google_verification_code ? '已配置' : '未配置'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(domain.id)}
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    title="编辑"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>

                  {!domain.is_default && (
                    <button
                      onClick={() => handleDelete(domain.id, domain.domain, domain.is_default)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    合规文件：
                    <a
                      href={`https://${domain.domain}/robots.txt`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      robots.txt
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={`https://${domain.domain}/ads.txt`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      ads.txt
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={`https://${domain.domain}/sitemap.xml`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      sitemap.xml
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <button
                    onClick={() => handleClearCache(domain.domain)}
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    清除缓存
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {domains.length === 0 && !loading && (
        <div className="text-center py-12">
          <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">暂无域名配置</p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <Plus className="w-5 h-5" />
            添加第一个域名
          </button>
        </div>
      )}
    </div>
  );
}
