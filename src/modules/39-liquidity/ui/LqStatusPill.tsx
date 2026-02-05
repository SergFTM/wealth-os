"use client";

type Status = 'active' | 'draft' | 'archived' | 'open' | 'acknowledged' | 'closed';

interface LqStatusPillProps {
  status: Status;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  active: {
    label: 'Активный',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  draft: {
    label: 'Черновик',
    className: 'bg-stone-100 text-stone-600 border-stone-200',
  },
  archived: {
    label: 'Архив',
    className: 'bg-slate-100 text-slate-600 border-slate-200',
  },
  open: {
    label: 'Открыт',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  acknowledged: {
    label: 'Подтверждён',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  closed: {
    label: 'Закрыт',
    className: 'bg-stone-100 text-stone-600 border-stone-200',
  },
};

export function LqStatusPill({ status }: LqStatusPillProps) {
  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
