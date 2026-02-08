'use client';

import { cn } from '@/lib/utils';

export type ExceptionSeverity = 'ok' | 'warning' | 'critical';

interface ExSeverityPillProps {
  severity: ExceptionSeverity;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

const severityConfig: Record<ExceptionSeverity, { label: string; className: string; dotClass: string }> = {
  ok: {
    label: 'Норма',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dotClass: 'bg-emerald-500'
  },
  warning: {
    label: 'Внимание',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
    dotClass: 'bg-amber-500'
  },
  critical: {
    label: 'Критично',
    className: 'bg-red-100 text-red-800 border-red-200',
    dotClass: 'bg-red-500'
  }
};

export function ExSeverityPill({ severity, size = 'sm', showDot = true, className }: ExSeverityPillProps) {
  const config = severityConfig[severity] || severityConfig.ok;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        config.className,
        className
      )}
    >
      {showDot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', config.dotClass)} />
      )}
      {config.label}
    </span>
  );
}

export default ExSeverityPill;
