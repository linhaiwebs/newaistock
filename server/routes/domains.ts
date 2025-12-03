import express from 'express';
import { supabaseAdmin } from '../db/supabaseAdmin.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { domainDetector } from '../services/domainDetector.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('domain_configs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Get domains error:', error);
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
});

router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('domain_configs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Get domain error:', error);
    res.status(500).json({ error: 'Failed to fetch domain' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const {
      domain,
      site_name,
      site_description,
      google_ads_publisher_id,
      google_verification_code,
      google_analytics_id,
      robots_config,
      ads_txt_content,
      seo_config,
      is_active,
      is_default,
    } = req.body;

    if (!domain || !site_name) {
      return res.status(400).json({ error: 'Domain and site name are required' });
    }

    if (is_default) {
      await supabaseAdmin
        .from('domain_configs')
        .update({ is_default: false })
        .eq('is_default', true);
    }

    const { data, error } = await supabaseAdmin
      .from('domain_configs')
      .insert({
        domain,
        site_name,
        site_description,
        google_ads_publisher_id,
        google_verification_code,
        google_analytics_id,
        robots_config,
        ads_txt_content,
        seo_config,
        is_active: is_active !== undefined ? is_active : true,
        is_default: is_default || false,
      })
      .select()
      .single();

    if (error) throw error;

    domainDetector.clearCache(domain);

    res.status(201).json(data);
  } catch (error) {
    console.error('Create domain error:', error);
    res.status(500).json({ error: 'Failed to create domain' });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const {
      domain,
      site_name,
      site_description,
      google_ads_publisher_id,
      google_verification_code,
      google_analytics_id,
      robots_config,
      ads_txt_content,
      seo_config,
      is_active,
      is_default,
    } = req.body;

    if (is_default) {
      await supabaseAdmin
        .from('domain_configs')
        .update({ is_default: false })
        .eq('is_default', true)
        .neq('id', id);
    }

    const { data, error } = await supabaseAdmin
      .from('domain_configs')
      .update({
        domain,
        site_name,
        site_description,
        google_ads_publisher_id,
        google_verification_code,
        google_analytics_id,
        robots_config,
        ads_txt_content,
        seo_config,
        is_active,
        is_default,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    domainDetector.clearCache(domain);
    domainDetector.clearCache();

    res.json(data);
  } catch (error) {
    console.error('Update domain error:', error);
    res.status(500).json({ error: 'Failed to update domain' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const { data: domain, error: fetchError } = await supabaseAdmin
      .from('domain_configs')
      .select('domain, is_default')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!domain) {
      return res.status(404).json({ error: 'Domain not found' });
    }

    if (domain.is_default) {
      return res.status(400).json({ error: 'Cannot delete default domain' });
    }

    const { error } = await supabaseAdmin
      .from('domain_configs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    domainDetector.clearCache(domain.domain);

    res.json({ success: true });
  } catch (error) {
    console.error('Delete domain error:', error);
    res.status(500).json({ error: 'Failed to delete domain' });
  }
});

router.post('/clear-cache', async (req: AuthRequest, res) => {
  try {
    const { domain } = req.body;

    domainDetector.clearCache(domain);

    res.json({ success: true, message: 'Cache cleared' });
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

export default router;
