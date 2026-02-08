"use client";

import { cn } from '@/lib/utils';

type Severity = 'low' | 'normal' | 'high' | 'urgent' | 'critical';

interface DlSeverityPillProps {
  severity: Severity;
  size?: 'sm' | 'md';
  className?: string;
}

const SEVERITY_CONFIG: Record<Severity, { label: string; color: string; icon: string }> = {
  low: { label: 'Низкий', color: 'bg-stone-100 text-stone-600', icon: '○' },
  normal: { label: 'Обычный', color: 'bg-blue-100 text-blue-700', icon: '●' },
  high: { label: 'Высокий', color: 'bg-amber-100 text-amber-700', icon: '▲' },
  urgent: { label: 'Срочный', color: 'bg-orange-100 text-orange-700', icon: '▲' },
  critical: { label: 'Критический', color: 'bg-red-100 text-red-700', icon: '!' },
};

export function DlSeverityPill({ severity, size = 'md', className }: DlSeverityPillProps) {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.normal;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        config.color,
        className
      )}
    >
      <span className="text-[10px]">{config.icon}</span>
      {config.label}
    </span>
  );
}

export default DlSeverityPill;
