# 🔧 Решение проблем с npm install

## Проблема: EHOSTUNREACH

```bash
npm error code EHOSTUNREACH
npm error request to https://registry.npmjs.org/... failed
```

**Причина:** npm не может подключиться к registry.npmjs.org

---

## Решения

### 1. Проверить интернет-соединение

```bash
# Проверить доступность registry
ping registry.npmjs.org

# Или через curl
curl -I https://registry.npmjs.org/
```

### 2. Очистить кэш npm

```bash
# Очистить кэш
npm cache clean --force

# Попробовать снова
npm install
```

### 3. Использовать альтернативный registry

```bash
# Использовать зеркало npm (например, npmmirror)
npm install --registry=https://registry.npmmirror.com

# Или установить постоянно
npm config set registry https://registry.npmmirror.com
npm install
```

### 4. Проверить прокси-настройки

```bash
# Проверить текущие настройки
npm config get proxy
npm config get https-proxy

# Сбросить прокси (если не нужен)
npm config delete proxy
npm config delete https-proxy
```

### 5. Попробовать другой DNS

```bash
# Использовать Google DNS (8.8.8.8) или Cloudflare (1.1.1.1)
# Временно изменить DNS в настройках сети
```

### 6. Использовать yarn или pnpm

```bash
# Установить yarn
npm install -g yarn

# Использовать yarn вместо npm
yarn install

# Или pnpm
npm install -g pnpm
pnpm install
```

### 7. Проверить firewall/антивирус

```bash
# Временно отключить firewall
# Или добавить исключение для npm/node
```

---

## Предупреждения о deprecated пакетах

### uuid@9.0.1 → uuid@latest

```bash
# Обновить uuid
npm install uuid@latest
```

### recharts@2.15.4 → recharts@3.x

```bash
# Обновить recharts до v3
npm install recharts@latest
```

---

## Автоматическое исправление

Запустите скрипт:

```bash
npm run fix:deps
```

Или вручную:

```bash
# Очистить кэш
npm cache clean --force

# Обновить deprecated пакеты
npm install uuid@latest recharts@latest

# Попробовать установить с альтернативным registry
npm install --registry=https://registry.npmmirror.com
```

---

## Если ничего не помогло

### 1. Проверить версию Node.js

```bash
node --version
# Должна быть 18.x или выше
```

### 2. Переустановить Node.js

```bash
# Через nvm (рекомендуется)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20

# Или через официальный установщик
# https://nodejs.org/
```

### 3. Проверить npm

```bash
npm --version
# Обновить npm
npm install -g npm@latest
```

---

## Временное решение (offline mode)

Если у вас уже есть `node_modules`:

```bash
# Использовать offline mode
npm install --offline

# Или использовать --prefer-offline
npm install --prefer-offline
```

---

## Проверка после установки

```bash
# Проверить установку
npm run test

# Должны запуститься тесты
```

---

## Полезные команды

```bash
# Показать все настройки npm
npm config list

# Показать location кэша
npm config get cache

# Показать registry
npm config get registry

# Сбросить все настройки
npm config delete registry
npm config delete proxy
npm config delete https-proxy
```

---

## Дополнительная информация

- [npm troubleshooting](https://docs.npmjs.com/troubleshooting)
- [EHOSTUNREACH error](https://github.com/npm/npm/issues/19433)
- [Alternative registries](https://docs.npmjs.com/alternating-registries)

---

**Если проблема сохраняется, проверьте сетевое подключение и попробуйте использовать альтернативный registry.**
