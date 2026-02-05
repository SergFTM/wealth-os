"use client";

import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock, Bell } from 'lucide-react';

interface RiskAlert {
  id: string;
  portfolioId: string;
  title: string;
  category: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'open' | 'acknowledged' | 'resolved';
  triggeredAt: string;
  description: string;
  currentValue: number | null;
  threshold: number | null;
  unit: string | null;
  source: string;
  assignedTo: string | null;
  acknowledgedAt: string | null;
  resolvedAt: string | null;
}

interface RkAlertsTableProps {
  alerts: RiskAlert[];
  onRowClick?: (alert: RiskAlert) => void;
  onAcknowledge?: (alertId: string) => void;
  showOnlyActive?: boolean;
}

const severityConfig = {
  critical: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', label: 'Критический' },
  warning: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Предупреждение' },
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Информация' },
};

const statusConfig = {
  open: { icon: Bell, color: 'text-red-600', bg: 'bg-red-100', label: 'Открыт' },
  acknowledged: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Принят' },
  resolved: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Решён' },
};

const categoryLabels: Record<string, string> = {
  var: 'VaR',
  concentration: 'Концентрация',
  sector: 'Сектор',
  volatility: 'Волатильность',
  stress: 'Стресс-тест',
  counterparty: 'Контрагент',
  duration: 'Дюрация',
  currency: 'Валюта',
  country: 'Страна',
  drawdown: 'Просадка',
  compliance: 'Комплаенс',
  strategy: 'Стратегия',
  factor: 'Фактор',
  liquidity: 'Ликвидность',
};

export function RkAlertsTable({ alerts, onRowClick, onAcknowledge, showOnlyActive = false }: RkAlertsTableProps) {
  const filteredAlerts = showOnlyActive
    ? alerts.filter(a => a.status !== 'resolved')
    : alerts;

  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    // Sort by severity and status
    const severityPriority = { critical: 0, warning: 1, info: 2 };
    const statusPriority = { open: 0, acknowledged: 1, resolved: 2 };

    const severityDiff = severityPriority[a.severity] - severityPriority[b.severity];
    if (severityDiff !== 0) return severityDiff;

    const statusDiff = statusPriority[a.status] - statusPriority[b.status];
    if (statusDiff !== 0) return statusDiff;

    return new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime();
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Алерт</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Категория</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Серьёзность</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Значение</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Время</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Действие</th>
            </tr>
          </thead>
          <tbody>
            {sortedAlerts.map((alert) => {
              const severity = severityConfig[alert.severity];
              const status = statusConfig[alert.status];
              const SeverityIcon = severity.icon;
              const StatusIcon = status.icon;

              return (
                <tr
                  key={alert.id}
                  onClick={() => onRowClick?.(alert)}
                  className={`border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors ${
                    alert.severity === 'critical' && alert.status === 'open' ? 'bg-red-50/50' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <SeverityIcon className={`w-4 h-4 mt-0.5 ${severity.color}`} />
                      <div>
                        <div className="font-medium text-stone-800">{alert.title}</div>
                        <div className="text-xs text-stone-500 line-clamp-1">{alert.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs bg-stone-100 text-stone-600 rounded-md">
                      {categoryLabels[alert.category] || alert.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-lg ${severity.bg} ${severity.color}`}>
                      {severity.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {alert.currentValue !== null && (
                      <div>
                        <span className={`font-medium ${
                          alert.currentValue > (alert.threshold || 0) ? 'text-red-600' : 'text-stone-800'
                        }`}>
                          {alert.currentValue}{alert.unit ? ` ${alert.unit}` : ''}
                        </span>
                        {alert.threshold !== null && (
                          <span className="text-xs text-stone-500 block">
                            / {alert.threshold}{alert.unit || ''}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-lg ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-stone-500">
                    <div>{new Date(alert.triggeredAt).toLocaleDateString('ru-RU')}</div>
                    <div>{new Date(alert.triggeredAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {alert.status === 'open' && onAcknowledge && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAcknowledge(alert.id);
                        }}
                        className="px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        Подтвердить
                      </button>
                    )}
                    {alert.status === 'acknowledged' && (
                      <span className="text-xs text-stone-400">Принято</span>
                    )}
                    {alert.status === 'resolved' && (
                      <span className="text-xs text-stone-400">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedAlerts.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          {showOnlyActive ? 'Нет активных алертов' : 'Нет алертов для отображения'}
        </div>
      )}
    </div>
  );
}
