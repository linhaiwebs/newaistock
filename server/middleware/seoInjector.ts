import { Request, Response, NextFunction } from 'express';
import { domainDetector } from '../services/domainDetector.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let htmlTemplate: string | null = null;

function loadHtmlTemplate(): string {
  if (htmlTemplate) return htmlTemplate;

  const htmlPath = path.join(__dirname, '../../client/index.html');
  if (fs.existsSync(htmlPath)) {
    htmlTemplate = fs.readFileSync(htmlPath, 'utf-8');
    return htmlTemplate;
  }

  return '';
}

export async function injectSeoMetadata(req: Request, res: Response, next: NextFunction) {
  if (req.path.startsWith('/api') ||
      req.path.startsWith('/health') ||
      req.path === '/robots.txt' ||
      req.path === '/ads.txt' ||
      req.path === '/sitemap.xml' ||
      req.path === '/security.txt' ||
      req.path === '/humans.txt' ||
      req.path.startsWith('/.well-known')) {
    return next();
  }

  try {
    const config = await domainDetector.getConfigForRequest(req);

    if (!config) {
      return next();
    }

    const originalSend = res.send.bind(res);

    res.send = function (body: any): Response {
      if (typeof body === 'string' && body.includes('<!doctype html>')) {
        const domain = domainDetector.extractDomain(req);
        let modifiedHtml = body;

        if (config.seo_config.title) {
          modifiedHtml = modifiedHtml.replace(
            /<title>.*?<\/title>/i,
            `<title>${config.seo_config.title}</title>`
          );

          modifiedHtml = modifiedHtml.replace(
            /<meta property="og:title" content=".*?">/i,
            `<meta property="og:title" content="${config.seo_config.title}" />`
          );

          modifiedHtml = modifiedHtml.replace(
            /<meta name="twitter:title" content=".*?">/i,
            `<meta name="twitter:title" content="${config.seo_config.title}" />`
          );
        }

        if (config.site_description) {
          modifiedHtml = modifiedHtml.replace(
            /<meta name="description" content=".*?">/i,
            `<meta name="description" content="${config.site_description}" />`
          );

          modifiedHtml = modifiedHtml.replace(
            /<meta property="og:description" content=".*?">/i,
            `<meta property="og:description" content="${config.site_description}" />`
          );

          modifiedHtml = modifiedHtml.replace(
            /<meta name="twitter:description" content=".*?">/i,
            `<meta name="twitter:description" content="${config.site_description}" />`
          );
        }

        if (config.seo_config.keywords && config.seo_config.keywords.length > 0) {
          const keywordsStr = config.seo_config.keywords.join(',');
          if (modifiedHtml.includes('<meta name="keywords"')) {
            modifiedHtml = modifiedHtml.replace(
              /<meta name="keywords" content=".*?">/i,
              `<meta name="keywords" content="${keywordsStr}" />`
            );
          } else {
            modifiedHtml = modifiedHtml.replace(
              '</head>',
              `    <meta name="keywords" content="${keywordsStr}" />\n  </head>`
            );
          }
        }

        modifiedHtml = modifiedHtml.replace(
          /<link rel="canonical" href=".*?">/i,
          `<link rel="canonical" href="https://${domain}/" />`
        );

        modifiedHtml = modifiedHtml.replace(
          /<link rel="alternate" hreflang=".*?" href=".*?">/i,
          `<link rel="alternate" hreflang="${config.seo_config.language || 'ja'}" href="https://${domain}/" />`
        );

        if (config.seo_config.ogImage) {
          modifiedHtml = modifiedHtml.replace(
            /<meta property="og:image" content=".*?">/i,
            `<meta property="og:image" content="https://${domain}${config.seo_config.ogImage}" />`
          );

          modifiedHtml = modifiedHtml.replace(
            /<meta name="twitter:image" content=".*?">/i,
            `<meta name="twitter:image" content="https://${domain}${config.seo_config.ogImage}" />`
          );
        }

        if (config.seo_config.locale) {
          modifiedHtml = modifiedHtml.replace(
            /<meta property="og:locale" content=".*?">/i,
            `<meta property="og:locale" content="${config.seo_config.locale}" />`
          );
        }

        if (config.google_verification_code) {
          if (modifiedHtml.includes('google-site-verification')) {
            modifiedHtml = modifiedHtml.replace(
              /<meta name="google-site-verification" content=".*?">/i,
              `<meta name="google-site-verification" content="${config.google_verification_code}" />`
            );
          } else {
            modifiedHtml = modifiedHtml.replace(
              '</head>',
              `    <meta name="google-site-verification" content="${config.google_verification_code}" />\n  </head>`
            );
          }
        }

        if (config.google_analytics_id) {
          if (!modifiedHtml.includes('gtag/js')) {
            const gaScript = `
    <script async src="https://www.googletagmanager.com/gtag/js?id=${config.google_analytics_id}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${config.google_analytics_id}');
    </script>
  `;
            modifiedHtml = modifiedHtml.replace('</head>', `${gaScript}</head>`);
          }
        }

        return originalSend(modifiedHtml);
      }

      return originalSend(body);
    };

    next();
  } catch (error) {
    console.error('SEO injection error:', error);
    next();
  }
}
