#!/bin/bash

echo "========================================="
echo "测试分析设置功能"
echo "========================================="
echo ""

API_BASE="https://oaastock.com/api"

echo "1. 测试管理员登录..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

if echo "$LOGIN_RESPONSE" | grep -q "\"success\":true"; then
    echo "✓ 登录成功"
    TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)
    if [ -z "$TOKEN" ]; then
        echo "✗ 无法提取token"
        exit 1
    fi
else
    echo "✗ 登录失败"
    echo "响应: $LOGIN_RESPONSE"
    exit 1
fi

echo ""
echo "2. 测试保存分析设置..."
SAVE_RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$API_BASE/admin/analytics/config" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "ga4_measurement_id": "G-TEST123",
    "google_ads_conversion_id": "AW-TEST456",
    "conversion_action_id": "AW-TEST456/test",
    "enabled": true
  }')

HTTP_CODE=$(echo "$SAVE_RESPONSE" | tail -n1)
BODY=$(echo "$SAVE_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ 保存成功 (HTTP $HTTP_CODE)"
    echo "响应: $BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
    echo "✗ 保存失败 (HTTP $HTTP_CODE)"
    echo "响应: $BODY"
    exit 1
fi

echo ""
echo "3. 测试读取分析设置..."
GET_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_BASE/admin/analytics/config" \
  -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$GET_RESPONSE" | tail -n1)
BODY=$(echo "$GET_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ 读取成功 (HTTP $HTTP_CODE)"
    echo "配置内容:"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
    echo "✗ 读取失败 (HTTP $HTTP_CODE)"
    echo "响应: $BODY"
fi

echo ""
echo "========================================="
echo "测试完成"
echo "========================================="
echo ""
echo "如果所有测试通过，说明分析设置功能已正常工作！"
echo ""
echo "登录信息："
echo "  URL: https://oaastock.com/admin/login"
echo "  用户名: admin"
echo "  密码: admin123"
echo ""
echo "⚠️  重要：首次登录后请立即更改默认密码！"
