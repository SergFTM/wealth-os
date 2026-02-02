"use client";

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useCollection } from '@/lib/hooks';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

import seedData from '@/modules/03-reconciliation/seed.json';

interface DataFeed {
  id: string;
  providerName: string;
  type: string;
  coverage: string[];
  status: 'ok' | 'stale' | 'error';
  lastSyncAt: string;
  authStatus?: string;
}

interface ReconJob {
  id: string;
  feedId: string;
  asOf: string;
  scope?: string[];
  matchPct?: number | null;
  breaksCount?: number | null;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  finishedAt?: string | null;
}

interface ReconBreak {
  id: string;
  jobId: string;
  instrument?: string | null;
  breakType: string;
  expected: string | number | null;
  actual: string | number | null;
  delta?: number | null;
  currency?: string | null;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved' | 'ignored';
  owner?: string | null;
  createdAt: string;
}

interface ReconMapping {
  id: string;
  feedId: string;
  mappingType: string;
  externalKey: string;
  internalKey?: string | null;
  externalName?: string;
  internalName?: string | null;
  status: 'mapped' | 'unmapped' | 'pending';
  confidence?: number | null;
}

const tabs = [
  { key: 'feeds', label: 'Источники' },
  { key: 'jobs', label: 'Прогоны' },
  { key: 'breaks', label: 'Расхождения' },
  { key: 'mappings', label: 'Маппинг' }
];

const severityConfig = {
  critical: { color: 'bg-rose-100 text-rose-700', label: 'Критический' },
  high: { color: 'bg-orange-100 text-orange-700', label: 'Высокий' },
  medium: { color: 'bg-amber-100 text-amber-700', label: 'Средний' },
  low: { color: 'bg-stone-100 text-stone-600', label: 'Низкий' }
};

const statusConfig = {
  open: { color: 'bg-rose-100 text-rose-700', label: 'Открыт' },
  investigating: { color: 'bg-blue-100 text-blue-700', label: 'В работе' },
  resolved: { color: 'bg-emerald-100 text-emerald-700', label: 'Решён' },
  ignored: { color: 'bg-stone-100 text-stone-600', label: 'Пропущен' }
};

const jobStatusConfig = {
  running: { color: 'bg-blue-100 text-blue-700', label: 'Выполняется' },
  completed: { color: 'bg-emerald-100 text-emerald-700', label: 'Завершено' },
  failed: { color: 'bg-rose-100 text-rose-700', label: 'Ошибка' }
};

const breakTypeLabels: Record<string, string> = {
  quantity_mismatch: 'Кол-во',
  price_mismatch: 'Цена',
  missing_transaction: 'Транзакция',
  cash_mismatch: 'Cash',
  unmapped_symbol: 'Символ',
  unmapped_account: 'Счёт',
  unmapped_entity: 'Entity'
};

export default function ReconciliationListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, user } = useApp();
  const clientSafe = user?.role === 'client';

  const initialTab = searchParams.get('tab') || 'breaks';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    severity: searchParams.get('severity') || '',
    feedId: searchParams.get('feedId') || '',
    search: searchParams.get('search') || ''
  });

  // Load data
  const feeds = seedData.dataFeeds as unknown as DataFeed[];
  const jobs = seedData.reconJobs as unknown as ReconJob[];
  const breaks = seedData.reconBreaks as unknown as ReconBreak[];
  const mappings = seedData.reconMappings as unknown as ReconMapping[];

  const filteredBreaks = useMemo(() => {
    return breaks.filter(b => {
      if (filters.status && b.status !== filters.status) return false;
      if (filters.severity && b.severity !== filters.severity) return false;
      if (filters.search && !(b.instrument || '').toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return (severityOrder[a.severity] || 4) - (severityOrder[b.severity] || 4);
    });
  }, [breaks, filters]);

  const filteredMappings = useMemo(() => {
    return mappings.filter(m => {
      if (filters.status && m.status !== filters.status) return false;
      if (filters.feedId && m.feedId !== filters.feedId) return false;
      if (filters.search && !m.externalKey.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [mappings, filters]);

  const toggleRow = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    alert(`Bulk action: ${action} on ${selectedRows.length} items`);
    setSelectedRows([]);
  };

  const getFeedName = (feedId: string) => {
    return feeds.find(f => f.id === feedId)?.providerName || feedId;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">
            Сверка депозитария — Список
          </h1>
        </div>
        <Button variant="ghost" size="sm" onClick={() => router.push('/m/reconciliation')}>
          ← Назад
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        {tabs.filter(t => clientSafe ? !['mappings'].includes(t.key) : true).map(tab => (
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

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Поиск..."
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="px-3 py-2 rounded-lg border border-stone-200 text-sm w-48"
          />
          {activeTab === 'breaks' && (
            <>
              <select
                value={filters.status}
                onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-stone-200 text-sm"
              >
                <option value="">Все статусы</option>
                <option value="open">Открыт</option>
                <option value="investigating">В работе</option>
                <option value="resolved">Решён</option>
                <option value="ignored">Пропущен</option>
              </select>
              <select
                value={filters.severity}
                onChange={e => setFilters(f => ({ ...f, severity: e.target.value }))}
                className="px-3 py-2 rounded-lg border border-stone-200 text-sm"
              >
                <option value="">Все уровни</option>
                <option value="critical">Критический</option>
                <option value="high">Высокий</option>
                <option value="medium">Средний</option>
                <option value="low">Низкий</option>
              </select>
            </>
          )}
          {activeTab === 'mappings' && (
            <select
              value={filters.status}
              onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-stone-200 text-sm"
            >
              <option value="">Все статусы</option>
              <option value="mapped">Mapped</option>
              <option value="unmapped">Unmapped</option>
              <option value="pending">Pending</option>
            </select>
          )}
          <Button variant="ghost" size="sm" onClick={() => setFilters({ status: '', severity: '', feedId: '', search: '' })}>
            Сбросить
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && !clientSafe && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-emerald-800">
            Выбрано: {selectedRows.length}
          </span>
          <div className="flex gap-2">
            {activeTab === 'breaks' && (
              <>
                <Button variant="secondary" size="sm" onClick={() => handleBulkAction('assign')}>
                  Назначить
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleBulkAction('resolve')}>
                  Решить
                </Button>
              </>
            )}
            {activeTab === 'mappings' && (
              <Button variant="secondary" size="sm" onClick={() => handleBulkAction('approve')}>
                Одобрить
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setSelectedRows([])}>
              Отменить
            </Button>
          </div>
        </div>
      )}

      {/* Feeds Table */}
      {activeTab === 'feeds' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Провайдер</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Тип</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Coverage</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Статус</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Последний синк</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Действия</th>
                </tr>
              </thead>
              <tbody>
                {feeds.map(feed => (
                  <tr key={feed.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-3 font-medium text-stone-800">{feed.providerName}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-stone-100 text-stone-600 capitalize">
                        {feed.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-stone-600">
                      {feed.coverage.join(', ')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <StatusBadge
                        status={feed.status === 'ok' ? 'ok' : feed.status === 'stale' ? 'warning' : 'critical'}
                        size="sm"
                        label={feed.status}
                      />
                    </td>
                    <td className="py-3 px-3 text-center text-xs text-stone-500">
                      {new Date(feed.lastSyncAt).toLocaleString('ru-RU')}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button variant="ghost" size="sm">
                        Синк
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Jobs Table */}
      {activeTab === 'jobs' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">ID</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Источник</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">As-of</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Match %</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Breaks</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Статус</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Начат</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Действия</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(job => (
                  <tr key={job.id} className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors">
                    <td className="py-3 px-3 font-mono text-xs text-stone-500">{job.id.slice(0, 8)}</td>
                    <td className="py-3 px-3 font-medium text-stone-800">{getFeedName(job.feedId)}</td>
                    <td className="py-3 px-3 text-center text-stone-600">
                      {new Date(job.asOf).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {job.matchPct !== null && job.matchPct !== undefined ? (
                        <span className={cn(
                          "font-medium",
                          job.matchPct >= 98 ? "text-emerald-600" : job.matchPct >= 95 ? "text-amber-600" : "text-rose-600"
                        )}>
                          {job.matchPct.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {job.breaksCount !== null && job.breaksCount !== undefined ? (
                        <span className={cn(
                          "px-2 py-0.5 rounded text-xs font-medium",
                          job.breaksCount === 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        )}>
                          {job.breaksCount}
                        </span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={cn("px-2 py-0.5 rounded text-xs font-medium", jobStatusConfig[job.status].color)}>
                        {jobStatusConfig[job.status].label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center text-xs text-stone-500">
                      {new Date(job.startedAt).toLocaleString('ru-RU')}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button variant="ghost" size="sm">Открыть</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Breaks Table */}
      {activeTab === 'breaks' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  {!clientSafe && (
                    <th className="py-2 px-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === filteredBreaks.length && filteredBreaks.length > 0}
                        onChange={e => setSelectedRows(e.target.checked ? filteredBreaks.map(b => b.id) : [])}
                        className="rounded"
                      />
                    </th>
                  )}
                  <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">ID</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Критич.</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Инструмент</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Тип</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Дельта</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Статус</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Owner</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredBreaks.map(brk => (
                  <tr key={brk.id} className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors">
                    {!clientSafe && (
                      <td className="py-3 px-3" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(brk.id)}
                          onChange={() => toggleRow(brk.id)}
                          className="rounded"
                        />
                      </td>
                    )}
                    <td className="py-3 px-3 font-mono text-xs text-stone-500">{brk.id.slice(0, 6)}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={cn("px-2 py-0.5 rounded text-xs font-medium", severityConfig[brk.severity].color)}>
                        {severityConfig[brk.severity].label}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-stone-800">{brk.instrument || '—'}</td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-xs bg-stone-100 text-stone-600">
                        {breakTypeLabels[brk.breakType] || brk.breakType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      {brk.delta !== null && brk.delta !== undefined ? (
                        <span className={cn(
                          "text-sm",
                          brk.delta > 0 ? "text-emerald-600" : brk.delta < 0 ? "text-rose-600" : "text-stone-500"
                        )}>
                          {brk.delta > 0 ? '+' : ''}{brk.delta.toLocaleString()}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={cn("px-2 py-0.5 rounded text-xs font-medium", statusConfig[brk.status].color)}>
                        {statusConfig[brk.status].label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-stone-600 truncate max-w-24">
                      {brk.owner ? brk.owner.split('@')[0] : '—'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button variant="ghost" size="sm">Открыть</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredBreaks.length === 0 && (
            <div className="text-center py-12 text-stone-400">
              Нет данных
            </div>
          )}
        </div>
      )}

      {/* Mappings Table */}
      {activeTab === 'mappings' && !clientSafe && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/50">
                  <th className="py-2 px-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === filteredMappings.length && filteredMappings.length > 0}
                      onChange={e => setSelectedRows(e.target.checked ? filteredMappings.map(m => m.id) : [])}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Источник</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Тип</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">External</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Internal</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Статус</th>
                  <th className="text-center py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Confidence</th>
                  <th className="text-right py-2 px-3 text-xs font-semibold text-stone-500 uppercase">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredMappings.map(m => (
                  <tr key={m.id} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-3" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(m.id)}
                        onChange={() => toggleRow(m.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="py-3 px-3 font-medium text-stone-800">{getFeedName(m.feedId)}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 capitalize">
                        {m.mappingType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-stone-600">
                      <div>
                        <span className="font-mono text-xs">{m.externalKey}</span>
                        {m.externalName && <span className="text-xs text-stone-400 ml-1">({m.externalName})</span>}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-stone-600">
                      {m.internalKey ? (
                        <div>
                          <span className="font-mono text-xs">{m.internalKey}</span>
                          {m.internalName && <span className="text-xs text-stone-400 ml-1">({m.internalName})</span>}
                        </div>
                      ) : (
                        <span className="text-stone-400 italic">Not mapped</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <StatusBadge
                        status={m.status === 'mapped' ? 'ok' : m.status === 'unmapped' ? 'critical' : 'pending'}
                        size="sm"
                        label={m.status}
                      />
                    </td>
                    <td className="py-3 px-3 text-center">
                      {m.confidence !== null && m.confidence !== undefined ? (
                        <span className={cn(
                          "font-medium text-xs",
                          m.confidence >= 90 ? "text-emerald-600" : m.confidence >= 70 ? "text-amber-600" : "text-rose-600"
                        )}>
                          {m.confidence}%
                        </span>
                      ) : '—'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex justify-end gap-1">
                        {m.status === 'pending' && (
                          <Button variant="ghost" size="sm">Одобрить</Button>
                        )}
                        {m.status === 'unmapped' && (
                          <Button variant="ghost" size="sm">Создать</Button>
                        )}
                        <Button variant="ghost" size="sm">Редактировать</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredMappings.length === 0 && (
            <div className="text-center py-12 text-stone-400">
              Нет данных
            </div>
          )}
        </div>
      )}
    </div>
  );
}
