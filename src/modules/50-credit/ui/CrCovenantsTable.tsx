"use client";

import { CreditCovenant, CreditLoan, CreditFacility } from '../engine/types';
import { CrStatusPill } from './CrStatusPill';

interface CrCovenantsTableProps {
  covenants: CreditCovenant[];
  loans: CreditLoan[];
  facilities: CreditFacility[];
  onOpen?: (id: string) => void;
  onTest?: (id: string) => void;
}

const covenantTypeLabels: Record<string, string> = {
  min_liquidity: 'Мин. ликвидность',
  max_ltv: 'Макс. LTV',
  min_net_worth: 'Мин. Net Worth',
  max_leverage: 'Макс. Leverage',
  min_ebitda: 'Мин. EBITDA',
  debt_service_coverage: 'DSCR',
  other: 'Другой',
};

const frequencyLabels: Record<string, string> = {
  monthly: 'Ежемес.',
  quarterly: 'Ежекв.',
  semi_annual: 'Полуг.',
  annual: 'Ежегодн.',
};

export function CrCovenantsTable({
  covenants,
  loans,
  facilities,
  onOpen,
  onTest,
}: CrCovenantsTableProps) {
  const loanMap = Object.fromEntries(loans.map((l) => [l.id, l.name]));
  const facilityMap = Object.fromEntries(facilities.map((f) => [f.id, f.name]));

  if (covenants.length === 0) {
    return (
      <div className="p-8 text-center text-stone-400">
        Ковенанты не найдены
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50/50">
            <th className="text-left px-4 py-3 font-medium text-stone-600">Facility/Loan</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">Ковенант</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">Тип</th>
            <th className="text-right px-4 py-3 font-medium text-stone-600">Порог</th>
            <th className="text-right px-4 py-3 font-medium text-stone-600">Текущее</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">Частота</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">След. тест</th>
            <th className="text-left px-4 py-3 font-medium text-stone-600">Статус</th>
            <th className="text-center px-4 py-3 font-medium text-stone-600">Действия</th>
          </tr>
        </thead>
        <tbody>
          {covenants.map((covenant) => {
            const linkedName =
              covenant.linkedType === 'loan'
                ? loanMap[covenant.linkedId]
                : facilityMap[covenant.linkedId];

            const isTestDue = covenant.nextTestAt && new Date(covenant.nextTestAt) <= new Date();

            return (
              <tr
                key={covenant.id}
                className="border-b border-stone-100 hover:bg-stone-50/50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="text-stone-800">{linkedName || covenant.linkedId}</div>
                  <div className="text-xs text-stone-400 capitalize">{covenant.linkedType}</div>
                </td>
                <td className="px-4 py-3 font-medium text-stone-800">{covenant.name}</td>
                <td className="px-4 py-3 text-stone-600">
                  {covenantTypeLabels[covenant.covenantTypeKey] || covenant.covenantTypeKey}
                </td>
                <td className="px-4 py-3 text-right text-stone-600">
                  {covenant.thresholdJson.operator} {covenant.thresholdJson.value}
                </td>
                <td className="px-4 py-3 text-right font-medium text-stone-800">
                  {covenant.currentValueJson?.value?.toFixed(2) ?? '—'}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {frequencyLabels[covenant.testFrequencyKey] || covenant.testFrequencyKey}
                </td>
                <td className="px-4 py-3">
                  <div className={isTestDue ? 'text-amber-600 font-medium' : 'text-stone-600'}>
                    {covenant.nextTestAt
                      ? new Date(covenant.nextTestAt).toLocaleDateString('ru-RU')
                      : '—'}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <CrStatusPill status={covenant.statusKey} />
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onTest?.(covenant.id)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Тест
                    </button>
                    <button
                      onClick={() => onOpen?.(covenant.id)}
                      className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                    >
                      Открыть
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
