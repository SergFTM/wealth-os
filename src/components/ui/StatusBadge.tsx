"use client";

import { cn } from "@/lib/utils";

type Status = 'ok' | 'warning' | 'critical' | 'info' | 'pending' | 'completed' | 'in_progress' | 'overdue' | 'paid' | 'draft' | 'active' | 'error' | 'success';

interface StatusBadgeProps {
  status: Status;
  label?: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<Status, { bg: string; text: string; label: string }> = {
  ok: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'OK' },
  success: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Успешно' },
  active: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Активно' },
  completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Завершено' },
  paid: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Оплачено' },
  warning: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Внимание' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Ожидает' },
  in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'В работе' },
  draft: { bg: 'bg-stone-100', text: 'text-stone-600', label: 'Черновик' },
  info: { bg: 'bg-sky-100', text: 'text-sky-700', label: 'Инфо' },
  critical: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Критично' },
  overdue: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Просрочено' },
  error: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Ошибка' },
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
