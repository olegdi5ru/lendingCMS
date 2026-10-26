import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, FileText, Replace, Blocks, Building2,
  Search, ChevronDown, Zap
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Дашборд' },
  { to: '/pages', icon: FileText, label: 'Страницы' },
  { to: '/substitutions', icon: Replace, label: 'Подмены' },
  { to: '/blocks', icon: Blocks, label: 'UI-блоки' },
  { to: '/tenants', icon: Building2, label: 'Тенанты' },
  { to: '/semantic', icon: Search, label: 'Семантика' },
];

export function Layout() {
  const { tenants, activeTenantId, setActiveTenantId, activeTenant } = useApp();
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-emerald-400" />
            <span className="font-bold text-lg">Landing Engine</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">v4.0</span>
          </div>
        </div>

        {/* Tenant Switcher */}
        <div className="p-3 border-b border-slate-700">
          <div className="relative">
            <select
              value={activeTenantId}
              onChange={(e) => setActiveTenantId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm appearance-none cursor-pointer hover:border-slate-500 transition-colors"
            >
              {tenants.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <p className="text-xs text-slate-400 mt-1.5 truncate">{activeTenant.domain}</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-4.5 h-4.5" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span>PostgreSQL 16 + pgvector</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
