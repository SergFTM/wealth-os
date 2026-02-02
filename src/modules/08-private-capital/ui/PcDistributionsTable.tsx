"use client";

import { cn } from '@/lib/utils';

interface PcDistribution {
  id: string;
  fundId: string;
  fundName?: string;
  date: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  receivedDate?: string | null;
  docIds?: string[];
}

interface PcDistributionsTableProps {
  distributions: PcDistribution[];
  onOpen: (id: string) => void;
  onMarkReceived?: (id: string) => void;
  onAttachDoc?: (id: string) => void;
  compact?: boolean;
}

export function PcDistributionsTable({ distributions, onOpen, onMarkReceived, onAttachDoc, compact }: PcDistributionsTableProps) {
  const formatCurrency = (val: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(val);
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('ru-RU');

  const typeLabels: Record<string, string> = {
    cash: 'Cash',
    in_kind: 'In-Kind',
    return_capital: 'ROC',
    fee: 'Fee'
  };

  const statusLabels: Record<string, string> = {
    planned: 'Запланировано',
    received: 'Получено',
    pending: 'Ожидает'
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      {!compact && (
        <div className="p-4 border-b border-stone-200/50">
          <h3 className="font-semibold text-stone-800">Распределения</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50/50 sticky top-0">
            <tr>
              <th className="text-left p-3 font-medium text-stone-600">Дата</th>
              <th className="text-left p-3 font-medium text-stone-600">Фонд</th>
              <th className="text-right p-3 font-medium text-stone-600">Сумма</th>
              <th className="text-left p-3 font-medium text-stone-600">Тип</th>
              <th className="text-left p-3 font-medium text-stone-600">Статус</th>
              {!compact && <th className="text-right p-3 font-medium text-stone-600">Действия</th>}
            </tr>
          </thead>
          <tbody>
            {distributions.map(dist => (
              <tr
                key={dist.id}
                onClick={() => onOpen(dist.id)}
                className="border-t border-stone-100 hover:bg-emerald-50/50 cursor-pointer transition-colors"
              >
                <td className="p-3 text-stone-700">{formatDate(dist.date)}</td>
                <td className="p-3 font-medium text-stone-800">{dist.fundName || dist.fundId}</td>
                <td className="p-3 text-right font-medium text-emerald-600">+{formatCurrency(dist.amount, dist.currency)}</td>
                <td className="p-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    dist.type === 'cash' && "bg-emerald-100 text-emerald-700",
                    dist.type === 'in_kind' && "bg-purple-100 text-purple-700",
                    dist.type === 'return_capital' && "bg-blue-100 text-blue-700",
                    dist.type === 'fee' && "bg-amber-100 text-amber-700"
                  )}>
                    {typeLabels[dist.type] || dist.type}
                  </span>
                </td>
                <td className="p-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    dist.status === 'received' && "bg-emerald-100 text-emerald-700",
                    dist.status === 'planned' && "bg-stone-100 text-stone-600",
                    dist.status === 'pending' && "bg-amber-100 text-amber-700"
                  )}>
                    {statusLabels[dist.status] || dist.status}
                  </span>
                </td>
                {!compact && (
                  <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1 justify-end">
                      {onMarkReceived && dist.status !== 'received' && (
                        <button
                          onClick={() => onMarkReceived(dist.id)}
                          className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                        >
                          Получено
                        </button>
                      )}
                      {onAttachDoc && (
                        <button
                          onClick={() => onAttachDoc(dist.id)}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                        >
                          📎
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
