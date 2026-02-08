'use client';

import { useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ModuleList } from '@/components/templates/ModuleList';
import { useCollection, useMutateRecord } from '@/lib/hooks';
import { ExQueueTable } from '@/modules/48-exceptions/ui/ExQueueTable';
import { ExClusterTable } from '@/modules/48-exceptions/ui/ExClusterTable';
import { ExRulesTable } from '@/modules/48-exceptions/ui/ExRulesTable';
import { ExSlaPoliciesTable } from '@/modules/48-exceptions/ui/ExSlaPoliciesTable';
import { ExAnalyticsPanel } from '@/modules/48-exceptions/ui/ExAnalyticsPanel';
import { cn } from '@/lib/utils';

type TabKey = 'queue' | 'clusters' | 'rules' | 'slas' | 'analytics' | 'audit';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'queue', label: 'Очередь' },
  { key: 'clusters', label: 'Кластеры' },
  { key: 'rules', label: 'Правила' },
  { key: 'slas', label: 'SLA' },
  { key: 'analytics', label: 'Аналитика' },
  { key: 'audit', label: 'Аудит' }
];

function ExceptionsListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabKey) || 'queue';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: exceptions = [], isLoading: loadingExceptions, refetch } = useCollection<any>('exceptions');
  const { data: clusters = [], isLoading: loadingClusters } = useCollection<any>('exceptionClusters');
  const { data: rules = [], isLoading: loadingRules } = useCollection<any>('exceptionRules');
  const { data: slaPolicies = [], isLoading: loadingSlas } = useCollection<any>('exceptionSlaPolicies');
  const { data: auditEvents = [], isLoading: loadingAudit } = useCollection<any>('auditEvents');

  const filteredExceptions = useMemo(() => {
    return exceptions.filter(e => {
      if (statusFilter && e.status !== statusFilter) return false;
      if (severityFilter && e.severity !== severityFilter) return false;
      if (sourceFilter && e.sourceModuleKey !== sourceFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!e.title.toLowerCase().includes(query) &&
            !(e.description || '').toLowerCase().includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [exceptions, statusFilter, severityFilter, sourceFilter, searchQuery]);

  const handleExceptionClick = (item: any) => {
    router.push(`/m/exceptions/exception/${item.id}`);
  };

  const handleClusterClick = (item: any) => {
    router.push(`/m/exceptions/cluster/${item.id}`);
  };

  const handleRuleClick = (item: any) => {
    router.push(`/m/exceptions/rule/${item.id}`);
  };

  const handleRuleToggle = async (item: any, enabled: boolean) => {
    // Update rule enabled status
    try {
      await fetch(`/api/collections/exceptionRules/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });
      refetch();
    } catch (err) {
      console.error('Failed to toggle rule:', err);
    }
  };

  const handleSlaPolicyClick = (item: any) => {
    // Could open edit modal
    console.log('Edit SLA policy:', item.id);
  };

  const handleSlaPolicyToggle = async (item: any, enabled: boolean) => {
    try {
      await fetch(`/api/collections/exceptionSlaPolicies/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled })
      });
      refetch();
    } catch (err) {
      console.error('Failed to toggle SLA policy:', err);
    }
  };

  return (
    <ModuleList moduleSlug="exceptions" title="Исключения" backHref="/m/exceptions">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="border-b border-stone-200">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                  activeTab === tab.key
                    ? 'border-emerald-500 text-emerald-700'
                    : 'border-transparent text-stone-500 hover:text-stone-700'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Filters for Queue tab */}
        {activeTab === 'queue' && (
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-xs text-stone-500 mb-1">Статус</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm min-w-[120px]"
                >
                  <option value="">Все</option>
                  <option value="open">Открыто</option>
                  <option value="triage">Триаж</option>
                  <option value="in_progress">В работе</option>
                  <option value="closed">Закрыто</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Важность</label>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm min-w-[120px]"
                >
                  <option value="">Все</option>
                  <option value="critical">Критично</option>
                  <option value="warning">Внимание</option>
                  <option value="ok">Норма</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Источник</label>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm min-w-[140px]"
                >
                  <option value="">Все</option>
                  <option value="14">Интеграции</option>
                  <option value="2">GL</option>
                  <option value="39">Ликвидность</option>
                  <option value="42">Сделки</option>
                  <option value="5">Документы</option>
                  <option value="16">Цены</option>
                  <option value="43">Вендоры</option>
                  <option value="17">Безопасность</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-stone-500 mb-1">Поиск</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по названию..."
                  className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm"
                />
              </div>
              <button
                onClick={() => {
                  setStatusFilter('');
                  setSeverityFilter('');
                  setSourceFilter('');
                  setSearchQuery('');
                }}
                className="mt-5 px-3 py-1.5 text-sm text-stone-600 hover:text-stone-800"
              >
                Сбросить
              </button>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'queue' && (
          <ExQueueTable
            data={filteredExceptions}
            onRowClick={handleExceptionClick}
            isLoading={loadingExceptions}
            emptyMessage="Нет исключений"
          />
        )}

        {activeTab === 'clusters' && (
          <ExClusterTable
            data={clusters}
            onRowClick={handleClusterClick}
            isLoading={loadingClusters}
            emptyMessage="Нет кластеров"
          />
        )}

        {activeTab === 'rules' && (
          <ExRulesTable
            data={rules}
            onRowClick={handleRuleClick}
            onToggle={handleRuleToggle}
            isLoading={loadingRules}
            emptyMessage="Нет правил"
          />
        )}

        {activeTab === 'slas' && (
          <ExSlaPoliciesTable
            data={slaPolicies}
            onRowClick={handleSlaPolicyClick}
            onToggle={handleSlaPolicyToggle}
            isLoading={loadingSlas}
            emptyMessage="Нет SLA-политик"
          />
        )}

        {activeTab === 'analytics' && (
          <ExAnalyticsPanel exceptions={exceptions} />
        )}

        {activeTab === 'audit' && (
          <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50/50">
                    <th className="px-4 py-3 text-left font-medium text-stone-600">Время</th>
                    <th className="px-4 py-3 text-left font-medium text-stone-600">Событие</th>
                    <th className="px-4 py-3 text-left font-medium text-stone-600">Пользователь</th>
                    <th className="px-4 py-3 text-left font-medium text-stone-600">Детали</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {loadingAudit ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto" />
                      </td>
                    </tr>
                  ) : auditEvents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-stone-500">
                        Нет событий аудита
                      </td>
                    </tr>
                  ) : (
                    auditEvents.slice(0, 50).map((event: any) => (
                      <tr key={event.id} className="hover:bg-stone-50/50">
                        <td className="px-4 py-3 text-stone-500 text-xs whitespace-nowrap">
                          {new Date(event.ts || event.createdAt).toLocaleString('ru-RU')}
                        </td>
                        <td className="px-4 py-3 font-medium text-stone-900">
                          {event.action || event.type}
                        </td>
                        <td className="px-4 py-3 text-stone-600">
                          {event.userId || event.by || '—'}
                        </td>
                        <td className="px-4 py-3 text-stone-500 text-xs truncate max-w-xs">
                          {JSON.stringify(event.payload || event.details || {})}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </ModuleList>
  );
}

export default function ExceptionsListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-emerald-50/30 to-amber-50/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    }>
      <ExceptionsListContent />
    </Suspense>
  );
}
