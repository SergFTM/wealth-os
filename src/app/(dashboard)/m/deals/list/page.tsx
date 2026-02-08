"use client";

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ModuleList } from '@/components/templates/ModuleList';
import { useCollection, useAuditEvents } from '@/lib/hooks';
import { DlCorporateActionsTable } from '@/modules/42-deals/ui/DlCorporateActionsTable';
import { DlPrivateDealsTable } from '@/modules/42-deals/ui/DlPrivateDealsTable';
import { DlFundEventsTable } from '@/modules/42-deals/ui/DlFundEventsTable';
import { DlChecklistsTable } from '@/modules/42-deals/ui/DlChecklistsTable';
import { DlApprovalsPanel } from '@/modules/42-deals/ui/DlApprovalsPanel';
import { DlDocumentsPanel } from '@/modules/42-deals/ui/DlDocumentsPanel';
import { AuditDrawer } from '@/components/templates/AuditDrawer';
import { cn } from '@/lib/utils';

// Type definitions for deals module
type CorporateAction = { id: string; ticker: string; actionType: string; effectiveDate: string; status: string };
type PrivateDeal = { id: string; name: string; dealType: string; stage: string };
type FundEvent = { id: string; fundName: string; eventType: string; eventDate: string; status: string };
type Checklist = { id: string; name: string; linkedType: string; linkedId: string; completionPct: number; linkedName?: string };
type Approval = { id: string; approverRole: string; status: 'pending' | 'approved' | 'rejected'; linkedType: string; linkedId: string; linkedName?: string; dueAt?: string; requestedByName?: string };
type DealDoc = { id: string; docName: string; docType?: string; status: 'missing' | 'requested' | 'received' | 'under_review' | 'approved' | 'rejected'; linkedType: string; linkedId: string; linkedName?: string };

type TabKey = 'actions' | 'deals' | 'fund_events' | 'checklists' | 'approvals' | 'documents' | 'audit';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'actions', label: 'Corporate Actions' },
  { key: 'deals', label: 'Private Deals' },
  { key: 'fund_events', label: 'События фондов' },
  { key: 'checklists', label: 'Checklists' },
  { key: 'approvals', label: 'Согласования' },
  { key: 'documents', label: 'Документы' },
  { key: 'audit', label: 'Audit' },
];

function DealsListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>('actions');
  const [showAudit, setShowAudit] = useState(false);

  const { items: rawCorporateActions = [] } = useCollection('dlCorporateActions');
  const { items: rawPrivateDeals = [] } = useCollection('dlPrivateDeals');
  const { items: rawFundEvents = [] } = useCollection('dlFundEvents');
  const { items: rawChecklists = [] } = useCollection('dlChecklists');
  const { items: rawApprovals = [] } = useCollection('dlApprovals');
  const { items: rawDocs = [] } = useCollection('dlDocs');
  const { events: auditEvents = [] } = useAuditEvents('');

  // Cast to typed arrays
  const corporateActions = rawCorporateActions as unknown as CorporateAction[];
  const privateDeals = rawPrivateDeals as unknown as PrivateDeal[];
  const fundEvents = rawFundEvents as unknown as FundEvent[];
  const checklists = rawChecklists as unknown as Checklist[];
  const approvals = rawApprovals as unknown as Approval[];
  const docs = rawDocs as unknown as DealDoc[];

  useEffect(() => {
    const tab = searchParams.get('tab') as TabKey;
    if (tab && tabs.some(t => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    router.push(`/m/deals/list?tab=${tab}`);
  };

  // Enrich data
  const enrichedChecklists: Checklist[] = checklists.map(c => ({
    ...c,
    linkedName: c.linkedType === 'deal'
      ? privateDeals.find(d => d.id === c.linkedId)?.name
      : c.linkedType === 'action'
      ? corporateActions.find(a => a.id === c.linkedId)?.ticker
      : fundEvents.find(e => e.id === c.linkedId)?.fundName,
  }));

  const enrichedApprovals: Approval[] = approvals.map(a => ({
    ...a,
    linkedName: a.linkedType === 'deal'
      ? privateDeals.find(d => d.id === a.linkedId)?.name
      : a.linkedType === 'action'
      ? corporateActions.find(act => act.id === a.linkedId)?.ticker
      : fundEvents.find(e => e.id === a.linkedId)?.fundName,
  }));

  const enrichedDocs: DealDoc[] = docs.map(d => ({
    ...d,
    linkedName: d.linkedType === 'deal'
      ? privateDeals.find(dl => dl.id === d.linkedId)?.name
      : d.linkedType === 'action'
      ? corporateActions.find(a => a.id === d.linkedId)?.ticker
      : fundEvents.find(e => e.id === d.linkedId)?.fundName,
  }));

  // Filter audit events for deals module
  const dealsAuditEvents = auditEvents;

  return (
    <ModuleList
      moduleSlug="deals"
      title="Сделки и Corporate Actions"
      backHref="/m/deals"
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div className="border-b border-stone-200">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={cn(
                  "pb-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.key
                    ? "border-emerald-500 text-emerald-700"
                    : "border-transparent text-stone-500 hover:text-stone-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'actions' && (
          <DlCorporateActionsTable
            actions={corporateActions as unknown as Array<{ id: string; ticker: string; actionType: string; effectiveDate: string; status: 'planned' | 'announced' | 'processed' | 'cancelled' }>}
            onRowClick={(a) => router.push(`/m/deals/action/${a.id}`)}
            emptyMessage="Нет corporate actions"
          />
        )}

        {activeTab === 'deals' && (
          <DlPrivateDealsTable
            deals={privateDeals as unknown as Array<{ id: string; name: string; dealType: string; stage: 'draft' | 'in_review' | 'approved' | 'executed' | 'closed' }>}
            onRowClick={(d) => router.push(`/m/deals/deal/${d.id}`)}
            emptyMessage="Нет private deals"
          />
        )}

        {activeTab === 'fund_events' && (
          <DlFundEventsTable
            events={fundEvents as unknown as Array<{ id: string; fundName: string; eventType: string; eventDate: string; amount: number; status: 'planned' | 'announced' | 'recorded' | 'paid' | 'cancelled' }>}
            onRowClick={(e) => router.push(`/m/deals/fund-event/${e.id}`)}
            emptyMessage="Нет fund events"
          />
        )}

        {activeTab === 'checklists' && (
          <DlChecklistsTable
            checklists={enrichedChecklists as unknown as Array<{ id: string; name: string; linkedName?: string; linkedType: string; linkedId?: string; completionPct: number }>}
            onRowClick={(c) => {
              if (c.linkedType === 'deal' && c.linkedId) {
                router.push(`/m/deals/deal/${c.linkedId}?tab=checklist`);
              }
            }}
            emptyMessage="Нет checklists"
          />
        )}

        {activeTab === 'approvals' && (
          <DlApprovalsPanel
            approvals={enrichedApprovals as unknown as Array<{ id: string; linkedType: string; linkedName?: string; approverRole: string; status: 'pending' | 'approved' | 'rejected' | 'escalated' | 'expired'; dueAt?: string; requestedByName?: string }>}
            onApprove={(a) => console.log('Approve:', a.id)}
            onReject={(a) => console.log('Reject:', a.id)}
          />
        )}

        {activeTab === 'documents' && (
          <DlDocumentsPanel
            documents={enrichedDocs as unknown as Array<{ id: string; docName: string; docType?: string; linkedName?: string; status: 'missing' | 'requested' | 'received' | 'under_review' | 'approved' | 'rejected' }>}
            onAttach={(d) => console.log('Attach:', d.id)}
            onView={(d) => console.log('View:', d.id)}
          />
        )}

        {activeTab === 'audit' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
            <h3 className="font-semibold text-stone-800 mb-4">Audit Events</h3>
            {dealsAuditEvents.length > 0 ? (
              <div className="space-y-2">
                {dealsAuditEvents.slice(0, 50).map((event: {
                  id: string;
                  ts: string;
                  action: string;
                  summary: string;
                  actorName: string;
                }) => (
                  <div key={event.id} className="flex items-center justify-between p-2 hover:bg-stone-50 rounded-lg">
                    <div>
                      <span className="text-sm text-stone-800">{event.summary}</span>
                      <span className="ml-2 text-xs text-stone-500">{event.actorName}</span>
                    </div>
                    <span className="text-xs text-stone-400">
                      {new Date(event.ts).toLocaleString('ru-RU')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-stone-500 text-center py-4">Нет audit events</p>
            )}
          </div>
        )}
      </div>

      <AuditDrawer
        open={showAudit}
        onClose={() => setShowAudit(false)}
        recordId={null}
      />
    </ModuleList>
  );
}

export default function DealsListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500">Загрузка...</p>
        </div>
      </div>
    }>
      <DealsListContent />
    </Suspense>
  );
}
