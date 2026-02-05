'use client';

import { cn } from '@/lib/utils';

interface AcStatusPillProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
  published: 'bg-emerald-100 text-emerald-700',
  active: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-stone-100 text-stone-600',
  archived: 'bg-stone-100 text-stone-500',
  in_progress: 'bg-blue-100 text-blue-700',
  abandoned: 'bg-rose-100 text-rose-700',
  staff: 'bg-purple-100 text-purple-700',
  client: 'bg-blue-100 text-blue-700',
  both: 'bg-amber-100 text-amber-700',
  high: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-rose-100 text-rose-700',
};

const statusLabels: Record<string, Record<string, string>> = {
  published: { ru: 'Опубликовано', en: 'Published', uk: 'Опубліковано' },
  active: { ru: 'Активно', en: 'Active', uk: 'Активно' },
  completed: { ru: 'Завершено', en: 'Completed', uk: 'Завершено' },
  draft: { ru: 'Черновик', en: 'Draft', uk: 'Чернетка' },
  archived: { ru: 'Архив', en: 'Archived', uk: 'Архів' },
  in_progress: { ru: 'В работе', en: 'In Progress', uk: 'В роботі' },
  abandoned: { ru: 'Отменено', en: 'Abandoned', uk: 'Скасовано' },
  staff: { ru: 'Сотрудники', en: 'Staff', uk: 'Співробітники' },
  client: { ru: 'Клиенты', en: 'Clients', uk: 'Клієнти' },
  both: { ru: 'Все', en: 'Both', uk: 'Всі' },
  high: { ru: 'Высокая', en: 'High', uk: 'Висока' },
  medium: { ru: 'Средняя', en: 'Medium', uk: 'Середня' },
  low: { ru: 'Низкая', en: 'Low', uk: 'Низька' },
};

export function AcStatusPill({ status, size = 'sm' }: AcStatusPillProps) {
  const style = statusStyles[status] || 'bg-stone-100 text-stone-600';
  const label = statusLabels[status]?.ru || status;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        style,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      {label}
    </span>
  );
}
