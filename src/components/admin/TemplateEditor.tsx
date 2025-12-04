import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle, Copy, ChevronDown, ChevronRight } from 'lucide-react';
import { getTemplateDetail, updateTemplateContent, updateTemplate, AuthError } from '../../lib/api';
import { requireValidToken } from '../../lib/auth';
import { TEMPLATE_CATEGORIES, getCategoryBadgeClass, getCategoryIcon } from '../../lib/categories';
import { FooterConfigCopyModal } from './FooterConfigCopyModal';
import type { FooterConfig } from '../../types/template';

interface ContentItem {
  id?: string;
  content_key: string;
  content_value: string;
  content_type: string;
}

interface Template {
  id: string;
  name: string;
  template_key: string;
  description: string;
  content: ContentItem[];
  category: string | null;
  category_order: number;
  footer_config?: FooterConfig;
}

export function TemplateEditor() {
  const { id } = useParams<{ id: string }>();
  const [template, setTemplate] = useState<Template | null>(null);
  const [editedContent, setEditedContent] = useState<ContentItem[]>([]);
  const [editedCategory, setEditedCategory] = useState<string>('general');
  const [editedCategoryOrder, setEditedCategoryOrder] = useState<number>(0);
  const [editedFooterConfig, setEditedFooterConfig] = useState<FooterConfig>({
    disclaimer_title: '',
    tool_nature: '',
    investment_disclaimer: '',
    user_responsibility: '',
    license_statement: '',
    compliance_statement: '',
    google_ads_compliance: '',
    risk_warning: '',
    data_accuracy: '',
    updated_date: '',
    contact_info: '',
  });
  const [footerConfigExpanded, setFooterConfigExpanded] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadTemplate();
    }
  }, [id]);

  async function loadTemplate() {
    try {
      setError('');
      const token = requireValidToken();
      const data = await getTemplateDetail(token, id!);
      setTemplate(data);
      setEditedContent(data.content || []);
      setEditedCategory(data.category || 'general');
      setEditedCategoryOrder(data.category_order || 0);
      if (data.footer_config && Object.keys(data.footer_config).length > 0) {
        setEditedFooterConfig(data.footer_config);
      }
    } catch (error) {
      console.error('Failed to load template:', error);
      if (error instanceof AuthError || (error instanceof Error && (error.message === 'NO_TOKEN' || error.message === 'TOKEN_EXPIRED'))) {
        setError('认证已过期，请重新登录。');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setError('加载模板详情失败。');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setError('');
      setSuccess('');
      setSaving(true);
      const token = requireValidToken();

      await updateTemplate(token, id!, {
        category: editedCategory,
        category_order: editedCategoryOrder,
        footer_config: editedFooterConfig,
      });

      await updateTemplateContent(token, id!, editedContent);

      setSuccess('保存成功！');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to save template:', error);
      if (error instanceof AuthError || (error instanceof Error && (error.message === 'NO_TOKEN' || error.message === 'TOKEN_EXPIRED'))) {
        setError('认证已过期，请重新登录。');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setError('保存失败，请重试。');
      }
    } finally {
      setSaving(false);
    }
  }

  function updateContent(key: string, value: string) {
    setEditedContent(prev =>
      prev.map(item =>
        item.content_key === key ? { ...item, content_value: value } : item
      )
    );
  }

  function updateFooterConfig(key: keyof FooterConfig, value: string) {
    setEditedFooterConfig(prev => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleCopySuccess(config: FooterConfig) {
    setEditedFooterConfig(config);
    setSuccess('页脚配置已成功复制！请检查并根据需要调整内容。');
    setTimeout(() => setSuccess(''), 5000);
  }

  function getContentLabel(key: string): string {
    const labels: Record<string, string> = {
      hero_title: '主标题',
      hero_subtitle: '副标题',
      hero_description: '描述文字',
      hero_button_text: '按钮文字',
      feature_1_title: '特性1标题',
      feature_1_description: '特性1描述',
      feature_2_title: '特性2标题',
      feature_2_description: '特性2描述',
      feature_3_title: '特性3标题',
      feature_3_description: '特性3描述',
      result_title: '结果页标题',
      result_button_text: '结果页按钮',
      analyzing_title: '分析中标题',
      analyzing_description: '分析中描述',
      footer_text: '页脚文字',
    };
    return labels[key] || key;
  }

  function getContentGroup(key: string): string {
    if (key.startsWith('hero_')) return '首页顶部';
    if (key.startsWith('feature_')) return '特性介绍';
    if (key.startsWith('result_')) return '结果页面';
    if (key.startsWith('analyzing_')) return '分析页面';
    if (key.startsWith('footer_')) return '页脚';
    return '其他';
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">模板不存在</div>
      </div>
    );
  }

  // 按组分类内容
  const groupedContent = editedContent.reduce((acc, item) => {
    const group = getContentGroup(item.content_key);
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, ContentItem[]>);

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/templates')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{template.name}</h1>
          <p className="text-gray-600">{template.description}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? '保存中...' : '保存更改'}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      <div className="mb-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">模板元数据</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              分类
            </label>
            <select
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
            >
              {Object.values(TEMPLATE_CATEGORIES).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name} - {cat.description}
                </option>
              ))}
            </select>
            <div className="mt-2 flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(editedCategory)}`}>
                {getCategoryIcon(editedCategory)} {editedCategory}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              分类内排序 (数字越小越靠前)
            </label>
            <input
              type="number"
              value={editedCategoryOrder}
              onChange={(e) => setEditedCategoryOrder(parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              同分类内的模板将按此值排序显示
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedContent).map(([group, items]) => (
          <div key={group} className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{group}</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.content_key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {getContentLabel(item.content_key)}
                  </label>
                  {item.content_type === 'html' || item.content_value.length > 100 ? (
                    <textarea
                      value={item.content_value}
                      onChange={(e) => updateContent(item.content_key, e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={item.content_value}
                      onChange={(e) => updateContent(item.content_key, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    键名: {item.content_key} | 类型: {item.content_type}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <button
            onClick={() => setFooterConfigExpanded(!footerConfigExpanded)}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {footerConfigExpanded ? (
                <ChevronDown className="w-6 h-6 text-blue-600" />
              ) : (
                <ChevronRight className="w-6 h-6 text-blue-600" />
              )}
              <h2 className="text-xl font-bold text-gray-900">页脚配置</h2>
              <span className="text-sm text-gray-600">（免责声明、合规说明等）</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCopyModal(true);
              }}
              className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              从其他模板复制
            </button>
          </button>

          {footerConfigExpanded && (
            <div className="p-6 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                页脚配置用于显示免责声明、合规说明等法律和风险提示信息。所有字段都支持编辑和保存。
              </div>

              <div className="grid grid-cols-1 gap-6">
                {[
                  { key: 'disclaimer_title', label: '免责声明标题', rows: 1, recommended: '50字以内' },
                  { key: 'tool_nature', label: '工具性质说明', rows: 3, recommended: '200-300字' },
                  { key: 'investment_disclaimer', label: '投资免责声明', rows: 3, recommended: '200-300字' },
                  { key: 'user_responsibility', label: '用户责任说明', rows: 3, recommended: '150-250字' },
                  { key: 'license_statement', label: '许可证声明', rows: 2, recommended: '100-150字' },
                  { key: 'compliance_statement', label: '合规声明', rows: 3, recommended: '150-250字' },
                  { key: 'google_ads_compliance', label: 'Google广告合规', rows: 2, recommended: '100-150字' },
                  { key: 'risk_warning', label: '风险警告', rows: 3, recommended: '200-300字' },
                  { key: 'data_accuracy', label: '数据准确性声明', rows: 3, recommended: '150-250字' },
                  { key: 'updated_date', label: '更新日期', rows: 1, recommended: '例如：2024年12月' },
                  { key: 'contact_info', label: '联系信息（可选）', rows: 2, recommended: '100字以内' },
                ].map(({ key, label, rows, recommended }) => {
                  const value = editedFooterConfig[key as keyof FooterConfig] || '';
                  return (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {label}
                        <span className="ml-2 text-xs font-normal text-gray-500">
                          建议：{recommended} | 当前：{value.length}字
                        </span>
                      </label>
                      <textarea
                        value={value}
                        onChange={(e) => updateFooterConfig(key as keyof FooterConfig, e.target.value)}
                        rows={rows}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                        placeholder={`请输入${label}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <FooterConfigCopyModal
        isOpen={showCopyModal}
        onClose={() => setShowCopyModal(false)}
        currentTemplateId={id!}
        onCopySuccess={handleCopySuccess}
      />

      <div className="mt-8 flex justify-end gap-4">
        <button
          onClick={() => navigate('/admin/templates')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          {saving ? '保存中...' : '保存更改'}
        </button>
      </div>
    </div>
  );
}
