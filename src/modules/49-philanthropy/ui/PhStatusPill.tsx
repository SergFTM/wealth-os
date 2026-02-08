"use client";

import { GRANT_STAGE_KEYS, PAYOUT_STATUS_KEYS, IMPACT_STATUS_KEYS } from '../config';

type StageKey = keyof typeof GRANT_STAGE_KEYS;
type PayoutStatusKey = keyof typeof PAYOUT_STATUS_KEYS;
type ImpactStatusKey = keyof typeof IMPACT_STATUS_KEYS;

interface PhStatusPillProps {
  status: StageKey | PayoutStatusKey | ImpactStatusKey | string;
  type?: 'grant' | 'payout' | 'impact';
  size?: 'sm' | 'md';
}

const colorClasses: Record<string, string> = {
  stone: 'bg-stone-100 text-stone-700 border-stone-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  green: 'bg-green-100 text-green-700 border-green-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
};

export function PhStatusPill({ status, type = 'grant', size = 'sm' }: PhStatusPillProps) {
  let config: { ru: string; en: string; uk: string; color: string } | undefined;

  if (type === 'grant' && status in GRANT_STAGE_KEYS) {
    config = GRANT_STAGE_KEYS[status as StageKey];
  } else if (type === 'payout' && status in PAYOUT_STATUS_KEYS) {
    config = PAYOUT_STATUS_KEYS[status as PayoutStatusKey];
  } else if (type === 'impact' && status in IMPACT_STATUS_KEYS) {
    config = IMPACT_STATUS_KEYS[status as ImpactStatusKey];
  }

  const label = config?.ru || status;
  const color = config?.color || 'stone';
  const colorClass = colorClasses[color] || colorClasses.stone;

  const sizeClass = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center rounded-full border font-medium ${colorClass} ${sizeClass}`}>
      {label}
    </span>
  );
}
