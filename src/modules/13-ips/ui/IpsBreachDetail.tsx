"use client";

import { AlertTriangle, Calendar, Gauge, TrendingUp, User, FileText, CheckCircle, Clock, FileWarning } from 'lucide-react';

interface Breach {
  id: string;
  policyId: string;
  constraintId: string;
  detectedAt: string;
  measuredValue: number;
  limitValue: number;
  severity: 'ok' | 'warning' | 'critical';
  status: 'open' | 'in_review' | 'resolved';
  sourceType: 'auto' | 'manual';
  explanation?: string;
  owner?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

interface Constraint {
  id: string;
  type: string;
  segment?: string;
  limitMin?: number;
  limitMax?: number;
  unit: string;
}

interface IpsBreachDetailProps {
  breach: Breach;
  constraint?: Constraint;
  policyName?: string;
  onAssign: () => void;
  onResolve: () => void;
  onCreateWaiver: () => void;
  onCreateTask: () => void;
}

const severityLabels: Record<string, string> = {
  ok: 'OK',
  warning: 'Предупреждение',
  critical: 'Критический',
};

const severityColors: Record<string, string> = {
  ok: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

const statusLabels: Record<string, string> = {
  open: 'Открыто',
  in_review: 'На рассмотрении',
  resolved: 'Решено',
};

const statusColors: Record<string, string> = {
  open: 'bg-red-100 text-red-700',
  in_review: 'bg-amber-100 text-amber-700',
  resolved: 'bg-emerald-100 text-emerald-700',
};

const typeLabels: Record<string, string> = {
  asset_limit: 'Класс активов',
  concentration: 'Концентрация',
  geo: 'География',
  sector: 'Сектор',
  liquidity: 'Ликвидность',
  leverage: 'Плечо',
  esg: 'ESG',
};

const unitSymbols: Record<string, string> = {
  percent: '%',
  usd: '$',
  ratio: 'x',
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function IpsBreachDetail({
  breach,
  constraint,
  policyName,
  onAssign,
  onResolve,
  onCreateWaiver,
  onCreateTask,
}: IpsBreachDetailProps) {
  const unit = constraint?.unit || 'percent';
  const symbol = unitSymbols[unit] || '%';
  const deviation = ((breach.measuredValue - breach.limitValue) / breach.limitValue * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              breach.severity === 'critical' ? 'bg-red-100' :
              breach.severity === 'warning' ? 'bg-amber-100' : 'bg-emerald-100'
            }`}>
              <AlertTriangle className={`w-6 h-6 ${
                breach.severity === 'critical' ? 'text-red-600' :
                breach.severity === 'warning' ? 'text-amber-600' : 'text-emerald-600'
              }`} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-800">
                Нарушение: {constraint ? typeLabels[constraint.type] || constraint.type : 'Ограничение'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {policyName && <span className="text-sm text-stone-500">{policyName}</span>}
                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[breach.status]}`}>
                  {statusLabels[breach.status]}
                </span>
              </div>
            </div>
          </div>
          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${severityColors[breach.severity]}`}>
            {severityLabels[breach.severity]}
          </span>
        </div>

        {/* Actions */}
        {breach.status !== 'resolved' && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-100">
            <button
              onClick={onAssign}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <User className="w-4 h-4" />
              Назначить
            </button>
            <button
              onClick={onCreateTask}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Создать задачу
            </button>
            <button
              onClick={onCreateWaiver}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm font-medium text-amber-700 hover:bg-amber-100 transition-colors"
            >
              <FileWarning className="w-4 h-4" />
              Запросить waiver
            </button>
            <button
              onClick={onResolve}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Решить
            </button>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <h2 className="font-semibold text-stone-800">Отклонение</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <div className="text-xs text-stone-500 mb-1">Измеренное</div>
              <div className="text-2xl font-bold text-red-600">{breach.measuredValue}{symbol}</div>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl">
              <div className="text-xs text-stone-500 mb-1">Лимит</div>
              <div className="text-2xl font-bold text-stone-600">{breach.limitValue}{symbol}</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-stone-50 rounded-xl text-center">
            <div className="text-xs text-stone-500 mb-1">Отклонение</div>
            <div className={`text-xl font-bold ${parseFloat(deviation) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {parseFloat(deviation) > 0 ? '+' : ''}{deviation}%
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="w-5 h-5 text-emerald-600" />
            <h2 className="font-semibold text-stone-800">Информация</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 border-b border-stone-100">
              <span className="text-sm text-stone-500">Дата обнаружения</span>
              <span className="text-sm font-medium text-stone-800">{formatDate(breach.detectedAt)}</span>
            </div>
            <div className="flex items-center justify-between p-2 border-b border-stone-100">
              <span className="text-sm text-stone-500">Источник</span>
              <span className="text-sm font-medium text-stone-800">
                {breach.sourceType === 'auto' ? 'Автоматическая проверка' : 'Ручная фиксация'}
              </span>
            </div>
            {breach.owner && (
              <div className="flex items-center justify-between p-2 border-b border-stone-100">
                <span className="text-sm text-stone-500">Ответственный</span>
                <span className="text-sm font-medium text-stone-800">{breach.owner}</span>
              </div>
            )}
            {constraint?.segment && (
              <div className="flex items-center justify-between p-2 border-b border-stone-100">
                <span className="text-sm text-stone-500">Сегмент</span>
                <span className="text-sm font-medium text-stone-800">{constraint.segment}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Explanation */}
      {breach.explanation && (
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h2 className="font-semibold text-stone-800">Объяснение</h2>
          </div>
          <p className="text-sm text-stone-600">{breach.explanation}</p>
        </div>
      )}

      {/* Resolution */}
      {breach.status === 'resolved' && breach.resolvedAt && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h2 className="font-semibold text-emerald-800">Решено</h2>
          </div>
          <div className="flex items-center gap-4 text-sm text-emerald-700">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(breach.resolvedAt)}
            </div>
            {breach.resolvedBy && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {breach.resolvedBy}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
