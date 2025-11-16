#!/bin/bash

# Deployment script for AWS/DigitalOcean
# Usage: ./deploy.sh [production|development]

set -e

ENVIRONMENT=${1:-production}

echo "🚀 Starting deployment for $ENVIRONMENT environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from env.example..."
    cp env.example .env
    echo "⚠️  Please update .env file with your configuration before continuing."
    exit 1
fi

# Build Docker images
echo "📦 Building Docker images..."
if [ "$ENVIRONMENT" == "development" ]; then
    docker-compose -f docker-compose.dev.yml build
else
    docker-compose build
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
if [ "$ENVIRONMENT" == "development" ]; then
    docker-compose -f docker-compose.dev.yml down
else
    docker-compose down
fi

# Start containers
echo "🚀 Starting containers..."
if [ "$ENVIRONMENT" == "development" ]; then
    docker-compose -f docker-compose.dev.yml up -d
else
    docker-compose up -d
fi

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run migrations
echo "📊 Running database migrations..."
if [ "$ENVIRONMENT" == "development" ]; then
    docker-compose -f docker-compose.dev.yml run --rm backend npm run migration:run
else
    docker-compose run --rm backend npm run migration:run
fi

# Check if admin user exists, if not create one
echo "👤 Checking admin user..."
if [ "$ENVIRONMENT" == "development" ]; then
    docker-compose -f docker-compose.dev.yml run --rm backend npm run create:admin admin@example.com password123 "Admin User" || echo "Admin user already exists"
else
    docker-compose run --rm backend npm run create:admin admin@example.com password123 "Admin User" || echo "Admin user already exists"
fi

# Check health
echo "🏥 Checking application health..."
sleep 5
curl -f http://localhost:3000/health || echo "⚠️  Health check failed. Please check logs."

echo "✅ Deployment completed!"
echo "🌐 Application is running on http://localhost:3000"
echo "📚 Swagger documentation: http://localhost:3000/api"
echo "📋 View logs: docker-compose logs -f"

