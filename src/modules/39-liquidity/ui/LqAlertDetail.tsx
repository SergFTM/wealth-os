"use client";

import { ArrowLeft, CheckCircle, X, ListTodo, AlertTriangle } from 'lucide-react';
import { LqSeverityPill } from './LqSeverityPill';
import { LqStatusPill } from './LqStatusPill';

interface SuggestedAction {
  action: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface Source {
  type: string;
  id: string;
  description?: string;
}

interface LiquidityAlert {
  id: string;
  clientId: string;
  forecastId: string;
  scenarioId?: string;
  stressTestId?: string;
  deficitDate: string;
  shortfallAmount: number;
  currency: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'open' | 'acknowledged' | 'closed';
  title?: string;
  description?: string;
  suggestedActionsJson?: SuggestedAction[];
  sourcesJson?: Source[];
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  closedAt?: string;
  closedBy?: string;
  closedReason?: string;
  taskId?: string;
  createdAt: string;
}

interface LqAlertDetailProps {
  alert: LiquidityAlert;
  onBack: () => void;
  onAcknowledge?: () => void;
  onClose?: () => void;
  onCreateTask?: () => void;
}

function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-blue-100 text-blue-700 border-blue-200',
};

const priorityLabels: Record<string, string> = {
  high: 'Высокий',
  medium: 'Средний',
  low: 'Низкий',
};

export function LqAlertDetail({
  alert,
  onBack,
  onAcknowledge,
  onClose,
  onCreateTask,
}: LqAlertDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <LqSeverityPill severity={alert.severity} />
              <LqStatusPill status={alert.status} />
            </div>
            <h1 className="text-xl font-bold text-stone-800 mt-2">
              {alert.title || `Дефицит на ${formatDate(alert.deficitDate)}`}
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Создан: {formatDateTime(alert.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onAcknowledge && alert.status === 'open' && (
            <button
              onClick={onAcknowledge}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Подтвердить</span>
            </button>
          )}
          {onCreateTask && alert.status !== 'closed' && (
            <button
              onClick={onCreateTask}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg hover:bg-stone-50 transition-all"
            >
              <ListTodo className="w-4 h-4" />
              <span className="text-sm">Создать задачу</span>
            </button>
          )}
          {onClose && alert.status !== 'closed' && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 text-stone-500 hover:bg-stone-100 rounded-lg transition-all"
            >
              <X className="w-4 h-4" />
              <span className="text-sm">Закрыть</span>
            </button>
          )}
        </div>
      </div>

      {/* Alert Banner */}
      {alert.severity === 'critical' && alert.status === 'open' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-red-800">Требуется немедленное внимание</div>
            <p className="text-sm text-red-700 mt-1">
              Этот алерт критический и требует срочных действий. Рассмотрите предложенные меры ниже.
            </p>
          </div>
        </div>
      )}

      {/* Main Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <h3 className="font-semibold text-stone-800 mb-4">Детали дефицита</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-stone-500">Дата дефицита:</span>
              <span className="font-medium text-stone-800">{formatDate(alert.deficitDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Сумма недостачи:</span>
              <span className={`font-mono font-semibold ${alert.shortfallAmount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {alert.shortfallAmount > 0 ? formatCurrency(alert.shortfallAmount, alert.currency) : 'Нет дефицита'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Forecast ID:</span>
              <span className="font-mono text-sm text-stone-600">{alert.forecastId}</span>
            </div>
            {alert.stressTestId && (
              <div className="flex justify-between">
                <span className="text-stone-500">Stress Test ID:</span>
                <span className="font-mono text-sm text-stone-600">{alert.stressTestId}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <h3 className="font-semibold text-stone-800 mb-4">История статуса</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-stone-500">Создан:</span>
              <span className="text-stone-600">{formatDateTime(alert.createdAt)}</span>
            </div>
            {alert.acknowledgedAt && (
              <div className="flex justify-between">
                <span className="text-stone-500">Подтверждён:</span>
                <span className="text-stone-600">
                  {formatDateTime(alert.acknowledgedAt)}
                  {alert.acknowledgedBy && ` (${alert.acknowledgedBy})`}
                </span>
              </div>
            )}
            {alert.closedAt && (
              <div className="flex justify-between">
                <span className="text-stone-500">Закрыт:</span>
                <span className="text-stone-600">
                  {formatDateTime(alert.closedAt)}
                  {alert.closedBy && ` (${alert.closedBy})`}
                </span>
              </div>
            )}
            {alert.closedReason && (
              <div className="flex justify-between">
                <span className="text-stone-500">Причина закрытия:</span>
                <span className="text-stone-600">{alert.closedReason}</span>
              </div>
            )}
            {alert.taskId && (
              <div className="flex justify-between">
                <span className="text-stone-500">Связанная задача:</span>
                <span className="font-mono text-sm text-emerald-600">{alert.taskId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {alert.description && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <h3 className="font-semibold text-stone-800 mb-2">Описание</h3>
          <p className="text-stone-600">{alert.description}</p>
        </div>
      )}

      {/* Suggested Actions */}
      {alert.suggestedActionsJson && alert.suggestedActionsJson.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <h3 className="font-semibold text-stone-800 mb-4">Рекомендуемые действия</h3>
          <div className="space-y-3">
            {alert.suggestedActionsJson.map((action, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${priorityColors[action.priority]}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{action.description}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded">
                    {priorityLabels[action.priority]}
                  </span>
                </div>
                <div className="text-xs opacity-75">Действие: {action.action}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            <strong>Важно:</strong> Все действия требуют подтверждения человеком перед выполнением.
          </div>
        </div>
      )}

      {/* Sources */}
      {alert.sourcesJson && alert.sourcesJson.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <h3 className="font-semibold text-stone-800 mb-4">Источники</h3>
          <div className="space-y-2">
            {alert.sourcesJson.map((source, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-xs font-mono">
                  {source.type}
                </span>
                <span className="text-stone-600">{source.description || source.id}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
