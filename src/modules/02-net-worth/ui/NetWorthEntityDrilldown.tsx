"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

interface Entity {
  id: string;
  name: string;
  type: string;
  totalAssets: number;
  totalLiabilities: number;
  breakdown: { assetClass: string; value: number }[];
}

interface NetWorthEntityDrilldownProps {
  entities: Entity[];
  loading?: boolean;
}

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

const COLORS: Record<string, string> = {
  Public: '#10b981',
  Private: '#3b82f6',
  RealEstate: '#f59e0b',
  Cash: '#6366f1',
  Personal: '#ec4899',
  Other: '#6b7280'
};

export function NetWorthEntityDrilldown({ entities, loading }: NetWorthEntityDrilldownProps) {
  const router = useRouter();
  const { locale } = useApp();
  const [expandedEntity, setExpandedEntity] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="h-6 bg-stone-200 rounded w-1/3 mb-4 animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-stone-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
      <h3 className="font-semibold text-stone-700 mb-4">
        {locale === 'ru' ? 'Структура владения' : 'Ownership Structure'}
      </h3>

      <div className="space-y-2">
        {entities.slice(0, 10).map((entity) => {
          const netWorth = entity.totalAssets - entity.totalLiabilities;
          const isExpanded = expandedEntity === entity.id;
          const totalBreakdown = entity.breakdown.reduce((sum, b) => sum + b.value, 0) || 1;

          return (
            <div key={entity.id}>
              <button
                onClick={() => setExpandedEntity(isExpanded ? null : entity.id)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-lg transition-all",
                  isExpanded ? "bg-emerald-50" : "bg-stone-50 hover:bg-stone-100"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                    entity.type === 'trust' ? "bg-amber-100 text-amber-700" :
                    entity.type === 'company' ? "bg-blue-100 text-blue-700" :
                    "bg-stone-200 text-stone-600"
                  )}>
                    {entity.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-stone-800">{entity.name}</div>
                    <div className="text-xs text-stone-500">{entity.type}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-stone-800">{formatCurrency(netWorth)}</div>
                  <div className="text-xs text-stone-400">
                    A: {formatCurrency(entity.totalAssets)} | L: {formatCurrency(entity.totalLiabilities)}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="mt-2 ml-11 p-3 bg-stone-50 rounded-lg space-y-2">
                  {/* Mini breakdown bar */}
                  <div className="h-2 rounded-full overflow-hidden flex">
                    {entity.breakdown.map((b, i) => (
                      <div
                        key={i}
                        style={{
                          width: `${(b.value / totalBreakdown) * 100}%`,
                          backgroundColor: COLORS[b.assetClass] || '#6b7280'
                        }}
                      />
                    ))}
                  </div>

                  {/* Breakdown list */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {entity.breakdown.map((b, i) => (
                      <button
                        key={i}
                        onClick={() => router.push(`/m/net-worth/list?entityId=${entity.id}&assetClass=${b.assetClass}`)}
                        className="flex items-center justify-between p-2 rounded hover:bg-white transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded" style={{ backgroundColor: COLORS[b.assetClass] }} />
                          <span className="text-stone-600">{b.assetClass}</span>
                        </div>
                        <span className="font-medium text-stone-800">{formatCurrency(b.value)}</span>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => router.push(`/m/net-worth/list?entityId=${entity.id}`)}
                    className="w-full mt-2 text-xs text-emerald-600 hover:underline"
                  >
                    {locale === 'ru' ? 'Показать все активы →' : 'Show all holdings →'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
