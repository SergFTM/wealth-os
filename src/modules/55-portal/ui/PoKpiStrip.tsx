'use client';

import React from 'react';

export interface PoKpiItem {
  label: string;
  value: string | number;
  change?: string;
  status?: 'ok' | 'warning' | 'info';
  href?: string;
}

interface Props {
  items: PoKpiItem[];
}

const statusColors = {
  ok: 'text-emerald-600',
  warning: 'text-amber-600',
  info: 'text-blue-600'
};

export function PoKpiStrip({ items }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((kpi, i) => (
        <div
          key={i}
          className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-5 hover:shadow-md transition-shadow"
        >
          <p className="text-sm text-stone-500 mb-1">{kpi.label}</p>
          <p className="text-2xl font-semibold text-stone-800">{kpi.value}</p>
          {kpi.change && (
            <p className={`text-xs mt-1 ${statusColors[kpi.status || 'ok']}`}>
              {kpi.change}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
