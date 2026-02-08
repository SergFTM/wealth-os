"use client";

import { cn } from '@/lib/utils';

type Status = 'planned' | 'announced' | 'processed' | 'cancelled' |
              'draft' | 'in_review' | 'approved' | 'executed' | 'closed' |
              'pending' | 'recorded' | 'paid' |
              'in_progress' | 'completed' | 'blocked' | 'na' |
              'rejected' | 'escalated' | 'expired' |
              'missing' | 'requested' | 'received' | 'under_review';

interface DlStatusPillProps {
  status: Status;
  size?: 'sm' | 'md';
  className?: string;
}

const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  // Corporate Action statuses
  planned: { label: 'Запланировано', color: 'bg-blue-100 text-blue-700' },
  announced: { label: 'Объявлено', color: 'bg-amber-100 text-amber-700' },
  processed: { label: 'Обработано', color: 'bg-emerald-100 text-emerald-700' },
  cancelled: { label: 'Отменено', color: 'bg-stone-100 text-stone-500' },

  // Deal stages
  draft: { label: 'Черновик', color: 'bg-stone-100 text-stone-600' },
  in_review: { label: 'На рассмотрении', color: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Утверждено', color: 'bg-emerald-100 text-emerald-700' },
  executed: { label: 'Исполнено', color: 'bg-blue-100 text-blue-700' },
  closed: { label: 'Закрыто', color: 'bg-stone-100 text-stone-500' },

  // Fund event statuses
  recorded: { label: 'Записано', color: 'bg-emerald-100 text-emerald-700' },
  paid: { label: 'Оплачено', color: 'bg-emerald-100 text-emerald-700' },

  // Checklist item statuses
  pending: { label: 'Ожидает', color: 'bg-stone-100 text-stone-600' },
  in_progress: { label: 'В процессе', color: 'bg-blue-100 text-blue-700' },
  completed: { label: 'Завершено', color: 'bg-emerald-100 text-emerald-700' },
  blocked: { label: 'Заблокировано', color: 'bg-red-100 text-red-700' },
  na: { label: 'N/A', color: 'bg-stone-100 text-stone-400' },

  // Approval statuses
  rejected: { label: 'Отклонено', color: 'bg-red-100 text-red-700' },
  escalated: { label: 'Эскалировано', color: 'bg-amber-100 text-amber-700' },
  expired: { label: 'Просрочено', color: 'bg-red-100 text-red-700' },

  // Document statuses
  missing: { label: 'Отсутствует', color: 'bg-red-100 text-red-700' },
  requested: { label: 'Запрошен', color: 'bg-amber-100 text-amber-700' },
  received: { label: 'Получен', color: 'bg-emerald-100 text-emerald-700' },
  under_review: { label: 'На проверке', color: 'bg-blue-100 text-blue-700' },
};

export function DlStatusPill({ status, size = 'md', className }: DlStatusPillProps) {
  const config = STATUS_CONFIG[status] || { label: status, color: 'bg-stone-100 text-stone-600' };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        config.color,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export default DlStatusPill;
