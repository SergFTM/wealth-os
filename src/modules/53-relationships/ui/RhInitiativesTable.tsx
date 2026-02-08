"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { RhStatusPill } from './RhStatusPill';

export interface InitiativeRow {
  id: string;
  title: string;
  householdName: string;
  ownerName: string;
  stageKey: string;
  dueAt?: string;
  hasLinkedCase: boolean;
  hasLinkedTasks: boolean;
  createdAt: string;
}

interface RhInitiativesTableProps {
  initiatives: InitiativeRow[];
  onRowClick?: (initiative: InitiativeRow) => void;
  loading?: boolean;
}

const STAGE_CONFIG: Record<string, { label: string; color: string }> = {
  idea: { label: 'Идея', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  in_analysis: { label: 'В анализе', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  in_progress: { label: 'В работе', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  done: { label: 'Завершено', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

export function RhInitiativesTable({ initiatives, onRowClick, loading }: RhInitiativesTableProps) {
  const router = useRouter();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  const isOverdue = (initiative: InitiativeRow) => {
    if (!initiative.dueAt || initiative.stageKey === 'done') return false;
    return new Date(initiative.dueAt) < new Date();
  };

  const handleRowClick = (initiative: InitiativeRow) => {
    if (onRowClick) {
      onRowClick(initiative);
    } else {
      router.push(`/m/relationships/initiative/${initiative.id}`);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-14 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (initiatives.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <span className="text-4xl mb-3 block">🚀</span>
        <p>Нет инициатив</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Название
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Домохозяйство
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ответственный
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Этап
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Срок
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Связи
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {initiatives.map((initiative) => {
            const stageConfig = STAGE_CONFIG[initiative.stageKey] || STAGE_CONFIG.idea;
            const overdue = isOverdue(initiative);

            return (
              <tr
                key={initiative.id}
                onClick={() => handleRowClick(initiative)}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${overdue ? 'bg-red-50/50' : ''}`}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{initiative.title}</p>
                  <p className="text-xs text-gray-500">
                    Создано: {formatDate(initiative.createdAt)}
                  </p>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {initiative.householdName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {initiative.ownerName}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${stageConfig.color}`}>
                    {stageConfig.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {initiative.dueAt ? (
                    <span className={overdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {formatDate(initiative.dueAt)}
                      {overdue && ' ⚠️'}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {initiative.hasLinkedCase && (
                      <span title="Связанный кейс" className="text-sm">📋</span>
                    )}
                    {initiative.hasLinkedTasks && (
                      <span title="Связанные задачи" className="text-sm">✓</span>
                    )}
                    {!initiative.hasLinkedCase && !initiative.hasLinkedTasks && (
                      <span className="text-gray-400">—</span>
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

export default RhInitiativesTable;
