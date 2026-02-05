"use client";

import { FileText, MoreVertical, Eye, Edit, Trash2, CheckCircle, Clock, FileCheck } from 'lucide-react';
import { useState } from 'react';

interface Policy {
  id: string;
  name: string;
  scopeType: 'household' | 'entity' | 'portfolio';
  scopeId?: string;
  status: 'draft' | 'active' | 'archived';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  timeHorizon?: string;
  createdAt: string;
  constraintsCount?: number;
  breachesCount?: number;
}

interface IpsPoliciesTableProps {
  policies: Policy[];
  onOpen: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
}

const scopeLabels: Record<string, string> = {
  household: 'Хозяйство',
  entity: 'Юр. лицо',
  portfolio: 'Портфель',
};

const statusLabels: Record<string, string> = {
  draft: 'Черновик',
  active: 'Активна',
  archived: 'Архив',
};

const statusColors: Record<string, string> = {
  draft: 'bg-stone-100 text-stone-600',
  active: 'bg-emerald-100 text-emerald-700',
  archived: 'bg-stone-100 text-stone-500',
};

const riskLabels: Record<string, string> = {
  conservative: 'Консерватив.',
  moderate: 'Умеренный',
  aggressive: 'Агрессивный',
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  });
};

export function IpsPoliciesTable({
  policies,
  onOpen,
  onEdit,
  onDelete,
  onApprove,
}: IpsPoliciesTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (policies.length === 0) {
    return (
      <div className="p-8 text-center">
        <FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <p className="text-stone-500">Нет политик</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200/50">
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Название
            </th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Scope
            </th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Статус
            </th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Риск
            </th>
            <th className="text-center text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Ограничения
            </th>
            <th className="text-center text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Нарушения
            </th>
            <th className="text-left text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">
              Создана
            </th>
            <th className="text-right text-xs font-medium text-stone-500 uppercase tracking-wider px-4 py-3">

            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {policies.map((policy) => (
            <tr
              key={policy.id}
              onClick={() => onOpen(policy.id)}
              className="hover:bg-emerald-50/30 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-sm font-medium text-stone-800 truncate max-w-[200px]">
                    {policy.name}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-stone-100 text-stone-700">
                  {scopeLabels[policy.scopeType]}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[policy.status]}`}>
                  {statusLabels[policy.status]}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {riskLabels[policy.riskTolerance]}
              </td>
              <td className="px-4 py-3 text-center text-sm text-stone-600">
                {policy.constraintsCount ?? 0}
              </td>
              <td className="px-4 py-3 text-center">
                {(policy.breachesCount ?? 0) > 0 ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">
                    {policy.breachesCount}
                  </span>
                ) : (
                  <span className="text-sm text-stone-400">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-stone-600">
                {formatDate(policy.createdAt)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === policy.id ? null : policy.id);
                    }}
                    className="p-1 hover:bg-stone-100 rounded"
                  >
                    <MoreVertical className="w-4 h-4 text-stone-400" />
                  </button>

                  {openMenuId === policy.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                        }}
                      />
                      <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-stone-200 py-1 z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpen(policy.id);
                            setOpenMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                        >
                          <Eye className="w-4 h-4" />
                          Открыть
                        </button>
                        {onEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(policy.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50"
                          >
                            <Edit className="w-4 h-4" />
                            Редактировать
                          </button>
                        )}
                        {onApprove && policy.status === 'draft' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onApprove(policy.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Утвердить
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(policy.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
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
