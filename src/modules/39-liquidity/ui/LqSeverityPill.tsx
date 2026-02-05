"use client";

type Severity = 'critical' | 'warning' | 'info';

interface LqSeverityPillProps {
  severity: Severity;
}

const severityConfig: Record<Severity, { label: string; className: string }> = {
  critical: {
    label: 'Критический',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  warning: {
    label: 'Внимание',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  info: {
    label: 'Информация',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
};

export function LqSeverityPill({ severity }: LqSeverityPillProps) {
  const config = severityConfig[severity] || severityConfig.info;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${config.className}`}
    >
      {config.label}
    </span>
  );
}
