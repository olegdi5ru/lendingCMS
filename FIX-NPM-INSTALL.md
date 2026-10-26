# 🚨 Срочное решение: npm install EHOSTUNREACH

## Проблема

```bash
npm error code EHOSTUNREACH
npm error request to https://registry.npmjs.org/... failed
```

## Быстрое решение (3 команды)

```bash
# 1. Очистить кэш и удалить старые зависимости
npm cache clean --force
rm -rf node_modules package-lock.json

# 2. Установить с альтернативным registry
npm install --registry=https://registry.npmmirror.com

# 3. Проверить установку
npm run test
```

## Автоматическое решение

```bash
# Запустить скрипт исправления
bash scripts/fix-deps.sh

# Или через npm
npm run fix:deps
```

## Если не помогло

### Вариант 1: Использовать yarn

```bash
npm install -g yarn
yarn install
```

### Вариант 2: Использовать pnpm

```bash
npm install -g pnpm
pnpm install
```

### Вариант 3: Проверить сеть

```bash
# Проверить доступность registry
ping registry.npmjs.org
curl -I https://registry.npmjs.org/

# Если недоступен, используйте альтернативный registry
npm config set registry https://registry.npmmirror.com
npm install
```

### Вариант 4: Очистить прокси

```bash
npm config delete proxy
npm config delete https-proxy
npm install
```

## Обновлённые пакеты

В `package.json` обновлены deprecated пакеты:

- ✅ `uuid`: ^9.0.1 → ^11.0.0
- ✅ `recharts`: ^2.10.0 → ^3.0.0
- ✅ `@types/uuid`: ^9.0.7 → ^11.0.0

## Проверка после установки

```bash
# Запустить тесты
npm run test

# Запустить dev server
npm run dev

# Проверить сборку
npm run build
```

## Дополнительная информация

Полная документация: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

---

**Попробуйте быстрое решение — оно помогает в 90% случаев!**
