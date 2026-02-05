'use client';

/**
 * Data Quality Score Badge Component
 */

import { getScoreColor, getScoreLabel, getTrendIcon } from '../schema/dqMetric';

interface DqScoreBadgeProps {
  score: number;
  trend?: 'up' | 'down' | 'stable';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  lang?: 'ru' | 'en' | 'uk';
}

const SCORE_COLORS: Record<string, string> = {
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
};

const SCORE_BG_COLORS: Record<string, string> = {
  emerald: 'bg-emerald-50 border-emerald-200',
  amber: 'bg-amber-50 border-amber-200',
  orange: 'bg-orange-50 border-orange-200',
  red: 'bg-red-50 border-red-200',
};

const TREND_COLORS: Record<string, string> = {
  up: 'text-emerald-600',
  down: 'text-red-600',
  stable: 'text-gray-400',
};

export function DqScoreBadge({
  score,
  trend,
  showLabel = false,
  size = 'md',
  lang = 'ru',
}: DqScoreBadgeProps) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score, lang);
  const trendIcon = getTrendIcon(trend);

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-lg',
  }[size];

  const containerSizeClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3',
  }[size];

  return (
    <div className={`flex items-center ${containerSizeClasses}`}>
      <div
        className={`${sizeClasses} rounded-full flex items-center justify-center font-bold text-white ${SCORE_COLORS[color]}`}
      >
        {score}
      </div>
      {(showLabel || trend) && (
        <div className="flex flex-col">
          {showLabel && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {trend && (
            <span className={`text-xs ${TREND_COLORS[trend]}`}>
              {trendIcon} {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export function DqScoreCard({
  score,
  trend,
  title,
  subtitle,
  lang = 'ru',
}: {
  score: number;
  trend?: 'up' | 'down' | 'stable';
  title: string;
  subtitle?: string;
  lang?: 'ru' | 'en' | 'uk';
}) {
  const color = getScoreColor(score);

  return (
    <div className={`p-4 rounded-xl border ${SCORE_BG_COLORS[color]}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <DqScoreBadge score={score} trend={trend} size="md" lang={lang} />
      </div>
    </div>
  );
}
