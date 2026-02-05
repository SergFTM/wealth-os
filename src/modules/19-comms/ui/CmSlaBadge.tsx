"use client";

import { Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface CmSlaBadgeProps {
  dueAt: string | null;
  status: 'open' | 'escalated' | 'closed' | 'archived';
  size?: 'sm' | 'md';
}

export function CmSlaBadge({ dueAt, status, size = 'sm' }: CmSlaBadgeProps) {
  if (status === 'closed' || status === 'archived' || !dueAt) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      } text-stone-500 bg-stone-100`}>
        <CheckCircle className="w-3 h-3" />
        {status === 'closed' ? 'Закрыт' : status === 'archived' ? 'Архив' : '—'}
      </span>
    );
  }

  const now = new Date();
  const due = new Date(dueAt);
  const diffMs = due.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  // Calculate SLA status
  let slaStatus: 'ok' | 'warning' | 'critical';
  let label: string;
  let Icon: typeof Clock;

  if (diffMs < 0) {
    // Overdue
    slaStatus = 'critical';
    const overdueHours = Math.abs(diffHours);
    if (overdueHours < 24) {
      label = `Просрочен ${Math.ceil(overdueHours)}ч`;
    } else {
      label = `Просрочен ${Math.ceil(overdueHours / 24)}д`;
    }
    Icon = XCircle;
  } else if (diffHours < 4) {
    // Less than 4 hours - critical
    slaStatus = 'critical';
    label = `${Math.ceil(diffHours)}ч`;
    Icon = AlertTriangle;
  } else if (diffHours < 24) {
    // Less than 24 hours - warning
    slaStatus = 'warning';
    label = `${Math.ceil(diffHours)}ч`;
    Icon = Clock;
  } else {
    // More than 24 hours - ok
    slaStatus = 'ok';
    const days = Math.ceil(diffHours / 24);
    label = `${days}д`;
    Icon = Clock;
  }

  const colorClasses = {
    ok: 'text-emerald-600 bg-emerald-50',
    warning: 'text-amber-600 bg-amber-50',
    critical: 'text-red-600 bg-red-50',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 font-medium rounded ${
      size === 'sm' ? 'text-xs' : 'text-sm'
    } ${colorClasses[slaStatus]}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}
