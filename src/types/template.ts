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

export interface FooterConfig {
  disclaimer_title: string;
  tool_nature: string;
  investment_disclaimer: string;
  user_responsibility: string;
  license_statement: string;
  compliance_statement: string;
  google_ads_compliance: string;
  risk_warning: string;
  data_accuracy: string;
  updated_date: string;
  contact_info?: string;
}

export interface TemplateData {
  id: string;
  name: string;
  template_key: string;
  config: TemplateConfig;
  content: TemplateContent;
  footerConfig?: FooterConfig;
}

export interface TemplateProps {
  template: TemplateData;
  getContent: (key: string, defaultValue?: string) => string;
}
