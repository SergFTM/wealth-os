"use client";

import { cn } from '@/lib/utils';

type EventStatus = 'planned' | 'done' | 'cancelled';
type AgendaStatus = 'planned' | 'discussed' | 'deferred';
type NoteStatus = 'draft' | 'published';
type ActionStatus = 'open' | 'in_progress' | 'done';
type IntegrationStatus = 'disabled' | 'configured' | 'connected' | 'error';

type Status = EventStatus | AgendaStatus | NoteStatus | ActionStatus | IntegrationStatus;

interface CalStatusPillProps {
  status: Status;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig: Record<Status, { label: string; color: string }> = {
  // Event statuses
  planned: { label: 'Запланировано', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  done: { label: 'Проведено', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Отменено', color: 'bg-stone-100 text-stone-500 border-stone-200' },

  // Agenda statuses
  discussed: { label: 'Обсуждено', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  deferred: { label: 'Отложено', color: 'bg-amber-100 text-amber-700 border-amber-200' },

  // Note statuses
  draft: { label: 'Черновик', color: 'bg-stone-100 text-stone-600 border-stone-200' },
  published: { label: 'Опубликовано', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },

  // Action statuses
  open: { label: 'Открыто', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  in_progress: { label: 'В работе', color: 'bg-amber-100 text-amber-700 border-amber-200' },

  // Integration statuses
  disabled: { label: 'Отключено', color: 'bg-stone-100 text-stone-500 border-stone-200' },
  configured: { label: 'Настроено', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  connected: { label: 'Подключено', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  error: { label: 'Ошибка', color: 'bg-rose-100 text-rose-700 border-rose-200' },
};

export function CalStatusPill({ status, size = 'md', className }: CalStatusPillProps) {
  const config = statusConfig[status] || statusConfig.planned;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        size === 'sm' ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function CalCategoryPill({ category, size = 'md', className }: {
  category: string;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const categoryConfig: Record<string, { label: string; color: string }> = {
    family: { label: 'Семья', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    advisor: { label: 'Советник', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    bank: { label: 'Банк', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    committee: { label: 'Комитет', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    governance: { label: 'Governance', color: 'bg-rose-100 text-rose-700 border-rose-200' },
    ops: { label: 'Операции', color: 'bg-stone-100 text-stone-600 border-stone-200' },
    other: { label: 'Другое', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  };

  const config = categoryConfig[category] || categoryConfig.other;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        size === 'sm' ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function CalPriorityPill({ priority, size = 'md', className }: {
  priority: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md';
  className?: string;
}) {
  const priorityConfig: Record<string, { label: string; color: string }> = {
    low: { label: 'Низкий', color: 'bg-stone-100 text-stone-600 border-stone-200' },
    medium: { label: 'Средний', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    high: { label: 'Высокий', color: 'bg-rose-100 text-rose-700 border-rose-200' },
  };

  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        size === 'sm' ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
