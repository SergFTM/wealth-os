"use client";

import { cn } from '@/lib/utils';

interface NetWorthSourceBadgeProps {
  sourceType?: string;
  sourceRef?: string;
  asOf?: string;
  size?: 'sm' | 'md';
}

const sourceConfig: Record<string, { bg: string; text: string; label: string }> = {
  custodian: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Custodian' },
  bank: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Bank' },
  manual: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Manual' },
  pricing: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Pricing' },
  appraiser: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Appraiser' },
  statement: { bg: 'bg-indigo-100', text: 'text-indigo-700', label: 'Statement' }
};

export function NetWorthSourceBadge({ sourceType, sourceRef, asOf, size = 'sm' }: NetWorthSourceBadgeProps) {
  if (!sourceType) {
    return (
      <span className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-500",
        size === 'sm' ? "text-xs" : "text-sm"
      )}>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        No source
      </span>
    );
  }

  const config = sourceConfig[sourceType] || { bg: 'bg-stone-100', text: 'text-stone-600', label: sourceType };

  return (
    <div className="inline-flex flex-col gap-0.5">
      <span className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium",
        config.bg,
        config.text,
        size === 'sm' ? "text-xs" : "text-sm"
      )}>
        {config.label}
        {sourceRef && (
          <span className="opacity-70 font-normal">({sourceRef})</span>
        )}
      </span>
      {asOf && (
        <span className="text-[10px] text-stone-400">
          as-of {new Date(asOf).toLocaleDateString('ru-RU')}
        </span>
      )}
    </div>
  );
}
