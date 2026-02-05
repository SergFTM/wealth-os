'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { SbStatusPill } from './SbStatusPill';

interface SyncJob {
  id: string;
  envId: string;
  connectorId: string;
  jobType: 'pull' | 'push' | 'sync' | 'validate';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  entityType?: string;
  recordsProcessed?: number;
  recordsCreated?: number;
  recordsUpdated?: number;
  errorCount?: number;
  summaryJson?: { durationMs?: number; payloadIds?: string[]; mappingApplied?: boolean; errorDetails?: Array<{ code: string; message: string }> };
  triggeredBy?: string;
  startedAt?: string;
  finishedAt?: string;
  createdAt: string;
}

interface SbJobDetailProps {
  job: SyncJob;
  onRetry?: () => void;
  onViewPayloads?: () => void;
}

const i18n = {
  ru: { back: '← Назад', info: 'Информация', metrics: 'Метрики', errors: 'Ошибки', payloads: 'Payloads', retry: 'Retry', viewPayloads: 'Посмотреть payloads', noErrors: 'Нет ошибок', duration: 'Длительность', mappingApplied: 'Маппинг применен' },
  en: { back: '← Back', info: 'Information', metrics: 'Metrics', errors: 'Errors', payloads: 'Payloads', retry: 'Retry', viewPayloads: 'View payloads', noErrors: 'No errors', duration: 'Duration', mappingApplied: 'Mapping Applied' },
  uk: { back: '← Назад', info: 'Інформація', metrics: 'Метрики', errors: 'Помилки', payloads: 'Payloads', retry: 'Retry', viewPayloads: 'Переглянути payloads', noErrors: 'Немає помилок', duration: 'Тривалість', mappingApplied: 'Маппінг застосовано' },
};

export function SbJobDetail({ job, onRetry, onViewPayloads }: SbJobDetailProps) {
  const router = useRouter();
  const { locale } = useApp();
  const t = i18n[locale];

  const duration = job.summaryJson?.durationMs
    ? job.summaryJson.durationMs < 1000
      ? `${job.summaryJson.durationMs}ms`
      : `${(job.summaryJson.durationMs / 1000).toFixed(1)}s`
    : '-';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/m/sandbox/list?tab=jobs')}
            className="text-sm text-stone-500 hover:text-stone-700 mb-2"
          >
            {t.back}
          </button>
          <h1 className="text-2xl font-bold text-stone-800">{job.id}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded">{job.jobType}</span>
            <span className="text-sm text-stone-500">{job.entityType}</span>
          </div>
        </div>
        <SbStatusPill status={job.status} size="md" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-indigo-100/50 p-4">
          <div className="text-2xl font-bold text-stone-800">{job.recordsProcessed?.toLocaleString() || 0}</div>
          <div className="text-xs text-stone-500">Processed</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-emerald-100/50 p-4">
          <div className="text-2xl font-bold text-emerald-600">{job.recordsCreated?.toLocaleString() || 0}</div>
          <div className="text-xs text-stone-500">Created</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-blue-100/50 p-4">
          <div className="text-2xl font-bold text-blue-600">{job.recordsUpdated?.toLocaleString() || 0}</div>
          <div className="text-xs text-stone-500">Updated</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-rose-100/50 p-4">
          <div className="text-2xl font-bold text-rose-600">{job.errorCount || 0}</div>
          <div className="text-xs text-stone-500">Errors</div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-indigo-100/50 p-4">
          <div className="text-xl font-bold text-stone-800">{duration}</div>
          <div className="text-xs text-stone-500">{t.duration}</div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
        <h3 className="font-semibold text-stone-800 mb-4">{t.info}</h3>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-stone-500">Environment</dt>
            <dd className="text-sm font-medium text-stone-800">{job.envId}</dd>
          </div>
          <div>
            <dt className="text-sm text-stone-500">Connector</dt>
            <dd className="text-sm font-medium text-indigo-600 cursor-pointer hover:underline"
                onClick={() => router.push(`/m/sandbox/connector/${job.connectorId}`)}>
              {job.connectorId}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-stone-500">Started</dt>
            <dd className="text-sm font-medium text-stone-800">
              {job.startedAt ? new Date(job.startedAt).toLocaleString() : '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-stone-500">Finished</dt>
            <dd className="text-sm font-medium text-stone-800">
              {job.finishedAt ? new Date(job.finishedAt).toLocaleString() : '-'}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-stone-500">Triggered by</dt>
            <dd className="text-sm font-medium text-stone-800">{job.triggeredBy || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm text-stone-500">{t.mappingApplied}</dt>
            <dd className="text-sm font-medium text-stone-800">
              {job.summaryJson?.mappingApplied ? 'Yes' : 'No'}
            </dd>
          </div>
        </dl>
      </div>

      {/* Errors */}
      {job.summaryJson?.errorDetails && job.summaryJson.errorDetails.length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-rose-100/50 p-5">
          <h3 className="font-semibold text-rose-700 mb-4">{t.errors}</h3>
          <div className="space-y-2">
            {job.summaryJson.errorDetails.map((err, idx) => (
              <div key={idx} className="p-3 bg-rose-50 rounded-lg">
                <code className="text-xs text-rose-700 font-semibold">{err.code}</code>
                <p className="text-sm text-rose-600 mt-1">{err.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-indigo-100/50 p-5">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            onClick={onViewPayloads}
            className="bg-gradient-to-r from-indigo-500 to-purple-500"
          >
            {t.viewPayloads}
          </Button>
          {job.status === 'failed' && (
            <Button variant="secondary" onClick={onRetry}>
              {t.retry}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
