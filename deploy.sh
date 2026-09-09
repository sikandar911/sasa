#!/bin/bash
set -e

echo "=================================================="
echo "?? Starting Deployment for Ajeer Verification Platform"
echo "?? Production Domain: https://ajeer.qiwa-sa.info"
echo "?? Target Port: 3003"
echo "=================================================="

# 1. Ensure .env exists
if [ ! -f .env ]; then
  echo "?? .env file not found!"
  if [ -f .env.example ]; then
    echo "?? Creating .env from .env.example template..."
    cp .env.example .env
    echo "? IMPORTANT: Edit .env to set your production secrets & DATABASE_URL."
  else
    echo "? Missing .env and .env.example! Exiting."
    exit 1
  fi
fi

# 2. Pull latest code from GitHub main branch
echo "?? Pulling latest code from origin main..."
git pull origin main

# 3. Stop existing container and rebuild image
echo "?? Rebuilding Docker image and launching container on port 3003..."
if command -v docker-compose &> /dev/null; then
  docker-compose down || true
  docker-compose build --no-cache
  docker-compose up -d
else
  docker compose down || true
  docker compose build --no-cache
  docker compose up -d
fi

# 4. Sync Prisma database schema with existing database
echo "??? Syncing Prisma database schema with production database..."
if command -v docker-compose &> /dev/null; then
  docker-compose exec -T ajeer-web npx prisma db push --skip-generate || true
else
  docker compose exec -T ajeer-web npx prisma db push --skip-generate || true
fi

# 5. Display container status
echo "?? Container Status:"
docker ps | grep ajeer_qiwa_web || true

echo "=================================================="
echo "? Deployment completed successfully!"
echo "?? App running on http://127.0.0.1:3003"
echo "=================================================="

