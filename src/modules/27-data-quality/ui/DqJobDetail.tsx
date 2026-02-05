'use client';

/**
 * Data Quality Sync Job Detail Component
 */

import { useI18n } from '@/lib/i18n';
import { DqSyncJob, DQ_SYNC_JOB_STATUS_CONFIG, DQ_SYNC_JOB_TYPE_CONFIG } from '../schema/dqSyncJob';

interface DqJobDetailProps {
  job: DqSyncJob;
  lang?: 'ru' | 'en' | 'uk';
  onRetry?: () => void;
  onCreateIncident?: () => void;
}

export function DqJobDetail({
  job,
  lang: propLang,
  onRetry,
  onCreateIncident,
}: DqJobDetailProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const labels = {
    title: { ru: 'Детали синхронизации', en: 'Sync Job Details', uk: 'Деталі синхронізації' },
    fields: {
      connector: { ru: 'Коннектор', en: 'Connector', uk: 'Конектор' },
      type: { ru: 'Тип задачи', en: 'Job Type', uk: 'Тип завдання' },
      scope: { ru: 'Scope', en: 'Scope', uk: 'Scope' },
      status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
      lastRun: { ru: 'Последний запуск', en: 'Last Run', uk: 'Останній запуск' },
      lastSuccess: { ru: 'Последний успех', en: 'Last Success', uk: 'Останній успіх' },
      records: { ru: 'Записей обработано', en: 'Records Processed', uk: 'Записів оброблено' },
      nextRetry: { ru: 'Следующая попытка', en: 'Next Retry', uk: 'Наступна спроба' },
    },
    timeline: { ru: 'История попыток', en: 'Attempt History', uk: 'Історія спроб' },
    error: { ru: 'Ошибка', en: 'Error', uk: 'Помилка' },
    actions: {
      retry: { ru: 'Повторить', en: 'Retry', uk: 'Повторити' },
      createIncident: { ru: 'Создать инцидент', en: 'Create Incident', uk: 'Створити інцидент' },
    },
  };

  const statusConfig = DQ_SYNC_JOB_STATUS_CONFIG[job.status];
  const typeConfig = DQ_SYNC_JOB_TYPE_CONFIG[job.jobType];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                job.status === 'success' ? 'bg-emerald-100 text-emerald-700' :
                job.status === 'failed' ? 'bg-red-100 text-red-700' :
                job.status === 'running' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                <span>{statusConfig?.icon}</span>
                {statusConfig?.label[lang] || job.status}
              </span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">
              {job.connectorName || job.connectorKey}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {typeConfig?.label[lang] || job.jobType}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {job.status === 'failed' && onRetry && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {labels.actions.retry[lang]}
              </button>
            )}
            {job.status === 'failed' && onCreateIncident && (
              <button
                onClick={onCreateIncident}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                {labels.actions.createIncident[lang]}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.connector[lang]}</label>
            <div className="mt-1 font-medium">{job.connectorName || job.connectorKey}</div>
            <div className="text-xs text-gray-500 font-mono">{job.connectorKey}</div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.type[lang]}</label>
            <div className="mt-1">{typeConfig?.label[lang] || job.jobType}</div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.scope[lang]}</label>
            <div className="mt-1">{job.scopeType || 'global'}</div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.records[lang]}</label>
            <div className="mt-1 font-medium">{job.recordsProcessed || 0}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.lastRun[lang]}</label>
            <div className="mt-1 text-sm">{formatDate(job.lastRunAt)}</div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.lastSuccess[lang]}</label>
            <div className="mt-1 text-sm">{formatDate(job.lastSuccessAt)}</div>
          </div>

          {job.nextRetryAt && (
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.fields.nextRetry[lang]}</label>
              <div className="mt-1 text-sm">{formatDate(job.nextRetryAt)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {job.errorSnippet && (
        <div className="px-6 pb-6">
          <label className="text-xs text-gray-500 uppercase tracking-wide">{labels.error[lang]}</label>
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <pre className="text-sm text-red-700 whitespace-pre-wrap font-mono">
              {job.errorSnippet}
            </pre>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="p-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-4">{labels.timeline[lang]}</h3>
        {job.attempts.length > 0 ? (
          <div className="space-y-3">
            {job.attempts.slice().reverse().map((attempt, idx) => {
              const attemptStatus = DQ_SYNC_JOB_STATUS_CONFIG[attempt.status];
              return (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    attempt.status === 'success' ? 'bg-emerald-100 text-emerald-600' :
                    attempt.status === 'failed' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {attemptStatus?.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        {attemptStatus?.label[lang] || attempt.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(attempt.attemptAt)}
                      </span>
                    </div>
                    {attempt.errorMessage && (
                      <p className="text-xs text-red-600 mt-1">{attempt.errorMessage}</p>
                    )}
                    {attempt.recordsProcessed !== undefined && attempt.recordsProcessed > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        {attempt.recordsProcessed} {lang === 'ru' ? 'записей' : 'records'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            {lang === 'ru' ? 'Нет истории' : 'No history'}
          </p>
        )}
      </div>
    </div>
  );
}
