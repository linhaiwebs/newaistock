import { TemplateContent } from '../types/template';

export function getContent(
  content: TemplateContent | undefined,
  key: string,
  defaultValue: string = ''
): string {
  return content?.[key]?.value || defaultValue;
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getColorClass(color: string, type: 'bg' | 'text' | 'border'): string {
  return `${type}-${color}`;
}
