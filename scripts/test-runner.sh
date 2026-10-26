#!/bin/bash

# Landing Engine v4.0 - Test Runner with Logging
# TDD/CDD Methodology: Run tests, save results, cleanup old logs

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOGS_DIR="$PROJECT_ROOT/logs"
TEST_RESULTS_DIR="$LOGS_DIR/test-results"
LATEST_DIR="$LOGS_DIR/latest"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Landing Engine v4.0 - Test Runner (TDD/CDD)            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Create directories
mkdir -p "$TEST_RESULTS_DIR"
mkdir -p "$LATEST_DIR"

# Cleanup old test results (keep only last 5)
echo -e "${YELLOW}🧹 Cleaning up old test results...${NC}"
cd "$TEST_RESULTS_DIR"
ls -dt */ 2>/dev/null | tail -n +6 | xargs rm -rf 2>/dev/null || true
cd "$PROJECT_ROOT"

# Create timestamp for this run
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
RUN_DIR="$TEST_RESULTS_DIR/$TIMESTAMP"
mkdir -p "$RUN_DIR"

echo -e "${BLUE}📁 Test results directory: $RUN_DIR${NC}"
echo ""

# Run tests
echo -e "${GREEN}🧪 Running tests...${NC}"
echo ""

# Run unit tests
echo -e "${YELLOW}━━━ Unit Tests ━━━${NC}"
npm run test -- --run --reporter=json > "$RUN_DIR/unit-tests.json" 2>&1 || true
npm run test -- --run --reporter=verbose > "$RUN_DIR/unit-tests.log" 2>&1 || true

# Run with coverage
echo -e "${YELLOW}━━━ Coverage Report ━━━${NC}"
npm run test -- --run --coverage > "$RUN_DIR/coverage.log" 2>&1 || true

# Save summary
echo -e "${YELLOW}━━━ Test Summary ━━━${NC}"
{
  echo "Test Run: $TIMESTAMP"
  echo "Date: $(date)"
  echo "Branch: $(git branch --show-current 2>/dev/null || echo 'unknown')"
  echo "Commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
  echo ""
  echo "Test Results:"
  cat "$RUN_DIR/unit-tests.log" | tail -20
} > "$RUN_DIR/summary.txt"

cat "$RUN_DIR/summary.txt"

# Update latest symlink
rm -rf "$LATEST_DIR"
ln -s "$RUN_DIR" "$LATEST_DIR"

echo ""
echo -e "${GREEN}✅ Test run completed!${NC}"
echo -e "${BLUE}📊 Results saved to: $RUN_DIR${NC}"
echo -e "${BLUE}🔗 Latest results: $LATEST_DIR${NC}"
echo ""

# Show test status
if grep -q "Test Files.*passed" "$RUN_DIR/unit-tests.log" 2>/dev/null; then
  echo -e "${GREEN}✅ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed. Check logs in $RUN_DIR${NC}"
  exit 1
fi
