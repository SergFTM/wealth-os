"use client";

import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ReconException {
  id: string;
  feedId: string;
  feedName?: string;
  exceptionType: string;
  errorCode?: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'resolved';
  lastSeenAt: string;
}

interface ReconExceptionsTableProps {
  exceptions: ReconException[];
  loading?: boolean;
  limit?: number;
  onRowClick?: (exc: ReconException) => void;
  onCreateIssue?: (exceptionId: string) => void;
  clientSafe?: boolean;
}

const severityConfig = {
  critical: { color: 'bg-rose-100 text-rose-700' },
  high: { color: 'bg-orange-100 text-orange-700' },
  medium: { color: 'bg-amber-100 text-amber-700' },
  low: { color: 'bg-stone-100 text-stone-600' }
};

const exceptionTypeLabels: Record<string, string> = {
  auth_expired: 'Авторизация',
  connection_timeout: 'Таймаут',
  stale_data: 'Устаревшие данные',
  malformed_data: 'Ошибка формата',
  missing_mapping: 'Нет маппинга'
};

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return 'Только что';
  if (diffHours < 24) return `${diffHours}ч назад`;
  if (diffDays === 1) return 'Вчера';
  return `${diffDays}д назад`;
}

export function ReconExceptionsTable({ 
  exceptions, 
  loading, 
  limit = 5, 
  onRowClick, 
  onCreateIssue,
  clientSafe 
}: ReconExceptionsTableProps) {
  // Don't show to clients
  if (clientSafe) return null;
  
  const displayExceptions = exceptions.filter(e => e.status === 'open').slice(0, limit);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-200/50 bg-stone-50/50">
          <h3 className="font-semibold text-stone-800">Системные ошибки</h3>
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-stone-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (displayExceptions.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-stone-500 text-sm">Нет системных ошибок</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-rose-200/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-rose-200/50 bg-rose-50/50 flex items-center justify-between">
        <h3 className="font-semibold text-rose-800 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Системные ошибки
        </h3>
        <Link href="/m/reconciliation/list?tab=exceptions" className="text-xs text-rose-600 hover:underline">
          Все ошибки →
        </Link>
      </div>
      <div className="divide-y divide-rose-100">
        {displayExceptions.map((exc) => (
          <div
            key={exc.id}
            className="p-4 hover:bg-rose-50/30 cursor-pointer transition-colors flex items-center justify-between"
            onClick={() => onRowClick?.(exc)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={cn("px-2 py-0.5 rounded text-xs font-medium", severityConfig[exc.severity].color)}>
                  {exceptionTypeLabels[exc.exceptionType] || exc.exceptionType}
                </span>
                <span className="text-sm font-medium text-stone-800">
                  {exc.feedName || exc.feedId}
                </span>
              </div>
              <p className="text-xs text-stone-500 truncate">{exc.message}</p>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <span className="text-xs text-stone-400">{formatRelativeTime(exc.lastSeenAt)}</span>
              {onCreateIssue && (
                <button
                  onClick={(e) => { e.stopPropagation(); onCreateIssue(exc.id); }}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  Создать тикет
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
