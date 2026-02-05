"use client";

import {
  FileText,
  Calendar,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Settings,
  History,
  Link2
} from 'lucide-react';

interface FeeContract {
  id: string;
  clientId: string;
  householdId: string;
  name: string;
  scheduleId: string;
  billingFrequency: 'monthly' | 'quarterly';
  startDate: string;
  endDate: string | null;
  status: 'active' | 'inactive';
  nextBillingDate: string;
  docIds: string[];
}

interface FeeSchedule {
  id: string;
  name: string;
  type: 'aum' | 'fixed' | 'performance';
  ratePct: number | null;
  fixedAmount: number | null;
  tiersJson: string | null;
  minFee: number | null;
  currency: string;
}

interface FeContractDetailProps {
  contract: FeeContract;
  schedule?: FeeSchedule;
  clientName?: string;
  householdName?: string;
  recentRuns?: Array<{ id: string; periodEnd: string; totalFees: number; status: string }>;
  recentInvoices?: Array<{ id: string; invoiceNumber: string; netAmount: number; status: string }>;
  onRunFees?: () => void;
  onEditSchedule?: () => void;
  onDeactivate?: () => void;
  onViewDocument?: (docId: string) => void;
}

const statusConfig = {
  active: { label: 'Активен', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircle },
  inactive: { label: 'Неактивен', color: 'text-stone-500', bg: 'bg-stone-100', Icon: XCircle },
};

const frequencyLabels = {
  monthly: 'Ежемесячно',
  quarterly: 'Ежеквартально',
};

const typeLabels = {
  aum: 'AUM (% от активов)',
  fixed: 'Фиксированная',
  performance: 'Performance Fee',
};

export function FeContractDetail({
  contract,
  schedule,
  clientName,
  householdName,
  recentRuns = [],
  recentInvoices = [],
  onRunFees,
  onEditSchedule,
  onDeactivate,
  onViewDocument,
}: FeContractDetailProps) {
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

  const status = statusConfig[contract.status];
  const StatusIcon = status.Icon;

  let tiers: Array<{ minAum: number; maxAum: number | null; ratePct: number }> = [];
  if (schedule?.tiersJson) {
    try {
      tiers = JSON.parse(schedule.tiersJson);
    } catch {
      tiers = [];
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-stone-800 mb-1">
              {contract.name}
            </h2>
            <div className="flex items-center gap-4 text-stone-600">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{clientName || contract.clientId}</span>
              </div>
              {householdName && (
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  <span>{householdName}</span>
                </div>
              )}
            </div>
          </div>
          <span className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl ${status.bg} ${status.color}`}>
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </span>
        </div>

        {/* Key info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500 mb-1">Частота биллинга</div>
            <div className="font-medium text-stone-800">{frequencyLabels[contract.billingFrequency]}</div>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500 mb-1">Дата начала</div>
            <div className="font-medium text-stone-800">{formatDate(contract.startDate)}</div>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500 mb-1">Дата окончания</div>
            <div className="font-medium text-stone-800">
              {contract.endDate ? formatDate(contract.endDate) : 'Бессрочный'}
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl">
            <div className="text-xs text-blue-600 mb-1">Следующий счёт</div>
            <div className="font-medium text-blue-700">{formatDate(contract.nextBillingDate)}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {contract.status === 'active' && (
            <button
              onClick={onRunFees}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              <Play className="w-4 h-4" />
              Расчёт комиссии
            </button>
          )}
          <button
            onClick={onEditSchedule}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl transition-colors"
          >
            <Settings className="w-4 h-4" />
            Изменить тариф
          </button>
          {contract.status === 'active' && (
            <button
              onClick={onDeactivate}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Деактивировать
            </button>
          )}
        </div>
      </div>

      {/* Fee Schedule Info */}
      {schedule && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h3 className="font-semibold text-stone-800 mb-4">Тарифный план</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-xs text-stone-500 mb-1">Название</div>
              <div className="font-medium text-stone-800">{schedule.name}</div>
            </div>
            <div>
              <div className="text-xs text-stone-500 mb-1">Тип</div>
              <div className="font-medium text-stone-800">{typeLabels[schedule.type]}</div>
            </div>
            <div>
              <div className="text-xs text-stone-500 mb-1">
                {schedule.type === 'fixed' ? 'Сумма' : 'Ставка'}
              </div>
              <div className="font-medium text-stone-800">
                {schedule.type === 'fixed' && schedule.fixedAmount
                  ? formatCurrency(schedule.fixedAmount, schedule.currency)
                  : schedule.ratePct !== null
                  ? `${schedule.ratePct}%`
                  : '—'}
              </div>
            </div>
          </div>

          {/* Tiers */}
          {tiers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-stone-200">
              <div className="text-sm font-medium text-stone-700 mb-2">Прогрессивная шкала:</div>
              <div className="space-y-1">
                {tiers.map((tier, index) => (
                  <div key={index} className="flex items-center gap-4 text-sm">
                    <span className="text-stone-500 w-48">
                      {formatCurrency(tier.minAum, schedule.currency)} — {tier.maxAum ? formatCurrency(tier.maxAum, schedule.currency) : '∞'}
                    </span>
                    <span className="font-medium text-stone-800">{tier.ratePct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {schedule.minFee && (
            <div className="mt-4 pt-4 border-t border-stone-200">
              <div className="text-sm">
                <span className="text-stone-500">Минимальная комиссия:</span>{' '}
                <span className="font-medium text-stone-800">
                  {formatCurrency(schedule.minFee, schedule.currency)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Runs */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-stone-400" />
            <h3 className="font-semibold text-stone-800">Последние расчёты</h3>
          </div>
          {recentRuns.length > 0 ? (
            <div className="space-y-2">
              {recentRuns.slice(0, 5).map((run) => (
                <div key={run.id} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                  <span className="text-stone-600">{formatDate(run.periodEnd)}</span>
                  <span className="font-medium text-stone-800">{formatCurrency(run.totalFees, schedule?.currency || 'USD')}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-500 text-sm">Нет расчётов</p>
          )}
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-stone-400" />
            <h3 className="font-semibold text-stone-800">Последние счета</h3>
          </div>
          {recentInvoices.length > 0 ? (
            <div className="space-y-2">
              {recentInvoices.slice(0, 5).map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                  <span className="text-blue-600 font-medium">{inv.invoiceNumber}</span>
                  <span className="font-medium text-stone-800">{formatCurrency(inv.netAmount, schedule?.currency || 'USD')}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-500 text-sm">Нет счетов</p>
          )}
        </div>
      </div>

      {/* Linked Documents */}
      {contract.docIds.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h3 className="font-semibold text-stone-800 mb-4">Связанные документы</h3>
          <div className="flex flex-wrap gap-2">
            {contract.docIds.map((docId) => (
              <button
                key={docId}
                onClick={() => onViewDocument?.(docId)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <FileText className="w-4 h-4" />
                {docId}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
