"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface KpiItem {
  key: string;
  title: string;
  value: number | string;
  status: 'ok' | 'warning' | 'critical';
  asOf?: string;
  sources?: string[];
  link?: string;
  format?: 'number' | 'currency' | 'datetime' | 'status';
}

interface ReconKpiStripProps {
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

const statusColors = {
  ok: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  warning: 'bg-amber-50 border-amber-200 text-amber-700',
  critical: 'bg-rose-50 border-rose-200 text-rose-700'
};

const statusDots = {
  ok: 'bg-emerald-500',
  warning: 'bg-amber-500',
  critical: 'bg-rose-500'
};

export function ReconKpiStrip({ items, loading, clientSafe }: ReconKpiStripProps) {
  const visibleItems = clientSafe 
    ? items.filter(item => !['unmappedItems', 'staleFeeds', 'dataQualityIssues', 'slaRisk'].includes(item.key))
    : items;

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4 animate-pulse">
            <div className="h-3 bg-stone-200 rounded w-2/3 mb-2" />
            <div className="h-6 bg-stone-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
      {visibleItems.map((item) => {
        const Card = (
          <div
            className={cn(
              "bg-white/80 backdrop-blur-sm rounded-xl border p-4 transition-all hover:shadow-md",
              statusColors[item.status],
              item.link && "cursor-pointer hover:scale-[1.02]"
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium opacity-80 truncate">{item.title}</span>
              <span className={cn("w-2 h-2 rounded-full", statusDots[item.status])} />
            </div>
            <div className="text-xl font-bold">
              {formatValue(item.value, item.format)}
            </div>
            {item.asOf && (
              <div className="text-xs opacity-60 mt-1">на {item.asOf}</div>
            )}
            {item.sources && item.sources.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.sources.slice(0, 2).map(src => (
                  <span key={src} className="text-[10px] px-1.5 py-0.5 rounded bg-white/50">
                    {src}
                  </span>
                ))}
              </div>
            )}
          </div>
        );

        if (item.link) {
          return (
            <Link key={item.key} href={item.link}>
              {Card}
            </Link>
          );
        }
        return <div key={item.key}>{Card}</div>;
      })}
    </div>
  );
}
