import { useState, useCallback } from 'react';
import type { Tenant, Page, SubstitutionTable, UIBlock, ABVariant } from '../types';

// Demo Tenants
const DEMO_TENANTS: Tenant[] = [
  {
    id: 'family_zdravclinic',
    domain: 'zdravclinic.ru',
    basePath: '/render',
    name: 'ЗдравКлиника',
    config: { theme: 'light', primaryColor: '#2563eb' },
    createdAt: '2026-01-15T10:00:00Z',
    status: 'active',
  },
  {
    id: 'edu_online_school',
    domain: 'onlineschool.pro',
    basePath: '/landing',
    name: 'Онлайн Школа',
    config: { theme: 'dark', primaryColor: '#7c3aed' },
    createdAt: '2026-02-20T14:30:00Z',
    status: 'active',
  },
  {
    id: 'fit_gym_chain',
    domain: 'ironfit.ru',
    basePath: '/promo',
    name: 'IronFit',
    config: { theme: 'light', primaryColor: '#dc2626' },
    createdAt: '2026-03-05T09:15:00Z',
    status: 'active',
  },
];

// Demo Substitution Tables
const DEMO_SUBSTITUTIONS: SubstitutionTable[] = [
  {
    id: 'sub-001',
    tenantId: 'family_zdravclinic',
    name: 'default',
    data: { h1: 'Онлайн-диагностика СДВГ', cta: 'Записаться на приём', intro: 'Точная диагностика за 30 минут', price: 'от 2 500 ₽' },
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z',
  },
  {
    id: 'sub-002',
    tenantId: 'family_zdravclinic',
    name: 'sdvg_adults',
    data: { h1: 'Диагностика СДВГ у взрослых', cta: 'Пройти тест онлайн', intro: 'Узнайте за 15 минут', price: 'Бесплатный скрининг' },
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-03-10T12:00:00Z',
  },
  {
    id: 'sub-003',
    tenantId: 'family_zdravclinic',
    name: 'sdvg_children',
    data: { h1: 'Диагностика СДВГ у детей', cta: 'Записать ребёнка', intro: 'Безопасная диагностика от 5 лет', price: 'от 3 000 ₽' },
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-03-10T12:00:00Z',
  },
  {
    id: 'sub-004',
    tenantId: 'edu_online_school',
    name: 'default',
    data: { h1: 'Курсы программирования', cta: 'Начать обучение', intro: 'Стань разработчиком за 6 месяцев', price: 'от 5 000 ₽/мес' },
    createdAt: '2026-02-20T14:30:00Z',
    updatedAt: '2026-03-05T12:00:00Z',
  },
  {
    id: 'sub-005',
    tenantId: 'edu_online_school',
    name: 'python_course',
    data: { h1: 'Курс Python с нуля', cta: 'Записаться на Python', intro: 'Освой самый востребованный язык', price: 'от 4 500 ₽/мес' },
    createdAt: '2026-02-25T14:30:00Z',
    updatedAt: '2026-03-08T12:00:00Z',
  },
];

// Demo Pages
const DEMO_PAGES: Page[] = [
  {
    id: 'page-001',
    tenantId: 'family_zdravclinic',
    slug: 'sdvg-diagnostika',
    title: 'Диагностика СДВГ',
    content: `---
title: "Диагностика СДВГ — ЗдравКлиника"
description: "Точная онлайн-диагностика СДВГ за 30 минут"
slug: "sdvg-diagnostika"
tenant_id: "family_zdravclinic"
substitution_table: "default"
---

::: hero {variant="gradient"}
# {{h1|Онлайн-диагностика СДВГ}}

{{intro|Точная диагностика за 30 минут}}

[{{cta|Записаться на приём}}]{.btn-primary #main-cta data-track="hero-cta"}
:::

::: pains {title="Знакомые ситуации?", columns="3"}
- Часто забываете о встречах и дедлайнах?
- Не можете сосредоточиться на одной задаче?
- Импульсивные решения мешают в жизни?
:::

::: stats {columns="3"}
| 15 000+ | 98% | 30 мин |
| Пациентов | Точность | Время диагностики |
:::

::: fold {trigger="scroll"}
::: form {endpoint="/api/lead", title="Запишитесь на диагностику"}
Оставьте заявку и получите бесплатную консультацию
:::
:::`,
    metadata: {
      description: 'Точная онлайн-диагностика СДВГ',
      substitutionTable: 'default',
      abVariants: [
        { id: 'v1', name: 'Вариант A — Взрослые', substitutionTable: 'sdvg_adults', weight: 50, impressions: 12450, conversions: 892 },
        { id: 'v2', name: 'Вариант B — Дети', substitutionTable: 'sdvg_children', weight: 50, impressions: 11890, conversions: 1034 },
      ],
    },
    status: 'published',
    version: 3,
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-03-15T14:30:00Z',
  },
  {
    id: 'page-002',
    tenantId: 'edu_online_school',
    slug: 'python-course',
    title: 'Курс Python',
    content: `---
title: "Курс Python — Онлайн Школа"
description: "Научись Python с нуля до Junior за 6 месяцев"
slug: "python-course"
tenant_id: "edu_online_school"
substitution_table: "default"
---

::: hero {variant="dark"}
# {{h1|Курсы программирования}}

{{intro|Стань разработчиком за 6 месяцев}}

[{{cta|Начать обучение}}]{.btn-primary #main-cta}
:::

::: pains {title="Почему выбирают нас?", columns="2"}
- Практика с первого дня
- Менторская поддержка 24/7
:::

::: fold {trigger="scroll"}
::: stats {columns="4"}
| 5000+ | 94% | 6 мес | 150к |
| Выпускников | Трудоустройство | До результата | Средняя ЗП |
:::
:::`,
    metadata: {
      description: 'Курс Python с нуля',
      substitutionTable: 'default',
      abVariants: [
        { id: 'v1', name: 'Вариант A — Python', substitutionTable: 'python_course', weight: 70, impressions: 8900, conversions: 567 },
        { id: 'v2', name: 'Вариант B — General', substitutionTable: 'default', weight: 30, impressions: 3200, conversions: 189 },
      ],
    },
    status: 'published',
    version: 2,
    createdAt: '2026-02-25T14:30:00Z',
    updatedAt: '2026-03-12T10:00:00Z',
  },
  {
    id: 'page-003',
    tenantId: 'fit_gym_chain',
    slug: 'new-year-promo',
    title: 'Акция Новый Год',
    content: `---
title: "Годовой абонемент — IronFit"
description: "Специальное предложение к Новому Году"
slug: "new-year-promo"
tenant_id: "fit_gym_chain"
substitution_table: "default"
---

::: hero {variant="image"}
# Начни год с тренировок!

Скидка 40% на годовой абонемент

[Получить скидку]{.btn-primary}
:::`,
    metadata: { description: 'Акция IronFit', substitutionTable: 'default' },
    status: 'draft',
    version: 1,
    createdAt: '2026-03-10T09:00:00Z',
    updatedAt: '2026-03-10T09:00:00Z',
  },
];

// Demo UI Blocks
const DEMO_BLOCKS: UIBlock[] = [
  {
    id: 'block-hero',
    name: 'hero',
    description: 'Первый экран лендинга с заголовком, текстом и CTA',
    propsSchema: { variant: 'gradient | dark | image', image: 'string (url)' },
    template: '<section class="block-hero"><div class="hero-content">{content}</div></section>',
    styles: '.block-hero { min-height: 90vh; display: flex; align-items: center; }',
    version: 2,
  },
  {
    id: 'block-pains',
    name: 'pains',
    description: 'Блок с болями целевой аудитории',
    propsSchema: { title: 'string', columns: '2 | 3 | 4' },
    template: '<section class="block-pains"><h2>{title}</h2><div class="grid">{content}</div></section>',
    styles: '.block-pains .grid { display: grid; gap: 1.5rem; }',
    version: 1,
  },
  {
    id: 'block-stats',
    name: 'stats',
    description: 'Блок со статистикой и цифрами',
    propsSchema: { columns: '2 | 3 | 4', variant: 'default | highlighted' },
    template: '<section class="block-stats"><div class="stats-grid">{content}</div></section>',
    styles: '.block-stats { background: #f8fafc; padding: 4rem 0; }',
    version: 1,
  },
  {
    id: 'block-form',
    name: 'form',
    description: 'Форма захвата лидов',
    propsSchema: { endpoint: 'string (url)', title: 'string' },
    template: '<section class="block-form"><h2>{title}</h2><form action="{endpoint}">{content}</form></section>',
    styles: '.block-form { background: #1e293b; color: white; padding: 4rem 2rem; }',
    version: 1,
  },
  {
    id: 'block-fold',
    name: 'fold',
    description: 'Системный блок — точка отложенной загрузки контента',
    propsSchema: { trigger: 'scroll | click | time' },
    template: '<div class="block-fold" data-trigger="{trigger}">{content}</div>',
    styles: '.block-fold { opacity: 0; transition: opacity 0.5s; }',
    version: 1,
  },
];

export function useAppStore() {
  const [tenants, setTenants] = useState<Tenant[]>(DEMO_TENANTS);
  const [pages, setPages] = useState<Page[]>(DEMO_PAGES);
  const [substitutions, setSubstitutions] = useState<SubstitutionTable[]>(DEMO_SUBSTITUTIONS);
  const [blocks] = useState<UIBlock[]>(DEMO_BLOCKS);
  const [activeTenantId, setActiveTenantId] = useState<string>(DEMO_TENANTS[0].id);

  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];

  const tenantPages = pages.filter(p => p.tenantId === activeTenantId);
  const tenantSubstitutions = substitutions.filter(s => s.tenantId === activeTenantId);

  const updatePage = useCallback((id: string, updates: Partial<Page>) => {
    setPages(prev => prev.map(p => p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  }, []);

  const addPage = useCallback((page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPage: Page = {
      ...page,
      id: `page-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPages(prev => [...prev, newPage]);
  }, []);

  const updateSubstitution = useCallback((id: string, updates: Partial<SubstitutionTable>) => {
    setSubstitutions(prev => prev.map(s => s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s));
  }, []);

  const addSubstitution = useCallback((sub: Omit<SubstitutionTable, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSub: SubstitutionTable = {
      ...sub,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSubstitutions(prev => [...prev, newSub]);
  }, []);

  return {
    tenants,
    pages,
    substitutions,
    blocks,
    activeTenantId,
    activeTenant,
    tenantPages,
    tenantSubstitutions,
    setActiveTenantId,
    updatePage,
    addPage,
    updateSubstitution,
    addSubstitution,
  };
}
