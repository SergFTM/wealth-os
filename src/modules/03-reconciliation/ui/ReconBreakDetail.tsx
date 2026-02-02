"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAuditEvents } from '@/lib/hooks';

interface ReconBreak {
  id: string;
  jobId: string;
  clientId?: string;
  entityId?: string;
  accountId?: string;
  instrument?: string | null;
  breakType: string;
  expected: string | number | null;
  actual: string | number | null;
  delta?: number | null;
  currency?: string | null;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved' | 'ignored';
  owner?: string | null;
  resolution?: string;
  evidenceDocIds?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ReconBreakDetailProps {
  brk: ReconBreak | null;
  open: boolean;
  onClose: () => void;
  onAssign?: (breakId: string, owner: string) => void;
  onChangeStatus?: (breakId: string, status: string) => void;
  onCreateTask?: (breakId: string) => void;
  onAddDocument?: (breakId: string) => void;
  onCheckMapping?: (breakId: string) => void;
  onCreateIssue?: (breakId: string) => void;
  onRerun?: (breakId: string) => void;
  clientSafe?: boolean;
}

const severityConfig = {
  critical: { color: 'bg-rose-100 text-rose-700 border-rose-300' },
  high: { color: 'bg-orange-100 text-orange-700 border-orange-300' },
  medium: { color: 'bg-amber-100 text-amber-700 border-amber-300' },
  low: { color: 'bg-stone-100 text-stone-600 border-stone-300' }
};

const breakTypeLabels: Record<string, { label: string; description: string }> = {
  quantity_mismatch: { label: 'Расхождение количества', description: 'Количество позиции в системе не совпадает с источником' },
  price_mismatch: { label: 'Расхождение цены', description: 'Цена или стоимость не совпадает с источником' },
  missing_transaction: { label: 'Отсутствует транзакция', description: 'Транзакция есть в источнике, но не найдена в системе' },
  cash_mismatch: { label: 'Расхождение cash', description: 'Денежный остаток не совпадает с источником' },
  unmapped_symbol: { label: 'Символ не связан', description: 'Символ из источника не найден в маппинге' },
  unmapped_account: { label: 'Счёт не связан', description: 'Счёт из источника не найден в маппинге' },
  unmapped_entity: { label: 'Entity не связан', description: 'Юридическое лицо из источника не найдено' }
};

const tabs = [
  { key: 'overview', label: 'Обзор' },
  { key: 'diagnosis', label: 'Диагностика' },
  { key: 'actions', label: 'Действия' },
  { key: 'evidence', label: 'Доказательства' },
  { key: 'audit', label: 'Аудит' }
];

export function ReconBreakDetail({
  brk,
  open,
  onClose,
  onAssign,
  onChangeStatus,
  onCreateTask,
  onAddDocument,
  onCheckMapping,
  onCreateIssue,
  onRerun,
  clientSafe
}: ReconBreakDetailProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const { events, loading: auditLoading } = useAuditEvents(brk?.id || null);

  if (!open || !brk) return null;

  const breakInfo = breakTypeLabels[brk.breakType] || { label: brk.breakType, description: '' };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-gradient-to-r from-stone-50 to-stone-100/50">
          <div className="flex items-center gap-3">
            <span className={cn("px-3 py-1 rounded-lg text-sm font-semibold border", severityConfig[brk.severity].color)}>
              {brk.severity.toUpperCase()}
            </span>
            <div>
              <h2 className="font-bold text-stone-800">{breakInfo.label}</h2>
              <p className="text-xs text-stone-500">{brk.instrument || 'Cash'} • ID: {brk.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 border-b border-stone-200 flex gap-1">
          {tabs.filter(t => clientSafe ? !['diagnosis', 'actions', 'audit'].includes(t.key) : true).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.key
                  ? "border-emerald-500 text-emerald-700"
                  : "border-transparent text-stone-500 hover:text-stone-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center gap-4">
                <StatusBadge 
                  status={brk.status === 'resolved' ? 'ok' : brk.status === 'investigating' ? 'pending' : 'critical'} 
                  label={brk.status} 
                />
                {brk.owner && (
                  <span className="text-sm text-stone-600">
                    Ответственный: <strong>{brk.owner}</strong>
                  </span>
                )}
              </div>

              {/* Expected vs Actual */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 rounded-lg p-4">
                  <p className="text-xs text-stone-500 uppercase mb-1">Ожидается (Internal)</p>
                  <p className="text-lg font-bold text-stone-800">
                    {brk.expected !== null ? String(brk.expected) : '—'}
                  </p>
                </div>
                <div className="bg-stone-50 rounded-lg p-4">
                  <p className="text-xs text-stone-500 uppercase mb-1">Фактически (Source)</p>
                  <p className="text-lg font-bold text-stone-800">
                    {brk.actual !== null ? String(brk.actual) : '—'}
                  </p>
                </div>
              </div>

              {brk.delta !== null && brk.delta !== undefined && (
                <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-lg p-4 border border-rose-200">
                  <p className="text-xs text-stone-500 uppercase mb-1">Дельта</p>
                  <p className={cn(
                    "text-2xl font-bold",
                    brk.delta > 0 ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {brk.delta > 0 ? '+' : ''}{brk.delta.toLocaleString()}
                    {brk.currency && ` ${brk.currency}`}
                  </p>
                </div>
              )}

              {/* Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-stone-700">Детали</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Client:</span>
                    <span className="text-stone-800">{brk.clientId || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Entity:</span>
                    <span className="text-stone-800">{brk.entityId || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Account:</span>
                    <span className="text-stone-800">{brk.accountId || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Job ID:</span>
                    <span className="text-stone-800 font-mono text-xs">{brk.jobId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Создан:</span>
                    <span className="text-stone-800">{new Date(brk.createdAt).toLocaleString('ru-RU')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Обновлён:</span>
                    <span className="text-stone-800">{new Date(brk.updatedAt).toLocaleString('ru-RU')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'diagnosis' && !clientSafe && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 mb-2">Возможные причины</h4>
                <p className="text-sm text-amber-700">{breakInfo.description}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-stone-700">Рекомендации</h4>
                <ul className="space-y-2">
                  {brk.breakType.includes('unmapped') && (
                    <li className="flex items-start gap-2 text-sm text-stone-600">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      Проверьте и создайте маппинг для идентификатора
                    </li>
                  )}
                  <li className="flex items-start gap-2 text-sm text-stone-600">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    Сравните с оригинальной выпиской custodian/bank
                  </li>
                  <li className="flex items-start gap-2 text-sm text-stone-600">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    Проверьте корпоративные действия за период
                  </li>
                  <li className="flex items-start gap-2 text-sm text-stone-600">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    Запустите повторную сверку после исправлений
                  </li>
                </ul>
              </div>

              <div className="flex gap-2">
                {onCheckMapping && brk.breakType.includes('unmapped') && (
                  <Button variant="secondary" size="sm" onClick={() => onCheckMapping(brk.id)}>
                    Проверить маппинг
                  </Button>
                )}
                {onCreateIssue && (
                  <Button variant="secondary" size="sm" onClick={() => onCreateIssue(brk.id)}>
                    Создать issue в Integrations
                  </Button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'actions' && !clientSafe && (
            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-stone-700">Назначить ответственного</h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="flex-1 px-3 py-2 rounded-lg border border-stone-200 text-sm"
                  />
                  <Button variant="secondary" size="sm" onClick={() => onAssign?.(brk.id, 'ops@wealthos.com')}>
                    Назначить
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-stone-700">Изменить статус</h4>
                <div className="flex gap-2">
                  {['investigating', 'resolved', 'ignored'].map(status => (
                    <button
                      key={status}
                      onClick={() => onChangeStatus?.(brk.id, status)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium border transition-colors",
                        brk.status === status
                          ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                          : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100"
                      )}
                    >
                      {status === 'investigating' ? 'В работе' : status === 'resolved' ? 'Решён' : 'Пропустить'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-stone-700">Дополнительные действия</h4>
                <div className="flex flex-wrap gap-2">
                  {onCreateTask && (
                    <Button variant="secondary" size="sm" onClick={() => onCreateTask(brk.id)}>
                      Создать задачу
                    </Button>
                  )}
                  {onRerun && (
                    <Button variant="secondary" size="sm" onClick={() => onRerun(brk.id)}>
                      Повторная сверка
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-stone-700">Прикреплённые документы</h4>
                {!clientSafe && onAddDocument && (
                  <Button variant="secondary" size="sm" onClick={() => onAddDocument(brk.id)}>
                    + Добавить документ
                  </Button>
                )}
              </div>
              
              {(!brk.evidenceDocIds || brk.evidenceDocIds.length === 0) ? (
                <div className="bg-stone-50 rounded-lg p-8 text-center">
                  <svg className="w-12 h-12 mx-auto text-stone-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-stone-500 text-sm">Нет прикреплённых документов</p>
                  <p className="text-stone-400 text-xs mt-1">Прикрепите выписку для подтверждения</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {brk.evidenceDocIds.map(docId => (
                    <div key={docId} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-stone-700">{docId}</span>
                      </div>
                      <Button variant="ghost" size="sm">Открыть</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'audit' && !clientSafe && (
            <div className="space-y-4">
              <h4 className="font-semibold text-stone-700">История изменений</h4>
              {auditLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-16 bg-stone-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : events.length === 0 ? (
                <p className="text-stone-500 text-sm">Нет записей аудита</p>
              ) : (
                <div className="space-y-3">
                  {events.map(event => (
                    <div key={event.id} className="flex gap-3 p-3 bg-stone-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-stone-800">{event.summary}</p>
                        <p className="text-xs text-stone-500">
                          {event.actorName} • {new Date(event.ts).toLocaleString('ru-RU')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
