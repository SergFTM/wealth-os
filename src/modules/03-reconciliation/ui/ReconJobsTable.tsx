"use client";

import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ReconJob {
  id: string;
  clientId?: string;
  feedId: string;
  feedName?: string;
  asOf: string;
  scope?: string[];
  matchPct?: number | null;
  breaksCount?: number | null;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  finishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ReconJobsTableProps {
  jobs: ReconJob[];
  loading?: boolean;
  limit?: number;
  onRowClick?: (job: ReconJob) => void;
  onRerun?: (jobId: string) => void;
}

const statusConfig = {
  running: { color: 'bg-blue-100 text-blue-700', label: 'Выполняется' },
  completed: { color: 'bg-emerald-100 text-emerald-700', label: 'Завершено' },
  failed: { color: 'bg-rose-100 text-rose-700', label: 'Ошибка' }
};

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function ReconJobsTable({ jobs, loading, limit = 5, onRowClick, onRerun }: ReconJobsTableProps) {
  const displayJobs = jobs.slice(0, limit);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-200/50 bg-stone-50/50">
          <h3 className="font-semibold text-stone-800">Последние прогоны сверки</h3>
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-stone-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (displayJobs.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center">
        <div className="text-stone-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-stone-500">Нет прогонов сверки</p>
        <p className="text-stone-400 text-sm">Запустите первую сверку для начала работы</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-200/50 bg-stone-50/50 flex items-center justify-between">
        <h3 className="font-semibold text-stone-800">Последние прогоны сверки</h3>
        <Link href="/m/reconciliation/list?tab=jobs" className="text-xs text-emerald-600 hover:underline">
          Все прогоны →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/30">
              <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">ID</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Источник</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">As-of</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Match %</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Breaks</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Статус</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Начат</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Действия</th>
            </tr>
          </thead>
          <tbody>
            {displayJobs.map((job) => (
              <tr
                key={job.id}
                className="border-b border-stone-50 hover:bg-stone-50/50 cursor-pointer transition-colors"
                onClick={() => onRowClick?.(job)}
              >
                <td className="py-2.5 px-3 font-mono text-xs text-stone-500">
                  {job.id.slice(0, 8)}
                </td>
                <td className="py-2.5 px-3 font-medium text-stone-800">
                  {job.feedName || job.feedId}
                </td>
                <td className="py-2.5 px-3 text-center text-stone-600">
                  {new Date(job.asOf).toLocaleDateString('ru-RU')}
                </td>
                <td className="py-2.5 px-3 text-center">
                  {job.matchPct !== null && job.matchPct !== undefined ? (
                    <span className={cn(
                      "font-medium",
                      job.matchPct >= 98 ? "text-emerald-600" : job.matchPct >= 95 ? "text-amber-600" : "text-rose-600"
                    )}>
                      {job.matchPct.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-stone-400">—</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-center">
                  {job.breaksCount !== null && job.breaksCount !== undefined ? (
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      job.breaksCount === 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    )}>
                      {job.breaksCount}
                    </span>
                  ) : (
                    <span className="text-stone-400">—</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className={cn("px-2 py-0.5 rounded text-xs font-medium", statusConfig[job.status].color)}>
                    {statusConfig[job.status].label}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center text-xs text-stone-500">
                  {formatDateTime(job.startedAt)}
                </td>
                <td className="py-2.5 px-3 text-right" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/m/reconciliation/item/${job.id}`}
                      className="px-2 py-1 text-xs text-stone-600 hover:bg-stone-100 rounded transition-colors"
                    >
                      Открыть
                    </Link>
                    {job.status !== 'running' && onRerun && (
                      <button
                        onClick={() => onRerun(job.id)}
                        className="px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                      >
                        Re-run
                      </button>
                    )}
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
