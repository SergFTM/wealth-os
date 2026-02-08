"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { RhStatusPill } from './RhStatusPill';

export interface InteractionRow {
  id: string;
  occurredAt: string;
  interactionTypeKey: string;
  summary: string;
  participantNames: string[];
  householdName?: string;
  followUpDueAt?: string;
  statusKey: string;
  hasLinkedCase: boolean;
  hasLinkedTasks: boolean;
}

interface RhInteractionsTableProps {
  interactions: InteractionRow[];
  onRowClick?: (interaction: InteractionRow) => void;
  loading?: boolean;
}

const TYPE_ICONS: Record<string, { icon: string; label: string }> = {
  meeting: { icon: '📅', label: 'Встреча' },
  call: { icon: '📞', label: 'Звонок' },
  message: { icon: '💬', label: 'Сообщение' },
  note: { icon: '📝', label: 'Заметка' },
};

export function RhInteractionsTable({ interactions, onRowClick, loading }: RhInteractionsTableProps) {
  const router = useRouter();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = (interaction: InteractionRow) => {
    if (!interaction.followUpDueAt || interaction.statusKey === 'closed') return false;
    return new Date(interaction.followUpDueAt) < new Date();
  };

  const handleRowClick = (interaction: InteractionRow) => {
    if (onRowClick) {
      onRowClick(interaction);
    } else {
      router.push(`/m/relationships/interaction/${interaction.id}`);
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

  if (interactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <span className="text-4xl mb-3 block">💬</span>
        <p>Нет взаимодействий</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Дата
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Тип
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Краткое описание
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Участники
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Follow-up
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Связи
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Статус
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {interactions.map((interaction) => {
            const typeConfig = TYPE_ICONS[interaction.interactionTypeKey] || TYPE_ICONS.note;
            const overdue = isOverdue(interaction);

            return (
              <tr
                key={interaction.id}
                onClick={() => handleRowClick(interaction)}
                className={`hover:bg-gray-50 cursor-pointer transition-colors ${overdue ? 'bg-red-50/50' : ''}`}
              >
                <td className="px-4 py-3 text-sm text-gray-600">
                  {formatDate(interaction.occurredAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span>{typeConfig.icon}</span>
                    <span className="text-sm text-gray-600">{typeConfig.label}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 max-w-xs truncate">
                    {interaction.summary}
                  </p>
                  {interaction.householdName && (
                    <p className="text-xs text-gray-500">{interaction.householdName}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {interaction.participantNames.slice(0, 2).join(', ')}
                  {interaction.participantNames.length > 2 && (
                    <span className="text-gray-400"> +{interaction.participantNames.length - 2}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">
                  {interaction.followUpDueAt ? (
                    <span className={overdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {formatDate(interaction.followUpDueAt)}
                      {overdue && ' ⚠️'}
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {interaction.hasLinkedCase && (
                      <span title="Связанный кейс" className="text-sm">📋</span>
                    )}
                    {interaction.hasLinkedTasks && (
                      <span title="Связанные задачи" className="text-sm">✓</span>
                    )}
                    {!interaction.hasLinkedCase && !interaction.hasLinkedTasks && (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <RhStatusPill status={overdue ? 'overdue' : interaction.statusKey} size="sm" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default RhInteractionsTable;
