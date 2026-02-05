'use client';

/**
 * Planning Status Pill Component
 * Visual indicator for goal/scenario status
 */

import { GoalStatus, GOAL_STATUS_CONFIG } from '../schema/goal';
import { ScenarioType, SCENARIO_CONFIG } from '../schema/scenario';
import { GapStatus, GAP_STATUS_CONFIG } from '../schema/planActualLink';

type StatusType = GoalStatus | ScenarioType | GapStatus;

interface PlStatusPillProps {
  status: StatusType;
  type?: 'goal' | 'scenario' | 'gap' | 'run';
  lang?: 'ru' | 'en' | 'uk';
  size?: 'sm' | 'md';
}

const STATUS_STYLES: Record<string, string> = {
  // Goal statuses
  active: 'bg-green-100 text-green-800',
  paused: 'bg-gray-100 text-gray-600',
  achieved: 'bg-blue-100 text-blue-800',
  abandoned: 'bg-red-100 text-red-700',
  // Scenario types
  base: 'bg-blue-100 text-blue-800',
  optimistic: 'bg-green-100 text-green-800',
  conservative: 'bg-amber-100 text-amber-800',
  stress: 'bg-red-100 text-red-800',
  custom: 'bg-purple-100 text-purple-800',
  // Gap statuses
  ok: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  critical: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<StatusType, { ru: string; en: string; uk: string }> = {
  // Goal statuses
  active: { ru: 'Активна', en: 'Active', uk: 'Активна' },
  paused: { ru: 'Пауза', en: 'Paused', uk: 'Пауза' },
  achieved: { ru: 'Достигнута', en: 'Achieved', uk: 'Досягнута' },
  abandoned: { ru: 'Отменена', en: 'Abandoned', uk: 'Скасована' },
  // Scenario types
  base: { ru: 'Базовый', en: 'Base', uk: 'Базовий' },
  optimistic: { ru: 'Оптимист', en: 'Optimistic', uk: 'Оптиміст' },
  conservative: { ru: 'Консерват', en: 'Conservative', uk: 'Консерват' },
  stress: { ru: 'Стресс', en: 'Stress', uk: 'Стрес' },
  custom: { ru: 'Кастом', en: 'Custom', uk: 'Кастом' },
  // Gap statuses
  ok: { ru: 'Норма', en: 'OK', uk: 'Норма' },
  warning: { ru: 'Внимание', en: 'Warning', uk: 'Увага' },
  critical: { ru: 'Критично', en: 'Critical', uk: 'Критично' },
};

export function PlStatusPill({ status, type = 'goal', lang = 'ru', size = 'md' }: PlStatusPillProps) {
  const style = STATUS_STYLES[status] || 'bg-gray-100 text-gray-600';
  const label = STATUS_LABELS[status]?.[lang] || status;

  const sizeClasses = size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-xs px-2 py-1';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${style} ${sizeClasses}`}>
      {label}
    </span>
  );
}
