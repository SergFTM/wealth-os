'use client';

import React from 'react';
import { PoSourceFooter } from './PoSourceFooter';

interface PortfolioRow {
  id: string;
  name: string;
  strategy: string;
  ytdReturn: number;
  oneYearReturn: number;
  benchmark: string;
  benchmarkReturn: number;
}

const portfolios: PortfolioRow[] = [
  {
    id: 'pf-1',
    name: 'Основной портфель',
    strategy: 'Сбалансированная',
    ytdReturn: 8.2,
    oneYearReturn: 12.5,
    benchmark: 'MSCI World',
    benchmarkReturn: 10.1,
  },
  {
    id: 'pf-2',
    name: 'Консервативный',
    strategy: 'Фиксированный доход',
    ytdReturn: 3.1,
    oneYearReturn: 5.4,
    benchmark: 'Bloomberg Agg',
    benchmarkReturn: 4.8,
  },
  {
    id: 'pf-3',
    name: 'Рост',
    strategy: 'Агрессивный рост',
    ytdReturn: 14.5,
    oneYearReturn: 22.1,
    benchmark: 'S&P 500',
    benchmarkReturn: 18.3,
  },
  {
    id: 'pf-4',
    name: 'Частный капитал',
    strategy: 'PE / VC',
    ytdReturn: 6.8,
    oneYearReturn: 19.2,
    benchmark: 'Cambridge PE',
    benchmarkReturn: 15.0,
  },
  {
    id: 'pf-5',
    name: 'Недвижимость',
    strategy: 'Прямые инвестиции',
    ytdReturn: 4.2,
    oneYearReturn: 9.8,
    benchmark: 'NCREIF',
    benchmarkReturn: 7.5,
  },
];

const chartData = [
  { month: 'Авг', value: 5.1 },
  { month: 'Сен', value: 5.8 },
  { month: 'Окт', value: 4.9 },
  { month: 'Ноя', value: 6.3 },
  { month: 'Дек', value: 7.0 },
  { month: 'Янв', value: 8.2 },
];

function returnColor(value: number): string {
  if (value >= 10) return 'text-emerald-600';
  if (value >= 0) return 'text-emerald-500';
  return 'text-red-500';
}

function barColor(value: number): string {
  if (value >= 10) return 'bg-emerald-500';
  if (value >= 5) return 'bg-emerald-400';
  if (value >= 0) return 'bg-amber-400';
  return 'bg-red-400';
}

export function PoPerformancePage() {
  const maxChartValue = Math.max(...chartData.map((d) => d.value));

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Доходность</h1>
        <p className="text-stone-500 mt-1">Опубликованные данные по доходности портфелей</p>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
          <p className="text-sm text-stone-500 mb-1">Доходность YTD (все портфели)</p>
          <p className="text-3xl font-bold text-emerald-600">+8.2%</p>
          <p className="text-xs text-stone-400 mt-1">Взвешенная по объёму</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
          <p className="text-sm text-stone-500 mb-1">Доходность 1 год</p>
          <p className="text-3xl font-bold text-emerald-600">+12.5%</p>
          <p className="text-xs text-stone-400 mt-1">Основной портфель</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
          <p className="text-sm text-stone-500 mb-1">Альфа vs бенчмарк</p>
          <p className="text-3xl font-bold text-emerald-600">+2.4%</p>
          <p className="text-xs text-stone-400 mt-1">За год, MSCI World</p>
        </div>
      </div>

      {/* Simplified Chart */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Динамика YTD доходности</h2>
        <div className="flex items-end gap-3 h-48">
          {chartData.map((d) => {
            const heightPct = (d.value / maxChartValue) * 100;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-medium text-stone-700">+{d.value}%</span>
                <div className="w-full relative" style={{ height: '160px' }}>
                  <div
                    className={`absolute bottom-0 w-full rounded-t-lg ${barColor(d.value)} transition-all`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-xs text-stone-500">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 overflow-hidden">
        <div className="p-6 pb-3">
          <h2 className="text-lg font-semibold text-stone-800">Портфели</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200/50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Портфель
                </th>
                <th className="px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Стратегия
                </th>
                <th className="px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider text-right">
                  YTD
                </th>
                <th className="px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider text-right">
                  1 год
                </th>
                <th className="px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Бенчмарк
                </th>
                <th className="px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider text-right">
                  Бенчмарк %
                </th>
                <th className="px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wider text-right">
                  Альфа
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {portfolios.map((pf) => {
                const alpha = pf.oneYearReturn - pf.benchmarkReturn;
                return (
                  <tr key={pf.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-stone-800">{pf.name}</td>
                    <td className="px-6 py-4 text-stone-600">{pf.strategy}</td>
                    <td className={`px-6 py-4 text-right font-medium ${returnColor(pf.ytdReturn)}`}>
                      +{pf.ytdReturn}%
                    </td>
                    <td className={`px-6 py-4 text-right font-medium ${returnColor(pf.oneYearReturn)}`}>
                      +{pf.oneYearReturn}%
                    </td>
                    <td className="px-6 py-4 text-stone-600">{pf.benchmark}</td>
                    <td className="px-6 py-4 text-right text-stone-500">
                      +{pf.benchmarkReturn}%
                    </td>
                    <td className={`px-6 py-4 text-right font-medium ${alpha >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {alpha >= 0 ? '+' : ''}{alpha.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Source Footer */}
      <PoSourceFooter
        asOfDate="2026-01-31"
        sources={['Custodian A', 'Custodian B', 'Fund administrators']}
      />
    </div>
  );
}
