"use client";

import React from 'react';

interface Action {
  key: string;
  label: string;
  variant: 'primary' | 'secondary' | 'ghost';
  icon?: string;
  disabled?: boolean;
}

interface RhActionsBarProps {
  actions: Action[];
  onAction: (actionKey: string) => void;
}

const ICONS: Record<string, string> = {
  createInteraction: '💬',
  createInitiative: '🚀',
  assignCoverage: '👥',
  publishClientSafe: '📤',
  generateDemo: '✨',
  linkCase: '🔗',
  linkTask: '📋',
  edit: '✏️',
  delete: '🗑️',
  refresh: '🔄',
  export: '📊',
};

export function RhActionsBar({ actions, onAction }: RhActionsBarProps) {
  const getButtonClasses = (variant: string, disabled?: boolean) => {
    const base = 'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all';

    if (disabled) {
      return `${base} bg-gray-100 text-gray-400 cursor-not-allowed`;
    }

    switch (variant) {
      case 'primary':
        return `${base} bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-sm hover:shadow`;
      case 'secondary':
        return `${base} bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300`;
      case 'ghost':
      default:
        return `${base} text-gray-600 hover:text-gray-900 hover:bg-gray-100`;
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {actions.map((action) => (
        <button
          key={action.key}
          onClick={() => !action.disabled && onAction(action.key)}
          disabled={action.disabled}
          className={getButtonClasses(action.variant, action.disabled)}
        >
          {action.icon && <span>{action.icon}</span>}
          {!action.icon && ICONS[action.key] && <span>{ICONS[action.key]}</span>}
          {action.label}
        </button>
      ))}
    </div>
  );
}

export default RhActionsBar;
