"use client";

import { cn } from '@/lib/utils';

interface PcCommitment {
  id: string;
  fundId: string;
  fundName?: string;
  entityId: string;
  entityName?: string;
  amountCommitted: number;
  amountCalled: number;
  unfunded: number;
  currency: string;
  status: string;
  asOf?: string;
}

interface PcCommitmentsTableProps {
  commitments: PcCommitment[];
  onOpen: (id: string) => void;
  onCreateCall?: (id: string) => void;
  onCreateTask?: (id: string) => void;
}

export function PcCommitmentsTable({ commitments, onOpen, onCreateCall, onCreateTask }: PcCommitmentsTableProps) {
  const formatCurrency = (val: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(val);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50/50 sticky top-0">
            <tr>
              <th className="text-left p-3 font-medium text-stone-600">Фонд</th>
              <th className="text-left p-3 font-medium text-stone-600">Entity</th>
              <th className="text-right p-3 font-medium text-stone-600">Commitment</th>
              <th className="text-right p-3 font-medium text-stone-600">Called</th>
              <th className="text-right p-3 font-medium text-stone-600">Unfunded</th>
              <th className="text-left p-3 font-medium text-stone-600">Статус</th>
              <th className="text-left p-3 font-medium text-stone-600">As-of</th>
              <th className="text-right p-3 font-medium text-stone-600">Действия</th>
            </tr>
          </thead>
          <tbody>
            {commitments.map(c => (
              <tr
                key={c.id}
                onClick={() => onOpen(c.id)}
                className="border-t border-stone-100 hover:bg-emerald-50/50 cursor-pointer transition-colors"
              >
                <td className="p-3 font-medium text-stone-800">{c.fundName || c.fundId}</td>
                <td className="p-3 text-stone-600">{c.entityName || c.entityId}</td>
                <td className="p-3 text-right text-stone-600">{formatCurrency(c.amountCommitted, c.currency)}</td>
                <td className="p-3 text-right text-stone-600">{formatCurrency(c.amountCalled, c.currency)}</td>
                <td className={cn(
                  "p-3 text-right font-medium",
                  c.unfunded > 0 ? "text-amber-600" : "text-stone-400"
                )}>
                  {formatCurrency(c.unfunded, c.currency)}
                </td>
                <td className="p-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    c.status === 'active' && "bg-emerald-100 text-emerald-700",
                    c.status === 'fully_called' && "bg-blue-100 text-blue-700",
                    c.status === 'closed' && "bg-stone-100 text-stone-600"
                  )}>
                    {c.status === 'active' ? 'Активно' : c.status === 'fully_called' ? 'Выбрано' : 'Закрыто'}
                  </span>
                </td>
                <td className="p-3 text-stone-500 text-xs">{c.asOf || '-'}</td>
                <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                  <div className="flex gap-1 justify-end">
                    {onCreateCall && c.unfunded > 0 && (
                      <button
                        onClick={() => onCreateCall(c.id)}
                        className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                      >
                        + Call
                      </button>
                    )}
                    {onCreateTask && (
                      <button
                        onClick={() => onCreateTask(c.id)}
                        className="px-2 py-1 text-xs bg-stone-100 text-stone-600 rounded hover:bg-stone-200 transition-colors"
                      >
                        Задача
                      </button>
                    )}
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
