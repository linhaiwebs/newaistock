#!/bin/bash

COMPOSE_CMD="docker-compose"
if ! command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker compose"
fi

echo "Stopping AI Stock Analysis..."
$COMPOSE_CMD down

if [ $? -eq 0 ]; then
    echo "Service stopped successfully"
else
    echo "Failed to stop service"
    exit 1
fi
