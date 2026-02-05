"use client";

import { Play, FileText, AlertTriangle, Download, Clock, CheckCircle, XCircle } from 'lucide-react';
import { IhStatusPill } from './IhStatusPill';

interface SyncRun {
  id: string;
  jobId: string;
  connectorId: string;
  startedAt: string;
  endedAt: string | null;
  status: 'success' | 'failed' | 'partial' | 'running';
  recordsIngested: number;
  errorsCount: number;
  logPath: string | null;
}

interface IhRunsTableProps {
  runs: SyncRun[];
  jobNames?: Record<string, string>;
  connectorNames?: Record<string, string>;
  onRowClick?: (run: SyncRun) => void;
  onRetry?: (run: SyncRun) => void;
  onCreateIssue?: (run: SyncRun) => void;
  onExportLog?: (run: SyncRun) => void;
  compact?: boolean;
}

export function IhRunsTable({
  runs,
  jobNames = {},
  connectorNames = {},
  onRowClick,
  onRetry,
  onCreateIssue,
  onExportLog,
  compact = false,
}: IhRunsTableProps) {
  const displayRuns = compact ? runs.slice(0, 10) : runs;

  const formatDateTime = (date: string | null): string => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = (start: string, end: string | null): string => {
    if (!end) return 'В процессе...';
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationMs = endTime - startTime;

    const seconds = Math.floor(durationMs / 1000);
    if (seconds < 60) return `${seconds}с`;

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}м ${remainingSeconds}с`;

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}ч ${remainingMinutes}м`;
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Run ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Job</th>
              {!compact && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Коннектор</th>
              )}
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Начало</th>
              {!compact && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Длительность</th>
              )}
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Записи</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Ошибки</th>
              {!compact && (
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Действия</th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayRuns.map((run) => (
              <tr
                key={run.id}
                onClick={() => onRowClick?.(run)}
                className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-stone-600">{run.id}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-stone-800">
                    {jobNames[run.jobId] || run.jobId}
                  </div>
                  {compact && (
                    <div className="text-xs text-stone-500">
                      {connectorNames[run.connectorId] || run.connectorId}
                    </div>
                  )}
                </td>
                {!compact && (
                  <td className="px-4 py-3 text-stone-600">
                    {connectorNames[run.connectorId] || run.connectorId}
                  </td>
                )}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-stone-600">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {formatDateTime(run.startedAt)}
                  </div>
                </td>
                {!compact && (
                  <td className="px-4 py-3 text-stone-600">
                    {calculateDuration(run.startedAt, run.endedAt)}
                  </td>
                )}
                <td className="px-4 py-3 text-center">
                  <IhStatusPill status={run.status} size="sm" />
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="inline-flex items-center gap-1 text-stone-600">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    {run.recordsIngested.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {run.errorsCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                      <XCircle className="w-3.5 h-3.5" />
                      {run.errorsCount}
                    </span>
                  ) : (
                    <span className="text-stone-400">0</span>
                  )}
                </td>
                {!compact && (
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {run.status === 'failed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRetry?.(run);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Play className="w-3 h-3" />
                          Retry
                        </button>
                      )}
                      {run.errorsCount > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCreateIssue?.(run);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          Issue
                        </button>
                      )}
                      {run.logPath && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onExportLog?.(run);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {runs.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет запусков для отображения
        </div>
      )}
    </div>
  );
}
