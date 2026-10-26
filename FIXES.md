# ✅ Исправления и решения

## Проблемы, которые были решены

### 1. ❌ Missing script: "test"

**Проблема:**
```bash
npm run test
# npm error Missing script: "test"
```

**Решение:**
Добавлены скрипты в `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:run": "bash scripts/test-runner.sh",
    "test:full": "bash scripts/full-test-suite.sh",
    "test:cleanup": "bash scripts/log-cleanup.sh",
    "setup:hooks": "bash scripts/setup-hooks.sh",
    "setup:repo": "bash scripts/init-repo.sh"
  }
}
```

**Теперь работает:**
```bash
npm run test              # ✅ Все тесты
npm run test:watch        # ✅ Watch mode
npm run test:coverage     # ✅ С покрытием
npm run test:run          # ✅ С логированием
npm run test:full         # ✅ Полная проверка
```

---

### 2. ❌ Отказано в доступе (bash скрипты)

**Проблема:**
```bash
./scripts/test-runner.sh
# bash: ./scripts/test-runner.sh: Отказано в доступе
```

**Решение:**
Добавлены npm-скрипты для запуска bash-скриптов:

```json
{
  "scripts": {
    "test:run": "bash scripts/test-runner.sh",
    "test:full": "bash scripts/full-test-suite.sh",
    "test:cleanup": "bash scripts/log-cleanup.sh"
  }
}
```

**Теперь работает:**
```bash
npm run test:run          # ✅ Вместо ./scripts/test-runner.sh
npm run test:full         # ✅ Вместо ./scripts/full-test-suite.sh
npm run test:cleanup      # ✅ Вместо ./scripts/log-cleanup.sh
```

**Альтернатива (если нужны прямые вызовы):**
```bash
chmod +x scripts/*.sh
./scripts/test-runner.sh
```

---

### 3. ❌ Unknown global config "python"

**Проблема:**
```bash
npm warn Unknown global config "python"
```

**Решение:**
Это предупреждение не критично и не влияет на работу. Оно связано с глобальной конфигурацией npm.

**Если хотите убрать:**
```bash
npm config delete python
```

---

## Полная инструкция по использованию

### 1. Установка

```bash
# Установка зависимостей
npm install
```

### 2. Запуск тестов

```bash
# Все тесты
npm run test

# Watch mode (рекомендуется для разработки)
npm run test:watch

# С покрытием кода
npm run test:coverage

# С логированием и сохранением результатов
npm run test:run

# Полная проверка (typecheck + tests + build)
npm run test:full
```

### 3. Запуск dev server

```bash
npm run dev
# Откроет: http://localhost:5173
```

### 4. Настройка Git (опционально)

```bash
# Инициализация git репозитория
npm run setup:repo

# Настройка git hooks
npm run setup:hooks
```

### 5. Очистка логов

```bash
# Оставить последние 5 запусков
npm run test:cleanup 5
```

---

## Структура проекта

```
landing-engine-v4/
├── src/
│   ├── components/       # React компоненты
│   │   ├── Layout.tsx
│   │   └── Layout.test.tsx
│   ├── pages/           # Страницы приложения
│   ├── store/           # State management
│   │   ├── useAppStore.ts
│   │   └── useAppStore.test.ts
│   ├── context/         # React Context
│   ├── utils/           # Утилиты и парсеры
│   │   ├── parser.ts
│   │   └── parser.test.ts
│   ├── types/           # TypeScript типы
│   └── test/            # Интеграционные тесты
│       ├── setup.ts
│       └── integration.test.ts
├── scripts/             # Bash скрипты
│   ├── test-runner.sh
│   ├── full-test-suite.sh
│   ├── log-cleanup.sh
│   ├── setup-hooks.sh
│   └── init-repo.sh
├── docs/                # Документация
│   ├── TDD-CDD.md
│   ├── ARCHITECTURE.md
│   └── DEVELOPMENT.md
├── logs/                # Логи тестов
│   ├── test-results/
│   └── latest -> test-results/...
├── package.json         # Скрипты и зависимости
├── vitest.config.ts     # Конфигурация Vitest
├── README.md            # Основная документация
├── QUICKSTART.md        # Быстрый старт
└── COMMANDS.md          # Полный список команд
```

---

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev server |
| `npm run build` | Production build |
| `npm run test` | Запуск всех тестов |
| `npm run test:watch` | Watch mode |
| `npm run test:coverage` | С покрытием |
| `npm run test:run` | С логированием |
| `npm run test:full` | Полная проверка |
| `npm run test:cleanup` | Очистка логов |
| `npm run typecheck` | Проверка типов |
| `npm run setup:hooks` | Настройка git hooks |
| `npm run setup:repo` | Инициализация git |

---

## TDD Workflow

### 1. Написать тест (RED)

```typescript
// src/utils/parser.test.ts
it('should parse frontmatter', () => {
  const result = parseLandingMD(content);
  expect(result.frontmatter.title).toBe('Test');
});
```

### 2. Запустить тест

```bash
npm run test:watch
```

**Результат:** ❌ Тест падает

### 3. Написать реализацию (GREEN)

```typescript
// src/utils/parser.ts
export function parseLandingMD(content: string) {
  return { frontmatter: { title: 'Test' }, ... };
}
```

**Результат:** ✅ Тест проходит

### 4. Рефакторинг (REFACTOR)

Улучшить код, сохранить зелёные тесты.

### 5. Коммит

```bash
git add .
git commit -m "feat(parser): add frontmatter parsing"
```

---

## Решение проблем

### Тесты не запускаются

```bash
# Проверить установку зависимостей
npm install

# Очистить кэш
rm -rf node_modules/.vite
npm run test
```

### Git hooks не работают

```bash
# Переустановить hooks
npm run setup:hooks

# Проверить права
ls -la .git/hooks/
```

### Покрытие низкое

```bash
# Посмотреть отчёт
npm run test:coverage

# Открыть HTML отчёт
open coverage/index.html
```

---

## Документация

- [README.md](./README.md) - Основная документация
- [QUICKSTART.md](./QUICKSTART.md) - Быстрый старт
- [COMMANDS.md](./COMMANDS.md) - Полный список команд
- [docs/TDD-CDD.md](./docs/TDD-CDD.md) - Методология TDD/CDD
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Архитектура системы
- [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) - Руководство разработчика

---

## ✅ Всё готово к работе!

Теперь вы можете:

1. ✅ Запускать тесты: `npm run test`
2. ✅ Использовать watch mode: `npm run test:watch`
3. ✅ Генерировать coverage: `npm run test:coverage`
4. ✅ Запускать bash скрипты через npm: `npm run test:run`
5. ✅ Настраивать git hooks: `npm run setup:hooks`
6. ✅ Управлять логами: `npm run test:cleanup`

**Следуйте методологии TDD/CDD для создания надёжного кода!** 🚀
