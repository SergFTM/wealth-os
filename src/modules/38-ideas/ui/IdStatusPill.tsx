'use client';

import { IDEA_STATUSES, RISK_LEVELS } from '../config';

type Locale = 'ru' | 'en' | 'uk';

interface IdStatusPillProps {
  status: string;
  type?: 'status' | 'risk';
  locale?: Locale;
  size?: 'sm' | 'md';
}

export function IdStatusPill({
  status,
  type = 'status',
  locale = 'ru',
  size = 'md'
}: IdStatusPillProps) {
  const config = type === 'risk'
    ? RISK_LEVELS[status as keyof typeof RISK_LEVELS]
    : IDEA_STATUSES[status as keyof typeof IDEA_STATUSES];

  if (!config) {
    return (
      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
        {status}
      </span>
    );
  }

  const label = config[locale] || config.ru;
  const color = config.color;

  const colorClasses: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    slate: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const sizeClasses = size === 'sm'
    ? 'px-1.5 py-0.5 text-[10px]'
    : 'px-2 py-0.5 text-xs';

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full border
        ${colorClasses[color] || colorClasses.gray}
        ${sizeClasses}
      `}
    >
      {label}
    </span>
  );
}

export default IdStatusPill;
