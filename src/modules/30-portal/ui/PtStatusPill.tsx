'use client';

import { cn } from '@/lib/utils';
import { useApp } from '@/lib/store';

type StatusType = 'submitted' | 'triaged' | 'in_progress' | 'awaiting_client' | 'completed' | 'cancelled' |
  'issued' | 'overdue' | 'paid' | 'draft' | 'published' | 'active' | 'archived' |
  'low' | 'normal' | 'high' | 'urgent';

const statusConfig: Record<StatusType, { bg: string; text: string; labels: Record<string, string> }> = {
  submitted: { bg: 'bg-blue-50', text: 'text-blue-700', labels: { ru: 'Подан', en: 'Submitted', uk: 'Подано' } },
  triaged: { bg: 'bg-purple-50', text: 'text-purple-700', labels: { ru: 'Рассмотрен', en: 'Triaged', uk: 'Розглянуто' } },
  in_progress: { bg: 'bg-amber-50', text: 'text-amber-700', labels: { ru: 'В работе', en: 'In Progress', uk: 'В роботі' } },
  awaiting_client: { bg: 'bg-orange-50', text: 'text-orange-700', labels: { ru: 'Ожидает клиента', en: 'Awaiting Client', uk: 'Очікує клієнта' } },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', labels: { ru: 'Выполнен', en: 'Completed', uk: 'Виконано' } },
  cancelled: { bg: 'bg-stone-50', text: 'text-stone-500', labels: { ru: 'Отменен', en: 'Cancelled', uk: 'Скасовано' } },
  issued: { bg: 'bg-blue-50', text: 'text-blue-700', labels: { ru: 'Выставлен', en: 'Issued', uk: 'Виставлено' } },
  overdue: { bg: 'bg-rose-50', text: 'text-rose-700', labels: { ru: 'Просрочен', en: 'Overdue', uk: 'Прострочено' } },
  paid: { bg: 'bg-emerald-50', text: 'text-emerald-700', labels: { ru: 'Оплачен', en: 'Paid', uk: 'Оплачено' } },
  draft: { bg: 'bg-stone-50', text: 'text-stone-600', labels: { ru: 'Черновик', en: 'Draft', uk: 'Чернетка' } },
  published: { bg: 'bg-emerald-50', text: 'text-emerald-700', labels: { ru: 'Опубликован', en: 'Published', uk: 'Опубліковано' } },
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', labels: { ru: 'Активен', en: 'Active', uk: 'Активний' } },
  archived: { bg: 'bg-stone-50', text: 'text-stone-500', labels: { ru: 'В архиве', en: 'Archived', uk: 'В архіві' } },
  low: { bg: 'bg-stone-50', text: 'text-stone-600', labels: { ru: 'Низкий', en: 'Low', uk: 'Низький' } },
  normal: { bg: 'bg-blue-50', text: 'text-blue-700', labels: { ru: 'Обычный', en: 'Normal', uk: 'Звичайний' } },
  high: { bg: 'bg-amber-50', text: 'text-amber-700', labels: { ru: 'Высокий', en: 'High', uk: 'Високий' } },
  urgent: { bg: 'bg-rose-50', text: 'text-rose-700', labels: { ru: 'Срочный', en: 'Urgent', uk: 'Терміновий' } },
};

interface PtStatusPillProps {
  status: string;
  size?: 'sm' | 'md';
}

export function PtStatusPill({ status, size = 'sm' }: PtStatusPillProps) {
  const { locale } = useApp();
  const config = statusConfig[status as StatusType] || { bg: 'bg-stone-50', text: 'text-stone-600', labels: { ru: status, en: status, uk: status } };

  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full',
      config.bg,
      config.text,
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
    )}>
      {config.labels[locale]}
    </span>
  );
}
