"use client";

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCollection } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { MdPeopleTable } from '@/modules/46-mdm/ui/MdPeopleTable';
import { MdEntitiesTable } from '@/modules/46-mdm/ui/MdEntitiesTable';
import { MdAccountsTable } from '@/modules/46-mdm/ui/MdAccountsTable';
import { MdAssetsTable } from '@/modules/46-mdm/ui/MdAssetsTable';
import { MdDuplicatesTable } from '@/modules/46-mdm/ui/MdDuplicatesTable';
import { MdStewardQueueTable } from '@/modules/46-mdm/ui/MdStewardQueueTable';
import { MdRulesTable } from '@/modules/46-mdm/ui/MdRulesTable';

type TabKey = 'people' | 'entities' | 'accounts' | 'assets' | 'duplicates' | 'stewardship' | 'rules' | 'audit';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'people', label: 'Люди' },
  { key: 'entities', label: 'Сущности' },
  { key: 'accounts', label: 'Счета' },
  { key: 'assets', label: 'Активы' },
  { key: 'duplicates', label: 'Дубли' },
  { key: 'stewardship', label: 'Очередь' },
  { key: 'rules', label: 'Правила' },
  { key: 'audit', label: 'Audit' },
];

function MdmListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>('people');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const tab = searchParams.get('tab') as TabKey;
    if (tab && tabs.some((t) => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: people = [] } = useCollection('mdmPeople') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: entities = [] } = useCollection('mdmEntities') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: accounts = [] } = useCollection('mdmAccounts') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: assets = [] } = useCollection('mdmAssets') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: duplicates = [] } = useCollection('mdmDuplicates') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: stewardQueue = [] } = useCollection('mdmStewardQueue') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: rules = [] } = useCollection('mdmRules') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: auditEvents = [] } = useCollection('auditEvents') as { data: any[] };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    router.push(`/m/mdm/list?tab=${tab}`);
  };

  // Filter data based on search and status
  const filterData = <T extends { status?: string; chosenJson?: Record<string, unknown> }>(data: T[]): T[] => {
    return data.filter((item) => {
      if (statusFilter && item.status !== statusFilter) return false;
      if (search) {
        const searchLower = search.toLowerCase();
        const chosen = item.chosenJson || {};
        const matchesSearch = Object.values(chosen).some((val) =>
          String(val).toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
      }
      return true;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80">
      <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/m/mdm">
              <Button variant="ghost" className="gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-stone-800">MDM — Список</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 border-b border-stone-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`
                px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors
                ${activeTab === tab.key
                  ? 'bg-white border-t border-l border-r border-stone-200 text-emerald-700 -mb-px'
                  : 'text-stone-500 hover:text-stone-700'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск..."
              className="w-full px-4 py-2 pl-10 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Все статусы</option>
            <option value="active">Активный</option>
            <option value="inactive">Неактивный</option>
            <option value="merged">Объединен</option>
            <option value="pending_review">На проверке</option>
            <option value="open">Открыт</option>
            <option value="resolved">Решен</option>
            <option value="enabled">Включено</option>
            <option value="disabled">Отключено</option>
          </select>
          {(search || statusFilter) && (
            <button
              onClick={() => { setSearch(''); setStatusFilter(''); }}
              className="text-sm text-stone-500 hover:text-stone-700"
            >
              Сбросить
            </button>
          )}
        </div>

        {/* Table content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
          {activeTab === 'people' && (
            <MdPeopleTable
              data={filterData(people)}
              onRowClick={(person) => router.push(`/m/mdm/person/${person.id}`)}
            />
          )}
          {activeTab === 'entities' && (
            <MdEntitiesTable
              data={filterData(entities)}
              onRowClick={(entity) => router.push(`/m/mdm/entity/${entity.id}`)}
            />
          )}
          {activeTab === 'accounts' && (
            <MdAccountsTable
              data={filterData(accounts)}
              onRowClick={(account) => router.push(`/m/mdm/account/${account.id}`)}
            />
          )}
          {activeTab === 'assets' && (
            <MdAssetsTable
              data={filterData(assets)}
              onRowClick={(asset) => router.push(`/m/mdm/asset/${asset.id}`)}
            />
          )}
          {activeTab === 'duplicates' && (
            <MdDuplicatesTable
              data={filterData(duplicates)}
              onRowClick={(dup) => router.push(`/m/mdm/duplicate/${dup.id}`)}
            />
          )}
          {activeTab === 'stewardship' && (
            <MdStewardQueueTable
              data={filterData(stewardQueue)}
              onRowClick={() => {}}
            />
          )}
          {activeTab === 'rules' && (
            <MdRulesTable
              data={filterData(rules)}
              onRowClick={(rule) => router.push(`/m/mdm/rule/${rule.id}`)}
            />
          )}
          {activeTab === 'audit' && (
            <div className="p-6">
              <h3 className="font-semibold text-stone-800 mb-4">Audit Events</h3>
              {auditEvents.length === 0 ? (
                <p className="text-stone-500 text-center py-8">Нет audit событий</p>
              ) : (
                <div className="space-y-2">
                  {auditEvents.slice(0, 50).map((event) => (
                    <div
                      key={event.id}
                      className="p-3 bg-stone-50 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <span className="font-medium text-stone-700">{event.action}</span>
                        <span className="text-stone-500 ml-2">{event.summary}</span>
                      </div>
                      <span className="text-xs text-stone-400">
                        {new Date(event.ts).toLocaleString('ru-RU')}
                      </span>
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

export default function MdmListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500">Загрузка...</p>
        </div>
      </div>
    }>
      <MdmListContent />
    </Suspense>
  );
}
