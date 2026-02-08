"use client";

import React from 'react';

interface RhRolePillProps {
  role: string;
  size?: 'sm' | 'md';
}

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  owner: { label: 'Владелец', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  spouse: { label: 'Супруг(а)', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  child: { label: 'Ребенок', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  trustee: { label: 'Трасти', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  advisor: { label: 'Советник', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  vendor: { label: 'Вендор', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  beneficiary: { label: 'Бенефициар', color: 'bg-pink-100 text-pink-700 border-pink-200' },
  executor: { label: 'Исполнитель', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  primary_rm: { label: 'Основной RM', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  backup_rm: { label: 'Резервный RM', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  cio: { label: 'CIO', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  cfo: { label: 'CFO', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  compliance: { label: 'Compliance', color: 'bg-red-100 text-red-700 border-red-200' },
  tax: { label: 'Tax', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  legal: { label: 'Legal', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
};

export function RhRolePill({ role, size = 'md' }: RhRolePillProps) {
  const config = ROLE_CONFIG[role] || {
    label: role,
    color: 'bg-gray-100 text-gray-600 border-gray-200'
  };

  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <span className={`
      inline-flex items-center rounded-full border font-medium
      ${config.color} ${sizeClasses}
    `}>
      {config.label}
    </span>
  );
}

export default RhRolePill;
