import { useApp } from '../context/AppContext';
import { FileText, Eye, MousePointerClick, TrendingUp, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const CHART_DATA = [
  { date: '01.03', views: 1200, conversions: 89 },
  { date: '05.03', views: 1800, conversions: 134 },
  { date: '10.03', views: 2400, conversions: 198 },
  { date: '15.03', views: 2100, conversions: 176 },
  { date: '20.03', views: 3200, conversions: 287 },
  { date: '25.03', views: 2800, conversions: 245 },
  { date: '30.03', views: 3600, conversions: 312 },
];

const AB_DATA = [
  { name: 'Взрослые', impressions: 12450, conversions: 892 },
  { name: 'Дети', impressions: 11890, conversions: 1034 },
];

export function Dashboard() {
  const { tenantPages, tenantSubstitutions, activeTenant } = useApp();

  const publishedPages = tenantPages.filter(p => p.status === 'published').length;
  const totalImpressions = tenantPages.reduce((sum, p) => {
    return sum + (p.metadata.abVariants?.reduce((s, v) => s + v.impressions, 0) || 0);
  }, 0);
  const totalConversions = tenantPages.reduce((sum, p) => {
    return sum + (p.metadata.abVariants?.reduce((s, v) => s + v.conversions, 0) || 0);
  }, 0);
  const conversionRate = totalImpressions > 0 ? ((totalConversions / totalImpressions) * 100).toFixed(2) : '0';

  const stats = [
    { label: 'Страниц', value: publishedPages, icon: FileText, color: 'bg-blue-500', change: '+2' },
    { label: 'Просмотров', value: totalImpressions.toLocaleString(), icon: Eye, color: 'bg-emerald-500', change: '+18%' },
    { label: 'Конверсий', value: totalConversions.toLocaleString(), icon: MousePointerClick, color: 'bg-purple-500', change: '+24%' },
    { label: 'CR', value: `${conversionRate}%`, icon: TrendingUp, color: 'bg-amber-500', change: '+0.3%' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Дашборд</h1>
        <p className="text-slate-500 mt-1">Обзор метрик для <span className="font-medium text-slate-700">{activeTenant.name}</span></p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-0.5">
                {stat.change}
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Traffic Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Трафик и конверсии</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Area type="monotone" dataKey="views" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} name="Просмотры" />
              <Area type="monotone" dataKey="conversions" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Конверсии" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* A/B Test Chart */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">A/B Тестирование</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={AB_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="impressions" fill="#8b5cf6" name="Показы" radius={[4, 4, 0, 0]} />
              <Bar dataKey="conversions" fill="#10b981" name="Конверсии" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Последние действия</h3>
        <div className="space-y-3">
          {[
            { action: 'Обновлена таблица подмен', target: 'sdvg_adults', time: '5 мин назад', type: 'substitution' },
            { action: 'Опубликована страница', target: 'sdvg-diagnostika v3', time: '1 час назад', type: 'page' },
            { action: 'Создан UI-блок', target: 'hero (variant: gradient)', time: '3 часа назад', type: 'block' },
            { action: 'A/B тест завершён', target: 'Вариант B победил (+15.9% CR)', time: '1 день назад', type: 'ab' },
            { action: 'Новый тенант добавлен', target: 'IronFit (ironfit.ru)', time: '2 дня назад', type: 'tenant' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
              <div className={`w-2 h-2 rounded-full ${
                item.type === 'page' ? 'bg-blue-500' :
                item.type === 'substitution' ? 'bg-amber-500' :
                item.type === 'block' ? 'bg-purple-500' :
                item.type === 'ab' ? 'bg-emerald-500' : 'bg-slate-500'
              }`} />
              <span className="text-sm text-slate-700 flex-1">
                {item.action} — <span className="font-medium">{item.target}</span>
              </span>
              <span className="text-xs text-slate-400">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
