'use client';

import React from 'react';
import Link from 'next/link';

interface KpiItem {
  key: string;
  title: string;
  value: number | string;
  status: 'ok' | 'warning' | 'critical' | 'info';
  href?: string;
}

interface DgKpiStripProps {
  kpis: KpiItem[];
}

const statusColors = {
  ok: 'text-emerald-600',
  warning: 'text-amber-600',
  critical: 'text-red-600',
  info: 'text-blue-600',
};

const statusBgColors = {
  ok: 'bg-emerald-50 border-emerald-200',
  warning: 'bg-amber-50 border-amber-200',
  critical: 'bg-red-50 border-red-200',
  info: 'bg-blue-50 border-blue-200',
};

export function DgKpiStrip({ kpis }: DgKpiStripProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {kpis.map((kpi) => {
        const content = (
          <div
            className={`
              relative overflow-hidden rounded-xl border p-4
              backdrop-blur-sm transition-all duration-200
              ${statusBgColors[kpi.status]}
              ${kpi.href ? 'hover:shadow-md hover:scale-[1.02] cursor-pointer' : ''}
            `}
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-stone-500 truncate">
                {kpi.title}
              </span>
              <span className={`text-2xl font-bold ${statusColors[kpi.status]}`}>
                {typeof kpi.value === 'number' ? kpi.value.toLocaleString('ru-RU') : kpi.value}
              </span>
            </div>
            {/* Decorative gradient */}
            <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
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
