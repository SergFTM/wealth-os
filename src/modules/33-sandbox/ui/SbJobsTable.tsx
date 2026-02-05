'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { SbStatusPill } from './SbStatusPill';

interface SyncJob {
  id: string;
  envId: string;
  connectorId: string;
  jobType: 'pull' | 'push' | 'sync' | 'validate';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  entityType?: string;
  recordsProcessed?: number;
  errorCount?: number;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
}

interface SbJobsTableProps {
  jobs: SyncJob[];
  onRetry?: (id: string) => void;
  onViewPayloads?: (id: string) => void;
}

const i18n = {
  ru: { jobId: 'Job ID', env: 'Среда', connector: 'Коннектор', type: 'Тип', entity: 'Entity', status: 'Статус', records: 'Записей', errors: 'Ошибок', started: 'Начало', actions: 'Действия', retry: 'Retry', payloads: 'Payloads', noData: 'Нет jobs' },
  en: { jobId: 'Job ID', env: 'Env', connector: 'Connector', type: 'Type', entity: 'Entity', status: 'Status', records: 'Records', errors: 'Errors', started: 'Started', actions: 'Actions', retry: 'Retry', payloads: 'Payloads', noData: 'No jobs' },
  uk: { jobId: 'Job ID', env: 'Середовище', connector: 'Конектор', type: 'Тип', entity: 'Entity', status: 'Статус', records: 'Записів', errors: 'Помилок', started: 'Початок', actions: 'Дії', retry: 'Retry', payloads: 'Payloads', noData: 'Немає jobs' },
};

export function SbJobsTable({ jobs, onRetry, onViewPayloads }: SbJobsTableProps) {
  const router = useRouter();
  const { locale } = useApp();
  const t = i18n[locale];

  if (jobs.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-8 text-center">
        <p className="text-stone-500">{t.noData}</p>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{t.jobId}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{t.connector}</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-500 uppercase">{t.type}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{t.entity}</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-500 uppercase">{t.status}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-500 uppercase">{t.records}</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-500 uppercase">{t.errors}</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{t.started}</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-500 uppercase">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={job.id}
                className="border-b border-stone-50 hover:bg-indigo-50/50 cursor-pointer transition-colors"
                onClick={() => router.push(`/m/sandbox/job/${job.id}`)}
              >
                <td className="px-4 py-3">
                  <code className="text-xs text-stone-700">{job.id}</code>
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">{job.connectorId}</td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded">{job.jobType}</span>
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">{job.entityType || '-'}</td>
                <td className="px-4 py-3 text-center">
                  <SbStatusPill status={job.status} />
                </td>
                <td className="px-4 py-3 text-sm text-stone-800 text-right font-mono">
                  {job.recordsProcessed?.toLocaleString() || '-'}
                </td>
                <td className="px-4 py-3 text-right">
                  {job.errorCount ? (
                    <span className="text-sm font-medium text-rose-600">{job.errorCount}</span>
                  ) : (
                    <span className="text-sm text-stone-400">0</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-stone-600">
                  {job.startedAt ? new Date(job.startedAt).toLocaleString() : '-'}
                </td>
                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-2">
                    {job.status === 'failed' && (
                      <button
                        onClick={() => onRetry?.(job.id)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        {t.retry}
                      </button>
                    )}
                    <button
                      onClick={() => onViewPayloads?.(job.id)}
                      className="text-xs text-stone-500 hover:text-stone-700"
                    >
                      {t.payloads}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
