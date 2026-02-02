"use client";

import Link from 'next/link';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

interface KpiItem {
  key: string;
  title: string;
  value: string | number;
  status: 'ok' | 'warning' | 'critical';
  link: string;
  asOf?: string;
}

interface HomeKpiStripProps {
  items: KpiItem[];
  loading?: boolean;
  clientSafe?: boolean;
}

const statusColors = {
  ok: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-700',
  critical: 'bg-rose-50 border-rose-200 text-rose-700',
};

const statusDots = {
  ok: 'bg-emerald-500',
  warning: 'bg-amber-500',
  critical: 'bg-rose-500',
};

export function HomeKpiStrip({ items, loading, clientSafe }: HomeKpiStripProps) {
  const { locale } = useApp();
  
  const filteredItems = clientSafe 
    ? items.filter(i => ['netWorth', 'unreadMessages'].includes(i.key))
    : items;

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4 animate-pulse">
            <div className="h-3 bg-stone-200 rounded w-20 mb-2" />
            <div className="h-6 bg-stone-200 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {filteredItems.map((item) => (
        <Link
          key={item.key}
          href={item.link}
          className={cn(
            "group relative bg-white/80 backdrop-blur-sm rounded-xl border p-4 transition-all hover:shadow-lg hover:scale-[1.02]",
            statusColors[item.status]
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("w-2 h-2 rounded-full", statusDots[item.status])} />
            <span className="text-xs font-medium truncate">{item.title}</span>
          </div>
          
          <div className="text-2xl font-bold text-stone-800">
            {typeof item.value === 'number' && item.key === 'netWorth' 
              ? `$${(item.value / 1000000).toFixed(1)}M`
              : item.value}
          </div>
          
          {item.asOf && (
            <div className="text-[10px] text-stone-400 mt-1">
              {locale === 'ru' ? 'на' : 'as of'} {item.asOf}
            </div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm font-medium text-emerald-600">
              {locale === 'ru' ? 'Открыть' : 'Open'} →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
