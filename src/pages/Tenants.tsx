import { useApp } from '../context/AppContext';
import { Building2, Globe, Check, X, Clock, Settings } from 'lucide-react';

export function Tenants() {
  const { tenants, activeTenantId, setActiveTenantId, pages, substitutions } = useApp();

  const statusConfig = {
    active: { icon: Check, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Активен' },
    inactive: { icon: Clock, color: 'text-slate-400', bg: 'bg-slate-50', label: 'Неактивен' },
    suspended: { icon: X, color: 'text-red-500', bg: 'bg-red-50', label: 'Приостановлен' },
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Тенанты</h1>
        <p className="text-slate-500 mt-1">
          Мультитенантная архитектура — идентификация по Host header
        </p>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tenants.map(tenant => {
          const tenantPages = pages.filter(p => p.tenantId === tenant.id);
          const tenantSubs = substitutions.filter(s => s.tenantId === tenant.id);
          const status = statusConfig[tenant.status];
          const isActive = tenant.id === activeTenantId;

          return (
            <div
              key={tenant.id}
              className={`bg-white rounded-xl border-2 p-6 transition-all cursor-pointer hover:shadow-lg ${
                isActive ? 'border-emerald-500 shadow-md' : 'border-slate-200 hover:border-slate-300'
              }`}
              onClick={() => setActiveTenantId(tenant.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-slate-100 p-3 rounded-xl">
                  <Building2 className="w-6 h-6 text-slate-700" />
                </div>
                <div className={`flex items-center gap-1.5 ${status.color} text-xs font-medium ${status.bg} px-2 py-1 rounded-full`}>
                  <status.icon className="w-3 h-3" />
                  {status.label}
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-lg mb-1">{tenant.name}</h3>
              <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
                <Globe className="w-3.5 h-3.5" />
                <span>{tenant.domain}</span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Base Path</span>
                  <code className="text-xs bg-slate-100 px-2 py-0.5 rounded">{tenant.basePath}</code>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Страниц</span>
                  <span className="font-medium text-slate-700">{tenantPages.length}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Подмен</span>
                  <span className="font-medium text-slate-700">{tenantSubs.length}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Тема</span>
                  <span className="font-medium text-slate-700 capitalize">{tenant.config.theme}</span>
                </div>
              </div>

              {isActive && (
                <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm font-medium">
                  <Check className="w-4 h-4" />
                  Активный тенант
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Architecture Info */}
      <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-500" />
          Мультитенантная архитектура
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: 'Host Resolution', desc: 'Идентификация тенанта по Host header HTTP-запроса' },
            { title: 'Data Isolation', desc: 'Все таблицы содержат tenant_id, строгая изоляция данных' },
            { title: 'Config Storage', desc: 'Настройки (basePath, стили, токены) хранятся в БД' },
            { title: 'Dynamic Entry', desc: 'Точка входа определяется динамически из настроек' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 rounded-lg p-4">
              <p className="font-medium text-sm text-slate-900 mb-1">{item.title}</p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
