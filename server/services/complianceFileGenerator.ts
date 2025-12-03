interface DomainConfig {
  domain: string;
  site_name: string;
  site_description: string;
  google_ads_publisher_id?: string;
  google_verification_code?: string;
  google_analytics_id?: string;
  robots_config: {
    allow: string[];
    disallow: string[];
    crawlDelay?: number | null;
    customRules: string[];
  };
  ads_txt_content?: string;
  seo_config: {
    title: string;
    keywords: string[];
    author: string;
    ogImage: string;
    twitterCard: string;
    locale: string;
    language: string;
  };
}

export class ComplianceFileGenerator {
  generateRobotsTxt(domain: string, config: DomainConfig): string {
    const lines: string[] = [];

    lines.push('# robots.txt for ' + domain);
    lines.push('');

    lines.push('User-agent: Googlebot');
    config.robots_config.allow.forEach(path => {
      lines.push(`Allow: ${path}`);
    });
    lines.push('Allow: /ads.txt');
    lines.push('');

    lines.push('User-agent: Googlebot-Image');
    lines.push('Allow: /');
    lines.push('');

    lines.push('User-agent: AdsBot-Google');
    lines.push('Allow: /');
    lines.push('');

    lines.push('User-agent: *');
    config.robots_config.allow.forEach(path => {
      lines.push(`Allow: ${path}`);
    });

    config.robots_config.disallow.forEach(path => {
      lines.push(`Disallow: ${path}`);
    });

    if (config.robots_config.crawlDelay) {
      lines.push(`Crawl-delay: ${config.robots_config.crawlDelay}`);
    }

    config.robots_config.customRules.forEach(rule => {
      lines.push(rule);
    });

    lines.push('');
    lines.push(`Sitemap: https://${domain}/sitemap.xml`);

    return lines.join('\n');
  }

  generateAdsTxt(domain: string, config: DomainConfig): string {
    const lines: string[] = [];

    lines.push(`# ads.txt file for ${domain}`);
    lines.push(`# Generated: ${new Date().toISOString()}`);
    lines.push('');

    if (config.google_ads_publisher_id) {
      lines.push(`google.com, ${config.google_ads_publisher_id}, DIRECT, f08c47fec0942fa0`);
    }

    if (config.ads_txt_content) {
      lines.push('');
      lines.push('# Additional entries');
      lines.push(config.ads_txt_content);
    }

    return lines.join('\n');
  }

  generateSitemapXml(domain: string, additionalUrls: Array<{url: string, lastmod?: string, priority?: number, changefreq?: string}> = []): string {
    const lines: string[] = [];

    lines.push('<?xml version="1.0" encoding="UTF-8"?>');
    lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    const today = new Date().toISOString().split('T')[0];

    lines.push('  <url>');
    lines.push(`    <loc>https://${domain}/</loc>`);
    lines.push(`    <lastmod>${today}</lastmod>`);
    lines.push('    <priority>1.0</priority>');
    lines.push('    <changefreq>daily</changefreq>');
    lines.push('  </url>');

    additionalUrls.forEach(item => {
      lines.push('  <url>');
      lines.push(`    <loc>https://${domain}${item.url}</loc>`);
      if (item.lastmod) {
        lines.push(`    <lastmod>${item.lastmod}</lastmod>`);
      }
      if (item.priority !== undefined) {
        lines.push(`    <priority>${item.priority}</priority>`);
      }
      if (item.changefreq) {
        lines.push(`    <changefreq>${item.changefreq}</changefreq>`);
      }
      lines.push('  </url>');
    });

    lines.push('</urlset>');

    return lines.join('\n');
  }

  generateSecurityTxt(domain: string, contactEmail: string = 'security@example.com'): string {
    const lines: string[] = [];
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    lines.push(`Contact: ${contactEmail}`);
    lines.push(`Expires: ${expiryDate.toISOString()}`);
    lines.push('Preferred-Languages: ja, en');
    lines.push(`Canonical: https://${domain}/.well-known/security.txt`);

    return lines.join('\n');
  }

  generateHumansTxt(domain: string, config: DomainConfig): string {
    const lines: string[] = [];

    lines.push('/* TEAM */');
    lines.push(`Website: ${domain}`);
    if (config.seo_config.author) {
      lines.push(`Author: ${config.seo_config.author}`);
    }
    lines.push('');

    lines.push('/* SITE */');
    lines.push(`Last update: ${new Date().toISOString().split('T')[0]}`);
    lines.push('Standards: HTML5, CSS3, JavaScript');
    lines.push('Components: React, TypeScript, Tailwind CSS');
    lines.push('Software: Vite, Node.js');

    return lines.join('\n');
  }
}

export const complianceFileGenerator = new ComplianceFileGenerator();
