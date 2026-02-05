'use client';

import React from 'react';
import Link from 'next/link';

interface KpiItem {
  key: string;
  label: string;
  value: number;
  status: 'ok' | 'warning' | 'critical';
  href: string;
}

interface ApiKpiStripProps {
  kpis: KpiItem[];
}

const statusColors = {
  ok: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-700',
  critical: 'bg-red-50 border-red-200 text-red-700',
};

export function ApiKpiStrip({ kpis }: ApiKpiStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map((kpi) => (
        <Link
          key={kpi.key}
          href={kpi.href}
          className={`
            block p-3 rounded-xl border backdrop-blur-sm
            transition-all hover:scale-[1.02] hover:shadow-md
            ${statusColors[kpi.status]}
          `}
        >
          <div className="text-2xl font-bold">{kpi.value}</div>
          <div className="text-xs opacity-75 truncate">{kpi.label}</div>
        </Link>
      ))}
    </div>
  );
}
