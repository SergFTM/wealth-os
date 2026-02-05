"use client";

import {
  Calendar,
  FileEdit,
  Lock,
  FileText,
  Calculator,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface FeeRun {
  id: string;
  periodStart: string;
  periodEnd: string;
  scopeType: string;
  scopeId: string | null;
  contractsCount: number;
  totalAum: number;
  totalFees: number;
  currency: string;
  status: 'draft' | 'locked' | 'invoiced';
  createdAt: string;
  lockedAt: string | null;
  lockedBy: string | null;
}

interface FeeLineItem {
  contractId: string;
  contractName: string;
  clientName: string;
  aum: number;
  feeAmount: number;
  scheduleType: string;
  ratePct: number | null;
}

interface FeFeeRunDetailProps {
  run: FeeRun;
  lineItems?: FeeLineItem[];
  onLock?: () => void;
  onUnlock?: () => void;
  onGenerateInvoices?: () => void;
  onRecalculate?: () => void;
  onExport?: () => void;
}

const statusConfig = {
  draft: { label: 'Черновик', color: 'text-stone-600', bg: 'bg-stone-100', Icon: FileEdit },
  locked: { label: 'Заблокирован', color: 'text-amber-600', bg: 'bg-amber-50', Icon: Lock },
  invoiced: { label: 'Выставлен', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: FileText },
};

export function FeFeeRunDetail({
  run,
  lineItems = [],
  onLock,
  onUnlock,
  onGenerateInvoices,
  onRecalculate,
  onExport,
}: FeFeeRunDetailProps) {
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

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
    return `${startDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })} — ${endDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}`;
  };

  const status = statusConfig[run.status];
  const StatusIcon = status.Icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-stone-800 mb-1">
              Расчёт комиссий
            </h2>
            <div className="flex items-center gap-2 text-stone-600">
              <Calendar className="w-4 h-4" />
              <span>{formatPeriod(run.periodStart, run.periodEnd)}</span>
            </div>
          </div>
          <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl ${status.bg} ${status.color}`}>
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </span>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-stone-50 rounded-xl">
            <div className="flex items-center gap-2 text-stone-500 text-xs mb-1">
              <Users className="w-4 h-4" />
              Договоров
            </div>
            <div className="text-2xl font-bold text-stone-800">{run.contractsCount}</div>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl">
            <div className="flex items-center gap-2 text-stone-500 text-xs mb-1">
              <DollarSign className="w-4 h-4" />
              Общий AUM
            </div>
            <div className="text-2xl font-bold text-stone-800">
              {formatCurrency(run.totalAum, run.currency)}
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="flex items-center gap-2 text-blue-600 text-xs mb-1">
              <Calculator className="w-4 h-4" />
              Итого комиссий
            </div>
            <div className="text-2xl font-bold text-blue-700">
              {formatCurrency(run.totalFees, run.currency)}
            </div>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl">
            <div className="flex items-center gap-2 text-stone-500 text-xs mb-1">
              <Clock className="w-4 h-4" />
              Создан
            </div>
            <div className="text-sm font-medium text-stone-800">
              {formatDate(run.createdAt)}
            </div>
          </div>
        </div>

        {/* Lock info */}
        {run.lockedAt && (
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-sm">
            <Lock className="w-4 h-4 text-amber-600" />
            <span className="text-amber-800">
              Заблокирован {formatDate(run.lockedAt)}
              {run.lockedBy && ` пользователем ${run.lockedBy}`}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {run.status === 'draft' && (
            <>
              <button
                onClick={onRecalculate}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl transition-colors"
              >
                <Calculator className="w-4 h-4" />
                Пересчитать
              </button>
              <button
                onClick={onLock}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors"
              >
                <Lock className="w-4 h-4" />
                Заблокировать
              </button>
            </>
          )}
          {run.status === 'locked' && (
            <>
              <button
                onClick={onGenerateInvoices}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
              >
                <FileText className="w-4 h-4" />
                Создать счета
              </button>
              <button
                onClick={onUnlock}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl transition-colors"
              >
                <Lock className="w-4 h-4" />
                Разблокировать
              </button>
            </>
          )}
          <button
            onClick={onExport}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl transition-colors"
          >
            <FileText className="w-4 h-4" />
            Экспорт
          </button>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200">
          <h3 className="font-semibold text-stone-800">Детализация по договорам</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Договор</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Клиент</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Тип</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">AUM</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Ставка</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Комиссия</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, index) => (
                <tr key={index} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="px-6 py-3 font-medium text-stone-800">{item.contractName}</td>
                  <td className="px-4 py-3 text-stone-600">{item.clientName}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-1 text-xs font-medium bg-stone-100 text-stone-600 rounded">
                      {item.scheduleType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-stone-600">
                    {formatCurrency(item.aum, run.currency)}
                  </td>
                  <td className="px-4 py-3 text-center text-stone-600">
                    {item.ratePct !== null ? `${item.ratePct}%` : '—'}
                  </td>
                  <td className="px-6 py-3 text-right font-semibold text-stone-800">
                    {formatCurrency(item.feeAmount, run.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-stone-50 border-t-2 border-stone-200">
                <td colSpan={3} className="px-6 py-3 font-semibold text-stone-800">Итого</td>
                <td className="px-4 py-3 text-right font-semibold text-stone-800">
                  {formatCurrency(run.totalAum, run.currency)}
                </td>
                <td></td>
                <td className="px-6 py-3 text-right font-bold text-lg text-blue-700">
                  {formatCurrency(run.totalFees, run.currency)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {lineItems.length === 0 && (
          <div className="p-8 text-center text-stone-500">
            Нет данных для отображения
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          ⚠️ Расчёты комиссий являются расчетными и требуют проверки бухгалтерией
        </p>
      </div>
    </div>
  );
}
