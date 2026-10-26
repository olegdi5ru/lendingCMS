import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { parseLandingMD } from '../utils/parser';
import { ArrowLeft, Save, Eye, Code, Smartphone, Monitor, Tablet, RotateCcw } from 'lucide-react';

export function PageEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tenantPages, tenantSubstitutions, updatePage, addPage, activeTenant } = useApp();

  const existingPage = id && id !== 'new' ? tenantPages.find(p => p.id === id) : null;

  const [content, setContent] = useState(existingPage?.content || DEFAULT_CONTENT);
  const [selectedTable, setSelectedTable] = useState(existingPage?.metadata.substitutionTable || 'default');
  const [viewMode, setViewMode] = useState<'split' | 'editor' | 'preview'>('split');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saved, setSaved] = useState(false);

  const substitutionTable = useMemo(() => {
    const table = tenantSubstitutions.find(s => s.name === selectedTable);
    return table?.data || {};
  }, [tenantSubstitutions, selectedTable]);

  const parsed = useMemo(() => parseLandingMD(content, substitutionTable), [content, substitutionTable]);

  const handleSave = () => {
    if (existingPage) {
      updatePage(existingPage.id, {
        content,
        metadata: { ...existingPage.metadata, substitutionTable: selectedTable },
      });
    } else {
      addPage({
        tenantId: activeTenant.id,
        slug: parsed.frontmatter.slug || 'new-page',
        title: parsed.frontmatter.title || 'Новая страница',
        content,
        metadata: { description: parsed.frontmatter.description || '', substitutionTable: selectedTable },
        status: 'draft',
        version: 1,
      });
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const deviceWidth = device === 'desktop' ? '100%' : device === 'tablet' ? '768px' : '375px';

  return (
    <div className="h-screen flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/pages')} className="text-slate-400 hover:text-slate-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-semibold text-slate-900">
              {existingPage ? existingPage.title : 'Новая страница'}
            </h2>
            <p className="text-xs text-slate-400">
              {existingPage ? `v${existingPage.version} · ${existingPage.slug}` : 'Landing-MD v3.0'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode */}
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'editor' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
            >
              <Code className="w-3.5 h-3.5 inline mr-1" />Код
            </button>
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'split' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === 'preview' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" />Превью
            </button>
          </div>

          {/* Device */}
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            {[
              { key: 'desktop' as const, icon: Monitor },
              { key: 'tablet' as const, icon: Tablet },
              { key: 'mobile' as const, icon: Smartphone },
            ].map(({ key, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setDevice(key)}
                className={`p-1.5 rounded-md transition-colors ${device === key ? 'bg-white shadow text-slate-900' : 'text-slate-400'}`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Substitution Table */}
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white"
          >
            {tenantSubstitutions.map(s => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>

          {/* Save */}
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              saved ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <Save className="w-4 h-4" />
            {saved ? 'Сохранено!' : 'Сохранить'}
          </button>
        </div>
      </div>

      {/* Editor + Preview */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        {(viewMode === 'editor' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} border-r border-slate-200 flex flex-col`}>
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Landing-MD v3.0</span>
              <span className="text-xs text-slate-400">{content.length} символов</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 p-5 font-mono text-sm leading-relaxed resize-none focus:outline-none bg-slate-900 text-emerald-300"
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} flex flex-col bg-slate-100`}>
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Превью рендеринга</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-slate-400">SSR Ready</span>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div
                className="bg-white rounded-lg shadow-sm mx-auto transition-all duration-300 overflow-hidden"
                style={{ maxWidth: deviceWidth }}
              >
                <div
                  className="landing-preview p-0"
                  dangerouslySetInnerHTML={{ __html: parsed.html }}
                />
                {parsed.deferredHtml && (
                  <div className="border-t-2 border-dashed border-amber-300 p-4 bg-amber-50">
                    <p className="text-xs text-amber-600 font-medium mb-2">⚡ Deferred Content (fold)</p>
                    <div dangerouslySetInnerHTML={{ __html: parsed.deferredHtml }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const DEFAULT_CONTENT = `---
title: "Новая лендинг-страница"
description: "Описание для SEO"
slug: "new-landing"
tenant_id: "tenant_id"
substitution_table: "default"
---

::: hero {variant="gradient"}
# {{h1|Заголовок лендинга}}

{{intro|Описание вашего предложения}}

[{{cta|Начать}}]{.btn-primary #main-cta data-track="hero-click"}
:::

::: pains {title="Почему это важно?", columns="3"}
- Первая боль клиента
- Вторая боль клиента
- Третья боль клиента
:::

::: stats {columns="3"}
| 1000+ | 99% | 24/7 |
| Клиентов | Успех | Поддержка |
:::

::: fold {trigger="scroll"}
::: form {endpoint="/api/lead", title="Оставьте заявку"}
Заполните форму и мы свяжемся с вами
:::
:::`;
