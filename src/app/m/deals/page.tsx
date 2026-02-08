"use client";

import { useRouter } from 'next/navigation';
import { ModuleDashboard } from '@/components/templates/ModuleDashboard';
import { useCollection } from '@/lib/hooks';
import { DlKpiStrip } from '@/modules/42-deals/ui/DlKpiStrip';
import { DlActionsBar } from '@/modules/42-deals/ui/DlActionsBar';
import { DlCorporateActionsTable } from '@/modules/42-deals/ui/DlCorporateActionsTable';
import { DlPrivateDealsTable } from '@/modules/42-deals/ui/DlPrivateDealsTable';
import { DlAiPanel } from '@/modules/42-deals/ui/DlAiPanel';
import { aiDealAssistant } from '@/modules/42-deals/engine';

// Local type definitions for filtering/sorting
type ActionData = { id: string; ticker: string; actionType: string; effectiveDate: string; status: string };
type DealData = { id: string; name: string; dealType: string; stage: string; updatedAt: string; taxFlag?: boolean };
type EventData = { id: string; fundName: string; eventType: string; eventDate: string; status: string };
type ChecklistData = { id: string; completionPct: number };
type ApprovalData = { id: string; status: string };
type DocData = { id: string; status: string };

export default function DealsDashboardPage() {
  const router = useRouter();
  const { items: rawCorporateActions = [] } = useCollection('dlCorporateActions');
  const { items: rawPrivateDeals = [] } = useCollection('dlPrivateDeals');
  const { items: rawFundEvents = [] } = useCollection('dlFundEvents');
  const { items: rawChecklists = [] } = useCollection('dlChecklists');
  const { items: rawApprovals = [] } = useCollection('dlApprovals');
  const { items: rawDocs = [] } = useCollection('dlDocs');

  // Cast to typed arrays
  const corporateActions = rawCorporateActions as unknown as ActionData[];
  const privateDeals = rawPrivateDeals as unknown as DealData[];
  const fundEvents = rawFundEvents as unknown as EventData[];
  const checklists = rawChecklists as unknown as ChecklistData[];
  const approvals = rawApprovals as unknown as ApprovalData[];
  const docs = rawDocs as unknown as DocData[];

  // Calculate KPIs
  const now = new Date();
  const in30days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const upcomingActions = corporateActions.filter(
    a => a.status === 'planned' || a.status === 'announced'
  ).length;

  const dealsInReview = privateDeals.filter(
    d => d.stage === 'in_review'
  ).length;

  const approvalsPending = approvals.filter(
    a => a.status === 'pending'
  ).length;

  const checklistsIncomplete = checklists.filter(
    c => c.completionPct < 100
  ).length;

  const fundEventsNext30d = fundEvents.filter(
    e =>
      new Date(e.eventDate) <= in30days &&
      new Date(e.eventDate) >= now &&
      e.status !== 'cancelled'
  ).length;

  const docsMissing = docs.filter(
    d => d.status === 'missing'
  ).length;

  const glPostingsPending = corporateActions.filter(
    a => a.status === 'announced'
  ).length;

  const taxImpactFlagged = privateDeals.filter(
    d => d.taxFlag
  ).length;

  const kpis = {
    upcomingActions,
    dealsInReview,
    approvalsPending,
    checklistsIncomplete,
    fundEventsNext30d,
    docsMissing,
    glPostingsPending,
    taxImpactFlagged,
  };

  // Recent data for tables
  const recentActions = [...corporateActions]
    .sort((a, b) =>
      new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime()
    )
    .slice(0, 5);

  const recentDeals = [...privateDeals]
    .sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  // AI handlers
  const handleSummarizeDealPack = async () => {
    return await aiDealAssistant.summarizeDealPack(
      [],
      { name: 'Demo Deal', type: 'subscription' },
      'ru'
    );
  };

  const handleGenerateChecklist = async () => {
    return await aiDealAssistant.generateChecklistSuggestions('subscription', [], 'ru');
  };

  const handleDraftApprovalMemo = async () => {
    return await aiDealAssistant.draftApprovalMemo(
      { name: 'Demo Deal', type: 'subscription', amount: 1000000 },
      undefined,
      'ru'
    );
  };

  return (
    <ModuleDashboard
      moduleSlug="deals"
      title="Сделки и Corporate Actions"
      subtitle="Корпоративные действия, private deals, события фондов"
    >
      <div className="space-y-6">
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>
              Deal документы информационные. Не является юридической или инвестиционной консультацией.
            </p>
          </div>
        </div>

        {/* KPI Strip */}
        <DlKpiStrip {...kpis} />

        {/* Actions Bar */}
        <DlActionsBar
          onCreateAction={() => router.push('/m/deals/list?tab=actions&action=create')}
          onCreateDeal={() => router.push('/m/deals/list?tab=deals&action=create')}
          onCreateFundEvent={() => router.push('/m/deals/list?tab=fund_events&action=create')}
          onCreateChecklist={() => router.push('/m/deals/list?tab=checklists&action=create')}
          onRequestApproval={() => router.push('/m/deals/list?tab=approvals&action=create')}
          onViewAll={() => router.push('/m/deals/list')}
        />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tables */}
          <div className="lg:col-span-2 space-y-6">
            {/* Corporate Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
              <div className="px-4 py-3 border-b border-stone-200/50 flex items-center justify-between">
                <h3 className="font-semibold text-stone-800">Corporate Actions</h3>
                <button
                  onClick={() => router.push('/m/deals/list?tab=actions')}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  Все →
                </button>
              </div>
              <DlCorporateActionsTable
                actions={recentActions as unknown as Array<{ id: string; ticker: string; actionType: string; effectiveDate: string; status: 'planned' | 'announced' | 'processed' | 'cancelled' }>}
                onRowClick={(a) => router.push(`/m/deals/action/${a.id}`)}
                emptyMessage="Нет corporate actions"
              />
            </div>

            {/* Private Deals */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
              <div className="px-4 py-3 border-b border-stone-200/50 flex items-center justify-between">
                <h3 className="font-semibold text-stone-800">Private Deals</h3>
                <button
                  onClick={() => router.push('/m/deals/list?tab=deals')}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  Все →
                </button>
              </div>
              <DlPrivateDealsTable
                deals={recentDeals as unknown as Array<{ id: string; name: string; dealType: string; stage: 'draft' | 'in_review' | 'approved' | 'executed' | 'closed' }>}
                onRowClick={(d) => router.push(`/m/deals/deal/${d.id}`)}
                emptyMessage="Нет private deals"
              />
            </div>
          </div>

          {/* AI Panel */}
          <div>
            <DlAiPanel
              onSummarizeDealPack={handleSummarizeDealPack}
              onGenerateChecklist={handleGenerateChecklist}
              onDraftApprovalMemo={handleDraftApprovalMemo}
            />
          </div>
        </div>
      </div>
    </ModuleDashboard>
  );
}
