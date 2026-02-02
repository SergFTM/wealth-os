"use client";

import { cn } from '@/lib/utils';

interface PcValuation {
  id: string;
  fundId: string;
  fundName?: string;
  asOf: string;
  nav: number;
  currency: string;
  method: string;
  status: string;
  docIds?: string[];
}

interface PcValuationsTableProps {
  valuations: PcValuation[];
  onOpen: (id: string) => void;
  onAddValuation?: (fundId: string) => void;
  onAttachDoc?: (id: string) => void;
  onCreateTask?: (id: string) => void;
}

export function PcValuationsTable({ valuations, onOpen, onAddValuation, onAttachDoc, onCreateTask }: PcValuationsTableProps) {
  const formatCurrency = (val: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(val);
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('ru-RU');

  const methodLabels: Record<string, string> = {
    gp_report: 'GP Report',
    appraisal: 'Appraisal',
    manual: 'Manual',
    model: 'Model'
  };

  const statusLabels: Record<string, string> = {
    ok: 'OK',
    stale: 'Устаревшая',
    missing: 'Нет данных'
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50/50 sticky top-0">
            <tr>
              <th className="text-left p-3 font-medium text-stone-600">Фонд</th>
              <th className="text-left p-3 font-medium text-stone-600">As-of</th>
              <th className="text-right p-3 font-medium text-stone-600">NAV</th>
              <th className="text-left p-3 font-medium text-stone-600">Метод</th>
              <th className="text-left p-3 font-medium text-stone-600">Статус</th>
              <th className="text-left p-3 font-medium text-stone-600">Документ</th>
              <th className="text-right p-3 font-medium text-stone-600">Действия</th>
            </tr>
          </thead>
          <tbody>
            {valuations.map(val => (
              <tr
                key={val.id}
                onClick={() => onOpen(val.id)}
                className="border-t border-stone-100 hover:bg-emerald-50/50 cursor-pointer transition-colors"
              >
                <td className="p-3 font-medium text-stone-800">{val.fundName || val.fundId}</td>
                <td className="p-3 text-stone-600">{formatDate(val.asOf)}</td>
                <td className="p-3 text-right font-medium text-stone-800">{formatCurrency(val.nav, val.currency)}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-stone-100 text-stone-600">
                    {methodLabels[val.method] || val.method}
                  </span>
                </td>
                <td className="p-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-xs font-medium",
                    val.status === 'ok' && "bg-emerald-100 text-emerald-700",
                    val.status === 'stale' && "bg-amber-100 text-amber-700",
                    val.status === 'missing' && "bg-rose-100 text-rose-700"
                  )}>
                    {statusLabels[val.status] || val.status}
                  </span>
                </td>
                <td className="p-3 text-stone-500">
                  {val.docIds && val.docIds.length > 0 ? (
                    <span className="text-emerald-600">📎 {val.docIds.length}</span>
                  ) : (
                    <span className="text-stone-400">—</span>
                  )}
                </td>
                <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                  <div className="flex gap-1 justify-end">
                    {onAddValuation && (
                      <button
                        onClick={() => onAddValuation(val.fundId)}
                        className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                      >
                        + NAV
                      </button>
                    )}
                    {onAttachDoc && (
                      <button
                        onClick={() => onAttachDoc(val.id)}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                      >
                        📎
                      </button>
                    )}
                    {onCreateTask && (val.status === 'stale' || val.status === 'missing') && (
                      <button
                        onClick={() => onCreateTask(val.id)}
                        className="px-2 py-1 text-xs bg-amber-100 text-amber-600 rounded hover:bg-amber-200 transition-colors"
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
