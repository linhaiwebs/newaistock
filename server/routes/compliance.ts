import express from 'express';
import { domainDetector } from '../services/domainDetector.js';
import { complianceFileGenerator } from '../services/complianceFileGenerator.js';

const router = express.Router();

router.get('/robots.txt', async (req, res) => {
  try {
    const domain = domainDetector.extractDomain(req);
    const config = await domainDetector.getConfigForRequest(req);

    if (!config) {
      return res.status(500).send('# Unable to generate robots.txt\nUser-agent: *\nAllow: /');
    }

    const robotsTxt = complianceFileGenerator.generateRobotsTxt(domain, config);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(robotsTxt);
  } catch (error) {
    console.error('robots.txt generation error:', error);
    res.status(500).send('# Error generating robots.txt\nUser-agent: *\nAllow: /');
  }
});

router.get('/ads.txt', async (req, res) => {
  try {
    const domain = domainDetector.extractDomain(req);
    const config = await domainDetector.getConfigForRequest(req);

    if (!config || !config.google_ads_publisher_id) {
      return res.status(404).send('# ads.txt not configured');
    }

    const adsTxt = complianceFileGenerator.generateAdsTxt(domain, config);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(adsTxt);
  } catch (error) {
    console.error('ads.txt generation error:', error);
    res.status(500).send('# Error generating ads.txt');
  }
});

router.get('/sitemap.xml', async (req, res) => {
  try {
    const domain = domainDetector.extractDomain(req);

    const sitemapXml = complianceFileGenerator.generateSitemapXml(domain);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=21600');
    res.send(sitemapXml);
  } catch (error) {
    console.error('sitemap.xml generation error:', error);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><urlset></urlset>');
  }
});

router.get('/security.txt', async (req, res) => {
  try {
    const domain = domainDetector.extractDomain(req);
    const securityTxt = complianceFileGenerator.generateSecurityTxt(domain);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(securityTxt);
  } catch (error) {
    console.error('security.txt generation error:', error);
    res.status(500).send('# Error generating security.txt');
  }
});

router.get('/.well-known/security.txt', async (req, res) => {
  try {
    const domain = domainDetector.extractDomain(req);
    const securityTxt = complianceFileGenerator.generateSecurityTxt(domain);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(securityTxt);
  } catch (error) {
    console.error('security.txt generation error:', error);
    res.status(500).send('# Error generating security.txt');
  }
});

router.get('/humans.txt', async (req, res) => {
  try {
    const domain = domainDetector.extractDomain(req);
    const config = await domainDetector.getConfigForRequest(req);

    if (!config) {
      return res.status(500).send('# Unable to generate humans.txt');
    }

    const humansTxt = complianceFileGenerator.generateHumansTxt(domain, config);

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(humansTxt);
  } catch (error) {
    console.error('humans.txt generation error:', error);
    res.status(500).send('# Error generating humans.txt');
  }
});

export default router;
