'use client';

/**
 * Committee Decisions Table Component
 */

import Link from 'next/link';
import { CommitteeDecision } from '../schema/committeeDecision';
import { CommitteeMeeting } from '../schema/committeeMeeting';
import { CmStatusPill } from './CmStatusPill';

interface CmDecisionsTableProps {
  decisions: CommitteeDecision[];
  meetings: CommitteeMeeting[];
  onCreateTasks?: (id: string) => void;
  onMarkDone?: (id: string) => void;
  mini?: boolean;
  limit?: number;
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  ru: {
    title: 'Решение',
    meeting: 'Заседание',
    result: 'Результат',
    effective: 'Вступает',
    owner: 'Исполнитель',
    status: 'Статус',
    actions: 'Действия',
    open: 'Открыть',
    createTasks: 'Задачи',
    markDone: 'Выполнено',
    noDecisions: 'Нет решений',
    viewAll: 'Показать все',
  },
  en: {
    title: 'Decision',
    meeting: 'Meeting',
    result: 'Result',
    effective: 'Effective',
    owner: 'Owner',
    status: 'Status',
    actions: 'Actions',
    open: 'Open',
    createTasks: 'Tasks',
    markDone: 'Done',
    noDecisions: 'No decisions',
    viewAll: 'View all',
  },
  uk: {
    title: 'Рішення',
    meeting: 'Засідання',
    result: 'Результат',
    effective: 'Вступає',
    owner: 'Виконавець',
    status: 'Статус',
    actions: 'Дії',
    open: 'Відкрити',
    createTasks: 'Задачі',
    markDone: 'Виконано',
    noDecisions: 'Немає рішень',
    viewAll: 'Показати всі',
  },
};

export function CmDecisionsTable({
  decisions,
  meetings,
  onCreateTasks,
  onMarkDone,
  mini = false,
  limit,
  lang = 'ru',
}: CmDecisionsTableProps) {
  const l = labels[lang];
  const displayDecisions = limit ? decisions.slice(0, limit) : decisions;

  const getMeetingTitle = (meetingId: string) =>
    meetings.find(m => m.id === meetingId)?.title || meetingId;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US',
      { day: 'numeric', month: 'short' }
    );
  };

  if (displayDecisions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">{l.noDecisions}</div>
    );
  }

  if (mini) {
    return (
      <div className="space-y-2">
        {displayDecisions.map(decision => (
          <Link
            key={decision.id}
            href={`/m/committee/decision/${decision.id}`}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">{decision.title}</div>
              <div className="text-sm text-gray-500">{formatDate(decision.effectiveAt)}</div>
            </div>
            <div className="flex items-center gap-2 ml-3">
              <CmStatusPill status={decision.result} type="result" lang={lang} size="sm" />
            </div>
          </Link>
        ))}
        {limit && decisions.length > limit && (
          <Link
            href="/m/committee/list?tab=decisions"
            className="block text-center text-sm text-emerald-600 hover:text-emerald-700 py-2"
          >
            {l.viewAll} →
          </Link>
        )}
      </div>
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
              {l.meeting}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.result}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.effective}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.owner}
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
          {displayDecisions.map(decision => (
            <tr key={decision.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <Link
                  href={`/m/committee/decision/${decision.id}`}
                  className="text-gray-900 font-medium hover:text-emerald-600"
                >
                  {decision.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {getMeetingTitle(decision.meetingId)}
              </td>
              <td className="px-4 py-3">
                <CmStatusPill status={decision.result} type="result" lang={lang} size="sm" />
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {formatDate(decision.effectiveAt)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {decision.executionOwnerName || '—'}
              </td>
              <td className="px-4 py-3">
                <CmStatusPill status={decision.status} type="decision" lang={lang} size="sm" />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/m/committee/decision/${decision.id}`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {l.open}
                  </Link>
                  {decision.result === 'approved' && decision.status !== 'done' && onCreateTasks && (
                    <button
                      onClick={() => onCreateTasks(decision.id)}
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      {l.createTasks}
                    </button>
                  )}
                  {decision.status === 'in_progress' && onMarkDone && (
                    <button
                      onClick={() => onMarkDone(decision.id)}
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      {l.markDone}
                    </button>
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
