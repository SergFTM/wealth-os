"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCollection } from '@/lib/hooks';
import { CoConsentsTable } from '@/modules/54-consent/ui/CoConsentsTable';
import { CoRequestsTable } from '@/modules/54-consent/ui/CoRequestsTable';
import { CoPoliciesTable } from '@/modules/54-consent/ui/CoPoliciesTable';
import { CoAccessReviewsTable } from '@/modules/54-consent/ui/CoAccessReviewsTable';
import { CoConflictsTable } from '@/modules/54-consent/ui/CoConflictsTable';
import { ArrowLeft, Plus, Search } from 'lucide-react';

type TabKey = 'consents' | 'requests' | 'policies' | 'access_reviews' | 'conflicts' | 'audit';

export default function ConsentListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as TabKey | null;
  const [activeTab, setActiveTab] = useState<TabKey>(tabParam || 'consents');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam, activeTab]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: consents = [] } = useCollection('consents') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: requests = [] } = useCollection('consentRequests') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: policies = [] } = useCollection('privacyPolicies') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: reviews = [] } = useCollection('accessReviews') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: conflicts = [] } = useCollection('consentConflicts') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: auditEvents = [] } = useCollection('auditEvents') as { data: any[] };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setStatusFilter('');
    setSearch('');
    router.push('/m/consent/list?tab=' + tab);
  };

  // Filter data
  const filteredConsents = consents.filter((c: Record<string, unknown>) => {
    if (statusFilter && c.statusKey !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      const grantor = (c.grantorRefJson as { label?: string })?.label || '';
      const grantee = (c.granteeRefJson as { label?: string })?.label || '';
      return grantor.toLowerCase().includes(s) || grantee.toLowerCase().includes(s);
    }
    return true;
  });

  const filteredRequests = requests.filter((r: Record<string, unknown>) => {
    if (statusFilter && r.statusKey !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      const label = (r.requesterRefJson as { label?: string })?.label || '';
      return label.toLowerCase().includes(s);
    }
    return true;
  });

  const filteredPolicies = policies.filter((p: Record<string, unknown>) => {
    if (statusFilter && p.statusKey !== statusFilter) return false;
    if (search) return (p.name as string || '').toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const filteredReviews = reviews.filter((r: Record<string, unknown>) => {
    if (statusFilter && r.statusKey !== statusFilter) return false;
    if (search) return (r.name as string || '').toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const filteredConflicts = conflicts.filter((c: Record<string, unknown>) => {
    if (statusFilter && c.statusKey !== statusFilter) return false;
    return true;
  });

  const consentAudit = auditEvents.filter(
    (e: { collection?: string }) =>
      e.collection && ['consents', 'consentRequests', 'privacyPolicies', 'accessReviews', 'consentConflicts'].includes(e.collection)
  );

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: 'consents', label: 'Согласия', count: consents.length },
    { key: 'requests', label: 'Запросы', count: requests.filter((r: { statusKey: string }) => r.statusKey === 'pending').length },
    { key: 'policies', label: 'Политики', count: policies.length },
    { key: 'access_reviews', label: 'Проверки доступа', count: reviews.filter((r: { statusKey: string }) => r.statusKey === 'open').length },
    { key: 'conflicts', label: 'Конфликты', count: conflicts.filter((c: { statusKey: string }) => c.statusKey === 'open').length },
    { key: 'audit', label: 'Аудит' },
  ];

  const createActions: Record<string, { label: string; href: string }> = {
    consents: { label: 'Новое согласие', href: '/m/consent/consent/new' },
    requests: { label: 'Новый запрос', href: '/m/consent/request/new' },
    policies: { label: 'Новая политика', href: '/m/consent/policy/new' },
    access_reviews: { label: 'Новая проверка', href: '/m/consent/review/new' },
  };

  const currentAction = createActions[activeTab];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/m/consent')} className="p-2 hover:bg-stone-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-stone-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-stone-800">Consent & Privacy Center</h1>
            <p className="text-sm text-stone-500 mt-1">Полный список данных</p>
          </div>
        </div>
        {currentAction && (
          <button
            onClick={() => router.push(currentAction.href)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">{currentAction.label}</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
        {activeTab !== 'audit' && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="">Все статусы</option>
            {activeTab === 'consents' && (
              <>
                <option value="active">Активные</option>
                <option value="revoked">Отозванные</option>
                <option value="expired">Истёкшие</option>
              </>
            )}
            {activeTab === 'requests' && (
              <>
                <option value="pending">Ожидают</option>
                <option value="approved">Одобрены</option>
                <option value="rejected">Отклонены</option>
                <option value="fulfilled">Исполнены</option>
              </>
            )}
            {activeTab === 'policies' && (
              <>
                <option value="active">Активные</option>
                <option value="inactive">Неактивные</option>
              </>
            )}
            {activeTab === 'access_reviews' && (
              <>
                <option value="open">Открытые</option>
                <option value="closed">Закрытые</option>
              </>
            )}
            {activeTab === 'conflicts' && (
              <>
                <option value="open">Открытые</option>
                <option value="resolved">Разрешённые</option>
              </>
            )}
          </select>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200 mb-6">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-1 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                    tab.key === 'conflicts' && tab.count > 0
                      ? 'bg-red-100 text-red-600'
                      : tab.key === 'requests' && tab.count > 0
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
        {activeTab === 'consents' && (
          <CoConsentsTable
            consents={filteredConsents}
            onOpen={(id) => router.push(`/m/consent/consent/${id}`)}
          />
        )}
        {activeTab === 'requests' && (
          <CoRequestsTable
            requests={filteredRequests}
            onOpen={(id) => router.push(`/m/consent/request/${id}`)}
          />
        )}
        {activeTab === 'policies' && (
          <CoPoliciesTable
            policies={filteredPolicies}
            onOpen={(id) => router.push(`/m/consent/policy/${id}`)}
          />
        )}
        {activeTab === 'access_reviews' && (
          <CoAccessReviewsTable
            reviews={filteredReviews}
            onOpen={(id) => router.push(`/m/consent/review/${id}`)}
          />
        )}
        {activeTab === 'conflicts' && (
          <CoConflictsTable
            conflicts={filteredConflicts}
            onOpen={(id) => router.push(`/m/consent/list?tab=conflicts&id=${id}`)}
          />
        )}
        {activeTab === 'audit' && (
          <div className="overflow-x-auto">
            {consentAudit.length === 0 ? (
              <div className="p-6 text-center text-stone-400">Нет аудит-записей</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-stone-500 uppercase tracking-wider border-b border-stone-200/50">
                    <th className="px-4 py-3 font-medium">Время</th>
                    <th className="px-4 py-3 font-medium">Действие</th>
                    <th className="px-4 py-3 font-medium">Коллекция</th>
                    <th className="px-4 py-3 font-medium">Описание</th>
                    <th className="px-4 py-3 font-medium">Актор</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {consentAudit.slice(0, 50).map((e: { id: string; ts: string; action: string; collection: string; summary: string; actorName: string }) => (
                    <tr key={e.id} className="hover:bg-stone-50/50">
                      <td className="px-4 py-3 text-sm text-stone-600">{new Date(e.ts).toLocaleString('ru-RU')}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded text-xs font-medium">{e.action}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-stone-600">{e.collection}</td>
                      <td className="px-4 py-3 text-sm text-stone-700 max-w-[300px] truncate">{e.summary}</td>
                      <td className="px-4 py-3 text-sm text-stone-600">{e.actorName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
