#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}AI Stock Analysis - Deployment${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    echo "Please install Docker Compose first"
    exit 1
fi

COMPOSE_CMD="docker-compose"
if ! command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker compose"
fi

if [ ! -f .env ]; then
    echo -e "${YELLOW}Warning: .env file not found${NC}"
    if [ -f .env.example ]; then
        echo -e "${BLUE}Creating .env from .env.example...${NC}"
        cp .env.example .env
        echo -e "${GREEN}Created .env file${NC}"
        echo -e "${YELLOW}Please edit .env file with your configuration before continuing${NC}"
        echo -e "${YELLOW}Press Enter to continue after editing, or Ctrl+C to exit${NC}"
        read
    else
        echo -e "${RED}Error: .env.example not found${NC}"
        exit 1
    fi
fi

source .env
PORT=${PORT:-3001}

if [ ! -d "logs" ]; then
    echo -e "${BLUE}Creating logs directory...${NC}"
    mkdir -p logs
    echo -e "${GREEN}Logs directory created${NC}"
fi

echo -e "${BLUE}Stopping existing containers...${NC}"
$COMPOSE_CMD down 2>/dev/null || true

echo -e "${BLUE}Building Docker image...${NC}"
$COMPOSE_CMD build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}Build successful${NC}"
echo ""

echo -e "${BLUE}Starting containers...${NC}"
$COMPOSE_CMD up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to start containers${NC}"
    exit 1
fi

echo -e "${GREEN}Containers started successfully${NC}"
echo ""

echo -e "${BLUE}Waiting for application to be ready...${NC}"
sleep 5

max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:$PORT/health > /dev/null 2>&1; then
        echo -e "${GREEN}Application is ready${NC}"
        break
    fi
    attempt=$((attempt + 1))
    echo -e "${YELLOW}Waiting... ($attempt/$max_attempts)${NC}"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo -e "${RED}Application failed to start within timeout${NC}"
    echo -e "${YELLOW}Check logs with: ./logs.sh${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Deployment Successful${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}Application URL:${NC} http://localhost:$PORT"
echo -e "${BLUE}Health Check:${NC} http://localhost:$PORT/health"
echo -e "${BLUE}Admin Login:${NC} http://localhost:$PORT/admin/login"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo -e "  ${BLUE}./logs.sh${NC}     - View logs"
echo -e "  ${BLUE}./status.sh${NC}   - Check status"
echo -e "  ${BLUE}./restart.sh${NC}  - Restart service"
echo -e "  ${BLUE}./stop.sh${NC}     - Stop service"
echo ""
