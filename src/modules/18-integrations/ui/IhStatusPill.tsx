"use client";

import { CheckCircle, AlertTriangle, XCircle, Clock, Pause } from 'lucide-react';

interface IhStatusPillProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { label: string; color: string; bg: string; Icon: React.ComponentType<{ className?: string }> }> = {
  // Connector status
  active: { label: 'Активен', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircle },
  disabled: { label: 'Отключен', color: 'text-stone-500', bg: 'bg-stone-100', Icon: Pause },
  // Health status
  ok: { label: 'OK', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircle },
  warning: { label: 'Warning', color: 'text-amber-600', bg: 'bg-amber-50', Icon: AlertTriangle },
  critical: { label: 'Critical', color: 'text-red-600', bg: 'bg-red-50', Icon: XCircle },
  // Run status
  success: { label: 'Успешно', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircle },
  failed: { label: 'Ошибка', color: 'text-red-600', bg: 'bg-red-50', Icon: XCircle },
  partial: { label: 'Частично', color: 'text-amber-600', bg: 'bg-amber-50', Icon: AlertTriangle },
  running: { label: 'Выполняется', color: 'text-blue-600', bg: 'bg-blue-50', Icon: Clock },
  // Job status
  enabled: { label: 'Включен', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircle },
  paused: { label: 'Пауза', color: 'text-stone-500', bg: 'bg-stone-100', Icon: Pause },
  // Issue status
  open: { label: 'Открыт', color: 'text-red-600', bg: 'bg-red-50', Icon: AlertTriangle },
  in_progress: { label: 'В работе', color: 'text-blue-600', bg: 'bg-blue-50', Icon: Clock },
  resolved: { label: 'Решено', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircle },
  // Mapping status
  mapped: { label: 'Mapped', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircle },
  gap: { label: 'Gap', color: 'text-amber-600', bg: 'bg-amber-50', Icon: AlertTriangle },
  // Reconciliation status
  break: { label: 'Расхождение', color: 'text-red-600', bg: 'bg-red-50', Icon: XCircle },
  // Info
  info: { label: 'Info', color: 'text-blue-600', bg: 'bg-blue-50', Icon: CheckCircle },
};

export function IhStatusPill({ status, size = 'md' }: IhStatusPillProps) {
  const config = statusConfig[status] || statusConfig.ok;
  const StatusIcon = config.Icon;

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs gap-1'
    : 'px-2.5 py-1 text-xs gap-1.5';

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <span className={`inline-flex items-center font-medium rounded-lg ${config.bg} ${config.color} ${sizeClasses}`}>
      <StatusIcon className={iconSize} />
      {config.label}
    </span>
  );
}
