'use client';

import { useRouter } from 'next/navigation';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { DlStatusPill } from './DlStatusPill';

interface Transaction {
  id: string;
  dealId: string;
  txDate: string;
  txType: string;
  amount: number;
  currency: string;
  counterparty?: string;
  status: string;
  glRefId?: string;
}

interface Deal {
  id: string;
  name: string;
  dealNumber: string;
}

interface DlTransactionsTableProps {
  transactions: Transaction[];
  deals: Deal[];
  compact?: boolean;
  onPostToGl?: (txId: string) => void;
  onRevert?: (txId: string) => void;
}

const txTypeLabels: Record<string, { label: string; isInflow: boolean }> = {
  buy: { label: 'Покупка', isInflow: false },
  sell: { label: 'Продажа', isInflow: true },
  fee: { label: 'Комиссия', isInflow: false },
  distribution: { label: 'Распределение', isInflow: true },
  call: { label: 'Вызов капитала', isInflow: false },
  dividend: { label: 'Дивиденд', isInflow: true }
};

export function DlTransactionsTable({ transactions, deals, compact = false, onPostToGl, onRevert }: DlTransactionsTableProps) {
  const router = useRouter();

  const getDealName = (dealId: string) => {
    const deal = deals.find(d => d.id === dealId);
    return deal?.name || dealId;
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: compact ? undefined : 'numeric'
    });
  };

  const handleRowClick = (dealId: string) => {
    router.push(`/m/deals/deal/${dealId}?tab=transactions`);
  };

  const sortedTransactions = [...transactions].sort((a, b) =>
    new Date(b.txDate).getTime() - new Date(a.txDate).getTime()
  );

  if (compact) {
    return (
      <div className="rounded-xl border border-white/20 bg-white/60 backdrop-blur overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Дата</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Тип</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Сумма</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Статус</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.slice(0, 5).map(tx => {
              const typeInfo = txTypeLabels[tx.txType] || { label: tx.txType, isInflow: false };
              return (
                <tr
                  key={tx.id}
                  onClick={() => handleRowClick(tx.dealId)}
                  className="border-b border-slate-50 last:border-0 hover:bg-emerald-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-2 text-sm text-slate-600">{formatDate(tx.txDate)}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1.5">
                      {typeInfo.isInflow ? (
                        <ArrowDownRight className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm text-slate-700">{typeInfo.label}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right text-sm font-medium text-slate-900">
                    {formatCurrency(tx.amount, tx.currency)}
                  </td>
                  <td className="px-4 py-2">
                    <DlStatusPill status={tx.status} size="sm" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/20 bg-white/60 backdrop-blur overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Дата</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Сделка</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Тип</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Сумма</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Контрагент</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Статус</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">GL Ref</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map(tx => {
            const typeInfo = txTypeLabels[tx.txType] || { label: tx.txType, isInflow: false };
            return (
              <tr
                key={tx.id}
                onClick={() => handleRowClick(tx.dealId)}
                className="border-b border-slate-50 last:border-0 hover:bg-emerald-50/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 text-sm text-slate-600">{formatDate(tx.txDate)}</td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-slate-900">{getDealName(tx.dealId)}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {typeInfo.isInflow ? (
                      <ArrowDownRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm text-slate-700">{typeInfo.label}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                  {formatCurrency(tx.amount, tx.currency)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{tx.counterparty || '—'}</td>
                <td className="px-4 py-3">
                  <DlStatusPill status={tx.status} />
                </td>
                <td className="px-4 py-3 text-sm font-mono text-slate-400">
                  {tx.glRefId || '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {tx.status === 'draft' && onPostToGl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPostToGl(tx.id);
                        }}
                        className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                      >
                        Провести
                      </button>
                    )}
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded hover:bg-slate-100 transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4 text-slate-400" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
