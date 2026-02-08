"use client";

type Status =
  | 'active'
  | 'revoked'
  | 'expired'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'fulfilled'
  | 'open'
  | 'closed'
  | 'inactive';

interface CoStatusPillProps {
  status: Status;
}

const statusConfig: Record<Status, { label: string; dot: string; className: string }> = {
  active: {
    label: 'Активно',
    dot: 'bg-emerald-500',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  approved: {
    label: 'Одобрено',
    dot: 'bg-emerald-500',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  fulfilled: {
    label: 'Выполнено',
    dot: 'bg-emerald-500',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  closed: {
    label: 'Закрыто',
    dot: 'bg-emerald-500',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  pending: {
    label: 'Ожидание',
    dot: 'bg-amber-500',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  open: {
    label: 'Открыто',
    dot: 'bg-amber-500',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  revoked: {
    label: 'Отозвано',
    dot: 'bg-red-500',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  rejected: {
    label: 'Отклонено',
    dot: 'bg-red-500',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  expired: {
    label: 'Истекло',
    dot: 'bg-stone-400',
    className: 'bg-stone-100 text-stone-600 border-stone-200',
  },
  inactive: {
    label: 'Неактивно',
    dot: 'bg-stone-400',
    className: 'bg-stone-100 text-stone-600 border-stone-200',
  },
};

export function CoStatusPill({ status }: CoStatusPillProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full border ${config.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
