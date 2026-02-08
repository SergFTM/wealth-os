"use client";

import Link from 'next/link';

interface KpiItem {
  key: string;
  label: string;
  value: number | string;
  status: 'ok' | 'warning' | 'critical' | 'info';
  href?: string;
}

interface OwKpiStripProps {
  kpis: KpiItem[];
}

const statusColors: Record<string, string> = {
  ok: 'text-emerald-600 bg-emerald-50',
  warning: 'text-amber-600 bg-amber-50',
  critical: 'text-red-600 bg-red-50',
  info: 'text-blue-600 bg-blue-50',
};

export function OwKpiStrip({ kpis }: OwKpiStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map((kpi) => {
        const content = (
          <div
            className={`
              p-4 rounded-xl border border-stone-200/50 bg-white/80 backdrop-blur-sm
              transition-all hover:shadow-md hover:border-emerald-200
              ${kpi.href ? 'cursor-pointer' : ''}
            `}
          >
            <div className={`text-2xl font-bold ${statusColors[kpi.status].split(' ')[0]}`}>
              {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
            </div>
            <div className="text-xs text-stone-500 mt-1 truncate">{kpi.label}</div>
            <div className={`mt-2 h-1 rounded-full ${statusColors[kpi.status].split(' ')[1]}`} />
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

export default OwKpiStrip;
