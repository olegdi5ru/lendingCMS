import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ArrowRight, Database, Sparkles } from 'lucide-react';

interface SearchResult {
  keyword: string;
  substitutionTableId: string;
  similarity: number;
}

// Simulated keyword embeddings
const MOCK_KEYWORDS = [
  { keyword: 'СДВГ у взрослых', substitutionTableId: 'sdvg_adults', embedding: generateVec('sdvg adult diagnosis') },
  { keyword: 'СДВГ у детей', substitutionTableId: 'sdvg_children', embedding: generateVec('sdvg children kids') },
  { keyword: 'диагностика СДВГ', substitutionTableId: 'default', embedding: generateVec('sdvg diagnosis general') },
  { keyword: 'дефицит внимания', substitutionTableId: 'sdvg_adults', embedding: generateVec('attention deficit') },
  { keyword: 'гиперактивность у ребёнка', substitutionTableId: 'sdvg_children', embedding: generateVec('hyperactivity child') },
  { keyword: 'курс Python', substitutionTableId: 'python_course', embedding: generateVec('python programming course') },
  { keyword: 'обучение программированию', substitutionTableId: 'default', embedding: generateVec('programming education') },
  { keyword: 'фитнес абонемент', substitutionTableId: 'default', embedding: generateVec('fitness subscription gym') },
  { keyword: 'тренажёрный зал', substitutionTableId: 'default', embedding: generateVec('gym workout training') },
  { keyword: 'онлайн тест СДВГ', substitutionTableId: 'sdvg_adults', embedding: generateVec('online test sdvg') },
];

function generateVec(text: string): number[] {
  const vec = new Array(32).fill(0);
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    vec[i % 32] += charCode / 255;
    vec[(i + 7) % 32] += Math.sin(charCode) * 0.5;
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0));
  return vec.map(v => v / (norm || 1));
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}

export function SemanticSearch() {
  const { tenantSubstitutions, activeTenant } = useApp();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];

    const queryVec = generateVec(query.toLowerCase());
    return MOCK_KEYWORDS
      .map(k => ({
        keyword: k.keyword,
        substitutionTableId: k.substitutionTableId,
        similarity: cosineSimilarity(queryVec, k.embedding),
      }))
      .filter(r => r.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity);
  }, [query]);

  const handleSearch = () => {
    setSearched(true);
  };

  const getTableName = (id: string) => {
    const sub = tenantSubstitutions.find(s => s.id === id) || { name: id };
    return sub.name;
  };

  const getSimilarityColor = (sim: number) => {
    if (sim > 0.8) return 'text-emerald-600 bg-emerald-50';
    if (sim > 0.6) return 'text-blue-600 bg-blue-50';
    if (sim > 0.4) return 'text-amber-600 bg-amber-50';
    return 'text-slate-600 bg-slate-50';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-purple-500" />
          Семантический поиск
        </h1>
        <p className="text-slate-500 mt-1">
          Векторный поиск по pgvector — матчинг рекламных ключевых фраз к таблицам подмен
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Введите ключевую фразу из рекламной кампании..."
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Найти
          </button>
        </div>

        {/* Quick queries */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs text-slate-400">Примеры:</span>
          {['СДВГ у взрослых', 'курс Python', 'фитнес абонемент', 'дефицит внимания'].map(q => (
            <button
              key={q}
              onClick={() => { setQuery(q); setSearched(true); }}
              className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full hover:bg-slate-200 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {searched && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">
              Результаты поиска ({results.length})
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Database className="w-3.5 h-3.5" />
              <span>pgvector · cosine similarity · dim=1536</span>
            </div>
          </div>

          {results.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {results.map((result, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{result.keyword}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="text-sm text-slate-500">
                        Таблица подмен: <code className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-xs">{getTableName(result.substitutionTableId)}</code>
                      </span>
                    </div>
                  </div>

                  {/* Similarity Bar */}
                  <div className="w-48">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Similarity</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${getSimilarityColor(result.similarity)}`}>
                        {(result.similarity * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          result.similarity > 0.8 ? 'bg-emerald-500' :
                          result.similarity > 0.6 ? 'bg-blue-500' :
                          result.similarity > 0.4 ? 'bg-amber-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${result.similarity * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Нет результатов для "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">Попробуйте другую ключевую фразу</p>
            </div>
          )}
        </div>
      )}

      {/* Architecture */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-5">
          <h4 className="font-semibold text-purple-900 mb-2">1. Генерация эмбеддингов</h4>
          <p className="text-sm text-purple-700">
            Ключевые фразы из рекламных кампаний конвертируются в векторы (dim=1536) и сохраняются в keyword_embeddings
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100 p-5">
          <h4 className="font-semibold text-blue-900 mb-2">2. Векторный поиск</h4>
          <p className="text-sm text-blue-700">
            При запросе с utm_content вычисляется cosine similarity и находится ближайшая таблица подмен
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-5">
          <h4 className="font-semibold text-emerald-900 mb-2">3. Подстановка контента</h4>
          <p className="text-sm text-emerald-700">
            Найденная таблица подмен используется для замены {'{{'}переменных{"}}"} в Landing-MD перед рендерингом
          </p>
        </div>
      </div>
    </div>
  );
}
