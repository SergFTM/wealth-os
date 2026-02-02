"use client";

import { StatusBadge } from '@/components/ui/StatusBadge';

interface CashAccount {
  id: string;
  name: string;
  bank: string;
  currency: string;
  balance: number;
  baseBalance: number;
  threshold: number;
  status: 'ok' | 'warning' | 'critical';
  lastSyncAt: string;
  sourceType: string;
}

interface LqAccountDetailProps {
  account: CashAccount;
  entityName?: string;
  onClose: () => void;
  onEdit?: () => void;
  onCreateTransfer?: () => void;
  onCreateTask?: () => void;
  onViewAudit?: () => void;
}

export function LqAccountDetail({
  account,
  entityName,
  onClose,
  onEdit,
  onCreateTransfer,
  onCreateTask,
  onViewAudit
}: LqAccountDetailProps) {
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 overflow-y-auto">
      <div className="sticky top-0 bg-gradient-to-r from-emerald-50 to-amber-50 border-b border-stone-200 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-800">Счет</h2>
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
          <h3 className="text-xl font-bold text-stone-800">{account.name}</h3>
          <p className="text-stone-500">{entityName} • {account.bank}</p>
        </div>

        {/* Balance Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-amber-50 border border-stone-200">
          <div className="text-sm text-stone-500 mb-1">Баланс</div>
          <div className="text-3xl font-bold text-stone-800">
            {formatCurrency(account.balance, account.currency)}
          </div>
          <div className="text-sm text-stone-500 mt-1">
            ≈ {formatCurrency(account.baseBalance, 'USD')}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-stone-500">Порог</span>
            <span className="font-medium">{formatCurrency(account.threshold, account.currency)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-stone-500">Статус</span>
            <StatusBadge status={account.status} />
          </div>
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-stone-500">Последняя синхронизация</span>
            <span className="text-sm">{formatDate(account.lastSyncAt)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-stone-500">Источник</span>
            <span className="text-sm">{account.sourceType}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4">
          <button
            onClick={onCreateTransfer}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
          >
            Перевести средства
          </button>
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
          >
            Редактировать
          </button>
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
