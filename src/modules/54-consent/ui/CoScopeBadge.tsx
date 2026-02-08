"use client";

import { Layers, Users, Briefcase, FileText, Package } from 'lucide-react';

type ScopeType = 'modules' | 'entities' | 'portfolios' | 'documents' | 'packs';

interface CoScopeBadgeProps {
  scopeType: ScopeType;
  count?: number;
}

const scopeConfig: Record<ScopeType, { label: string; icon: typeof Layers; className: string }> = {
  modules: {
    label: 'Модули',
    icon: Layers,
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  entities: {
    label: 'Сущности',
    icon: Users,
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  portfolios: {
    label: 'Портфели',
    icon: Briefcase,
    className: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  documents: {
    label: 'Документы',
    icon: FileText,
    className: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  packs: {
    label: 'Пакеты',
    icon: Package,
    className: 'bg-teal-100 text-teal-700 border-teal-200',
  },
};

export function CoScopeBadge({ scopeType, count }: CoScopeBadgeProps) {
  const config = scopeConfig[scopeType] || scopeConfig.modules;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${config.className}`}
    >
      <Icon className="w-3 h-3" />
      {count !== undefined ? count : config.label}
    </span>
  );
}
