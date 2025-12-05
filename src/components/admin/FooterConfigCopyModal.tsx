import { useState, useEffect } from 'react';
import { X, Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { getAllTemplates, copyTemplateFooterConfig } from '../../lib/api';
import { requireValidToken } from '../../lib/auth';
import { getCategoryIcon, getCategoryBadgeClass } from '../../lib/categories';
import type { FooterConfig } from '../../types/template';

interface Template {
  id: string;
  name: string;
  template_key: string;
  description: string;
  category: string | null;
  footer_config?: FooterConfig;
}

interface FooterConfigCopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplateId: string;
  onCopySuccess: (config: FooterConfig) => void;
}

export function FooterConfigCopyModal({
  isOpen,
  onClose,
  currentTemplateId,
  onCopySuccess,
}: FooterConfigCopyModalProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['stock-analysis']));

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  async function loadTemplates() {
    try {
      setLoading(true);
      setError('');
      const token = requireValidToken();
      const data = await getAllTemplates(token);
      setTemplates(data.filter((t: Template) => t.id !== currentTemplateId));
    } catch (err) {
      console.error('Failed to load templates:', err);
      setError('模板列表加载失败');
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!selectedTemplateId) return;

    try {
      setCopying(true);
      setError('');
      const token = requireValidToken();
      const response = await copyTemplateFooterConfig(token, currentTemplateId, selectedTemplateId);
      onCopySuccess(response.footer_config);
      onClose();
    } catch (err) {
      console.error('Failed to copy footer config:', err);
      setError('页脚配置复制失败');
    } finally {
      setCopying(false);
    }
  }

  function toggleCategory(category: string) {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  }

  const templatesByCategory = templates.reduce((acc, template) => {
    const category = template.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(template);
    return acc;
  }, {} as Record<string, Template[]>);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);
  const hasFooterConfig = selectedTemplate?.footer_config && Object.keys(selectedTemplate.footer_config).length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">复制页脚配置</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                请选择一个模板来复制其页脚配置。配置将覆盖当前模板的页脚设置。
              </div>

              {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
                <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleCategory(category)}
                    className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center gap-2 text-left"
                  >
                    {expandedCategories.has(category) ? (
                      <ChevronDown className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    )}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getCategoryBadgeClass(category)}`}>
                      {getCategoryIcon(category)} {category}
                    </span>
                    <span className="text-sm text-gray-600">({categoryTemplates.length})</span>
                  </button>

                  {expandedCategories.has(category) && (
                    <div className="divide-y divide-gray-200">
                      {categoryTemplates.map((template) => {
                        const hasConfig = template.footer_config && Object.keys(template.footer_config).length > 0;
                        return (
                          <button
                            key={template.id}
                            onClick={() => setSelectedTemplateId(template.id)}
                            disabled={!hasConfig}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                              selectedTemplateId === template.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                            } ${!hasConfig ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{template.name}</div>
                              <div className="text-sm text-gray-600 mt-1">{template.description}</div>
                              {!hasConfig && (
                                <div className="text-xs text-orange-600 mt-1">此模板没有页脚配置</div>
                              )}
                            </div>
                            {selectedTemplateId === template.id && (
                              <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {selectedTemplate && hasFooterConfig && (
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">配置预览</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">免责声明标题：</span>
                  <span className="text-gray-600">{selectedTemplate.footer_config.disclaimer_title}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">工具性质：</span>
                  <span className="text-gray-600">
                    {selectedTemplate.footer_config.tool_nature?.substring(0, 100)}...
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">更新日期：</span>
                  <span className="text-gray-600">{selectedTemplate.footer_config.updated_date}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleCopy}
            disabled={!selectedTemplateId || copying || !hasFooterConfig}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            {copying ? '复制中...' : '复制配置'}
          </button>
        </div>
      </div>
    </div>
  );
}
