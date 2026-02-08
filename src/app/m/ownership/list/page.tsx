"use client";

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCollection, useAuditEvents } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { FormRenderer } from '@/components/ui/FormRenderer';
import { OwNodesTable } from '@/modules/47-ownership/ui/OwNodesTable';
import { OwLinksTable } from '@/modules/47-ownership/ui/OwLinksTable';
import { OwUboTable } from '@/modules/47-ownership/ui/OwUboTable';
import { OwChangesTable } from '@/modules/47-ownership/ui/OwChangesTable';
import { OwConcentrationsPanel } from '@/modules/47-ownership/ui/OwConcentrationsPanel';
import { OwClientSafePanel } from '@/modules/47-ownership/ui/OwClientSafePanel';

type TabKey = 'nodes' | 'links' | 'ubo' | 'changes' | 'concentrations' | 'client_safe' | 'audit';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'nodes', label: 'Узлы' },
  { key: 'links', label: 'Связи' },
  { key: 'ubo', label: 'UBO' },
  { key: 'changes', label: 'Изменения' },
  { key: 'concentrations', label: 'Концентрации' },
  { key: 'client_safe', label: 'Client-Safe' },
  { key: 'audit', label: 'Аудит' },
];

function OwnershipListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>('nodes');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab') as TabKey;
    if (tab && tabs.some((t) => t.key === tab)) {
      setActiveTab(tab);
    }
    if (searchParams.get('create') === 'true') {
      setShowCreate(true);
    }
  }, [searchParams]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: nodes = [], create: createNode, refetch: refetchNodes } = useCollection('ownershipNodes') as { data: any[]; create: (data: Record<string, unknown>) => Promise<unknown>; refetch: () => void };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: links = [], create: createLink, refetch: refetchLinks } = useCollection('ownershipLinks') as { data: any[]; create: (data: Record<string, unknown>) => Promise<unknown>; refetch: () => void };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: ubos = [] } = useCollection('ownershipUbo') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: changes = [] } = useCollection('ownershipChanges') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: views = [] } = useCollection('ownershipViews') as { data: any[] };
  const { events: auditEvents } = useAuditEvents(null);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    router.push(`/m/ownership/list?tab=${tab}`);
  };

  // Create node map for enriching links
  const nodeMap = new Map(nodes.map((n: { id: string; name: string }) => [n.id, n.name]));

  // Enrich links with node names
  const enrichedLinks = links.map((link: { id: string; fromNodeId: string; toNodeId: string; ownershipPct: number; profitSharePct?: number; effectiveFrom: string; effectiveTo?: string; sourceRefJson?: unknown }) => ({
    ...link,
    fromNodeName: nodeMap.get(link.fromNodeId) || link.fromNodeId,
    toNodeName: nodeMap.get(link.toNodeId) || link.toNodeId,
    hasSource: !!link.sourceRefJson,
  }));

  // Enrich UBOs
  const enrichedUbos = ubos.map((ubo: { id: string; personMdmId: string; targetNodeId: string; computedPct: number; pathsJson: unknown[]; computedAt: string }) => ({
    ...ubo,
    personName: ubo.personMdmId, // Would be fetched from MDM in real app
    targetNodeName: nodeMap.get(ubo.targetNodeId) || ubo.targetNodeId,
    pathsCount: ubo.pathsJson?.length || 0,
  }));

  // Filter data based on search
  const filterBySearch = <T extends Record<string, unknown>>(data: T[], keys: string[]): T[] => {
    if (!search) return data;
    const lower = search.toLowerCase();
    return data.filter((item) =>
      keys.some((key) => String(item[key] || '').toLowerCase().includes(lower))
    );
  };

  const filteredNodes = filterBySearch(nodes, ['name', 'nodeTypeKey', 'jurisdiction']);
  const filteredLinks = filterBySearch(enrichedLinks, ['fromNodeName', 'toNodeName']);

  // Node form fields
  const nodeFields = [
    { key: 'name', label: 'Название', type: 'text' as const, required: true },
    { key: 'nodeTypeKey', label: 'Тип', type: 'select' as const, required: true, options: [
      { value: 'household', label: 'Домохозяйство' },
      { value: 'trust', label: 'Траст' },
      { value: 'entity', label: 'Юр. лицо' },
      { value: 'partnership', label: 'Партнерство' },
      { value: 'spv', label: 'SPV' },
      { value: 'account', label: 'Счет' },
      { value: 'asset', label: 'Актив' },
    ]},
    { key: 'jurisdiction', label: 'Юрисдикция', type: 'text' as const },
    { key: 'status', label: 'Статус', type: 'select' as const, required: true, options: [
      { value: 'active', label: 'Активный' },
      { value: 'inactive', label: 'Неактивный' },
    ]},
  ];

  // Link form fields
  const linkFields = [
    { key: 'fromNodeId', label: 'От узла', type: 'select' as const, required: true, options: nodes.map((n: { id: string; name: string }) => ({ value: n.id, label: n.name })) },
    { key: 'toNodeId', label: 'К узлу', type: 'select' as const, required: true, options: nodes.map((n: { id: string; name: string }) => ({ value: n.id, label: n.name })) },
    { key: 'ownershipPct', label: 'Доля владения (%)', type: 'number' as const, required: true },
    { key: 'profitSharePct', label: 'Доля прибыли (%)', type: 'number' as const },
    { key: 'effectiveFrom', label: 'Действует с', type: 'date' as const, required: true },
    { key: 'effectiveTo', label: 'Действует до', type: 'date' as const },
  ];

  const handleCreate = async (values: Record<string, unknown>) => {
    if (activeTab === 'nodes') {
      await createNode({ ...values, clientId: 'demo' });
      refetchNodes();
    } else if (activeTab === 'links') {
      await createLink({ ...values, clientId: 'demo' });
      refetchLinks();
    }
    setShowCreate(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80">
      <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/m/ownership">
              <Button variant="ghost" className="gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-stone-800">Ownership — Список</h1>
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

        {/* Filters & Actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative max-w-md">
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
          {(activeTab === 'nodes' || activeTab === 'links') && (
            <Button variant="primary" onClick={() => setShowCreate(true)}>
              + Создать
            </Button>
          )}
        </div>

        {/* Table content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
          {activeTab === 'nodes' && (
            <OwNodesTable
              data={filteredNodes.map((n: { id: string; name: string; nodeTypeKey: string; jurisdiction?: string; status: string; updatedAt: string }) => ({
                ...n,
                linksCount: links.filter((l: { fromNodeId: string; toNodeId: string }) => l.fromNodeId === n.id || l.toNodeId === n.id).length,
              }))}
              onRowClick={(node) => router.push(`/m/ownership/node/${node.id}`)}
            />
          )}
          {activeTab === 'links' && (
            <OwLinksTable
              data={filteredLinks}
              onRowClick={(link) => router.push(`/m/ownership/link/${link.id}`)}
            />
          )}
          {activeTab === 'ubo' && (
            <OwUboTable
              data={enrichedUbos}
              onRowClick={(ubo) => router.push(`/m/ownership/ubo/${ubo.id}`)}
            />
          )}
          {activeTab === 'changes' && (
            <OwChangesTable data={changes} />
          )}
          {activeTab === 'concentrations' && (
            <div className="p-6">
              <OwConcentrationsPanel
                metrics={[]}
                summary={{
                  totalNodes: nodes.length,
                  totalLinks: links.length,
                  avgOwnershipDepth: 2.3,
                  maxOwnershipDepth: 4,
                  riskScore: 25,
                }}
              />
            </div>
          )}
          {activeTab === 'client_safe' && (
            <div className="p-6">
              <OwClientSafePanel
                views={views.map((v: { id: string; scopeHouseholdNodeId: string; publishedAt: string; publishedByUserId: string; snapshotJson?: { nodes?: unknown[]; links?: unknown[] } }) => ({
                  id: v.id,
                  scopeHouseholdNodeId: v.scopeHouseholdNodeId,
                  scopeHouseholdName: nodeMap.get(v.scopeHouseholdNodeId),
                  publishedAt: v.publishedAt,
                  publishedByUserId: v.publishedByUserId,
                  nodesCount: v.snapshotJson?.nodes?.length || 0,
                  linksCount: v.snapshotJson?.links?.length || 0,
                }))}
                onViewClick={(view) => {}}
                onPublishNew={() => {}}
              />
            </div>
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

      {/* Create Modal */}
      <Modal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        title={activeTab === 'nodes' ? 'Создать узел' : 'Создать связь'}
        size="md"
      >
        <FormRenderer
          fields={activeTab === 'nodes' ? nodeFields : linkFields}
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>
    </div>
  );
}

export default function OwnershipListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500">Загрузка...</p>
        </div>
      </div>
    }>
      <OwnershipListContent />
    </Suspense>
  );
}
