#!/bin/bash

# Landing Engine v4.0 - Git Hooks Setup
# Ensures TDD methodology: tests must pass before commit

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
HOOKS_DIR="$PROJECT_ROOT/.git/hooks"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Landing Engine v4.0 - Git Hooks Setup                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if git repository
if [ ! -d "$PROJECT_ROOT/.git" ]; then
  echo -e "${YELLOW}⚠️  Not a git repository. Initializing...${NC}"
  cd "$PROJECT_ROOT"
  git init
fi

mkdir -p "$HOOKS_DIR"

# Create pre-commit hook
cat > "$HOOKS_DIR/pre-commit" << 'EOF'
#!/bin/bash

echo "🧪 Running tests before commit (TDD/CDD)..."

# Run tests
npm run test -- --run

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Tests failed! Fix tests before committing."
  echo "💡 Run: npm run test"
  exit 1
fi

echo ""
echo "✅ All tests passed! Proceeding with commit."
EOF

chmod +x "$HOOKS_DIR/pre-commit"

# Create commit-msg hook for conventional commits
cat > "$HOOKS_DIR/commit-msg" << 'EOF'
#!/bin/bash

commit_msg=$(cat "$1")

# Conventional commit pattern
pattern="^(feat|fix|test|refactor|docs|style|perf|ci|chore|build)(\(.+\))?: .+"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
  echo ""
  echo "❌ Invalid commit message format!"
  echo ""
  echo "Expected format: <type>(<scope>): <description>"
  echo ""
  echo "Types:"
  echo "  feat:     New feature"
  echo "  fix:      Bug fix"
  echo "  test:     Adding tests"
  echo "  refactor: Code refactoring"
  echo "  docs:     Documentation"
  echo "  style:    Code style"
  echo "  perf:     Performance"
  echo "  ci:       CI/CD"
  echo "  chore:    Maintenance"
  echo ""
  echo "Examples:"
  echo "  feat: add user authentication"
  echo "  test: add unit tests for parser"
  echo "  fix(parser): handle empty frontmatter"
  echo ""
  exit 1
fi

echo "✅ Commit message follows conventional format."
EOF

chmod +x "$HOOKS_DIR/commit-msg"

echo -e "${GREEN}✅ Git hooks installed successfully!${NC}"
echo ""
echo -e "${BLUE}Installed hooks:${NC}"
echo "  • pre-commit: Runs tests before each commit"
echo "  • commit-msg: Validates conventional commit format"
echo ""
echo -e "${YELLOW}TDD/CDD Methodology enforced:${NC}"
echo "  1. Write tests first (RED)"
echo "  2. Make tests pass (GREEN)"
echo "  3. Refactor (REFACTOR)"
echo "  4. Commit with conventional message"
