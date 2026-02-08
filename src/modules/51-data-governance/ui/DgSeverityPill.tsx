'use client';

import React from 'react';

interface DgSeverityPillProps {
  severity: 'info' | 'warning' | 'critical' | 'low' | 'medium' | 'high';
  locale?: 'ru' | 'en' | 'uk';
}

const SEVERITY_CONFIG = {
  info: {
    label: { ru: 'Инфо', en: 'Info', uk: 'Інфо' },
    color: 'bg-blue-100 text-blue-700',
  },
  warning: {
    label: { ru: 'Внимание', en: 'Warning', uk: 'Увага' },
    color: 'bg-amber-100 text-amber-700',
  },
  critical: {
    label: { ru: 'Критично', en: 'Critical', uk: 'Критично' },
    color: 'bg-red-100 text-red-700',
  },
  low: {
    label: { ru: 'Низкий', en: 'Low', uk: 'Низький' },
    color: 'bg-emerald-100 text-emerald-700',
  },
  medium: {
    label: { ru: 'Средний', en: 'Medium', uk: 'Середній' },
    color: 'bg-amber-100 text-amber-700',
  },
  high: {
    label: { ru: 'Высокий', en: 'High', uk: 'Високий' },
    color: 'bg-red-100 text-red-700',
  },
};

export function DgSeverityPill({ severity, locale = 'ru' }: DgSeverityPillProps) {
  const config = SEVERITY_CONFIG[severity];

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label[locale]}
    </span>
  );
}
