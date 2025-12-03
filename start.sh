#!/bin/bash

COMPOSE_CMD="docker-compose"
if ! command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker compose"
fi

echo "Starting AI Stock Analysis..."
$COMPOSE_CMD up -d

if [ $? -eq 0 ]; then
    echo "Service started successfully"
    ./status.sh
else
    echo "Failed to start service"
    exit 1
fi
