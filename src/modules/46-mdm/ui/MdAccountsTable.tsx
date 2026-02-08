"use client";

import { DataTable } from '@/components/ui/DataTable';
import { MdStatusPill } from './MdStatusPill';
import { MdConfidencePill } from './MdConfidencePill';
import { AccountTypeLabels, AccountTypeKey } from '../config';

interface MdmAccount {
  id: string;
  status: string;
  accountTypeKey: AccountTypeKey;
  chosenJson: {
    accountName?: string;
    institution?: string;
    accountNumber?: string;
    accountNumberMasked?: string;
    currency?: string;
  };
  dqScore?: number;
  linkedEntityId?: string;
  sourcesJson?: unknown[];
  createdAt: string;
  updatedAt: string;
}

interface MdAccountsTableProps {
  data: MdmAccount[];
  onRowClick?: (account: MdmAccount) => void;
}

export function MdAccountsTable({ data, onRowClick }: MdAccountsTableProps) {
  const columns = [
    {
      key: 'institution',
      header: 'Институция',
      render: (item: MdmAccount) => (
        <span className="font-medium text-stone-800">
          {item.chosenJson?.institution || '-'}
        </span>
      ),
    },
    {
      key: 'accountTypeKey',
      header: 'Тип',
      width: 'w-28',
      render: (item: MdmAccount) => {
        const label = AccountTypeLabels[item.accountTypeKey]?.ru || item.accountTypeKey;
        return <span className="text-stone-600 text-sm">{label}</span>;
      },
    },
    {
      key: 'accountNumber',
      header: 'Номер счета',
      render: (item: MdmAccount) => (
        <span className="text-stone-600 text-sm font-mono">
          {item.chosenJson?.accountNumberMasked || '****'}
        </span>
      ),
    },
    {
      key: 'currency',
      header: 'Валюта',
      width: 'w-20',
      render: (item: MdmAccount) => (
        <span className="text-stone-600 text-sm">
          {item.chosenJson?.currency || '-'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Статус',
      width: 'w-28',
      render: (item: MdmAccount) => <MdStatusPill status={item.status} />,
    },
    {
      key: 'dqScore',
      header: 'DQ',
      width: 'w-20',
      render: (item: MdmAccount) => (
        <MdConfidencePill value={item.dqScore || 0} />
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
