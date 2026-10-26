# 📋 Команды Landing Engine v4.0

## Основные команды

### Разработка

```bash
# Запуск dev server
npm run dev
# Откроет: http://localhost:5173

# Production build
npm run build
# Создаст: dist/

# Проверка типов TypeScript
npm run typecheck
```

### Тестирование

```bash
# Все тесты (однократный запуск)
npm run test

# Watch mode (автоматический перезапуск при изменениях)
npm run test:watch

# С покрытием кода
npm run test:coverage
# Создаст: coverage/

# UI для интерактивного просмотра тестов
npm run test:ui
```

### Продвинутое тестирование

```bash
# Запуск с логированием и сохранением результатов
npm run test:run
# Сохранит в: logs/test-results/<timestamp>/

# Полная проверка (typecheck + tests + build)
npm run test:full
# Проверит всё и сохранит логи

# Очистка старых логов (оставить последние N запусков)
npm run test:cleanup 5
# По умолчанию: 5 последних запусков
```

### Git и TDD

```bash
# Настройка git hooks (pre-commit, commit-msg)
npm run setup:hooks

# Инициализация git репозитория
npm run setup:repo
# Включает: git init + setup:hooks + initial commit
```

## Структура логов

После запуска `npm run test:run` или `npm run test:full`:

```
logs/
├── test-results/
│   ├── 20260320-143022/
│   │   ├── typecheck.log      # Результаты проверки типов
│   │   ├── unit-tests.json    # JSON результаты тестов
│   │   ├── unit-tests.log     # Подробный лог тестов
│   │   ├── coverage.log       # Отчёт покрытия
│   │   ├── build.log          # Лог сборки
│   │   └── summary.txt        # Сводка
│   ├── 20260320-150045/
│   └── ...
└── latest -> test-results/20260320-150045/
```

## Git Hooks

После `npm run setup:hooks`:

### Pre-commit Hook
- Автоматически запускает тесты перед коммитом
- Если тесты падают → коммит отклоняется
- Если тесты проходят → коммит разрешён

### Commit-msg Hook
- Валидирует формат Conventional Commits
- Формат: `<type>(<scope>): <description>`
- Примеры:
  - ✅ `feat: add user authentication`
  - ✅ `fix(parser): handle empty content`
  - ✅ `test: add unit tests for store`
  - ❌ `added stuff`
  - ❌ `fix bug`

## Conventional Commits

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

### Примеры коммитов

```bash
# Новая фича
git commit -m "feat: add A/B testing support"

# Исправление бага с указанием модуля
git commit -m "fix(store): prevent race condition in tenant switching"

# Добавление тестов
git commit -m "test(parser): add integration tests for fold blocks"

# Breaking change
git commit -m "feat!: change parser API

BREAKING CHANGE: parseLandingMD now returns ParsedPage instead of string"
```

## TDD Workflow

### Шаг 1: Написать тест (RED)

```typescript
// src/utils/parser.test.ts
it('should parse frontmatter', () => {
  const result = parseLandingMD(content);
  expect(result.frontmatter.title).toBe('Test');
});
```

### Шаг 2: Запустить тест

```bash
npm run test:watch
```

**Результат:** ❌ Тест падает

### Шаг 3: Написать реализацию (GREEN)

```typescript
// src/utils/parser.ts
export function parseLandingMD(content: string) {
  return { frontmatter: { title: 'Test' }, ... };
}
```

**Результат:** ✅ Тест проходит

### Шаг 4: Рефакторинг (REFACTOR)

Улучшить код, сохранить зелёные тесты.

### Шаг 5: Коммит

```bash
git add .
git commit -m "feat(parser): add frontmatter parsing"
```

## Метрики качества

### Покрытие кода

```bash
npm run test:coverage
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

### Логи занимают много места

```bash
# Очистить старые логи
npm run test:cleanup 5

# Оставить только последние 3 запуска
npm run test:cleanup 3
```

## Алиасы (опционально)

Добавьте в `~/.bashrc` или `~/.zshrc`:

```bash
alias t='npm run test'
alias tw='npm run test:watch'
alias tc='npm run test:coverage'
alias tf='npm run test:full'
alias td='npm run dev'
```

Использование:

```bash
t    # Запустить тесты
tw   # Watch mode
tc   # С покрытием
tf   # Полная проверка
td   # Dev server
```

## CI/CD Интеграция

### GitHub Actions

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
      - run: npm run typecheck
      - run: npm run test:coverage
      - run: npm run build
```

## Дополнительная информация

- [README.md](./README.md) - Основная документация
- [QUICKSTART.md](./QUICKSTART.md) - Быстрый старт
- [docs/TDD-CDD.md](./docs/TDD-CDD.md) - Методология TDD/CDD
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Архитектура системы
- [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) - Руководство разработчика

---

**Все команды готовы к использованию! 🚀**
