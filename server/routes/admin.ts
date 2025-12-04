import express from 'express';
import { supabaseAdmin as supabase } from '../db/supabaseAdmin.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { clearCache } from '../services/cacheService.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/stats/overview', async (req: AuthRequest, res) => {
  try {
    const { data: sessions } = await supabase
      .from('user_sessions')
      .select('session_duration');

    const { data: diagnoses } = await supabase
      .from('stock_diagnoses')
      .select('converted');

    const { data: events } = await supabase
      .from('user_events')
      .select('event_type');

    const totalUsers = sessions?.length || 0;
    const totalDiagnoses = diagnoses?.length || 0;
    const totalConversions = diagnoses?.filter((d) => d.converted).length || 0;

    const avgSessionTime = sessions && sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + (s.session_duration || 0), 0) / sessions.length)
      : 0;

    const diagnosisRate = totalUsers > 0 ? ((totalDiagnoses / totalUsers) * 100).toFixed(1) : '0';
    const conversionRate = totalDiagnoses > 0 ? ((totalConversions / totalDiagnoses) * 100).toFixed(1) : '0';

    const diagnosisClicks = events?.filter((e) => e.event_type === 'diagnosis_click').length || 0;
    const conversionClicks = events?.filter((e) => e.event_type === 'conversion_click').length || 0;

    res.json({
      totalUsers,
      totalDiagnoses,
      totalConversions,
      avgSessionTime,
      diagnosisRate,
      conversionRate,
      diagnosisClicks,
      conversionClicks,
    });
  } catch (error) {
    console.error('Stats overview error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

router.get('/users', async (req: AuthRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { data: sessions, error, count } = await supabase
      .from('user_sessions')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    const sessionsWithDetails = await Promise.all(
      (sessions || []).map(async (session) => {
        const { data: events } = await supabase
          .from('user_events')
          .select('*')
          .eq('session_id', session.id)
          .order('created_at', { ascending: false });

        const { data: diagnoses } = await supabase
          .from('stock_diagnoses')
          .select('*')
          .eq('session_id', session.id);

        return {
          ...session,
          events: events || [],
          diagnoses: diagnoses || [],
        };
      })
    );

    res.json({
      users: sessionsWithDetails,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/:sessionId/timeline', async (req: AuthRequest, res) => {
  try {
    const { sessionId } = req.params;

    const { data: session } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const { data: events } = await supabase
      .from('user_events')
      .select('*')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true });

    const { data: diagnoses } = await supabase
      .from('stock_diagnoses')
      .select('*')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true });

    res.json({
      session,
      events: events || [],
      diagnoses: diagnoses || [],
    });
  } catch (error) {
    console.error('Timeline fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch timeline' });
  }
});

router.get('/analytics/config', async (req: AuthRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('analytics_config')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Analytics config database error:', error);
      throw error;
    }

    if (!data) {
      return res.json({
        ga4_measurement_id: '',
        google_ads_conversion_id: '',
        conversion_action_id: '',
        enabled: false,
      });
    }

    res.json(data);
  } catch (error) {
    console.error('Analytics config fetch error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch analytics config';
    res.status(500).json({ error: errorMessage, details: String(error) });
  }
});

router.put('/analytics/config', async (req: AuthRequest, res) => {
  try {
    const {
      ga4_measurement_id,
      google_ads_conversion_id,
      conversion_action_id,
      enabled,
    } = req.body;

    let validUserId = null;
    if (req.userId) {
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', req.userId)
        .maybeSingle();

      if (adminUser) {
        validUserId = req.userId;
      } else {
        console.warn(`Admin user ${req.userId} not found in database, saving without updated_by`);
      }
    }

    const { data: existing } = await supabase
      .from('analytics_config')
      .select('id')
      .maybeSingle();

    let result;
    if (existing) {
      result = await supabase
        .from('analytics_config')
        .update({
          ga4_measurement_id: ga4_measurement_id || null,
          google_ads_conversion_id: google_ads_conversion_id || null,
          conversion_action_id: conversion_action_id || null,
          enabled: enabled !== undefined ? enabled : false,
          updated_at: new Date().toISOString(),
          updated_by: validUserId,
        })
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('analytics_config')
        .insert({
          ga4_measurement_id: ga4_measurement_id || null,
          google_ads_conversion_id: google_ads_conversion_id || null,
          conversion_action_id: conversion_action_id || null,
          enabled: enabled !== undefined ? enabled : false,
          updated_by: validUserId,
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Database error updating analytics config:', result.error);
      throw result.error;
    }

    console.log('Analytics config saved successfully:', result.data);
    res.json(result.data);
  } catch (error) {
    console.error('Analytics config update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update analytics config';
    res.status(500).json({ error: errorMessage });
  }
});

router.get('/redirects', async (req: AuthRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('redirect_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Redirects fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch redirects' });
  }
});

router.post('/redirects', async (req: AuthRequest, res) => {
  try {
    const { user_id, target_url, weight } = req.body;

    if (!target_url || typeof target_url !== 'string' || target_url.trim() === '') {
      return res.status(400).json({ error: 'Valid target URL is required' });
    }

    try {
      new URL(target_url);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid URL format. Please provide a valid URL (e.g., https://example.com)' });
    }

    const finalUserId = (user_id && typeof user_id === 'string' && user_id.trim() !== '')
      ? user_id.trim()
      : `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const finalWeight = weight && typeof weight === 'number' && weight >= 1 && weight <= 100 ? weight : 100;

    const { data, error } = await supabase
      .from('redirect_links')
      .insert({
        user_id: finalUserId,
        target_url: target_url.trim(),
        weight: finalWeight,
        active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error creating redirect:', error);
      throw error;
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Redirect creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create redirect';
    res.status(500).json({ error: errorMessage });
  }
});

router.put('/redirects/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { target_url, weight, active } = req.body;

    const updates: any = { updated_at: new Date().toISOString() };
    if (target_url !== undefined) updates.target_url = target_url;
    if (weight !== undefined) updates.weight = weight;
    if (active !== undefined) updates.active = active;

    const { data, error } = await supabase
      .from('redirect_links')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Redirect update error:', error);
    res.status(500).json({ error: 'Failed to update redirect' });
  }
});

router.delete('/redirects/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('redirect_links')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Redirect deletion error:', error);
    res.status(500).json({ error: 'Failed to delete redirect' });
  }
});

router.get('/templates', async (req: AuthRequest, res) => {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Templates fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

router.put('/templates/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { custom_footer, custom_text, active } = req.body;

    const updates: any = { updated_at: new Date().toISOString() };
    if (custom_footer !== undefined) updates.custom_footer = custom_footer;
    if (custom_text !== undefined) updates.custom_text = custom_text;
    if (active !== undefined) updates.active = active;

    const { data, error } = await supabase
      .from('templates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Template update error:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
});

router.delete('/cache', async (req: AuthRequest, res) => {
  try {
    const { stockCode } = req.query;

    await clearCache(stockCode as string | undefined);

    res.json({ success: true });
  } catch (error) {
    console.error('Cache clear error:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

export default router;
