"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAuditEvents } from '@/lib/hooks';

interface ReconJob {
  id: string;
  clientId?: string;
  feedId: string;
  feedName?: string;
  asOf: string;
  scope?: string[];
  matchPct?: number | null;
  totalRecords?: number | null;
  matchedRecords?: number | null;
  breaksCount?: number | null;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  finishedAt?: string | null;
  triggeredBy?: string;
  errorMessage?: string;
  notes?: string | null;
}

interface ReconBreak {
  id: string;
  instrument?: string | null;
  breakType: string;
  severity: string;
  status: string;
}

interface ReconJobDetailProps {
  job: ReconJob | null;
  relatedBreaks?: ReconBreak[];
  open: boolean;
  onClose: () => void;
  onRerun?: (jobId: string) => void;
  onExport?: (jobId: string) => void;
  onBreakClick?: (breakId: string) => void;
  clientSafe?: boolean;
}

const statusConfig = {
  running: { color: 'bg-blue-100 text-blue-700 border-blue-300', label: 'Выполняется' },
  completed: { color: 'bg-emerald-100 text-emerald-700 border-emerald-300', label: 'Завершено' },
  failed: { color: 'bg-rose-100 text-rose-700 border-rose-300', label: 'Ошибка' }
};

const tabs = [
  { key: 'overview', label: 'Обзор' },
  { key: 'coverage', label: 'Coverage' },
  { key: 'results', label: 'Результат' },
  { key: 'breaks', label: 'Расхождения' },
  { key: 'audit', label: 'Аудит' }
];

export function ReconJobDetail({
  job,
  relatedBreaks = [],
  open,
  onClose,
  onRerun,
  onExport,
  onBreakClick,
  clientSafe
}: ReconJobDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { events, loading: auditLoading } = useAuditEvents(job?.id || null);

  if (!open || !job) return null;

  const duration = job.finishedAt && job.startedAt
    ? Math.round((new Date(job.finishedAt).getTime() - new Date(job.startedAt).getTime()) / 1000)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-gradient-to-r from-stone-50 to-stone-100/50">
          <div className="flex items-center gap-3">
            <span className={cn("px-3 py-1 rounded-lg text-sm font-semibold border", statusConfig[job.status].color)}>
              {statusConfig[job.status].label}
            </span>
            <div>
              <h2 className="font-bold text-stone-800">Прогон сверки</h2>
              <p className="text-xs text-stone-500">
                {job.feedName || job.feedId} • {new Date(job.asOf).toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-stone-200 flex gap-1">
          {tabs.filter(t => clientSafe ? t.key !== 'audit' : true).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.key
                  ? "border-emerald-500 text-emerald-700"
                  : "border-transparent text-stone-500 hover:text-stone-700"
              )}
            >
              {tab.label}
              {tab.key === 'breaks' && job.breaksCount ? (
                <span className="ml-1.5 px-1.5 py-0.5 rounded text-xs bg-rose-100 text-rose-700">
                  {job.breaksCount}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-stone-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-stone-500 uppercase mb-1">Match %</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    job.matchPct && job.matchPct >= 98 ? "text-emerald-600" : 
                    job.matchPct && job.matchPct >= 95 ? "text-amber-600" : "text-rose-600"
                  )}>
                    {job.matchPct !== null && job.matchPct !== undefined ? `${job.matchPct}%` : '—'}
                  </p>
                </div>
                <div className="bg-stone-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-stone-500 uppercase mb-1">Записей</p>
                  <p className="text-2xl font-bold text-stone-800">
                    {job.totalRecords ?? '—'}
                  </p>
                </div>
                <div className="bg-stone-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-stone-500 uppercase mb-1">Breaks</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    job.breaksCount === 0 ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {job.breaksCount ?? '—'}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-stone-700">Детали</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">ID:</span>
                    <span className="text-stone-800 font-mono">{job.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Client:</span>
                    <span className="text-stone-800">{job.clientId || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Источник:</span>
                    <span className="text-stone-800">{job.feedName || job.feedId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">As-of:</span>
                    <span className="text-stone-800">{new Date(job.asOf).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Начат:</span>
                    <span className="text-stone-800">{new Date(job.startedAt).toLocaleString('ru-RU')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Завершён:</span>
                    <span className="text-stone-800">
                      {job.finishedAt ? new Date(job.finishedAt).toLocaleString('ru-RU') : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Длительность:</span>
                    <span className="text-stone-800">{duration ? `${duration}с` : '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Инициатор:</span>
                    <span className="text-stone-800">{job.triggeredBy || 'System'}</span>
                  </div>
                </div>
              </div>

              {job.status === 'failed' && job.errorMessage && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-rose-800 mb-1">Ошибка</p>
                  <p className="text-sm text-rose-700">{job.errorMessage}</p>
                </div>
              )}

              {/* Actions */}
              {!clientSafe && (
                <div className="flex gap-2 pt-4 border-t border-stone-200">
                  {job.status !== 'running' && onRerun && (
                    <Button variant="primary" size="sm" onClick={() => onRerun(job.id)}>
                      Re-run
                    </Button>
                  )}
                  {onExport && (
                    <Button variant="secondary" size="sm" onClick={() => onExport(job.id)}>
                      Экспорт summary
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'coverage' && (
            <div className="space-y-6">
              <h4 className="font-semibold text-stone-700">Scope сверки</h4>
              <div className="flex gap-2">
                {(job.scope || []).map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-sm font-medium">
                    {s}
                  </span>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-stone-700">Источник данных</h4>
                <div className="bg-stone-50 rounded-lg p-4">
                  <p className="font-medium text-stone-800">{job.feedName || job.feedId}</p>
                  <p className="text-sm text-stone-500 mt-1">Feed ID: {job.feedId}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
              <h4 className="font-semibold text-stone-700">Результат сверки</h4>
              
              <div className="space-y-4">
                {(job.scope || ['positions', 'transactions', 'cash']).map(scope => (
                  <div key={scope} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                        {scope === 'positions' && '📊'}
                        {scope === 'transactions' && '💱'}
                        {scope === 'cash' && '💵'}
                      </div>
                      <span className="font-medium text-stone-800 capitalize">{scope}</span>
                    </div>
                    <StatusBadge status="ok" label="Matched" />
                  </div>
                ))}
              </div>

              {job.matchedRecords && job.totalRecords && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-emerald-700">Прогресс соответствия</span>
                    <span className="text-sm font-medium text-emerald-800">
                      {job.matchedRecords} / {job.totalRecords}
                    </span>
                  </div>
                  <div className="w-full bg-emerald-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full" 
                      style={{ width: `${(job.matchedRecords / job.totalRecords) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'breaks' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-stone-700">
                Связанные расхождения {job.breaksCount ? `(${job.breaksCount})` : ''}
              </h4>
              
              {relatedBreaks.length === 0 ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-emerald-700 font-medium">Нет расхождений</p>
                  <p className="text-emerald-600 text-sm">Все записи успешно сверены</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {relatedBreaks.slice(0, 10).map(brk => (
                    <div 
                      key={brk.id}
                      onClick={() => onBreakClick?.(brk.id)}
                      className="flex items-center justify-between p-3 bg-stone-50 rounded-lg hover:bg-stone-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-xs font-medium",
                          brk.severity === 'critical' ? "bg-rose-100 text-rose-700" :
                          brk.severity === 'high' ? "bg-orange-100 text-orange-700" :
                          "bg-amber-100 text-amber-700"
                        )}>
                          {brk.severity}
                        </span>
                        <span className="text-sm text-stone-800">
                          {brk.instrument || brk.breakType}
                        </span>
                      </div>
                      <StatusBadge 
                        status={brk.status === 'resolved' ? 'ok' : brk.status === 'open' ? 'critical' : 'pending'}
                        label={brk.status}
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'audit' && !clientSafe && (
            <div className="space-y-4">
              <h4 className="font-semibold text-stone-700">История изменений</h4>
              {auditLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 bg-stone-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : events.length === 0 ? (
                <p className="text-stone-500 text-sm">Нет записей аудита</p>
              ) : (
                <div className="space-y-3">
                  {events.map(event => (
                    <div key={event.id} className="flex gap-3 p-3 bg-stone-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-stone-800">{event.summary}</p>
                        <p className="text-xs text-stone-500">
                          {event.actorName} • {new Date(event.ts).toLocaleString('ru-RU')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
