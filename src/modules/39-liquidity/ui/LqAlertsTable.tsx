"use client";

import { MoreHorizontal, Eye, CheckCircle, X, ListTodo } from 'lucide-react';
import { useState } from 'react';
import { LqSeverityPill } from './LqSeverityPill';
import { LqStatusPill } from './LqStatusPill';

interface LiquidityAlert {
  id: string;
  title?: string;
  forecastId: string;
  deficitDate: string;
  shortfallAmount: number;
  currency: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'open' | 'acknowledged' | 'closed';
  suggestedActionsJson?: Array<{
    action: string;
    description: string;
    priority: string;
  }>;
}

interface LqAlertsTableProps {
  alerts: LiquidityAlert[];
  onOpen: (id: string) => void;
  onAcknowledge?: (id: string) => void;
  onClose?: (id: string) => void;
  onCreateTask?: (id: string) => void;
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

export function LqAlertsTable({
  alerts,
  onOpen,
  onAcknowledge,
  onClose,
  onCreateTask,
  compact = false,
}: LqAlertsTableProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  if (alerts.length === 0) {
    return (
      <div className="p-6 text-center text-stone-400">
        Нет алертов. Система работает в норме.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-stone-500 uppercase tracking-wider border-b border-stone-200/50">
            <th className="px-4 py-3 font-medium">Severity</th>
            {!compact && <th className="px-4 py-3 font-medium">Заголовок</th>}
            <th className="px-4 py-3 font-medium">Дата дефицита</th>
            <th className="px-4 py-3 font-medium text-right">Недостаток</th>
            <th className="px-4 py-3 font-medium">Статус</th>
            <th className="px-4 py-3 font-medium w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {alerts.map((alert) => (
            <tr
              key={alert.id}
              className="hover:bg-stone-50/50 cursor-pointer transition-colors"
              onClick={() => onOpen(alert.id)}
            >
              <td className="px-4 py-3">
                <LqSeverityPill severity={alert.severity} />
              </td>
              {!compact && (
                <td className="px-4 py-3 text-sm text-stone-700 max-w-[250px] truncate">
                  {alert.title || `Дефицит на ${formatDate(alert.deficitDate)}`}
                </td>
              )}
              <td className="px-4 py-3 text-sm text-stone-600">
                {formatDate(alert.deficitDate)}
              </td>
              <td
                className={`px-4 py-3 text-right font-mono ${
                  alert.shortfallAmount > 0 ? 'text-red-600' : 'text-stone-600'
                }`}
              >
                {alert.shortfallAmount > 0
                  ? formatCurrency(alert.shortfallAmount, alert.currency)
                  : '-'}
              </td>
              <td className="px-4 py-3">
                <LqStatusPill status={alert.status} />
              </td>
              <td className="px-4 py-3">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === alert.id ? null : alert.id);
                    }}
                    className="p-1 hover:bg-stone-100 rounded"
                  >
                    <MoreHorizontal className="w-4 h-4 text-stone-400" />
                  </button>
                  {menuOpen === alert.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(null);
                        }}
                      />
                      <div className="absolute right-0 top-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-20 py-1 min-w-[160px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpen(alert.id);
                            setMenuOpen(null);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Подробнее
                        </button>
                        {onAcknowledge && alert.status === 'open' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAcknowledge(alert.id);
                              setMenuOpen(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Подтвердить
                          </button>
                        )}
                        {onCreateTask && alert.status !== 'closed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCreateTask(alert.id);
                              setMenuOpen(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                          >
                            <ListTodo className="w-4 h-4" />
                            Создать задачу
                          </button>
                        )}
                        {onClose && alert.status !== 'closed' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onClose(alert.id);
                              setMenuOpen(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Закрыть
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
      </table>
    </div>
  );
}
