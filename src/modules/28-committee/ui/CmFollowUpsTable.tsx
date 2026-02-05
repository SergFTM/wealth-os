'use client';

/**
 * Committee Follow-ups Table Component
 */

import Link from 'next/link';
import { CommitteeFollowUp, isFollowUpOverdue, getDaysUntilDue, formatDueDate } from '../schema/committeeFollowUp';
import { CommitteeDecision } from '../schema/committeeDecision';
import { CmStatusPill } from './CmStatusPill';
import { FOLLOWUP_STATUS_CONFIG } from '../schema/committeeFollowUp';

interface CmFollowUpsTableProps {
  followUps: CommitteeFollowUp[];
  decisions: CommitteeDecision[];
  onOpenTask?: (taskId: string) => void;
  onMarkComplete?: (id: string) => void;
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  ru: {
    title: 'Задача',
    decision: 'Решение',
    owner: 'Исполнитель',
    due: 'Срок',
    status: 'Статус',
    actions: 'Действия',
    openTask: 'Задача',
    complete: 'Выполнено',
    noFollowUps: 'Нет задач на исполнение',
    overdue: 'Просрочено',
    daysLeft: 'дн.',
  },
  en: {
    title: 'Task',
    decision: 'Decision',
    owner: 'Owner',
    due: 'Due',
    status: 'Status',
    actions: 'Actions',
    openTask: 'Task',
    complete: 'Complete',
    noFollowUps: 'No follow-ups',
    overdue: 'Overdue',
    daysLeft: 'days',
  },
  uk: {
    title: 'Задача',
    decision: 'Рішення',
    owner: 'Виконавець',
    due: 'Термін',
    status: 'Статус',
    actions: 'Дії',
    openTask: 'Задача',
    complete: 'Виконано',
    noFollowUps: 'Немає задач на виконання',
    overdue: 'Прострочено',
    daysLeft: 'дн.',
  },
};

export function CmFollowUpsTable({
  followUps,
  decisions,
  onOpenTask,
  onMarkComplete,
  lang = 'ru',
}: CmFollowUpsTableProps) {
  const l = labels[lang];

  const getDecisionTitle = (decisionId: string) =>
    decisions.find(d => d.id === decisionId)?.title || decisionId;

  if (followUps.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">{l.noFollowUps}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.title}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.decision}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.owner}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.due}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.status}
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.actions}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {followUps.map(followUp => {
            const overdue = isFollowUpOverdue(followUp);
            const daysLeft = getDaysUntilDue(followUp);
            const statusConfig = FOLLOWUP_STATUS_CONFIG[followUp.status];

            return (
              <tr key={followUp.id} className={`hover:bg-gray-50 ${overdue ? 'bg-red-50/30' : ''}`}>
                <td className="px-4 py-3">
                  <span className="text-gray-900 font-medium">{followUp.title}</span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {getDecisionTitle(followUp.decisionId)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {followUp.ownerName || '—'}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={overdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {formatDueDate(followUp.dueAt, lang)}
                    </span>
                    {overdue ? (
                      <span className="text-xs text-red-600 font-medium">
                        ({l.overdue})
                      </span>
                    ) : followUp.status !== 'done' && followUp.status !== 'cancelled' ? (
                      <span className="text-xs text-gray-500">
                        ({daysLeft} {l.daysLeft})
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full text-xs font-medium px-2 py-1
                      ${statusConfig.color === 'emerald' ? 'bg-emerald-100 text-emerald-800' : ''}
                      ${statusConfig.color === 'amber' ? 'bg-amber-100 text-amber-800' : ''}
                      ${statusConfig.color === 'blue' ? 'bg-blue-100 text-blue-800' : ''}
                      ${statusConfig.color === 'gray' ? 'bg-gray-100 text-gray-600' : ''}
                    `}
                  >
                    {statusConfig.label[lang]}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {followUp.taskId && onOpenTask && (
                      <button
                        onClick={() => onOpenTask(followUp.taskId!)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {l.openTask}
                      </button>
                    )}
                    {followUp.status !== 'done' && followUp.status !== 'cancelled' && onMarkComplete && (
                      <button
                        onClick={() => onMarkComplete(followUp.id)}
                        className="text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        {l.complete}
                      </button>
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
