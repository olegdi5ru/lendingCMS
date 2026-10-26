# 🚀 Быстрый старт - Landing Engine v4.0

## Установка

```bash
# 1. Установка зависимостей
npm install

# 2. Инициализация git репозитория (опционально)
npm run setup:repo

# 3. Настройка git hooks для TDD (опционально)
npm run setup:hooks
```

## Запуск

```bash
# Dev server
npm run dev

# Открыть в браузере
# http://localhost:5173
```

## Тестирование

### Базовые команды

```bash
# Все тесты
npm run test

# Watch mode (автоматический перезапуск)
npm run test:watch

# С покрытием кода
npm run test:coverage

# UI для тестов
npm run test:ui
```

### Продвинутые команды

```bash
# Запуск с логированием и сохранением результатов
npm run test:run

# Полная проверка (typecheck + tests + build)
npm run test:full

# Очистка старых логов
npm run test:cleanup 5
```

## Структура проекта

```
landing-engine-v4/
├── src/
│   ├── components/       # React компоненты
│   ├── pages/           # Страницы приложения
│   ├── store/           # State management
│   ├── context/         # React Context
│   ├── utils/           # Утилиты и парсеры
│   ├── types/           # TypeScript типы
│   └── test/            # Интеграционные тесты
├── scripts/             # Bash скрипты
├── docs/                # Документация
├── logs/                # Логи тестов
└── tests/               # Дополнительные тесты
```

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
  // Минимальная реализация
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

## Документация

- [README.md](./README.md) - Основная документация
- [docs/TDD-CDD.md](./docs/TDD-CDD.md) - Методология TDD/CDD
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Архитектура системы
- [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) - Руководство разработчика

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

## Следующие шаги

1. ✅ Изучить структуру проекта
2. ✅ Запустить dev server: `npm run dev`
3. ✅ Запустить тесты: `npm run test`
4. ✅ Прочитать документацию: `docs/TDD-CDD.md`
5. ✅ Написать первый тест (TDD)
6. ✅ Сделать первый коммит

---

**Готовы к разработке! 🎉**
