"use client";

import { PhStatusPill } from './PhStatusPill';
import { PhMoneyPill } from './PhMoneyPill';
import { PAYOUT_METHOD_KEYS } from '../config';

interface PhilPayout {
  id: string;
  clientId: string;
  grantId: string;
  grantName?: string;
  granteeName?: string;
  entityId?: string;
  entityName?: string;
  amount: number;
  currency?: string;
  payoutDate: string;
  methodKey: keyof typeof PAYOUT_METHOD_KEYS;
  statusKey: 'scheduled' | 'sent' | 'confirmed';
  linkedPaymentId?: string;
  checkNumber?: string;
  referenceNo?: string;
  approvalsIdsJson?: string[];
  notes?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface PhPayoutDetailProps {
  payout: PhilPayout;
  onMarkSent?: () => void;
  onMarkConfirmed?: () => void;
  onEdit?: () => void;
  onViewPayment?: () => void;
}

export function PhPayoutDetail({
  payout,
  onMarkSent,
  onMarkConfirmed,
  onEdit,
  onViewPayment,
}: PhPayoutDetailProps) {
  const methodConfig = PAYOUT_METHOD_KEYS[payout.methodKey];

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <PhStatusPill status={payout.statusKey} type="payout" size="md" />
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
                {methodConfig?.ru || payout.methodKey}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900">
              Выплата {formatCurrency(payout.amount, payout.currency)}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
              {payout.granteeName && <span>Получатель: {payout.granteeName}</span>}
              {payout.entityName && <span>Структура: {payout.entityName}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {payout.statusKey === 'scheduled' && onMarkSent && (
              <button
                onClick={onMarkSent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Отметить отправлено
              </button>
            )}
            {payout.statusKey === 'sent' && onMarkConfirmed && (
              <button
                onClick={onMarkConfirmed}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                Подтвердить получение
              </button>
            )}
            {onEdit && payout.statusKey === 'scheduled' && (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-white border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 transition-colors text-sm font-medium"
              >
                Редактировать
              </button>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-stone-50 rounded-lg p-4">
            <div className="text-xs text-stone-500 uppercase tracking-wider">Сумма</div>
            <div className="text-xl font-semibold text-stone-900 mt-1">
              {formatCurrency(payout.amount, payout.currency)}
            </div>
          </div>
          <div className="bg-stone-50 rounded-lg p-4">
            <div className="text-xs text-stone-500 uppercase tracking-wider">Дата</div>
            <div className="text-lg font-medium text-stone-700 mt-1">{formatDate(payout.payoutDate)}</div>
          </div>
          <div className="bg-stone-50 rounded-lg p-4">
            <div className="text-xs text-stone-500 uppercase tracking-wider">Метод</div>
            <div className="text-lg font-medium text-stone-700 mt-1">{methodConfig?.ru || payout.methodKey}</div>
          </div>
          {payout.confirmedAt && (
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-xs text-green-600 uppercase tracking-wider">Подтверждено</div>
              <div className="text-lg font-medium text-green-700 mt-1">{formatDate(payout.confirmedAt)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Payment details */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <h2 className="font-semibold text-stone-800 mb-4">Детали платежа</h2>
        <div className="space-y-3">
          {payout.checkNumber && (
            <div className="flex items-center justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Номер чека</span>
              <code className="font-mono bg-stone-100 px-2 py-0.5 rounded">{payout.checkNumber}</code>
            </div>
          )}
          {payout.referenceNo && (
            <div className="flex items-center justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Reference</span>
              <code className="font-mono bg-stone-100 px-2 py-0.5 rounded">{payout.referenceNo}</code>
            </div>
          )}
          {payout.linkedPaymentId && (
            <div className="flex items-center justify-between py-2 border-b border-stone-100">
              <span className="text-stone-500">Bill Pay ID</span>
              <button
                onClick={onViewPayment}
                className="text-emerald-600 hover:underline font-mono"
              >
                {payout.linkedPaymentId}
              </button>
            </div>
          )}
          <div className="flex items-center justify-between py-2 border-b border-stone-100">
            <span className="text-stone-500">Грант</span>
            <a
              href={`/m/philanthropy/grant/${payout.grantId}`}
              className="text-emerald-600 hover:underline"
            >
              {payout.grantName || payout.grantId}
            </a>
          </div>
        </div>
      </div>

      {/* Notes */}
      {payout.notes && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Примечания</h2>
          <p className="text-stone-700">{payout.notes}</p>
        </div>
      )}

      {/* Approvals */}
      {payout.approvalsIdsJson && payout.approvalsIdsJson.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
          <h2 className="font-semibold text-stone-800 mb-4">Согласования</h2>
          <div className="text-stone-600">
            {payout.approvalsIdsJson.length} согласований связано
          </div>
        </div>
      )}
    </div>
  );
}
