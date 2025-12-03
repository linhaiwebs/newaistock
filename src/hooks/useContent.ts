import { useState, useEffect } from 'react';

interface ContentMap {
  [key: string]: string;
}

interface ContentDetail {
  id: string;
  key: string;
  content: string;
  category: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export function useContent() {
  const [content, setContent] = useState<ContentMap>({});
  const [details, setDetails] = useState<ContentDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content');
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      const data = await response.json();
      setContent(data.content || {});
      setDetails(data.details || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const get = (key: string, fallback: string = ''): string => {
    return content[key] || fallback;
  };

  const updateContent = async (key: string, newContent: string, category?: string, description?: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/content/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newContent, category, description })
      });

      if (!response.ok) {
        throw new Error('Failed to update content');
      }

      await fetchContent();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unknown error');
    }
  };

  const createContent = async (key: string, contentText: string, category: string, description: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ key, content: contentText, category, description })
      });

      if (!response.ok) {
        throw new Error('Failed to create content');
      }

      await fetchContent();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unknown error');
    }
  };

  const deleteContent = async (key: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/content/${key}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete content');
      }

      await fetchContent();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Unknown error');
    }
  };

  return {
    content,
    details,
    loading,
    error,
    get,
    updateContent,
    createContent,
    deleteContent,
    refresh: fetchContent
  };
}
