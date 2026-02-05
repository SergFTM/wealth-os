'use client';

import React from 'react';

type StatusType = 'active' | 'revoked' | 'rotated' | 'expired' | 'paused' | 'deleted' | 'success' | 'failed' | 'retrying' | 'dead' | 'pending';

interface ApiStatusPillProps {
  status: StatusType;
  size?: 'sm' | 'md';
}

const statusConfig: Record<StatusType, { bg: string; text: string; label: string }> = {
  active: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Активен' },
  revoked: { bg: 'bg-red-100', text: 'text-red-700', label: 'Отозван' },
  rotated: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Ротирован' },
  expired: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Истек' },
  paused: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Приостановлен' },
  deleted: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Удален' },
  success: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Успешно' },
  failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Ошибка' },
  retrying: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Повтор' },
  dead: { bg: 'bg-red-100', text: 'text-red-700', label: 'Dead Letter' },
  pending: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Ожидание' },
};

export function ApiStatusPill({ status, size = 'md' }: ApiStatusPillProps) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${config.bg} ${config.text}
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'}
      `}
    >
      {config.label}
    </span>
  );
}
