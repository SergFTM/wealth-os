"use client";

import { CreditCollateral, CreditLoan, CreditFacility } from '../engine/types';
import { CrStatusPill } from './CrStatusPill';

interface CrCollateralTableProps {
  collaterals: CreditCollateral[];
  loans: CreditLoan[];
  facilities: CreditFacility[];
  onOpen?: (id: string) => void;
}

const collateralTypeLabels: Record<string, string> = {
  cash: 'Деньги',
  securities: 'ЦБ',
  real_estate: 'Недвижимость',
  equipment: 'Оборудование',
  inventory: 'Запасы',
  receivables: 'Дебиторка',
  other: 'Другое',
};

export function CrCollateralTable({ collaterals, loans, facilities, onOpen }: CrCollateralTableProps) {
  const loanMap = Object.fromEntries(loans.map((l) => [l.id, l.name]));
  const facilityMap = Object.fromEntries(facilities.map((f) => [f.id, f.name]));

  if (collaterals.length === 0) {
    return (
      <div className="p-8 text-center text-stone-400">
        Залоги не найдены
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/50">
            <th className="text-left px-4 py-3 font-medium text-stone-600">Loan/Facility</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">Тип</th>
            <th className="text-right px-4 py-3 font-medium text-stone-600">Value</th>
            <th className="text-right px-4 py-3 font-medium text-stone-600">Haircut</th>
            <th className="text-right px-4 py-3 font-medium text-stone-600">Pledged</th>
            <th className="text-right px-4 py-3 font-medium text-stone-600">LTV</th>
            <th className="text-right px-4 py-3 font-medium text-stone-600">Target</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">Статус</th>
            <th className="text-center px-4 py-3 font-medium text-stone-600">Действия</th>
          </tr>
        </thead>
        <tbody>
          {collaterals.map((col) => {
            const linkedName =
              col.linkedType === 'loan'
                ? loanMap[col.linkedId]
                : facilityMap[col.linkedId];

            const ltvDiff = col.currentLtvPct - col.targetLtvPct;
            const isOverTarget = ltvDiff > 0;

            return (
              <tr
                key={col.id}
                className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-800">
                    {linkedName || col.linkedId}
                  </div>
                  <div className="text-xs text-stone-400 capitalize">{col.linkedType}</div>
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {collateralTypeLabels[col.collateralTypeKey] || col.collateralTypeKey}
                </td>
                <td className="px-4 py-3 text-right text-stone-600">
                  {formatCurrency(col.currentValue)}
                </td>
                <td className="px-4 py-3 text-right text-stone-600">{col.haircutPct}%</td>
                <td className="px-4 py-3 text-right font-medium text-stone-800">
                  {formatCurrency(col.pledgedValue)}
                </td>
                <td
                  className={`px-4 py-3 text-right font-medium ${
                    isOverTarget ? 'text-red-600' : 'text-stone-800'
                  }`}
                >
                  {col.currentLtvPct.toFixed(1)}%
                </td>
                <td className="px-4 py-3 text-right text-stone-500">
                  {col.targetLtvPct}%
                </td>
                <td className="px-4 py-3">
                  <CrStatusPill status={col.statusKey} />
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onOpen?.(col.id)}
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
