#!/bin/bash

COMPOSE_CMD="docker-compose"
if ! command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker compose"
fi

echo "Restarting AI Stock Analysis..."
$COMPOSE_CMD restart

if [ $? -eq 0 ]; then
    echo "Service restarted successfully"
    ./status.sh
else
    echo "Failed to restart service"
    exit 1
fi
