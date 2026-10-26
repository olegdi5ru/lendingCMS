# Landing Engine v4.0

Высоконагруженная мультитенантная система генерации лендингов с поддержкой A/B-тестирования и семантического поиска.

## 🏗️ Архитектура

### Технологический стек

| Компонент | Технология | Назначение |
|-----------|------------|------------|
| **Framework** | React 18 + TypeScript | UI админ-панели |
| **Build Tool** | Vite | Быстрая сборка и HMR |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Routing** | React Router v6 | Клиентский роутинг |
| **Testing** | Vitest + Testing Library | Unit/Integration/E2E тесты |
| **Charts** | Recharts | Визуализация аналитики |
| **Icons** | Lucide React | Иконки интерфейса |

### Модули системы

```
src/
├── components/       # UI компоненты
├── pages/           # Страницы приложения
├── store/           # State management
├── context/         # React Context
├── utils/           # Утилиты и парсеры
├── types/           # TypeScript типы
└── test/            # Интеграционные тесты
```

## 🧪 TDD/CDD Методология

### Принцип разработки

Система разрабатывается строго по методологии **Test-Driven Development** и **Context-Driven Development**:

1. **RED** — Написать падающий тест, описывающий ожидаемое поведение
2. **GREEN** — Написать минимальную реализацию для прохождения теста
3. **REFACTOR** — Улучшить код с сохранением зеленых тестов
4. **COMMIT** — Атомарный коммит с Conventional Commits

### Уровни тестирования

| Уровень | Инструмент | Что тестируем | Покрытие |
|---------|------------|---------------|----------|
| **Unit** | Vitest | Парсер, утилиты, чистые функции | ≥90% |
| **Integration** | Vitest | Роуты, модули, API | ≥80% |
| **Component** | Testing Library | React компоненты | ≥70% |
| **E2E** | Playwright | Пользовательские сценарии | Критические пути |

### Запуск тестов

```bash
# Все тесты
npm run test

# Unit тесты с coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Запуск с логированием
./scripts/test-runner.sh
```

### Структура тестов

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
    └── integration.test.ts    # Integration тесты
```

## 📊 Управление логами

### Автоматическое логирование

Все результаты тестов сохраняются в `logs/test-results/` с временной меткой:

```
logs/
├── test-results/
│   ├── 20260320-143022/
│   │   ├── unit-tests.json
│   │   ├── unit-tests.log
│   │   ├── coverage.log
│   │   └── summary.txt
│   ├── 20260320-150045/
│   └── ...
└── latest -> test-results/20260320-150045/
```

### Очистка старых логов

```bash
# Очистка (оставить последние 5 запусков)
./scripts/log-cleanup.sh 5

# Очистка (оставить последние 10 запусков)
./scripts/log-cleanup.sh 10
```

## 🔧 Git Hooks

### Автоматическая валидация

При установке хуков (`./scripts/setup-hooks.sh`) обеспечивается:

1. **pre-commit** — Запуск тестов перед каждым коммитом
2. **commit-msg** — Валидация формата Conventional Commits

### Conventional Commits

Формат коммитов:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Типы:**
- `feat` — Новая функциональность
- `fix` — Исправление бага
- `test` — Добавление тестов
- `refactor` — Рефакторинг кода
- `docs` — Документация
- `style` — Форматирование
- `perf` — Оптимизация производительности
- `ci` — CI/CD изменения
- `chore` — Обслуживание

**Примеры:**
```bash
feat: add semantic search module
test(parser): add unit tests for fold blocks
fix(store): fix tenant switching race condition
refactor(utils): extract substitution logic
```

## 🚀 Быстрый старт

### Установка

```bash
# Установка зависимостей
npm install

# Настройка git hooks
./scripts/setup-hooks.sh
```

### Разработка

```bash
# Запуск dev server
npm run dev

# Запуск тестов в watch mode
npm run test:watch
```

### Production

```bash
# Сборка
npm run build

# Проверка типов
npm run typecheck

# Запуск тестов с coverage
npm run test:coverage
```

## 📋 Roadmap

### Phase 1: Foundation ✅
- [x] React + TypeScript + Vite
- [x] Tailwind CSS
- [x] Routing (React Router)
- [x] State management (Context)
- [x] Vitest + Testing Library
- [x] Git hooks (pre-commit, commit-msg)

### Phase 2: Core Features ✅
- [x] Landing-MD v3.0 parser
- [x] Variable substitution engine
- [x] Block rendering system
- [x] Multi-tenant architecture
- [x] A/B testing support

### Phase 3: Admin Panel ✅
- [x] Dashboard with analytics
- [x] Pages CRUD
- [x] Substitution tables management
- [x] UI blocks viewer
- [x] Tenant switcher

### Phase 4: Advanced Features
- [ ] Semantic search (pgvector simulation)
- [ ] Real-time preview
- [ ] Export/Import pages
- [ ] Version history
- [ ] Rollback system

### Phase 5: Production Ready
- [ ] E2E tests (Playwright)
- [ ] Performance optimization
- [ ] Error tracking
- [ ] Monitoring
- [ ] Documentation

## 📖 Документация

### Landing-MD v3.0

Формат разметки для лендингов:

```markdown
---
title: "Page Title"
description: "SEO description"
slug: "page-slug"
tenant_id: "tenant_id"
substitution_table: "default"
---

::: hero {variant="gradient"}
# {{h1|Default Title}}

{{intro|Default intro}}

[{{cta|Click me}}]{.btn-primary}
:::

::: pains {title="Problems", columns="3"}
- Problem 1
- Problem 2
:::

::: fold {trigger="scroll"}
::: form {endpoint="/api/lead", title="Contact"}
Form content
:::
:::
```

### Переменные подстановки

```
{{variable_name|fallback_value}}
```

- `variable_name` — ключ в таблице подмен
- `fallback_value` — значение по умолчанию

### Блоки

- `hero` — Первый экран (атрибуты: `variant`)
- `pains` — Боли ЦА (атрибуты: `title`, `columns`)
- `stats` — Статистика (атрибуты: `columns`)
- `form` — Форма захвата (атрибуты: `endpoint`, `title`)
- `fold` — Отложенная загрузка (атрибуты: `trigger`)

## 🤝 Contributing

1. Создайте feature ветку: `git checkout -b feature/TASK-123-feature-name`
2. Напишите тесты (TDD)
3. Реализуйте функциональность
4. Убедитесь, что все тесты проходят: `npm run test`
5. Закоммитьте с conventional message: `git commit -m "feat: add feature"`
6. Создайте Pull Request

## 📄 License

MIT

---

**Landing Engine v4.0** — Разработано с соблюдением TDD/CDD методологии
