"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

interface KpiItem {
  id: string;
  label: string;
  value: number | string;
  status: 'ok' | 'warning' | 'critical' | 'info';
  linkTo?: string;
}

interface CsKpiStripProps {
  kpis: KpiItem[];
}

const statusStyles = {
  ok: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white',
  warning: 'border-amber-200 bg-gradient-to-br from-amber-50 to-white',
  critical: 'border-rose-200 bg-gradient-to-br from-rose-50 to-white',
  info: 'border-blue-200 bg-gradient-to-br from-blue-50 to-white',
};

const valueStyles = {
  ok: 'text-emerald-700',
  warning: 'text-amber-700',
  critical: 'text-rose-700',
  info: 'text-blue-700',
};

export function CsKpiStrip({ kpis }: CsKpiStripProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map((kpi) => (
        <button
          key={kpi.id}
          onClick={() => kpi.linkTo && router.push(kpi.linkTo)}
          disabled={!kpi.linkTo}
          className={`
            p-3 rounded-xl border backdrop-blur-sm transition-all
            ${statusStyles[kpi.status]}
            ${kpi.linkTo ? 'hover:shadow-md hover:scale-[1.02] cursor-pointer' : 'cursor-default'}
          `}
        >
          <div className={`text-2xl font-bold ${valueStyles[kpi.status]}`}>
            {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
          </div>
          <div className="text-xs text-stone-600 mt-1 truncate">{kpi.label}</div>
        </button>
      ))}
    </div>
  );
}
