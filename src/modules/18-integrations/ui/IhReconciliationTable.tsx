"use client";

import { Scale, CheckCircle, XCircle, AlertTriangle, Eye, FileText, RefreshCw } from 'lucide-react';
import { IhStatusPill } from './IhStatusPill';

interface Reconciliation {
  id: string;
  clientId: string;
  reconciliationType: 'ibor_vs_abor' | 'bank_vs_gl' | 'custodian_vs_portfolio';
  periodStart: string;
  periodEnd: string;
  status: 'success' | 'break' | 'partial';
  sourceTotal: number;
  targetTotal: number;
  variance: number;
  variancePercent: number;
  breakDetails: string | null;
  runAt: string;
  notes: string | null;
}

interface IhReconciliationTableProps {
  reconciliations: Reconciliation[];
  onRowClick?: (rec: Reconciliation) => void;
  onRerun?: (rec: Reconciliation) => void;
  onExport?: (rec: Reconciliation) => void;
  filterType?: 'ibor_vs_abor' | 'bank_vs_gl' | 'custodian_vs_portfolio' | 'all';
  filterStatus?: 'success' | 'break' | 'partial' | 'all';
  compact?: boolean;
}

const typeLabels: Record<string, string> = {
  ibor_vs_abor: 'IBOR vs ABOR',
  bank_vs_gl: 'Bank vs GL',
  custodian_vs_portfolio: 'Custodian vs Portfolio',
};

export function IhReconciliationTable({
  reconciliations,
  onRowClick,
  onRerun,
  onExport,
  filterType = 'all',
  filterStatus = 'all',
  compact = false,
}: IhReconciliationTableProps) {
  let filteredRecs = reconciliations;

  if (filterType !== 'all') {
    filteredRecs = filteredRecs.filter(r => r.reconciliationType === filterType);
  }

  if (filterStatus !== 'all') {
    filteredRecs = filteredRecs.filter(r => r.status === filterStatus);
  }

  const displayRecs = compact ? filteredRecs.slice(0, 10) : filteredRecs;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });
  };

  const formatPeriod = (start: string, end: string): string => {
    return `${formatDate(start)} — ${formatDate(end)}`;
  };

  const getVarianceColor = (variancePercent: number): string => {
    if (Math.abs(variancePercent) < 0.01) return 'text-emerald-600';
    if (Math.abs(variancePercent) < 0.1) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Тип</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Период</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Источник</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Цель</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Разница</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
              {!compact && (
                <>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Выполнено</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Действия</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {displayRecs.map((rec) => (
              <tr
                key={rec.id}
                onClick={() => onRowClick?.(rec)}
                className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-stone-600 bg-stone-100 rounded">
                    <Scale className="w-3 h-3" />
                    {typeLabels[rec.reconciliationType]}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {formatPeriod(rec.periodStart, rec.periodEnd)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-stone-800">
                  {formatCurrency(rec.sourceTotal)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-stone-800">
                  {formatCurrency(rec.targetTotal)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className={`font-mono font-medium ${getVarianceColor(rec.variancePercent)}`}>
                    {formatCurrency(rec.variance)}
                  </div>
                  <div className={`text-xs ${getVarianceColor(rec.variancePercent)}`}>
                    {rec.variancePercent > 0 ? '+' : ''}{rec.variancePercent.toFixed(3)}%
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <IhStatusPill status={rec.status} size="sm" />
                </td>
                {!compact && (
                  <>
                    <td className="px-4 py-3 text-stone-600">
                      {formatDate(rec.runAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRowClick?.(rec);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRerun?.(rec);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onExport?.(rec);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                        >
                          <FileText className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredRecs.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет сверок для отображения
        </div>
      )}

      {/* Summary stats */}
      <div className="px-4 py-3 bg-stone-50 border-t border-stone-200">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle className="w-3.5 h-3.5" />
              {filteredRecs.filter(r => r.status === 'success').length} matched
            </span>
            <span className="flex items-center gap-1.5 text-red-600">
              <XCircle className="w-3.5 h-3.5" />
              {filteredRecs.filter(r => r.status === 'break').length} breaks
            </span>
          </div>
          <span className="text-stone-500">
            Всего: {filteredRecs.length}
          </span>
        </div>
      </div>
    </div>
  );
}
