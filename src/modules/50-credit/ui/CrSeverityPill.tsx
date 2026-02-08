"use client";

interface CrSeverityPillProps {
  severity: 'critical' | 'warning' | 'info' | 'ok';
  size?: 'sm' | 'md';
}

const severityConfig: Record<string, { label: string; className: string }> = {
  critical: { label: 'Критический', className: 'bg-red-100 text-red-700' },
  warning: { label: 'Предупреждение', className: 'bg-amber-100 text-amber-700' },
  info: { label: 'Инфо', className: 'bg-blue-100 text-blue-700' },
  ok: { label: 'OK', className: 'bg-emerald-100 text-emerald-700' },
};

export function CrSeverityPill({ severity, size = 'sm' }: CrSeverityPillProps) {
  const config = severityConfig[severity] || { label: severity, className: 'bg-stone-100 text-stone-600' };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${config.className} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      {config.label}
    </span>
  );
}
