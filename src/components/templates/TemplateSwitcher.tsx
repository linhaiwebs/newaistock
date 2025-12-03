import { lazy, Suspense, ComponentType } from 'react';
import { useTemplate } from '../../hooks/useTemplate';
import { useTemplateContent } from '../../hooks/useTemplateContent';
import { TemplateDefault } from './default';
import { TemplateProps } from '../../types/template';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    const defaultTemplate: TemplateData = {
      id: 'default',
      name: '默认模板',
      template_key: 'default',
      config: {
        colors: {
          primary: '#2563eb',
          secondary: '#1e40af',
          accent: '#4f46e5',
        },
      },
      content: {},
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
          <p className="text-gray-600">加载模板中...</p>
        </div>
      </div>
    }>
      <TemplateComponent template={template} getContent={getContent} />
    </Suspense>
  );
}
