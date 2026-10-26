#!/bin/bash

# Landing Engine v4.0 - Full Test Suite Runner
# Runs all tests, generates reports, and manages logs

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
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Landing Engine v4.0 - Full Test Suite (TDD/CDD)        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Create directories
mkdir -p "$TEST_RESULTS_DIR"
mkdir -p "$LATEST_DIR"

# Cleanup old test results (keep only last 5)
echo -e "${YELLOW}🧹 Phase 1: Cleaning up old test results...${NC}"
cd "$TEST_RESULTS_DIR"
OLD_RUNS=$(ls -dt */ 2>/dev/null | tail -n +6)
if [ -n "$OLD_RUNS" ]; then
  echo "$OLD_RUNS" | xargs rm -rf 2>/dev/null || true
  echo -e "  ${GREEN}✓${NC} Removed old test runs"
else
  echo -e "  ${GREEN}✓${NC} No old runs to clean"
fi
cd "$PROJECT_ROOT"
echo ""

# Create timestamp for this run
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
RUN_DIR="$TEST_RESULTS_DIR/$TIMESTAMP"
mkdir -p "$RUN_DIR"

echo -e "${BLUE}📁 Phase 2: Test results directory: $RUN_DIR${NC}"
echo ""

# Run type checking
echo -e "${PURPLE}━━━ Phase 3: Type Checking ━━━${NC}"
echo -e "${YELLOW}Running TypeScript type check...${NC}"
npm run typecheck > "$RUN_DIR/typecheck.log" 2>&1
TYPECHECK_STATUS=$?
if [ $TYPECHECK_STATUS -eq 0 ]; then
  echo -e "  ${GREEN}✓${NC} Type check passed"
else
  echo -e "  ${RED}✗${NC} Type check failed"
fi
echo ""

# Run unit tests
echo -e "${PURPLE}━━━ Phase 4: Unit Tests ━━━${NC}"
echo -e "${YELLOW}Running unit tests...${NC}"
npx vitest run --reporter=verbose > "$RUN_DIR/unit-tests.log" 2>&1
UNIT_STATUS=$?
npx vitest run --reporter=json > "$RUN_DIR/unit-tests.json" 2>&1 || true

if [ $UNIT_STATUS -eq 0 ]; then
  echo -e "  ${GREEN}✓${NC} Unit tests passed"
else
  echo -e "  ${RED}✗${NC} Unit tests failed"
fi
echo ""

# Run coverage
echo -e "${PURPLE}━━━ Phase 5: Coverage Report ━━━${NC}"
echo -e "${YELLOW}Generating coverage report...${NC}"
npx vitest run --coverage > "$RUN_DIR/coverage.log" 2>&1 || true
echo -e "  ${GREEN}✓${NC} Coverage report generated"
echo ""

# Run build
echo -e "${PURPLE}━━━ Phase 6: Build Check ━━━${NC}"
echo -e "${YELLOW}Running production build...${NC}"
npm run build > "$RUN_DIR/build.log" 2>&1
BUILD_STATUS=$?
if [ $BUILD_STATUS -eq 0 ]; then
  echo -e "  ${GREEN}✓${NC} Build successful"
else
  echo -e "  ${RED}✗${NC} Build failed"
fi
echo ""

# Generate summary
echo -e "${PURPLE}━━━ Phase 7: Generating Summary ━━━${NC}"
{
  echo "═══════════════════════════════════════════════════════════"
  echo "  Landing Engine v4.0 - Test Run Summary"
  echo "═══════════════════════════════════════════════════════════"
  echo ""
  echo "Timestamp: $TIMESTAMP"
  echo "Date: $(date)"
  echo "Branch: $(git branch --show-current 2>/dev/null || echo 'detached')"
  echo "Commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
  echo ""
  echo "───────────────────────────────────────────────────────────"
  echo "  Results"
  echo "───────────────────────────────────────────────────────────"
  echo ""
  echo "Type Check:  $([ $TYPECHECK_STATUS -eq 0 ] && echo '✅ PASSED' || echo '❌ FAILED')"
  echo "Unit Tests:  $([ $UNIT_STATUS -eq 0 ] && echo '✅ PASSED' || echo '❌ FAILED')"
  echo "Build:       $([ $BUILD_STATUS -eq 0 ] && echo '✅ PASSED' || echo '❌ FAILED')"
  echo ""
  echo "───────────────────────────────────────────────────────────"
  echo "  Test Details"
  echo "───────────────────────────────────────────────────────────"
  echo ""
  tail -30 "$RUN_DIR/unit-tests.log" 2>/dev/null || echo "No test output available"
  echo ""
  echo "───────────────────────────────────────────────────────────"
  echo "  Files"
  echo "───────────────────────────────────────────────────────────"
  echo ""
  ls -la "$RUN_DIR"
  echo ""
  echo "═══════════════════════════════════════════════════════════"
} > "$RUN_DIR/summary.txt"

cat "$RUN_DIR/summary.txt"

# Update latest symlink
rm -rf "$LATEST_DIR"
ln -s "$RUN_DIR" "$LATEST_DIR"

echo ""
echo -e "${BLUE}📊 Results saved to: $RUN_DIR${NC}"
echo -e "${BLUE}🔗 Latest results: $LATEST_DIR${NC}"
echo ""

# Final status
OVERALL_STATUS=0
if [ $TYPECHECK_STATUS -ne 0 ] || [ $UNIT_STATUS -ne 0 ] || [ $BUILD_STATUS -ne 0 ]; then
  OVERALL_STATUS=1
fi

if [ $OVERALL_STATUS -eq 0 ]; then
  echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║  ✅ ALL CHECKS PASSED - TDD/CDD Cycle Complete!          ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
else
  echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${RED}║  ❌ SOME CHECKS FAILED - Review logs in $RUN_DIR        ║${NC}"
  echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
fi

exit $OVERALL_STATUS
