'use client';

import { TrendingUp, TrendingDown, FileText, Clock, Check, AlertCircle } from 'lucide-react';

interface ImpactLine {
  id: string;
  sourceType: string;
  sourceRef: string;
  asOfDate: string;
  netWorthDelta: number;
  glDebit?: { accountCode: string; accountName: string; amount: number };
  glCredit?: { accountCode: string; accountName: string; amount: number };
  performanceTag?: string;
  status: 'planned' | 'posted';
}

interface DlImpactPanelProps {
  totalInvested: number;
  totalDistributions: number;
  totalFees: number;
  netCashFlow: number;
  impactLines: ImpactLine[];
  currency?: string;
}

export function DlImpactPanel({
  totalInvested,
  totalDistributions,
  totalFees,
  netCashFlow,
  impactLines,
  currency = 'USD'
}: DlImpactPanelProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const plannedCount = impactLines.filter(l => l.status === 'planned').length;
  const postedCount = impactLines.filter(l => l.status === 'posted').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-rose-50 border border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-red-500" />
            <span className="text-xs font-medium text-red-600">Инвестировано</span>
          </div>
          <div className="text-xl font-semibold text-red-700">{formatCurrency(totalInvested)}</div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-600">Распределения</span>
          </div>
          <div className="text-xl font-semibold text-emerald-700">{formatCurrency(totalDistributions)}</div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium text-amber-600">Комиссии</span>
          </div>
          <div className="text-xl font-semibold text-amber-700">{formatCurrency(totalFees)}</div>
        </div>

        <div className={`p-4 rounded-xl border ${
          netCashFlow >= 0
            ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100'
            : 'bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`h-4 w-4 ${netCashFlow >= 0 ? 'text-emerald-500' : 'text-slate-500'}`} />
            <span className={`text-xs font-medium ${netCashFlow >= 0 ? 'text-emerald-600' : 'text-slate-600'}`}>
              Чистый поток
            </span>
          </div>
          <div className={`text-xl font-semibold ${netCashFlow >= 0 ? 'text-emerald-700' : 'text-slate-700'}`}>
            {formatCurrency(netCashFlow)}
          </div>
        </div>
      </div>

      {/* Posting Status */}
      <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-500" />
          <span className="text-sm text-slate-600">{postedCount} проведено</span>
        </div>
        {plannedCount > 0 && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-amber-600">{plannedCount} ожидает</span>
          </div>
        )}
      </div>

      {/* Impact Lines */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-700">Проводки GL</h4>
        {impactLines.length > 0 ? (
          <div className="space-y-2">
            {impactLines.map(line => (
              <div
                key={line.id}
                className={`p-3 rounded-lg border ${
                  line.status === 'posted'
                    ? 'bg-emerald-50/50 border-emerald-100'
                    : 'bg-amber-50/50 border-amber-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {line.status === 'posted' ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-amber-500" />
                    )}
                    <span className="text-xs font-mono text-slate-500">{line.sourceRef}</span>
                  </div>
                  {line.performanceTag && (
                    <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700">
                      {line.performanceTag}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {line.glDebit && (
                    <div>
                      <div className="text-xs text-slate-500">Дебет</div>
                      <div className="font-medium text-slate-900">
                        {line.glDebit.accountCode} - {line.glDebit.accountName}
                      </div>
                      <div className="text-slate-600">{formatCurrency(line.glDebit.amount)}</div>
                    </div>
                  )}
                  {line.glCredit && (
                    <div>
                      <div className="text-xs text-slate-500">Кредит</div>
                      <div className="font-medium text-slate-900">
                        {line.glCredit.accountCode} - {line.glCredit.accountName}
                      </div>
                      <div className="text-slate-600">{formatCurrency(line.glCredit.amount)}</div>
                    </div>
                  )}
                </div>
                {line.netWorthDelta !== 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <span className="text-xs text-slate-500">Net Worth Delta: </span>
                    <span className={`text-sm font-medium ${line.netWorthDelta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {line.netWorthDelta >= 0 ? '+' : ''}{formatCurrency(line.netWorthDelta)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center text-sm text-slate-400">
            Нет проводок
          </div>
        )}
      </div>

      {/* Source-first disclaimer */}
      <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-100">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
          <div className="text-xs text-blue-700">
            <strong>Source-first:</strong> Все записи содержат ссылки на источники (документы, согласования) и as-of даты для корректного учета.
          </div>
        </div>
      </div>
    </div>
  );
}
