"use client";

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Kpi {
  id: string;
  label: string;
  value: number;
  status: 'ok' | 'warning' | 'critical' | 'info';
  sources?: number;
  linkTo?: string;
}

interface GlKpiStripProps {
  kpis: Kpi[];
}

const statusColors = {
  ok: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-700',
  critical: 'bg-rose-50 border-rose-200 text-rose-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700'
};

const statusDots = {
  ok: 'bg-emerald-500',
  warning: 'bg-amber-500',
  critical: 'bg-rose-500',
  info: 'bg-blue-500'
};

export function GlKpiStrip({ kpis }: GlKpiStripProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map(kpi => (
        <button
          key={kpi.id}
          onClick={() => kpi.linkTo && router.push(kpi.linkTo)}
          className={cn(
            "p-3 rounded-xl border text-left transition-all hover:scale-[1.02] hover:shadow-md",
            statusColors[kpi.status],
            kpi.linkTo ? "cursor-pointer" : "cursor-default"
          )}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className={cn("w-2 h-2 rounded-full", statusDots[kpi.status])} />
            <span className="text-xs font-medium truncate">{kpi.label}</span>
          </div>
          <p className="text-xl font-bold">{kpi.value}</p>
          {kpi.sources && (
            <p className="text-xs opacity-70 mt-0.5">{kpi.sources} источн.</p>
          )}
        </button>
      ))}
    </div>
  );
}
