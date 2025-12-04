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

    // 优先使用模板的 footer_config，如果没有则使用域名的 footer_config
    let footerConfig = template.footer_config || null;

    // 如果模板没有配置或配置为空对象，回退到域名配置
    if (!footerConfig || Object.keys(footerConfig).length === 0) {
      const domainConfig = await domainDetector.getConfigForRequest(req);
      footerConfig = domainConfig?.footer_config || null;
    }

    const configUpdatedAt = template.updated_at || template.created_at || null;

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
    const { category } = req.query;

    let query = supabaseAdmin
      .from('landing_templates')
      .select('*');

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    query = query
      .order('is_active', { ascending: false })
      .order('category_order', { ascending: true })
      .order('created_at', { ascending: false });

    const { data, error } = await query;

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
    const { name, template_key, description, config, category, category_order } = req.body;

    if (!name || !template_key) {
      return res.status(400).json({ error: 'Name and template_key are required' });
    }

    const insertData: any = {
      name,
      template_key,
      description,
      config: config || {},
      is_active: false,
    };

    if (category !== undefined) insertData.category = category;
    if (category_order !== undefined) insertData.category_order = category_order;

    const { data, error } = await supabaseAdmin
      .from('landing_templates')
      .insert(insertData)
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
    const { name, description, config, preview_image, category, category_order, footer_config } = req.body;

    const updates: any = { updated_at: new Date().toISOString() };
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (config !== undefined) updates.config = config;
    if (preview_image !== undefined) updates.preview_image = preview_image;
    if (category !== undefined) updates.category = category;
    if (category_order !== undefined) updates.category_order = category_order;
    if (footer_config !== undefined) updates.footer_config = footer_config;

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

// 获取模板的页脚配置
router.get('/:id/footer-config', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const { data: template, error } = await supabaseAdmin
      .from('landing_templates')
      .select('footer_config, category')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;

    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const footerConfig = template.footer_config || {};
    const hasCustomConfig = footerConfig && Object.keys(footerConfig).length > 0;

    res.json({
      footer_config: footerConfig,
      has_custom_config: hasCustomConfig,
      category: template.category,
    });
  } catch (error) {
    console.error('Template footer config fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch template footer config' });
  }
});

// 从其他模板复制页脚配置
router.post('/:id/copy-footer', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { source_template_id } = req.body;

    if (!source_template_id) {
      return res.status(400).json({ error: 'source_template_id is required' });
    }

    // 获取源模板的页脚配置
    const { data: sourceTemplate, error: sourceError } = await supabaseAdmin
      .from('landing_templates')
      .select('footer_config')
      .eq('id', source_template_id)
      .maybeSingle();

    if (sourceError) throw sourceError;

    if (!sourceTemplate) {
      return res.status(404).json({ error: 'Source template not found' });
    }

    if (!sourceTemplate.footer_config || Object.keys(sourceTemplate.footer_config).length === 0) {
      return res.status(400).json({ error: 'Source template has no footer configuration' });
    }

    // 复制配置到目标模板
    const { data, error } = await supabaseAdmin
      .from('landing_templates')
      .update({
        footer_config: sourceTemplate.footer_config,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      footer_config: sourceTemplate.footer_config,
      data,
    });
  } catch (error) {
    console.error('Template footer config copy error:', error);
    res.status(500).json({ error: 'Failed to copy footer config' });
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
