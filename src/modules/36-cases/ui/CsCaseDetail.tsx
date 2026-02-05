'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';
import { CsPriorityPill } from './CsPriorityPill';
import { CsStatusPill } from './CsStatusPill';
import { CsCaseTimeline } from './CsCaseTimeline';
import { CsCaseComments } from './CsCaseComments';
import { CsCaseLinksPanel } from './CsCaseLinksPanel';
import { formatTimeRemaining } from '../engine/slaEngine';

export interface CaseDetail {
  id: string;
  clientId: string;
  caseNumber: string;
  title: string;
  description?: string | null;
  caseType: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'awaiting_client' | 'resolved' | 'closed';
  sourceType: string;
  reporterSubjectType?: string | null;
  reporterId?: string | null;
  reporterName?: string | null;
  reporterEmail?: string | null;
  assignedToUserId?: string | null;
  assignedToUserName?: string | null;
  assignedToRole?: string | null;
  scopeType?: string | null;
  scopeId?: string | null;
  scopeName?: string | null;
  clientVisible?: boolean;
  clientSafeSummary?: string | null;
  clientSafeUpdates?: string | null;
  threadId?: string | null;
  slaPolicyId?: string | null;
  slaPolicyName?: string | null;
  responseDueAt?: string | null;
  dueAt?: string | null;
  slaBreached?: boolean;
  slaBreachedAt?: string | null;
  escalationLevel?: number;
  lastEscalationAt?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  resolutionNotes?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CsCaseDetailProps {
  caseData: CaseDetail;
  locale?: string;
  onAssign?: () => void;
  onStatusChange?: () => void;
  onAddComment?: () => void;
  onCreateTask?: () => void;
  onLinkObject?: () => void;
  onResolve?: () => void;
}

const typeLabels: Record<string, Record<string, string>> = {
  request: { ru: 'Запрос', en: 'Request', uk: 'Запит' },
  incident: { ru: 'Инцидент', en: 'Incident', uk: 'Інцидент' },
  change: { ru: 'Изменение', en: 'Change', uk: 'Зміна' },
  problem: { ru: 'Проблема', en: 'Problem', uk: 'Проблема' },
};

const sourceLabels: Record<string, Record<string, string>> = {
  portal: { ru: 'Портал', en: 'Portal', uk: 'Портал' },
  internal: { ru: 'Внутренний', en: 'Internal', uk: 'Внутрішній' },
  dq: { ru: 'Data Quality', en: 'Data Quality', uk: 'Data Quality' },
  sync: { ru: 'Синхронизация', en: 'Sync', uk: 'Синхронізація' },
  billing: { ru: 'Биллинг', en: 'Billing', uk: 'Білінг' },
  email: { ru: 'Email', en: 'Email', uk: 'Email' },
  api: { ru: 'API', en: 'API', uk: 'API' },
};

export function CsCaseDetail({
  caseData,
  locale = 'ru',
  onAssign,
  onStatusChange,
  onAddComment,
  onCreateTask,
  onLinkObject,
  onResolve,
}: CsCaseDetailProps) {
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'comments' | 'links' | 'tasks' | 'sla' | 'audit'>('overview');

  const tabs = [
    { key: 'overview', label: { ru: 'Обзор', en: 'Overview', uk: 'Огляд' } },
    { key: 'timeline', label: { ru: 'История', en: 'Timeline', uk: 'Історія' } },
    { key: 'comments', label: { ru: 'Комментарии', en: 'Comments', uk: 'Коментарі' } },
    { key: 'links', label: { ru: 'Связи', en: 'Links', uk: 'Зв\'язки' } },
    { key: 'tasks', label: { ru: 'Задачи', en: 'Tasks', uk: 'Задачі' } },
    { key: 'sla', label: { ru: 'SLA', en: 'SLA', uk: 'SLA' } },
    { key: 'audit', label: { ru: 'Аудит', en: 'Audit', uk: 'Аудит' } },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-mono text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                {caseData.caseNumber}
              </span>
              <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                {typeLabels[caseData.caseType]?.[locale] || caseData.caseType}
              </span>
              <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                {sourceLabels[caseData.sourceType]?.[locale] || caseData.sourceType}
              </span>
              {caseData.clientVisible && (
                <span className="text-xs text-blue-600 px-2 py-1 bg-blue-50 rounded flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {t('clientVisible', { ru: 'Видно клиенту', en: 'Client Visible', uk: 'Видно клієнту' })}
                </span>
              )}
            </div>

            <h1 className="text-xl font-semibold text-gray-900 mb-2">{caseData.title}</h1>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <CsPriorityPill priority={caseData.priority} locale={locale} />
              <CsStatusPill status={caseData.status} locale={locale} />
              {caseData.dueAt && (
                <span className={caseData.slaBreached ? 'text-red-600 font-medium' : ''}>
                  SLA: {formatTimeRemaining(caseData.dueAt)}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {onAssign && (
              <button
                onClick={onAssign}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {t('assign', { ru: 'Назначить', en: 'Assign', uk: 'Призначити' })}
              </button>
            )}
            {onStatusChange && (
              <button
                onClick={onStatusChange}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {t('changeStatus', { ru: 'Статус', en: 'Status', uk: 'Статус' })}
              </button>
            )}
            {onAddComment && (
              <button
                onClick={onAddComment}
                className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
              >
                {t('addComment', { ru: 'Комментарий', en: 'Comment', uk: 'Коментар' })}
              </button>
            )}
            {onResolve && caseData.status !== 'resolved' && caseData.status !== 'closed' && (
              <button
                onClick={onResolve}
                className="px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                {t('resolve', { ru: 'Решить', en: 'Resolve', uk: 'Вирішити' })}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Reporter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
          <div className="text-xs font-medium text-gray-500 uppercase mb-2">
            {t('reporter', { ru: 'Отправитель', en: 'Reporter', uk: 'Відправник' })}
          </div>
          <div className="text-sm text-gray-900">{caseData.reporterName || '-'}</div>
          {caseData.reporterEmail && (
            <div className="text-xs text-gray-500">{caseData.reporterEmail}</div>
          )}
        </div>

        {/* Assignee */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
          <div className="text-xs font-medium text-gray-500 uppercase mb-2">
            {t('assignee', { ru: 'Исполнитель', en: 'Assignee', uk: 'Виконавець' })}
          </div>
          <div className="text-sm text-gray-900">
            {caseData.assignedToUserName || (
              <span className="text-amber-600">
                {t('unassigned', { ru: 'Не назначен', en: 'Unassigned', uk: 'Не призначено' })}
              </span>
            )}
          </div>
          {caseData.assignedToRole && (
            <div className="text-xs text-gray-500">{caseData.assignedToRole}</div>
          )}
        </div>

        {/* Scope */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
          <div className="text-xs font-medium text-gray-500 uppercase mb-2">
            {t('scope', { ru: 'Scope', en: 'Scope', uk: 'Scope' })}
          </div>
          <div className="text-sm text-gray-900">
            {caseData.scopeName || caseData.scopeType || '-'}
          </div>
          {caseData.scopeType && (
            <div className="text-xs text-gray-500 capitalize">{caseData.scopeType}</div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`
                px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors relative
                ${activeTab === tab.key
                  ? 'text-emerald-600 border-b-2 border-emerald-500 -mb-px'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              {tab.label[locale as keyof typeof tab.label] || tab.label.ru}
            </button>
          ))}
        </div>

        <div className="p-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {caseData.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {t('description', { ru: 'Описание', en: 'Description', uk: 'Опис' })}
                  </h3>
                  <div className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                    {caseData.description}
                  </div>
                </div>
              )}

              {caseData.clientSafeSummary && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    {t('clientSummary', { ru: 'Сводка для клиента', en: 'Client Summary', uk: 'Зведення для клієнта' })}
                  </h3>
                  <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-100">
                    {caseData.clientSafeSummary}
                  </div>
                </div>
              )}

              {caseData.resolutionNotes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    {t('resolution', { ru: 'Решение', en: 'Resolution', uk: 'Рішення' })}
                  </h3>
                  <div className="text-sm text-gray-600 bg-green-50 p-4 rounded-lg border border-green-100">
                    {caseData.resolutionNotes}
                  </div>
                </div>
              )}

              {caseData.threadId && (
                <div className="pt-4 border-t border-gray-100">
                  <Link
                    href={`/m/comms/thread/${caseData.threadId}`}
                    className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {t('viewThread', { ru: 'Открыть тред коммуникаций', en: 'Open Communication Thread', uk: 'Відкрити тред комунікацій' })}
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timeline' && (
            <CsCaseTimeline caseId={caseData.id} locale={locale} />
          )}

          {activeTab === 'comments' && (
            <CsCaseComments caseId={caseData.id} locale={locale} onAddComment={onAddComment} />
          )}

          {activeTab === 'links' && (
            <CsCaseLinksPanel caseId={caseData.id} locale={locale} onLinkObject={onLinkObject} />
          )}

          {activeTab === 'tasks' && (
            <div className="text-sm text-gray-500 text-center py-8">
              {t('tasksComingSoon', { ru: 'Связанные задачи', en: 'Related Tasks', uk: 'Пов\'язані задачі' })}
              {onCreateTask && (
                <button
                  onClick={onCreateTask}
                  className="mt-4 px-4 py-2 text-sm font-medium text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50"
                >
                  {t('createTask', { ru: 'Создать задачу', en: 'Create Task', uk: 'Створити задачу' })}
                </button>
              )}
            </div>
          )}

          {activeTab === 'sla' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">
                    {t('slaPolicy', { ru: 'SLA Политика', en: 'SLA Policy', uk: 'SLA Політика' })}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {caseData.slaPolicyName || '-'}
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${caseData.slaBreached ? 'bg-red-50' : 'bg-green-50'}`}>
                  <div className="text-xs text-gray-500 mb-1">
                    {t('slaStatus', { ru: 'Статус SLA', en: 'SLA Status', uk: 'Статус SLA' })}
                  </div>
                  <div className={`text-sm font-medium ${caseData.slaBreached ? 'text-red-700' : 'text-green-700'}`}>
                    {caseData.slaBreached
                      ? t('breached', { ru: 'Нарушен', en: 'Breached', uk: 'Порушено' })
                      : t('onTrack', { ru: 'В норме', en: 'On Track', uk: 'В нормі' })
                    }
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {caseData.responseDueAt && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">
                      {t('responseDue', { ru: 'Ответ до', en: 'Response Due', uk: 'Відповідь до' })}
                    </div>
                    <div className="text-sm text-gray-900">
                      {new Date(caseData.responseDueAt).toLocaleString(locale)}
                    </div>
                  </div>
                )}
                {caseData.dueAt && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">
                      {t('resolutionDue', { ru: 'Решение до', en: 'Resolution Due', uk: 'Рішення до' })}
                    </div>
                    <div className="text-sm text-gray-900">
                      {new Date(caseData.dueAt).toLocaleString(locale)}
                    </div>
                  </div>
                )}
              </div>

              {caseData.escalationLevel && caseData.escalationLevel > 0 && (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="text-sm font-medium text-amber-800">
                    {t('escalationLevel', {
                      ru: `Уровень эскалации: ${caseData.escalationLevel}`,
                      en: `Escalation Level: ${caseData.escalationLevel}`,
                      uk: `Рівень ескалації: ${caseData.escalationLevel}`,
                    })}
                  </div>
                  {caseData.lastEscalationAt && (
                    <div className="text-xs text-amber-600 mt-1">
                      {t('lastEscalation', { ru: 'Последняя эскалация', en: 'Last escalation', uk: 'Остання ескалація' })}: {new Date(caseData.lastEscalationAt).toLocaleString(locale)}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="text-sm text-gray-500 text-center py-8">
              {t('auditEvents', { ru: 'История аудита', en: 'Audit Events', uk: 'Історія аудиту' })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
