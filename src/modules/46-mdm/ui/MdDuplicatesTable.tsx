"use client";

import { DataTable } from '@/components/ui/DataTable';
import { MdStatusPill } from './MdStatusPill';
import { MdConfidencePill } from './MdConfidencePill';
import { MdmRecordTypeKey } from '../config';

interface MatchReason {
  field: string;
  reason: string;
  weight: number;
}

interface MdmDuplicate {
  id: string;
  recordTypeKey: MdmRecordTypeKey;
  candidateAId: string;
  candidateBId: string;
  matchScore: number;
  reasonsJson?: MatchReason[];
  status: string;
  mergeJobId?: string;
  createdAt: string;
}

interface MdDuplicatesTableProps {
  data: MdmDuplicate[];
  recordNames?: Map<string, string>;
  onRowClick?: (duplicate: MdmDuplicate) => void;
}

const recordTypeLabels: Record<MdmRecordTypeKey, string> = {
  people: 'Люди',
  entities: 'Сущности',
  accounts: 'Счета',
  assets: 'Активы',
};

export function MdDuplicatesTable({ data, recordNames, onRowClick }: MdDuplicatesTableProps) {
  const getName = (id: string) => recordNames?.get(id) || id.substring(0, 8) + '...';

  const columns = [
    {
      key: 'recordTypeKey',
      header: 'Тип',
      width: 'w-28',
      render: (item: MdmDuplicate) => (
        <span className="text-stone-600 text-sm">
          {recordTypeLabels[item.recordTypeKey] || item.recordTypeKey}
        </span>
      ),
    },
    {
      key: 'candidateA',
      header: 'Кандидат A',
      render: (item: MdmDuplicate) => (
        <span className="font-medium text-stone-800">{getName(item.candidateAId)}</span>
      ),
    },
    {
      key: 'candidateB',
      header: 'Кандидат B',
      render: (item: MdmDuplicate) => (
        <span className="font-medium text-stone-800">{getName(item.candidateBId)}</span>
      ),
    },
    {
      key: 'matchScore',
      header: 'Совпадение',
      width: 'w-28',
      render: (item: MdmDuplicate) => (
        <MdConfidencePill value={Math.round(item.matchScore * 100)} />
      ),
    },
    {
      key: 'reasons',
      header: 'Причины',
      render: (item: MdmDuplicate) => {
        const reasons = item.reasonsJson || [];
        const topReasons = reasons.slice(0, 2);
        return (
          <div className="text-xs text-stone-500">
            {topReasons.map((r, i) => (
              <span key={i}>
                {r.field}: {r.reason}
                {i < topReasons.length - 1 ? ', ' : ''}
              </span>
            ))}
            {reasons.length > 2 && <span> +{reasons.length - 2}</span>}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Статус',
      width: 'w-28',
      render: (item: MdmDuplicate) => <MdStatusPill status={item.status} />,
    },
    {
      key: 'createdAt',
      header: 'Найден',
      width: 'w-28',
      render: (item: MdmDuplicate) => (
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
