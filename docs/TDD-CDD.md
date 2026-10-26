# TDD/CDD Методология разработки

## Принципы

### Test-Driven Development (TDD)

Разработка через тестирование — методология, при которой тесты пишутся **до** реализации кода.

**Цикл TDD:**

```
┌─────────────────────────────────────────────────────────┐
│  1. RED      │ Написать падающий тест                    │
│              │ Тест описывает ожидаемое поведение        │
│              │ Тест не проходит (красный)                │
├─────────────────────────────────────────────────────────┤
│  2. GREEN    │ Написать минимальный код                  │
│              │ Код проходит тест (зелёный)               │
│              │ Не больше, чем нужно                      │
├─────────────────────────────────────────────────────────┤
│  3. REFACTOR │ Улучшить код                              │
│              │ Сохранить зелёные тесты                   │
│              │ Убрать дублирование                       │
├─────────────────────────────────────────────────────────┤
│  4. COMMIT   │ Атомарный коммит                          │
│              │ Conventional Commits формат               │
│              │ Один коммит = одна фича/фикс              │
└─────────────────────────────────────────────────────────┘
```

### Context-Driven Development (CDD)

Разработка через контекст — методология, при которой код проектируется с учётом контекста использования.

**Принципы CDD:**

1. **Контекст использования** — код пишется для конкретных сценариев
2. **Изоляция** — модули не зависят от деталей реализации друг друга
3. **Тестируемость** — код легко тестировать в изоляции
4. **Документированность** — тесты служат документацией

## Структура тестов

### Unit Tests

Тестируют отдельные функции и модули в изоляции.

**Расположение:** Рядом с тестируемым файлом
```
src/utils/parser.ts
src/utils/parser.test.ts
```

**Пример:**
```typescript
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

**Покрытие:** ≥90%

### Integration Tests

Тестируют взаимодействие модулей.

**Расположение:** `src/test/integration.test.ts`

**Пример:**
```typescript
describe('Integration: Rendering Pipeline', () => {
  it('should render complete landing with substitutions', () => {
    const content = `...`;
    const table = { h1: 'Custom Title' };
    const result = parseLandingMD(content, table);
    
    expect(result.html).toContain('Custom Title');
  });
});
```

**Покрытие:** ≥80%

### Component Tests

Тестируют React компоненты.

**Расположение:** Рядом с компонентом
```
src/components/Layout.tsx
src/components/Layout.test.tsx
```

**Пример:**
```typescript
import { render, screen } from '@testing-library/react';
import { Layout } from './Layout';

describe('Layout', () => {
  it('should render navigation', () => {
    render(<Layout />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
```

**Покрытие:** ≥70%

### E2E Tests

Тестируют полные пользовательские сценарии.

**Инструмент:** Playwright (будет добавлен)

**Пример:**
```typescript
test('user can create new page', async ({ page }) => {
  await page.goto('/pages');
  await page.click('text=New Page');
  await page.fill('input[name=title]', 'Test Page');
  await page.click('button:has-text("Save")');
  await expect(page.locator('h1')).toHaveText('Test Page');
});
```

## Запуск тестов

```bash
# Все тесты
npm run test

# Unit тесты
npm run test -- --run

# Watch mode
npm run test -- --watch

# Coverage
npm run test -- --coverage

# Конкретный файл
npm run test -- parser.test.ts

# С логированием
./scripts/test-runner.sh
```

## Git Hooks

### Pre-commit Hook

Автоматически запускает тесты перед каждым коммитом:

```bash
#!/bin/bash
npm run test -- --run

if [ $? -ne 0 ]; then
  echo "❌ Tests failed! Fix tests before committing."
  exit 1
fi
```

### Commit-msg Hook

Валидирует формат Conventional Commits:

```bash
#!/bin/bash
commit_msg=$(cat "$1")
pattern="^(feat|fix|test|refactor|docs|style|perf|ci|chore|build)(\(.+\))?: .+"

if ! echo "$commit_msg" | grep -qE "$pattern"; then
  echo "❌ Invalid commit message format!"
  exit 1
fi
```

## Conventional Commits

### Формат

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Типы

| Тип | Описание | Пример |
|-----|----------|--------|
| `feat` | Новая функциональность | `feat: add semantic search` |
| `fix` | Исправление бага | `fix(parser): handle empty content` |
| `test` | Добавление тестов | `test: add unit tests for store` |
| `refactor` | Рефакторинг | `refactor(utils): extract logic` |
| `docs` | Документация | `docs: update README` |
| `style` | Форматирование | `style: fix indentation` |
| `perf` | Оптимизация | `perf: optimize parser` |
| `ci` | CI/CD | `ci: add GitHub Actions` |
| `chore` | Обслуживание | `chore: update dependencies` |

### Scope (опционально)

Указывает модуль или компонент:

```bash
feat(parser): add fold block support
fix(store): prevent race condition
test(components): add Layout tests
```

### Breaking Changes

Для breaking changes используется `!` или `BREAKING CHANGE` в footer:

```bash
feat!: change parser API

BREAKING CHANGE: parseLandingMD now returns ParsedPage instead of string
```

## Логирование

### Структура логов

```
logs/
├── test-results/
│   ├── 20260320-143022/
│   │   ├── unit-tests.json      # JSON результаты
│   │   ├── unit-tests.log       # Подробный лог
│   │   ├── coverage.log         # Отчёт покрытия
│   │   └── summary.txt          # Сводка
│   ├── 20260320-150045/
│   └── ...
└── latest -> test-results/20260320-150045/
```

### Автоматическая очистка

```bash
# Очистка (оставить 5 последних)
./scripts/log-cleanup.sh 5

# Автоматическая очистка в CI
./scripts/test-runner.sh
```

## Best Practices

### 1. Пишите тесты первыми

```typescript
// ❌ Плохо: Код, потом тесты
function add(a, b) { return a + b; }

test('add', () => {
  expect(add(1, 2)).toBe(3);
});

// ✅ Хорошо: Тесты, потом код
test('add', () => {
  expect(add(1, 2)).toBe(3);
});

function add(a, b) { return a + b; }
```

### 2. Один тест = одна проверка

```typescript
// ❌ Плохо: Много проверок в одном тесте
test('parser', () => {
  const result = parse(content);
  expect(result.title).toBe('Test');
  expect(result.blocks).toHaveLength(3);
  expect(result.html).toContain('div');
});

// ✅ Хорошо: Один тест = одна проверка
test('parser should parse title', () => {
  const result = parse(content);
  expect(result.title).toBe('Test');
});

test('parser should parse blocks', () => {
  const result = parse(content);
  expect(result.blocks).toHaveLength(3);
});
```

### 3. Используйте описательные имена

```typescript
// ❌ Плохо
test('test1', () => { ... });
test('works', () => { ... });

// ✅ Хорошо
test('should parse frontmatter with quotes', () => { ... });
test('should use fallback when variable not in table', () => { ... });
```

### 4. Тестируйте edge cases

```typescript
describe('parseLandingMD', () => {
  it('should handle empty content', () => { ... });
  it('should handle missing frontmatter', () => { ... });
  it('should handle malformed blocks', () => { ... });
  it('should handle nested blocks', () => { ... });
});
```

### 5. Не тестируйте детали реализации

```typescript
// ❌ Плохо: Тестируем внутреннюю структуру
expect(result._internalState).toBe(...);

// ✅ Хорошо: Тестируем поведение
expect(result.html).toContain('Expected output');
```

## Метрики качества

### Покрытие кода

```bash
npm run test -- --coverage
```

**Цели:**
- Unit тесты: ≥90%
- Integration тесты: ≥80%
- Component тесты: ≥70%
- Общее покрытие: ≥85%

### Время выполнения тестов

- Unit тесты: < 5 секунд
- Integration тесты: < 10 секунд
- Все тесты: < 30 секунд

### Количество тестов

**Правило:** Минимум 3 теста на функцию:
1. Happy path (успешный сценарий)
2. Edge case (граничный случай)
3. Error case (ошибка)

## Инструменты

### Vitest

Быстрый тестовый фреймворк для Vite.

```bash
npm run test
```

### Testing Library

Тестирование React компонентов.

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
```

### Coverage (v8)

Отчёты покрытия кода.

```bash
npm run test -- --coverage
```

## CI/CD Интеграция

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
      - run: npm ci
      - run: npm run test -- --coverage
      - uses: codecov/codecov-action@v3
```

## Ресурсы

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [TDD by Example](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)

---

**Следуйте методологии TDD/CDD для создания надёжного и поддерживаемого кода!**
