'use client';

/**
 * Data Quality Severity Pill Component
 */

import { DQ_SEVERITY, DqSeverity } from '../config';

interface DqSeverityPillProps {
  severity: DqSeverity;
  lang?: 'ru' | 'en' | 'uk';
  size?: 'sm' | 'md';
}

const SEVERITY_STYLES: Record<DqSeverity, string> = {
  ok: 'bg-emerald-100 text-emerald-800',
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-amber-100 text-amber-800',
  critical: 'bg-red-100 text-red-800',
};

export function DqSeverityPill({ severity, lang = 'ru', size = 'md' }: DqSeverityPillProps) {
  const config = DQ_SEVERITY[severity];
  const label = config?.label[lang] || severity;
  const style = SEVERITY_STYLES[severity] || 'bg-gray-100 text-gray-600';

  const sizeClasses = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${style} ${sizeClasses}`}>
      {label}
    </span>
  );
}
