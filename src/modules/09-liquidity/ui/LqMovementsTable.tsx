"use client";

import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface CashMovement {
  id: string;
  accountId: string;
  entityId: string;
  date: string;
  type: 'inflow' | 'outflow' | 'transfer';
  amount: number;
  currency: string;
  status: 'planned' | 'posted' | 'cancelled';
  description: string;
  sourceType: string;
  sourceRef: string | null;
}

interface LqMovementsTableProps {
  movements: CashMovement[];
  onOpen: (id: string) => void;
  onMarkPosted?: (id: string) => void;
  accountNames?: Record<string, string>;
  entityNames?: Record<string, string>;
  compact?: boolean;
}

export function LqMovementsTable({ 
  movements, 
  onOpen, 
  accountNames = {},
  entityNames = {},
  compact 
}: LqMovementsTableProps) {
  const formatCurrency = (val: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
  };

  const typeLabels: Record<string, string> = {
    inflow: 'Приход',
    outflow: 'Расход',
    transfer: 'Перевод'
  };

  const statusMap: Record<string, 'ok' | 'warning' | 'info'> = {
    posted: 'ok',
    planned: 'warning',
    cancelled: 'info'
  };

  const columns = compact ? [
    { key: 'date', header: 'Дата', render: (item: CashMovement) => formatDate(item.date) },
    { key: 'type', header: 'Тип', render: (item: CashMovement) => typeLabels[item.type] },
    { key: 'amount', header: 'Сумма', render: (item: CashMovement) => (
      <span className={item.type === 'inflow' ? 'text-emerald-600' : 'text-rose-500'}>
        {item.type === 'inflow' ? '+' : '-'}{formatCurrency(item.amount, item.currency)}
      </span>
    )},
    { key: 'status', header: 'Статус', render: (item: CashMovement) => <StatusBadge status={statusMap[item.status]} label={item.status} /> }
  ] : [
    { key: 'date', header: 'Дата', render: (item: CashMovement) => formatDate(item.date) },
    { key: 'account', header: 'Счет', render: (item: CashMovement) => accountNames[item.accountId] || item.accountId },
    { key: 'entity', header: 'Юрлицо', render: (item: CashMovement) => entityNames[item.entityId] || item.entityId },
    { key: 'type', header: 'Тип', render: (item: CashMovement) => typeLabels[item.type] },
    { key: 'amount', header: 'Сумма', render: (item: CashMovement) => (
      <span className={item.type === 'inflow' ? 'text-emerald-600' : 'text-rose-500'}>
        {item.type === 'inflow' ? '+' : '-'}{formatCurrency(item.amount, item.currency)}
      </span>
    )},
    { key: 'description', header: 'Описание' },
    { key: 'status', header: 'Статус', render: (item: CashMovement) => <StatusBadge status={statusMap[item.status]} label={item.status} /> },
    { key: 'sourceType', header: 'Источник' }
  ];

  const displayData = compact ? movements.slice(0, 8) : movements;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      {!compact && (
        <div className="px-4 py-3 border-b border-stone-200/50 bg-gradient-to-r from-emerald-50/50 to-amber-50/30">
          <h3 className="font-semibold text-stone-800">Движения</h3>
        </div>
      )}
      <DataTable
        data={displayData}
        columns={columns}
        onRowClick={(item) => onOpen(item.id)}
        emptyMessage="Нет движений"
      />
    </div>
  );
}
