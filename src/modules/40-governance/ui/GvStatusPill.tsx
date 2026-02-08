"use client";

import { cn } from "@/lib/utils";

type StatusType =
  | 'planned' | 'in_progress' | 'closed'
  | 'draft' | 'pending_vote' | 'approved' | 'rejected' | 'deferred'
  | 'open' | 'cancelled'
  | 'review' | 'published'
  | 'in_progress' | 'done'
  | 'active' | 'archived' | 'under_review'
  | 'discussed' | 'tabled' | 'superseded';

interface GvStatusPillProps {
  status: StatusType;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; color: string }> = {
  // Meeting statuses
  planned: { label: 'Запланировано', color: 'bg-sky-100 text-sky-700' },
  in_progress: { label: 'В процессе', color: 'bg-amber-100 text-amber-700' },
  closed: { label: 'Закрыто', color: 'bg-stone-100 text-stone-600' },

  // Decision statuses
  draft: { label: 'Черновик', color: 'bg-stone-100 text-stone-600' },
  pending_vote: { label: 'На голосовании', color: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Одобрено', color: 'bg-emerald-100 text-emerald-700' },
  rejected: { label: 'Отклонено', color: 'bg-rose-100 text-rose-700' },
  deferred: { label: 'Отложено', color: 'bg-purple-100 text-purple-700' },

  // Vote statuses
  open: { label: 'Открыто', color: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Отменено', color: 'bg-rose-100 text-rose-700' },

  // Minutes statuses
  review: { label: 'На проверке', color: 'bg-amber-100 text-amber-700' },
  published: { label: 'Опубликовано', color: 'bg-emerald-100 text-emerald-700' },

  // Action statuses
  done: { label: 'Выполнено', color: 'bg-emerald-100 text-emerald-700' },

  // Policy statuses
  active: { label: 'Активна', color: 'bg-emerald-100 text-emerald-700' },
  archived: { label: 'Архив', color: 'bg-stone-100 text-stone-600' },
  under_review: { label: 'На ревью', color: 'bg-amber-100 text-amber-700' },

  // Agenda item statuses
  discussed: { label: 'Обсуждено', color: 'bg-emerald-100 text-emerald-700' },
  tabled: { label: 'Отложено', color: 'bg-purple-100 text-purple-700' },

  // Additional statuses
  superseded: { label: 'Заменено', color: 'bg-stone-100 text-stone-500' },
};

export function GvStatusPill({ status, size = 'md', className }: GvStatusPillProps) {
  const config = statusConfig[status] || { label: status, color: 'bg-stone-100 text-stone-600' };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}
