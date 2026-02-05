"use client";

import React from 'react';

interface CsStatusPillProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  expired: 'bg-stone-100 text-stone-600 border-stone-300',
  revoked: 'bg-rose-50 text-rose-700 border-rose-200',
  closed: 'bg-stone-100 text-stone-600 border-stone-300',
  paused: 'bg-amber-50 text-amber-700 border-amber-200',
};

const statusLabels: Record<string, Record<string, string>> = {
  active: { ru: 'Активно', en: 'Active', uk: 'Активно' },
  pending: { ru: 'Ожидает', en: 'Pending', uk: 'Очікує' },
  approved: { ru: 'Одобрено', en: 'Approved', uk: 'Схвалено' },
  rejected: { ru: 'Отклонено', en: 'Rejected', uk: 'Відхилено' },
  expired: { ru: 'Истекло', en: 'Expired', uk: 'Закінчилось' },
  revoked: { ru: 'Отозвано', en: 'Revoked', uk: 'Відкликано' },
  closed: { ru: 'Закрыто', en: 'Closed', uk: 'Закрито' },
  paused: { ru: 'Приостановлено', en: 'Paused', uk: 'Призупинено' },
};

export function CsStatusPill({ status, size = 'sm' }: CsStatusPillProps) {
  const style = statusStyles[status] || 'bg-stone-100 text-stone-600 border-stone-300';
  const label = statusLabels[status]?.ru || status;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${style} ${sizeClass}`}>
      {label}
    </span>
  );
}
