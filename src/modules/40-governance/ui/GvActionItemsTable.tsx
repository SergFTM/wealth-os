"use client";

import { DataTable } from '@/components/ui/DataTable';
import { GvStatusPill } from './GvStatusPill';
import { cn } from '@/lib/utils';

interface ActionItem {
  id: string;
  title: string;
  ownerName?: string;
  dueAt: string;
  status: 'open' | 'in_progress' | 'done' | 'cancelled' | 'deferred';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  decisionId?: string;
  decisionTitle?: string;
  meetingId?: string;
  meetingName?: string;
  linkedTaskId?: string;
}

interface GvActionItemsTableProps {
  actionItems: ActionItem[];
  onRowClick?: (item: ActionItem) => void;
  onMarkDone?: (item: ActionItem) => void;
  emptyMessage?: string;
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: 'Низкий', color: 'text-stone-500' },
  medium: { label: 'Средний', color: 'text-amber-600' },
  high: { label: 'Высокий', color: 'text-orange-600' },
  urgent: { label: 'Срочный', color: 'text-rose-600' },
};

export function GvActionItemsTable({ actionItems, onRowClick, onMarkDone, emptyMessage }: GvActionItemsTableProps) {
  const isOverdue = (dueAt: string, status: string) => {
    if (status === 'done' || status === 'cancelled') return false;
    return new Date(dueAt) < new Date();
  };

  const isDueSoon = (dueAt: string, status: string) => {
    if (status === 'done' || status === 'cancelled') return false;
    const due = new Date(dueAt);
    const now = new Date();
    const threeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    return due <= threeDays && due >= now;
  };

  const columns = [
    {
      key: 'title',
      header: 'Задача',
      render: (item: ActionItem) => (
        <div>
          <div className={cn(
            "font-medium",
            isOverdue(item.dueAt, item.status) ? "text-rose-700" : "text-stone-800"
          )}>
            {item.title}
          </div>
          {item.decisionTitle && (
            <span className="text-xs text-stone-500">
              Решение: {item.decisionTitle}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'ownerName',
      header: 'Ответственный',
      render: (item: ActionItem) => (
        <span className="text-stone-600">{item.ownerName || '-'}</span>
      ),
    },
    {
      key: 'dueAt',
      header: 'Срок',
      render: (item: ActionItem) => {
        const overdue = isOverdue(item.dueAt, item.status);
        const soon = isDueSoon(item.dueAt, item.status);
        return (
          <span className={cn(
            overdue ? "text-rose-600 font-medium" :
            soon ? "text-amber-600" : "text-stone-600"
          )}>
            {new Date(item.dueAt).toLocaleDateString('ru-RU')}
            {overdue && <span className="ml-1 text-xs">(просрочено)</span>}
          </span>
        );
      },
    },
    {
      key: 'priority',
      header: 'Приоритет',
      width: 'w-24',
      render: (item: ActionItem) => {
        const config = priorityConfig[item.priority || 'medium'];
        return (
          <span className={config.color}>{config.label}</span>
        );
      },
    },
    {
      key: 'status',
      header: 'Статус',
      width: 'w-28',
      render: (item: ActionItem) => <GvStatusPill status={item.status} size="sm" />,
    },
    {
      key: 'linkedTaskId',
      header: 'Задача',
      width: 'w-20',
      render: (item: ActionItem) => (
        item.linkedTaskId ? (
          <span className="inline-flex items-center text-sky-600" title="Связано с workflow">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </span>
        ) : (
          <span className="text-stone-400">-</span>
        )
      ),
    },
    ...(onMarkDone ? [{
      key: 'actions',
      header: '',
      width: 'w-20',
      render: (item: ActionItem) => (
        item.status !== 'done' && item.status !== 'cancelled' ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkDone(item);
            }}
            className="text-emerald-600 hover:text-emerald-700"
            title="Отметить выполненным"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        ) : null
      ),
    }] : []),
  ];

  return (
    <DataTable
      data={actionItems}
      columns={columns}
      onRowClick={onRowClick}
      emptyMessage={emptyMessage || "Нет action items"}
    />
  );
}
