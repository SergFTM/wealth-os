"use client";

import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock, Bell, ArrowLeft, Plus } from 'lucide-react';

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

interface RkAlertDetailProps {
  alert: RiskAlert;
  onBack?: () => void;
  onAcknowledge?: () => void;
  onResolve?: () => void;
  onCreateAction?: () => void;
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

export function RkAlertDetail({ alert, onBack, onAcknowledge, onResolve, onCreateAction }: RkAlertDetailProps) {
  const severity = severityConfig[alert.severity];
  const status = statusConfig[alert.status];
  const SeverityIcon = severity.icon;
  const StatusIcon = status.icon;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className={`p-4 border-b ${severity.border} ${severity.bg}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-stone-500" />
              </button>
            )}
            <div className="flex items-center gap-2">
              <SeverityIcon className={`w-6 h-6 ${severity.color}`} />
              <div>
                <h2 className="text-lg font-semibold text-stone-800">{alert.title}</h2>
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                  <span className={`px-2 py-0.5 rounded ${severity.bg} ${severity.color} font-medium`}>
                    {severity.label}
                  </span>
                  <span>•</span>
                  <span>{categoryLabels[alert.category] || alert.category}</span>
                </div>
              </div>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${status.bg}`}>
            <StatusIcon className={`w-4 h-4 ${status.color}`} />
            <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-stone-600 mb-2">Описание</h3>
          <p className="text-stone-800">{alert.description}</p>
        </div>

        {/* Values */}
        {alert.currentValue !== null && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-stone-50 rounded-xl">
              <div className="text-xs text-stone-500 mb-1">Текущее значение</div>
              <div className={`text-2xl font-bold ${
                alert.threshold && alert.currentValue > alert.threshold ? 'text-red-600' : 'text-stone-800'
              }`}>
                {alert.currentValue}{alert.unit || ''}
              </div>
            </div>
            {alert.threshold !== null && (
              <div className="p-4 bg-stone-50 rounded-xl">
                <div className="text-xs text-stone-500 mb-1">Пороговое значение</div>
                <div className="text-2xl font-bold text-stone-800">
                  {alert.threshold}{alert.unit || ''}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timeline */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-stone-600 mb-3">Хронология</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500" />
              <div>
                <div className="text-sm text-stone-800">Алерт создан</div>
                <div className="text-xs text-stone-500">
                  {new Date(alert.triggeredAt).toLocaleString('ru-RU')}
                </div>
              </div>
            </div>
            {alert.acknowledgedAt && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-500" />
                <div>
                  <div className="text-sm text-stone-800">Принят к рассмотрению</div>
                  <div className="text-xs text-stone-500">
                    {new Date(alert.acknowledgedAt).toLocaleString('ru-RU')}
                    {alert.assignedTo && ` • ${alert.assignedTo}`}
                  </div>
                </div>
              </div>
            )}
            {alert.resolvedAt && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500" />
                <div>
                  <div className="text-sm text-stone-800">Решён</div>
                  <div className="text-xs text-stone-500">
                    {new Date(alert.resolvedAt).toLocaleString('ru-RU')}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="p-4 bg-stone-50 rounded-xl mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-stone-500">Источник</div>
              <div className="text-stone-800 font-medium">{alert.source}</div>
            </div>
            {alert.assignedTo && (
              <div>
                <div className="text-xs text-stone-500">Назначен</div>
                <div className="text-stone-800 font-medium">{alert.assignedTo}</div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {alert.status === 'open' && onAcknowledge && (
            <button
              onClick={onAcknowledge}
              className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              Подтвердить
            </button>
          )}
          {(alert.status === 'open' || alert.status === 'acknowledged') && onResolve && (
            <button
              onClick={onResolve}
              className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
            >
              Отметить решённым
            </button>
          )}
          {onCreateAction && alert.status !== 'resolved' && (
            <button
              onClick={onCreateAction}
              className="flex items-center gap-2 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg font-medium hover:bg-stone-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Создать действие
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
