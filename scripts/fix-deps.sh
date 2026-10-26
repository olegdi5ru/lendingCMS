#!/bin/bash

# Landing Engine v4.0 - Dependency Fix Script
# Решает проблемы с npm install

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Landing Engine v4.0 - Dependency Fix Script             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Шаг 1: Очистка кэша
echo -e "${YELLOW}🧹 Шаг 1: Очистка npm кэша...${NC}"
npm cache clean --force
echo -e "${GREEN}✓ Кэш очищен${NC}"
echo ""

# Шаг 2: Удаление node_modules и package-lock.json
echo -e "${YELLOW}🗑️  Шаг 2: Удаление старых зависимостей...${NC}"
rm -rf node_modules
rm -f package-lock.json
echo -e "${GREEN}✓ Старые зависимости удалены${NC}"
echo ""

# Шаг 3: Проверка registry
echo -e "${YELLOW}🌐 Шаг 3: Проверка registry...${NC}"
echo "Текущий registry: $(npm config get registry)"
echo ""

# Шаг 4: Попытка установки с основным registry
echo -e "${YELLOW}📦 Шаг 4: Попытка установки с основным registry...${NC}"
if npm install --prefer-offline 2>/dev/null; then
  echo -e "${GREEN}✓ Установка успешна!${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠️  Основной registry недоступен, пробуем альтернативный...${NC}"
fi
echo ""

# Шаг 5: Попытка с альтернативным registry
echo -e "${YELLOW}🔄 Шаг 5: Установка с альтернативным registry (npmmirror)...${NC}"
if npm install --registry=https://registry.npmmirror.com; then
  echo -e "${GREEN}✓ Установка успешна с альтернативным registry!${NC}"
  echo ""
  echo -e "${YELLOW}💡 Рекомендация: Установите альтернативный registry как основной:${NC}"
  echo "   npm config set registry https://registry.npmmirror.com"
  exit 0
else
  echo -e "${RED}✗ Не удалось установить зависимости${NC}"
  echo ""
  echo -e "${YELLOW}💡 Попробуйте следующие решения:${NC}"
  echo ""
  echo "1. Проверьте интернет-соединение:"
  echo "   ping registry.npmjs.org"
  echo ""
  echo "2. Используйте yarn вместо npm:"
  echo "   npm install -g yarn"
  echo "   yarn install"
  echo ""
  echo "3. Используйте pnpm:"
  echo "   npm install -g pnpm"
  echo "   pnpm install"
  echo ""
  echo "4. Проверьте прокси-настройки:"
  echo "   npm config get proxy"
  echo "   npm config get https-proxy"
  echo ""
  echo "5. Очистите DNS кэш:"
  echo "   sudo systemd-resolve --flush-caches  # Linux"
  echo "   sudo dscacheutil -flushcache         # macOS"
  echo ""
  exit 1
fi
