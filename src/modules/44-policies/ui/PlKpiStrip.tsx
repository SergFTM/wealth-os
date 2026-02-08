"use client";

import Link from 'next/link';

interface KpiItem {
  key: string;
  label: string;
  value: number | string;
  status: 'ok' | 'warning' | 'critical';
  href?: string;
}

interface PlKpiStripProps {
  kpis: KpiItem[];
}

const statusColors = {
  ok: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-700',
  critical: 'bg-red-50 border-red-200 text-red-700',
};

const statusDots = {
  ok: 'bg-emerald-500',
  warning: 'bg-amber-500',
  critical: 'bg-red-500',
};

export function PlKpiStrip({ kpis }: PlKpiStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map((kpi) => {
        const content = (
          <div
            className={`
              rounded-xl border p-3 backdrop-blur-sm transition-all
              ${statusColors[kpi.status]}
              ${kpi.href ? 'hover:shadow-md hover:scale-[1.02] cursor-pointer' : ''}
            `}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${statusDots[kpi.status]}`} />
              <span className="text-xs font-medium opacity-80 truncate">{kpi.label}</span>
            </div>
            <div className="text-xl font-bold">{kpi.value}</div>
          </div>
        );

        if (kpi.href) {
          return (
            <Link key={kpi.key} href={kpi.href}>
              {content}
            </Link>
          );
        }

        return <div key={kpi.key}>{content}</div>;
      })}
    </div>
  );
}
