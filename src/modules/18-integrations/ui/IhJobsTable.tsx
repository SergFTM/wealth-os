"use client";

import { Play, Pause, Settings, Clock, RefreshCw } from 'lucide-react';
import { IhStatusPill } from './IhStatusPill';

interface SyncJob {
  id: string;
  connectorId: string;
  name: string;
  scheduleCron: string;
  status: 'enabled' | 'paused';
  retryPolicyJson: string;
  slaMinutes: number;
  targetModules: string[];
}

interface IhJobsTableProps {
  jobs: SyncJob[];
  connectorNames?: Record<string, string>;
  onRowClick?: (job: SyncJob) => void;
  onRunNow?: (job: SyncJob) => void;
  onPause?: (job: SyncJob) => void;
  compact?: boolean;
}

export function IhJobsTable({
  jobs,
  connectorNames = {},
  onRowClick,
  onRunNow,
  onPause,
  compact = false,
}: IhJobsTableProps) {
  const displayJobs = compact ? jobs.slice(0, 10) : jobs;

  const formatCron = (cron: string): string => {
    // Simple cron to human readable
    const parts = cron.split(' ');
    if (parts.length < 5) return cron;

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return `Ежедневно в ${hour}:${minute.padStart(2, '0')}`;
    }
    if (dayOfMonth === '*' && month === '*' && dayOfWeek === '1') {
      return `Еженедельно Пн ${hour}:${minute.padStart(2, '0')}`;
    }
    if (dayOfMonth === '1' && month === '*') {
      return `Ежемесячно ${hour}:${minute.padStart(2, '0')}`;
    }
    if (dayOfWeek === '1-5') {
      return `Пн-Пт ${hour}:${minute.padStart(2, '0')}`;
    }
    return cron;
  };

  const getRetryPolicy = (json: string): string => {
    try {
      const policy = JSON.parse(json);
      return `${policy.maxRetries} retry`;
    } catch {
      return '—';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Job</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Коннектор</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Расписание</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
              {!compact && (
                <>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Retry</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">SLA</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Действия</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {displayJobs.map((job) => (
              <tr
                key={job.id}
                onClick={() => onRowClick?.(job)}
                className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-semibold text-stone-800">{job.name}</div>
                  {compact && (
                    <div className="text-xs text-stone-500">{formatCron(job.scheduleCron)}</div>
                  )}
                </td>
                <td className="px-4 py-3 text-stone-600">
                  {connectorNames[job.connectorId] || job.connectorId}
                </td>
                {!compact && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-stone-600">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      {formatCron(job.scheduleCron)}
                    </div>
                  </td>
                )}
                {compact && <td></td>}
                <td className="px-4 py-3 text-center">
                  <IhStatusPill status={job.status} size="sm" />
                </td>
                {!compact && (
                  <>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-stone-600 bg-stone-100 rounded">
                        <RefreshCw className="w-3 h-3" />
                        {getRetryPolicy(job.retryPolicyJson)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-stone-600">
                      {job.slaMinutes} мин
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRunNow?.(job);
                          }}
                          disabled={job.status === 'paused'}
                          className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Play className="w-3 h-3" />
                          Run
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPause?.(job);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                        >
                          {job.status === 'enabled' ? (
                            <Pause className="w-3 h-3" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {jobs.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет jobs для отображения
        </div>
      )}
    </div>
  );
}
