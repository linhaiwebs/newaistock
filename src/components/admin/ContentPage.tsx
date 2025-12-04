import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../../hooks/useContent';
import { Edit2, Trash2, Plus, Save, X, Search } from 'lucide-react';

export default function ContentPage() {
  const navigate = useNavigate();
  const { details, loading, error, updateContent, createContent, deleteContent } = useContent();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ content: '', category: '', description: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({ key: '', content: '', category: '', description: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = Array.from(new Set(details.map(item => item.category)));

  const filteredDetails = details.filter(item => {
    const matchesSearch = item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (item: any) => {
    setEditingKey(item.key);
    setEditForm({
      content: item.content,
      category: item.category,
      description: item.description || ''
    });
  };

  const handleSave = async (key: string) => {
    try {
      await updateContent(key, editForm.content, editForm.category, editForm.description);
      setEditingKey(null);
    } catch (err) {
      if (err instanceof Error && (err.message === 'NO_TOKEN' || err.message === 'TOKEN_EXPIRED')) {
        alert('認証が期限切れです。再度ログインしてください。');
        navigate('/admin/login');
        return;
      }
      alert('更新失敗: ' + (err instanceof Error ? err.message : '不明なエラー'));
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`「${key}」を削除しますか？`)) return;

    try {
      await deleteContent(key);
    } catch (err) {
      if (err instanceof Error && (err.message === 'NO_TOKEN' || err.message === 'TOKEN_EXPIRED')) {
        alert('認証が期限切れです。再度ログインしてください。');
        navigate('/admin/login');
        return;
      }
      alert('削除失敗: ' + (err instanceof Error ? err.message : '不明なエラー'));
    }
  };

  const handleCreate = async () => {
    if (!createForm.key || !createForm.content || !createForm.category) {
      alert('キー、コンテンツ、カテゴリは必須です');
      return;
    }

    try {
      await createContent(createForm.key, createForm.content, createForm.category, createForm.description);
      setIsCreating(false);
      setCreateForm({ key: '', content: '', category: '', description: '' });
    } catch (err) {
      if (err instanceof Error && (err.message === 'NO_TOKEN' || err.message === 'TOKEN_EXPIRED')) {
        alert('認証が期限切れです。再度ログインしてください。');
        navigate('/admin/login');
        return;
      }
      alert('作成失敗: ' + (err instanceof Error ? err.message : '不明なエラー'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        エラー: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">コンテンツ管理</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新しいコンテンツを追加
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全てのカテゴリ</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {isCreating && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">新しいコンテンツ</h3>
            <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">キー</label>
              <input
                type="text"
                value={createForm.key}
                onChange={(e) => setCreateForm({ ...createForm, key: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: hero.title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">コンテンツ</label>
              <textarea
                value={createForm.content}
                onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
              <input
                type="text"
                value={createForm.category}
                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例: hero"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">説明</label>
              <input
                type="text"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                保存
              </button>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setCreateForm({ key: '', content: '', category: '', description: '' });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">キー</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コンテンツ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">カテゴリ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">説明</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDetails.map((item) => (
                <tr key={item.key} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-900">{item.key}</span>
                  </td>
                  <td className="px-6 py-4">
                    {editingKey === item.key ? (
                      <textarea
                        value={editForm.content}
                        onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{item.content}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingKey === item.key ? (
                      <input
                        type="text"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.category}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingKey === item.key ? (
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <span className="text-sm text-gray-500">{item.description}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {editingKey === item.key ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSave(item.key)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingKey(null)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.key)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredDetails.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          コンテンツが見つかりません
        </div>
      )}
    </div>
  );
}
