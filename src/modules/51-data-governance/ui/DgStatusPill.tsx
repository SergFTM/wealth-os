'use client';

import React from 'react';

interface DgStatusPillProps {
  status: 'ok' | 'break' | 'pending' | 'active' | 'draft' | 'archived';
  locale?: 'ru' | 'en' | 'uk';
}

const STATUS_CONFIG = {
  ok: {
    label: { ru: 'OK', en: 'OK', uk: 'OK' },
    color: 'bg-emerald-100 text-emerald-700',
  },
  break: {
    label: { ru: 'Break', en: 'Break', uk: 'Break' },
    color: 'bg-red-100 text-red-700',
  },
  pending: {
    label: { ru: 'Ожидает', en: 'Pending', uk: 'Очікує' },
    color: 'bg-amber-100 text-amber-700',
  },
  active: {
    label: { ru: 'Активно', en: 'Active', uk: 'Активно' },
    color: 'bg-emerald-100 text-emerald-700',
  },
  draft: {
    label: { ru: 'Черновик', en: 'Draft', uk: 'Чернетка' },
    color: 'bg-stone-100 text-stone-600',
  },
  archived: {
    label: { ru: 'Архив', en: 'Archived', uk: 'Архів' },
    color: 'bg-stone-100 text-stone-500',
  },
};

export function DgStatusPill({ status, locale = 'ru' }: DgStatusPillProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label[locale]}
    </span>
  );
}
