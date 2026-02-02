"use client";

import Link from 'next/link';

interface KpiItem {
  id: string;
  label: string;
  value: string | number;
  status: 'ok' | 'warning' | 'critical';
  linkTo: string;
}

interface DvKpiStripProps {
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

export function DvKpiStrip({ kpis }: DvKpiStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map((kpi) => (
        <Link
          key={kpi.id}
          href={kpi.linkTo}
          className={`
            p-3 rounded-xl border backdrop-blur-sm transition-all
            hover:shadow-md hover:scale-[1.02] cursor-pointer
            ${statusColors[kpi.status]}
          `}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2 h-2 rounded-full ${statusDots[kpi.status]}`} />
            <span className="text-xs font-medium opacity-80 truncate">{kpi.label}</span>
          </div>
          <div className="text-lg font-bold">{kpi.value}</div>
        </Link>
      ))}
    </div>
  );
}
