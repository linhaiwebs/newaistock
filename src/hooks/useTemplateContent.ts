import { TemplateContent } from '../types/template';
import { useContent } from './useContent';

export function useTemplateContent(content: TemplateContent | undefined) {
  const { get: getDatabaseContent } = useContent();

  function getContent(key: string, defaultValue: string = ''): string {
    const dbContent = getDatabaseContent(key);
    if (dbContent) return dbContent;

    return content?.[key]?.value || defaultValue;
  }

  function getContentType(key: string): 'text' | 'html' | 'image_url' {
    return content?.[key]?.type || 'text';
  }

  function hasContent(key: string): boolean {
    return !!getDatabaseContent(key) || !!content?.[key];
  }

  return {
    getContent,
    getContentType,
    hasContent,
  };
}
