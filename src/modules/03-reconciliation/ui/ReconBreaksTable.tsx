"use client";

import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ReconBreak {
  id: string;
  jobId: string;
  clientId?: string;
  entityId?: string;
  accountId?: string;
  instrument?: string | null;
  breakType: string;
  expected: string | number | null;
  actual: string | number | null;
  delta?: number | null;
  currency?: string | null;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved' | 'ignored';
  owner?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ReconBreaksTableProps {
  breaks: ReconBreak[];
  loading?: boolean;
  limit?: number;
  onRowClick?: (brk: ReconBreak) => void;
  onAssign?: (breakId: string) => void;
  onCreateTask?: (breakId: string) => void;
  onResolve?: (breakId: string) => void;
  clientSafe?: boolean;
}

const severityConfig = {
  critical: { color: 'bg-rose-100 text-rose-700', label: 'Критический' },
  high: { color: 'bg-orange-100 text-orange-700', label: 'Высокий' },
  medium: { color: 'bg-amber-100 text-amber-700', label: 'Средний' },
  low: { color: 'bg-stone-100 text-stone-600', label: 'Низкий' }
};

const statusConfig = {
  open: { color: 'bg-rose-50 text-rose-600 border-rose-200', label: 'Открыт' },
  investigating: { color: 'bg-blue-50 text-blue-600 border-blue-200', label: 'В работе' },
  resolved: { color: 'bg-emerald-50 text-emerald-600 border-emerald-200', label: 'Решён' },
  ignored: { color: 'bg-stone-50 text-stone-500 border-stone-200', label: 'Пропущен' }
};

const breakTypeLabels: Record<string, string> = {
  quantity_mismatch: 'Кол-во',
  price_mismatch: 'Цена',
  missing_transaction: 'Транзакция',
  cash_mismatch: 'Cash',
  unmapped_symbol: 'Символ',
  unmapped_account: 'Счёт',
  unmapped_entity: 'Entity'
};

function formatAge(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return '<1ч';
  if (diffHours < 24) return `${diffHours}ч`;
  return `${diffDays}д`;
}

function formatDelta(delta: number | null | undefined, currency?: string | null): string {
  if (delta === null || delta === undefined) return '—';
  const sign = delta > 0 ? '+' : '';
  if (Math.abs(delta) >= 1000000) return `${sign}${(delta / 1000000).toFixed(1)}M`;
  if (Math.abs(delta) >= 1000) return `${sign}${(delta / 1000).toFixed(0)}K`;
  return `${sign}${delta.toLocaleString()}`;
}

export function ReconBreaksTable({ 
  breaks, 
  loading, 
  limit = 8, 
  onRowClick, 
  onAssign, 
  onCreateTask, 
  onResolve,
  clientSafe 
}: ReconBreaksTableProps) {
  const displayBreaks = breaks.slice(0, limit);

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
        <div className="px-4 py-3 border-b border-stone-200/50 bg-stone-50/50">
          <h3 className="font-semibold text-stone-800">Очередь расхождений</h3>
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-12 bg-stone-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (displayBreaks.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-stone-600 font-medium">Нет расхождений</p>
        <p className="text-stone-400 text-sm">Все данные сверены</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-stone-200/50 bg-stone-50/50 flex items-center justify-between">
        <h3 className="font-semibold text-stone-800">Очередь расхождений</h3>
        <Link href="/m/reconciliation/list?tab=breaks" className="text-xs text-emerald-600 hover:underline">
          Все расхождения →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/30">
              <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">ID</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Критич.</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Инструмент</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Тип</th>
              <th className="text-right py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Дельта</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Статус</th>
              <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Возраст</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Owner</th>
              {!clientSafe && (
                <th className="text-right py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Действия</th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayBreaks.map((brk) => (
              <tr
                key={brk.id}
                className="border-b border-stone-50 hover:bg-stone-50/50 cursor-pointer transition-colors"
                onClick={() => onRowClick?.(brk)}
              >
                <td className="py-2.5 px-3 font-mono text-xs text-stone-500">
                  {brk.id.slice(0, 6)}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className={cn("px-2 py-0.5 rounded text-xs font-medium", severityConfig[brk.severity].color)}>
                    {severityConfig[brk.severity].label}
                  </span>
                </td>
                <td className="py-2.5 px-3 font-medium text-stone-800">
                  {brk.instrument || (brk.breakType.includes('cash') ? 'Cash' : '—')}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-600">
                    {breakTypeLabels[brk.breakType] || brk.breakType}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-mono">
                  <span className={cn(
                    "text-sm",
                    brk.delta && brk.delta > 0 ? "text-emerald-600" : brk.delta && brk.delta < 0 ? "text-rose-600" : "text-stone-500"
                  )}>
                    {formatDelta(brk.delta, brk.currency)}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className={cn("px-2 py-0.5 rounded text-xs font-medium border", statusConfig[brk.status].color)}>
                    {statusConfig[brk.status].label}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-center text-xs text-stone-500">
                  {formatAge(brk.createdAt)}
                </td>
                <td className="py-2.5 px-3 text-xs text-stone-600 truncate max-w-24">
                  {brk.owner ? brk.owner.split('@')[0] : '—'}
                </td>
                {!clientSafe && (
                  <td className="py-2.5 px-3 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {onAssign && !brk.owner && (
                        <button
                          onClick={() => onAssign(brk.id)}
                          className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
                        >
                          Назначить
                        </button>
                      )}
                      {onCreateTask && (
                        <button
                          onClick={() => onCreateTask(brk.id)}
                          className="px-2 py-1 text-xs text-purple-600 hover:bg-purple-50 rounded"
                        >
                          Задача
                        </button>
                      )}
                      {onResolve && brk.status !== 'resolved' && (
                        <button
                          onClick={() => onResolve(brk.id)}
                          className="px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          Решено
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
    </div>
  );
}
