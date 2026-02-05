"use client";

import { MoreHorizontal, Edit, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CashFlow {
  id: string;
  flowType: 'inflow' | 'outflow';
  categoryKey: string;
  flowDate: string;
  amount: number;
  currency: string;
  description?: string;
  isConfirmed?: boolean;
  recurrenceJson?: {
    pattern: string;
  };
}

interface LqFlowsTableProps {
  flows: CashFlow[];
  flowType?: 'inflow' | 'outflow' | 'all';
  onEdit?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onMarkConfirmed?: (id: string) => void;
  compact?: boolean;
}

function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU');
}

const categoryLabels: Record<string, string> = {
  payroll: 'Зарплата',
  rent: 'Аренда',
  tax: 'Налоги',
  capital_call: 'Capital Call',
  distribution: 'Дистрибуция',
  invoice: 'Счёт',
  debt: 'Долг',
  dividend: 'Дивиденды',
  interest: 'Проценты',
  fee: 'Комиссия',
  other: 'Прочее',
};

const recurrenceLabels: Record<string, string> = {
  once: 'Однократно',
  weekly: 'Еженедельно',
  biweekly: 'Раз в 2 нед.',
  monthly: 'Ежемесячно',
  quarterly: 'Ежеквартально',
  annually: 'Ежегодно',
};

export function LqFlowsTable({
  flows,
  flowType = 'all',
  onEdit,
  onDuplicate,
  onMarkConfirmed,
  compact = false,
}: LqFlowsTableProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filteredFlows =
    flowType === 'all' ? flows : flows.filter((f) => f.flowType === flowType);

  if (filteredFlows.length === 0) {
    return (
      <div className="p-6 text-center text-stone-400">
        Нет денежных потоков. Добавьте первый поток.
      </div>
    );
  }

  // Calculate totals
  const totalInflows = filteredFlows
    .filter((f) => f.flowType === 'inflow')
    .reduce((sum, f) => sum + f.amount, 0);
  const totalOutflows = filteredFlows
    .filter((f) => f.flowType === 'outflow')
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-stone-500 uppercase tracking-wider border-b border-stone-200/50">
            <th className="px-4 py-3 font-medium">Дата</th>
            {flowType === 'all' && <th className="px-4 py-3 font-medium">Тип</th>}
            <th className="px-4 py-3 font-medium">Категория</th>
            {!compact && <th className="px-4 py-3 font-medium">Описание</th>}
            <th className="px-4 py-3 font-medium text-right">Сумма</th>
            {!compact && <th className="px-4 py-3 font-medium">Повтор</th>}
            <th className="px-4 py-3 font-medium">Подтв.</th>
            <th className="px-4 py-3 font-medium w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {filteredFlows.map((flow) => (
            <tr
              key={flow.id}
              className="hover:bg-stone-50/50 transition-colors"
            >
              <td className="px-4 py-3 text-sm text-stone-600">
                {formatDate(flow.flowDate)}
              </td>
              {flowType === 'all' && (
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                      flow.flowType === 'inflow'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {flow.flowType === 'inflow' ? 'Приток' : 'Отток'}
                  </span>
                </td>
              )}
              <td className="px-4 py-3 text-sm text-stone-600">
                {categoryLabels[flow.categoryKey] || flow.categoryKey}
              </td>
              {!compact && (
                <td className="px-4 py-3 text-sm text-stone-600 max-w-[200px] truncate">
                  {flow.description || '-'}
                </td>
              )}
              <td
                className={`px-4 py-3 text-right font-mono ${
                  flow.flowType === 'inflow' ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {flow.flowType === 'inflow' ? '+' : '-'}
                {formatCurrency(flow.amount, flow.currency)}
              </td>
              {!compact && (
                <td className="px-4 py-3 text-xs text-stone-500">
                  {flow.recurrenceJson
                    ? recurrenceLabels[flow.recurrenceJson.pattern]
                    : '-'}
                </td>
              )}
              <td className="px-4 py-3">
                {flow.isConfirmed ? (
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full">
                    <Check className="w-3 h-3" />
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center w-5 h-5 bg-stone-100 text-stone-400 rounded-full">
                    -
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === flow.id ? null : flow.id);
                    }}
                    className="p-1 hover:bg-stone-100 rounded"
                  >
                    <MoreHorizontal className="w-4 h-4 text-stone-400" />
                  </button>
                  {menuOpen === flow.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(null);
                        }}
                      />
                      <div className="absolute right-0 top-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-20 py-1 min-w-[140px]">
                        {onEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(flow.id);
                              setMenuOpen(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Редактировать
                          </button>
                        )}
                        {onDuplicate && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDuplicate(flow.id);
                              setMenuOpen(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Дублировать
                          </button>
                        )}
                        {onMarkConfirmed && !flow.isConfirmed && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkConfirmed(flow.id);
                              setMenuOpen(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Подтвердить
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        {flowType === 'all' && (
          <tfoot className="border-t-2 border-stone-200 bg-stone-50/50">
            <tr>
              <td className="px-4 py-3 font-semibold text-stone-700" colSpan={compact ? 3 : 4}>
                Итого притоки
              </td>
              <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-600">
                +{formatCurrency(totalInflows)}
              </td>
              <td colSpan={compact ? 2 : 3}></td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-semibold text-stone-700" colSpan={compact ? 3 : 4}>
                Итого оттоки
              </td>
              <td className="px-4 py-3 text-right font-mono font-semibold text-red-600">
                -{formatCurrency(totalOutflows)}
              </td>
              <td colSpan={compact ? 2 : 3}></td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-stone-800" colSpan={compact ? 3 : 4}>
                Нетто
              </td>
              <td
                className={`px-4 py-3 text-right font-mono font-bold ${
                  totalInflows - totalOutflows >= 0 ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(totalInflows - totalOutflows)}
              </td>
              <td colSpan={compact ? 2 : 3}></td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
