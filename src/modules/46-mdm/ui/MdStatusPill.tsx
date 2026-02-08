"use client";

interface MdStatusPillProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  inactive: 'bg-stone-100 text-stone-600 border-stone-200',
  merged: 'bg-purple-100 text-purple-700 border-purple-200',
  pending_review: 'bg-amber-100 text-amber-700 border-amber-200',
  open: 'bg-blue-100 text-blue-700 border-blue-200',
  ignored: 'bg-stone-100 text-stone-500 border-stone-200',
  merge_in_progress: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  draft: 'bg-stone-100 text-stone-600 border-stone-200',
  pending_approval: 'bg-amber-100 text-amber-700 border-amber-200',
  applied: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  assigned: 'bg-blue-100 text-blue-700 border-blue-200',
  resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  enabled: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  disabled: 'bg-stone-100 text-stone-500 border-stone-200',
};

const statusLabels: Record<string, string> = {
  active: 'Активный',
  inactive: 'Неактивный',
  merged: 'Объединен',
  pending_review: 'На проверке',
  open: 'Открыт',
  ignored: 'Игнорирован',
  merge_in_progress: 'Слияние',
  draft: 'Черновик',
  pending_approval: 'Ожидает',
  applied: 'Применен',
  cancelled: 'Отменен',
  assigned: 'Назначен',
  resolved: 'Решен',
  enabled: 'Включено',
  disabled: 'Отключено',
};

export function MdStatusPill({ status, size = 'sm' }: MdStatusPillProps) {
  const styles = statusStyles[status] || 'bg-stone-100 text-stone-600 border-stone-200';
  const label = statusLabels[status] || status;

  return (
    <span
      className={`
        inline-flex items-center rounded-full border font-medium
        ${styles}
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
      `}
    >
      {label}
    </span>
  );
}
