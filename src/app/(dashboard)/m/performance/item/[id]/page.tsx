"use client";

import { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import seedData from '@/modules/04-performance/seed.json';

type TabId = 'overview' | 'settings' | 'benchmark' | 'attribution' | 'flows' | 'documents' | 'audit';

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
  currency: string;
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
  flowImpactPct?: number;
  feesImpactPct?: number;
  status: string;
}

interface CashFlow {
  id: string;
  portfolioId: string;
  date: string;
  type: string;
  amount: number;
  currency: string;
  sourceType?: string | null;
  notes?: string | null;
}

const tabs: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Обзор' },
  { id: 'settings', label: 'Настройки' },
  { id: 'benchmark', label: 'Бенчмарк' },
  { id: 'attribution', label: 'Атрибуция' },
  { id: 'flows', label: 'Потоки' },
  { id: 'documents', label: 'Документы' },
  { id: 'audit', label: 'Аудит' }
];

function formatCurrency(value: number, currency: string): string {
  const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£' };
  const symbol = symbols[currency] || currency + ' ';
  if (Math.abs(value) >= 1000000) return `${symbol}${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `${symbol}${(value / 1000).toFixed(0)}K`;
  return `${symbol}${value.toLocaleString()}`;
}

export default function PerformanceItemPage() {
  const router = useRouter();
  const params = useParams();
  const viewId = params.id as string;
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const views = seedData.performanceViews as PerformanceView[];
  const benchmarks = seedData.benchmarks as Benchmark[];
  const allAttribution = seedData.attributionRows as AttributionRow[];
  const allFlows = seedData.cashFlows as CashFlow[];

  const view = views.find(v => v.id === viewId);
  const benchmark = benchmarks.find(b => b.id === view?.benchmarkId);
  const attribution = allAttribution.filter(a => a.viewId === viewId);
  const flows = allFlows.filter(f => f.portfolioId === view?.portfolioId);

  const kpiData = useMemo(() => {
    const totalContribution = attribution.reduce((sum, a) => sum + a.contributionPct, 0);
    const best = attribution.reduce((a, b) => a.contributionPct > b.contributionPct ? a : b, attribution[0]);
    const worst = attribution.reduce((a, b) => a.contributionPct < b.contributionPct ? a : b, attribution[0]);
    
    return {
      twr: totalContribution || 14.9,
      mwr: (totalContribution || 14.9) - 0.8,
      vol: 12.5,
      drawdown: -8.2,
      alpha: 2.1,
      best: best?.segment || 'N/A',
      worst: worst?.segment || 'N/A'
    };
  }, [attribution]);

  if (!view) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Отчёт не найден</h2>
          <p className="text-stone-500 mb-4">ID: {viewId}</p>
          <Button onClick={() => router.push('/m/performance/list')}>Вернуться к списку</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-emerald-50/30">
      <div className="max-w-[1400px] mx-auto p-6">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-stone-500 mb-2">
            <button onClick={() => router.push('/m/performance')} className="hover:text-emerald-600">Эффективность</button>
            <span>/</span>
            <button onClick={() => router.push('/m/performance/list')} className="hover:text-emerald-600">Отчёты</button>
            <span>/</span>
            <span className="text-stone-700">{view.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-stone-800">{view.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium",
                  view.method === 'TWR' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                )}>
                  {view.method}
                </span>
                <span className="text-stone-500 text-sm">{view.timeframe}</span>
                <StatusBadge 
                  status={view.status === 'active' ? 'ok' : 'pending'}
                  size="sm"
                  label={view.status === 'active' ? 'Активный' : 'Черновик'}
                />
                {view.isShared && (
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Виден клиенту</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary">Сгенерировать отчёт</Button>
              <Button variant="primary">Экспорт</Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-stone-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === tab.id
                  ? "border-emerald-500 text-emerald-700"
                  : "border-transparent text-stone-500 hover:text-stone-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {[
                { label: 'TWR', value: `+${kpiData.twr.toFixed(1)}%`, status: 'ok' },
                { label: 'MWR', value: `+${kpiData.mwr.toFixed(1)}%`, status: 'ok' },
                { label: 'Волатильность', value: `${kpiData.vol}%`, status: 'warning' },
                { label: 'Max DD', value: `${kpiData.drawdown}%`, status: 'warning' },
                { label: 'Альфа', value: `+${kpiData.alpha}%`, status: 'ok' },
                { label: 'Лучший', value: kpiData.best, status: 'ok' },
                { label: 'Худший', value: kpiData.worst, status: 'critical' }
              ].map((kpi, i) => (
                <div 
                  key={i}
                  className={cn(
                    "p-4 rounded-xl border bg-white/80",
                    kpi.status === 'ok' ? "border-emerald-200" : 
                    kpi.status === 'warning' ? "border-amber-200" : "border-rose-200"
                  )}
                >
                  <p className="text-xs text-stone-500 mb-1">{kpi.label}</p>
                  <p className={cn(
                    "text-lg font-bold",
                    kpi.status === 'ok' ? "text-emerald-700" :
                    kpi.status === 'warning' ? "text-amber-700" : "text-rose-700"
                  )}>{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* Chart placeholder */}
            <div className="bg-white/80 rounded-xl border border-stone-200 p-6">
              <h3 className="font-semibold text-stone-800 mb-4">Equity Curve vs {benchmark?.name || 'Benchmark'}</h3>
              <div className="h-64 bg-gradient-to-br from-stone-50 to-emerald-50/30 rounded-lg flex items-center justify-center text-stone-400">
                График портфель vs бенчмарк
              </div>
            </div>

            {/* Quick attribution */}
            <div className="bg-white/80 rounded-xl border border-stone-200 p-6">
              <h3 className="font-semibold text-stone-800 mb-4">Атрибуция по классам активов</h3>
              <div className="space-y-2">
                {attribution.filter(a => a.dimension === 'assetClass').slice(0, 5).map(attr => (
                  <div key={attr.id} className="flex items-center justify-between py-2 border-b border-stone-100">
                    <span className="text-stone-700">{attr.segment}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-stone-500 text-sm">{attr.weightAvg.toFixed(1)}%</span>
                      <span className={cn(
                        "font-medium",
                        attr.contributionPct >= 0 ? "text-emerald-600" : "text-rose-600"
                      )}>
                        {attr.contributionPct >= 0 ? '+' : ''}{attr.contributionPct.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white/80 rounded-xl border border-stone-200 p-6 max-w-2xl">
            <h3 className="font-semibold text-stone-800 mb-6">Настройки отчёта</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Название</label>
                <input type="text" defaultValue={view.name} className="w-full px-3 py-2 border border-stone-200 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Метод</label>
                  <select defaultValue={view.method} className="w-full px-3 py-2 border border-stone-200 rounded-lg">
                    <option value="TWR">TWR (Time-Weighted)</option>
                    <option value="MWR">MWR (Money-Weighted)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Период</label>
                  <select defaultValue={view.timeframe} className="w-full px-3 py-2 border border-stone-200 rounded-lg">
                    {['1M', '3M', '6M', 'YTD', '1Y', '3Y', 'ALL'].map(tf => (
                      <option key={tf} value={tf}>{tf}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Бенчмарк</label>
                <select defaultValue={view.benchmarkId || ''} className="w-full px-3 py-2 border border-stone-200 rounded-lg">
                  <option value="">Без бенчмарка</option>
                  {benchmarks.map(bm => (
                    <option key={bm.id} value={bm.id}>{bm.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <Button variant="primary">Сохранить</Button>
                <Button variant="ghost">Отмена</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'benchmark' && (
          <div className="bg-white/80 rounded-xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200">
              <h3 className="font-semibold text-stone-800">Сравнение с бенчмарком: {benchmark?.name || 'Не выбран'}</h3>
            </div>
            {benchmark ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50/50">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Период</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Портфель</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Бенчмарк</th>
                    <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Excess</th>
                  </tr>
                </thead>
                <tbody>
                  {['YTD', 'Q4 2025', 'Q3 2025', 'Q2 2025', 'Q1 2025'].map((period, i) => {
                    const portfolioReturn = [14.9, 3.5, 2.2, 4.8, 3.2][i];
                    const benchmarkReturn = [12.8, 3.2, 1.8, 4.2, 2.8][i];
                    const excess = portfolioReturn - benchmarkReturn;
                    return (
                      <tr key={period} className="border-b border-stone-100">
                        <td className="py-3 px-4 text-stone-800">{period}</td>
                        <td className="py-3 px-4 text-right text-emerald-600">+{portfolioReturn}%</td>
                        <td className="py-3 px-4 text-right text-blue-600">+{benchmarkReturn}%</td>
                        <td className={cn(
                          "py-3 px-4 text-right font-bold",
                          excess >= 0 ? "text-emerald-700" : "text-rose-700"
                        )}>
                          {excess >= 0 ? '+' : ''}{excess.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-stone-500">Бенчмарк не выбран для этого отчёта</div>
            )}
          </div>
        )}

        {activeTab === 'attribution' && (
          <div className="bg-white/80 rounded-xl border border-stone-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Измерение</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Сегмент</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Вес</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Доходность</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Вклад</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Статус</th>
                </tr>
              </thead>
              <tbody>
                {attribution.map(attr => (
                  <tr key={attr.id} className="border-b border-stone-100 hover:bg-stone-50">
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
                      "py-3 px-4 text-right font-bold",
                      attr.contributionPct >= 0 ? "text-emerald-700" : "text-rose-700"
                    )}>
                      {attr.contributionPct >= 0 ? '+' : ''}{attr.contributionPct.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <StatusBadge 
                        status={attr.status === 'calculated' ? 'ok' : 'warning'}
                        size="sm"
                        label={attr.status === 'calculated' ? 'Расчёт' : 'Оценка'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'flows' && (
          <div className="bg-white/80 rounded-xl border border-stone-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Дата</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Тип</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Сумма</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Источник</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-stone-500 uppercase">Примечание</th>
                </tr>
              </thead>
              <tbody>
                {flows.map(flow => (
                  <tr key={flow.id} className="border-b border-stone-100">
                    <td className="py-3 px-4 text-stone-800">{new Date(flow.date).toLocaleDateString('ru-RU')}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        flow.type === 'inflow' ? "bg-emerald-100 text-emerald-700" :
                        flow.type === 'outflow' ? "bg-rose-100 text-rose-700" :
                        flow.type === 'dividend' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {flow.type === 'inflow' ? 'Ввод' : flow.type === 'outflow' ? 'Вывод' :
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
                    <td className="py-3 px-4 text-stone-400 text-xs">{flow.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white/80 rounded-xl border border-stone-200 p-8 text-center">
            <div className="text-stone-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-stone-500 mb-4">Нет прикреплённых документов</p>
            <Button variant="secondary">Прикрепить документ</Button>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white/80 rounded-xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200">
              <h3 className="font-semibold text-stone-800">Журнал изменений</h3>
            </div>
            <div className="divide-y divide-stone-100">
              {[
                { action: 'Отчёт сгенерирован', user: 'System', date: view.lastGeneratedAt || view.updatedAt },
                { action: 'Настройки изменены', user: 'Admin', date: view.updatedAt },
                { action: 'Отчёт создан', user: 'Admin', date: view.createdAt }
              ].map((event, i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium text-stone-800">{event.action}</p>
                    <p className="text-xs text-stone-500">{event.user}</p>
                  </div>
                  <span className="text-sm text-stone-500">
                    {new Date(event.date).toLocaleString('ru-RU')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
