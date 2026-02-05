'use client';

import { RISK_LEVELS } from '../config';

type Locale = 'ru' | 'en' | 'uk';

interface IdRiskTagProps {
  level: string;
  locale?: Locale;
  showIcon?: boolean;
}

export function IdRiskTag({ level, locale = 'ru', showIcon = true }: IdRiskTagProps) {
  const config = RISK_LEVELS[level as keyof typeof RISK_LEVELS];

  if (!config) {
    return (
      <span className="text-xs text-gray-500">{level}</span>
    );
  }

  const label = config[locale] || config.ru;
  const color = config.color;

  const colorClasses: Record<string, string> = {
    green: 'text-green-600 bg-green-50',
    amber: 'text-amber-600 bg-amber-50',
    orange: 'text-orange-600 bg-orange-50',
    red: 'text-red-600 bg-red-50',
  };

  const iconColors: Record<string, string> = {
    green: 'text-green-500',
    amber: 'text-amber-500',
    orange: 'text-orange-500',
    red: 'text-red-500',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium
        ${colorClasses[color] || 'text-gray-600 bg-gray-50'}
      `}
    >
      {showIcon && (
        <svg
          className={`w-3 h-3 ${iconColors[color] || 'text-gray-400'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {label}
    </span>
  );
}

export default IdRiskTag;
