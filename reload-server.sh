#!/bin/bash

echo "Reloading production server..."

# Find the production server process
PID=$(curl -s https://oaastock.com/health > /dev/null 2>&1 && echo "Server is running")

if [ -z "$PID" ]; then
    echo "Production server is not accessible"
    exit 1
fi

echo "Production server is running at https://oaastock.com"
echo "Built files are ready in dist/ directory"
echo ""
echo "To apply changes to the production server:"
echo "1. Copy the dist/ directory to your production server"
echo "2. Restart the Node.js process on the production server"
echo ""
echo "Server health check: https://oaastock.com/health"
