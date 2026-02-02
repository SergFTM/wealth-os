"use client";

import { use, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useAuditEvents } from '@/lib/hooks';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

import seedData from '@/modules/03-reconciliation/seed.json';

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
  updatedAt?: string;
}

interface ReconJob {
  id: string;
  feedId: string;
  asOf: string;
  scope?: string[];
  matchPct?: number | null;
  totalRecords?: number | null;
  matchedRecords?: number | null;
  breaksCount?: number | null;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  finishedAt?: string | null;
  triggeredBy?: string;
  errorMessage?: string;
}

interface DataFeed {
  id: string;
  providerName: string;
  type: string;
  coverage: string[];
  status: string;
  lastSyncAt: string;
}

const severityConfig = {
  critical: { color: 'bg-rose-100 text-rose-700 border-rose-200', label: 'Критический', icon: '🔴' },
  high: { color: 'bg-orange-100 text-orange-700 border-orange-200', label: 'Высокий', icon: '🟠' },
  medium: { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Средний', icon: '🟡' },
  low: { color: 'bg-stone-100 text-stone-600 border-stone-200', label: 'Низкий', icon: '⚪' }
};

const statusConfig = {
  open: { color: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Открыт' },
  investigating: { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'В работе' },
  resolved: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Решён' },
  ignored: { color: 'bg-stone-50 text-stone-600 border-stone-200', label: 'Пропущен' }
};

const breakTypeLabels: Record<string, string> = {
  quantity_mismatch: 'Расхождение количества',
  price_mismatch: 'Расхождение цены',
  missing_transaction: 'Отсутствует транзакция',
  cash_mismatch: 'Расхождение cash',
  unmapped_symbol: 'Неизвестный символ',
  unmapped_account: 'Неизвестный счёт',
  unmapped_entity: 'Неизвестный entity'
};

const tabs = [
  { key: 'overview', label: 'Обзор' },
  { key: 'diagnosis', label: 'Диагностика' },
  { key: 'actions', label: 'Действия' },
  { key: 'evidence', label: 'Документы' },
  { key: 'audit', label: 'Аудит' }
];

function formatValue(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'number') return val.toLocaleString();
  return val;
}

function formatDelta(delta: number | null | undefined, currency?: string | null): string {
  if (delta === null || delta === undefined) return '—';
  const sign = delta > 0 ? '+' : '';
  if (Math.abs(delta) >= 1000000) return `${sign}${(delta / 1000000).toFixed(2)}M`;
  if (Math.abs(delta) >= 1000) return `${sign}${(delta / 1000).toFixed(1)}K`;
  return `${sign}${delta.toLocaleString()}`;
}

export default function ReconciliationItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { locale, user } = useApp();
  const clientSafe = user?.role === 'client';
  const [activeTab, setActiveTab] = useState('overview');

  // Find the break from seed data
  const brk = (seedData.reconBreaks as unknown as ReconBreak[]).find(b => b.id === id);
  const job = brk ? (seedData.reconJobs as unknown as ReconJob[]).find(j => j.id === brk.jobId) : null;
  const feed = job ? (seedData.dataFeeds as unknown as DataFeed[]).find(f => f.id === job.feedId) : null;
  
  const { events: auditEvents, loading: auditLoading } = useAuditEvents(id);

  // Related breaks from same job
  const relatedBreaks = useMemo(() => {
    if (!brk) return [];
    return (seedData.reconBreaks as unknown as ReconBreak[])
      .filter(b => b.jobId === brk.jobId && b.id !== brk.id)
      .slice(0, 5);
  }, [brk]);

  if (!brk) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-stone-600">Расхождение не найдено</p>
          <Button variant="secondary" size="sm" onClick={() => router.push('/m/reconciliation')} className="mt-4">
            ← Назад
          </Button>
        </div>
      </div>
    );
  }

  const visibleTabs = clientSafe 
    ? tabs.filter(t => ['overview', 'evidence'].includes(t.key))
    : tabs;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.push('/m/reconciliation')} className="mb-2">
            ← Назад к сверке
          </Button>
          <div className="flex items-center gap-3">
            <span className={cn("px-3 py-1.5 rounded-lg text-sm font-semibold border", severityConfig[brk.severity].color)}>
              {severityConfig[brk.severity].icon} {severityConfig[brk.severity].label}
            </span>
            <h1 className="text-2xl font-bold text-stone-800">
              {brk.instrument || breakTypeLabels[brk.breakType] || brk.breakType}
            </h1>
          </div>
          <p className="text-stone-500 mt-1">
            Break ID: <span className="font-mono">{brk.id}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge 
            status={brk.status === 'resolved' ? 'ok' : brk.status === 'open' ? 'critical' : 'pending'}
            label={statusConfig[brk.status].label}
          />
          {!clientSafe && (
            <Button variant="primary" size="sm">
              Изменить статус
            </Button>
          )}
        </div>
      </div>

      {/* Key Info Card */}
      <div className="bg-gradient-to-br from-stone-50 to-amber-50/30 rounded-xl border border-stone-200/50 p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <span className="text-xs text-stone-500 uppercase block mb-1">Ожидалось</span>
            <p className="text-xl font-bold text-stone-800">{formatValue(brk.expected)}</p>
          </div>
          <div>
            <span className="text-xs text-stone-500 uppercase block mb-1">Факт</span>
            <p className="text-xl font-bold text-stone-800">{formatValue(brk.actual)}</p>
          </div>
          <div>
            <span className="text-xs text-stone-500 uppercase block mb-1">Дельта</span>
            <p className={cn(
              "text-xl font-bold",
              brk.delta && brk.delta > 0 ? "text-emerald-600" : brk.delta && brk.delta < 0 ? "text-rose-600" : "text-stone-600"
            )}>
              {formatDelta(brk.delta, brk.currency)}
            </p>
          </div>
          <div>
            <span className="text-xs text-stone-500 uppercase block mb-1">Валюта</span>
            <p className="text-xl font-bold text-stone-800">{brk.currency || '—'}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        {visibleTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.key
                ? "border-emerald-500 text-emerald-700"
                : "border-transparent text-stone-500 hover:text-stone-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-stone-50 rounded-lg p-4">
                <span className="text-xs text-stone-500 block mb-1">Тип расхождения</span>
                <p className="font-semibold text-stone-800">{breakTypeLabels[brk.breakType] || brk.breakType}</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <span className="text-xs text-stone-500 block mb-1">Инструмент</span>
                <p className="font-semibold text-stone-800">{brk.instrument || '—'}</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <span className="text-xs text-stone-500 block mb-1">Ответственный</span>
                <p className="font-semibold text-stone-800">{brk.owner ? brk.owner.split('@')[0] : 'Не назначен'}</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <span className="text-xs text-stone-500 block mb-1">Создан</span>
                <p className="font-semibold text-stone-800">{new Date(brk.createdAt).toLocaleString('ru-RU')}</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <span className="text-xs text-stone-500 block mb-1">Entity ID</span>
                <p className="font-semibold text-stone-800 font-mono text-sm">{brk.entityId || '—'}</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <span className="text-xs text-stone-500 block mb-1">Account ID</span>
                <p className="font-semibold text-stone-800 font-mono text-sm">{brk.accountId || '—'}</p>
              </div>
            </div>

            {/* Source Info */}
            {job && feed && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Источник</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600">Провайдер:</span>
                    <span className="ml-2 text-blue-800 font-medium">{feed.providerName}</span>
                  </div>
                  <div>
                    <span className="text-blue-600">As-of:</span>
                    <span className="ml-2 text-blue-800 font-medium">{new Date(job.asOf).toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div>
                    <span className="text-blue-600">Job ID:</span>
                    <span className="ml-2 text-blue-800 font-mono text-xs">{job.id}</span>
                  </div>
                  <div>
                    <span className="text-blue-600">Match %:</span>
                    <span className="ml-2 text-blue-800 font-medium">{job.matchPct?.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Resolution */}
            {brk.resolution && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h4 className="font-semibold text-emerald-800 mb-2">Решение</h4>
                <p className="text-emerald-700">{brk.resolution}</p>
              </div>
            )}

            {/* Related Breaks */}
            {relatedBreaks.length > 0 && (
              <div>
                <h4 className="font-semibold text-stone-700 mb-3">Связанные расхождения</h4>
                <div className="space-y-2">
                  {relatedBreaks.map(rb => (
                    <div 
                      key={rb.id}
                      onClick={() => router.push(`/m/reconciliation/item/${rb.id}`)}
                      className="flex items-center justify-between p-3 bg-stone-50 rounded-lg hover:bg-stone-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn("px-2 py-0.5 rounded text-xs font-medium", severityConfig[rb.severity].color)}>
                          {rb.severity}
                        </span>
                        <span className="text-sm text-stone-800">{rb.instrument || rb.breakType}</span>
                      </div>
                      <StatusBadge 
                        status={rb.status === 'resolved' ? 'ok' : rb.status === 'open' ? 'critical' : 'pending'}
                        label={rb.status}
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'diagnosis' && !clientSafe && (
          <div className="space-y-6">
            <h4 className="font-semibold text-stone-700">Диагностика</h4>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h5 className="font-medium text-amber-800 mb-2">Возможные причины</h5>
              <ul className="list-disc list-inside text-amber-700 text-sm space-y-1">
                {brk.breakType === 'quantity_mismatch' && (
                  <>
                    <li>Корпоративное действие (сплит, дивиденды акциями)</li>
                    <li>Транзакция не отражена в системе</li>
                    <li>Ошибка при вводе данных</li>
                  </>
                )}
                {brk.breakType === 'price_mismatch' && (
                  <>
                    <li>Разные источники цен (Bloomberg vs Reuters)</li>
                    <li>Разница во времени ценообразования</li>
                    <li>Валютная конверсия</li>
                  </>
                )}
                {brk.breakType === 'unmapped_symbol' && (
                  <>
                    <li>Новый инструмент отсутствует в референс-данных</li>
                    <li>Изменился ISIN/CUSIP</li>
                    <li>Ошибка в написании тикера</li>
                  </>
                )}
                {!['quantity_mismatch', 'price_mismatch', 'unmapped_symbol'].includes(brk.breakType) && (
                  <li>Требуется ручная проверка</li>
                )}
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-medium text-stone-700">Рекомендуемые действия</h5>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm">Проверить транзакции</Button>
                <Button variant="secondary" size="sm">Сравнить с выпиской</Button>
                <Button variant="secondary" size="sm">Запросить уточнение</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actions' && !clientSafe && (
          <div className="space-y-6">
            <h4 className="font-semibold text-stone-700">Доступные действия</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="primary" className="justify-start">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Назначить ответственного
              </Button>
              <Button variant="secondary" className="justify-start">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Создать задачу
              </Button>
              <Button variant="secondary" className="justify-start">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Повторить сверку
              </Button>
              <Button variant="secondary" className="justify-start">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Создать issue
              </Button>
            </div>

            <div className="border-t pt-4">
              <h5 className="font-medium text-stone-700 mb-3">Изменить статус</h5>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusConfig).map(([key, config]) => (
                  <button
                    key={key}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
                      brk.status === key 
                        ? config.color + " ring-2 ring-offset-2 ring-emerald-500"
                        : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                    )}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-stone-700">Прикреплённые документы</h4>
              {!clientSafe && (
                <Button variant="secondary" size="sm">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Добавить
                </Button>
              )}
            </div>
            
            {(!brk.evidenceDocIds || brk.evidenceDocIds.length === 0) ? (
              <div className="text-center py-12 text-stone-400">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Нет прикреплённых документов</p>
              </div>
            ) : (
              <div className="space-y-2">
                {brk.evidenceDocIds.map(docId => (
                  <div key={docId} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-stone-700 font-mono">{docId}</span>
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
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-stone-100 rounded animate-pulse" />
                ))}
              </div>
            ) : auditEvents.length === 0 ? (
              <div className="text-center py-8 text-stone-400">
                <p>Нет записей аудита</p>
              </div>
            ) : (
              <div className="space-y-3">
                {auditEvents.slice(0, 20).map(event => (
                  <div key={event.id} className="p-4 bg-stone-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-stone-800">{event.actorName}</span>
                      <span className="text-xs text-stone-400">
                        {new Date(event.ts).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-sm text-stone-600">{event.summary}</p>
                    <span className="text-xs px-2 py-0.5 bg-stone-200 rounded mt-2 inline-block">
                      {event.action}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
