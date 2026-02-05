'use client';

/**
 * Data Quality Exception Detail Component
 */

import { useState } from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { DqException, DQ_EXCEPTION_STATUS_CONFIG, getSlaBadgeColor } from '../schema/dqException';
import { DQ_DOMAINS, DqDomain } from '../config';
import { DqSeverityPill } from './DqSeverityPill';

interface DqExceptionDetailProps {
  exception: DqException;
  lang?: 'ru' | 'en' | 'uk';
  onCreateTask?: () => void;
  onResolve?: (reason: string) => void;
  onRerun?: () => void;
}

export function DqExceptionDetail({
  exception,
  lang: propLang,
  onCreateTask,
  onResolve,
  onRerun,
}: DqExceptionDetailProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'remediation' | 'tasks' | 'audit'>('overview');
  const [resolveReason, setResolveReason] = useState('');

  const labels = {
    tabs: {
      overview: { ru: 'Обзор', en: 'Overview', uk: 'Огляд' },
      evidence: { ru: 'Доказательства', en: 'Evidence', uk: 'Докази' },
      remediation: { ru: 'Исправление', en: 'Remediation', uk: 'Виправлення' },
      tasks: { ru: 'Задачи', en: 'Tasks', uk: 'Завдання' },
      audit: { ru: 'Аудит', en: 'Audit', uk: 'Аудит' },
    },
    fields: {
      domain: { ru: 'Домен', en: 'Domain', uk: 'Домен' },
      rule: { ru: 'Правило', en: 'Rule', uk: 'Правило' },
      severity: { ru: 'Severity', en: 'Severity', uk: 'Severity' },
      status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
      slaDue: { ru: 'SLA срок', en: 'SLA Due', uk: 'SLA термін' },
      created: { ru: 'Создано', en: 'Created', uk: 'Створено' },
      scope: { ru: 'Scope', en: 'Scope', uk: 'Scope' },
      description: { ru: 'Описание', en: 'Description', uk: 'Опис' },
    },
    actions: {
      createTask: { ru: 'Создать задачу', en: 'Create Task', uk: 'Створити завдання' },
      resolve: { ru: 'Решить', en: 'Resolve', uk: 'Вирішити' },
      rerun: { ru: 'Перезапустить проверки', en: 'Re-run Checks', uk: 'Перезапустити перевірки' },
    },
    evidence: {
      collection: { ru: 'Коллекция', en: 'Collection', uk: 'Колекція' },
      record: { ru: 'Запись', en: 'Record', uk: 'Запис' },
      field: { ru: 'Поле', en: 'Field', uk: 'Поле' },
      value: { ru: 'Значение', en: 'Value', uk: 'Значення' },
      expected: { ru: 'Ожидалось', en: 'Expected', uk: 'Очікувалось' },
    },
    resolveModal: {
      title: { ru: 'Решить исключение', en: 'Resolve Exception', uk: 'Вирішити виняток' },
      reason: { ru: 'Причина решения', en: 'Resolution Reason', uk: 'Причина вирішення' },
      placeholder: { ru: 'Опишите, как была исправлена проблема...', en: 'Describe how the issue was fixed...', uk: 'Опишіть, як було виправлено проблему...' },
      submit: { ru: 'Подтвердить', en: 'Confirm', uk: 'Підтвердити' },
    },
  };

  const domainConfig = DQ_DOMAINS[exception.domain as DqDomain];
  const statusConfig = DQ_EXCEPTION_STATUS_CONFIG[exception.status];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSlaDue = (slaDueAt: string) => {
    const now = new Date();
    const due = new Date(slaDueAt);
    const diff = due.getTime() - now.getTime();
    const hours = Math.round(diff / (1000 * 60 * 60));

    if (hours < 0) {
      const overdue = Math.abs(hours);
      return {
        text: lang === 'ru' ? `Просрочено на ${overdue}ч` : `Overdue by ${overdue}h`,
        color: 'text-red-600 bg-red-50',
      };
    }
    if (hours < 24) {
      return { text: `${hours}h`, color: 'text-amber-600 bg-amber-50' };
    }
    const days = Math.round(hours / 24);
    return { text: `${days}d`, color: 'text-gray-600 bg-gray-50' };
  };

  const sla = formatSlaDue(exception.slaDueAt);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <DqSeverityPill severity={exception.severity} lang={lang} />
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                exception.status === 'open' ? 'bg-red-100 text-red-700' :
                exception.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                exception.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {statusConfig?.label[lang] || exception.status}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${sla.color}`}>
                SLA: {sla.text}
              </span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">{exception.title}</h1>
            {exception.description && (
              <p className="text-sm text-gray-500 mt-2">{exception.description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        {exception.status !== 'resolved' && (
          <div className="flex items-center gap-3 mt-4">
            {onCreateTask && (
              <button
                onClick={onCreateTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {labels.actions.createTask[lang]}
              </button>
            )}
            {onResolve && (
              <button
                onClick={() => {
                  const reason = prompt(labels.resolveModal.placeholder[lang]);
                  if (reason) onResolve(reason);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                {labels.actions.resolve[lang]}
              </button>
            )}
            {onRerun && (
              <button
                onClick={onRerun}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                {labels.actions.rerun[lang]}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {(['overview', 'evidence', 'remediation', 'tasks', 'audit'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {labels.tabs[tab][lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.domain[lang]}</label>
                <div className="mt-1 flex items-center gap-2">
                  <span>{domainConfig?.icon}</span>
                  <span className="font-medium">{domainConfig?.label[lang] || exception.domain}</span>
                </div>
              </div>

              {exception.ruleName && (
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.rule[lang]}</label>
                  <div className="mt-1">
                    <Link href={`/m/data-quality/rule/${exception.ruleId}`} className="text-blue-600 hover:underline">
                      {exception.ruleName}
                    </Link>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.scope[lang]}</label>
                <div className="mt-1 font-medium">{exception.scopeType || 'global'}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.slaDue[lang]}</label>
                <div className="mt-1 text-sm">{formatDate(exception.slaDueAt)}</div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.created[lang]}</label>
                <div className="mt-1 text-sm text-gray-600">{formatDate(exception.createdAt)}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-4">
            {exception.evidenceRefs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-2 px-3">{labels.evidence.collection[lang]}</th>
                      <th className="text-left py-2 px-3">{labels.evidence.record[lang]}</th>
                      <th className="text-left py-2 px-3">{labels.evidence.field[lang]}</th>
                      <th className="text-left py-2 px-3">{labels.evidence.value[lang]}</th>
                      <th className="text-left py-2 px-3">{labels.evidence.expected[lang]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exception.evidenceRefs.map((ref, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="py-2 px-3 font-mono text-xs">{ref.collection}</td>
                        <td className="py-2 px-3 font-mono text-xs">{ref.recordId}</td>
                        <td className="py-2 px-3">{ref.field || '-'}</td>
                        <td className="py-2 px-3 text-red-600">{String(ref.value ?? 'null')}</td>
                        <td className="py-2 px-3 text-emerald-600">{String(ref.expectedValue ?? '-')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                {lang === 'ru' ? 'Нет доказательств' : 'No evidence'}
              </p>
            )}
          </div>
        )}

        {activeTab === 'remediation' && (
          <div className="space-y-4">
            {exception.remediation ? (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">{exception.remediation.suggestedAction}</p>
                {exception.remediation.notes && (
                  <p className="text-sm text-gray-600 mt-2">{exception.remediation.notes}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                {lang === 'ru' ? 'Рекомендации по исправлению будут добавлены' : 'Remediation suggestions will be added'}
              </p>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="text-center py-8 text-gray-500">
            {exception.linkedTaskIds && exception.linkedTaskIds.length > 0 ? (
              <div className="space-y-2">
                {exception.linkedTaskIds.map((taskId) => (
                  <Link key={taskId} href={`/m/workflow/task/${taskId}`} className="block text-blue-600 hover:underline">
                    {taskId}
                  </Link>
                ))}
              </div>
            ) : (
              lang === 'ru' ? 'Связанные задачи появятся здесь' : 'Linked tasks will appear here'
            )}
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="text-center py-8 text-gray-500">
            {lang === 'ru' ? 'История изменений появится здесь' : 'Change history will appear here'}
          </div>
        )}
      </div>
    </div>
  );
}
