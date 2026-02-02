"use client";

import { cn } from '@/lib/utils';

interface SourceBadgeProps {
  type: 'custodian' | 'bank' | 'advisor' | 'manual' | string;
  name?: string;
  status?: 'ok' | 'stale' | 'error';
  size?: 'sm' | 'md';
}

const typeConfig: Record<string, { bg: string; text: string; icon: string }> = {
  custodian: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '🏦' },
  bank: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '💳' },
  advisor: { bg: 'bg-purple-100', text: 'text-purple-700', icon: '👤' },
  manual: { bg: 'bg-stone-100', text: 'text-stone-700', icon: '✏️' }
};

const statusDots: Record<string, string> = {
  ok: 'bg-emerald-500',
  stale: 'bg-amber-500',
  error: 'bg-rose-500'
};

export function ReconSourceBadge({ type, name, status, size = 'md' }: SourceBadgeProps) {
  const config = typeConfig[type] || typeConfig.manual;
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full font-medium",
      config.bg,
      config.text,
      size === 'sm' ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
    )}>
      <span>{config.icon}</span>
      <span>{name || type}</span>
      {status && (
        <span className={cn("w-1.5 h-1.5 rounded-full", statusDots[status])} />
      )}
    </span>
  );
}
