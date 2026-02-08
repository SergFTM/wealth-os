"use client";

import { DataTable } from '@/components/ui/DataTable';
import { DlStatusPill } from './DlStatusPill';

interface PrivateDeal {
  id: string;
  name: string;
  dealType: string;
  stage: 'draft' | 'in_review' | 'approved' | 'executed' | 'closed';
  amount?: number;
  currency?: string;
  targetEntityName?: string;
  closeDate?: string;
  taxFlag?: boolean;
}

interface DlPrivateDealsTableProps {
  deals: PrivateDeal[];
  onRowClick?: (deal: PrivateDeal) => void;
  emptyMessage?: string;
}

const DEAL_TYPE_LABELS: Record<string, string> = {
  subscription: 'Подписка',
  secondary: 'Secondary',
  co_invest: 'Co-investment',
  spv: 'SPV',
  direct: 'Прямая инвестиция',
  fund_commitment: 'Commitment',
};

export function DlPrivateDealsTable({ deals, onRowClick, emptyMessage }: DlPrivateDealsTableProps) {
  const columns = [
    {
      key: 'name',
      header: 'Название',
      render: (item: PrivateDeal) => (
        <div>
          <div className="font-medium text-stone-800">{item.name}</div>
          {item.targetEntityName && (
            <div className="text-xs text-stone-500">{item.targetEntityName}</div>
          )}
        </div>
      ),
    },
    {
      key: 'dealType',
      header: 'Тип',
      width: 'w-28',
      render: (item: PrivateDeal) => (
        <span className="text-stone-600">
          {DEAL_TYPE_LABELS[item.dealType] || item.dealType}
        </span>
      ),
    },
    {
      key: 'stage',
      header: 'Стадия',
      width: 'w-32',
      render: (item: PrivateDeal) => <DlStatusPill status={item.stage} size="sm" />,
    },
    {
      key: 'amount',
      header: 'Сумма',
      width: 'w-28',
      render: (item: PrivateDeal) => (
        item.amount ? (
          <span className="font-medium text-stone-800">
            ${item.amount.toLocaleString()}
          </span>
        ) : (
          <span className="text-stone-400">-</span>
        )
      ),
    },
    {
      key: 'closeDate',
      header: 'Закрытие',
      width: 'w-28',
      render: (item: PrivateDeal) => (
        item.closeDate ? (
          <span className="text-stone-600">
            {new Date(item.closeDate).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        ) : (
          <span className="text-stone-400">-</span>
        )
      ),
    },
    {
      key: 'taxFlag',
      header: 'Tax',
      width: 'w-16',
      render: (item: PrivateDeal) => (
        item.taxFlag ? (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </span>
        ) : (
          <span className="text-stone-300">-</span>
        )
      ),
    },
  ];

  return (
    <DataTable
      data={deals}
      columns={columns}
      onRowClick={onRowClick}
      emptyMessage={emptyMessage || "Нет private deals"}
    />
  );
}

export default DlPrivateDealsTable;
