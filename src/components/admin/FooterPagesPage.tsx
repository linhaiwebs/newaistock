import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';

interface FooterPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface FooterPageFormData {
  title: string;
  slug: string;
  content: string;
  display_order: number;
  is_active: boolean;
}

export function FooterPagesPage() {
  const [pages, setPages] = useState<FooterPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<FooterPage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<FooterPageFormData>({
    title: '',
    slug: '',
    content: '',
    display_order: 0,
    is_active: true,
  });

  useEffect(() => {
    loadPages();
  }, []);

  async function loadPages() {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/footer-pages', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load pages');
      }

      const data = await response.json();
      setPages(data.pages || []);
    } catch (error) {
      console.error('Error loading pages:', error);
      alert('Failed to load footer pages');
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(page: FooterPage) {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      display_order: page.display_order,
      is_active: page.is_active,
    });
    setIsCreating(false);
  }

  function handleCreate() {
    setIsCreating(true);
    setEditingPage(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      display_order: pages.length + 1,
      is_active: true,
    });
  }

  function handleCancel() {
    setIsCreating(false);
    setEditingPage(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      display_order: 0,
      is_active: true,
    });
  }

  async function handleSave() {
    try {
      const token = localStorage.getItem('adminToken');

      if (editingPage) {
        const response = await fetch(`/api/admin/footer-pages/${editingPage.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to update page');
        }

        alert('Page updated successfully');
      } else {
        const response = await fetch('/api/admin/footer-pages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to create page');
        }

        alert('Page created successfully');
      }

      handleCancel();
      loadPages();
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Failed to save page');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this page?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/footer-pages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete page');
      }

      alert('Page deleted successfully');
      loadPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page');
    }
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function handleTitleChange(title: string) {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Footer Pages</h1>
          <p className="text-gray-600 mt-2">Manage footer pages like Privacy Policy, Terms, etc.</p>
        </div>
        {!isCreating && !editingPage && (
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            New Page
          </button>
        )}
      </div>

      {(isCreating || editingPage) && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">
            {editingPage ? 'Edit Page' : 'Create New Page'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Privacy Policy"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., privacy-policy"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will be used in the URL: /footer-page/{formData.slug}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content (Markdown supported)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="# Heading&#10;## Subheading&#10;&#10;Content goes here..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{page.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{page.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{page.display_order}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {page.is_active ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <Eye className="w-4 h-4" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-400 text-sm">
                      <EyeOff className="w-4 h-4" />
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(page.updated_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(page)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(page.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No footer pages yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
