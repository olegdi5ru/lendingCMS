import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, FileText, Edit3, Eye, Archive, MoreVertical } from 'lucide-react';

export function PagesList() {
  const { tenantPages, activeTenant } = useApp();
  const [filter, setFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  const filtered = filter === 'all' ? tenantPages : tenantPages.filter(p => p.status === filter);

  const statusColors = {
    published: 'bg-emerald-100 text-emerald-700',
    draft: 'bg-amber-100 text-amber-700',
    archived: 'bg-slate-100 text-slate-600',
  };

  const statusLabels = {
    published: 'Опубликована',
    draft: 'Черновик',
    archived: 'Архив',
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Страницы</h1>
          <p className="text-slate-500 mt-1">Landing-MD v3.0 контент для {activeTenant.name}</p>
        </div>
        <Link
          to={`/pages/new`}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Новая страница
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'published', 'draft', 'archived'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {f === 'all' ? 'Все' : statusLabels[f]}
            <span className="ml-1.5 text-xs opacity-70">
              ({f === 'all' ? tenantPages.length : tenantPages.filter(p => p.status === f).length})
            </span>
          </button>
        ))}
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(page => (
          <Link
            key={page.id}
            to={`/pages/${page.id}`}
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="bg-blue-50 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[page.status]}`}>
                {statusLabels[page.status]}
              </span>
            </div>

            <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
              {page.title}
            </h3>
            <p className="text-sm text-slate-500 mb-3 truncate">
              /{activeTenant.basePath}/{page.slug}
            </p>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
              <span>v{page.version}</span>
              <span>{new Date(page.updatedAt).toLocaleDateString('ru-RU')}</span>
            </div>

            {page.metadata.abVariants && page.metadata.abVariants.length > 0 && (
              <div className="mt-3 flex gap-1.5">
                {page.metadata.abVariants.map(v => (
                  <span key={v.id} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded">
                    A/B: {v.name}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Нет страниц в этой категории</p>
        </div>
      )}
    </div>
  );
}
