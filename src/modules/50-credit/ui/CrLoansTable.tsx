"use client";

import { CreditLoan, CreditFacility } from '../engine/types';
import { CrStatusPill } from './CrStatusPill';

interface CrLoansTableProps {
  loans: CreditLoan[];
  facilities: CreditFacility[];
  onOpen?: (id: string) => void;
}

export function CrLoansTable({ loans, facilities, onOpen }: CrLoansTableProps) {
  const facilityMap = Object.fromEntries(facilities.map((f) => [f.id, f.name]));

  if (loans.length === 0) {
    return (
      <div className="p-8 text-center text-stone-400">
        Займы не найдены
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/50">
            <th className="text-left px-4 py-3 font-medium text-stone-600">Займ</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">Facility</th>
            <th className="text-right px-4 py-3 font-medium text-stone-600">Principal</th>
            <th className="text-right px-4 py-3 font-medium text-stone-600">Outstanding</th>
            <th className="text-right px-4 py-3 font-medium text-stone-600">Ставка</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">След. платеж</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">Maturity</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">Статус</th>
            <th className="text-center px-4 py-3 font-medium text-stone-600">Действия</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => {
            const rate = loan.currentRatePct || loan.fixedRatePct || 0;
            const isFloating = loan.rateTypeKey === 'floating';

            return (
              <tr
                key={loan.id}
                className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-800">{loan.name}</div>
                  <div className="text-xs text-stone-400">
                    {loan.amortizationTypeKey} • {loan.paymentFrequencyKey}
                  </div>
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {facilityMap[loan.facilityId] || loan.facilityId}
                </td>
                <td className="px-4 py-3 text-right text-stone-600">
                  {formatCurrency(loan.principalAmount)}
                </td>
                <td className="px-4 py-3 text-right font-medium text-stone-800">
                  {formatCurrency(loan.outstandingAmount)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="text-stone-800">{rate.toFixed(2)}%</div>
                  {isFloating && loan.baseRateKey && (
                    <div className="text-xs text-stone-400">
                      {loan.baseRateKey.toUpperCase()} + {loan.spreadPct}%
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {loan.nextPaymentAt
                    ? new Date(loan.nextPaymentAt).toLocaleDateString('ru-RU')
                    : '—'}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {new Date(loan.maturityAt).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-4 py-3">
                  <CrStatusPill status={loan.statusKey} />
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onOpen?.(loan.id)}
                    className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                  >
                    Открыть
                  </button>
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
