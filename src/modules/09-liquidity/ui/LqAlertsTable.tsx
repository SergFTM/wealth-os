"use client";

import { DataTable } from '@/components/ui/DataTable';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface LiquidityAlert {
  id: string;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  relatedType: string;
  relatedId: string;
  entityId: string;
  status: 'open' | 'acknowledged' | 'resolved';
  owner: string | null;
  createdAt: string;
}

interface LqAlertsTableProps {
  alerts: LiquidityAlert[];
  onOpen: (id: string) => void;
  onAcknowledge?: (id: string) => void;
  onCreateTask?: (id: string) => void;
  entityNames?: Record<string, string>;
  compact?: boolean;
}

export function LqAlertsTable({ 
  alerts, 
  onOpen, 
  entityNames = {},
  compact 
}: LqAlertsTableProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) return `${diffHours}ч назад`;
    if (diffHours < 48) return 'вчера';
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' });
  };

  const severityMap: Record<string, 'ok' | 'warning' | 'critical' | 'info'> = {
    info: 'info',
    warning: 'warning',
    critical: 'critical'
  };

  const statusLabels: Record<string, string> = {
    open: 'Открыт',
    acknowledged: 'Подтвержден',
    resolved: 'Решен'
  };

  const columns = compact ? [
    { key: 'severity', header: 'Уровень', render: (item: LiquidityAlert) => <StatusBadge status={severityMap[item.severity]} label={item.severity} /> },
    { key: 'title', header: 'Алерт' },
    { key: 'status', header: 'Статус', render: (item: LiquidityAlert) => statusLabels[item.status] },
    { key: 'createdAt', header: 'Создан', render: (item: LiquidityAlert) => formatDate(item.createdAt) }
  ] : [
    { key: 'severity', header: 'Уровень', render: (item: LiquidityAlert) => <StatusBadge status={severityMap[item.severity]} label={item.severity} /> },
    { key: 'title', header: 'Алерт' },
    { key: 'entity', header: 'Юрлицо', render: (item: LiquidityAlert) => entityNames[item.entityId] || item.entityId },
    { key: 'relatedType', header: 'Связь' },
    { key: 'status', header: 'Статус', render: (item: LiquidityAlert) => statusLabels[item.status] },
    { key: 'owner', header: 'Ответственный', render: (item: LiquidityAlert) => item.owner || '—' },
    { key: 'createdAt', header: 'Создан', render: (item: LiquidityAlert) => formatDate(item.createdAt) }
  ];

  const displayData = compact ? alerts.slice(0, 6) : alerts;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      {!compact && (
        <div className="px-4 py-3 border-b border-stone-200/50 bg-gradient-to-r from-emerald-50/50 to-amber-50/30">
          <h3 className="font-semibold text-stone-800">Алерты</h3>
        </div>
      )}
      <DataTable
        data={displayData}
        columns={columns}
        onRowClick={(item) => onOpen(item.id)}
        emptyMessage="Нет алертов"
      />
    </div>
  );
}
