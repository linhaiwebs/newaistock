import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle, RotateCcw } from 'lucide-react';
import { getDomain, createDomain, updateDomain, AuthError } from '../../lib/api';
import { requireValidToken } from '../../lib/auth';
import { FooterConfig } from '../../types/template';

const defaultFooterConfig: FooterConfig = {
  disclaimer_title: '重要事項・免責事項',
  tool_nature: '本サービスは、人工知能（AI）技術を活用した株式分析ツールです。市場データの収集と分析を行い、情報提供を目的としています。',
  investment_disclaimer: '本サービスで提供される分析結果、情報、データ等は、投資判断の参考情報として提供するものであり、投資勧誘、売買推奨、または専門的な金融アドバイスを目的としたものではありません。',
  user_responsibility: '投資判断および投資行動は、利用者ご自身の責任において行っていただく必要があります。投資による損益は全て投資家ご自身に帰属し、当サービスは一切の責任を負いません。',
  license_statement: '本サービスは情報提供ツールであり、金融商品取引業務を行うものではありません。したがって、日本の金融庁による金融商品取引業の登録・免許を必要としません。',
  compliance_statement: '本サービスは日本の金融商品取引法その他関連法令を遵守し、客観的なデータ分析と情報提供のみを行います。特定の金融商品の勧誘や販売を行うものではありません。',
  google_ads_compliance: '本サービスはGoogle広告ポリシーを遵守しており、規制対象となる金融サービスの提供は行っておりません。',
  risk_warning: '株式投資にはリスクが伴います。投資元本の損失が生じる可能性があることを十分にご理解の上、ご利用ください。',
  data_accuracy: '本サービスは情報の正確性確保に努めておりますが、提供する情報の完全性、正確性、有用性、適時性について保証するものではありません。',
  updated_date: '2025年12月',
  contact_info: '',
};

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
    footer_config: defaultFooterConfig,
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
        footer_config: data.footer_config || defaultFooterConfig,
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

  function resetFooterConfig() {
    setFormData({ ...formData, footer_config: defaultFooterConfig });
  }

  function updateFooterConfig(field: keyof FooterConfig, value: string) {
    setFormData({
      ...formData,
      footer_config: {
        ...formData.footer_config,
        [field]: value,
      },
    });
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

        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">页脚配置</h3>
              <p className="text-sm text-gray-600">配置合规免责声明内容</p>
            </div>
            <button
              type="button"
              onClick={resetFooterConfig}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <RotateCcw className="w-4 h-4" />
              恢复默认
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                免责声明标题
              </label>
              <input
                type="text"
                value={formData.footer_config.disclaimer_title}
                onChange={(e) => updateFooterConfig('disclaimer_title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                工具性质说明
              </label>
              <textarea
                value={formData.footer_config.tool_nature}
                onChange={(e) => updateFooterConfig('tool_nature', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                投资免责声明
              </label>
              <textarea
                value={formData.footer_config.investment_disclaimer}
                onChange={(e) => updateFooterConfig('investment_disclaimer', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户责任说明
              </label>
              <textarea
                value={formData.footer_config.user_responsibility}
                onChange={(e) => updateFooterConfig('user_responsibility', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                执照说明
              </label>
              <textarea
                value={formData.footer_config.license_statement}
                onChange={(e) => updateFooterConfig('license_statement', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                法律合规声明
              </label>
              <textarea
                value={formData.footer_config.compliance_statement}
                onChange={(e) => updateFooterConfig('compliance_statement', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Ads合规说明
              </label>
              <textarea
                value={formData.footer_config.google_ads_compliance}
                onChange={(e) => updateFooterConfig('google_ads_compliance', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                风险警告
              </label>
              <textarea
                value={formData.footer_config.risk_warning}
                onChange={(e) => updateFooterConfig('risk_warning', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                数据准确性声明
              </label>
              <textarea
                value={formData.footer_config.data_accuracy}
                onChange={(e) => updateFooterConfig('data_accuracy', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  更新日期
                </label>
                <input
                  type="text"
                  value={formData.footer_config.updated_date}
                  onChange={(e) => updateFooterConfig('updated_date', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  联系信息（可选）
                </label>
                <input
                  type="text"
                  value={formData.footer_config.contact_info || ''}
                  onChange={(e) => updateFooterConfig('contact_info', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
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
