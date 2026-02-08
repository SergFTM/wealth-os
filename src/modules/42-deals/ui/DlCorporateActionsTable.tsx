"use client";

import { DataTable } from '@/components/ui/DataTable';
import { DlStatusPill } from './DlStatusPill';

interface CorporateAction {
  id: string;
  ticker: string;
  securityName?: string;
  actionType: string;
  effectiveDate: string;
  status: 'planned' | 'announced' | 'processed' | 'cancelled';
  impactJson?: {
    estimatedCashImpact?: number;
    affectedShares?: number;
  };
}

interface DlCorporateActionsTableProps {
  actions: CorporateAction[];
  onRowClick?: (action: CorporateAction) => void;
  emptyMessage?: string;
}

const ACTION_TYPE_LABELS: Record<string, string> = {
  dividend: 'Дивиденд',
  split: 'Сплит',
  reverse_split: 'Обратный сплит',
  merger: 'Слияние',
  acquisition: 'Поглощение',
  tender: 'Тендер',
  spin_off: 'Спин-офф',
  rights_issue: 'Выпуск прав',
  name_change: 'Смена названия',
  symbol_change: 'Смена тикера',
};

export function DlCorporateActionsTable({ actions, onRowClick, emptyMessage }: DlCorporateActionsTableProps) {
  const columns = [
    {
      key: 'ticker',
      header: 'Тикер',
      width: 'w-24',
      render: (item: CorporateAction) => (
        <div>
          <div className="font-medium text-stone-800">{item.ticker}</div>
          {item.securityName && (
            <div className="text-xs text-stone-500 truncate max-w-[150px]">{item.securityName}</div>
          )}
        </div>
      ),
    },
    {
      key: 'actionType',
      header: 'Тип',
      render: (item: CorporateAction) => (
        <span className="text-stone-700">
          {ACTION_TYPE_LABELS[item.actionType] || item.actionType}
        </span>
      ),
    },
    {
      key: 'effectiveDate',
      header: 'Дата',
      width: 'w-28',
      render: (item: CorporateAction) => (
        <span className="text-stone-600">
          {new Date(item.effectiveDate).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Статус',
      width: 'w-32',
      render: (item: CorporateAction) => <DlStatusPill status={item.status} size="sm" />,
    },
    {
      key: 'impact',
      header: 'Влияние',
      render: (item: CorporateAction) => {
        const impact = item.impactJson;
        if (!impact) return <span className="text-stone-400">-</span>;

        if (impact.estimatedCashImpact) {
          return (
            <span className="text-emerald-600 font-medium">
              ${impact.estimatedCashImpact.toLocaleString()}
            </span>
          );
        }
        if (impact.affectedShares) {
          return (
            <span className="text-stone-600">
              {impact.affectedShares.toLocaleString()} акций
            </span>
          );
        }
        return <span className="text-stone-400">-</span>;
      },
    },
  ];

  return (
    <DataTable
      data={actions}
      columns={columns}
      onRowClick={onRowClick}
      emptyMessage={emptyMessage || "Нет corporate actions"}
    />
  );
}

export default DlCorporateActionsTable;
