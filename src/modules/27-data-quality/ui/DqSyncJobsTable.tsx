'use client';

/**
 * Data Quality Sync Jobs Table Component
 */

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';
import { DqSyncJob, DQ_SYNC_JOB_STATUS_CONFIG, DQ_SYNC_JOB_TYPE_CONFIG } from '../schema/dqSyncJob';

interface DqSyncJobsTableProps {
  jobs: DqSyncJob[];
  lang?: 'ru' | 'en' | 'uk';
  onRetry?: (jobId: string) => void;
  onCreateIncident?: (jobId: string) => void;
}

export function DqSyncJobsTable({
  jobs,
  lang: propLang,
  onRetry,
  onCreateIncident,
}: DqSyncJobsTableProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const headers = {
    connector: { ru: 'Коннектор', en: 'Connector', uk: 'Конектор' },
    type: { ru: 'Тип', en: 'Type', uk: 'Тип' },
    scope: { ru: 'Scope', en: 'Scope', uk: 'Scope' },
    status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
    lastRun: { ru: 'Последний запуск', en: 'Last Run', uk: 'Останній запуск' },
    error: { ru: 'Ошибка', en: 'Error', uk: 'Помилка' },
    actions: { ru: 'Действия', en: 'Actions', uk: 'Дії' },
  };

  const actions = {
    open: { ru: 'Открыть', en: 'Open', uk: 'Відкрити' },
    retry: { ru: 'Повторить', en: 'Retry', uk: 'Повторити' },
    incident: { ru: 'Инцидент', en: 'Incident', uk: 'Інцидент' },
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {lang === 'ru' ? 'Нет синхронизаций' : lang === 'uk' ? 'Немає синхронізацій' : 'No sync jobs'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left py-3 px-4 font-medium text-gray-600">{headers.connector[lang]}</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">{headers.type[lang]}</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">{headers.scope[lang]}</th>
            <th className="text-center py-3 px-4 font-medium text-gray-600">{headers.status[lang]}</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">{headers.lastRun[lang]}</th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">{headers.error[lang]}</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">{headers.actions[lang]}</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => {
            const statusConfig = DQ_SYNC_JOB_STATUS_CONFIG[job.status];
            const typeConfig = DQ_SYNC_JOB_TYPE_CONFIG[job.jobType];

            return (
              <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <Link href={`/m/data-quality/job/${job.id}`} className="hover:text-blue-600">
                    <div className="font-medium text-gray-900">
                      {job.connectorName || job.connectorKey}
                    </div>
                    <div className="text-xs text-gray-500">{job.connectorKey}</div>
                  </Link>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {typeConfig?.label[lang] || job.jobType}
                </td>
                <td className="py-3 px-4 text-gray-600 text-xs">
                  {job.scopeType || 'global'}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    job.status === 'success' ? 'bg-emerald-100 text-emerald-700' :
                    job.status === 'failed' ? 'bg-red-100 text-red-700' :
                    job.status === 'running' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <span>{statusConfig?.icon}</span>
                    {statusConfig?.label[lang] || job.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs">
                  {formatDate(job.lastRunAt)}
                </td>
                <td className="py-3 px-4">
                  {job.errorSnippet ? (
                    <span className="text-xs text-red-600 truncate block max-w-[200px]" title={job.errorSnippet}>
                      {job.errorSnippet}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/m/data-quality/job/${job.id}`}
                      className="text-xs px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      {actions.open[lang]}
                    </Link>
                    {job.status === 'failed' && onRetry && (
                      <button
                        onClick={() => onRetry(job.id)}
                        className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        {actions.retry[lang]}
                      </button>
                    )}
                    {job.status === 'failed' && onCreateIncident && (
                      <button
                        onClick={() => onCreateIncident(job.id)}
                        className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        {actions.incident[lang]}
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
