"use client";

import { DataTable } from '@/components/ui/DataTable';
import { MdStatusPill } from './MdStatusPill';
import { MdConfidencePill } from './MdConfidencePill';
import { EntityTypeLabels, EntityTypeKey } from '../config';

interface MdmEntity {
  id: string;
  status: string;
  entityTypeKey: EntityTypeKey;
  chosenJson: {
    legalName?: string;
    displayName?: string;
    jurisdiction?: string;
    registrationNumber?: string;
  };
  dqScore?: number;
  sourcesJson?: unknown[];
  createdAt: string;
  updatedAt: string;
}

interface MdEntitiesTableProps {
  data: MdmEntity[];
  onRowClick?: (entity: MdmEntity) => void;
}

export function MdEntitiesTable({ data, onRowClick }: MdEntitiesTableProps) {
  const columns = [
    {
      key: 'name',
      header: 'Название',
      render: (item: MdmEntity) => {
        const chosen = item.chosenJson || {};
        const name = chosen.displayName || chosen.legalName || '-';
        return <span className="font-medium text-stone-800">{name}</span>;
      },
    },
    {
      key: 'entityTypeKey',
      header: 'Тип',
      width: 'w-32',
      render: (item: MdmEntity) => {
        const label = EntityTypeLabels[item.entityTypeKey]?.ru || item.entityTypeKey;
        return <span className="text-stone-600 text-sm">{label}</span>;
      },
    },
    {
      key: 'jurisdiction',
      header: 'Юрисдикция',
      render: (item: MdmEntity) => (
        <span className="text-stone-600 text-sm">
          {item.chosenJson?.jurisdiction || '-'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Статус',
      width: 'w-28',
      render: (item: MdmEntity) => <MdStatusPill status={item.status} />,
    },
    {
      key: 'dqScore',
      header: 'DQ',
      width: 'w-20',
      render: (item: MdmEntity) => (
        <MdConfidencePill value={item.dqScore || 0} />
      ),
    },
    {
      key: 'sources',
      header: 'Источники',
      width: 'w-24',
      render: (item: MdmEntity) => (
        <span className="text-stone-600 text-sm">
          {(item.sourcesJson || []).length}
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
