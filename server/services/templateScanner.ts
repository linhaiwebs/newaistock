import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface TemplateMetadata {
  name: string;
  description: string;
  author?: string;
  version?: string;
  preview_image?: string;
  features?: string[];
  category?: string;
}

export interface ScannedTemplate {
  template_key: string;
  name: string;
  description: string;
  category: string;
  metadata: TemplateMetadata;
  hasIndexFile: boolean;
  folderPath: string;
}

export class TemplateScanner {
  private templatesPath: string;

  constructor() {
    const isProd = process.env.NODE_ENV === 'production';

    if (isProd) {
      this.templatesPath = path.resolve(__dirname, '../../../src/components/templates');
    } else {
      this.templatesPath = path.resolve(__dirname, '../../src/components/templates');
    }
  }

  async scanTemplates(): Promise<ScannedTemplate[]> {
    try {
      if (!fs.existsSync(this.templatesPath)) {
        console.error(`Templates path does not exist: ${this.templatesPath}`);
        return [];
      }

      const entries = fs.readdirSync(this.templatesPath, { withFileTypes: true });
      const templates: ScannedTemplate[] = [];

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const templateKey = entry.name;

        if (templateKey === 'shared') continue;

        const folderPath = path.join(this.templatesPath, templateKey);
        const indexPath = path.join(folderPath, 'index.tsx');
        const metadataPath = path.join(folderPath, 'metadata.json');

        const hasIndexFile = fs.existsSync(indexPath);

        if (!hasIndexFile) continue;

        let metadata: TemplateMetadata;

        if (fs.existsSync(metadataPath)) {
          try {
            const metadataContent = fs.readFileSync(metadataPath, 'utf-8');
            metadata = JSON.parse(metadataContent);
          } catch (error) {
            console.error(`Failed to parse metadata for ${templateKey}:`, error);
            metadata = this.getDefaultMetadata(templateKey);
          }
        } else {
          metadata = this.getDefaultMetadata(templateKey);
        }

        templates.push({
          template_key: templateKey,
          name: metadata.name,
          description: metadata.description,
          category: metadata.category || 'general',
          metadata,
          hasIndexFile,
          folderPath,
        });
      }

      return templates;
    } catch (error) {
      console.error('Template scanning error:', error);
      throw new Error('Failed to scan templates directory');
    }
  }

  private getDefaultMetadata(templateKey: string): TemplateMetadata {
    const nameMap: Record<string, string> = {
      'default': '默认模板',
      'minimal': '简约模板',
      'professional': '专业模板',
      'modern': '现代模板',
    };

    const descMap: Record<string, string> = {
      'default': '功能齐全的默认落地页模板',
      'minimal': '简洁清爽的极简设计模板',
      'professional': '适合企业级应用的专业模板',
      'modern': '现代化设计风格的模板',
    };

    return {
      name: nameMap[templateKey] || this.capitalize(templateKey) + '模板',
      description: descMap[templateKey] || `${this.capitalize(templateKey)}风格的落地页模板`,
      author: 'OAA Team',
      version: '1.0.0',
    };
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  async getAvailableTemplateKeys(): Promise<string[]> {
    const templates = await this.scanTemplates();
    return templates.map(t => t.template_key);
  }
}

export const templateScanner = new TemplateScanner();
