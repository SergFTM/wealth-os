"use client";

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Holding {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  ticker?: string;
  assetClass: string;
  entityId?: string;
  value: number;
  currency: string;
  valuationStatus: string;
  asOf?: string;
  sourceType?: string;
  reconStatus?: string;
  liquidity?: string;
  [key: string]: unknown;
}

interface NetWorthHoldingsTableProps {
  holdings: Holding[];
  loading?: boolean;
  clientSafe?: boolean;
  onRowClick: (holding: Holding) => void;
  onCreateTask: (holding: Holding) => void;
}

function formatCurrency(value: number, currency: string): string {
  const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CHF: 'CHF ', RUB: '₽' };
  const symbol = symbols[currency] || currency + ' ';
  if (value >= 1000000) return `${symbol}${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `${symbol}${(value / 1000).toFixed(0)}K`;
  return `${symbol}${value.toLocaleString()}`;
}

function getStatusVariant(status: string): 'ok' | 'warning' | 'critical' | 'pending' {
  switch (status) {
    case 'priced': return 'ok';
    case 'estimated': return 'pending';
    case 'stale': return 'warning';
    case 'missing': return 'critical';
    case 'ok': return 'ok';
    case 'issue': return 'critical';
    default: return 'pending';
  }
}

export function NetWorthHoldingsTable({ holdings, loading, clientSafe, onRowClick, onCreateTask }: NetWorthHoldingsTableProps) {
  const router = useRouter();
  const { locale } = useApp();

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <div className="h-6 bg-stone-200 rounded w-1/4 mb-4 animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 bg-stone-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-200/50 flex items-center justify-between">
        <h3 className="font-semibold text-stone-700">
          {locale === 'ru' ? 'Топ активы' : 'Top Holdings'}
        </h3>
        <Button variant="ghost" size="sm" onClick={() => router.push('/m/net-worth/list?tab=holdings')}>
          {locale === 'ru' ? 'Все активы →' : 'All Holdings →'}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/50">
              <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">
                {locale === 'ru' ? 'Актив' : 'Asset'}
              </th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">
                {locale === 'ru' ? 'Класс' : 'Class'}
              </th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-stone-500 uppercase">
                {locale === 'ru' ? 'Стоимость' : 'Value'}
              </th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">
                {locale === 'ru' ? 'Оценка' : 'Valuation'}
              </th>
              {!clientSafe && (
                <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">
                  {locale === 'ru' ? 'Сверка' : 'Recon'}
                </th>
              )}
              <th className="text-right py-2 px-3 text-xs font-semibold text-stone-500 uppercase">
                {locale === 'ru' ? 'Действия' : 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody>
            {holdings.slice(0, 8).map((holding) => (
              <tr
                key={holding.id}
                onClick={() => onRowClick(holding)}
                className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <td className="py-3 px-3">
                  <div>
                    <span className="font-medium text-stone-800">{holding.name}</span>
                    {holding.ticker && (
                      <span className="ml-2 text-stone-400 text-xs">{holding.ticker}</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    holding.assetClass === 'Public' && "bg-emerald-100 text-emerald-700",
                    holding.assetClass === 'Private' && "bg-blue-100 text-blue-700",
                    holding.assetClass === 'RealEstate' && "bg-amber-100 text-amber-700",
                    holding.assetClass === 'Cash' && "bg-indigo-100 text-indigo-700",
                    holding.assetClass === 'Personal' && "bg-pink-100 text-pink-700"
                  )}>
                    {holding.assetClass}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-medium text-stone-800">
                  {formatCurrency(holding.value, holding.currency)}
                </td>
                <td className="py-3 px-3 text-center">
                  <StatusBadge status={getStatusVariant(holding.valuationStatus)} size="sm" label={holding.valuationStatus} />
                </td>
                {!clientSafe && (
                  <td className="py-3 px-3 text-center">
                    {holding.reconStatus && (
                      <StatusBadge status={getStatusVariant(holding.reconStatus)} size="sm" label={holding.reconStatus} />
                    )}
                  </td>
                )}
                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/m/net-worth/item/${holding.id}`)}
                    >
                      {locale === 'ru' ? 'Открыть' : 'Open'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onCreateTask(holding)}
                    >
                      {locale === 'ru' ? 'Задача' : 'Task'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
