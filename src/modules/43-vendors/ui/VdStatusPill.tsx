"use client";

import React from 'react';

type VendorStatus = 'active' | 'paused' | 'onboarding' | 'terminated';
type ContractStatus = 'draft' | 'active' | 'expiring' | 'expired' | 'terminated';
type SlaStatus = 'ok' | 'warning' | 'breached';
type IncidentStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type InvoiceStatus = 'pending' | 'approved' | 'paid' | 'disputed' | 'cancelled';

type StatusType = VendorStatus | ContractStatus | SlaStatus | IncidentStatus | InvoiceStatus;

interface VdStatusPillProps {
  status: StatusType;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const statusConfig: Record<StatusType, { label: string; color: string; bgColor: string }> = {
  // Vendor statuses
  active: { label: 'Активен', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200' },
  paused: { label: 'Пауза', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
  onboarding: { label: 'Онбординг', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200' },
  terminated: { label: 'Завершен', color: 'text-stone-600', bgColor: 'bg-stone-50 border-stone-200' },

  // Contract statuses
  draft: { label: 'Черновик', color: 'text-stone-600', bgColor: 'bg-stone-50 border-stone-200' },
  expiring: { label: 'Истекает', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
  expired: { label: 'Истек', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200' },

  // SLA statuses
  ok: { label: 'OK', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200' },
  warning: { label: 'Внимание', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
  breached: { label: 'Нарушен', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200' },

  // Incident statuses
  open: { label: 'Открыт', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200' },
  in_progress: { label: 'В работе', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200' },
  resolved: { label: 'Решен', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200' },
  closed: { label: 'Закрыт', color: 'text-stone-600', bgColor: 'bg-stone-50 border-stone-200' },

  // Invoice statuses
  pending: { label: 'Ожидает', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200' },
  approved: { label: 'Одобрен', color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-200' },
  paid: { label: 'Оплачен', color: 'text-emerald-700', bgColor: 'bg-emerald-100 border-emerald-300' },
  disputed: { label: 'Оспорен', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200' },
  cancelled: { label: 'Отменен', color: 'text-stone-500', bgColor: 'bg-stone-50 border-stone-200' },
};

export function VdStatusPill({ status, size = 'sm', showLabel = true }: VdStatusPillProps) {
  const config = statusConfig[status] || statusConfig.active;

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-3 py-1 text-sm';

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${config.bgColor} ${config.color} ${sizeClasses}
      `}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'active' || status === 'ok' || status === 'resolved' || status === 'approved' || status === 'paid'
            ? 'bg-emerald-500'
            : status === 'warning' || status === 'expiring' || status === 'pending' || status === 'paused'
            ? 'bg-amber-500'
            : status === 'breached' || status === 'open' || status === 'disputed' || status === 'expired'
            ? 'bg-red-500'
            : 'bg-stone-400'
        }`}
      />
      {showLabel && config.label}
    </span>
  );
}
