"use client";

import { cn } from '@/lib/utils';

interface PcCall {
  id: string;
  fundId: string;
  fundName?: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: string;
  paidDate?: string | null;
  docIds?: string[];
}

interface PcCallsTableProps {
  calls: PcCall[];
  onOpen: (id: string) => void;
  onMarkPaid?: (id: string) => void;
  onAttachDoc?: (id: string) => void;
  onCreateTask?: (id: string) => void;
  compact?: boolean;
}

export function PcCallsTable({ calls, onOpen, onMarkPaid, onAttachDoc, onCreateTask, compact }: PcCallsTableProps) {
  const formatCurrency = (val: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(val);
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('ru-RU');

  const statusLabels: Record<string, string> = {
    planned: 'Запланирован',
    sent: 'Отправлен',
    paid: 'Оплачен',
    overdue: 'Просрочен'
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      {!compact && (
        <div className="p-4 border-b border-stone-200/50">
          <h3 className="font-semibold text-stone-800">Capital Calls</h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50/50 sticky top-0">
            <tr>
              <th className="text-left p-3 font-medium text-stone-600">Due Date</th>
              <th className="text-left p-3 font-medium text-stone-600">Фонд</th>
              <th className="text-right p-3 font-medium text-stone-600">Сумма</th>
              <th className="text-left p-3 font-medium text-stone-600">Статус</th>
              {!compact && <th className="text-left p-3 font-medium text-stone-600">Документ</th>}
              {!compact && <th className="text-right p-3 font-medium text-stone-600">Действия</th>}
            </tr>
          </thead>
          <tbody>
            {calls.map(call => (
              <tr
                key={call.id}
                onClick={() => onOpen(call.id)}
                className="border-t border-stone-100 hover:bg-emerald-50/50 cursor-pointer transition-colors"
              >
                <td className="p-3 text-stone-700">{formatDate(call.dueDate)}</td>
                <td className="p-3 font-medium text-stone-800">{call.fundName || call.fundId}</td>
                <td className="p-3 text-right font-medium text-stone-800">{formatCurrency(call.amount, call.currency)}</td>
                <td className="p-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    call.status === 'paid' && "bg-emerald-100 text-emerald-700",
                    call.status === 'sent' && "bg-blue-100 text-blue-700",
                    call.status === 'planned' && "bg-stone-100 text-stone-600",
                    call.status === 'overdue' && "bg-rose-100 text-rose-700"
                  )}>
                    {statusLabels[call.status] || call.status}
                  </span>
                </td>
                {!compact && (
                  <td className="p-3 text-stone-500">
                    {call.docIds && call.docIds.length > 0 ? (
                      <span className="text-emerald-600">📎 {call.docIds.length}</span>
                    ) : (
                      <span className="text-stone-400">—</span>
                    )}
                  </td>
                )}
                {!compact && (
                  <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex gap-1 justify-end">
                      {onMarkPaid && call.status !== 'paid' && (
                        <button
                          onClick={() => onMarkPaid(call.id)}
                          className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                        >
                          Оплачен
                        </button>
                      )}
                      {onAttachDoc && (
                        <button
                          onClick={() => onAttachDoc(call.id)}
                          className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                        >
                          📎
                        </button>
                      )}
                      {onCreateTask && call.status === 'overdue' && (
                        <button
                          onClick={() => onCreateTask(call.id)}
                          className="px-2 py-1 text-xs bg-rose-100 text-rose-600 rounded hover:bg-rose-200 transition-colors"
                        >
                          Задача
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
