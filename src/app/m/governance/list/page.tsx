"use client";

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ModuleList } from '@/components/templates/ModuleList';
import { useCollection } from '@/lib/hooks';
import { GvMeetingsTable } from '@/modules/40-governance/ui/GvMeetingsTable';
import { GvDecisionsTable } from '@/modules/40-governance/ui/GvDecisionsTable';
import { GvPoliciesTable } from '@/modules/40-governance/ui/GvPoliciesTable';
import { GvActionItemsTable } from '@/modules/40-governance/ui/GvActionItemsTable';
import { GvMinutesTable } from '@/modules/40-governance/ui/GvMinutesTable';
import { GvVotesPanel } from '@/modules/40-governance/ui/GvVotesPanel';
import { cn } from '@/lib/utils';

type TabKey = 'meetings' | 'decisions' | 'votes' | 'policies' | 'actions' | 'minutes';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'meetings', label: 'Заседания' },
  { key: 'decisions', label: 'Решения' },
  { key: 'votes', label: 'Голосования' },
  { key: 'policies', label: 'Политики' },
  { key: 'actions', label: 'Action Items' },
  { key: 'minutes', label: 'Протоколы' },
];

function GovernanceListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>('meetings');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: meetings = [] } = useCollection('gvMeetings') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: decisions = [] } = useCollection('gvDecisions') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: votes = [] } = useCollection('gvVotes') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: policies = [] } = useCollection('gvPolicies') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: actionItems = [] } = useCollection('gvActionItems') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: minutes = [] } = useCollection('gvMinutes') as { data: any[] };

  useEffect(() => {
    const tab = searchParams.get('tab') as TabKey;
    if (tab && tabs.some(t => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    router.push(`/m/governance/list?tab=${tab}`);
  };

  // Enrich data with related info
  const enrichedDecisions = decisions.map((d) => ({
    ...d,
    meetingName: meetings.find((m) => m.id === d.meetingId)?.name,
  }));

  const enrichedMinutes = minutes.map((m) => ({
    ...m,
    meetingName: meetings.find((mt) => mt.id === m.meetingId)?.name,
  }));

  const enrichedActionItems = actionItems.map((a) => ({
    ...a,
    meetingName: meetings.find((m) => m.id === a.meetingId)?.name,
    decisionTitle: decisions.find((d) => d.id === a.decisionId)?.title,
  }));

  const enrichedVotes = votes.map((v) => ({
    ...v,
    decisionTitle: decisions.find((d) => d.id === v.decisionId)?.title,
  }));

  return (
    <ModuleList
      moduleSlug="governance"
      title="Governance"
      backHref="/m/governance"
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
        {activeTab === 'meetings' && (
          <GvMeetingsTable
            meetings={meetings}
            onRowClick={(m: { id: string }) => router.push(`/m/governance/meeting/${m.id}`)}
            emptyMessage="Нет заседаний"
          />
        )}

        {activeTab === 'decisions' && (
          <GvDecisionsTable
            decisions={enrichedDecisions}
            onRowClick={(d: { id: string }) => router.push(`/m/governance/decision/${d.id}`)}
            emptyMessage="Нет решений"
          />
        )}

        {activeTab === 'votes' && (
          <GvVotesPanel
            votes={enrichedVotes}
            onVoteClick={(v: { decisionId?: string }) => {
              if (v.decisionId) {
                router.push(`/m/governance/decision/${v.decisionId}?tab=voting`);
              }
            }}
          />
        )}

        {activeTab === 'policies' && (
          <GvPoliciesTable
            policies={policies}
            onRowClick={(p: { id: string }) => router.push(`/m/governance/policy/${p.id}`)}
            emptyMessage="Нет политик"
          />
        )}

        {activeTab === 'actions' && (
          <GvActionItemsTable
            actionItems={enrichedActionItems}
            onRowClick={(a) => {
              // Could link to meeting or decision
            }}
            emptyMessage="Нет action items"
          />
        )}

        {activeTab === 'minutes' && (
          <GvMinutesTable
            minutes={enrichedMinutes}
            onRowClick={(m: { id: string }) => router.push(`/m/governance/minutes/${m.id}`)}
            emptyMessage="Нет протоколов"
          />
        )}
      </div>
    </ModuleList>
  );
}

export default function GovernanceListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500">Загрузка...</p>
        </div>
      </div>
    }>
      <GovernanceListContent />
    </Suspense>
  );
}
