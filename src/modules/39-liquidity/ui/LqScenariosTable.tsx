"use client";

import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface CashScenario {
  id: string;
  name: string;
  scenarioType: 'base' | 'conservative' | 'aggressive' | 'custom';
  adjustmentsJson?: {
    inflowHaircut?: number;
    outflowIncrease?: number;
    distributionDelayDays?: number;
    capitalCallShiftDays?: number;
  };
  isDefault?: boolean;
  updatedAt: string;
}

interface LqScenariosTableProps {
  scenarios: CashScenario[];
  onOpen: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU');
}

const typeLabels: Record<string, { label: string; className: string }> = {
  base: { label: 'Базовый', className: 'bg-blue-100 text-blue-700' },
  conservative: { label: 'Консервативный', className: 'bg-amber-100 text-amber-700' },
  aggressive: { label: 'Агрессивный', className: 'bg-red-100 text-red-700' },
  custom: { label: 'Пользовательский', className: 'bg-purple-100 text-purple-700' },
};

function getAdjustmentsSummary(adj?: CashScenario['adjustmentsJson']): string {
  if (!adj) return 'Без корректировок';

  const parts: string[] = [];
  if (adj.inflowHaircut) parts.push(`Притоки: ${adj.inflowHaircut > 0 ? '-' : '+'}${Math.abs(adj.inflowHaircut)}%`);
  if (adj.outflowIncrease) parts.push(`Оттоки: ${adj.outflowIncrease > 0 ? '+' : ''}${adj.outflowIncrease}%`);
  if (adj.distributionDelayDays) parts.push(`Задержка: ${adj.distributionDelayDays}д`);

  return parts.length > 0 ? parts.join(', ') : 'Без корректировок';
}

export function LqScenariosTable({
  scenarios,
  onOpen,
  onEdit,
  onDelete,
  compact = false,
}: LqScenariosTableProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  if (scenarios.length === 0) {
    return (
      <div className="p-6 text-center text-stone-400">
        Нет сценариев. Создайте первый сценарий.
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
            {!compact && <th className="px-4 py-3 font-medium">Корректировки</th>}
            {!compact && <th className="px-4 py-3 font-medium">Обновлён</th>}
            <th className="px-4 py-3 font-medium w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {scenarios.map((scenario) => (
            <tr
              key={scenario.id}
              className="hover:bg-stone-50/50 cursor-pointer transition-colors"
              onClick={() => onOpen(scenario.id)}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-stone-800">{scenario.name}</div>
                  {scenario.isDefault && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">
                      По умолчанию
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                    typeLabels[scenario.scenarioType].className
                  }`}
                >
                  {typeLabels[scenario.scenarioType].label}
                </span>
              </td>
              {!compact && (
                <td className="px-4 py-3 text-sm text-stone-600 max-w-[200px] truncate">
                  {getAdjustmentsSummary(scenario.adjustmentsJson)}
                </td>
              )}
              {!compact && (
                <td className="px-4 py-3 text-sm text-stone-500">
                  {formatDate(scenario.updatedAt)}
                </td>
              )}
              <td className="px-4 py-3">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(menuOpen === scenario.id ? null : scenario.id);
                    }}
                    className="p-1 hover:bg-stone-100 rounded"
                  >
                    <MoreHorizontal className="w-4 h-4 text-stone-400" />
                  </button>
                  {menuOpen === scenario.id && (
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
                              onEdit(scenario.id);
                              setMenuOpen(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-stone-50 flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Редактировать
                          </button>
                        )}
                        {onDelete && !scenario.isDefault && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(scenario.id);
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
