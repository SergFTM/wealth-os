'use client';

import { cn } from '@/lib/utils';

export type ExceptionStatus = 'open' | 'triage' | 'in_progress' | 'closed';

interface ExStatusPillProps {
  status: ExceptionStatus;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig: Record<ExceptionStatus, { label: string; className: string }> = {
  open: {
    label: 'Открыто',
    className: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  triage: {
    label: 'Триаж',
    className: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  in_progress: {
    label: 'В работе',
    className: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  closed: {
    label: 'Закрыто',
    className: 'bg-stone-100 text-stone-600 border-stone-200'
  }
};

export function ExStatusPill({ status, size = 'sm', className }: ExStatusPillProps) {
  const config = statusConfig[status] || statusConfig.open;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export default ExStatusPill;
