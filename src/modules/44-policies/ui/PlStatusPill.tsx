"use client";

interface PlStatusPillProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; color: string }> = {
  // Policy/SOP status
  active: { label: 'Активна', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  archived: { label: 'Архив', color: 'bg-stone-100 text-stone-600 border-stone-200' },

  // Version status
  draft: { label: 'Черновик', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  published: { label: 'Опубликована', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  retired: { label: 'Отменена', color: 'bg-stone-100 text-stone-600 border-stone-200' },

  // Acknowledgement status
  requested: { label: 'Запрошено', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  acknowledged: { label: 'Подтверждено', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  overdue: { label: 'Просрочено', color: 'bg-red-100 text-red-700 border-red-200' },
};

export function PlStatusPill({ status, size = 'sm' }: PlStatusPillProps) {
  const config = statusConfig[status] || { label: status, color: 'bg-stone-100 text-stone-600 border-stone-200' };

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${config.color} ${sizeClasses}`}>
      {config.label}
    </span>
  );
}
