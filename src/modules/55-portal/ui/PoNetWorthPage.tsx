'use client';

import React, { useState } from 'react';
import { PoSourceFooter } from './PoSourceFooter';

interface AssetCategory {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

const TOTAL_NET_WORTH = 12_450_000;

const categories: AssetCategory[] = [
  { name: 'Недвижимость', value: 3_800_000, percentage: 30.5, color: 'bg-emerald-500' },
  { name: 'Публичные акции', value: 3_100_000, percentage: 24.9, color: 'bg-blue-500' },
  { name: 'Частный капитал', value: 2_500_000, percentage: 20.1, color: 'bg-purple-500' },
  { name: 'Фиксированный доход', value: 1_800_000, percentage: 14.5, color: 'bg-amber-500' },
  { name: 'Денежные средства', value: 1_250_000, percentage: 10.0, color: 'bg-stone-400' },
];

const snapshots = [
  { date: '2026-01-31', value: 12_450_000 },
  { date: '2025-12-31', value: 12_200_000 },
  { date: '2025-09-30', value: 11_800_000 },
  { date: '2025-06-30', value: 11_500_000 },
  { date: '2025-03-31', value: 11_100_000 },
  { date: '2024-12-31', value: 10_800_000 },
];

function formatCurrency(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toFixed(0)}`;
}

export function PoNetWorthPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-semibold text-stone-800">Капитал</h1>
        <p className="text-stone-500 mt-1">Опубликованные данные по чистой стоимости</p>
      </div>

      {/* Total Net Worth Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
        <p className="text-sm text-stone-500 mb-1">Чистая стоимость активов</p>
        <p className="text-4xl font-bold text-stone-800">
          ${TOTAL_NET_WORTH.toLocaleString('en-US')}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-sm text-emerald-600 font-medium">+2.0% за месяц</span>
          <span className="text-xs text-stone-400">|</span>
          <span className="text-sm text-emerald-600 font-medium">+15.3% за год</span>
        </div>

        {/* Mini bar */}
        <div className="flex rounded-full overflow-hidden h-3 mt-5">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className={`${cat.color} transition-all`}
              style={{ width: `${cat.percentage}%` }}
              title={`${cat.name}: ${cat.percentage}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center gap-1.5 text-xs text-stone-600">
              <div className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Asset Category Drill-down */}
      <div>
        <h2 className="text-lg font-semibold text-stone-800 mb-3">Категории активов</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() =>
                setExpandedCategory(expandedCategory === cat.name ? null : cat.name)
              }
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6 text-left hover:shadow-md hover:border-emerald-200/60 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                  <p className="text-sm font-medium text-stone-700">{cat.name}</p>
                </div>
                <span className="text-xs text-stone-400">{cat.percentage}%</span>
              </div>
              <p className="text-xl font-semibold text-stone-800">
                ${cat.value.toLocaleString('en-US')}
              </p>
              {/* Progress bar */}
              <div className="mt-3 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${cat.color}`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
              {expandedCategory === cat.name && (
                <p className="text-xs text-stone-500 mt-3">
                  Доля в портфеле: {cat.percentage}% от общей стоимости.
                  Последнее обновление: 31.01.2026.
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Historical Snapshots */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
        <h2 className="text-lg font-semibold text-stone-800 mb-4">Историческая динамика</h2>
        <div className="space-y-2">
          {snapshots.map((snap) => {
            const pct = (snap.value / TOTAL_NET_WORTH) * 100;
            return (
              <div key={snap.date} className="flex items-center gap-4">
                <span className="text-xs text-stone-500 w-24 shrink-0">
                  {new Date(snap.date).toLocaleDateString('ru-RU', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <div className="flex-1 h-6 bg-stone-50 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-lg transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-stone-700 w-20 text-right">
                  {formatCurrency(snap.value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Explain */}
      <div className="bg-gradient-to-r from-emerald-50 to-amber-50/40 rounded-2xl border border-emerald-200/40 p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-400 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-stone-800 mb-1">AI-комментарий</p>
            <p className="text-sm text-stone-600 leading-relaxed">
              Ваша чистая стоимость выросла на 15.3% за последний год, опережая средний показатель
              аналогичных портфелей (+11.2%). Основной вклад внесла недвижимость (+18.5%) и
              частный капитал (+22.0%). Рекомендуется обратить внимание на долю денежных средств
              (10.0%), которая ниже рекомендуемого уровня ликвидности в 12-15%.
            </p>
            <p className="text-xs text-amber-600/80 bg-amber-50 inline-block px-2 py-0.5 rounded mt-2">
              Выводы информационные и требуют проверки человеком
            </p>
          </div>
        </div>
      </div>

      {/* Source Footer */}
      <PoSourceFooter
        asOfDate="2026-01-31"
        sources={['Custodian A', 'Custodian B', 'Manual valuations', 'Private equity admin']}
      />
    </div>
  );
}
