# Google Ads 转化事件修复指南

## 问题描述

转化按钮点击后，只触发了普通的 GA4 事件，**没有触发 Google Ads 转化事件**。

## 原因分析

### 错误的实现（修复前）

```javascript
// ❌ 只触发了 GA4 自定义事件，不会计入 Google Ads 转化
export function trackConversionClick() {
  gtag('event', 'Add');
}
```

### 正确的实现（修复后）

```javascript
// ✅ 同时触发 GA4 事件和 Google Ads 转化
export function trackConversionClick() {
  gtag('event', 'Add');  // GA4 自定义事件

  gtag('event', 'conversion', {  // Google Ads 转化事件
    'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL'
  });
}
```

## 已修复的内容

文件：`src/lib/analytics.ts`

### 修改点 1：保存转化操作 ID

```javascript
let conversionActionId: string | null = null;

export async function initializeAnalytics() {
  const { data } = await supabase
    .from('analytics_config')
    .select('*')
    .eq('enabled', true)
    .maybeSingle();

  if (data && data.ga4_measurement_id) {
    // 保存转化操作 ID
    conversionActionId = data.conversion_action_id || null;
    loadGtag(data.ga4_measurement_id, data.google_ads_conversion_id);
  }
}
```

### 修改点 2：正确触发 Google Ads 转化

```javascript
export function trackConversionClick() {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    const gtag = (window as any).gtag;

    // 触发 GA4 自定义事件（用于报告分析）
    gtag('event', 'Add');

    // 触发 Google Ads 转化事件（用于广告优化）
    if (conversionActionId) {
      gtag('event', 'conversion', {
        'send_to': conversionActionId
      });
    }
  }
}
```

## 配置步骤

### 步骤 1：获取 Google Ads 转化信息

1. 登录 [Google Ads](https://ads.google.com)
2. 点击 **工具和设置** → **转化**
3. 创建新的转化操作或选择现有的
4. 获取以下信息：
   - **Google Ads 转化 ID**：格式为 `AW-123456789`
   - **转化操作 ID**：格式为 `AW-123456789/AbCdEfGhIj`

### 步骤 2：在管理后台配置

1. 访问管理后台：`https://your-domain.com/admin`
2. 登录后，点击 **Analytics**
3. 填写以下信息：

| 字段 | 说明 | 示例 |
|------|------|------|
| GA4 Measurement ID | Google Analytics 4 跟踪 ID | G-XXXXXXXXXX |
| Google Ads 转化 ID | Google Ads 账户 ID | AW-123456789 |
| **转化操作 ID** | **完整的转化标签** | **AW-123456789/AbCdEfGhIj** |

4. 点击 **启用跟踪**
5. 点击 **保存设置**

### 步骤 3：验证配置

1. 在管理后台保存设置后，打开浏览器开发者工具（F12）
2. 切换到 **Console** 标签
3. 刷新页面，应该看到：
   ```
   Analytics initialized with conversion_action_id: AW-123456789/AbCdEfGhIj
   ```

## 测试验证

### 方法 1：浏览器控制台测试

1. 打开网站，按 F12 打开开发者工具
2. 切换到 **Network** 标签
3. 筛选器输入 `google-analytics` 或 `collect`
4. 进行一次股票诊断
5. 点击转化按钮（"查看详细信息"）
6. 查看网络请求，应该看到：

```
请求 URL: https://www.google-analytics.com/g/collect
参数中包含:
  - en=Add (GA4 事件)
  - en=conversion (Google Ads 转化)
  - send_to=AW-123456789/AbCdEfGhIj
```

### 方法 2：Google Ads 实时报告

1. 登录 [Google Ads](https://ads.google.com)
2. 进入 **报告** → **预定义报告** → **其他** → **转化操作**
3. 查看时间范围设置为 **今天**
4. 点击转化按钮后，等待 5-10 分钟
5. 应该看到转化计数增加

### 方法 3：使用 Google Tag Assistant

1. 安装 [Tag Assistant Legacy](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk) Chrome 扩展
2. 打开网站，启动 Tag Assistant（点击扩展图标 → Enable）
3. 刷新页面
4. 进行股票诊断并点击转化按钮
5. 查看 Tag Assistant 报告，应该显示：
   - ✅ Google Analytics 4 事件
   - ✅ Google Ads 转化事件

## 常见问题

### Q1: 点击转化按钮后，在 Google Ads 中看不到转化

**A**: 转化数据有延迟，通常需要：
- **实时数据**：5-10 分钟
- **完整报告**：24-48 小时

### Q2: 浏览器控制台显示 "conversionActionId is null"

**A**: 检查管理后台的配置：
1. 确认 **转化操作 ID** 已填写
2. 确认 **启用跟踪** 已勾选
3. 点击 **保存设置**
4. 刷新前台页面

### Q3: 只触发了 GA4 事件，没有触发转化事件

**A**: 检查以下内容：
```javascript
// 打开浏览器控制台，输入：
localStorage.getItem('conversionActionId')

// 应该返回类似：
// "AW-123456789/AbCdEfGhIj"
```

如果返回 `null`，说明配置没有保存成功。

### Q4: 转化操作 ID 格式错误

**A**: 正确格式：
- ✅ `AW-123456789/AbCdEfGhIj-KlMnOpQr`
- ✅ `AW-987654321/XyZ123`
- ❌ `123456789` （缺少 AW- 前缀）
- ❌ `AW-123456789` （缺少转化标签）

## 调试技巧

### 在控制台手动测试

```javascript
// 检查 gtag 是否已加载
console.log(typeof gtag);  // 应该返回 "function"

// 手动触发转化事件
gtag('event', 'conversion', {
  'send_to': 'AW-123456789/AbCdEfGhIj'
});

// 检查 dataLayer
console.log(window.dataLayer);
```

### 查看发送的数据

```javascript
// 监听所有 gtag 调用
window.dataLayer = window.dataLayer || [];
window.dataLayer.push = function() {
  console.log('gtag call:', arguments);
  return Array.prototype.push.apply(this, arguments);
};
```

## 预期结果

配置正确后，每次点击转化按钮（"查看详细信息"/"詳細を見る"）都会：

1. **触发 GA4 事件** `Add`
   - 用于网站分析和报告
   - 在 GA4 报告中显示为自定义事件

2. **触发 Google Ads 转化事件** `conversion`
   - 用于广告优化和出价策略
   - 在 Google Ads 中计入转化次数
   - 影响智能出价策略

3. **更新数据库**
   - `stock_diagnoses.converted = true`
   - `user_events` 表添加 `conversion_click` 事件

## 验证清单

部署后请检查：

- [ ] 管理后台的 Analytics 页面显示正确的 ID
- [ ] 浏览器控制台没有错误
- [ ] 点击转化按钮后，Network 标签显示 conversion 请求
- [ ] Google Ads 实时报告显示转化（等待 10 分钟）
- [ ] 数据库中 `converted` 字段更新为 `true`

## 重新部署

如果修改了代码，需要重新部署：

```bash
npm run build
npm start
```

或使用 Docker：

```bash
docker-compose down
docker-compose up -d --build
```

---

**修复完成时间**: 2025年12月4日
**影响范围**: 所有点击转化按钮的用户
**向后兼容**: 是，仍然触发 GA4 事件
