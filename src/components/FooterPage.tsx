import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface FooterPageData {
  id: string;
  title: string;
  slug: string;
  content: string;
  updated_at: string;
}

export function FooterPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<FooterPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPage() {
      try {
        setLoading(true);
        const response = await fetch(`/api/footer-page/${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Page not found');
          } else {
            setError('Failed to load page');
          }
          return;
        }

        const data = await response.json();
        setPage(data.page);
      } catch (err) {
        console.error('Error loading footer page:', err);
        setError('Failed to load page');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadPage();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error === 'Page not found' ? 'Page Not Found' : 'Error'}
          </h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <article className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{page.title}</h1>

          <div className="prose prose-gray max-w-none">
            {page.content.split('\n').map((line, index) => {
              if (line.startsWith('# ')) {
                return (
                  <h1 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                    {line.substring(2)}
                  </h1>
                );
              } else if (line.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">
                    {line.substring(3)}
                  </h2>
                );
              } else if (line.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                    {line.substring(4)}
                  </h3>
                );
              } else if (line.startsWith('- ')) {
                return (
                  <li key={index} className="ml-6 text-gray-700 leading-relaxed">
                    {line.substring(2)}
                  </li>
                );
              } else if (line.trim() === '') {
                return <div key={index} className="h-4" />;
              } else {
                return (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {line}
                  </p>
                );
              }
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last updated: {new Date(page.updated_at).toLocaleDateString()}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
