import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, Plus, Trash2, Edit2, Save, X, AlertCircle } from 'lucide-react';
import { getRedirectLinks, createRedirectLink, updateRedirectLink, deleteRedirectLink, AuthError } from '../../lib/api';
import { requireValidToken } from '../../lib/auth';

export function RedirectsPage() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    user_id: '',
    target_url: '',
    weight: 100,
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadLinks();
  }, []);

  async function loadLinks() {
    try {
      setError('');
      const token = requireValidToken();
      const data = await getRedirectLinks(token);
      setLinks(data);
    } catch (error) {
      console.error('Failed to load links:', error);
      if (error instanceof AuthError || (error instanceof Error && (error.message === 'NO_TOKEN' || error.message === 'TOKEN_EXPIRED'))) {
        setError('認証が必要です。再度ログインしてください。');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setError('リダイレクトリンクの読み込みに失敗しました。');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    try {
      setError('');
      const token = requireValidToken();
      await createRedirectLink(token, formData);
      setFormData({ user_id: '', target_url: '', weight: 100 });
      setShowAdd(false);
      loadLinks();
    } catch (error) {
      console.error('Failed to create link:', error);
      if (error instanceof AuthError || (error instanceof Error && (error.message === 'NO_TOKEN' || error.message === 'TOKEN_EXPIRED'))) {
        setError('認証が必要です。再度ログインしてください。');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setError('リダイレクトリンクの作成に失敗しました。');
      }
    }
  }

  async function handleUpdate(id: number, data: any) {
    try {
      setError('');
      const token = requireValidToken();
      await updateRedirectLink(token, id, data);
      setEditingId(null);
      loadLinks();
    } catch (error) {
      console.error('Failed to update link:', error);
      if (error instanceof AuthError || (error instanceof Error && (error.message === 'NO_TOKEN' || error.message === 'TOKEN_EXPIRED'))) {
        setError('認証が必要です。再度ログインしてください。');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setError('リダイレクトリンクの更新に失敗しました。');
      }
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('このリダイレクトリンクを削除しますか?')) return;

    try {
      setError('');
      const token = requireValidToken();
      await deleteRedirectLink(token, id);
      loadLinks();
    } catch (error) {
      console.error('Failed to delete link:', error);
      if (error instanceof AuthError || (error instanceof Error && (error.message === 'NO_TOKEN' || error.message === 'TOKEN_EXPIRED'))) {
        setError('認証が必要です。再度ログインしてください。');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setError('リダイレクトリンクの削除に失敗しました。');
      }
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">跳转链接管理</h1>
          <p className="text-gray-600">分流链接和权重设置</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          新增链接
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">新增跳转链接</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">用户ID</label>
              <input
                type="text"
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                placeholder="例如: user123"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">跳转URL</label>
              <input
                type="url"
                value={formData.target_url}
                onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                权重 (1-100)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                创建
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">加载中...</div>
        </div>
      ) : (
        <div className="space-y-4">
          {links.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              isEditing={editingId === link.id}
              onEdit={() => setEditingId(link.id)}
              onSave={(data) => handleUpdate(link.id, data)}
              onCancel={() => setEditingId(null)}
              onDelete={() => handleDelete(link.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LinkCard({
  link,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: {
  link: any;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => void;
  onCancel: () => void;
  onDelete: () => void;
}) {
  const [editData, setEditData] = useState({
    target_url: link.target_url,
    weight: link.weight,
    active: link.active,
  });

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">リダイレクトURL</label>
            <input
              type="url"
              value={editData.target_url}
              onChange={(e) => setEditData({ ...editData, target_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">重み (1-100)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={editData.weight}
              onChange={(e) => setEditData({ ...editData, weight: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`active-${link.id}`}
              checked={editData.active}
              onChange={(e) => setEditData({ ...editData, active: e.target.checked })}
              className="w-4 h-4 text-blue-600"
            />
            <label htmlFor={`active-${link.id}`} className="text-sm text-gray-700">
              启用
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onSave(editData)}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              保存
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              キャンセル
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Link2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">ID: {link.id}</div>
              <div className="text-sm text-gray-500">ユーザー: {link.user_id}</div>
            </div>
            {link.active ? (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                启用
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-semibold">
                無効
              </span>
            )}
          </div>

          <div className="mb-3">
            <div className="text-sm text-gray-600 mb-1">リダイレクトURL:</div>
            <div className="text-sm text-blue-600 break-all">{link.target_url}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">重み</div>
              <div className="text-lg font-semibold text-gray-900">{link.weight}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">クリック数</div>
              <div className="text-lg font-semibold text-gray-900">{link.click_count}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
