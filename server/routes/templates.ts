import express from 'express';
import { supabase } from '../db/supabase.js';
import { supabaseAdmin } from '../db/supabaseAdmin.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import { templateScanner } from '../services/templateScanner.js';
import { domainDetector } from '../services/domainDetector.js';

const router = express.Router();

// 公开路由：获取激活的模板和内容
router.get('/active', async (req, res) => {
  try {
    const { data: template, error: templateError } = await supabase
      .from('landing_templates')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (templateError) throw templateError;

    if (!template) {
      return res.status(404).json({ error: 'No active template found' });
    }

    const { data: content, error: contentError } = await supabase
      .from('template_content')
      .select('*')
      .eq('template_id', template.id);

    if (contentError) throw contentError;

    // 将内容数组转换为对象，方便前端使用
    const contentMap: Record<string, any> = {};
    content?.forEach((item: any) => {
      contentMap[item.content_key] = {
        value: item.content_value,
        type: item.content_type,
      };
    });

    // 获取当前域名的配置（包含footer_config）
    const domainConfig = await domainDetector.getConfigForRequest(req);
    const footerConfig = domainConfig?.footer_config || null;
    const configUpdatedAt = domainConfig?.updated_at || domainConfig?.created_at || null;

    res.json({
      template: {
        id: template.id,
        name: template.name,
        template_key: template.template_key,
        config: template.config,
      },
      content: contentMap,
      footerConfig,
      configUpdatedAt,
    });
  } catch (error) {
    console.error('Get active template error:', error);
    res.status(500).json({ error: 'Failed to fetch active template' });
  }
});

// 以下所有路由需要认证
router.use(authenticateToken);

// 获取所有模板列表
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('landing_templates')
      .select('*')
      .order('is_active', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Templates fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// 获取单个模板详情（包含内容）
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const { data: template, error: templateError } = await supabaseAdmin
      .from('landing_templates')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (templateError) throw templateError;

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const { data: content, error: contentError } = await supabaseAdmin
      .from('template_content')
      .select('*')
      .eq('template_id', id)
      .order('content_key');

    if (contentError) throw contentError;

    res.json({
      ...template,
      content: content || [],
    });
  } catch (error) {
    console.error('Template fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// 创建新模板
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, template_key, description, config } = req.body;

    if (!name || !template_key) {
      return res.status(400).json({ error: 'Name and template_key are required' });
    }

    const { data, error } = await supabaseAdmin
      .from('landing_templates')
      .insert({
        name,
        template_key,
        description,
        config: config || {},
        is_active: false,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Template key already exists' });
      }
      throw error;
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Template creation error:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

// 更新模板
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, description, config, preview_image } = req.body;

    const updates: any = { updated_at: new Date().toISOString() };
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (config !== undefined) updates.config = config;
    if (preview_image !== undefined) updates.preview_image = preview_image;

    const { data, error } = await supabaseAdmin
      .from('landing_templates')
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

// 激活模板
router.put('/:id/activate', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // 先检查模板是否存在
    const { data: template, error: checkError } = await supabaseAdmin
      .from('landing_templates')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (checkError) throw checkError;

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // 将指定模板设为激活状态（触发器会自动停用其他模板）
    const { data, error } = await supabaseAdmin
      .from('landing_templates')
      .update({ is_active: true, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Template activation error:', error);
    res.status(500).json({ error: 'Failed to activate template' });
  }
});

// 删除模板
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // 检查是否为激活的模板
    const { data: template } = await supabaseAdmin
      .from('landing_templates')
      .select('is_active')
      .eq('id', id)
      .maybeSingle();

    if (template?.is_active) {
      return res.status(400).json({ error: 'Cannot delete active template' });
    }

    const { error } = await supabaseAdmin
      .from('landing_templates')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Template deletion error:', error);
    res.status(500).json({ error: 'Failed to delete template' });
  }
});

// 获取模板的所有内容
router.get('/:id/content', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('template_content')
      .select('*')
      .eq('template_id', id)
      .order('content_key');

    if (error) throw error;

    res.json(data || []);
  } catch (error) {
    console.error('Template content fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch template content' });
  }
});

// 批量更新模板内容
router.put('/:id/content', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!Array.isArray(content)) {
      return res.status(400).json({ error: 'Content must be an array' });
    }

    // 使用upsert来更新或插入内容
    const contentData = content.map((item: any) => ({
      template_id: id,
      content_key: item.content_key,
      content_value: item.content_value,
      content_type: item.content_type || 'text',
    }));

    const { data, error } = await supabaseAdmin
      .from('template_content')
      .upsert(contentData, {
        onConflict: 'template_id,content_key',
        ignoreDuplicates: false,
      })
      .select();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error('Template content update error:', error);
    res.status(500).json({ error: 'Failed to update template content' });
  }
});

// 添加单个内容项
router.post('/:id/content', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { content_key, content_value, content_type } = req.body;

    if (!content_key || !content_value) {
      return res.status(400).json({ error: 'content_key and content_value are required' });
    }

    const { data, error } = await supabaseAdmin
      .from('template_content')
      .insert({
        template_id: id,
        content_key,
        content_value,
        content_type: content_type || 'text',
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Content key already exists for this template' });
      }
      throw error;
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error('Template content creation error:', error);
    res.status(500).json({ error: 'Failed to create template content' });
  }
});

// 删除单个内容项
router.delete('/:templateId/content/:contentId', async (req: AuthRequest, res) => {
  try {
    const { contentId } = req.params;

    const { error } = await supabaseAdmin
      .from('template_content')
      .delete()
      .eq('id', contentId);

    if (error) throw error;

    res.json({ success: true });
  } catch (error) {
    console.error('Template content deletion error:', error);
    res.status(500).json({ error: 'Failed to delete template content' });
  }
});

router.get('/scan', async (req: AuthRequest, res) => {
  try {
    const scannedTemplates = await templateScanner.scanTemplates();

    res.json({
      success: true,
      templates: scannedTemplates,
      count: scannedTemplates.length,
    });
  } catch (error) {
    console.error('Template scan error:', error);
    res.status(500).json({ error: 'Failed to scan templates' });
  }
});

router.post('/sync', async (req: AuthRequest, res) => {
  try {
    const scannedTemplates = await templateScanner.scanTemplates();

    const { data: existingTemplates, error: fetchError } = await supabaseAdmin
      .from('landing_templates')
      .select('template_key');

    if (fetchError) throw fetchError;

    const existingKeys = new Set(existingTemplates?.map(t => t.template_key) || []);
    const scannedKeys = new Set(scannedTemplates.map(t => t.template_key));

    const newTemplates = scannedTemplates.filter(t => !existingKeys.has(t.template_key));
    const missingTemplates = Array.from(existingKeys).filter(k => !scannedKeys.has(k));

    const results = {
      added: [] as any[],
      skipped: [] as string[],
      missing: missingTemplates,
    };

    for (const template of newTemplates) {
      const { data, error } = await supabaseAdmin
        .from('landing_templates')
        .insert({
          name: template.name,
          template_key: template.template_key,
          description: template.description,
          config: {},
          is_active: false,
          preview_image: template.metadata.preview_image || null,
        })
        .select()
        .single();

      if (error) {
        console.error(`Failed to add template ${template.template_key}:`, error);
        results.skipped.push(template.template_key);
      } else {
        results.added.push(data);
      }
    }

    const updatedTemplates = scannedTemplates.filter(t => existingKeys.has(t.template_key));
    for (const template of updatedTemplates) {
      await supabaseAdmin
        .from('landing_templates')
        .update({
          name: template.name,
          description: template.description,
          preview_image: template.metadata.preview_image || null,
          updated_at: new Date().toISOString(),
        })
        .eq('template_key', template.template_key);
    }

    res.json({
      success: true,
      results,
      total_scanned: scannedTemplates.length,
      total_in_db: existingKeys.size,
    });
  } catch (error) {
    console.error('Template sync error:', error);
    res.status(500).json({ error: 'Failed to sync templates' });
  }
});

export default router;
