"use client";

import { MoreHorizontal, Eye } from 'lucide-react';
import { useState } from 'react';

interface CashStressTest {
  id: string;
  name: string;
  stressType: string;
  paramsJson?: {
    severity?: string;
  };
  resultsJson?: {
    minCashReached?: number;
    breachesCount?: number;
  };
  runAt?: string;
}

interface LqStressTestsTableProps {
  tests: CashStressTest[];
  onOpen: (id: string) => void;
  compact?: boolean;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU');
}

const stressTypeLabels: Record<string, string> = {
  market_drawdown: 'Рыночный спад',
  delayed_distributions: 'Задержка дистрибуций',
  tax_spike: 'Скачок налогов',
  debt_rate_shock: 'Шок ставок',
  capital_call_acceleration: 'Ускорение capital calls',
};

const severityLabels: Record<string, { label: string; className: string }> = {
  mild: { label: 'Мягкий', className: 'bg-green-100 text-green-700' },
  moderate: { label: 'Умеренный', className: 'bg-amber-100 text-amber-700' },
  severe: { label: 'Жёсткий', className: 'bg-red-100 text-red-700' },
};

export function LqStressTestsTable({
  tests,
  onOpen,
  compact = false,
}: LqStressTestsTableProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  if (tests.length === 0) {
    return (
      <div className="p-6 text-center text-stone-400">
        Нет стресс-тестов. Запустите первый тест.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-stone-500 uppercase tracking-wider border-b border-stone-200/50">
            <th className="px-4 py-3 font-medium">Название</th>
            <th className="px-4 py-3 font-medium">Тип</th>
            {!compact && <th className="px-4 py-3 font-medium">Severity</th>}
            <th className="px-4 py-3 font-medium text-right">Min Cash</th>
            <th className="px-4 py-3 font-medium text-right">Breaches</th>
            {!compact && <th className="px-4 py-3 font-medium">Дата</th>}
            <th className="px-4 py-3 font-medium w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {tests.map((test) => {
            const severity = test.paramsJson?.severity || 'moderate';
            const minCash = test.resultsJson?.minCashReached ?? 0;
            const breaches = test.resultsJson?.breachesCount ?? 0;

            return (
              <tr
                key={test.id}
                className="hover:bg-stone-50/50 cursor-pointer transition-colors"
                onClick={() => onOpen(test.id)}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-800">{test.name}</div>
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  {stressTypeLabels[test.stressType] || test.stressType}
                </td>
                {!compact && (
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                        severityLabels[severity]?.className || 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {severityLabels[severity]?.label || severity}
                    </span>
                  </td>
                )}
                <td
                  className={`px-4 py-3 text-right font-mono ${
                    minCash < 0 ? 'text-red-600' : 'text-stone-700'
                  }`}
                >
                  {formatCurrency(minCash)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={`inline-flex items-center justify-center min-w-[24px] px-1.5 py-0.5 text-xs font-medium rounded-full ${
                      breaches > 0
                        ? 'bg-red-100 text-red-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {breaches}
                  </span>
                </td>
                {!compact && (
                  <td className="px-4 py-3 text-sm text-stone-500">
                    {test.runAt ? formatDate(test.runAt) : '-'}
                  </td>
                )}
                <td className="px-4 py-3">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === test.id ? null : test.id);
                      }}
                      className="p-1 hover:bg-stone-100 rounded"
                    >
                      <MoreHorizontal className="w-4 h-4 text-stone-400" />
                    </button>
                    {menuOpen === test.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(null);
                          }}
                        />
                        <div className="absolute right-0 top-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-20 py-1 min-w-[140px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpen(test.id);
                              setMenuOpen(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Подробнее
                          </button>
                        </div>
                      </>
                    )}
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
