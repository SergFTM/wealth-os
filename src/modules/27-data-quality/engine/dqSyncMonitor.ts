/**
 * Data Quality Sync Monitor
 * Monitors sync job health and creates alerts
 */

import { DqSyncJob, DqSyncJobCreateInput, SyncAttempt, DqSyncJobStatus } from '../schema/dqSyncJob';

export interface SyncHealthSummary {
  totalJobs: number;
  successCount: number;
  failedCount: number;
  runningCount: number;
  healthPct: number;
  criticalConnectors: string[];
}

export function computeSyncHealth(jobs: DqSyncJob[]): SyncHealthSummary {
  const totalJobs = jobs.length;
  const successCount = jobs.filter(j => j.status === 'success').length;
  const failedCount = jobs.filter(j => j.status === 'failed').length;
  const runningCount = jobs.filter(j => j.status === 'running').length;

  const healthPct = totalJobs > 0
    ? Math.round((successCount / totalJobs) * 100)
    : 100;

  const criticalConnectors = jobs
    .filter(j => j.status === 'failed' && j.attempts.length >= 3)
    .map(j => j.connectorName || j.connectorKey);

  return {
    totalJobs,
    successCount,
    failedCount,
    runningCount,
    healthPct,
    criticalConnectors,
  };
}

export function getJobsFailedInPeriod(jobs: DqSyncJob[], hours: number = 24): DqSyncJob[] {
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - hours);

  return jobs.filter(j => {
    if (j.status !== 'failed') return false;
    const lastRun = j.lastRunAt ? new Date(j.lastRunAt) : null;
    return lastRun && lastRun >= cutoff;
  });
}

export function simulateJobRun(job: DqSyncJob): DqSyncJob {
  const now = new Date().toISOString();
  const success = Math.random() > 0.2; // 80% success rate

  const attempt: SyncAttempt = {
    attemptAt: now,
    status: success ? 'success' : 'failed',
    errorMessage: success ? undefined : 'Connection timeout',
    recordsProcessed: success ? Math.floor(Math.random() * 1000) + 100 : 0,
  };

  return {
    ...job,
    status: success ? 'success' : 'failed',
    lastRunAt: now,
    lastSuccessAt: success ? now : job.lastSuccessAt,
    errorSnippet: success ? undefined : attempt.errorMessage,
    attempts: [...job.attempts, attempt].slice(-10),
    recordsProcessed: success ? attempt.recordsProcessed : job.recordsProcessed,
    updatedAt: now,
  };
}

export function shouldRetry(job: DqSyncJob): boolean {
  if (job.status !== 'failed') return false;

  const recentAttempts = job.attempts.filter(a => {
    const attemptTime = new Date(a.attemptAt);
    const hourAgo = new Date();
    hourAgo.setHours(hourAgo.getHours() - 1);
    return attemptTime >= hourAgo;
  });

  // Don't retry if more than 3 attempts in last hour
  return recentAttempts.length < 3;
}

export function scheduleRetry(job: DqSyncJob): string {
  const failedAttempts = job.attempts.filter(a => a.status === 'failed').length;
  const delayMinutes = Math.min(5 * Math.pow(2, failedAttempts - 1), 60);

  const retryAt = new Date();
  retryAt.setMinutes(retryAt.getMinutes() + delayMinutes);

  return retryAt.toISOString();
}

export function getConnectorStats(jobs: DqSyncJob[]): Record<string, { success: number; failed: number; total: number }> {
  const stats: Record<string, { success: number; failed: number; total: number }> = {};

  for (const job of jobs) {
    const key = job.connectorKey;
    if (!stats[key]) {
      stats[key] = { success: 0, failed: 0, total: 0 };
    }
    stats[key].total++;
    if (job.status === 'success') stats[key].success++;
    if (job.status === 'failed') stats[key].failed++;
  }

  return stats;
}

export const DEMO_CONNECTORS = [
  { key: 'plaid', name: 'Plaid Banking' },
  { key: 'yodlee', name: 'Yodlee' },
  { key: 'addepar', name: 'Addepar' },
  { key: 'orion', name: 'Orion' },
  { key: 'blackdiamond', name: 'Black Diamond' },
  { key: 'schwab', name: 'Charles Schwab' },
  { key: 'fidelity', name: 'Fidelity' },
  { key: 'interactive_brokers', name: 'Interactive Brokers' },
];
