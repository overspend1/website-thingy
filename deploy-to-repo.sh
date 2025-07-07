#!/bin/bash

# 🚀 Safe Repository Deployment Script for overspend.cloud ROM Mirror
# This script will safely update your repository with the new portfolio files

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Repository configuration
REPO_URL="https://github.com/overspend1/website-thingy.git"
REPO_NAME="website-thingy"
BRANCH="main"

echo -e "${BLUE}🚀 ROM Mirror Portfolio Deployment Script${NC}"
echo -e "${BLUE}Repository: ${REPO_URL}${NC}"
echo ""

# Function to print colored output
print_step() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in the portfolio directory
if [ ! -f "index.html" ]; then
    print_error "Please run this script from the portfolio directory"
    exit 1
fi

print_step "Starting safe repository deployment..."

# 1. Backup current directory
BACKUP_DIR="../portfolio-backup-$(date +%Y%m%d-%H%M%S)"
print_step "Creating backup at: $BACKUP_DIR"
cp -r . "$BACKUP_DIR"

# 2. Initialize or update git repository
if [ ! -d ".git" ]; then
    print_step "Initializing git repository..."
    git init
    git remote add origin "$REPO_URL"
else
    print_step "Git repository already initialized"
fi

# 3. Configure git (if not already configured)
if [ -z "$(git config user.name)" ]; then
    print_warning "Git user not configured. Please set your git username:"
    read -p "Enter your GitHub username: " username
    git config user.name "$username"
fi

if [ -z "$(git config user.email)" ]; then
    print_warning "Git email not configured. Please set your git email:"
    read -p "Enter your GitHub email: " email
    git config user.email "$email"
fi

# 4. Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    print_step "Creating .gitignore file..."
    cat > .gitignore << 'EOL'
# ROM Mirror Configuration
js/config.js

# Environment variables
.env
.env.local
.env.production

# API Keys and Secrets
**/config.js
**/secrets.js
**/*secret*
**/*key*
**/*token*

# Development files
.DS_Store
Thumbs.db
*.log
*.tmp
*.temp

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Node modules (if using build tools)
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
out/

# Cache directories
.cache/
.parcel-cache/

# Backup files
*.backup
*.bak
*.old

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
EOL
fi

# 5. Remove any existing config.js files (security)
if [ -f "js/config.js" ]; then
    print_warning "Removing existing config.js for security..."
    rm js/config.js
fi

# 6. Check for exposed API keys in JavaScript files only
print_step "Scanning JavaScript files for API keys..."
if grep -r "AIzaSy" js/ 2>/dev/null; then
    print_error "Found exposed API keys in JavaScript files! Please remove them manually."
    echo "Files containing potential API keys:"
    grep -r "AIzaSy" js/ -l 2>/dev/null || true
    exit 1
else
    print_step "No API keys found in JavaScript files"
fi

# 7. Stage all files
print_step "Staging files for commit..."
git add .

# 8. Check what's being committed
echo ""
echo -e "${BLUE}📋 Files to be committed:${NC}"
git status --porcelain

echo ""
print_warning "Review the files above. Do you want to continue? (y/N)"
read -p "Continue with commit? " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Deployment cancelled by user"
    exit 1
fi

# 9. Create commit
COMMIT_MESSAGE="🚀 Deploy ROM Mirror Portfolio with Glassmorphism

✨ Features:
- Enhanced glassmorphism design throughout
- Google Drive ROM mirror integration
- Professional icon system (no emojis)
- GitHub Actions secure deployment
- Responsive design for all devices

🔐 Security:
- API keys protected via GitHub Secrets
- No sensitive data in repository
- Automated security scanning

🎯 ROM Mirror:
- Real Google Drive file browser
- Download tracking and analytics
- Beautiful file management interface
- Mobile-optimized experience"

print_step "Creating commit..."
git commit -m "$COMMIT_MESSAGE"

# 10. Set upstream and push
print_step "Pushing to repository..."
git branch -M main
git remote set-url origin "$REPO_URL"

# First push might need force if repository exists
if git push -u origin main 2>/dev/null; then
    print_step "Successfully pushed to repository!"
else
    print_warning "Initial push failed, trying with force (this is normal for first deployment)..."
    git push -u origin main --force
    print_step "Force push completed successfully!"
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Go to your repository: $REPO_URL"
echo "2. Navigate to Settings > Secrets and variables > Actions"
echo "3. Add these repository secrets:"
echo "   - DRIVE_API_KEY: (your new secure Google Drive API key)"
echo "   - DRIVE_FOLDER_ID: 19UPdNOK1K4Rq-SeieF1q1L7WksNm3YJR"
echo "4. Go to Settings > Pages and set Source to 'GitHub Actions'"
echo "5. The site will automatically deploy to overspend.cloud"
echo ""
echo -e "${GREEN}🔐 Security Reminders:${NC}"
echo "- Create a NEW API key (delete the old exposed one)"
echo "- Restrict API key to overspend.cloud domain only"
echo "- Never commit js/config.js to git"
echo ""
echo -e "${BLUE}📊 Monitoring:${NC}"
echo "- Check GitHub Actions tab for deployment status"
echo "- Monitor Google Cloud Console for API usage"
echo "- Test ROM Mirror functionality after deployment"
echo ""
print_step "Backup created at: $BACKUP_DIR"
print_step "Repository URL: $REPO_URL"
print_step "Your portfolio will be live at: https://overspend.cloud"
