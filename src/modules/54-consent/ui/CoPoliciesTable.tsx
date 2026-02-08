"use client";

import { MoreHorizontal, Eye } from 'lucide-react';
import { useState } from 'react';
import { CoStatusPill } from './CoStatusPill';

interface CoPoliciesTableProps {
  policies: any[];
  onOpen: (id: string) => void;
}

const policyTypeLabels: Record<string, { label: string; className: string }> = {
  retention: {
    label: 'Хранение',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  access_control: {
    label: 'Контроль доступа',
    className: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  data_sharing: {
    label: 'Обмен данными',
    className: 'bg-teal-100 text-teal-700 border-teal-200',
  },
  consent_required: {
    label: 'Требуется согласие',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  anonymization: {
    label: 'Анонимизация',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
};

export function CoPoliciesTable({ policies, onOpen }: CoPoliciesTableProps) {
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  if (policies.length === 0) {
    return (
      <div className="p-6 text-center text-stone-400">
        Нет политик
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-stone-500 uppercase tracking-wider border-b border-stone-200/50">
            <th className="px-4 py-3 font-medium">Название</th>
            <th className="px-4 py-3 font-medium">Тип политики</th>
            <th className="px-4 py-3 font-medium">Scope</th>
            <th className="px-4 py-3 font-medium">Статус</th>
            <th className="px-4 py-3 font-medium w-10"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {policies.map((policy) => {
            const typeConfig = policyTypeLabels[policy.policyType] || {
              label: policy.policyType || 'Прочее',
              className: 'bg-stone-100 text-stone-600 border-stone-200',
            };

            return (
              <tr
                key={policy.id}
                className="hover:bg-stone-50/50 cursor-pointer transition-colors"
                onClick={() => onOpen(policy.id)}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-800 truncate max-w-[220px]">
                    {policy.name}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${typeConfig.className}`}
                  >
                    {typeConfig.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-stone-600 truncate max-w-[200px]">
                  {Array.isArray(policy.scopeModules)
                    ? policy.scopeModules.join(', ')
                    : policy.scope || '-'}
                </td>
                <td className="px-4 py-3">
                  <CoStatusPill status={policy.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(menuOpen === policy.id ? null : policy.id);
                      }}
                      className="p-1 hover:bg-stone-100 rounded"
                    >
                      <MoreHorizontal className="w-4 h-4 text-stone-400" />
                    </button>
                    {menuOpen === policy.id && (
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
                              onOpen(policy.id);
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
