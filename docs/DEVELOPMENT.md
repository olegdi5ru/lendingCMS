# Landing Engine v4.0 - Руководство по разработке

## 🚀 Быстрый старт

### 1. Инициализация проекта

```bash
# Установка зависимостей
npm install

# Инициализация git репозитория
./scripts/init-repo.sh

# Настройка git hooks (автоматически в init-repo.sh)
./scripts/setup-hooks.sh
```

### 2. Запуск разработки

```bash
# Dev server
npm run dev

# Тесты в watch mode
npm run test:watch
```

### 3. Запуск тестов

```bash
# Все тесты
npm run test

# Полная проверка (typecheck + tests + build)
./scripts/full-test-suite.sh

# Только unit тесты
npm run test -- --run

# С покрытием
npm run test -- --coverage
```

## 📋 TDD/CDD Workflow

### Шаг 1: Написать тест (RED)

```typescript
// src/utils/parser.test.ts
import { describe, it, expect } from 'vitest';
import { parseLandingMD } from './parser';

describe('parseLandingMD', () => {
  it('should parse frontmatter', () => {
    const content = `---
title: "Test"
---
Content`;
    
    const result = parseLandingMD(content);
    expect(result.frontmatter.title).toBe('Test');
  });
});
```

**Запустить тест:**
```bash
npm run test -- parser.test.ts
```

**Результат:** ❌ Тест падает (RED)

### Шаг 2: Написать реализацию (GREEN)

```typescript
// src/utils/parser.ts
export function parseLandingMD(content: string) {
  // Минимальная реализация для прохождения теста
  const frontmatter = {};
  // ... парсинг
  return { frontmatter, html: '', deferredHtml: '', blocks: [] };
}
```

**Запустить тест:**
```bash
npm run test -- parser.test.ts
```

**Результат:** ✅ Тест проходит (GREEN)

### Шаг 3: Рефакторинг (REFACTOR)

```typescript
// Улучшить код, сохранить зелёные тесты
export function parseLandingMD(content: string): ParsedPage {
  const { frontmatter, body } = parseFrontmatter(content);
  const { blocks, html, deferredHtml } = parseBlocks(body);
  
  return { frontmatter, html, deferredHtml, blocks };
}
```

**Запустить тесты:**
```bash
npm run test
```

**Результат:** ✅ Все тесты проходят

### Шаг 4: Коммит

```bash
git add .
git commit -m "feat(parser): add frontmatter parsing"
```

**Git hooks автоматически:**
- ✅ Запустят тесты
- ✅ Проверят формат коммита

## 🧪 Структура тестов

```
src/
├── utils/
│   ├── parser.ts              # Реализация
│   └── parser.test.ts         # Unit тесты
├── store/
│   ├── useAppStore.ts         # Реализация
│   └── useAppStore.test.ts    # Unit тесты
├── components/
│   ├── Layout.tsx             # Реализация
│   └── Layout.test.tsx        # Component тесты
└── test/
    ├── setup.ts               # Настройка тестов
    ├── integration.test.ts    # Integration тесты
    └── vitest.d.ts           # Типы
```

## 📊 Управление логами

### Автоматическое логирование

Все результаты тестов сохраняются в `logs/test-results/`:

```bash
./scripts/full-test-suite.sh
```

**Структура:**
```
logs/
├── test-results/
│   ├── 20260320-143022/
│   │   ├── typecheck.log
│   │   ├── unit-tests.json
│   │   ├── unit-tests.log
│   │   ├── coverage.log
│   │   ├── build.log
│   │   └── summary.txt
│   └── ...
└── latest -> test-results/20260320-143022/
```

### Очистка старых логов

```bash
# Оставить последние 5 запусков
./scripts/log-cleanup.sh 5

# Оставить последние 10 запусков
./scripts/log-cleanup.sh 10
```

## 🔧 Git Hooks

### Pre-commit Hook

Автоматически запускает тесты перед коммитом:

```bash
# При коммите:
git commit -m "feat: add feature"

# Автоматически:
# 1. Запускаются тесты
# 2. Если тесты падают → коммит отклоняется
# 3. Если тесты проходят → коммит разрешён
```

### Commit-msg Hook

Валидирует формат Conventional Commits:

```bash
# ✅ Правильно:
git commit -m "feat: add user authentication"
git commit -m "fix(parser): handle empty content"
git commit -m "test: add unit tests for store"

# ❌ Неправильно:
git commit -m "added stuff"
git commit -m "fix bug"
git commit -m "update"
```

## 📝 Conventional Commits

### Формат

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Типы

| Тип | Описание | Пример |
|-----|----------|--------|
| `feat` | Новая фича | `feat: add semantic search` |
| `fix` | Исправление бага | `fix(parser): handle empty input` |
| `test` | Добавление тестов | `test: add parser tests` |
| `refactor` | Рефакторинг | `refactor(utils): extract logic` |
| `docs` | Документация | `docs: update README` |
| `style` | Форматирование | `style: fix indentation` |
| `perf` | Оптимизация | `perf: optimize parser` |
| `ci` | CI/CD | `ci: add GitHub Actions` |
| `chore` | Обслуживание | `chore: update dependencies` |

### Примеры

```bash
# Новая фича
git commit -m "feat: add A/B testing support"

# Исправление бага с указанием модуля
git commit -m "fix(store): prevent race condition in tenant switching"

# Добавление тестов
git commit -m "test(parser): add integration tests for fold blocks"

# Рефакторинг
git commit -m "refactor(utils): extract substitution logic to separate function"

# Breaking change
git commit -m "feat!: change parser API

BREAKING CHANGE: parseLandingMD now returns ParsedPage instead of string"
```

## 🎯 Best Practices

### 1. Пишите тесты первыми

```typescript
// ❌ Плохо
function add(a: number, b: number): number {
  return a + b;
}

test('add', () => {
  expect(add(1, 2)).toBe(3);
});

// ✅ Хорошо
test('add should sum two numbers', () => {
  expect(add(1, 2)).toBe(3);
});

function add(a: number, b: number): number {
  return a + b;
}
```

### 2. Один тест = одна проверка

```typescript
// ❌ Плохо
test('parser', () => {
  const result = parse(content);
  expect(result.title).toBe('Test');
  expect(result.blocks).toHaveLength(3);
  expect(result.html).toContain('div');
});

// ✅ Хорошо
test('parser should parse title from frontmatter', () => {
  const result = parse(content);
  expect(result.title).toBe('Test');
});

test('parser should parse all blocks', () => {
  const result = parse(content);
  expect(result.blocks).toHaveLength(3);
});
```

### 3. Описательные имена тестов

```typescript
// ❌ Плохо
test('test1', () => { ... });
test('works', () => { ... });

// ✅ Хорошо
test('should parse frontmatter with quoted values', () => { ... });
test('should use fallback when variable not in substitution table', () => { ... });
test('should handle nested blocks correctly', () => { ... });
```

### 4. Тестируйте edge cases

```typescript
describe('parseLandingMD', () => {
  // Happy path
  it('should parse valid content', () => { ... });
  
  // Edge cases
  it('should handle empty content', () => { ... });
  it('should handle missing frontmatter', () => { ... });
  it('should handle malformed blocks', () => { ... });
  
  // Error cases
  it('should throw error for invalid YAML', () => { ... });
});
```

### 5. Не тестируйте детали реализации

```typescript
// ❌ Плохо
expect(result._internalState).toBe(...);
expect(result._cache.size).toBe(5);

// ✅ Хорошо
expect(result.html).toContain('Expected output');
expect(result.blocks).toHaveLength(3);
```

## 📈 Метрики качества

### Покрытие кода

```bash
npm run test -- --coverage
```

**Цели:**
- Unit тесты: ≥90%
- Integration тесты: ≥80%
- Component тесты: ≥70%
- Общее покрытие: ≥85%

### Время выполнения

- Unit тесты: < 5 секунд
- Integration тесты: < 10 секунд
- Все тесты: < 30 секунд
- Build: < 30 секунд

### Количество тестов

**Правило:** Минимум 3 теста на функцию:
1. Happy path (успешный сценарий)
2. Edge case (граничный случай)
3. Error case (ошибка)

## 🔄 CI/CD Pipeline

### GitHub Actions (пример)

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      
      - name: Type check
        run: npm run typecheck
      
      - name: Run tests
        run: npm run test -- --coverage
      
      - name: Build
        run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 📚 Документация

### README.md

Основная документация проекта.

### docs/TDD-CDD.md

Подробное описание методологии TDD/CDD.

### docs/ARCHITECTURE.md

Архитектура системы и паттерны проектирования.

## 🐛 Troubleshooting

### Тесты не запускаются

```bash
# Очистить кэш
rm -rf node_modules/.vite
npm run test
```

### Git hooks не работают

```bash
# Переустановить hooks
./scripts/setup-hooks.sh

# Проверить права
chmod +x .git/hooks/*
```

### Покрытие низкое

```bash
# Посмотреть отчёт
npm run test -- --coverage

# Открыть HTML отчёт
open coverage/index.html
```

## 📞 Поддержка

### Вопросы

1. Прочитайте `docs/TDD-CDD.md`
2. Проверьте `docs/ARCHITECTURE.md`
3. Посмотрите примеры в тестах

### Проблемы

1. Проверьте логи в `logs/latest/`
2. Запустите `./scripts/full-test-suite.sh`
3. Проверьте git hooks: `ls -la .git/hooks/`

---

**Следуйте методологии TDD/CDD для создания надёжного кода!**
