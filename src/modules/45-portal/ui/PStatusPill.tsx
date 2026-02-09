'use client';

import React from 'react';
import { RequestStatusKey, RequestStatusLabels, Locale } from '../types';

interface PStatusPillProps {
  status: RequestStatusKey | string;
  locale?: Locale;
  size?: 'sm' | 'md';
}

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  open: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  in_progress: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  awaiting_client: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  closed: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  revoked: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  expired: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  pending: { bg: 'bg-yellow-50', text: 'text-yellow-700', dot: 'bg-yellow-500' },
  completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  draft: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  published: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

export function PStatusPill({ status, locale = 'ru', size = 'md' }: PStatusPillProps) {
  const colors = statusColors[status] || statusColors.pending;
  const label = (RequestStatusLabels as Record<string, Record<string, string>>)[status]?.[locale] || status;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 ${sizeClasses} font-medium rounded-full ${colors.bg} ${colors.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {label}
    </span>
  );
}

// Badge variant (no dot)
interface PBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

const badgeVariants = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  error: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
};

export function PBadge({ children, variant = 'default', size = 'md' }: PBadgeProps) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center ${sizeClasses} font-medium rounded-full ${badgeVariants[variant]}`}>
      {children}
    </span>
  );
}

// Tag variant (for document tags etc)
interface PTagProps {
  children: React.ReactNode;
  onRemove?: () => void;
}

export function PTag({ children, onRemove }: PTagProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-emerald-50 text-emerald-700">
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:text-emerald-900 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}
