"use client";

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';

interface KpiItem {
  key: string;
  title: string;
  value: number | string;
  status: 'ok' | 'warning' | 'critical';
  asOf: string;
  sources: string[];
  link?: string;
  format?: 'currency' | 'number';
}

interface NetWorthKpiStripProps {
  items: KpiItem[];
  loading?: boolean;
  clientSafe?: boolean;
}

function formatValue(value: number | string, format?: string): string {
  if (typeof value === 'string') return value;
  if (format === 'currency') {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  }
  return value.toLocaleString();
}

export function NetWorthKpiStrip({ items, loading, clientSafe }: NetWorthKpiStripProps) {
  const router = useRouter();
  const { locale } = useApp();

  const visibleItems = clientSafe 
    ? items.filter(i => !['assetsNoSource', 'reconIssues'].includes(i.key))
    : items;

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white/60 rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-stone-200 rounded w-2/3 mb-2" />
            <div className="h-8 bg-stone-200 rounded w-full mb-2" />
            <div className="h-3 bg-stone-100 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {visibleItems.map((item) => (
        <button
          key={item.key}
          onClick={() => item.link && router.push(item.link)}
          className={cn(
            "bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4 text-left transition-all hover:shadow-lg hover:scale-[1.02]",
            item.link && "cursor-pointer"
          )}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-stone-500 font-medium truncate">
              {item.title}
            </span>
            <StatusBadge status={item.status} size="sm" />
          </div>
          
          <div className="text-xl font-bold text-stone-800 mb-2">
            {formatValue(item.value, item.format)}
          </div>

          <div className="flex items-center justify-between text-[10px] text-stone-400">
            <span>{item.asOf}</span>
            <span className="truncate ml-1">{item.sources.slice(0, 2).join(', ')}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
