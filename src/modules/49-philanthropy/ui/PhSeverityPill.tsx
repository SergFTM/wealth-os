"use client";

import { COMPLIANCE_STATUS_KEYS, COMPLIANCE_CHECK_TYPE_KEYS } from '../config';

type ComplianceStatusKey = keyof typeof COMPLIANCE_STATUS_KEYS;
type ComplianceTypeKey = keyof typeof COMPLIANCE_CHECK_TYPE_KEYS;

interface PhSeverityPillProps {
  status?: ComplianceStatusKey;
  checkType?: ComplianceTypeKey;
  size?: 'sm' | 'md';
}

const colorClasses: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  green: 'bg-green-100 text-green-700 border-green-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
};

export function PhSeverityPill({ status, checkType, size = 'sm' }: PhSeverityPillProps) {
  let label = '';
  let color = 'stone';

  if (status && status in COMPLIANCE_STATUS_KEYS) {
    const config = COMPLIANCE_STATUS_KEYS[status];
    label = config.ru;
    color = config.color;
  } else if (checkType && checkType in COMPLIANCE_CHECK_TYPE_KEYS) {
    const config = COMPLIANCE_CHECK_TYPE_KEYS[checkType];
    label = config.ru;
    color = config.color;
  }

  const colorClass = colorClasses[color] || 'bg-stone-100 text-stone-700 border-stone-200';

  const sizeClass = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${colorClass} ${sizeClass}`}>
      {label}
    </span>
  );
}
