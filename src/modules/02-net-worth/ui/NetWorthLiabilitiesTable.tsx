"use client";

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';

interface Liability {
  id: string;
  name: string;
  type: string;
  entityId?: string;
  balance: number;
  rate?: number;
  currency: string;
  frequency?: string;
  nextPaymentDate?: string;
  status: string;
  sourceType?: string;
}

interface NetWorthLiabilitiesTableProps {
  liabilities: Liability[];
  loading?: boolean;
  onRowClick: (liability: Liability) => void;
}

function formatCurrency(value: number, currency: string): string {
  const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CHF: 'CHF ', RUB: '₽' };
  const symbol = symbols[currency] || currency + ' ';
  if (value >= 1000000) return `${symbol}${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `${symbol}${(value / 1000).toFixed(0)}K`;
  return `${symbol}${value.toLocaleString()}`;
}

export function NetWorthLiabilitiesTable({ liabilities, loading, onRowClick }: NetWorthLiabilitiesTableProps) {
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
          {locale === 'ru' ? 'Обязательства' : 'Liabilities'}
        </h3>
        <Button variant="ghost" size="sm" onClick={() => router.push('/m/net-worth/list?tab=liabilities')}>
          {locale === 'ru' ? 'Все обязательства →' : 'All Liabilities →'}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/50">
              <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">
                {locale === 'ru' ? 'Обязательство' : 'Liability'}
              </th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">
                {locale === 'ru' ? 'Тип' : 'Type'}
              </th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-stone-500 uppercase">
                {locale === 'ru' ? 'Баланс' : 'Balance'}
              </th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">
                {locale === 'ru' ? 'Ставка' : 'Rate'}
              </th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">
                {locale === 'ru' ? 'След. платёж' : 'Next Payment'}
              </th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">
                {locale === 'ru' ? 'Статус' : 'Status'}
              </th>
            </tr>
          </thead>
          <tbody>
            {liabilities.slice(0, 8).map((liability) => (
              <tr
                key={liability.id}
                onClick={() => onRowClick(liability)}
                className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <td className="py-3 px-3">
                  <span className="font-medium text-stone-800">{liability.name}</span>
                </td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-700">
                    {liability.type}
                  </span>
                </td>
                <td className="py-3 px-3 text-right font-medium text-rose-600">
                  {formatCurrency(liability.balance, liability.currency)}
                </td>
                <td className="py-3 px-3 text-center text-stone-600">
                  {liability.rate ? `${liability.rate}%` : '-'}
                </td>
                <td className="py-3 px-3 text-center text-stone-500 text-xs">
                  {liability.nextPaymentDate 
                    ? new Date(liability.nextPaymentDate).toLocaleDateString('ru-RU')
                    : '-'}
                </td>
                <td className="py-3 px-3 text-center">
                  <StatusBadge 
                    status={liability.status === 'active' ? 'warning' : liability.status === 'paid' ? 'ok' : 'critical'} 
                    size="sm" 
                    label={liability.status} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
