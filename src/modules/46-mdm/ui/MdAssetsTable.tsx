"use client";

import { DataTable } from '@/components/ui/DataTable';
import { MdStatusPill } from './MdStatusPill';
import { MdConfidencePill } from './MdConfidencePill';
import { AssetTypeLabels, AssetTypeKey } from '../config';

interface MdmAsset {
  id: string;
  status: string;
  assetTypeKey: AssetTypeKey;
  chosenJson: {
    name?: string;
    displayName?: string;
    ticker?: string;
    isin?: string;
    cusip?: string;
    exchange?: string;
    currency?: string;
  };
  identifiersJson?: {
    isin?: string;
    cusip?: string;
    sedol?: string;
    bloomberg?: string;
  };
  dqScore?: number;
  sourcesJson?: unknown[];
  createdAt: string;
  updatedAt: string;
}

interface MdAssetsTableProps {
  data: MdmAsset[];
  onRowClick?: (asset: MdmAsset) => void;
}

export function MdAssetsTable({ data, onRowClick }: MdAssetsTableProps) {
  const columns = [
    {
      key: 'name',
      header: 'Название',
      render: (item: MdmAsset) => {
        const chosen = item.chosenJson || {};
        const name = chosen.displayName || chosen.name || '-';
        return (
          <div>
            <span className="font-medium text-stone-800">{name}</span>
            {chosen.ticker && (
              <span className="ml-2 text-xs font-mono text-stone-500">{chosen.ticker}</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'assetTypeKey',
      header: 'Тип',
      width: 'w-32',
      render: (item: MdmAsset) => {
        const label = AssetTypeLabels[item.assetTypeKey]?.ru || item.assetTypeKey;
        return <span className="text-stone-600 text-sm">{label}</span>;
      },
    },
    {
      key: 'identifiers',
      header: 'Идентификаторы',
      render: (item: MdmAsset) => {
        const ids = item.identifiersJson || item.chosenJson;
        const parts: string[] = [];
        if (ids?.isin) parts.push(`ISIN: ${ids.isin}`);
        else if (ids?.cusip) parts.push(`CUSIP: ${ids.cusip}`);
        return (
          <span className="text-stone-600 text-xs font-mono">
            {parts.join(' | ') || '-'}
          </span>
        );
      },
    },
    {
      key: 'exchange',
      header: 'Биржа',
      width: 'w-24',
      render: (item: MdmAsset) => (
        <span className="text-stone-600 text-sm">
          {item.chosenJson?.exchange || '-'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Статус',
      width: 'w-28',
      render: (item: MdmAsset) => <MdStatusPill status={item.status} />,
    },
    {
      key: 'dqScore',
      header: 'DQ',
      width: 'w-20',
      render: (item: MdmAsset) => (
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
