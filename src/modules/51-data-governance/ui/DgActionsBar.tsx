'use client';

import React from 'react';

interface Action {
  key: string;
  label: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  onClick: () => void;
}

interface DgActionsBarProps {
  actions: Action[];
  onAuditClick?: () => void;
}

const variantClasses = {
  primary: 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 shadow-sm',
  secondary: 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 shadow-sm',
  ghost: 'text-stone-600 hover:text-stone-900 hover:bg-stone-100',
};

export function DgActionsBar({ actions, onAuditClick }: DgActionsBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-4 border-b border-stone-200/50">
      {actions.map((action) => (
        <button
          key={action.key}
          onClick={action.onClick}
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-lg
            text-sm font-medium transition-all duration-200
            ${variantClasses[action.variant || 'secondary']}
          `}
        >
          {action.icon}
          {action.label}
        </button>
      ))}

      {onAuditClick && (
        <button
          onClick={onAuditClick}
          className="ml-auto inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Audit
        </button>
      )}
    </div>
  );
}
