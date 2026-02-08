"use client";

type Severity = 'ok' | 'warning' | 'critical';

interface CoSeverityPillProps {
  severity: Severity;
}

const severityConfig: Record<Severity, { label: string; className: string }> = {
  ok: {
    label: 'Норма',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  warning: {
    label: 'Внимание',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  critical: {
    label: 'Критический',
    className: 'bg-orange-100 text-orange-700 border-orange-200',
  },
};

export function CoSeverityPill({ severity }: CoSeverityPillProps) {
  const config = severityConfig[severity] || severityConfig.ok;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
