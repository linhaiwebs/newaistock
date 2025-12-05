import { useState, useEffect } from 'react';
import { getActiveTemplate } from '../lib/api';
import { TemplateData } from '../types/template';

const CACHE_KEY = 'activeTemplate';
const CACHE_DURATION = 5 * 60 * 1000;
const BROADCAST_CHANNEL_NAME = 'template-updates';

interface CachedTemplate {
  data: TemplateData;
  timestamp: number;
  configUpdatedAt: string | null;
}

export function useTemplate() {
  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplate();

    let broadcastChannel: BroadcastChannel | null = null;
    try {
      broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      broadcastChannel.onmessage = (event) => {
        if (event.data === 'template-updated') {
          console.log('[useTemplate] Received update notification, refetching...');
          localStorage.removeItem(CACHE_KEY);
          loadTemplate();
        }
      };
    } catch (e) {
      console.warn('[useTemplate] BroadcastChannel not supported');
    }

    return () => {
      if (broadcastChannel) {
        broadcastChannel.close();
      }
    };
  }, []);

  async function loadTemplate() {
    try {
      setLoading(true);
      setError(null);

      console.log('[useTemplate] Fetching active template from API...');
      const response = await getActiveTemplate();
      console.log('[useTemplate] Received template:', response.template?.template_key);

      const configUpdatedAt = response.configUpdatedAt || null;

      const cached = getCachedTemplate();
      if (cached && cached.configUpdatedAt === configUpdatedAt) {
        console.log('[useTemplate] Using cached template (config unchanged):', cached.template_key);
        setTemplate(cached);
        setLoading(false);
        return;
      }

      if (cached && cached.configUpdatedAt !== configUpdatedAt) {
        console.log('[useTemplate] Config updated, invalidating cache');
      }

      const templateData: TemplateData = {
        id: response.template.id,
        name: response.template.name,
        template_key: response.template.template_key,
        config: response.template.config,
        content: response.content,
      };

      setTemplate(templateData);
      cacheTemplate(templateData, configUpdatedAt);
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

      const { data, timestamp, configUpdatedAt }: CachedTemplate = JSON.parse(cached);
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

  function cacheTemplate(data: TemplateData, configUpdatedAt: string | null) {
    try {
      const cached: CachedTemplate = {
        data,
        timestamp: Date.now(),
        configUpdatedAt,
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
