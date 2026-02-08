'use client';

import { cn } from '@/lib/utils';

interface ExceptionRule {
  id: string;
  name: string;
  description?: string;
  ruleTypeKey: 'assign' | 'escalate' | 'close';
  enabled: boolean;
  priority?: number;
  conditionsJson: {
    sourceModuleKey?: string;
    typeKey?: string;
    severityIn?: string[];
    titleIncludes?: string;
    statusIn?: string[];
    hoursOpen?: number;
    slaAtRisk?: boolean;
    sourceResolved?: boolean;
  };
  actionsJson: {
    assignToRole?: string;
    setSeverity?: string;
    setStatus?: string;
    setSlaHours?: number;
    addWatchers?: string[];
    notifyRoles?: string[];
  };
  matchCount?: number;
  lastRunAt?: string;
  lastMatchCount?: number;
  createdAt: string;
}

interface ExRuleDetailProps {
  rule: ExceptionRule;
  onToggle?: (enabled: boolean) => void;
  onRun?: () => void;
  onEdit?: () => void;
  className?: string;
}

const ruleTypeLabels: Record<string, { label: string; className: string }> = {
  assign: { label: 'Авто-назначение', className: 'bg-blue-100 text-blue-700' },
  escalate: { label: 'Авто-эскалация', className: 'bg-amber-100 text-amber-700' },
  close: { label: 'Авто-закрытие', className: 'bg-emerald-100 text-emerald-700' }
};

const moduleLabels: Record<string, string> = {
  '14': 'Интеграции',
  '2': 'GL',
  '39': 'Ликвидность',
  '42': 'Сделки',
  '5': 'Документы',
  '16': 'Цены',
  '7': 'Согласования',
  '43': 'Вендоры',
  '17': 'Безопасность'
};

const typeLabels: Record<string, string> = {
  sync: 'Синхронизация',
  recon: 'Сверка',
  missing_doc: 'Документы',
  stale_price: 'Цены',
  approval: 'Согласования',
  vendor_sla: 'SLA вендоров',
  security: 'Безопасность'
};

const roleLabels: Record<string, string> = {
  operations_analyst: 'Операционный аналитик',
  compliance_officer: 'Комплаенс-офицер',
  head_of_ops: 'Руководитель операций',
  data_steward: 'Data Steward',
  risk_manager: 'Риск-менеджер'
};

export function ExRuleDetail({ rule, onToggle, onRun, onEdit, className }: ExRuleDetailProps) {
  const typeConfig = ruleTypeLabels[rule.ruleTypeKey] || ruleTypeLabels.assign;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">{rule.name}</h2>
            {rule.description && (
              <p className="text-sm text-stone-600 mt-1">{rule.description}</p>
            )}
            <div className="flex items-center gap-2 mt-3">
              <span className={cn(
                'text-xs px-2 py-0.5 rounded font-medium',
                typeConfig.className
              )}>
                {typeConfig.label}
              </span>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded',
                rule.enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-100 text-stone-600'
              )}>
                {rule.enabled ? 'Включено' : 'Выключено'}
              </span>
              {rule.priority && (
                <span className="text-xs text-stone-500">
                  Приоритет: {rule.priority}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggle?.(!rule.enabled)}
              className={cn(
                'w-12 h-6 rounded-full transition-colors relative',
                rule.enabled ? 'bg-emerald-500' : 'bg-stone-300'
              )}
            >
              <span className={cn(
                'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                rule.enabled ? 'left-7' : 'left-1'
              )} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Всего сработало" value={rule.matchCount || 0} />
        <StatCard
          label="Последний запуск"
          value={rule.lastRunAt
            ? new Date(rule.lastRunAt).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
            : 'Никогда'}
        />
        <StatCard label="Последний матч" value={rule.lastMatchCount || 0} />
      </div>

      {/* Conditions */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
        <h3 className="text-sm font-medium text-stone-700 mb-3">Условия</h3>
        <div className="space-y-2">
          {rule.conditionsJson.sourceModuleKey && (
            <ConditionRow
              label="Модуль источника"
              value={moduleLabels[rule.conditionsJson.sourceModuleKey] || rule.conditionsJson.sourceModuleKey}
            />
          )}
          {rule.conditionsJson.typeKey && (
            <ConditionRow
              label="Тип исключения"
              value={typeLabels[rule.conditionsJson.typeKey] || rule.conditionsJson.typeKey}
            />
          )}
          {rule.conditionsJson.severityIn && rule.conditionsJson.severityIn.length > 0 && (
            <ConditionRow
              label="Важность (любой из)"
              value={rule.conditionsJson.severityIn.join(', ')}
            />
          )}
          {rule.conditionsJson.statusIn && rule.conditionsJson.statusIn.length > 0 && (
            <ConditionRow
              label="Статус (любой из)"
              value={rule.conditionsJson.statusIn.join(', ')}
            />
          )}
          {rule.conditionsJson.titleIncludes && (
            <ConditionRow
              label="Название содержит"
              value={rule.conditionsJson.titleIncludes}
            />
          )}
          {rule.conditionsJson.hoursOpen !== undefined && (
            <ConditionRow
              label="Открыто более (часов)"
              value={String(rule.conditionsJson.hoursOpen)}
            />
          )}
          {rule.conditionsJson.slaAtRisk !== undefined && (
            <ConditionRow
              label="SLA под риском"
              value={rule.conditionsJson.slaAtRisk ? 'Да' : 'Нет'}
            />
          )}
          {rule.conditionsJson.sourceResolved !== undefined && (
            <ConditionRow
              label="Источник исправлен"
              value={rule.conditionsJson.sourceResolved ? 'Да' : 'Нет'}
            />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
        <h3 className="text-sm font-medium text-stone-700 mb-3">Действия</h3>
        <div className="space-y-2">
          {rule.actionsJson.assignToRole && (
            <ActionRow
              label="Назначить роль"
              value={roleLabels[rule.actionsJson.assignToRole] || rule.actionsJson.assignToRole}
            />
          )}
          {rule.actionsJson.setSeverity && (
            <ActionRow
              label="Установить важность"
              value={rule.actionsJson.setSeverity}
            />
          )}
          {rule.actionsJson.setStatus && (
            <ActionRow
              label="Установить статус"
              value={rule.actionsJson.setStatus}
            />
          )}
          {rule.actionsJson.setSlaHours !== undefined && (
            <ActionRow
              label="Установить SLA (часов)"
              value={String(rule.actionsJson.setSlaHours)}
            />
          )}
          {rule.actionsJson.notifyRoles && rule.actionsJson.notifyRoles.length > 0 && (
            <ActionRow
              label="Уведомить роли"
              value={rule.actionsJson.notifyRoles.map(r => roleLabels[r] || r).join(', ')}
            />
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {onRun && rule.enabled && (
          <button
            onClick={onRun}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700"
          >
            Запустить сейчас
          </button>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200"
          >
            Редактировать
          </button>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-3">
      <div className="text-lg font-bold text-stone-900">{value}</div>
      <div className="text-xs text-stone-500">{label}</div>
    </div>
  );
}

function ConditionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-stone-500 min-w-[160px]">{label}:</span>
      <span className="text-stone-900 font-medium">{value}</span>
    </div>
  );
}

function ActionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-emerald-600">→</span>
      <span className="text-stone-500">{label}:</span>
      <span className="text-stone-900 font-medium">{value}</span>
    </div>
  );
}

export default ExRuleDetail;
