/**
 * Data Quality Sync Job Schema
 * Monitoring of data synchronization jobs
 */

export type DqSyncJobStatus = 'success' | 'failed' | 'running' | 'pending' | 'cancelled';
export type DqSyncJobType = 'pull' | 'push' | 'reconcile' | 'full_sync';

export interface SyncAttempt {
  attemptAt: string;
  status: DqSyncJobStatus;
  errorMessage?: string;
  recordsProcessed?: number;
}

export interface DqSyncJob {
  id: string;
  clientId?: string;
  connectorKey: string;
  connectorName?: string;
  jobType: DqSyncJobType;
  scopeType?: 'global' | 'household' | 'entity' | 'account';
  scopeId?: string;
  status: DqSyncJobStatus;
  lastRunAt?: string;
  lastSuccessAt?: string;
  errorSnippet?: string;
  attempts: SyncAttempt[];
  recordsProcessed?: number;
  nextRetryAt?: string;
  linkedExceptionIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DqSyncJobCreateInput {
  clientId?: string;
  connectorKey: string;
  connectorName?: string;
  jobType: DqSyncJobType;
  scopeType?: DqSyncJob['scopeType'];
  scopeId?: string;
}

export const DQ_SYNC_JOB_STATUS_CONFIG: Record<DqSyncJobStatus, { label: { ru: string; en: string; uk: string }; color: string; icon: string }> = {
  success: { label: { ru: 'Успешно', en: 'Success', uk: 'Успішно' }, color: 'emerald', icon: '✓' },
  failed: { label: { ru: 'Ошибка', en: 'Failed', uk: 'Помилка' }, color: 'red', icon: '✗' },
  running: { label: { ru: 'Выполняется', en: 'Running', uk: 'Виконується' }, color: 'blue', icon: '⟳' },
  pending: { label: { ru: 'Ожидает', en: 'Pending', uk: 'Очікує' }, color: 'gray', icon: '⏳' },
  cancelled: { label: { ru: 'Отменено', en: 'Cancelled', uk: 'Скасовано' }, color: 'gray', icon: '⊘' },
};

export const DQ_SYNC_JOB_TYPE_CONFIG: Record<DqSyncJobType, { label: { ru: string; en: string; uk: string } }> = {
  pull: { label: { ru: 'Получение', en: 'Pull', uk: 'Отримання' } },
  push: { label: { ru: 'Отправка', en: 'Push', uk: 'Відправка' } },
  reconcile: { label: { ru: 'Сверка', en: 'Reconcile', uk: 'Звірка' } },
  full_sync: { label: { ru: 'Полная синхр.', en: 'Full Sync', uk: 'Повна синхр.' } },
};

export function getJobHealthScore(job: DqSyncJob): number {
  if (job.status === 'success') return 100;
  if (job.status === 'running') return 80;
  if (job.status === 'pending') return 70;
  if (job.status === 'failed') {
    const failedCount = job.attempts.filter(a => a.status === 'failed').length;
    return Math.max(0, 50 - failedCount * 10);
  }
  return 50;
}
