'use client';

import { cn } from '@/lib/utils';

export type SbStatus = 'active' | 'paused' | 'error' | 'archived' | 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

interface SbStatusPillProps {
  status: SbStatus;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig: Record<SbStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700' },
  paused: { label: 'Paused', className: 'bg-amber-100 text-amber-700' },
  error: { label: 'Error', className: 'bg-rose-100 text-rose-700' },
  archived: { label: 'Archived', className: 'bg-stone-100 text-stone-600' },
  pending: { label: 'Pending', className: 'bg-blue-100 text-blue-700' },
  running: { label: 'Running', className: 'bg-indigo-100 text-indigo-700' },
  completed: { label: 'Completed', className: 'bg-emerald-100 text-emerald-700' },
  failed: { label: 'Failed', className: 'bg-rose-100 text-rose-700' },
  cancelled: { label: 'Cancelled', className: 'bg-stone-100 text-stone-600' },
};

export function SbStatusPill({ status, size = 'sm', className }: SbStatusPillProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        config.className,
        className
      )}
    >
      {status === 'running' && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      )}
      {config.label}
    </span>
  );
}
