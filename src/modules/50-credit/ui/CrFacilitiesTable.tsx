"use client";

import { CreditFacility, CreditBank } from '../engine/types';
import { CrStatusPill } from './CrStatusPill';

interface CrFacilitiesTableProps {
  facilities: CreditFacility[];
  banks: CreditBank[];
  onOpen?: (id: string) => void;
}

const facilityTypeLabels: Record<string, string> = {
  revolver: 'Револьвер',
  term: 'Срочный',
  margin: 'Маржин',
  lombard: 'Ломбард',
  bridge: 'Бридж',
  construction: 'Строит.',
};

export function CrFacilitiesTable({ facilities, banks, onOpen }: CrFacilitiesTableProps) {
  const bankMap = Object.fromEntries(banks.map((b) => [b.id, b.name]));

  if (facilities.length === 0) {
    return (
      <div className="p-8 text-center text-stone-400">
        Facilities не найдены
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/50">
            <th className="text-left px-4 py-3 font-medium text-stone-600">Facility</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">Банк</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">Тип</th>
            <th className="text-right px-4 py-3 font-medium text-stone-600">Лимит</th>
            <th className="text-right px-4 py-3 font-medium text-stone-600">Drawn</th>
            <th className="text-right px-4 py-3 font-medium text-stone-600">Available</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">Maturity</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">Статус</th>
            <th className="text-center px-4 py-3 font-medium text-stone-600">Действия</th>
          </tr>
        </thead>
        <tbody>
          {facilities.map((facility) => {
            const daysToMaturity = Math.floor(
              (new Date(facility.maturityAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
            );
            const isMaturityClose = daysToMaturity <= 180 && daysToMaturity > 0;

            return (
              <tr
                key={facility.id}
                className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-800">{facility.name}</div>
                  <div className="text-xs text-stone-400">{facility.currency}</div>
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {bankMap[facility.bankId] || facility.bankId}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {facilityTypeLabels[facility.facilityTypeKey] || facility.facilityTypeKey}
                </td>
                <td className="px-4 py-3 text-right font-medium text-stone-800">
                  {formatCurrency(facility.limitAmount)}
                </td>
                <td className="px-4 py-3 text-right text-stone-600">
                  {formatCurrency(facility.drawnAmount)}
                </td>
                <td className="px-4 py-3 text-right text-emerald-600 font-medium">
                  {formatCurrency(facility.availableAmount)}
                </td>
                <td className="px-4 py-3">
                  <div className={isMaturityClose ? 'text-amber-600' : 'text-stone-600'}>
                    {new Date(facility.maturityAt).toLocaleDateString('ru-RU')}
                  </div>
                  {isMaturityClose && (
                    <div className="text-xs text-amber-500">{daysToMaturity}д</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <CrStatusPill status={facility.statusKey} />
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => onOpen?.(facility.id)}
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
