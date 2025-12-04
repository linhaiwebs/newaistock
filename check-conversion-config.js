#!/usr/bin/env node

/**
 * Google Ads 转化配置检查脚本
 *
 * 用途：检查数据库中的 Google Ads 转化配置是否正确
 * 运行：node check-conversion-config.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 错误: 缺少 Supabase 环境变量');
  console.error('   请确保 .env 文件中包含:');
  console.error('   - VITE_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConfiguration() {
  console.log('\n🔍 检查 Google Ads 转化配置...\n');
  console.log('━'.repeat(60));

  try {
    const { data, error } = await supabase
      .from('analytics_config')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('❌ 数据库查询错误:', error.message);
      return;
    }

    if (!data) {
      console.log('⚠️  未找到配置记录');
      console.log('\n建议：在管理后台（/admin → Analytics）创建配置\n');
      return;
    }

    console.log('📊 配置信息:\n');

    const ga4Id = data.ga4_measurement_id;
    const adsId = data.google_ads_conversion_id;
    const conversionId = data.conversion_action_id;
    const enabled = data.enabled;

    console.log(`1️⃣  GA4 Measurement ID: ${ga4Id || '❌ 未设置'}`);
    if (ga4Id) {
      if (ga4Id.startsWith('G-')) {
        console.log('   ✅ 格式正确');
      } else {
        console.log('   ⚠️  格式可能错误（应该以 G- 开头）');
      }
    }
    console.log();

    console.log(`2️⃣  Google Ads 转化 ID: ${adsId || '❌ 未设置'}`);
    if (adsId) {
      if (adsId.startsWith('AW-')) {
        console.log('   ✅ 格式正确');
      } else {
        console.log('   ⚠️  格式可能错误（应该以 AW- 开头）');
      }
    }
    console.log();

    console.log(`3️⃣  转化操作 ID: ${conversionId || '❌ 未设置'}`);
    if (conversionId) {
      if (conversionId.includes('/') && conversionId.startsWith('AW-')) {
        console.log('   ✅ 格式正确');
      } else {
        console.log('   ⚠️  格式可能错误（应该是 AW-XXXXX/XXXXX 格式）');
      }
    } else {
      console.log('   ❌ 这是必需的！没有此 ID，转化事件不会触发');
    }
    console.log();

    console.log(`4️⃣  跟踪状态: ${enabled ? '✅ 已启用' : '❌ 未启用'}`);
    console.log();

    console.log('━'.repeat(60));
    console.log('\n📋 诊断结果:\n');

    let issueCount = 0;

    if (!ga4Id) {
      console.log('❌ 缺少 GA4 Measurement ID');
      issueCount++;
    }

    if (!adsId) {
      console.log('❌ 缺少 Google Ads 转化 ID');
      issueCount++;
    }

    if (!conversionId) {
      console.log('❌ 缺少转化操作 ID（这是导致转化不触发的主要原因）');
      issueCount++;
    } else if (!conversionId.includes('/') || !conversionId.startsWith('AW-')) {
      console.log('⚠️  转化操作 ID 格式可能不正确');
      issueCount++;
    }

    if (!enabled) {
      console.log('⚠️  跟踪功能未启用');
      issueCount++;
    }

    if (issueCount === 0) {
      console.log('✅ 所有配置正确！');
      console.log('\n📝 后续步骤:');
      console.log('   1. 确认网站已重新部署');
      console.log('   2. 测试转化按钮');
      console.log('   3. 在 Google Ads 中查看转化数据（等待 5-10 分钟）');
    } else {
      console.log(`\n⚠️  发现 ${issueCount} 个问题需要修复`);
      console.log('\n🔧 修复步骤:');
      console.log('   1. 登录管理后台: https://your-domain.com/admin');
      console.log('   2. 进入 Analytics 页面');
      console.log('   3. 填写正确的 Google Ads 信息');
      console.log('   4. 勾选"启用跟踪"');
      console.log('   5. 点击"保存设置"');
    }

    console.log('\n━'.repeat(60));

    console.log('\n💡 提示:');
    console.log('   - 转化操作 ID 格式: AW-123456789/AbCdEfGhIj');
    console.log('   - 从 Google Ads → 工具和设置 → 转化 中获取');
    console.log('   - 选择要跟踪的转化操作，复制完整的标签\n');

  } catch (err) {
    console.error('❌ 发生错误:', err.message);
    console.error('\n请检查:');
    console.error('   1. Supabase 连接是否正常');
    console.error('   2. analytics_config 表是否存在');
    console.error('   3. 环境变量是否正确配置\n');
  }
}

async function testConnection() {
  console.log('🔌 测试数据库连接...');

  try {
    const { data, error } = await supabase
      .from('analytics_config')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ 连接失败:', error.message);
      return false;
    }

    console.log('✅ 连接成功\n');
    return true;
  } catch (err) {
    console.error('❌ 连接错误:', err.message);
    return false;
  }
}

async function main() {
  console.clear();
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  Google Ads 转化配置检查工具                              ║');
  console.log('║  Version 1.0.0                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  const connected = await testConnection();

  if (!connected) {
    console.log('\n❌ 无法连接到数据库，请检查配置\n');
    process.exit(1);
  }

  await checkConfiguration();

  console.log('\n✨ 检查完成\n');
}

main().catch(console.error);
