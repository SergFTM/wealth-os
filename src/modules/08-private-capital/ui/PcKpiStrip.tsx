"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PcKpi {
  id: string;
  label: string;
  value: string | number;
  status: 'ok' | 'warning' | 'critical';
  linkTo?: string;
  asOf?: string;
}

interface PcKpiStripProps {
  kpis: PcKpi[];
}

export function PcKpiStrip({ kpis }: PcKpiStripProps) {
  const statusColors = {
    ok: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
    critical: 'bg-rose-50 border-rose-200 text-rose-700'
  };

  const statusDots = {
    ok: 'bg-emerald-500',
    warning: 'bg-amber-500',
    critical: 'bg-rose-500'
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map(kpi => {
        const content = (
          <div
            className={cn(
              "p-4 rounded-xl border backdrop-blur-sm transition-all duration-200",
              statusColors[kpi.status],
              kpi.linkTo && "hover:shadow-md cursor-pointer hover:scale-[1.02]"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium opacity-70 truncate">{kpi.label}</span>
              <span className={cn("w-2 h-2 rounded-full", statusDots[kpi.status])} />
            </div>
            <div className="text-xl font-bold">{kpi.value}</div>
            {kpi.asOf && (
              <div className="text-xs opacity-60 mt-1">as of {kpi.asOf}</div>
            )}
          </div>
        );

        if (kpi.linkTo) {
          return (
            <Link key={kpi.id} href={kpi.linkTo}>
              {content}
            </Link>
          );
        }

        return <div key={kpi.id}>{content}</div>;
      })}
    </div>
  );
}
