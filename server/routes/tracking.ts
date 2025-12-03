import express from 'express';
import { supabaseAdmin } from '../db/supabaseAdmin.js';

const router = express.Router();

router.post('/session', async (req, res) => {
  try {
    const { sessionId, ipAddress, userAgent, referrer } = req.body;

    const { data, error } = await supabaseAdmin
      .from('user_sessions')
      .upsert({
        session_id: sessionId,
        ip_address: ipAddress,
        user_agent: userAgent,
        referrer: referrer,
        last_activity: new Date().toISOString(),
      }, {
        onConflict: 'session_id',
      })
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, session: data });
  } catch (error) {
    console.error('Session tracking error:', error);
    res.status(500).json({ error: 'Failed to track session' });
  }
});

router.post('/event', async (req, res) => {
  try {
    const { sessionId, eventType, stockCode, eventData } = req.body;

    const { data: session } = await supabaseAdmin
      .from('user_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const { error } = await supabaseAdmin.from('user_events').insert({
      session_id: session.id,
      event_type: eventType,
      stock_code: stockCode,
      event_data: eventData || {},
    });

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Event tracking error:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

router.post('/conversion', async (req, res) => {
  try {
    const { sessionId, stockCode } = req.body;

    const { data: session } = await supabaseAdmin
      .from('user_sessions')
      .select('id')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    await supabaseAdmin
      .from('stock_diagnoses')
      .update({ converted: true })
      .eq('session_id', session.id)
      .eq('stock_code', stockCode);

    res.json({ success: true });
  } catch (error) {
    console.error('Conversion tracking error:', error);
    res.status(500).json({ error: 'Failed to track conversion' });
  }
});

router.post('/duration', async (req, res) => {
  try {
    const { sessionId, duration } = req.body;

    await supabaseAdmin
      .from('user_sessions')
      .update({
        session_duration: duration,
        last_activity: new Date().toISOString(),
      })
      .eq('session_id', sessionId);

    res.json({ success: true });
  } catch (error) {
    console.error('Duration tracking error:', error);
    res.status(500).json({ error: 'Failed to track duration' });
  }
});

export default router;
