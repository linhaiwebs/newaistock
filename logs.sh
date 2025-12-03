#!/bin/bash

COMPOSE_CMD="docker-compose"
if ! command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker compose"
fi

if [ "$1" = "-f" ]; then
    echo "Following logs (Ctrl+C to exit)..."
    $COMPOSE_CMD logs -f
else
    echo "Recent logs (use -f to follow):"
    echo "================================"
    $COMPOSE_CMD logs --tail=100
fi
