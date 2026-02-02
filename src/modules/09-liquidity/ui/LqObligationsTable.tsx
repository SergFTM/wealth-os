"use client";

import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface Obligation {
  id: string;
  name: string;
  entityId: string;
  type: string;
  dueDate: string;
  amount: number;
  currency: string;
  frequency: string;
  status: 'scheduled' | 'paid' | 'overdue' | 'cancelled';
  sourceType: string;
}

interface LqObligationsTableProps {
  obligations: Obligation[];
  onOpen: (id: string) => void;
  onPay?: (id: string) => void;
  entityNames?: Record<string, string>;
  compact?: boolean;
}

export function LqObligationsTable({ 
  obligations, 
  onOpen, 
  entityNames = {},
  compact 
}: LqObligationsTableProps) {
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
      month: 'short'
    });
  };

  const typeLabels: Record<string, string> = {
    loan: 'Кредит',
    rent: 'Аренда',
    fee: 'Комиссия',
    bill: 'Счет',
    tax: 'Налоги',
    salary: 'Зарплата',
    other: 'Прочее'
  };

  const statusMap: Record<string, 'ok' | 'warning' | 'critical' | 'info'> = {
    paid: 'ok',
    scheduled: 'warning',
    overdue: 'critical',
    cancelled: 'info'
  };

  const columns = compact ? [
    { key: 'dueDate', header: 'Дата', render: (item: Obligation) => formatDate(item.dueDate) },
    { key: 'name', header: 'Обязательство' },
    { key: 'amount', header: 'Сумма', render: (item: Obligation) => formatCurrency(item.amount, item.currency) },
    { key: 'status', header: 'Статус', render: (item: Obligation) => <StatusBadge status={statusMap[item.status]} label={item.status} /> }
  ] : [
    { key: 'dueDate', header: 'Срок', render: (item: Obligation) => formatDate(item.dueDate) },
    { key: 'name', header: 'Обязательство' },
    { key: 'entity', header: 'Юрлицо', render: (item: Obligation) => entityNames[item.entityId] || item.entityId },
    { key: 'type', header: 'Тип', render: (item: Obligation) => typeLabels[item.type] || item.type },
    { key: 'amount', header: 'Сумма', render: (item: Obligation) => formatCurrency(item.amount, item.currency) },
    { key: 'frequency', header: 'Частота' },
    { key: 'status', header: 'Статус', render: (item: Obligation) => <StatusBadge status={statusMap[item.status]} label={item.status} /> },
    { key: 'sourceType', header: 'Источник' }
  ];

  const displayData = compact ? obligations.slice(0, 8) : obligations;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      {!compact && (
        <div className="px-4 py-3 border-b border-stone-200/50 bg-gradient-to-r from-emerald-50/50 to-amber-50/30">
          <h3 className="font-semibold text-stone-800">Обязательства</h3>
        </div>
      )}
      <DataTable
        data={displayData}
        columns={columns}
        onRowClick={(item) => onOpen(item.id)}
        emptyMessage="Нет обязательств"
      />
    </div>
  );
}
