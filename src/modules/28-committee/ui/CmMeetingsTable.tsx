'use client';

/**
 * Committee Meetings Table Component
 */

import Link from 'next/link';
import { CommitteeMeeting, formatMeetingDate } from '../schema/committeeMeeting';
import { CommitteeAgendaItem } from '../schema/committeeAgendaItem';
import { CommitteeDecision } from '../schema/committeeDecision';
import { CmStatusPill } from './CmStatusPill';

interface CmMeetingsTableProps {
  meetings: CommitteeMeeting[];
  agendaItems: CommitteeAgendaItem[];
  decisions: CommitteeDecision[];
  onStartMeeting?: (id: string) => void;
  onCloseMeeting?: (id: string) => void;
  onPublishMinutes?: (id: string) => void;
  mini?: boolean;
  limit?: number;
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  ru: {
    title: 'Название',
    date: 'Дата',
    scope: 'Scope',
    status: 'Статус',
    agenda: 'Повестка',
    decisions: 'Решений',
    minutes: 'Протокол',
    actions: 'Действия',
    open: 'Открыть',
    start: 'Начать',
    close: 'Закрыть',
    publish: 'Опубликовать',
    noMeetings: 'Нет заседаний',
    viewAll: 'Показать все',
  },
  en: {
    title: 'Title',
    date: 'Date',
    scope: 'Scope',
    status: 'Status',
    agenda: 'Agenda',
    decisions: 'Decisions',
    minutes: 'Minutes',
    actions: 'Actions',
    open: 'Open',
    start: 'Start',
    close: 'Close',
    publish: 'Publish',
    noMeetings: 'No meetings',
    viewAll: 'View all',
  },
  uk: {
    title: 'Назва',
    date: 'Дата',
    scope: 'Scope',
    status: 'Статус',
    agenda: 'Порядок',
    decisions: 'Рішень',
    minutes: 'Протокол',
    actions: 'Дії',
    open: 'Відкрити',
    start: 'Почати',
    close: 'Закрити',
    publish: 'Опублікувати',
    noMeetings: 'Немає засідань',
    viewAll: 'Показати всі',
  },
};

export function CmMeetingsTable({
  meetings,
  agendaItems,
  decisions,
  onStartMeeting,
  onCloseMeeting,
  onPublishMinutes,
  mini = false,
  limit,
  lang = 'ru',
}: CmMeetingsTableProps) {
  const l = labels[lang];
  const displayMeetings = limit ? meetings.slice(0, limit) : meetings;

  const getAgendaCount = (meetingId: string) =>
    agendaItems.filter(i => i.meetingId === meetingId).length;

  const getDecisionCount = (meetingId: string) =>
    decisions.filter(d => d.meetingId === meetingId).length;

  if (displayMeetings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">{l.noMeetings}</div>
    );
  }

  if (mini) {
    return (
      <div className="space-y-2">
        {displayMeetings.map(meeting => (
          <Link
            key={meeting.id}
            href={`/m/committee/meeting/${meeting.id}`}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">{meeting.title}</div>
              <div className="text-sm text-gray-500">{formatMeetingDate(meeting.scheduledAt, lang)}</div>
            </div>
            <div className="flex items-center gap-2 ml-3">
              <CmStatusPill status={meeting.status} type="meeting" lang={lang} size="sm" />
            </div>
          </Link>
        ))}
        {limit && meetings.length > limit && (
          <Link
            href="/m/committee/list?tab=meetings"
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
              {l.date}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.status}
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.agenda}
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.decisions}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.minutes}
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.actions}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayMeetings.map(meeting => (
            <tr key={meeting.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <Link
                  href={`/m/committee/meeting/${meeting.id}`}
                  className="text-gray-900 font-medium hover:text-emerald-600"
                >
                  {meeting.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {formatMeetingDate(meeting.scheduledAt, lang)}
              </td>
              <td className="px-4 py-3">
                <CmStatusPill status={meeting.status} type="meeting" lang={lang} size="sm" />
              </td>
              <td className="px-4 py-3 text-center text-sm text-gray-600">
                {getAgendaCount(meeting.id)}
              </td>
              <td className="px-4 py-3 text-center text-sm text-gray-600">
                {getDecisionCount(meeting.id)}
              </td>
              <td className="px-4 py-3">
                <CmStatusPill status={meeting.minutesStatus} type="minutes" lang={lang} size="sm" />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/m/committee/meeting/${meeting.id}`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {l.open}
                  </Link>
                  {meeting.status === 'scheduled' && onStartMeeting && (
                    <button
                      onClick={() => onStartMeeting(meeting.id)}
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      {l.start}
                    </button>
                  )}
                  {meeting.status === 'in_progress' && onCloseMeeting && (
                    <button
                      onClick={() => onCloseMeeting(meeting.id)}
                      className="text-sm text-amber-600 hover:text-amber-700"
                    >
                      {l.close}
                    </button>
                  )}
                  {meeting.status === 'closed' && meeting.minutesStatus === 'draft' && onPublishMinutes && (
                    <button
                      onClick={() => onPublishMinutes(meeting.id)}
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      {l.publish}
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
