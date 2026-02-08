"use client";

import { CreditPayment, CreditLoan } from '../engine/types';
import { CrStatusPill } from './CrStatusPill';

interface CrPaymentsTableProps {
  payments: CreditPayment[];
  loans: CreditLoan[];
  onOpen?: (id: string) => void;
  onRecordPayment?: (id: string) => void;
}

export function CrPaymentsTable({ payments, loans, onOpen, onRecordPayment }: CrPaymentsTableProps) {
  const loanMap = Object.fromEntries(loans.map((l) => [l.id, l.name]));

  if (payments.length === 0) {
    return (
      <div className="p-8 text-center text-stone-400">
        Платежи не найдены
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/50">
            <th className="text-left px-4 py-3 font-medium text-stone-600">Loan</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">Дата</th>
            <th className="text-right px-4 py-3 font-medium text-stone-600">Principal</th>
            <th className="text-right px-4 py-3 font-medium text-stone-600">Interest</th>
            <th className="text-right px-4 py-3 font-medium text-stone-600">Всего</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">Статус</th>
            <th className="text-center px-4 py-3 font-medium text-stone-600">Действия</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => {
            const isOverdue = payment.statusKey === 'scheduled' &&
              new Date(payment.dueAt) < new Date();

            return (
              <tr
                key={payment.id}
                className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-800">
                    {loanMap[payment.loanId] || payment.loanId}
                  </div>
                  <div className="text-xs text-stone-400">{payment.currency}</div>
                </td>
                <td className="px-4 py-3">
                  <div className={isOverdue ? 'text-red-600 font-medium' : 'text-stone-800'}>
                    {new Date(payment.dueAt).toLocaleDateString('ru-RU')}
                  </div>
                  {payment.paidAt && (
                    <div className="text-xs text-stone-400">
                      Оплачен: {new Date(payment.paidAt).toLocaleDateString('ru-RU')}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-stone-600">
                  {formatCurrency(payment.principalPart || 0)}
                </td>
                <td className="px-4 py-3 text-right text-stone-600">
                  {formatCurrency(payment.interestPart || 0)}
                </td>
                <td className="px-4 py-3 text-right font-medium text-stone-800">
                  {formatCurrency(payment.amount)}
                </td>
                <td className="px-4 py-3">
                  <CrStatusPill status={isOverdue ? 'late' : payment.statusKey} />
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {payment.statusKey === 'scheduled' && (
                      <button
                        onClick={() => onRecordPayment?.(payment.id)}
                        className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                      >
                        Оплатить
                      </button>
                    )}
                    <button
                      onClick={() => onOpen?.(payment.id)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Детали
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatCurrency(amount: number): string {
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
  if (amount >= 1e3) return `$${(amount / 1e3).toFixed(0)}K`;
  return `$${amount.toFixed(0)}`;
}
