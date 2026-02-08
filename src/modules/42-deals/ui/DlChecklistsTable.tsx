"use client";

import { DataTable } from '@/components/ui/DataTable';

interface Checklist {
  id: string;
  name: string;
  linkedType: string;
  linkedId?: string;
  linkedName?: string;
  ownerName?: string;
  completionPct: number;
  itemsJson?: Array<{ status: string }>;
}

interface DlChecklistsTableProps {
  checklists: Checklist[];
  onRowClick?: (checklist: Checklist) => void;
  emptyMessage?: string;
}

export function DlChecklistsTable({ checklists, onRowClick, emptyMessage }: DlChecklistsTableProps) {
  const columns = [
    {
      key: 'name',
      header: 'Название',
      render: (item: Checklist) => (
        <div>
          <div className="font-medium text-stone-800">{item.name}</div>
          {item.linkedName && (
            <div className="text-xs text-stone-500">{item.linkedName}</div>
          )}
        </div>
      ),
    },
    {
      key: 'linkedType',
      header: 'Тип',
      width: 'w-24',
      render: (item: Checklist) => {
        const labels: Record<string, string> = {
          deal: 'Deal',
          action: 'Action',
          fund_event: 'Event',
        };
        return <span className="text-stone-600">{labels[item.linkedType] || item.linkedType}</span>;
      },
    },
    {
      key: 'completionPct',
      header: 'Прогресс',
      width: 'w-32',
      render: (item: Checklist) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                item.completionPct === 100
                  ? 'bg-emerald-500'
                  : item.completionPct >= 50
                  ? 'bg-blue-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${item.completionPct}%` }}
            />
          </div>
          <span className="text-xs text-stone-600 w-10 text-right">{item.completionPct}%</span>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Пункты',
      width: 'w-24',
      render: (item: Checklist) => {
        const items = item.itemsJson || [];
        const completed = items.filter(i => i.status === 'completed').length;
        return (
          <span className="text-stone-600">
            {completed}/{items.length}
          </span>
        );
      },
    },
    {
      key: 'ownerName',
      header: 'Владелец',
      width: 'w-28',
      render: (item: Checklist) => (
        <span className="text-stone-600">{item.ownerName || '-'}</span>
      ),
    },
  ];

  return (
    <DataTable
      data={checklists}
      columns={columns}
      onRowClick={onRowClick}
      emptyMessage={emptyMessage || "Нет checklists"}
    />
  );
}

export default DlChecklistsTable;
