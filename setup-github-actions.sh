#!/bin/bash

# Script để chạy trên EC2 để setup GitHub Actions SSH key
# Usage: ./setup-github-actions.sh

set -e

echo "🔐 Setting up GitHub Actions SSH key..."

# Tạo thư mục .ssh nếu chưa có
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Tạo SSH key mới
KEY_FILE=~/.ssh/github_actions_key

if [ -f "$KEY_FILE" ]; then
    echo "⚠️  SSH key already exists at $KEY_FILE"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cancelled."
        exit 1
    fi
fi

echo "🔑 Generating SSH key..."
ssh-keygen -t rsa -b 4096 -C "github-actions@$(hostname)" -f "$KEY_FILE" -N ""

# Thêm public key vào authorized_keys
echo "📝 Adding public key to authorized_keys..."
cat "$KEY_FILE.pub" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Display private key
echo ""
echo "✅ SSH key created successfully!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Copy the PRIVATE KEY below and add it to GitHub Secrets as 'EC2_SSH_KEY':"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
cat "$KEY_FILE"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Next steps:"
echo "1. Copy the private key above"
echo "2. Go to GitHub → Repository → Settings → Secrets → Actions"
echo "3. Add new secret:"
echo "   - Name: EC2_SSH_KEY"
echo "   - Value: (paste the private key above)"
echo "4. Also add these secrets:"
echo "   - EC2_HOST: $(curl -s ifconfig.me || echo 'YOUR_EC2_IP')"
echo "   - EC2_USER: $(whoami)"
echo "   - REPO_URL: https://github.com/username/repo.git"
echo ""

