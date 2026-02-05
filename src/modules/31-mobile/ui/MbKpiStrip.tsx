'use client';

import Link from 'next/link';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

interface KpiCard {
  id: string;
  value: number | string;
  label: { ru: string; en: string; uk: string };
  link: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface MbKpiStripProps {
  kpis: KpiCard[];
  className?: string;
}

export function MbKpiStrip({ kpis, className }: MbKpiStripProps) {
  const { locale } = useApp();

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4', className)}>
      {kpis.map((kpi) => (
        <Link
          key={kpi.id}
          href={kpi.link}
          className="group bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-4 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200"
        >
          <div className="text-2xl font-semibold text-stone-800 mb-1">
            {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
          </div>
          <div className="text-xs text-stone-500 group-hover:text-emerald-600 transition-colors">
            {kpi.label[locale]}
          </div>
          {kpi.trend && (
            <div className={cn(
              'text-xs mt-1 flex items-center gap-1',
              kpi.trend === 'up' ? 'text-emerald-600' : kpi.trend === 'down' ? 'text-red-500' : 'text-stone-400'
            )}>
              {kpi.trend === 'up' && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
              {kpi.trend === 'down' && (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
