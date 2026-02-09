"use client";

import { cn } from "@/lib/utils";

type Status = 'ok' | 'warning' | 'critical' | 'info' | 'pending' | 'completed' | 'in_progress' | 'overdue' | 'paid' | 'draft' | 'active' | 'error' | 'success';

interface StatusBadgeProps {
  status: Status;
  label?: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<Status, { bg: string; text: string; label: string }> = {
  ok: { bg: 'bg-primary/15', text: 'text-primary', label: 'OK' },
  success: { bg: 'bg-primary/15', text: 'text-primary', label: 'Успешно' },
  active: { bg: 'bg-primary/15', text: 'text-primary', label: 'Активно' },
  completed: { bg: 'bg-primary/15', text: 'text-primary', label: 'Завершено' },
  paid: { bg: 'bg-primary/15', text: 'text-primary', label: 'Оплачено' },
  warning: { bg: 'bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', label: 'Внимание' },
  pending: { bg: 'bg-amber-500/15', text: 'text-amber-600 dark:text-amber-400', label: 'Ожидает' },
  in_progress: { bg: 'bg-blue-500/15', text: 'text-blue-600 dark:text-blue-400', label: 'В работе' },
  draft: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Черновик' },
  info: { bg: 'bg-secondary/15', text: 'text-secondary', label: 'Инфо' },
  critical: { bg: 'bg-destructive/15', text: 'text-destructive', label: 'Критично' },
  overdue: { bg: 'bg-destructive/15', text: 'text-destructive', label: 'Просрочено' },
  error: { bg: 'bg-destructive/15', text: 'text-destructive', label: 'Ошибка' },
};

export function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.info;
  
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        config.bg,
        config.text,
        size === 'sm' ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      )}
    >
      {label || config.label}
    </span>
  );
}
