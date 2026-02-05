'use client';

import { useState } from 'react';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

interface Action {
  id: string;
  label: { ru: string; en: string; uk: string };
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick: () => void;
  loading?: boolean;
}

interface MbActionsBarProps {
  actions: Action[];
  className?: string;
}

export function MbActionsBar({ actions, className }: MbActionsBarProps) {
  const { locale } = useApp();

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          disabled={action.loading}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200',
            action.variant === 'primary' && 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40',
            action.variant === 'secondary' && 'bg-white/80 border border-emerald-200 text-emerald-700 hover:bg-emerald-50',
            action.variant === 'ghost' && 'text-stone-600 hover:bg-stone-100',
            action.loading && 'opacity-60 cursor-not-allowed'
          )}
        >
          {action.loading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            action.icon
          )}
          {action.label[locale]}
        </button>
      ))}
    </div>
  );
}

// Icon components for actions
export const ActionIcons = {
  Plus: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Smartphone: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  Send: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Zap: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Database: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  Refresh: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Download: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
};
