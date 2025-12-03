import { Router } from 'express';
import { supabaseAdmin } from '../db/supabaseAdmin';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/content', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('site_content')
      .select('*')
      .order('category', { ascending: true });

    if (error) throw error;

    const contentMap = data.reduce((acc, item) => {
      acc[item.key] = item.content;
      return acc;
    }, {} as Record<string, string>);

    res.json({ content: contentMap, details: data });
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

router.get('/content/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { data, error } = await supabaseAdmin
      .from('site_content')
      .select('*')
      .eq('key', key)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Failed to fetch content' });
  }
});

router.post('/content', authenticateToken, async (req, res) => {
  try {
    const { key, content, category, description } = req.body;

    if (!key || !content) {
      return res.status(400).json({ error: 'Key and content are required' });
    }

    const { data, error } = await supabaseAdmin
      .from('site_content')
      .insert([{ key, content, category, description }])
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

router.put('/content/:key', authenticateToken, async (req, res) => {
  try {
    const { key } = req.params;
    const { content, category, description } = req.body;

    const updates: any = {};
    if (content !== undefined) updates.content = content;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;

    const { data, error } = await supabaseAdmin
      .from('site_content')
      .update(updates)
      .eq('key', key)
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({ error: 'Failed to update content' });
  }
});

router.delete('/content/:key', authenticateToken, async (req, res) => {
  try {
    const { key } = req.params;

    const { error } = await supabaseAdmin
      .from('site_content')
      .delete()
      .eq('key', key);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({ error: 'Failed to delete content' });
  }
});

export default router;
