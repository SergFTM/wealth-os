'use client';

/**
 * Committee Agenda Items Table Component
 */

import Link from 'next/link';
import { CommitteeAgendaItem, hasMissingMaterials } from '../schema/committeeAgendaItem';
import { CommitteeMeeting } from '../schema/committeeMeeting';
import { CmStatusPill } from './CmStatusPill';
import { CM_AGENDA_CATEGORY } from '../config';

interface CmAgendaTableProps {
  items: CommitteeAgendaItem[];
  meetings: CommitteeMeeting[];
  onAttachMaterials?: (id: string) => void;
  onSendToVote?: (id: string) => void;
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  ru: {
    title: 'Пункт',
    category: 'Категория',
    proposedBy: 'Предложил',
    status: 'Статус',
    materials: 'Материалы',
    meeting: 'Заседание',
    actions: 'Действия',
    open: 'Открыть',
    attach: 'Прикрепить',
    vote: 'На голос.',
    noItems: 'Нет пунктов повестки',
    missing: 'Отсутствуют',
  },
  en: {
    title: 'Item',
    category: 'Category',
    proposedBy: 'Proposed by',
    status: 'Status',
    materials: 'Materials',
    meeting: 'Meeting',
    actions: 'Actions',
    open: 'Open',
    attach: 'Attach',
    vote: 'To vote',
    noItems: 'No agenda items',
    missing: 'Missing',
  },
  uk: {
    title: 'Пункт',
    category: 'Категорія',
    proposedBy: 'Запропонував',
    status: 'Статус',
    materials: 'Матеріали',
    meeting: 'Засідання',
    actions: 'Дії',
    open: 'Відкрити',
    attach: 'Прикріпити',
    vote: 'На голос.',
    noItems: 'Немає пунктів порядку',
    missing: 'Відсутні',
  },
};

export function CmAgendaTable({
  items,
  meetings,
  onAttachMaterials,
  onSendToVote,
  lang = 'ru',
}: CmAgendaTableProps) {
  const l = labels[lang];

  const getMeetingTitle = (meetingId: string) =>
    meetings.find(m => m.id === meetingId)?.title || meetingId;

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">{l.noItems}</div>
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
              {l.category}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.proposedBy}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.status}
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.materials}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.meeting}
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.actions}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map(item => {
            const categoryConfig = CM_AGENDA_CATEGORY[item.categoryKey];
            const isMissing = hasMissingMaterials(item);

            return (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link
                    href={`/m/committee/item/${item.id}`}
                    className="text-gray-900 font-medium hover:text-emerald-600"
                  >
                    {item.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="inline-flex items-center gap-1">
                    <span>{categoryConfig?.icon || '📋'}</span>
                    <span className="text-gray-600">{categoryConfig?.label[lang] || item.categoryKey}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {item.proposedByName || '—'}
                </td>
                <td className="px-4 py-3">
                  <CmStatusPill status={item.status} type="agenda" lang={lang} size="sm" />
                </td>
                <td className="px-4 py-3 text-center">
                  {isMissing ? (
                    <span className="text-xs text-red-600 font-medium">{l.missing}</span>
                  ) : (
                    <span className="text-sm text-gray-600">{item.materialsDocIds.length}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {getMeetingTitle(item.meetingId)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/m/committee/item/${item.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {l.open}
                    </Link>
                    {isMissing && onAttachMaterials && (
                      <button
                        onClick={() => onAttachMaterials(item.id)}
                        className="text-sm text-amber-600 hover:text-amber-700"
                      >
                        {l.attach}
                      </button>
                    )}
                    {item.status === 'pending' && !item.linkedVoteId && onSendToVote && (
                      <button
                        onClick={() => onSendToVote(item.id)}
                        className="text-sm text-emerald-600 hover:text-emerald-700"
                      >
                        {l.vote}
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
