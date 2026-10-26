import { useApp } from '../context/AppContext';
import { Blocks as BlocksIcon, Code, Palette, FileCode } from 'lucide-react';

export function Blocks() {
  const { blocks } = useApp();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">UI-блоки</h1>
        <p className="text-slate-500 mt-1">
          Компоненты для сборки лендингов — шаблоны, стили и схемы props
        </p>
      </div>

      {/* Blocks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {blocks.map(block => (
          <div key={block.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 p-2 rounded-lg">
                  <BlocksIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 font-mono">::{block.name}</h3>
                  <p className="text-xs text-slate-400">v{block.version}</p>
                </div>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                {block.name === 'fold' ? 'System' : 'Component'}
              </span>
            </div>

            <div className="p-6 space-y-4">
              {/* Description */}
              <p className="text-sm text-slate-600">{block.description}</p>

              {/* Props Schema */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5" /> Props Schema
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(block.propsSchema).map(([key, type]) => (
                    <span key={key} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-mono">
                      {key}: <span className="text-blue-500">{type}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Template */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5" /> Template
                </h4>
                <pre className="bg-slate-900 text-emerald-300 p-3 rounded-lg text-xs overflow-x-auto">
                  {block.template}
                </pre>
              </div>

              {/* Styles */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" /> Styles (Stylus → CSS)
                </h4>
                <pre className="bg-slate-900 text-amber-300 p-3 rounded-lg text-xs overflow-x-auto">
                  {block.styles}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Architecture Note */}
      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
        <h3 className="font-semibold text-indigo-900 mb-2">Архитектура UI-блоков</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-indigo-700">
          <div className="bg-white/60 rounded-lg p-3">
            <p className="font-medium mb-1">Хранение в БД</p>
            <p className="text-xs text-indigo-600">Каждый блок — запись в ui_blocks с JSONB схемой props</p>
          </div>
          <div className="bg-white/60 rounded-lg p-3">
            <p className="font-medium mb-1">Компиляция на сервере</p>
            <p className="text-xs text-indigo-600">Stylus → CSS при каждом обновлении шаблона</p>
          </div>
          <div className="bg-white/60 rounded-lg p-3">
            <p className="font-medium mb-1">Версионирование</p>
            <p className="text-xs text-indigo-600">Каждое изменение увеличивает version, старые кэшируются</p>
          </div>
        </div>
      </div>
    </div>
  );
}
