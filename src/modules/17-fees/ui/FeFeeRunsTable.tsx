"use client";

import { FileEdit, Lock, FileText, Calendar, Play, Download } from 'lucide-react';

interface FeeRun {
  id: string;
  periodStart: string;
  periodEnd: string;
  scopeType: string;
  contractsCount: number;
  totalFees: number;
  currency: string;
  status: 'draft' | 'locked' | 'invoiced';
  createdAt: string;
}

interface FeFeeRunsTableProps {
  runs: FeeRun[];
  onRowClick?: (run: FeeRun) => void;
  onLock?: (run: FeeRun) => void;
  onGenerateInvoices?: (run: FeeRun) => void;
  compact?: boolean;
}

const statusConfig = {
  draft: { label: 'Черновик', color: 'text-stone-600', bg: 'bg-stone-100', Icon: FileEdit },
  locked: { label: 'Заблокирован', color: 'text-amber-600', bg: 'bg-amber-50', Icon: Lock },
  invoiced: { label: 'Выставлен', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: FileText },
};

export function FeFeeRunsTable({
  runs,
  onRowClick,
  onLock,
  onGenerateInvoices,
  compact = false,
}: FeFeeRunsTableProps) {
  const displayRuns = compact ? runs.slice(0, 6) : runs;

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPeriod = (start: string, end: string): string => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const startMonth = startDate.toLocaleDateString('ru-RU', { month: 'short' });
    const endMonth = endDate.toLocaleDateString('ru-RU', { month: 'short', year: 'numeric' });
    return `${startMonth} - ${endMonth}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Период</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Договоров</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Сумма</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
              {!compact && (
                <>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Создан</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Действия</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {displayRuns.map((run) => {
              const status = statusConfig[run.status];
              const StatusIcon = status.Icon;

              return (
                <tr
                  key={run.id}
                  onClick={() => onRowClick?.(run)}
                  className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-stone-400" />
                      <span className="font-medium text-stone-800">
                        {formatPeriod(run.periodStart, run.periodEnd)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-stone-700">
                    {run.contractsCount}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-stone-800">
                    {formatCurrency(run.totalFees, run.currency)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </td>
                  {!compact && (
                    <>
                      <td className="px-4 py-3 text-stone-600">
                        {new Date(run.createdAt).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {run.status === 'draft' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onLock?.(run);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                            >
                              <Lock className="w-3 h-3" />
                              Lock
                            </button>
                          )}
                          {run.status === 'locked' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onGenerateInvoices?.(run);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <FileText className="w-3 h-3" />
                              Invoices
                            </button>
                          )}
                          {run.status === 'invoiced' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                            >
                              <Download className="w-3 h-3" />
                              Export
                            </button>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {runs.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет расчётов для отображения
        </div>
      )}
    </div>
  );
}
