import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Check, Edit2, Trash2, AlertCircle, Eye, RefreshCw, CheckCircle, Filter } from 'lucide-react';
import { getAllTemplates, activateTemplate, deleteTemplate, scanTemplates, syncTemplates, AuthError } from '../../lib/api';
import { requireValidToken } from '../../lib/auth';
import { CATEGORY_OPTIONS, getCategoryBadgeClass, getCategoryIcon } from '../../lib/categories';

interface Template {
  id: string;
  name: string;
  template_key: string;
  description: string;
  is_active: boolean;
  preview_image: string | null;
  created_at: string;
  category: string | null;
  category_order: number;
}

export function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory]);

  async function loadTemplates() {
    try {
      setError('');
      const token = requireValidToken();
      const data = await getAllTemplates(token, selectedCategory !== 'all' ? selectedCategory : undefined);
      setTemplates(data);
    } catch (error) {
      console.error('Failed to load templates:', error);
      if (error instanceof AuthError || (error instanceof Error && (error.message === 'NO_TOKEN' || error.message === 'TOKEN_EXPIRED'))) {
        setError('认证已过期，请重新登录。');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setError('加载模板列表失败。');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleActivate(id: string) {
    try {
      setError('');
      const token = requireValidToken();
      await activateTemplate(token, id);

      localStorage.removeItem('activeTemplate');

      try {
        const channel = new BroadcastChannel('template-updates');
        channel.postMessage('template-updated');
        channel.close();
      } catch (e) {
        console.warn('BroadcastChannel not supported');
      }

      setSuccess('模板已激活！前端页面将自动刷新。');
      setTimeout(() => setSuccess(''), 3000);

      loadTemplates();
    } catch (error) {
      console.error('Failed to activate template:', error);
      if (error instanceof AuthError || (error instanceof Error && (error.message === 'NO_TOKEN' || error.message === 'TOKEN_EXPIRED'))) {
        setError('认证已过期，请重新登录。');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setError('激活模板失败。');
      }
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`确定要删除模板 "${name}" 吗？`)) return;

    try {
      setError('');
      const token = requireValidToken();
      await deleteTemplate(token, id);
      loadTemplates();
    } catch (error) {
      console.error('Failed to delete template:', error);
      if (error instanceof AuthError || (error instanceof Error && (error.message === 'NO_TOKEN' || error.message === 'TOKEN_EXPIRED'))) {
        setError('认证已过期，请重新登录。');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setError('删除模板失败。无法删除激活的模板。');
      }
    }
  }

  function handleEdit(id: string) {
    navigate(`/admin/templates/${id}/edit`);
  }

  async function handleSyncTemplates() {
    try {
      setSyncing(true);
      setError('');
      setSuccess('');
      const token = requireValidToken();
      const result = await syncTemplates(token);

      const addedCount = result.results.added.length;
      const missingCount = result.results.missing.length;

      let message = '模板同步完成！';
      if (addedCount > 0) {
        message += ` 新增 ${addedCount} 个模板。`;
      }
      if (missingCount > 0) {
        message += ` 发现 ${missingCount} 个模板文件缺失。`;
      }
      if (addedCount === 0 && missingCount === 0) {
        message += ' 所有模板已是最新。';
      }

      setSuccess(message);
      loadTemplates();

      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('Failed to sync templates:', error);
      if (error instanceof AuthError || (error instanceof Error && (error.message === 'NO_TOKEN' || error.message === 'TOKEN_EXPIRED'))) {
        setError('认证已过期，请重新登录。');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setError('同步模板失败，请重试。');
      }
    } finally {
      setSyncing(false);
    }
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

      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">模板管理</h1>
            <p className="text-gray-600">管理和切换落地页模板</p>
          </div>
          <button
            onClick={handleSyncTemplates}
            disabled={syncing}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
          >
            <RefreshCw className={`w-5 h-5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? '同步中...' : '扫描并同步模板'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">分类筛选:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            显示 {templates.length} 个模板
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg ${
              template.is_active ? 'ring-2 ring-green-500' : ''
            }`}
          >
            <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              {template.preview_image ? (
                <img
                  src={template.preview_image}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Layout className="w-16 h-16 text-gray-400" />
              )}
              {template.is_active && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  已激活
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-gray-900 flex-1">{template.name}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(template.category)}`}>
                  {getCategoryIcon(template.category)} {template.category || 'general'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>

              <div className="flex items-center gap-2">
                {!template.is_active ? (
                  <button
                    onClick={() => handleActivate(template.id)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                  >
                    激活
                  </button>
                ) : (
                  <div className="flex-1 bg-green-50 text-green-700 py-2 px-4 rounded-lg text-sm font-semibold text-center">
                    当前激活
                  </div>
                )}

                <button
                  onClick={() => handleEdit(template.id)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  title="编辑"
                >
                  <Edit2 className="w-5 h-5" />
                </button>

                <a
                  href={`/?template=${template.template_key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title="预览"
                >
                  <Eye className="w-5 h-5" />
                </a>

                {!template.is_active && (
                  <button
                    onClick={() => handleDelete(template.id, template.name)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && !loading && (
        <div className="text-center py-12">
          <Layout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">暂无模板</p>
        </div>
      )}
    </div>
  );
}
