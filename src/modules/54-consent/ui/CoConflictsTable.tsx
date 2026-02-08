"use client";

import { MoreHorizontal, Eye } from 'lucide-react';
import { useState } from 'react';
import { CoStatusPill } from './CoStatusPill';
import { CoSeverityPill } from './CoSeverityPill';

interface CoConflictsTableProps {
  conflicts: any[];
  onOpen: (id: string) => void;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU');
}

const conflictTypeLabels: Record<string, { label: string; className: string }> = {
  scope_overlap: {
    label: 'Пересечение scope',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  policy_violation: {
    label: 'Нарушение политики',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  consent_conflict: {
    label: 'Конфликт согласий',
    className: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  expiry_risk: {
    label: 'Риск истечения',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  access_anomaly: {
    label: 'Аномалия доступа',
    className: 'bg-teal-100 text-teal-700 border-teal-200',
  },
};

export function CoConflictsTable({ conflicts, onOpen }: CoConflictsTableProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  if (conflicts.length === 0) {
    return (
      <div className="p-6 text-center text-stone-400">
        Конфликтов не обнаружено
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-stone-500 uppercase tracking-wider border-b border-stone-200/50">
            <th className="px-4 py-3 font-medium">Тип конфликта</th>
            <th className="px-4 py-3 font-medium">Severity</th>
            <th className="px-4 py-3 font-medium">Объектов</th>
            <th className="px-4 py-3 font-medium">Статус</th>
            <th className="px-4 py-3 font-medium">Создан</th>
            <th className="px-4 py-3 font-medium w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {conflicts.map((conflict) => {
            const typeConfig = conflictTypeLabels[conflict.conflictType] || {
              label: conflict.conflictType || 'Прочее',
              className: 'bg-stone-100 text-stone-600 border-stone-200',
            };

            return (
              <tr
                key={conflict.id}
                className="hover:bg-stone-50/50 cursor-pointer transition-colors"
                onClick={() => onOpen(conflict.id)}
              >
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${typeConfig.className}`}
                  >
                    {typeConfig.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <CoSeverityPill severity={conflict.severity} />
                </td>
                <td className="px-4 py-3 text-sm text-stone-700 font-mono">
                  {conflict.objectCount ?? conflict.affectedObjects ?? 0}
                </td>
                <td className="px-4 py-3">
                  <CoStatusPill status={conflict.status} />
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  {conflict.createdAt ? formatDate(conflict.createdAt) : '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === conflict.id ? null : conflict.id);
                      }}
                      className="p-1 hover:bg-stone-100 rounded"
                    >
                      <MoreHorizontal className="w-4 h-4 text-stone-400" />
                    </button>
                    {menuOpen === conflict.id && (
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
                              onOpen(conflict.id);
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
