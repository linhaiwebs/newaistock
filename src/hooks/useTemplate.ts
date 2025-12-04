import { useState, useEffect } from 'react';
import { getActiveTemplate } from '../lib/api';
import { TemplateData } from '../types/template';

const CACHE_KEY = 'activeTemplate';
const CACHE_DURATION = 5 * 60 * 1000;

interface CachedTemplate {
  data: TemplateData;
  timestamp: number;
}

export function useTemplate() {
  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplate();
  }, []);

  async function loadTemplate() {
    try {
      setLoading(true);
      setError(null);

      const cached = getCachedTemplate();
      if (cached) {
        console.log('[useTemplate] Using cached template:', cached.template_key);
        setTemplate(cached);
        setLoading(false);
        return;
      }

      console.log('[useTemplate] Fetching active template from API...');
      const response = await getActiveTemplate();
      console.log('[useTemplate] Received template:', response.template?.template_key);

      const templateData: TemplateData = {
        id: response.template.id,
        name: response.template.name,
        template_key: response.template.template_key,
        config: response.template.config,
        content: response.content,
        footerConfig: response.footerConfig,
      };

      setTemplate(templateData);
      cacheTemplate(templateData);
      console.log('[useTemplate] Template loaded successfully');
    } catch (err) {
      console.error('[useTemplate] Failed to load template:', err);
      setError('Failed to load template');
    } finally {
      setLoading(false);
      console.log('[useTemplate] Loading complete');
    }
  }

  function getCachedTemplate(): TemplateData | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp }: CachedTemplate = JSON.parse(cached);
      const now = Date.now();

      if (now - timestamp < CACHE_DURATION) {
        return data;
      }

      console.log('[useTemplate] Cache expired, removing...');
      localStorage.removeItem(CACHE_KEY);
      return null;
    } catch (error) {
      console.error('[useTemplate] Failed to parse cached template, clearing...', error);
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
  }

  function cacheTemplate(data: TemplateData) {
    try {
      const cached: CachedTemplate = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cached));
    } catch {
      // Ignore cache errors
    }
  }

  function refetch() {
    localStorage.removeItem(CACHE_KEY);
    loadTemplate();
  }

  return {
    template,
    loading,
    error,
    refetch,
  };
}
