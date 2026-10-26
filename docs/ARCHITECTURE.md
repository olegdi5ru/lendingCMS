# Архитектура Landing Engine v4.0

## Обзор

Landing Engine v4.0 — мультитенантная система генерации лендингов с поддержкой A/B-тестирования и семантического поиска.

## Диаграмма компонентов

```
┌─────────────────────────────────────────────────────────────┐
│                    Admin Panel (React)                       │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Dashboard │  │  Pages   │  │Substitut.│  │  Blocks  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐                                │
│  │ Tenants  │  │ Semantic │                                │
│  └──────────┘  └──────────┘                                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   State Management                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  AppContext (React Context)                          │  │
│  │  - tenants                                           │  │
│  │  - pages                                             │  │
│  │  - substitutions                                     │  │
│  │  - blocks                                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Core Modules                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Parser     │  │  Substitution│  │   Semantic   │     │
│  │  (Landing-MD)│  │   Engine     │  │   Search     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Модули

### 1. Parser (Landing-MD v3.0)

**Ответственность:** Парсинг Markdown-контента в HTML

**Вход:**
- Raw Landing-MD контент
- Таблица подстановок (опционально)

**Выход:**
```typescript
interface ParsedPage {
  frontmatter: Record<string, string>;
  html: string;
  deferredHtml: string;
  blocks: ParsedBlock[];
}
```

**Компоненты:**
- Frontmatter parser (YAML)
- Variable substitution engine
- Block parser (контейнеры `:::`)
- Inline markdown parser
- Fold handler (отложенная загрузка)

### 2. Substitution Engine

**Ответственность:** Динамическая подстановка переменных

**Вход:**
- Контент с переменными `{{key|fallback}}`
- Таблица подстановок

**Выход:**
- Контент с подставленными значениями

**Алгоритм:**
```
1. Найти все {{key|fallback}} в контенте
2. Для каждой переменной:
   - Если key есть в таблице → использовать значение
   - Иначе → использовать fallback
3. Вернуть результат
```

### 3. Semantic Search

**Ответственность:** Семантический поиск по ключевым фразам

**Вход:**
- Поисковый запрос (например, из utm_content)
- Массив ключевых фраз с эмбеддингами

**Выход:**
- Отсортированный список результатов с similarity score

**Алгоритм:**
```
1. Сгенерировать эмбеддинг для запроса
2. Вычислить cosine similarity для каждого ключа
3. Отсортировать по убыванию similarity
4. Вернуть топ-N результатов
```

### 4. Multi-Tenant System

**Ответственность:** Изоляция данных между тенантами

**Структура:**
```typescript
interface Tenant {
  id: string;
  domain: string;
  basePath: string;
  config: TenantConfig;
}
```

**Принципы:**
- Все данные привязаны к `tenant_id`
- Фильтрация на уровне store
- Изоляция настроек и контента

### 5. A/B Testing

**Ответственность:** Управление вариантами страниц

**Структура:**
```typescript
interface ABVariant {
  id: string;
  name: string;
  substitutionTable: string;
  weight: number;
  impressions: number;
  conversions: number;
}
```

**Алгоритм:**
```
1. Получить все варианты страницы
2. Вычислить cumulative weights
3. Сгенерировать случайное число [0, 100]
4. Выбрать вариант по weight
5. Использовать соответствующую таблицу подстановок
```

## Поток данных

### Рендеринг страницы

```
1. Пользователь открывает страницу
   ↓
2. Загружается контент из store
   ↓
3. Определяется активная таблица подстановок
   (по utm_content или A/B тесту)
   ↓
4. Parser применяет подстановки
   ↓
5. Парсинг Markdown → HTML
   ↓
6. Разделение на immediate и deferred content
   ↓
7. Рендеринг immediate content
   ↓
8. Гидрация deferred content (по fold trigger)
```

### Создание страницы

```
1. Пользователь создаёт страницу в админке
   ↓
2. Редактор Landing-MD
   ↓
3. Live preview (parser в реальном времени)
   ↓
4. Сохранение в store
   ↓
5. Обновление tenantPages
   ↓
6. Страница доступна для рендеринга
```

## Структура данных

### Page

```typescript
interface Page {
  id: string;
  tenantId: string;
  slug: string;
  title: string;
  content: string;              // Landing-MD v3.0
  metadata: PageMetadata;
  status: 'draft' | 'published' | 'archived';
  version: number;
  createdAt: string;
  updatedAt: string;
}
```

### SubstitutionTable

```typescript
interface SubstitutionTable {
  id: string;
  tenantId: string;
  name: string;
  data: Record<string, string>;  // key → value
  createdAt: string;
  updatedAt: string;
}
```

### UIBlock

```typescript
interface UIBlock {
  id: string;
  name: string;
  description: string;
  propsSchema: Record<string, string>;
  template: string;
  styles: string;
  version: number;
}
```

## Паттерны проектирования

### 1. Context Pattern

State management через React Context:

```typescript
const AppContext = createContext<AppStore | null>(null);

function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppContext.Provider');
  return ctx;
}
```

### 2. Memoization Pattern

Оптимизация вычислений через useMemo:

```typescript
const tenantPages = useMemo(() => {
  return pages.filter(p => p.tenantId === activeTenantId);
}, [pages, activeTenantId]);
```

### 3. Strategy Pattern

Различные стратегии рендеринга блоков:

```typescript
function renderBlock(block: ParsedBlock): string {
  switch (block.name) {
    case 'hero': return renderHero(block);
    case 'pains': return renderPains(block);
    case 'stats': return renderStats(block);
    default: return renderDefault(block);
  }
}
```

### 4. Observer Pattern

Реактивное обновление UI при изменении state:

```typescript
const [content, setContent] = useState('');
const parsed = useMemo(() => parseLandingMD(content), [content]);
```

## Производительность

### Оптимизации

1. **Memoization** — useMemo для вычисляемых значений
2. **Lazy evaluation** — отложенная загрузка fold content
3. **Virtual scrolling** — для больших списков (будет добавлено)
4. **Code splitting** — динамические импорты (будет добавлено)

### Метрики

- Initial load: < 2s
- Time to interactive: < 3s
- Parser performance: < 10ms для типичной страницы
- Re-render time: < 16ms (60 FPS)

## Безопасность

### XSS Prevention

- Все пользовательские данные экранируются
- HTML рендерится через `dangerouslySetInnerHTML` только для доверенного контента
- Валидация входных данных

### Data Isolation

- Строгая изоляция данных между тенантами
- Фильтрация на уровне store
- Проверка tenant_id при каждом запросе

## Тестирование

### Уровни тестов

```
┌─────────────────────────────────────┐
│         E2E Tests (Playwright)      │  ← Пользовательские сценарии
├─────────────────────────────────────┤
│      Component Tests (RTL)          │  ← React компоненты
├─────────────────────────────────────┤
│    Integration Tests (Vitest)       │  ← Взаимодействие модулей
├─────────────────────────────────────┤
│       Unit Tests (Vitest)           │  ← Функции и утилиты
└─────────────────────────────────────┘
```

### Покрытие

- Unit: ≥90%
- Integration: ≥80%
- Component: ≥70%
- Общее: ≥85%

## Масштабирование

### Горизонтальное масштабирование

1. **Stateless architecture** — нет локального state
2. **Database per tenant** — изоляция на уровне БД
3. **CDN** — статические ресурсы
4. **Caching** — Redis для горячих данных

### Вертикальное масштабирование

1. **Optimized queries** — индексация, денормализация
2. **Connection pooling** — эффективное использование соединений
3. **Load balancing** — распределение нагрузки

## Мониторинг

### Метрики

- Request rate
- Response time (p50, p95, p99)
- Error rate
- Conversion rate
- A/B test performance

### Логирование

- Структурированные логи (JSON)
- Centralized logging (будет добавлено)
- Error tracking (будет добавлено)

## Roadmap

### Phase 1: Foundation ✅
- React + TypeScript + Vite
- Tailwind CSS
- Routing
- State management
- Testing infrastructure

### Phase 2: Core Features ✅
- Landing-MD parser
- Substitution engine
- Block rendering
- Multi-tenant system
- A/B testing

### Phase 3: Admin Panel ✅
- Dashboard
- Pages CRUD
- Substitutions management
- Blocks viewer
- Tenant switcher

### Phase 4: Advanced Features
- Real semantic search (pgvector)
- Real-time collaboration
- Version history
- Rollback system
- Export/Import

### Phase 5: Production Ready
- E2E tests
- Performance optimization
- Monitoring
- Documentation
- CI/CD pipeline

---

**Landing Engine v4.0** — Архитектура готова к масштабированию
