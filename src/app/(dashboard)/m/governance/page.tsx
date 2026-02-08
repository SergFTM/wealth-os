"use client";

import { useRouter } from 'next/navigation';
import { ModuleDashboard } from '@/components/templates/ModuleDashboard';
import { useCollection } from '@/lib/hooks';
import { GvKpiStrip } from '@/modules/40-governance/ui/GvKpiStrip';
import { GvActionsBar } from '@/modules/40-governance/ui/GvActionsBar';
import { GvMeetingsTable } from '@/modules/40-governance/ui/GvMeetingsTable';

export default function GovernanceDashboardPage() {
  const router = useRouter();
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

  // Calculate KPIs
  const upcomingMeetings = meetings.filter((m) =>
    m.status === 'planned' && new Date(m.meetingDateTime) >= new Date()
  ).length;

  const openVotes = votes.filter((v) => v.status === 'open').length;

  const pendingDecisions = decisions.filter((d) =>
    d.status === 'draft' || d.status === 'pending_vote'
  ).length;

  const activePolicies = policies.filter((p) => p.status === 'active').length;

  const openActionItems = actionItems.filter((a) =>
    a.status === 'open' || a.status === 'in_progress'
  ).length;

  const overdueItems = actionItems.filter((a) =>
    (a.status === 'open' || a.status === 'in_progress') &&
    a.dueAt && new Date(a.dueAt) < new Date()
  ).length;

  const draftMinutes = minutes.filter((m) => m.status === 'draft').length;

  // Recent meetings for table
  const recentMeetings = [...meetings]
    .sort((a, b) =>
      new Date(b.meetingDateTime).getTime() - new Date(a.meetingDateTime).getTime()
    )
    .slice(0, 10);

  const handleMeetingClick = (meeting: { id: string }) => {
    router.push(`/m/governance/meeting/${meeting.id}`);
  };

  return (
    <ModuleDashboard
      moduleSlug="governance"
      title="Family Governance"
      subtitle="Управление семейным советом, решениями и политиками"
    >
      <div className="space-y-6">
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>
              Материалы governance носят информационный характер. Раздел Trust не является юридической консультацией.
            </p>
          </div>
        </div>

        {/* KPI Strip */}
        <GvKpiStrip
          upcomingMeetings={upcomingMeetings}
          pendingDecisions={pendingDecisions}
          openVotes={openVotes}
          openActions={openActionItems}
          activePolicies={activePolicies}
          draftedMinutes={draftMinutes}
          clientSafePublished={0}
          quorumIssues={0}
        />

        {/* Actions Bar */}
        <GvActionsBar
          onCreateMeeting={() => router.push('/m/governance/list?tab=meetings&action=create')}
          onCreateDecision={() => router.push('/m/governance/list?tab=decisions&action=create')}
        />

        {/* Recent Meetings Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
          <div className="px-4 py-3 border-b border-stone-200/50">
            <h3 className="font-semibold text-stone-800">Недавние заседания</h3>
          </div>
          <GvMeetingsTable
            meetings={recentMeetings}
            onRowClick={handleMeetingClick}
            emptyMessage="Нет заседаний"
          />
        </div>
      </div>
    </ModuleDashboard>
  );
}
