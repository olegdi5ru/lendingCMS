#!/bin/bash

# Landing Engine v4.0 - Log Manager
# Keeps only the latest test results and logs

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOGS_DIR="$PROJECT_ROOT/logs"
TEST_RESULTS_DIR="$LOGS_DIR/test-results"
MAX_RUNS=${1:-5}  # Default: keep last 5 runs

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Landing Engine v4.0 - Log Manager                       ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ ! -d "$TEST_RESULTS_DIR" ]; then
  echo -e "${YELLOW}No test results directory found.${NC}"
  exit 0
fi

# Count current runs
TOTAL_RUNS=$(ls -d "$TEST_RESULTS_DIR"/*/ 2>/dev/null | wc -l)
echo -e "${BLUE}📊 Current test runs: $TOTAL_RUNS${NC}"
echo -e "${BLUE}🎯 Keeping last $MAX_RUNS runs${NC}"
echo ""

if [ "$TOTAL_RUNS" -le "$MAX_RUNS" ]; then
  echo -e "${GREEN}✅ No cleanup needed. All runs within limit.${NC}"
  exit 0
fi

# Remove old runs (keep latest MAX_RUNS)
echo -e "${YELLOW}🧹 Removing old test results...${NC}"
cd "$TEST_RESULTS_DIR"
RUNS_TO_DELETE=$(ls -dt */ | tail -n +$((MAX_RUNS + 1)))
DELETED_COUNT=0

for run in $RUNS_TO_DELETE; do
  echo -e "  ${RED}✗${NC} Removing: $run"
  rm -rf "$run"
  DELETED_COUNT=$((DELETED_COUNT + 1))
done

cd "$PROJECT_ROOT"

echo ""
echo -e "${GREEN}✅ Cleanup complete!${NC}"
echo -e "${BLUE}🗑️  Deleted $DELETED_COUNT old test run(s)${NC}"
echo -e "${BLUE}📁 Remaining runs: $(ls -d "$TEST_RESULTS_DIR"/*/ 2>/dev/null | wc -l)${NC}"
