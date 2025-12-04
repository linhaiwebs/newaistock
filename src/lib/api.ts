import { requireValidToken, removeToken } from './auth';

const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api';
const DEFAULT_TIMEOUT = 30000;

export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'Request timeout') {
    super(message);
    this.name = 'TimeoutError';
  }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout: number = DEFAULT_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new TimeoutError(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

async function handleAuthError(response: Response): Promise<void> {
  if (response.status === 401 || response.status === 403) {
    removeToken();
    const error = await response.json().catch(() => ({ error: 'Authentication failed' }));
    throw new AuthError(error.error || 'Authentication failed', 'AUTH_FAILED');
  }
}

export async function fetchStockData(code: string) {
  const response = await fetchWithTimeout(`${API_BASE_URL}/stock/fetch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) throw new Error('Failed to fetch stock data');
  return response.json();
}

export async function checkCache(stockCode: string) {
  const response = await fetch(`${API_BASE_URL}/diagnosis/cache/${stockCode}`);
  if (!response.ok) return { cached: false };
  return response.json();
}

export async function* streamDiagnosis(
  stockCode: string,
  stockName: string,
  stockData: any,
  sessionId: string,
  lineAccountName?: string
) {
  const response = await fetch(`${API_BASE_URL}/diagnosis/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      stockCode,
      stockName,
      stockData,
      sessionId,
      lineAccountName,
    }),
  });

  if (!response.ok) throw new Error('Failed to analyze stock');
  if (!response.body) throw new Error('No response body');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') return;

        try {
          const parsed = JSON.parse(data);
          if (parsed.chunk) {
            yield parsed.chunk;
          }
        } catch (e) {
          continue;
        }
      }
    }
  }
}

export async function trackSession(
  sessionId: string,
  ipAddress: string,
  userAgent: string,
  referrer: string
) {
  await fetch(`${API_BASE_URL}/tracking/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, ipAddress, userAgent, referrer }),
  });
}

export async function trackEvent(
  sessionId: string,
  eventType: string,
  stockCode?: string,
  eventData?: any
) {
  await fetch(`${API_BASE_URL}/tracking/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, eventType, stockCode, eventData }),
  });
}

export async function trackConversion(sessionId: string, stockCode: string) {
  await fetch(`${API_BASE_URL}/tracking/conversion`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, stockCode }),
  });
}

export async function trackDuration(sessionId: string, duration: number) {
  await fetch(`${API_BASE_URL}/tracking/duration`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, duration }),
  });
}

export async function getWeightedRedirect(): Promise<{ id: string; url: string; userId: string } | null> {
  const response = await fetch(`${API_BASE_URL}/redirect/weighted/select`);
  if (!response.ok) return null;
  return response.json();
}

export async function login(username: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Login failed' }));
    throw new Error(error.error || 'Login failed');
  }

  return response.json();
}

export async function verifyAuth(token: string) {
  const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return null;
  return response.json();
}

export async function getOverviewStats(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/stats/overview`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to fetch stats');
  return response.json();
}

export async function getUsers(token: string, page: number = 1) {
  const response = await fetch(`${API_BASE_URL}/admin/users?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

export async function getUserTimeline(token: string, sessionId: string) {
  const response = await fetch(`${API_BASE_URL}/admin/users/${sessionId}/timeline`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to fetch timeline');
  return response.json();
}

export async function getAnalyticsConfig(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/analytics/config`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to fetch config');
  return response.json();
}

export async function updateAnalyticsConfig(token: string, config: any) {
  const response = await fetch(`${API_BASE_URL}/admin/analytics/config`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to update config');
  return response.json();
}

export async function getRedirectLinks(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/redirects`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to fetch redirects');
  return response.json();
}

export async function createRedirectLink(token: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/admin/redirects`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to create redirect');
  return response.json();
}

export async function updateRedirectLink(token: string, id: number, data: any) {
  const response = await fetch(`${API_BASE_URL}/admin/redirects/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to update redirect');
  return response.json();
}

export async function deleteRedirectLink(token: string, id: number) {
  const response = await fetch(`${API_BASE_URL}/admin/redirects/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to delete redirect');
  return response.json();
}

export async function getTemplates(token: string) {
  const response = await fetch(`${API_BASE_URL}/admin/templates`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to fetch templates');
  return response.json();
}

export async function updateTemplate(token: string, id: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to update template');
  return response.json();
}

export async function clearAICache(token: string, stockCode?: string) {
  const url = stockCode
    ? `${API_BASE_URL}/admin/cache?stockCode=${stockCode}`
    : `${API_BASE_URL}/admin/cache`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to clear cache');
  return response.json();
}

// 模板管理 API
export async function getAllTemplates(token: string) {
  const response = await fetch(`${API_BASE_URL}/templates`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to fetch templates');
  return response.json();
}

export async function getTemplateDetail(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/templates/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to fetch template detail');
  return response.json();
}

export async function activateTemplate(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/templates/${id}/activate`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to activate template');
  return response.json();
}

export async function deleteTemplate(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/templates/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to delete template');
  return response.json();
}

export async function updateTemplateContent(token: string, id: string, content: any[]) {
  const response = await fetch(`${API_BASE_URL}/templates/${id}/content`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to update template content');
  return response.json();
}

export async function getActiveTemplate() {
  console.log('[API] Fetching active template...');
  const response = await fetchWithTimeout(`${API_BASE_URL}/templates/active`, {}, 10000);

  console.log('[API] Active template response status:', response.status);
  if (!response.ok) throw new Error('Failed to fetch active template');
  const data = await response.json();
  console.log('[API] Active template data received');
  return data;
}

export async function scanTemplates(token: string) {
  const response = await fetch(`${API_BASE_URL}/templates/scan`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to scan templates');
  return response.json();
}

export async function syncTemplates(token: string) {
  const response = await fetch(`${API_BASE_URL}/templates/sync`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to sync templates');
  return response.json();
}

export async function getDomains(token: string) {
  const response = await fetch(`${API_BASE_URL}/domains`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to fetch domains');
  return response.json();
}

export async function getDomain(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/domains/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to fetch domain');
  return response.json();
}

export async function createDomain(token: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/domains`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to create domain');
  return response.json();
}

export async function updateDomain(token: string, id: string, data: any) {
  const response = await fetch(`${API_BASE_URL}/domains/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to update domain');
  return response.json();
}

export async function deleteDomain(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/domains/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to delete domain');
  return response.json();
}

export async function clearDomainCache(token: string, domain?: string) {
  const response = await fetch(`${API_BASE_URL}/domains/clear-cache`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ domain }),
  });

  await handleAuthError(response);
  if (!response.ok) throw new Error('Failed to clear cache');
  return response.json();
}
