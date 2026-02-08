"use client";

import { DataTable } from '@/components/ui/DataTable';
import { MdStatusPill } from './MdStatusPill';
import { MdConfidencePill } from './MdConfidencePill';
import { PersonTypeLabels, PersonTypeKey } from '../config';

interface MdmPerson {
  id: string;
  status: string;
  personTypeKey: PersonTypeKey;
  chosenJson: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    email?: string;
    phone?: string;
  };
  dqScore?: number;
  sourcesJson?: unknown[];
  createdAt: string;
  updatedAt: string;
}

interface MdPeopleTableProps {
  data: MdmPerson[];
  onRowClick?: (person: MdmPerson) => void;
}

export function MdPeopleTable({ data, onRowClick }: MdPeopleTableProps) {
  const columns = [
    {
      key: 'name',
      header: 'ФИО',
      render: (item: MdmPerson) => {
        const chosen = item.chosenJson || {};
        const name = chosen.displayName || `${chosen.firstName || ''} ${chosen.lastName || ''}`.trim() || '-';
        return <span className="font-medium text-stone-800">{name}</span>;
      },
    },
    {
      key: 'personTypeKey',
      header: 'Тип',
      width: 'w-32',
      render: (item: MdmPerson) => {
        const label = PersonTypeLabels[item.personTypeKey]?.ru || item.personTypeKey;
        return <span className="text-stone-600 text-sm">{label}</span>;
      },
    },
    {
      key: 'email',
      header: 'Email',
      render: (item: MdmPerson) => {
        const email = item.chosenJson?.email;
        if (!email) return <span className="text-stone-400">-</span>;
        // Mask email
        const [local, domain] = email.split('@');
        const masked = local.length > 2
          ? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}@${domain}`
          : email;
        return <span className="text-stone-600 text-sm">{masked}</span>;
      },
    },
    {
      key: 'status',
      header: 'Статус',
      width: 'w-28',
      render: (item: MdmPerson) => <MdStatusPill status={item.status} />,
    },
    {
      key: 'dqScore',
      header: 'DQ',
      width: 'w-20',
      render: (item: MdmPerson) => (
        <MdConfidencePill value={item.dqScore || 0} />
      ),
    },
    {
      key: 'sources',
      header: 'Источники',
      width: 'w-24',
      render: (item: MdmPerson) => (
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
