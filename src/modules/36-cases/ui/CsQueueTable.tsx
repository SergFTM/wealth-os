'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { CsPriorityPill } from './CsPriorityPill';
import { CsStatusPill } from './CsStatusPill';
import { formatTimeRemaining } from '../engine/slaEngine';

export interface CaseRow {
  id: string;
  caseNumber: string;
  title: string;
  caseType: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'awaiting_client' | 'resolved' | 'closed';
  dueAt?: string | null;
  slaBreached?: boolean;
  assignedToUserName?: string | null;
  reporterName?: string | null;
  clientVisible?: boolean;
  updatedAt: string;
}

interface CsQueueTableProps {
  cases: CaseRow[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  locale?: string;
}

const typeLabels: Record<string, Record<string, string>> = {
  request: { ru: 'Запрос', en: 'Request', uk: 'Запит' },
  incident: { ru: 'Инцидент', en: 'Incident', uk: 'Інцидент' },
  change: { ru: 'Изменение', en: 'Change', uk: 'Зміна' },
  problem: { ru: 'Проблема', en: 'Problem', uk: 'Проблема' },
};

const typeStyles: Record<string, string> = {
  request: 'bg-blue-50 text-blue-700',
  incident: 'bg-red-50 text-red-700',
  change: 'bg-purple-50 text-purple-700',
  problem: 'bg-orange-50 text-orange-700',
};

export function CsQueueTable({
  cases,
  selectedIds,
  onSelectionChange,
  locale = 'ru',
}: CsQueueTableProps) {
  const t = useTranslation();

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === cases.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(cases.map(c => c.id));
    }
  };

  if (cases.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        {t('noCases', { ru: 'Нет кейсов в очереди', en: 'No cases in queue', uk: 'Немає кейсів у черзі' })}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="w-10 p-3">
              <input
                type="checkbox"
                checked={selectedIds.length === cases.length}
                onChange={toggleSelectAll}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
            </th>
            <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('caseNumber', { ru: '№', en: '#', uk: '№' })}
            </th>
            <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('title', { ru: 'Заголовок', en: 'Title', uk: 'Заголовок' })}
            </th>
            <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('type', { ru: 'Тип', en: 'Type', uk: 'Тип' })}
            </th>
            <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('priority', { ru: 'Приоритет', en: 'Priority', uk: 'Пріоритет' })}
            </th>
            <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('status', { ru: 'Статус', en: 'Status', uk: 'Статус' })}
            </th>
            <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('slaDue', { ru: 'SLA', en: 'SLA Due', uk: 'SLA' })}
            </th>
            <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('assignee', { ru: 'Исполнитель', en: 'Assignee', uk: 'Виконавець' })}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {cases.map((caseItem) => (
            <tr
              key={caseItem.id}
              className={`
                hover:bg-gray-50/50 transition-colors
                ${selectedIds.includes(caseItem.id) ? 'bg-emerald-50/50' : ''}
                ${caseItem.slaBreached ? 'bg-red-50/30' : ''}
              `}
            >
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(caseItem.id)}
                  onChange={() => toggleSelect(caseItem.id)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </td>
              <td className="p-3">
                <Link
                  href={`/m/cases/case/${caseItem.id}`}
                  className="text-sm font-mono text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  {caseItem.caseNumber}
                </Link>
              </td>
              <td className="p-3">
                <Link
                  href={`/m/cases/case/${caseItem.id}`}
                  className="text-sm text-gray-900 hover:text-emerald-600 line-clamp-1"
                >
                  {caseItem.title}
                  {caseItem.clientVisible && (
                    <span className="ml-2 text-xs text-blue-500" title="Visible to client">
                      <svg className="w-3 h-3 inline" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </Link>
              </td>
              <td className="p-3">
                <span className={`px-2 py-1 text-xs font-medium rounded ${typeStyles[caseItem.caseType] || ''}`}>
                  {typeLabels[caseItem.caseType]?.[locale] || caseItem.caseType}
                </span>
              </td>
              <td className="p-3">
                <CsPriorityPill priority={caseItem.priority} locale={locale} />
              </td>
              <td className="p-3">
                <CsStatusPill status={caseItem.status} locale={locale} />
              </td>
              <td className="p-3">
                {caseItem.dueAt ? (
                  <span className={`text-sm ${caseItem.slaBreached ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                    {formatTimeRemaining(caseItem.dueAt)}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </td>
              <td className="p-3">
                <span className="text-sm text-gray-600">
                  {caseItem.assignedToUserName || (
                    <span className="text-amber-600">
                      {t('unassigned', { ru: 'Не назначен', en: 'Unassigned', uk: 'Не призначено' })}
                    </span>
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
