"use client";

import { MoreHorizontal, Play, Archive, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { LqStatusPill } from './LqStatusPill';

interface Forecast {
  id: string;
  name: string;
  scopeType: string;
  horizonDays: number;
  status: 'active' | 'draft' | 'archived';
  updatedAt: string;
}

interface LqForecastsTableProps {
  forecasts: Forecast[];
  onOpen: (id: string) => void;
  onCompute?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU');
}

function formatHorizon(days: number): string {
  if (days <= 30) return '1 мес';
  if (days <= 90) return '3 мес';
  if (days <= 180) return '6 мес';
  if (days <= 365) return '1 год';
  return '2 года';
}

export function LqForecastsTable({
  forecasts,
  onOpen,
  onCompute,
  onArchive,
  onDelete,
  compact = false,
}: LqForecastsTableProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  if (forecasts.length === 0) {
    return (
      <div className="p-6 text-center text-stone-400">
        Нет прогнозов. Создайте первый прогноз.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-stone-500 uppercase tracking-wider border-b border-stone-200/50">
            <th className="px-4 py-3 font-medium">Название</th>
            {!compact && <th className="px-4 py-3 font-medium">Scope</th>}
            <th className="px-4 py-3 font-medium">Горизонт</th>
            <th className="px-4 py-3 font-medium">Статус</th>
            {!compact && <th className="px-4 py-3 font-medium">Обновлён</th>}
            <th className="px-4 py-3 font-medium w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {forecasts.map((forecast) => (
            <tr
              key={forecast.id}
              className="hover:bg-stone-50/50 cursor-pointer transition-colors"
              onClick={() => onOpen(forecast.id)}
            >
              <td className="px-4 py-3">
                <div className="font-medium text-stone-800">{forecast.name}</div>
              </td>
              {!compact && (
                <td className="px-4 py-3 text-sm text-stone-600 capitalize">
                  {forecast.scopeType}
                </td>
              )}
              <td className="px-4 py-3 text-sm text-stone-600">
                {formatHorizon(forecast.horizonDays)}
              </td>
              <td className="px-4 py-3">
                <LqStatusPill status={forecast.status} />
              </td>
              {!compact && (
                <td className="px-4 py-3 text-sm text-stone-500">
                  {formatDate(forecast.updatedAt)}
                </td>
              )}
              <td className="px-4 py-3">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === forecast.id ? null : forecast.id);
                    }}
                    className="p-1 hover:bg-stone-100 rounded"
                  >
                    <MoreHorizontal className="w-4 h-4 text-stone-400" />
                  </button>
                  {menuOpen === forecast.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(null);
                        }}
                      />
                      <div className="absolute right-0 top-full mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-20 py-1 min-w-[140px]">
                        {onCompute && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCompute(forecast.id);
                              setMenuOpen(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                          >
                            <Play className="w-4 h-4" />
                            Запустить расчёт
                          </button>
                        )}
                        {onArchive && forecast.status !== 'archived' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onArchive(forecast.id);
                              setMenuOpen(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                          >
                            <Archive className="w-4 h-4" />
                            Архивировать
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(forecast.id);
                              setMenuOpen(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            Удалить
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
