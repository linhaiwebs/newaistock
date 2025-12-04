import express from 'express';
import { supabase } from '../db/supabase.js';

const router = express.Router();

router.get('/:linkId', async (req, res) => {
  try {
    const { linkId } = req.params;

    const { data: link, error } = await supabase
      .from('redirect_links')
      .select('*')
      .eq('id', linkId)
      .eq('active', true)
      .maybeSingle();

    if (error || !link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    await supabase
      .from('redirect_links')
      .update({ click_count: link.click_count + 1 })
      .eq('id', linkId);

    res.redirect(link.target_url);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ error: 'Redirect failed' });
  }
});

router.get('/weighted/select', async (req, res) => {
  try {
    const { data: links, error } = await supabase
      .from('redirect_links')
      .select('*')
      .eq('active', true)
      .order('weight', { ascending: false });

    if (error || !links || links.length === 0) {
      return res.status(404).json({ error: 'No active links found' });
    }

    const totalWeight = links.reduce((sum, link) => sum + link.weight, 0);
    let random = Math.random() * totalWeight;

    for (const link of links) {
      random -= link.weight;
      if (random <= 0) {
        await supabase
          .from('redirect_links')
          .update({ click_count: link.click_count + 1 })
          .eq('id', link.id);

        return res.json({
          id: link.id,
          url: link.target_url,
          userId: link.user_id,
        });
      }
    }

    const fallbackLink = links[0];
    res.json({
      id: fallbackLink.id,
      url: fallbackLink.target_url,
      userId: fallbackLink.user_id,
    });
  } catch (error) {
    console.error('Weighted selection error:', error);
    res.status(500).json({ error: 'Selection failed' });
  }
});

export default router;
