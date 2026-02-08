"use client";

import { DataTable } from '@/components/ui/DataTable';
import { MdStatusPill } from './MdStatusPill';
import { StewardIssueLabels, StewardIssueTypeKey, SeverityKey, MdmRecordTypeKey } from '../config';

interface MdmStewardQueueItem {
  id: string;
  recordTypeKey: MdmRecordTypeKey;
  recordId: string;
  issueTypeKey: StewardIssueTypeKey;
  severity: SeverityKey;
  issueDetailsJson: {
    field?: string;
    description: string;
  };
  status: string;
  assignedToUserId?: string;
  createdAt: string;
}

interface MdStewardQueueTableProps {
  data: MdmStewardQueueItem[];
  onRowClick?: (item: MdmStewardQueueItem) => void;
}

const severityColors: Record<SeverityKey, string> = {
  low: 'bg-stone-100 text-stone-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const severityLabels: Record<SeverityKey, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  critical: 'Критический',
};

const recordTypeLabels: Record<MdmRecordTypeKey, string> = {
  people: 'Люди',
  entities: 'Сущности',
  accounts: 'Счета',
  assets: 'Активы',
};

export function MdStewardQueueTable({ data, onRowClick }: MdStewardQueueTableProps) {
  const columns = [
    {
      key: 'issueTypeKey',
      header: 'Тип проблемы',
      render: (item: MdmStewardQueueItem) => (
        <span className="text-stone-700 text-sm">
          {StewardIssueLabels[item.issueTypeKey]?.ru || item.issueTypeKey}
        </span>
      ),
    },
    {
      key: 'recordTypeKey',
      header: 'Запись',
      render: (item: MdmStewardQueueItem) => (
        <div>
          <span className="text-stone-500 text-xs">
            {recordTypeLabels[item.recordTypeKey] || item.recordTypeKey}
          </span>
          <div className="text-stone-700 text-sm font-mono">
            {item.recordId.substring(0, 12)}...
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Описание',
      render: (item: MdmStewardQueueItem) => (
        <div className="text-stone-600 text-sm max-w-xs truncate">
          {item.issueDetailsJson?.field && (
            <span className="font-medium">{item.issueDetailsJson.field}: </span>
          )}
          {item.issueDetailsJson?.description || '-'}
        </div>
      ),
    },
    {
      key: 'severity',
      header: 'Важность',
      width: 'w-28',
      render: (item: MdmStewardQueueItem) => (
        <span className={`px-2 py-1 text-xs rounded-full ${severityColors[item.severity]}`}>
          {severityLabels[item.severity]}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Статус',
      width: 'w-28',
      render: (item: MdmStewardQueueItem) => <MdStatusPill status={item.status} />,
    },
    {
      key: 'assignedTo',
      header: 'Назначен',
      width: 'w-28',
      render: (item: MdmStewardQueueItem) => (
        <span className="text-stone-500 text-sm">
          {item.assignedToUserId || '-'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Создан',
      width: 'w-28',
      render: (item: MdmStewardQueueItem) => (
        <span className="text-stone-500 text-sm">
          {new Date(item.createdAt).toLocaleDateString('ru-RU')}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      onRowClick={onRowClick}
    />
  );
}
