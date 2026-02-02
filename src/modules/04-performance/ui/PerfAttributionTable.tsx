"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface AttributionRow {
  id: string;
  segment: string;
  weightAvg: number;
  returnPct: number;
  contributionPct: number;
  flowImpactPct?: number;
  feesImpactPct?: number;
  status: 'calculated' | 'estimated' | 'pending';
}

interface PerfAttributionTableProps {
  rows: AttributionRow[];
  dimension: 'assetClass' | 'strategy' | 'geography' | 'liquidity' | 'advisor';
  onDimensionChange: (dimension: string) => void;
  onRowClick?: (row: AttributionRow) => void;
}

const dimensions = [
  { value: 'assetClass', label: 'Класс актива' },
  { value: 'strategy', label: 'Стратегия' },
  { value: 'geography', label: 'География' },
  { value: 'liquidity', label: 'Ликвидность' },
  { value: 'advisor', label: 'Консультант' }
];

export function PerfAttributionTable({ rows, dimension, onDimensionChange, onRowClick }: PerfAttributionTableProps) {
  const totalContribution = rows.reduce((sum, r) => sum + r.contributionPct, 0);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200/50">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-semibold text-stone-800">Атрибуция доходности</h3>
          <div className="flex gap-1">
            {dimensions.map(d => (
              <button
                key={d.value}
                onClick={() => onDimensionChange(d.value)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                  dimension === d.value
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/50">
              <th className="text-left py-2 px-4 text-xs font-semibold text-stone-500 uppercase">Сегмент</th>
              <th className="text-right py-2 px-4 text-xs font-semibold text-stone-500 uppercase">Вес ср.</th>
              <th className="text-right py-2 px-4 text-xs font-semibold text-stone-500 uppercase">Доходность</th>
              <th className="text-right py-2 px-4 text-xs font-semibold text-stone-500 uppercase">Вклад</th>
              <th className="text-right py-2 px-4 text-xs font-semibold text-stone-500 uppercase">Flows</th>
              <th className="text-right py-2 px-4 text-xs font-semibold text-stone-500 uppercase">Fees</th>
              <th className="text-center py-2 px-4 text-xs font-semibold text-stone-500 uppercase">Статус</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr 
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <td className="py-3 px-4 font-medium text-stone-800">{row.segment}</td>
                <td className="py-3 px-4 text-right text-stone-600">{row.weightAvg.toFixed(1)}%</td>
                <td className={cn(
                  "py-3 px-4 text-right font-medium",
                  row.returnPct >= 0 ? "text-emerald-600" : "text-rose-600"
                )}>
                  {row.returnPct >= 0 ? '+' : ''}{row.returnPct.toFixed(1)}%
                </td>
                <td className={cn(
                  "py-3 px-4 text-right font-bold",
                  row.contributionPct >= 0 ? "text-emerald-700" : "text-rose-700"
                )}>
                  {row.contributionPct >= 0 ? '+' : ''}{row.contributionPct.toFixed(2)}%
                </td>
                <td className={cn(
                  "py-3 px-4 text-right text-xs",
                  (row.flowImpactPct || 0) >= 0 ? "text-stone-500" : "text-rose-500"
                )}>
                  {row.flowImpactPct !== undefined ? `${row.flowImpactPct >= 0 ? '+' : ''}${row.flowImpactPct.toFixed(1)}%` : '—'}
                </td>
                <td className={cn(
                  "py-3 px-4 text-right text-xs",
                  (row.feesImpactPct || 0) < 0 ? "text-rose-500" : "text-stone-500"
                )}>
                  {row.feesImpactPct !== undefined ? `${row.feesImpactPct.toFixed(1)}%` : '—'}
                </td>
                <td className="py-3 px-4 text-center">
                  <StatusBadge 
                    status={row.status === 'calculated' ? 'ok' : row.status === 'estimated' ? 'warning' : 'pending'}
                    size="sm"
                    label={row.status === 'calculated' ? 'Расчёт' : row.status === 'estimated' ? 'Оценка' : 'Ожид.'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-stone-50/80 font-semibold">
              <td className="py-3 px-4 text-stone-800">Итого</td>
              <td className="py-3 px-4 text-right text-stone-600">100%</td>
              <td className="py-3 px-4 text-right">—</td>
              <td className={cn(
                "py-3 px-4 text-right",
                totalContribution >= 0 ? "text-emerald-700" : "text-rose-700"
              )}>
                {totalContribution >= 0 ? '+' : ''}{totalContribution.toFixed(2)}%
              </td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
