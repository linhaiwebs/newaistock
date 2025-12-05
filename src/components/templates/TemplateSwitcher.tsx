import { lazy, Suspense, ComponentType } from 'react';
import { useTemplate } from '../../hooks/useTemplate';
import { useTemplateContent } from '../../hooks/useTemplateContent';
import { TemplateDefault } from './default';
import { TemplateProps, TemplateData } from '../../types/template';

const templateCache = new Map<string, ComponentType<TemplateProps>>();

function getTemplateComponent(key: string): ComponentType<TemplateProps> {
  if (templateCache.has(key)) {
    return templateCache.get(key)!;
  }

  try {
    let TemplateComponent: ComponentType<TemplateProps>;

    switch (key) {
      case 'default':
        TemplateComponent = lazy(() => import('./default').then(m => ({ default: m.TemplateDefault })));
        break;
      case 'minimal':
        TemplateComponent = lazy(() => import('./minimal').then(m => ({ default: m.TemplateMinimal })));
        break;
      case 'professional':
        TemplateComponent = lazy(() => import('./professional').then(m => ({ default: m.TemplateProfessional })));
        break;
      case 'modern':
        TemplateComponent = lazy(() => import('./modern').then(m => ({ default: m.TemplateModern })));
        break;
      case 'ai-stock':
        TemplateComponent = lazy(() => import('./ai-stock').then(m => ({ default: m.TemplateAiStock })));
        break;
      case 'tech-future':
        TemplateComponent = lazy(() => import('./tech-future').then(m => ({ default: m.TemplateTechFuture })));
        break;
      case 'zen-minimal':
        TemplateComponent = lazy(() => import('./zen-minimal').then(m => ({ default: m.TemplateZenMinimal })));
        break;
      case 'finance-pro':
        TemplateComponent = lazy(() => import('./finance-pro').then(m => ({ default: m.TemplateFinancePro })));
        break;
      case 'gradient-fluid':
        TemplateComponent = lazy(() => import('./gradient-fluid').then(m => ({ default: m.TemplateGradientFluid })));
        break;
      case 'dark-neon':
        TemplateComponent = lazy(() => import('./dark-neon').then(m => ({ default: m.TemplateDarkNeon })));
        break;
      case 'glass-morph':
        TemplateComponent = lazy(() => import('./glass-morph').then(m => ({ default: m.TemplateGlassMorph })));
        break;
      case 'card-grid':
        TemplateComponent = lazy(() => import('./card-grid').then(m => ({ default: m.TemplateCardGrid })));
        break;
      case 'ultra-lines':
        TemplateComponent = lazy(() => import('./ultra-lines').then(m => ({ default: m.TemplateUltraLines })));
        break;
      case 'warm-orange':
        TemplateComponent = lazy(() => import('./warm-orange').then(m => ({ default: m.TemplateWarmOrange })));
        break;
      case 'business-premium':
        TemplateComponent = lazy(() => import('./business-premium').then(m => ({ default: m.TemplateBusinessPremium })));
        break;
      default:
        TemplateComponent = lazy(() =>
          import(`./${key}/index.tsx`).then(m => ({
            default: m[`Template${key.charAt(0).toUpperCase() + key.slice(1)}`] || m.default
          }))
          .catch(() => ({ default: TemplateDefault }))
        );
    }

    templateCache.set(key, TemplateComponent);
    return TemplateComponent;
  } catch (error) {
    console.error(`Failed to load template: ${key}`, error);
    return TemplateDefault;
  }
}

export function TemplateSwitcher() {
  const { template, loading, error } = useTemplate();
  const { getContent } = useTemplateContent(template?.content);

  console.log('[TemplateSwitcher] State:', { loading, error, hasTemplate: !!template, templateKey: template?.template_key });

  if (loading) {
    console.log('[TemplateSwitcher] Showing loading screen');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    const defaultTemplate: TemplateData = {
      id: 'default',
      name: 'デフォルトテンプレート',
      template_key: 'default',
      config: {
        colors: {
          primary: '#2563eb',
          secondary: '#1e40af',
          accent: '#4f46e5',
        },
      },
      content: {},
      footerConfig: {
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
      },
    };

    const TemplateComponent = TemplateDefault;
    return <TemplateComponent template={defaultTemplate} getContent={getContent} />;
  }

  const TemplateComponent = getTemplateComponent(template.template_key);

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">テンプレート読み込み中...</p>
        </div>
      </div>
    }>
      <TemplateComponent template={template} getContent={getContent} />
    </Suspense>
  );
}
