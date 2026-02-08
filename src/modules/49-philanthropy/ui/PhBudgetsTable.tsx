"use client";

import { PhMoneyPill } from './PhMoneyPill';

interface PhilBudget {
  id: string;
  entityId: string;
  entityName?: string;
  year: number;
  budgetAmount: number;
  committedAmount: number;
  paidAmount: number;
  remainingAmount: number;
  currency?: string;
}

interface PhBudgetsTableProps {
  budgets: PhilBudget[];
  onRowClick?: (budget: PhilBudget) => void;
  emptyMessage?: string;
}

export function PhBudgetsTable({ budgets, onRowClick, emptyMessage = 'Нет бюджетов' }: PhBudgetsTableProps) {
  if (budgets.length === 0) {
    return (
      <div className="p-8 text-center text-stone-500">
        {emptyMessage}
      </div>
    );
  }

  const getUtilization = (budget: PhilBudget) => {
    if (budget.budgetAmount <= 0) return 0;
    return Math.round((budget.committedAmount / budget.budgetAmount) * 100);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Структура</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-stone-500 uppercase tracking-wider">Год</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Бюджет</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Committed</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Выплачено</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">Остаток</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-stone-500 uppercase tracking-wider">Использ.</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {budgets.map((budget) => {
            const utilization = getUtilization(budget);
            return (
              <tr
                key={budget.id}
                onClick={() => onRowClick?.(budget)}
                className="hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-stone-900">{budget.entityName || budget.entityId}</span>
                </td>
                <td className="px-4 py-3 text-center text-stone-600">{budget.year}</td>
                <td className="px-4 py-3 text-right">
                  <PhMoneyPill amount={budget.budgetAmount} currency={budget.currency} />
                </td>
                <td className="px-4 py-3 text-right">
                  <PhMoneyPill amount={budget.committedAmount} currency={budget.currency} variant="warning" />
                </td>
                <td className="px-4 py-3 text-right">
                  <PhMoneyPill amount={budget.paidAmount} currency={budget.currency} variant="success" />
                </td>
                <td className="px-4 py-3 text-right">
                  <PhMoneyPill amount={budget.remainingAmount} currency={budget.currency} />
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          utilization >= 100 ? 'bg-red-500' :
                          utilization >= 80 ? 'bg-amber-500' :
                          'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, utilization)}%` }}
                      />
                    </div>
                    <span className="text-xs text-stone-600">{utilization}%</span>
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
