"use client";

import { CreditBank } from '../engine/types';

interface CrBanksTableProps {
  banks: CreditBank[];
  facilityCounts: Record<string, number>;
  exposures: Record<string, number>;
  onOpen?: (id: string) => void;
}

const regionLabels: Record<string, string> = {
  us: 'США',
  eu: 'Европа',
  uk: 'UK',
  ch: 'Швейцария',
  sg: 'Сингапур',
  other: 'Другой',
};

export function CrBanksTable({ banks, facilityCounts, exposures, onOpen }: CrBanksTableProps) {
  if (banks.length === 0) {
    return (
      <div className="p-8 text-center text-stone-400">
        Банки не найдены
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/50">
            <th className="text-left px-4 py-3 font-medium text-stone-600">Банк</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">Регион</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">RM</th>
            <th className="text-right px-4 py-3 font-medium text-stone-600">Facilities</th>
            <th className="text-right px-4 py-3 font-medium text-stone-600">Exposure</th>
            <th className="text-center px-4 py-3 font-medium text-stone-600">Действия</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((bank) => (
            <tr
              key={bank.id}
              className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors"
            >
              <td className="px-4 py-3">
                <div className="font-medium text-stone-800">{bank.name}</div>
                {bank.swiftCode && (
                  <div className="text-xs text-stone-400">{bank.swiftCode}</div>
                )}
              </td>
              <td className="px-4 py-3 text-stone-600">
                {regionLabels[bank.regionKey] || bank.regionKey}
              </td>
              <td className="px-4 py-3 text-stone-600">
                {bank.contactsJson?.relationshipManager || '—'}
              </td>
              <td className="px-4 py-3 text-right text-stone-600">
                {facilityCounts[bank.id] || 0}
              </td>
              <td className="px-4 py-3 text-right font-medium text-stone-800">
                {formatCurrency(exposures[bank.id] || 0)}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onOpen?.(bank.id)}
                  className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                >
                  Открыть
                </button>
              </td>
            </tr>
          ))}
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
