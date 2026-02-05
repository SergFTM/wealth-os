"use client";

import { MoreHorizontal, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface CashPosition {
  id: string;
  accountName: string;
  entityName?: string;
  currency: string;
  balance: number;
  asOf: string;
  sourceType?: string;
}

interface LqCashPositionsTableProps {
  positions: CashPosition[];
  onOpen: (id: string) => void;
  onRefresh?: (id: string) => void;
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

const sourceLabels: Record<string, string> = {
  manual: 'Ручной',
  custodian: 'Кастодиан',
  bank: 'Банк',
  gl: 'GL',
};

export function LqCashPositionsTable({
  positions,
  onOpen,
  onRefresh,
  compact = false,
}: LqCashPositionsTableProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  if (positions.length === 0) {
    return (
      <div className="p-6 text-center text-stone-400">
        Нет позиций. Добавьте cash позиции.
      </div>
    );
  }

  // Calculate total by currency
  const totals = positions.reduce((acc, pos) => {
    acc[pos.currency] = (acc[pos.currency] || 0) + pos.balance;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-stone-500 uppercase tracking-wider border-b border-stone-200/50">
            <th className="px-4 py-3 font-medium">Счёт</th>
            {!compact && <th className="px-4 py-3 font-medium">Entity</th>}
            <th className="px-4 py-3 font-medium">Валюта</th>
            <th className="px-4 py-3 font-medium text-right">Баланс</th>
            {!compact && <th className="px-4 py-3 font-medium">На дату</th>}
            {!compact && <th className="px-4 py-3 font-medium">Источник</th>}
            <th className="px-4 py-3 font-medium w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {positions.map((position) => (
            <tr
              key={position.id}
              className="hover:bg-stone-50/50 cursor-pointer transition-colors"
              onClick={() => onOpen(position.id)}
            >
              <td className="px-4 py-3">
                <div className="font-medium text-stone-800">{position.accountName}</div>
              </td>
              {!compact && (
                <td className="px-4 py-3 text-sm text-stone-600">
                  {position.entityName || '-'}
                </td>
              )}
              <td className="px-4 py-3">
                <span className="text-xs font-mono bg-stone-100 px-1.5 py-0.5 rounded">
                  {position.currency}
                </span>
              </td>
              <td className="px-4 py-3 text-right font-mono text-stone-800">
                {formatCurrency(position.balance, position.currency)}
              </td>
              {!compact && (
                <td className="px-4 py-3 text-sm text-stone-500">
                  {formatDate(position.asOf)}
                </td>
              )}
              {!compact && (
                <td className="px-4 py-3 text-sm text-stone-500">
                  {sourceLabels[position.sourceType || 'manual']}
                </td>
              )}
              <td className="px-4 py-3">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === position.id ? null : position.id);
                    }}
                    className="p-1 hover:bg-stone-100 rounded"
                  >
                    <MoreHorizontal className="w-4 h-4 text-stone-400" />
                  </button>
                  {menuOpen === position.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(null);
                        }}
                      />
                      <div className="absolute right-0 top-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-20 py-1 min-w-[140px]">
                        {onRefresh && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRefresh(position.id);
                              setMenuOpen(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Обновить
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
        <tfoot className="border-t-2 border-stone-200 bg-stone-50/50">
          {Object.entries(totals).map(([currency, total]) => (
            <tr key={currency}>
              <td className="px-4 py-3 font-semibold text-stone-700" colSpan={compact ? 2 : 3}>
                Итого ({currency})
              </td>
              <td className="px-4 py-3 text-right font-mono font-semibold text-stone-800">
                {formatCurrency(total, currency)}
              </td>
              <td colSpan={compact ? 1 : 3}></td>
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
}
