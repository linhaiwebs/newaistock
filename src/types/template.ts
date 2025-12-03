export interface TemplateConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  fonts?: {
    heading?: string;
    body?: string;
  };
}

export interface TemplateContentItem {
  value: string;
  type: 'text' | 'html' | 'image_url';
}

export interface TemplateContent {
  [key: string]: TemplateContentItem;
}

export interface TemplateData {
  id: string;
  name: string;
  template_key: string;
  config: TemplateConfig;
  content: TemplateContent;
}

export interface TemplateProps {
  template: TemplateData;
  getContent: (key: string, defaultValue?: string) => string;
}
