#!/bin/bash

COMPOSE_CMD="docker-compose"
if ! command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker compose"
fi

source .env 2>/dev/null || true
PORT=${PORT:-3001}

echo "================================"
echo "AI Stock Analysis - Status"
echo "================================"
echo ""

echo "Container Status:"
$COMPOSE_CMD ps
echo ""

if docker ps | grep -q ai-stock-analysis; then
    echo "Health Check:"
    if curl -s http://localhost:$PORT/health > /dev/null 2>&1; then
        echo "✓ Application is healthy"
        echo ""
        curl -s http://localhost:$PORT/health | python3 -m json.tool 2>/dev/null || curl -s http://localhost:$PORT/health
    else
        echo "✗ Application is not responding"
    fi
else
    echo "✗ Container is not running"
fi

echo ""
echo "Application URL: http://localhost:$PORT"
echo ""
