"use client";

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface KpiItem {
  id: string;
  label: string;
  value: number | string;
  status: 'ok' | 'warning' | 'critical' | 'info';
  asOf?: string;
  sources?: number;
  linkTo?: string;
}

interface ReportsKpiStripProps {
  kpis: KpiItem[];
}

export function ReportsKpiStrip({ kpis }: ReportsKpiStripProps) {
  const router = useRouter();

  const statusColors = {
    ok: 'border-emerald-200 bg-emerald-50/50',
    warning: 'border-amber-200 bg-amber-50/50',
    critical: 'border-rose-200 bg-rose-50/50',
    info: 'border-blue-200 bg-blue-50/50',
  };

  const valueColors = {
    ok: 'text-emerald-700',
    warning: 'text-amber-700',
    critical: 'text-rose-700',
    info: 'text-blue-700',
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map(kpi => (
        <div
          key={kpi.id}
          onClick={() => kpi.linkTo && router.push(kpi.linkTo)}
          className={cn(
            "p-3 rounded-xl border transition-all",
            statusColors[kpi.status],
            kpi.linkTo && "cursor-pointer hover:shadow-md hover:scale-[1.02]"
          )}
        >
          <p className="text-xs text-stone-500 mb-1 truncate">{kpi.label}</p>
          <p className={cn("text-xl font-bold", valueColors[kpi.status])}>
            {kpi.value}
          </p>
          {(kpi.asOf || kpi.sources !== undefined) && (
            <div className="flex items-center gap-2 mt-1">
              {kpi.asOf && (
                <span className="text-[10px] text-stone-400">{kpi.asOf}</span>
              )}
              {kpi.sources !== undefined && (
                <span className="text-[10px] px-1.5 py-0.5 bg-stone-100 rounded text-stone-500">
                  {kpi.sources} src
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
