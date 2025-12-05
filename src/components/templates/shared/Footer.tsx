import { useEffect, useState } from 'react';

interface FooterProps {
  footerConfig?: any;
  variant?: 'default' | 'modern' | 'minimal' | 'professional';
  className?: string;
}

interface FooterPage {
  id: string;
  title: string;
  slug: string;
  display_order: number;
}

export default function Footer({ className = '' }: FooterProps) {
  const [footerPages, setFooterPages] = useState<FooterPage[]>([]);
  const [copyrightText, setCopyrightText] = useState('');

  useEffect(() => {
    fetch('/api/footer-pages')
      .then(res => res.json())
      .then(data => {
        if (data.pages) {
          setFooterPages(data.pages);
        }
      })
      .catch(err => console.error('Failed to load footer pages:', err));

    fetch('/api/content/footer.copyright')
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setCopyrightText(data.content);
        } else {
          const currentYear = new Date().getFullYear();
          setCopyrightText(`© ${currentYear} All rights reserved`);
        }
      })
      .catch(() => {
        const currentYear = new Date().getFullYear();
        setCopyrightText(`© ${currentYear} All rights reserved`);
      });
  }, []);

  return (
    <footer className={`w-full bg-gray-900 text-gray-300 py-8 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center gap-6">
          {footerPages.length > 0 && (
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {footerPages.map(page => (
                <a
                  key={page.id}
                  href={`/footer-page/${page.slug}`}
                  className="hover:text-white transition-colors"
                >
                  {page.title}
                </a>
              ))}
            </nav>
          )}

          <div className="text-sm text-center">
            {copyrightText}
          </div>
        </div>
      </div>
    </footer>
  );
}
