'use client';

import React from 'react';

type StatusType =
  | 'draft'
  | 'published'
  | 'archived'
  | 'queued'
  | 'running'
  | 'success'
  | 'failed'
  | 'active'
  | 'expired'
  | 'revoked'
  | 'paused'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'completed';

interface ExStatusPillProps {
  status: StatusType;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

const STATUS_CONFIG: Record<StatusType, { label: string; bg: string; text: string; icon?: string }> = {
  draft: { label: 'Черновик', bg: 'bg-gray-100', text: 'text-gray-700' },
  published: { label: 'Опубликован', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  archived: { label: 'Архив', bg: 'bg-slate-100', text: 'text-slate-600' },
  queued: { label: 'В очереди', bg: 'bg-amber-100', text: 'text-amber-700' },
  running: { label: 'Выполняется', bg: 'bg-blue-100', text: 'text-blue-700' },
  success: { label: 'Успешно', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  failed: { label: 'Ошибка', bg: 'bg-red-100', text: 'text-red-700' },
  active: { label: 'Активен', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  expired: { label: 'Истёк', bg: 'bg-amber-100', text: 'text-amber-700' },
  revoked: { label: 'Отозван', bg: 'bg-red-100', text: 'text-red-700' },
  paused: { label: 'Пауза', bg: 'bg-amber-100', text: 'text-amber-700' },
  pending: { label: 'Ожидает', bg: 'bg-amber-100', text: 'text-amber-700' },
  approved: { label: 'Одобрен', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  rejected: { label: 'Отклонён', bg: 'bg-red-100', text: 'text-red-700' },
  completed: { label: 'Завершён', bg: 'bg-emerald-100', text: 'text-emerald-700' },
};

export function ExStatusPill({ status, size = 'md', showIcon = false }: ExStatusPillProps) {
  const config = STATUS_CONFIG[status] || { label: status, bg: 'bg-gray-100', text: 'text-gray-700' };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses}`}
    >
      {showIcon && status === 'running' && (
        <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
      )}
      {config.label}
    </span>
  );
}

export default ExStatusPill;
