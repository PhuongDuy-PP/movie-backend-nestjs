# GitHub Actions Workflows

## 📋 Workflows Available

### 1. `deploy.yml` - Main CI/CD Pipeline (Recommended)
- **Trigger**: Push to `main` or `master` branch
- **What it does**:
  - ✅ Build và Test code
  - 🚀 Deploy lên AWS EC2
  - 🏥 Health check
  - 📊 Deployment summary

### 2. `ci.yml` - CI Only (No Deployment)
- **Trigger**: Pull Request hoặc Push
- **What it does**:
  - ✅ Build và Test code
  - 🔍 Lint code
  - 📦 Build check

### 3. `deploy-ec2.yml` - Simple Deploy Only
- **Trigger**: Push to `main` or `master`
- **What it does**:
  - 🚀 Deploy lên EC2 (không build/test)

## 🔧 Setup Required

### GitHub Secrets

Vào **Settings** → **Secrets and variables** → **Actions**, thêm:

1. **`EC2_SSH_KEY`**: Private SSH key từ EC2
2. **`EC2_HOST`**: Public IP của EC2 (ví dụ: `54.123.45.67`)
3. **`EC2_USER`**: SSH user (thường là `ubuntu`)
4. **`REPO_URL`**: Repository URL (ví dụ: `https://github.com/username/repo.git`)

### EC2 Setup

Chạy script setup trên EC2:

```bash
# SSH vào EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Run setup script
wget https://raw.githubusercontent.com/YOUR_REPO/main/setup-github-actions.sh
chmod +x setup-github-actions.sh
./setup-github-actions.sh
```

## 🚀 Usage

### Automatic Deployment

Push code vào `main` branch:

```bash
git add .
git commit -m "Update code"
git push origin main
```

GitHub Actions sẽ tự động:
1. Build và test
2. Deploy lên EC2
3. Run migrations
4. Health check

### Manual Deployment

1. Vào **Actions** tab trên GitHub
2. Chọn workflow **"CI/CD - Build and Deploy to EC2"**
3. Click **"Run workflow"**
4. Chọn branch
5. Click **"Run workflow"**

## 📊 Workflow Status

Xem trạng thái deployment:
- **Actions** tab → Click vào workflow run
- Xem logs từng bước
- Deployment summary ở cuối

## 🔍 Troubleshooting

### SSH Connection Failed

1. Kiểm tra SSH key trong GitHub Secrets
2. Test SSH thủ công:
   ```bash
   ssh -i ~/.ssh/github_actions_key ubuntu@YOUR_EC2_IP
   ```

### Deployment Failed

1. Xem logs trong GitHub Actions
2. SSH vào EC2 và check:
   ```bash
   cd ~/backend-movie-nestjs
   docker-compose logs -f
   ```

### Build Failed

- Kiểm tra TypeScript errors
- Kiểm tra dependencies trong `package.json`
- Xem build logs trong GitHub Actions

## 📚 Documentation

- [GITHUB_ACTIONS_SETUP.md](../GITHUB_ACTIONS_SETUP.md) - Chi tiết setup
- [QUICK_CI_CD_SETUP.md](../QUICK_CI_CD_SETUP.md) - Quick start guide
- [AWS_EC2_DEPLOY.md](../AWS_EC2_DEPLOY.md) - EC2 deployment guide

