# Google Analytics 配置唯一性验证报告

## 验证结果

✅ **系统已正确配置唯一性约束**

analytics_config 表只能存储**一条**记录，这是通过数据库级别的约束保证的。

## 数据库保护机制

### 1. 单例约束 (Singleton Constraint)

```sql
-- 唯一索引确保只能有一行数据
CREATE UNIQUE INDEX analytics_config_singleton_idx
ON analytics_config (singleton_guard);

-- 检查约束确保 singleton_guard 始终为 1
ALTER TABLE analytics_config
ADD CONSTRAINT analytics_config_singleton_check
CHECK (singleton_guard = 1);
```

**工作原理:**
- 每行数据的 `singleton_guard` 字段必须为 `1`
- 数据库级别的唯一索引确保不能有两行 `singleton_guard = 1`
- 因此，最多只能存在一行数据

### 2. 测试验证

尝试插入第二条记录会被数据库拒绝:

```
ERROR: duplicate key value violates unique constraint "analytics_config_singleton_idx"
DETAIL: Key (singleton_guard)=(1) already exists.
```

## 当前数据状态

```sql
SELECT COUNT(*) FROM analytics_config;
-- 结果: 1 行
```

表中当前只有一条记录，符合预期。

## 后端代码保护

`server/routes/admin.ts` 中的更新逻辑:

```typescript
// 1. 先检查是否已存在配置
const { data: existing } = await supabase
  .from('analytics_config')
  .select('id')
  .maybeSingle();

// 2. 如果存在，执行 UPDATE
if (existing) {
  result = await supabase
    .from('analytics_config')
    .update({ ... })
    .eq('id', existing.id);
}
// 3. 如果不存在，执行 INSERT
else {
  result = await supabase
    .from('analytics_config')
    .insert({ ... });
}
```

**特点:**
- 先查询现有记录
- 如果存在，更新现有记录（不创建新记录）
- 如果不存在，才插入新记录
- 即使代码逻辑出错，数据库约束也会阻止重复插入

## 前端代码保护

`src/components/admin/AnalyticsPage.tsx` 中的保存逻辑:

```typescript
async function handleSave() {
  setSaving(true);  // 防止重复点击

  try {
    await updateAnalyticsConfig(token, config);
    setMessage({ type: 'success', text: '设置已保存' });
  } finally {
    setSaving(false);
  }
}
```

**特点:**
- 保存按钮在处理时禁用，防止重复提交
- 使用 `disabled={saving}` 属性
- 只有一个保存按钮，用户操作清晰明确

## 结论

系统通过**三层保护**确保 Google Analytics 配置的唯一性:

1. ✅ **数据库约束层**: 单例模式约束，物理上不可能存储多条记录
2. ✅ **后端逻辑层**: 先查询后更新的模式，确保只更新不重复插入
3. ✅ **前端交互层**: 禁用重复提交，用户体验友好

**当前状态**: 表中只有 1 条记录，系统运行正常。

**保障措施**: 即使出现并发请求或程序错误，数据库约束会阻止任何重复记录的创建。
