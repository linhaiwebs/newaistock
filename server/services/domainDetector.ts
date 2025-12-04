import { Request } from 'express';
import { supabase } from '../db/supabase.js';

interface DomainConfig {
  id: string;
  domain: string;
  site_name: string;
  site_description: string;
  google_ads_publisher_id?: string;
  google_verification_code?: string;
  google_analytics_id?: string;
  robots_config: any;
  ads_txt_content?: string;
  seo_config: any;
  footer_config?: any;
  is_active: boolean;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export class DomainDetector {
  private cache: Map<string, { config: DomainConfig | null; timestamp: number }> = new Map();
  private cacheTTL = 5 * 60 * 1000;

  extractDomain(req: Request): string {
    const forwardedHost = req.headers['x-forwarded-host'] as string;
    const host = forwardedHost || req.headers.host || req.hostname;

    const domain = host.split(':')[0];

    return domain;
  }

  async getDomainConfig(domain: string): Promise<DomainConfig | null> {
    const cached = this.cache.get(domain);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.config;
    }

    try {
      const { data, error } = await supabase
        .from('domain_configs')
        .select('*')
        .eq('domain', domain)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Domain config fetch error:', error);
        return null;
      }

      this.cache.set(domain, {
        config: data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error('Domain config error:', error);
      return null;
    }
  }

  async getDefaultConfig(): Promise<DomainConfig | null> {
    const cached = this.cache.get('__default__');
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.config;
    }

    try {
      const { data, error } = await supabase
        .from('domain_configs')
        .select('*')
        .eq('is_default', true)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Default config fetch error:', error);
        return null;
      }

      this.cache.set('__default__', {
        config: data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error('Default config error:', error);
      return null;
    }
  }

  async getConfigForRequest(req: Request): Promise<DomainConfig | null> {
    const domain = this.extractDomain(req);

    let config = await this.getDomainConfig(domain);

    if (!config) {
      config = await this.getDefaultConfig();
    }

    return config;
  }

  clearCache(domain?: string) {
    if (domain) {
      this.cache.delete(domain);
    } else {
      this.cache.clear();
    }
  }
}

export const domainDetector = new DomainDetector();
