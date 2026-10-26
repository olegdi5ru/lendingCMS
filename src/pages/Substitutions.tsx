import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Edit3, Save, X, Table2, Check } from 'lucide-react';

export function Substitutions() {
  const { tenantSubstitutions, updateSubstitution, addSubstitution, activeTenant } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newData, setNewData] = useState<Record<string, string>>({ h1: '', cta: '', intro: '' });

  const startEdit = (id: string, data: Record<string, string>) => {
    setEditingId(id);
    setEditData({ ...data });
  };

  const saveEdit = (id: string) => {
    updateSubstitution(id, { data: editData });
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!newName.trim()) return;
    addSubstitution({
      tenantId: activeTenant.id,
      name: newName,
      data: newData,
    });
    setShowAdd(false);
    setNewName('');
    setNewData({ h1: '', cta: '', intro: '' });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Таблицы подмен</h1>
          <p className="text-slate-500 mt-1">
            Динамический контент для <span className="font-medium text-slate-700">{activeTenant.name}</span> — управляйте вариантами подстановок
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Новая таблица
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-white rounded-xl border border-emerald-200 p-6 mb-6">
          <h3 className="font-semibold text-slate-900 mb-4">Новая таблица подмен</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Имя таблицы</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="например: spring_promo"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {Object.entries(newData).map(([key, val]) => (
              <div key={key}>
                <label className="text-xs font-medium text-slate-500 block mb-1">{`{{${key}}}`}</label>
                <input
                  value={val}
                  onChange={(e) => setNewData(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={`Значение для ${key}`}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
              Создать
            </button>
            <button onClick={() => setShowAdd(false)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200">
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Tables */}
      <div className="space-y-4">
        {tenantSubstitutions.map(sub => (
          <div key={sub.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Table2 className="w-5 h-5 text-purple-500" />
                <div>
                  <h3 className="font-semibold text-slate-900">{sub.name}</h3>
                  <p className="text-xs text-slate-400">
                    Обновлено: {new Date(sub.updatedAt).toLocaleDateString('ru-RU')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {editingId === sub.id ? (
                  <>
                    <button onClick={() => saveEdit(sub.id)} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200">
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200">
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button onClick={() => startEdit(sub.id, sub.data)} className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200">
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(editingId === sub.id ? editData : sub.data).map(([key, value]) => (
                  <div key={key} className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <code className="text-xs font-mono bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                        {`{{${key}}}`}
                      </code>
                    </div>
                    {editingId === sub.id ? (
                      <input
                        value={editData[key] || ''}
                        onChange={(e) => setEditData(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full text-sm border border-slate-200 rounded px-2 py-1.5 bg-white"
                      />
                    ) : (
                      <p className="text-sm text-slate-700">{value}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* JSON Preview */}
              <details className="mt-4">
                <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">
                  JSON представление (pg_jsonschema validated)
                </summary>
                <pre className="mt-2 bg-slate-900 text-emerald-300 p-4 rounded-lg text-xs overflow-x-auto">
                  {JSON.stringify(sub.data, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        ))}
      </div>

      {tenantSubstitutions.length === 0 && (
        <div className="text-center py-16">
          <Table2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Нет таблиц подмен для этого тенанта</p>
        </div>
      )}
    </div>
  );
}
