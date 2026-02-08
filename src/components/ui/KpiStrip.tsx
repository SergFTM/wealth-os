"use client";

import Link from 'next/link';

export interface KpiItem {
  id: string;
  label: string;
  value: string | number;
  status: 'ok' | 'warning' | 'critical' | 'info';
  linkTo?: string;
}

interface KpiStripProps {
  kpis: KpiItem[];
}

const statusColors: Record<string, string> = {
  ok: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-700',
  critical: 'bg-red-50 border-red-200 text-red-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700',
};

const statusDots: Record<string, string> = {
  ok: 'bg-emerald-500',
  warning: 'bg-amber-500',
  critical: 'bg-red-500',
  info: 'bg-blue-500',
};

export function KpiStrip({ kpis }: KpiStripProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map((kpi) => {
        const content = (
          <div
            className={`relative rounded-xl border p-3 transition-all hover:shadow-sm ${
              statusColors[kpi.status]
            } ${kpi.linkTo ? 'cursor-pointer hover:scale-[1.02]' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="text-xs font-medium opacity-80 truncate pr-2">
                {kpi.label}
              </div>
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDots[kpi.status]}`} />
            </div>
            <div className="text-lg font-bold mt-1 truncate">
              {kpi.value}
            </div>
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
