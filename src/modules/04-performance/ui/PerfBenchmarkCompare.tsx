"use client";

import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface BenchmarkCompareRow {
  period: string;
  portfolioReturn: number;
  benchmarkReturn: number;
  excess: number;
}

interface PerfBenchmarkCompareProps {
  benchmarkName: string;
  rows: BenchmarkCompareRow[];
  onRowClick?: (period: string) => void;
}

export function PerfBenchmarkCompare({ benchmarkName, rows, onRowClick }: PerfBenchmarkCompareProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-stone-800">Сравнение с бенчмарком</h3>
          <span className="text-sm text-stone-500">{benchmarkName}</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/50">
              <th className="text-left py-2 px-4 text-xs font-semibold text-stone-500 uppercase">Период</th>
              <th className="text-right py-2 px-4 text-xs font-semibold text-stone-500 uppercase">Портфель</th>
              <th className="text-right py-2 px-4 text-xs font-semibold text-stone-500 uppercase">Бенчмарк</th>
              <th className="text-right py-2 px-4 text-xs font-semibold text-stone-500 uppercase">Excess</th>
              <th className="text-center py-2 px-4 text-xs font-semibold text-stone-500 uppercase">Статус</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr 
                key={row.period}
                onClick={() => onRowClick?.(row.period)}
                className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <td className="py-3 px-4 font-medium text-stone-800">{row.period}</td>
                <td className={cn(
                  "py-3 px-4 text-right font-medium",
                  row.portfolioReturn >= 0 ? "text-emerald-600" : "text-rose-600"
                )}>
                  {row.portfolioReturn >= 0 ? '+' : ''}{row.portfolioReturn.toFixed(2)}%
                </td>
                <td className={cn(
                  "py-3 px-4 text-right",
                  row.benchmarkReturn >= 0 ? "text-emerald-600" : "text-rose-600"
                )}>
                  {row.benchmarkReturn >= 0 ? '+' : ''}{row.benchmarkReturn.toFixed(2)}%
                </td>
                <td className={cn(
                  "py-3 px-4 text-right font-bold",
                  row.excess >= 0 ? "text-emerald-700" : "text-rose-700"
                )}>
                  {row.excess >= 0 ? '+' : ''}{row.excess.toFixed(2)}%
                </td>
                <td className="py-3 px-4 text-center">
                  <StatusBadge 
                    status={row.excess >= 1 ? 'ok' : row.excess >= 0 ? 'pending' : row.excess >= -1 ? 'warning' : 'critical'}
                    size="sm"
                    label={row.excess >= 0 ? 'Outperform' : 'Underperform'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
