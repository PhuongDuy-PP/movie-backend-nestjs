#!/bin/bash

# Script để chạy trên EC2 instance lần đầu tiên
# Chạy script này sau khi SSH vào EC2

set -e

echo "🔧 Setting up AWS EC2 for Movie Backend..."

# Update system
echo "📦 Updating system..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker ubuntu
    rm get-docker.sh
    echo "✅ Docker installed"
else
    echo "✅ Docker already installed"
fi

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo apt install docker-compose -y
    echo "✅ Docker Compose installed"
else
    echo "✅ Docker Compose already installed"
fi

# Install Git
echo "📦 Installing Git..."
if ! command -v git &> /dev/null; then
    sudo apt install git -y
    echo "✅ Git installed"
else
    echo "✅ Git already installed"
fi

# Install useful tools
echo "📦 Installing useful tools..."
sudo apt install -y curl wget nano htop

# Setup firewall
echo "🔥 Setting up firewall..."
sudo ufw --force enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp

echo ""
echo "✅ Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Clone your repository: git clone YOUR_REPO_URL"
echo "2. cd backend-movie-nestjs"
echo "3. cp env.example .env"
echo "4. nano .env (update configuration)"
echo "5. ./deploy-ec2.sh"
echo ""
echo "💡 Note: You may need to logout and login again for Docker group to take effect"

