"use client";

import { DataTable } from '@/components/ui/DataTable';
import { GvStatusPill } from './GvStatusPill';

interface Policy {
  id: string;
  name: string;
  categoryKey: string;
  version?: string;
  status: 'draft' | 'active' | 'archived' | 'under_review';
  effectiveDate?: string;
  clientSafePublished?: boolean;
  updatedAt?: string;
}

interface GvPoliciesTableProps {
  policies: Policy[];
  onRowClick?: (policy: Policy) => void;
  emptyMessage?: string;
}

const categoryLabels: Record<string, string> = {
  spending: 'Расходы',
  distribution: 'Распределение',
  investment: 'Инвестиции',
  governance: 'Governance',
  succession: 'Преемственность',
  education: 'Образование',
  philanthropy: 'Филантропия',
  employment: 'Трудоустройство',
  conflict: 'Конфликт интересов',
  other: 'Другое',
};

export function GvPoliciesTable({ policies, onRowClick, emptyMessage }: GvPoliciesTableProps) {
  const columns = [
    {
      key: 'name',
      header: 'Название',
      render: (item: Policy) => (
        <div>
          <div className="font-medium text-stone-800">{item.name}</div>
          {item.version && (
            <span className="text-xs text-stone-500">v{item.version}</span>
          )}
        </div>
      ),
    },
    {
      key: 'categoryKey',
      header: 'Категория',
      render: (item: Policy) => (
        <span className="text-stone-600">
          {categoryLabels[item.categoryKey] || item.categoryKey}
        </span>
      ),
    },
    {
      key: 'effectiveDate',
      header: 'Действует с',
      render: (item: Policy) => (
        <span className="text-stone-600">
          {item.effectiveDate
            ? new Date(item.effectiveDate).toLocaleDateString('ru-RU')
            : '-'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Статус',
      width: 'w-28',
      render: (item: Policy) => <GvStatusPill status={item.status} size="sm" />,
    },
    {
      key: 'clientSafePublished',
      header: 'Client-safe',
      width: 'w-24',
      render: (item: Policy) => (
        item.clientSafePublished ? (
          <span className="inline-flex items-center text-emerald-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        ) : (
          <span className="text-stone-400">-</span>
        )
      ),
    },
    {
      key: 'updatedAt',
      header: 'Обновлено',
      render: (item: Policy) => (
        <span className="text-stone-500 text-sm">
          {item.updatedAt
            ? new Date(item.updatedAt).toLocaleDateString('ru-RU')
            : '-'}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={policies}
      columns={columns}
      onRowClick={onRowClick}
      emptyMessage={emptyMessage || "Нет политик"}
    />
  );
}
