'use client';

import { cn } from '@/lib/utils';

interface StatusPillProps {
  status: string;
  size?: 'sm' | 'md';
  className?: string;
}

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-stone-100 text-stone-600',
  revoked: 'bg-red-100 text-red-700',
  paused: 'bg-amber-100 text-amber-700',
  expired: 'bg-stone-100 text-stone-500',
  unread: 'bg-blue-100 text-blue-700',
  read: 'bg-stone-100 text-stone-500',
  ok: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  critical: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  stale: 'bg-amber-100 text-amber-700',
  low: 'bg-stone-100 text-stone-600',
  normal: 'bg-blue-100 text-blue-700',
  high: 'bg-amber-100 text-amber-700',
  urgent: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, { ru: string; en: string; uk: string }> = {
  active: { ru: 'Активно', en: 'Active', uk: 'Активно' },
  inactive: { ru: 'Неактивно', en: 'Inactive', uk: 'Неактивно' },
  revoked: { ru: 'Отозвано', en: 'Revoked', uk: 'Відкликано' },
  paused: { ru: 'Пауза', en: 'Paused', uk: 'Пауза' },
  expired: { ru: 'Истекло', en: 'Expired', uk: 'Закінчився' },
  unread: { ru: 'Не прочитано', en: 'Unread', uk: 'Не прочитано' },
  read: { ru: 'Прочитано', en: 'Read', uk: 'Прочитано' },
  ok: { ru: 'OK', en: 'OK', uk: 'OK' },
  warning: { ru: 'Внимание', en: 'Warning', uk: 'Увага' },
  critical: { ru: 'Критично', en: 'Critical', uk: 'Критично' },
  info: { ru: 'Инфо', en: 'Info', uk: 'Інфо' },
  stale: { ru: 'Устарело', en: 'Stale', uk: 'Застаріло' },
  low: { ru: 'Низкий', en: 'Low', uk: 'Низький' },
  normal: { ru: 'Обычный', en: 'Normal', uk: 'Звичайний' },
  high: { ru: 'Высокий', en: 'High', uk: 'Високий' },
  urgent: { ru: 'Срочно', en: 'Urgent', uk: 'Терміново' },
};

export function MbStatusPill({ status, size = 'sm', className }: StatusPillProps) {
  const style = statusStyles[status] || 'bg-stone-100 text-stone-600';
  const label = statusLabels[status]?.ru || status;
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        style,
        className
      )}
    >
      {label}
    </span>
  );
}
