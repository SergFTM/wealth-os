"use client";

import { DataTable } from '@/components/ui/DataTable';
import { DlStatusPill } from './DlStatusPill';

interface FundEvent {
  id: string;
  fundName: string;
  eventType: string;
  eventDate: string;
  amount: number;
  currency?: string;
  status: 'planned' | 'announced' | 'recorded' | 'paid' | 'cancelled';
  dueDate?: string;
}

interface DlFundEventsTableProps {
  events: FundEvent[];
  onRowClick?: (event: FundEvent) => void;
  emptyMessage?: string;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  capital_call: 'Capital call',
  distribution: 'Distribution',
  nav_update: 'NAV update',
  recallable: 'Recallable',
  equalization: 'Equalization',
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  capital_call: 'text-red-600',
  distribution: 'text-emerald-600',
  nav_update: 'text-blue-600',
  recallable: 'text-amber-600',
  equalization: 'text-stone-600',
};

export function DlFundEventsTable({ events, onRowClick, emptyMessage }: DlFundEventsTableProps) {
  const columns = [
    {
      key: 'fundName',
      header: 'Фонд',
      render: (item: FundEvent) => (
        <div className="font-medium text-stone-800">{item.fundName}</div>
      ),
    },
    {
      key: 'eventType',
      header: 'Тип',
      width: 'w-28',
      render: (item: FundEvent) => (
        <span className={EVENT_TYPE_COLORS[item.eventType] || 'text-stone-600'}>
          {EVENT_TYPE_LABELS[item.eventType] || item.eventType}
        </span>
      ),
    },
    {
      key: 'eventDate',
      header: 'Дата',
      width: 'w-28',
      render: (item: FundEvent) => (
        <span className="text-stone-600">
          {new Date(item.eventDate).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Сумма',
      width: 'w-28',
      render: (item: FundEvent) => {
        const isOutflow = item.eventType === 'capital_call';
        return (
          <span className={`font-medium ${isOutflow ? 'text-red-600' : 'text-emerald-600'}`}>
            {isOutflow ? '-' : '+'}${item.amount.toLocaleString()}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Статус',
      width: 'w-28',
      render: (item: FundEvent) => <DlStatusPill status={item.status} size="sm" />,
    },
    {
      key: 'dueDate',
      header: 'Срок',
      width: 'w-24',
      render: (item: FundEvent) => {
        if (!item.dueDate) return <span className="text-stone-300">-</span>;
        const isOverdue = new Date(item.dueDate) < new Date() && item.status !== 'paid';
        return (
          <span className={isOverdue ? 'text-red-600 font-medium' : 'text-stone-600'}>
            {new Date(item.dueDate).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        );
      },
    },
  ];

  return (
    <DataTable
      data={events}
      columns={columns}
      onRowClick={onRowClick}
      emptyMessage={emptyMessage || "Нет fund events"}
    />
  );
}

export default DlFundEventsTable;
