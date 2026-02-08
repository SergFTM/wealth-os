"use client";

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ModuleList } from '@/components/templates/ModuleList';
import { useCollection } from '@/lib/hooks';
import { PlPoliciesTable } from '@/modules/44-policies/ui/PlPoliciesTable';
import { PlSopsTable } from '@/modules/44-policies/ui/PlSopsTable';
import { PlVersionsTable } from '@/modules/44-policies/ui/PlVersionsTable';
import { PlAcknowledgementsTable } from '@/modules/44-policies/ui/PlAcknowledgementsTable';
import { PlChecklistsTable } from '@/modules/44-policies/ui/PlChecklistsTable';
import { PlLinksPanel } from '@/modules/44-policies/ui/PlLinksPanel';

type TabKey = 'policies' | 'sops' | 'versions' | 'acknowledgements' | 'checklists' | 'links' | 'audit';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'policies', label: 'Политики' },
  { key: 'sops', label: 'SOP' },
  { key: 'versions', label: 'Версии' },
  { key: 'acknowledgements', label: 'Подтверждения' },
  { key: 'checklists', label: 'Чеклисты' },
  { key: 'links', label: 'Связи' },
  { key: 'audit', label: 'Audit' },
];

function PoliciesListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabKey) || 'policies';
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
  });

  useEffect(() => {
    const tab = searchParams.get('tab') as TabKey;
    if (tab && tabs.some(t => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const { data: policies = [] } = useCollection<{
    id: string;
    title: string;
    categoryKey: string;
    status: string;
    currentVersionLabel?: string;
    ownerName?: string;
    clientSafePublished: boolean;
    tagsJson?: string[];
    createdAt: string;
    updatedAt: string;
  }>('plPolicies', { search: filters.search, status: filters.status });

  const { data: sops = [] } = useCollection<{
    id: string;
    title: string;
    processKey: string;
    status: string;
    currentVersionLabel?: string;
    ownerName?: string;
    clientSafePublished: boolean;
    stepsJson?: Array<{ orderIndex: number; title: string }>;
    createdAt: string;
    updatedAt: string;
  }>('plSops', { search: filters.search, status: filters.status });

  const { data: versions = [] } = useCollection<{
    id: string;
    docType: 'policy' | 'sop';
    docTitle: string;
    versionLabel: string;
    status: string;
    createdByName?: string;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
  }>('plVersions', { status: filters.status });

  const { data: acknowledgements = [] } = useCollection<{
    id: string;
    docType: 'policy' | 'sop';
    docTitle: string;
    versionLabel: string;
    subjectName: string;
    status: string;
    dueAt: string;
    acknowledgedAt?: string;
    createdAt: string;
    updatedAt: string;
  }>('plAcknowledgements');

  const { data: checklists = [] } = useCollection<{
    id: string;
    name: string;
    linkedSopId?: string;
    linkedSopTitle?: string;
    stepsJson: Array<{ orderIndex: number; title: string }>;
    usageCount: number;
    lastUsedAt?: string;
    createdAt: string;
    updatedAt: string;
  }>('plChecklists');

  const { data: links = [] } = useCollection<{
    id: string;
    policyId?: string;
    policyTitle?: string;
    sopId?: string;
    sopTitle?: string;
    linkedType: 'case' | 'incident' | 'breach' | 'ips';
    linkedId: string;
    linkedTitle: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  }>('plLinks');

  const { data: auditEvents = [] } = useCollection<{
    id: string;
    ts: string;
    actorName: string;
    action: string;
    summary: string;
    collection: string;
    createdAt: string;
    updatedAt: string;
  }>('auditEvents', { search: 'pl' });

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    router.push(`/m/policies/list?tab=${tab}`);
  };

  // Filter policies based on URL params
  const filteredPolicies = policies.filter(p => {
    const filter = searchParams.get('filter');
    if (filter === 'client_safe') return p.clientSafePublished;
    if (filter === 'missing_owner') return !p.ownerName;
    return true;
  });

  const filteredAcks = acknowledgements.filter(a => {
    const filter = searchParams.get('filter');
    if (filter === 'overdue') return a.status === 'overdue';
    return true;
  });

  const filteredLinks = links.filter(l => {
    const filter = searchParams.get('filter');
    if (filter === 'breaches') return l.linkedType === 'breach';
    return true;
  });

  return (
    <ModuleList moduleSlug="policies" title="Политики и SOP — Список" backHref="/m/policies">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Поиск..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="px-3 py-2 rounded-lg border border-stone-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="px-3 py-2 rounded-lg border border-stone-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          <option value="">Все статусы</option>
          <option value="active">Активные</option>
          <option value="archived">Архив</option>
          <option value="draft">Черновики</option>
          <option value="published">Опубликованные</option>
        </select>
        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="px-3 py-2 rounded-lg border border-stone-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        >
          <option value="">Все категории</option>
          <option value="investment">Инвестиционная</option>
          <option value="compliance">Комплаенс</option>
          <option value="security">Безопасность</option>
          <option value="operations">Операционная</option>
          <option value="vendor">Вендорская</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200 mb-6">
        <div className="flex gap-1 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-t-lg ${
                activeTab === tab.key
                  ? 'bg-white text-emerald-700 border-t border-l border-r border-stone-200'
                  : 'text-stone-600 hover:text-stone-800 hover:bg-stone-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'policies' && (
        <PlPoliciesTable policies={filteredPolicies as any} />
      )}

      {activeTab === 'sops' && (
        <PlSopsTable sops={sops as any} />
      )}

      {activeTab === 'versions' && (
        <PlVersionsTable versions={versions} />
      )}

      {activeTab === 'acknowledgements' && (
        <PlAcknowledgementsTable acknowledgements={filteredAcks} />
      )}

      {activeTab === 'checklists' && (
        <PlChecklistsTable checklists={checklists} />
      )}

      {activeTab === 'links' && (
        <PlLinksPanel links={filteredLinks} />
      )}

      {activeTab === 'audit' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50/50 border-b border-stone-200/50">
                <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">Время</th>
                <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">Действие</th>
                <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">Автор</th>
                <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">Описание</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {auditEvents.slice(0, 20).map((event) => (
                <tr key={event.id} className="hover:bg-stone-50/50">
                  <td className="px-4 py-3 text-sm text-stone-600">
                    {new Date(event.ts).toLocaleString('ru-RU')}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-stone-800">{event.action}</td>
                  <td className="px-4 py-3 text-sm text-stone-600">{event.actorName}</td>
                  <td className="px-4 py-3 text-sm text-stone-600">{event.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ModuleList>
  );
}

export default function PoliciesListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500">Загрузка...</p>
        </div>
      </div>
    }>
      <PoliciesListContent />
    </Suspense>
  );
}
