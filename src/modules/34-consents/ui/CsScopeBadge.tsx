"use client";

import React from 'react';

interface CsScopeBadgeProps {
  scopeType: string;
  scopeName?: string;
  size?: 'sm' | 'md';
}

const scopeStyles: Record<string, string> = {
  household: 'bg-purple-50 text-purple-700 border-purple-200',
  entity: 'bg-blue-50 text-blue-700 border-blue-200',
  account: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  document: 'bg-amber-50 text-amber-700 border-amber-200',
  report: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const scopeLabels: Record<string, string> = {
  household: 'Household',
  entity: 'Entity',
  account: 'Account',
  document: 'Document',
  report: 'Report',
};

export function CsScopeBadge({ scopeType, scopeName, size = 'sm' }: CsScopeBadgeProps) {
  const style = scopeStyles[scopeType] || 'bg-stone-100 text-stone-600 border-stone-300';
  const label = scopeLabels[scopeType] || scopeType;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <div className="flex items-center gap-1.5">
      <span className={`inline-flex items-center rounded border font-medium ${style} ${sizeClass}`}>
        {label}
      </span>
      {scopeName && (
        <span className="text-stone-600 text-sm truncate max-w-[150px]" title={scopeName}>
          {scopeName}
        </span>
      )}
    </div>
  );
}
