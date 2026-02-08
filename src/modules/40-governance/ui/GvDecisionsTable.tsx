"use client";

import { DataTable } from '@/components/ui/DataTable';
import { GvStatusPill } from './GvStatusPill';

interface Decision {
  id: string;
  title: string;
  meetingId?: string;
  meetingName?: string;
  status: 'draft' | 'pending_vote' | 'approved' | 'rejected' | 'deferred';
  categoryKey?: string;
  impactLevel?: string;
  voteId?: string;
  createdAt?: string;
}

interface GvDecisionsTableProps {
  decisions: Decision[];
  onRowClick?: (decision: Decision) => void;
  emptyMessage?: string;
}

const categoryLabels: Record<string, string> = {
  investment: 'Инвестиции',
  distribution: 'Распределение',
  spending: 'Расходы',
  governance: 'Governance',
  trust: 'Trust',
  family: 'Семья',
  philanthropy: 'Филантропия',
  succession: 'Преемственность',
  other: 'Другое',
};

const impactLabels: Record<string, { label: string; color: string }> = {
  low: { label: 'Низкий', color: 'text-stone-500' },
  medium: { label: 'Средний', color: 'text-amber-600' },
  high: { label: 'Высокий', color: 'text-orange-600' },
  critical: { label: 'Критический', color: 'text-rose-600' },
};

export function GvDecisionsTable({ decisions, onRowClick, emptyMessage }: GvDecisionsTableProps) {
  const columns = [
    {
      key: 'title',
      header: 'Решение',
      render: (item: Decision) => (
        <div className="font-medium text-stone-800">{item.title}</div>
      ),
    },
    {
      key: 'meetingName',
      header: 'Заседание',
      render: (item: Decision) => (
        <span className="text-stone-600">{item.meetingName || '-'}</span>
      ),
    },
    {
      key: 'categoryKey',
      header: 'Категория',
      render: (item: Decision) => (
        <span className="text-stone-600">
          {item.categoryKey ? categoryLabels[item.categoryKey] || item.categoryKey : '-'}
        </span>
      ),
    },
    {
      key: 'impactLevel',
      header: 'Влияние',
      width: 'w-28',
      render: (item: Decision) => {
        if (!item.impactLevel) return <span className="text-stone-400">-</span>;
        const impact = impactLabels[item.impactLevel];
        return (
          <span className={impact?.color || 'text-stone-500'}>
            {impact?.label || item.impactLevel}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Статус',
      width: 'w-32',
      render: (item: Decision) => <GvStatusPill status={item.status} size="sm" />,
    },
    {
      key: 'voteId',
      header: 'Голосование',
      width: 'w-28',
      render: (item: Decision) => (
        item.voteId ? (
          <span className="inline-flex items-center text-emerald-600">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Есть
          </span>
        ) : (
          <span className="text-stone-400">-</span>
        )
      ),
    },
  ];

  return (
    <DataTable
      data={decisions}
      columns={columns}
      onRowClick={onRowClick}
      emptyMessage={emptyMessage || "Нет решений"}
    />
  );
}
