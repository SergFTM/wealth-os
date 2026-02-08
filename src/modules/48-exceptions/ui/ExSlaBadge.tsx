'use client';

import { cn } from '@/lib/utils';
import { getTimeToSla, getSlaStatus } from '../engine/slaEngine';

type SlaStatus = 'ok' | 'at_risk' | 'overdue' | 'no_sla';

interface ExSlaBadgeProps {
  slaDueAt?: string | null;
  slaAtRisk?: boolean;
  showTime?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const statusConfig: Record<SlaStatus, { label: string; className: string; icon: string }> = {
  ok: {
    label: 'В срок',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: '✓'
  },
  at_risk: {
    label: 'Под риском',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: '⚠'
  },
  overdue: {
    label: 'Просрочено',
    className: 'bg-red-50 text-red-700 border-red-200',
    icon: '!'
  },
  no_sla: {
    label: 'Без SLA',
    className: 'bg-stone-50 text-stone-500 border-stone-200',
    icon: '–'
  }
};

export function ExSlaBadge({ slaDueAt, slaAtRisk, showTime = true, size = 'sm', className }: ExSlaBadgeProps) {
  const status = getSlaBadgeStatus(slaDueAt, slaAtRisk);
  const config = statusConfig[status];

  const timeInfo = slaDueAt ? getTimeToSla(slaDueAt) : null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded border font-medium',
        size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm',
        config.className,
        className
      )}
    >
      <span className="font-bold">{config.icon}</span>
      {showTime && timeInfo ? (
        <span>{timeInfo.formatted}</span>
      ) : (
        <span>{config.label}</span>
      )}
    </span>
  );
}

function getSlaBadgeStatus(slaDueAt?: string | null, slaAtRisk?: boolean): SlaStatus {
  if (!slaDueAt) return 'no_sla';

  const now = new Date();
  const due = new Date(slaDueAt);

  if (now > due) return 'overdue';
  if (slaAtRisk) return 'at_risk';
  return 'ok';
}

export default ExSlaBadge;
