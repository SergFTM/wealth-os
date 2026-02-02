"use client";

import { StatusBadge } from '@/components/ui/StatusBadge';

interface Obligation {
  id: string;
  name: string;
  entityId: string;
  type: string;
  dueDate: string;
  amount: number;
  currency: string;
  frequency: string;
  status: 'scheduled' | 'paid' | 'overdue' | 'cancelled';
  paidDate: string | null;
  sourceType: string;
  sourceRef: string | null;
}

interface LqObligationDetailProps {
  obligation: Obligation;
  entityName?: string;
  onClose: () => void;
  onMarkPaid?: () => void;
  onReschedule?: () => void;
  onSendToBillPay?: () => void;
  onCreateTask?: () => void;
  onViewAudit?: () => void;
}

export function LqObligationDetail({
  obligation,
  entityName,
  onClose,
  onMarkPaid,
  onReschedule,
  onSendToBillPay,
  onCreateTask,
  onViewAudit
}: LqObligationDetailProps) {
  const formatCurrency = (val: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const typeLabels: Record<string, string> = {
    loan: 'Кредит',
    rent: 'Аренда',
    fee: 'Комиссия',
    bill: 'Счет',
    tax: 'Налоги',
    salary: 'Зарплата',
    other: 'Прочее'
  };

  const statusMap: Record<string, 'ok' | 'warning' | 'critical' | 'info'> = {
    paid: 'ok',
    scheduled: 'warning',
    overdue: 'critical',
    cancelled: 'info'
  };

  const isOverdue = obligation.status === 'overdue';
  const isPaid = obligation.status === 'paid';

  return (
    <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto">
      <div className={`sticky top-0 border-b border-stone-200 p-4 flex items-center justify-between ${
        isOverdue ? 'bg-rose-50' : 'bg-gradient-to-r from-emerald-50 to-amber-50'
      }`}>
        <h2 className="text-lg font-semibold text-stone-800">Обязательство</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/50 transition-colors"
        >
          <svg className="w-5 h-5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-stone-800">{obligation.name}</h3>
          <p className="text-stone-500">{entityName} • {typeLabels[obligation.type]}</p>
        </div>

        {/* Amount Card */}
        <div className={`p-4 rounded-xl border ${
          isOverdue ? 'bg-rose-50 border-rose-200' : 'bg-gradient-to-r from-emerald-50 to-amber-50 border-stone-200'
        }`}>
          <div className="text-sm text-stone-500 mb-1">Сумма</div>
          <div className="text-3xl font-bold text-stone-800">
            {formatCurrency(obligation.amount, obligation.currency)}
          </div>
          <div className="text-sm text-stone-500 mt-2">
            Срок: {formatDate(obligation.dueDate)}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-stone-500">Статус</span>
            <StatusBadge status={statusMap[obligation.status]} label={obligation.status} />
          </div>
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-stone-500">Частота</span>
            <span className="font-medium">{obligation.frequency}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-stone-500">Источник</span>
            <span className="text-sm">{obligation.sourceType}</span>
          </div>
          {obligation.paidDate && (
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Оплачено</span>
              <span className="text-sm text-emerald-600">{formatDate(obligation.paidDate)}</span>
            </div>
          )}
          {obligation.sourceRef && (
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Связь</span>
              <span className="text-sm text-blue-600 cursor-pointer hover:underline">{obligation.sourceRef}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4">
          {!isPaid && (
            <button
              onClick={onMarkPaid}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
            >
              Отметить оплаченным
            </button>
          )}
          {!isPaid && (
            <button
              onClick={onReschedule}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
            >
              Перенести
            </button>
          )}
          {!isPaid && (
            <button
              onClick={onSendToBillPay}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
            >
              В Bill Pay
            </button>
          )}
          <button
            onClick={onCreateTask}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
          >
            Создать задачу
          </button>
          <button
            onClick={onViewAudit}
            className="px-4 py-2 text-sm font-medium rounded-lg text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Audit trail
          </button>
        </div>
      </div>
    </div>
  );
}
