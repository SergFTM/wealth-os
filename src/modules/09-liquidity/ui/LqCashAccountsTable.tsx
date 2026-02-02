"use client";

import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface CashAccount {
  id: string;
  name: string;
  entityId: string;
  bank: string;
  currency: string;
  balance: number;
  baseBalance: number;
  threshold: number;
  status: 'ok' | 'warning' | 'critical';
  lastSyncAt: string;
  sourceType: string;
}

interface LqCashAccountsTableProps {
  accounts: CashAccount[];
  onOpen: (id: string) => void;
  compact?: boolean;
  entityNames?: Record<string, string>;
}

export function LqCashAccountsTable({ accounts, onOpen, compact, entityNames = {} }: LqCashAccountsTableProps) {
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = compact ? [
    { key: 'name', header: 'Счет' },
    { key: 'currency', header: 'Валюта' },
    { key: 'balance', header: 'Баланс', render: (item: CashAccount) => formatCurrency(item.balance, item.currency) },
    { key: 'status', header: 'Статус', render: (item: CashAccount) => <StatusBadge status={item.status} /> }
  ] : [
    { key: 'name', header: 'Счет' },
    { key: 'entity', header: 'Юрлицо', render: (item: CashAccount) => entityNames[item.entityId] || item.entityId },
    { key: 'bank', header: 'Банк' },
    { key: 'currency', header: 'Валюта' },
    { key: 'balance', header: 'Баланс', render: (item: CashAccount) => formatCurrency(item.balance, item.currency) },
    { key: 'baseBalance', header: 'В USD', render: (item: CashAccount) => formatCurrency(item.baseBalance, 'USD') },
    { key: 'threshold', header: 'Порог', render: (item: CashAccount) => formatCurrency(item.threshold, item.currency) },
    { key: 'status', header: 'Статус', render: (item: CashAccount) => <StatusBadge status={item.status} /> },
    { key: 'lastSyncAt', header: 'Синхр.', render: (item: CashAccount) => formatDate(item.lastSyncAt) }
  ];

  const displayData = compact ? accounts.slice(0, 8) : accounts;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      {!compact && (
        <div className="px-4 py-3 border-b border-stone-200/50 bg-gradient-to-r from-emerald-50/50 to-amber-50/30">
          <h3 className="font-semibold text-stone-800">Счета</h3>
        </div>
      )}
      <DataTable
        data={displayData}
        columns={columns}
        onRowClick={(item) => onOpen(item.id)}
        emptyMessage="Нет счетов"
      />
    </div>
  );
}
