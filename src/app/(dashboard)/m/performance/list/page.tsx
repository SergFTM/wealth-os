"use client";

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import seedData from '@/modules/04-performance/seed.json';

type TabId = 'views' | 'benchmarks' | 'flows' | 'attribution' | 'advisors';

interface PerformanceView {
  id: string;
  clientId: string;
  portfolioId: string;
  name: string;
  method: 'TWR' | 'MWR';
  timeframe: string;
  benchmarkId: string | null;
  status: string;
  isShared: boolean;
  lastGeneratedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Benchmark {
  id: string;
  name: string;
  type: string;
  symbol?: string | null;
  currency: string;
  region: string | null;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CashFlow {
  id: string;
  portfolioId: string;
  clientId?: string;
  date: string;
  type: string;
  amount: number;
  currency: string;
  sourceType?: string | null;
  sourceRef?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AttributionRow {
  id: string;
  viewId: string;
  period: string;
  dimension: string;
  segment: string;
  weightAvg: number;
  returnPct: number;
  contributionPct: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Advisor {
  id: string;
  name: string;
  mandate: string;
  aum: number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const tabs: { id: TabId; label: string }[] = [
  { id: 'views', label: 'Отчёты' },
  { id: 'benchmarks', label: 'Бенчмарки' },
  { id: 'flows', label: 'Денежные потоки' },
  { id: 'attribution', label: 'Атрибуция' },
  { id: 'advisors', label: 'Консультанты' }
];

function formatCurrency(value: number, currency: string): string {
  const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' };
  const symbol = symbols[currency] || currency + ' ';
  if (Math.abs(value) >= 1000000) return `${symbol}${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `${symbol}${(value / 1000).toFixed(0)}K`;
  return `${symbol}${value.toLocaleString()}`;
}

export default function PerformanceListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabId) || 'views';
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [search, setSearch] = useState('');

  const views = seedData.performanceViews as PerformanceView[];
  const benchmarks = seedData.benchmarks as Benchmark[];
  const cashFlows = seedData.cashFlows as CashFlow[];
  const attribution = seedData.attributionRows as AttributionRow[];
  const advisors = seedData.advisors as Advisor[];

  const filteredViews = useMemo(() => {
    if (!search) return views;
    return views.filter(v => v.name.toLowerCase().includes(search.toLowerCase()));
  }, [views, search]);

  const filteredBenchmarks = useMemo(() => {
    if (!search) return benchmarks;
    return benchmarks.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));
  }, [benchmarks, search]);

  const filteredFlows = useMemo(() => {
    if (!search) return cashFlows;
    return cashFlows.filter(f => 
      f.type.toLowerCase().includes(search.toLowerCase()) ||
      f.sourceType?.toLowerCase().includes(search.toLowerCase())
    );
  }, [cashFlows, search]);

  const filteredAttribution = useMemo(() => {
    if (!search) return attribution;
    return attribution.filter(a => a.segment.toLowerCase().includes(search.toLowerCase()));
  }, [attribution, search]);

  const filteredAdvisors = useMemo(() => {
    if (!search) return advisors;
    return advisors.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));
  }, [advisors, search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-emerald-50/30">
      <div className="max-w-[1600px] mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-stone-500 mb-1">
              <button onClick={() => router.push('/m/performance')} className="hover:text-emerald-600">
                Эффективность
              </button>
              <span>/</span>
              <span>Список</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-800">Отчёты и данные</h1>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Поиск..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 border border-stone-200 rounded-lg text-sm w-64 focus:ring-2 focus:ring-emerald-500"
            />
            <Button variant="primary" onClick={() => router.push('/m/performance')}>
              Назад к Dashboard
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-stone-100 p-1 rounded-xl w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                activeTab === tab.id
                  ? "bg-white text-stone-800 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          {activeTab === 'views' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Название</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Портфель</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Метод</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Период</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Последняя генерация</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Статус</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Клиенту</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredViews.map(view => (
                  <tr 
                    key={view.id}
                    onClick={() => router.push(`/m/performance/item/${view.id}`)}
                    className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-stone-800">{view.name}</td>
                    <td className="py-3 px-4 text-stone-600">{view.portfolioId}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        view.method === 'TWR' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                      )}>
                        {view.method}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-stone-600">{view.timeframe}</td>
                    <td className="py-3 px-4 text-stone-500">
                      {view.lastGeneratedAt 
                        ? new Date(view.lastGeneratedAt).toLocaleDateString('ru-RU')
                        : '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge 
                        status={view.status === 'active' ? 'ok' : view.status === 'draft' ? 'pending' : 'warning'}
                        size="sm"
                        label={view.status === 'active' ? 'Активный' : view.status === 'draft' ? 'Черновик' : 'Архив'}
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      {view.isShared ? (
                        <span className="text-emerald-600">✓</span>
                      ) : (
                        <span className="text-stone-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">Открыть</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'benchmarks' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Название</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Тип</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Символ</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Валюта</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Регион</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredBenchmarks.map(bm => (
                  <tr key={bm.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-stone-800">{bm.name}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        bm.type === 'index' ? "bg-blue-100 text-blue-700" : 
                        bm.type === 'etf' ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {bm.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-600 font-mono">{bm.symbol || '—'}</td>
                    <td className="py-3 px-4 text-center text-stone-600">{bm.currency}</td>
                    <td className="py-3 px-4 text-stone-500">{bm.region || '—'}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">Редактировать</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'flows' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Дата</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Портфель</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Тип</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Сумма</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Источник</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Примечание</th>
                </tr>
              </thead>
              <tbody>
                {filteredFlows.map(flow => (
                  <tr key={flow.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4 text-stone-800">{new Date(flow.date).toLocaleDateString('ru-RU')}</td>
                    <td className="py-3 px-4 text-stone-600">{flow.portfolioId}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        flow.type === 'inflow' ? "bg-emerald-100 text-emerald-700" :
                        flow.type === 'outflow' ? "bg-rose-100 text-rose-700" :
                        flow.type === 'dividend' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {flow.type === 'inflow' ? 'Ввод' : 
                         flow.type === 'outflow' ? 'Вывод' :
                         flow.type === 'dividend' ? 'Дивиденд' : 'Комиссия'}
                      </span>
                    </td>
                    <td className={cn(
                      "py-3 px-4 text-right font-medium",
                      flow.amount >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {formatCurrency(flow.amount, flow.currency)}
                    </td>
                    <td className="py-3 px-4 text-stone-500">{flow.sourceType || '—'}</td>
                    <td className="py-3 px-4 text-stone-400 text-xs truncate max-w-48">{flow.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'attribution' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Период</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Измерение</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Сегмент</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Вес</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Доходность</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Вклад</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Статус</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttribution.slice(0, 20).map(attr => (
                  <tr key={attr.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4 text-stone-800">{attr.period}</td>
                    <td className="py-3 px-4 text-stone-600">{attr.dimension}</td>
                    <td className="py-3 px-4 font-medium text-stone-800">{attr.segment}</td>
                    <td className="py-3 px-4 text-right text-stone-600">{attr.weightAvg.toFixed(1)}%</td>
                    <td className={cn(
                      "py-3 px-4 text-right",
                      attr.returnPct >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {attr.returnPct >= 0 ? '+' : ''}{attr.returnPct.toFixed(1)}%
                    </td>
                    <td className={cn(
                      "py-3 px-4 text-right font-medium",
                      attr.contributionPct >= 0 ? "text-emerald-700" : "text-rose-700"
                    )}>
                      {attr.contributionPct >= 0 ? '+' : ''}{attr.contributionPct.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge 
                        status={attr.status === 'calculated' ? 'ok' : attr.status === 'estimated' ? 'warning' : 'pending'}
                        size="sm"
                        label={attr.status === 'calculated' ? 'Расчёт' : attr.status === 'estimated' ? 'Оценка' : 'Ожид.'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'advisors' && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Консультант</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Мандат</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">AUM</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Статус</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredAdvisors.map(advisor => (
                  <tr key={advisor.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-stone-800">{advisor.name}</td>
                    <td className="py-3 px-4 text-stone-600">{advisor.mandate}</td>
                    <td className="py-3 px-4 text-right text-stone-700">{formatCurrency(advisor.aum, advisor.currency)}</td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge 
                        status={advisor.status === 'active' ? 'ok' : 'warning'}
                        size="sm"
                        label={advisor.status === 'active' ? 'Активный' : 'Неактивный'}
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">Открыть</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
