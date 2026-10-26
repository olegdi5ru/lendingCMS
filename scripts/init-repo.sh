#!/bin/bash

# Landing Engine v4.0 - Git Repository Initialization
# Initializes git repo and makes initial commit

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Landing Engine v4.0 - Git Repository Init               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if already a git repo
if [ -d ".git" ]; then
  echo -e "${YELLOW}⚠️  Git repository already exists.${NC}"
  read -p "Do you want to reinitialize? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 0
  fi
  rm -rf .git
fi

# Initialize git
echo -e "${BLUE}📦 Initializing git repository...${NC}"
git init

# Configure git (if not configured)
if [ -z "$(git config user.name)" ]; then
  echo -e "${YELLOW}⚠️  Git user not configured. Please configure:${NC}"
  echo "  git config --global user.name 'Your Name'"
  echo "  git config --global user.email 'your.email@example.com'"
  echo ""
fi

# Setup hooks
echo -e "${BLUE}🔧 Setting up git hooks...${NC}"
chmod +x scripts/*.sh
./scripts/setup-hooks.sh

# Add all files
echo -e "${BLUE}📝 Adding files to git...${NC}"
git add .

# Create initial commit
echo -e "${BLUE}💾 Creating initial commit...${NC}"
git commit -m "feat: initial Landing Engine v4.0 with TDD/CDD structure

- React 18 + TypeScript + Vite
- Tailwind CSS for styling
- Vitest + Testing Library for testing
- Landing-MD v3.0 parser with variable substitution
- Multi-tenant architecture
- A/B testing support
- Git hooks for TDD enforcement
- Log management system
- Conventional commits validation

TDD/CDD methodology:
- Unit tests for parser and store
- Integration tests for rendering pipeline
- Component tests for UI
- Coverage reporting
- Automatic log cleanup"

echo ""
echo -e "${GREEN}✅ Git repository initialized successfully!${NC}"
echo ""
echo -e "${BLUE}📊 Repository status:${NC}"
git status

echo ""
echo -e "${BLUE}🔗 Next steps:${NC}"
echo "  1. Configure git user (if not done):"
echo "     git config --global user.name 'Your Name'"
echo "     git config --global user.email 'your.email@example.com'"
echo ""
echo "  2. Add remote repository:"
echo "     git remote add origin <your-repo-url>"
echo ""
echo "  3. Start development:"
echo "     npm run dev"
echo ""
echo "  4. Run tests:"
echo "     npm run test"
echo ""
echo -e "${YELLOW}💡 Remember: TDD/CDD methodology is enforced via git hooks!${NC}"
