#!/bin/bash

# Simple deployment script for AWS EC2
# Usage: ./deploy-ec2.sh

set -e

echo "🚀 Deploying to AWS EC2..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from env.example..."
    cp env.example .env
    echo "⚠️  Please update .env file with your configuration:"
    echo "   - DB_PASSWORD"
    echo "   - JWT_SECRET"
    echo "   - BASE_URL"
    echo "   - FRONTEND_URL"
    exit 1
fi

# Build Docker image
echo "📦 Building Docker image..."
docker-compose build

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start containers
echo "🚀 Starting containers..."
docker-compose up -d

# Wait for database
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run migrations
echo "📊 Running database migrations..."
docker-compose run --rm backend npm run migration:run || echo "⚠️  Migrations may have already run"

# Check health
echo "🏥 Checking application health..."
sleep 5
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Application is healthy!"
else
    echo "⚠️  Health check failed. Check logs with: docker-compose logs -f"
fi

echo ""
echo "✅ Deployment completed!"
echo "🌐 Application: http://localhost:3000"
echo "📚 Swagger: http://localhost:3000/api"
echo "📋 Logs: docker-compose logs -f"
echo "🛑 Stop: docker-compose down"

