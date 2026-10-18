#!/usr/bin/env bash
set -e

echo "=========================================="
echo "🚀 Learn & Grow - Production Deployment"
echo "=========================================="

echo "📥 [1/4] Pulling latest updates from Git..."
git pull origin main

echo "⚙️ [2/4] Building Backend API..."
cd grow-backend
npm install --legacy-peer-deps
npm run build

echo "🎨 [3/4] Building Next.js Frontend..."
cd ../learn-grow
export NODE_OPTIONS="--max-old-space-size=2560"
npm install --legacy-peer-deps
npm run build

echo "🔄 [4/4] Reloading PM2 cluster with zero-downtime..."
cd ..
pm2 reload ecosystem.config.js || pm2 restart all

echo "=========================================="
echo "✅ Deployment Successful! Current PM2 Status:"
echo "=========================================="
pm2 status
