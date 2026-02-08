"use client";

import React from 'react';

interface RhStatusPillProps {
  status: string;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  open: { label: 'Открыто', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  closed: { label: 'Закрыто', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  idea: { label: 'Идея', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  in_analysis: { label: 'В анализе', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  in_progress: { label: 'В работе', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  done: { label: 'Завершено', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  active: { label: 'Активно', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  inactive: { label: 'Неактивно', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  overdue: { label: 'Просрочено', color: 'bg-red-100 text-red-700 border-red-200' },
  pending: { label: 'Ожидает', color: 'bg-amber-100 text-amber-700 border-amber-200' },
};

export function RhStatusPill({ status, size = 'md' }: RhStatusPillProps) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    color: 'bg-gray-100 text-gray-600 border-gray-200'
  };

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <span className={`
      inline-flex items-center rounded-full border font-medium
      ${config.color} ${sizeClasses}
    `}>
      {config.label}
    </span>
  );
}

export default RhStatusPill;
