"use client";

import { CreditPayment, CreditLoan } from '../engine/types';
import { CrStatusPill } from './CrStatusPill';

export interface CrPaymentDetailProps {
  payment: CreditPayment;
  loan?: CreditLoan;
  loanName?: string;
  onBack?: () => void;
  onRecordPayment?: () => void;
  onCreateGlStub?: () => void;
  onEdit?: () => void;
  onOpenLoan?: (loanId: string) => void;
  onShowAudit?: () => void;
}

export function CrPaymentDetail({
  payment,
  loan,
  loanName,
  onBack,
  onRecordPayment,
  onCreateGlStub,
  onEdit,
  onOpenLoan,
  onShowAudit,
}: CrPaymentDetailProps) {
  const isOverdue = payment.statusKey === 'scheduled' && new Date(payment.dueAt) < new Date();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold text-stone-800">
              Платеж {new Date(payment.dueAt).toLocaleDateString('ru-RU')}
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              {(loan?.name || loanName) && (
                <span className="cursor-pointer hover:text-stone-700" onClick={() => loan && onOpenLoan?.(loan.id)}>
                  {loan?.name || loanName}
                </span>
              )}
              <span className="mx-2">•</span>
              <span>{payment.currency}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CrStatusPill status={isOverdue ? 'late' : payment.statusKey} size="md" />
          {onShowAudit && (
            <button onClick={onShowAudit} className="px-3 py-1.5 text-sm font-medium text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50">
              Аудит
            </button>
          )}
          <button
            onClick={onEdit}
            className="px-3 py-1.5 text-sm font-medium text-stone-600 border border-stone-300 rounded-lg hover:bg-stone-50"
          >
            Редактировать
          </button>
        </div>
      </div>

      {/* Overdue Alert */}
      {isOverdue && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="text-red-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-red-800">Платеж просрочен</div>
              <p className="text-sm text-red-700 mt-1">
                Срок платежа истёк {Math.floor((Date.now() - new Date(payment.dueAt).getTime()) / (24*60*60*1000))} дней назад.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Amount Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Principal</div>
          <div className="text-2xl font-bold text-stone-800 mt-1">
            {formatCurrency(payment.principalPart || 0)}
          </div>
        </div>
        <div className="bg-stone-50 rounded-xl p-4">
          <div className="text-sm text-stone-500">Interest</div>
          <div className="text-2xl font-bold text-stone-800 mt-1">
            {formatCurrency(payment.interestPart || 0)}
          </div>
        </div>
        {payment.feesPart !== undefined && payment.feesPart > 0 && (
          <div className="bg-stone-50 rounded-xl p-4">
            <div className="text-sm text-stone-500">Fees</div>
            <div className="text-2xl font-bold text-stone-800 mt-1">
              {formatCurrency(payment.feesPart)}
            </div>
          </div>
        )}
        <div className="bg-emerald-50 rounded-xl p-4">
          <div className="text-sm text-emerald-600">Всего к оплате</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {formatCurrency(payment.amount)}
          </div>
        </div>
      </div>

      {/* Actions */}
      {payment.statusKey === 'scheduled' && (
        <div className="flex gap-2">
          <button
            onClick={onRecordPayment}
            className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Записать оплату
          </button>
          <button
            onClick={onCreateGlStub}
            className="px-4 py-2 text-sm font-medium bg-white border border-stone-300 rounded-lg hover:bg-stone-50"
          >
            Создать GL stub
          </button>
        </div>
      )}

      {/* Payment Details */}
      <div className="bg-white rounded-xl border border-stone-200 p-4">
        <h3 className="font-semibold text-stone-800 mb-3">Детали платежа</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-stone-400">Дата платежа (due)</div>
            <div className="text-sm font-medium text-stone-700">
              {new Date(payment.dueAt).toLocaleDateString('ru-RU')}
            </div>
          </div>
          {payment.paidAt && (
            <div>
              <div className="text-xs text-stone-400">Дата оплаты</div>
              <div className="text-sm font-medium text-stone-700">
                {new Date(payment.paidAt).toLocaleDateString('ru-RU')}
              </div>
            </div>
          )}
          {payment.paidAmount !== undefined && (
            <div>
              <div className="text-xs text-stone-400">Сумма оплачена</div>
              <div className="text-sm font-medium text-stone-700">
                {formatCurrency(payment.paidAmount)}
              </div>
            </div>
          )}
          {payment.linkedGlStubId && (
            <div>
              <div className="text-xs text-stone-400">GL Stub</div>
              <div className="text-sm font-medium text-emerald-600">
                {payment.linkedGlStubId}
              </div>
            </div>
          )}
          {payment.linkedCalendarEventId && (
            <div>
              <div className="text-xs text-stone-400">Calendar Event</div>
              <div className="text-sm font-medium text-blue-600">
                {payment.linkedCalendarEventId}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {payment.notes && (
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <h3 className="font-semibold text-stone-800 mb-2">Заметки</h3>
          <p className="text-sm text-stone-600 whitespace-pre-wrap">{payment.notes}</p>
        </div>
      )}
    </div>
  );
}

function formatCurrency(amount: number): string {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(0)}K`;
  return `$${amount.toFixed(0)}`;
}
