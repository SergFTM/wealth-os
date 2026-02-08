'use client';

import { cn } from '@/lib/utils';
import { ExQueueTable, ExceptionRow } from './ExQueueTable';

interface ExceptionCluster {
  id: string;
  name: string;
  clusterTypeKey: string;
  status: 'active' | 'resolved';
  memberIdsJson: string[];
  topSourceJson?: {
    moduleKey: string;
    count: number;
  };
  patternJson?: {
    typeKey?: string;
    sourceModuleKey?: string;
    titleTokens?: string[];
  };
  openCount: number;
  totalCount: number;
  createdAt: string;
}

interface ExClusterDetailProps {
  cluster: ExceptionCluster;
  memberExceptions: ExceptionRow[];
  onExceptionClick?: (item: ExceptionRow) => void;
  onAssignAll?: (role: string) => void;
  onCloseAll?: () => void;
  onApplyRule?: (ruleId: string) => void;
  className?: string;
}

const clusterTypeLabels: Record<string, string> = {
  type_source: 'Тип и источник',
  title_pattern: 'Паттерн названия',
  temporal: 'Временной'
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

const roleOptions = [
  { value: 'operations_analyst', label: 'Операционный аналитик' },
  { value: 'compliance_officer', label: 'Комплаенс-офицер' },
  { value: 'head_of_ops', label: 'Руководитель операций' },
  { value: 'data_steward', label: 'Data Steward' }
];

export function ExClusterDetail({
  cluster,
  memberExceptions,
  onExceptionClick,
  onAssignAll,
  onCloseAll,
  className
}: ExClusterDetailProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">{cluster.name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                {clusterTypeLabels[cluster.clusterTypeKey] || cluster.clusterTypeKey}
              </span>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded',
                cluster.status === 'active'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-stone-100 text-stone-600'
              )}>
                {cluster.status === 'active' ? 'Активный' : 'Решён'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-stone-900">{cluster.openCount}</div>
            <div className="text-xs text-stone-500">открытых из {cluster.totalCount}</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Открытых" value={cluster.openCount} />
        <StatCard label="Всего" value={cluster.totalCount} />
        <StatCard
          label="Топ источник"
          value={cluster.topSourceJson
            ? moduleLabels[cluster.topSourceJson.moduleKey] || cluster.topSourceJson.moduleKey
            : '—'}
        />
        <StatCard
          label="Создан"
          value={new Date(cluster.createdAt).toLocaleDateString('ru-RU')}
        />
      </div>

      {/* Pattern Info */}
      {cluster.patternJson && (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
          <h3 className="text-sm font-medium text-stone-700 mb-2">Паттерн кластера</h3>
          <div className="flex flex-wrap gap-2">
            {cluster.patternJson.typeKey && (
              <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                Тип: {cluster.patternJson.typeKey}
              </span>
            )}
            {cluster.patternJson.sourceModuleKey && (
              <span className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700">
                Модуль: {moduleLabels[cluster.patternJson.sourceModuleKey] || cluster.patternJson.sourceModuleKey}
              </span>
            )}
            {cluster.patternJson.titleTokens && cluster.patternJson.titleTokens.length > 0 && (
              <span className="text-xs px-2 py-1 rounded bg-purple-100 text-purple-700">
                Ключевые слова: {cluster.patternJson.titleTokens.join(', ')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
        <h3 className="text-sm font-medium text-stone-700 mb-3">Массовые действия</h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-stone-600">Назначить всем:</label>
            <select
              onChange={(e) => onAssignAll?.(e.target.value)}
              className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm"
              defaultValue=""
            >
              <option value="">Выберите роль</option>
              {roleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={onCloseAll}
            className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200"
          >
            Закрыть все
          </button>
        </div>
      </div>

      {/* Member Exceptions */}
      <div>
        <h3 className="text-sm font-medium text-stone-700 mb-3">
          Исключения в кластере ({memberExceptions.length})
        </h3>
        <ExQueueTable
          data={memberExceptions}
          onRowClick={onExceptionClick}
          emptyMessage="Нет исключений в кластере"
        />
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

export default ExClusterDetail;
