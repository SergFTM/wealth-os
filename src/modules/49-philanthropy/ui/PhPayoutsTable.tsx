"use client";

import { PhStatusPill } from './PhStatusPill';
import { PhMoneyPill } from './PhMoneyPill';
import { PAYOUT_METHOD_KEYS } from '../config';

interface PhilPayout {
  id: string;
  grantId: string;
  grantName?: string;
  granteeName?: string;
  amount: number;
  currency?: string;
  payoutDate: string;
  methodKey: keyof typeof PAYOUT_METHOD_KEYS;
  statusKey: string;
}

interface PhPayoutsTableProps {
  payouts: PhilPayout[];
  onRowClick?: (payout: PhilPayout) => void;
  emptyMessage?: string;
}

export function PhPayoutsTable({ payouts, onRowClick, emptyMessage = 'Нет выплат' }: PhPayoutsTableProps) {
  if (payouts.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        {emptyMessage}
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Грант / Получатель</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Сумма</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Дата</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-stone-500 uppercase tracking-wider">Метод</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-stone-500 uppercase tracking-wider">Статус</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {payouts.map((payout) => {
            const methodConfig = PAYOUT_METHOD_KEYS[payout.methodKey];
            return (
              <tr
                key={payout.id}
                onClick={() => onRowClick?.(payout)}
                className="hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div>
                    <span className="font-medium text-stone-900">{payout.granteeName || payout.grantName || payout.grantId}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <PhMoneyPill amount={payout.amount} currency={payout.currency} />
                </td>
                <td className="px-4 py-3 text-stone-600">{formatDate(payout.payoutDate)}</td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
                    {methodConfig?.ru || payout.methodKey}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <PhStatusPill status={payout.statusKey} type="payout" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
