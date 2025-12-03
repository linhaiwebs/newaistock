import { TemplateContent } from '../types/template';

export function useTemplateContent(content: TemplateContent | undefined) {
  function getContent(key: string, defaultValue: string = ''): string {
    return content?.[key]?.value || defaultValue;
  }

  function getContentType(key: string): 'text' | 'html' | 'image_url' {
    return content?.[key]?.type || 'text';
  }

  function hasContent(key: string): boolean {
    return !!content?.[key];
  }

  return {
    getContent,
    getContentType,
    hasContent,
  };
}
