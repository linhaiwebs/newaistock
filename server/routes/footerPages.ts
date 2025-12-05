import express, { Request, Response } from 'express';
import { supabase } from '../db/supabase';

const router = express.Router();

router.get('/footer-pages', async (req: Request, res: Response) => {
  try {
    const { data: pages, error } = await supabase
      .from('footer_pages')
      .select('id, title, slug, display_order')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching footer pages:', error);
      return res.status(500).json({ error: 'Failed to fetch footer pages' });
    }

    res.json({ pages: pages || [] });
  } catch (error) {
    console.error('Error in footer-pages route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/footer-page/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const { data: page, error } = await supabase
      .from('footer_pages')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching footer page:', error);
      return res.status(500).json({ error: 'Failed to fetch footer page' });
    }

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({ page });
  } catch (error) {
    console.error('Error in footer-page route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/admin/footer-pages', async (req: Request, res: Response) => {
  try {
    const { data: pages, error } = await supabase
      .from('footer_pages')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching all footer pages:', error);
      return res.status(500).json({ error: 'Failed to fetch footer pages' });
    }

    res.json({ pages: pages || [] });
  } catch (error) {
    console.error('Error in admin footer-pages route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/admin/footer-pages', async (req: Request, res: Response) => {
  try {
    const { title, slug, content, display_order, is_active } = req.body;

    const { data: page, error } = await supabase
      .from('footer_pages')
      .insert({
        title,
        slug,
        content,
        display_order: display_order || 0,
        is_active: is_active !== undefined ? is_active : true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating footer page:', error);
      return res.status(500).json({ error: 'Failed to create footer page' });
    }

    res.status(201).json({ page });
  } catch (error) {
    console.error('Error in create footer-page route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/admin/footer-pages/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, slug, content, display_order, is_active } = req.body;

    const { data: page, error } = await supabase
      .from('footer_pages')
      .update({
        title,
        slug,
        content,
        display_order,
        is_active,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating footer page:', error);
      return res.status(500).json({ error: 'Failed to update footer page' });
    }

    res.json({ page });
  } catch (error) {
    console.error('Error in update footer-page route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/admin/footer-pages/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('footer_pages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting footer page:', error);
      return res.status(500).json({ error: 'Failed to delete footer page' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error in delete footer-page route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
