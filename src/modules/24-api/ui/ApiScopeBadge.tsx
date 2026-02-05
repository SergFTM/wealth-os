'use client';

import React from 'react';

type ScopeType = 'global' | 'household' | 'entity' | 'portfolio';
type ActionKey = 'view' | 'create' | 'edit' | 'approve' | 'export';

interface ApiScopeBadgeProps {
  scopeType: ScopeType;
  actionKey?: ActionKey;
  moduleKey?: string;
  clientSafe?: boolean;
  compact?: boolean;
}

const scopeColors: Record<ScopeType, { bg: string; text: string; border: string }> = {
  global: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  household: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  entity: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  portfolio: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

const scopeLabels: Record<ScopeType, string> = {
  global: 'Глобальный',
  household: 'Домохозяйство',
  entity: 'Структура',
  portfolio: 'Портфель',
};

const actionLabels: Record<ActionKey, string> = {
  view: 'Просмотр',
  create: 'Создание',
  edit: 'Редактирование',
  approve: 'Утверждение',
  export: 'Экспорт',
};

export function ApiScopeBadge({
  scopeType,
  actionKey,
  moduleKey,
  clientSafe,
  compact = false,
}: ApiScopeBadgeProps) {
  const colors = scopeColors[scopeType] || scopeColors.global;

  if (compact) {
    return (
      <span
        className={`
          inline-flex items-center px-1.5 py-0.5 text-xs font-medium rounded
          ${colors.bg} ${colors.text} border ${colors.border}
        `}
      >
        {scopeLabels[scopeType]}
      </span>
    );
  }

  return (
    <div
      className={`
        inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-md
        ${colors.bg} ${colors.text} border ${colors.border}
      `}
    >
      {moduleKey && <span className="font-mono">{moduleKey}</span>}
      {actionKey && <span>• {actionLabels[actionKey]}</span>}
      <span className="opacity-75">({scopeLabels[scopeType]})</span>
      {clientSafe && (
        <span className="ml-1 px-1 bg-white/50 rounded text-[10px]">safe</span>
      )}
    </div>
  );
}
