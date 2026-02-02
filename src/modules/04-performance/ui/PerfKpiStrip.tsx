"use client";

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface KpiItem {
  id: string;
  label: string;
  value: string | number;
  format?: 'percent' | 'number' | 'text';
  status?: 'ok' | 'warning' | 'critical';
  timeframe?: string;
  asOf?: string;
  trend?: 'up' | 'down' | 'flat';
}

interface PerfKpiStripProps {
  kpis: KpiItem[];
  onKpiClick?: (kpiId: string) => void;
}

const statusColors = {
  ok: 'border-emerald-200 bg-emerald-50/50',
  warning: 'border-amber-200 bg-amber-50/50',
  critical: 'border-rose-200 bg-rose-50/50'
};

const trendIcons = {
  up: '↑',
  down: '↓',
  flat: '→'
};

const trendColors = {
  up: 'text-emerald-600',
  down: 'text-rose-600',
  flat: 'text-stone-500'
};

function formatValue(value: string | number, format?: string): string {
  if (typeof value === 'string') return value;
  if (format === 'percent') return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  if (format === 'number') return value.toLocaleString();
  return String(value);
}

export function PerfKpiStrip({ kpis, onKpiClick }: PerfKpiStripProps) {
  const router = useRouter();

  const handleClick = (kpi: KpiItem) => {
    if (onKpiClick) {
      onKpiClick(kpi.id);
    } else {
      router.push(`/m/performance/list?view=${kpi.id}`);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map(kpi => (
        <button
          key={kpi.id}
          onClick={() => handleClick(kpi)}
          className={cn(
            "p-4 rounded-xl border transition-all hover:shadow-md hover:scale-[1.02] text-left",
            "bg-white/80 backdrop-blur-sm",
            kpi.status ? statusColors[kpi.status] : 'border-stone-200'
          )}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-stone-500 font-medium truncate">{kpi.label}</span>
            {kpi.timeframe && (
              <span className="text-[10px] px-1.5 py-0.5 bg-stone-100 rounded text-stone-500">
                {kpi.timeframe}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className={cn(
              "text-xl font-bold",
              kpi.format === 'percent' && typeof kpi.value === 'number' 
                ? kpi.value >= 0 ? 'text-emerald-700' : 'text-rose-700'
                : 'text-stone-800'
            )}>
              {formatValue(kpi.value, kpi.format)}
            </span>
            {kpi.trend && (
              <span className={cn("text-sm", trendColors[kpi.trend])}>
                {trendIcons[kpi.trend]}
              </span>
            )}
          </div>
          {kpi.asOf && (
            <span className="text-[10px] text-stone-400 mt-1 block">
              {kpi.asOf}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
