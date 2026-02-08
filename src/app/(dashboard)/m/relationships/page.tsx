"use client";

import { useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';
import { RhDashboardPage } from '@/modules/53-relationships/ui/RhDashboardPage';
import type { RhKpiData } from '@/modules/53-relationships/ui/RhKpiStrip';
import type { VipHouseholdView } from '@/modules/53-relationships/ui/RhVipCockpit';
import type { InteractionRow } from '@/modules/53-relationships/ui/RhInteractionsTable';

export default function RelationshipsDashboardPage() {
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: households = [] } = useCollection('relHouseholds') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: interactions = [] } = useCollection('relInteractions') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: initiatives = [] } = useCollection('relInitiatives') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: coverages = [] } = useCollection('relCoverage') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: vipViews = [] } = useCollection('relVipViews') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: people = [] } = useCollection('mdmPeople') as { data: any[] };

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Compute KPIs
  const vipHouseholdsCount = households.filter((h: any) => h.tierKey === 'A').length;
  const openInitiativesCount = initiatives.filter((i: any) => i.stageKey !== 'done').length;
  const overdueFollowupsCount = interactions.filter((i: any) =>
    i.statusKey === 'open' && i.followUpDueAt && new Date(i.followUpDueAt) < now
  ).length;
  const coverageGapsCount = coverages.filter((c: any) => c.hasGaps).length;
  const interactions7dCount = interactions.filter((i: any) =>
    new Date(i.occurredAt) >= sevenDaysAgo
  ).length;
  const uniqueRMs = new Set(interactions
    .filter((i: any) => new Date(i.occurredAt) >= sevenDaysAgo)
    .map((i: any) => i.createdByUserId)
  ).size;
  const clientSafeCardsCount = households.filter((h: any) => h.clientSafePublished).length;
  const linkedCasesCount = initiatives.filter((i: any) => i.linkedCaseId).length;

  const kpis: RhKpiData = {
    vipHouseholds: vipHouseholdsCount,
    openInitiatives: openInitiativesCount,
    overdueFollowups: overdueFollowupsCount,
    coverageGaps: coverageGapsCount,
    interactions7d: interactions7dCount,
    topAdvisors: uniqueRMs,
    clientSafeCards: clientSafeCardsCount,
    linkedCases: linkedCasesCount,
  };

  // Build VIP cockpit data
  const vipHouseholdViews: VipHouseholdView[] = households
    .filter((h: any) => h.tierKey === 'A')
    .slice(0, 8)
    .map((h: any) => {
      const vipView = vipViews.find((v: any) => v.householdId === h.id);
      const snapshot = vipView?.snapshotJson || {};
      const hhInteractions = interactions.filter((i: any) => i.householdId === h.id);
      const hhInitiatives = initiatives.filter((i: any) => i.householdId === h.id);
      const overdueCount = hhInteractions.filter((i: any) =>
        i.statusKey === 'open' && i.followUpDueAt && new Date(i.followUpDueAt) < now
      ).length;

      return {
        id: h.id,
        name: h.name,
        tierKey: h.tierKey as 'A' | 'B' | 'C',
        primaryRmName: h.primaryRmUserId,
        openItems: snapshot.openItems || hhInteractions.filter((i: any) => i.statusKey === 'open').length,
        openInitiatives: snapshot.openInitiatives || hhInitiatives.filter((i: any) => i.stageKey !== 'done').length,
        overdueFollowups: snapshot.overdueFollowups || overdueCount,
        pendingApprovals: snapshot.pendingApprovals || 0,
        nextMeeting: snapshot.nextMeeting || undefined,
        nextMeetingTitle: undefined,
        alerts: snapshot.alerts || [],
        clientSafePublished: h.clientSafePublished || false,
      };
    });

  // Build overdue follow-ups
  const overdueInteractions: InteractionRow[] = interactions
    .filter((i: any) => i.statusKey === 'open' && i.followUpDueAt && new Date(i.followUpDueAt) < now)
    .sort((a: any, b: any) => new Date(a.followUpDueAt).getTime() - new Date(b.followUpDueAt).getTime())
    .slice(0, 15)
    .map((i: any) => {
      const hh = households.find((h: any) => h.id === i.householdId);
      const participantNames = (i.participantMdmIdsJson || []).map((pid: string) => {
        const person = people.find((p: any) => p.id === pid);
        return person?.name || pid;
      });
      return {
        id: i.id,
        occurredAt: i.occurredAt,
        interactionTypeKey: i.interactionTypeKey,
        summary: i.summary,
        participantNames,
        householdName: hh?.name,
        followUpDueAt: i.followUpDueAt,
        statusKey: i.statusKey,
        hasLinkedCase: !!i.linkedCaseId,
        hasLinkedTasks: (i.linkedTaskIdsJson || []).length > 0,
      };
    });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Relationship Hub</h1>
        <p className="text-sm text-stone-500 mt-1">
          Управление отношениями и коммуникациями MFO
        </p>
      </div>

      <RhDashboardPage
        kpis={kpis}
        vipHouseholds={vipHouseholdViews}
        overdueFollowups={overdueInteractions}
        onCreateInteraction={() => router.push('/m/relationships/list?tab=interactions&create=true')}
        onCreateInitiative={() => router.push('/m/relationships/list?tab=initiatives&create=true')}
        onAssignCoverage={() => router.push('/m/relationships/list?tab=coverage')}
        onPublishClientSafe={() => router.push('/m/relationships/list?tab=vip')}
        onGenerateDemo={() => console.log('Generate demo')}
        onRefreshVip={(id) => console.log('Refresh VIP:', id)}
        onPublishVip={(id) => console.log('Publish VIP:', id)}
        onCreateThread={(id) => console.log('Create thread:', id)}
        onCreateRequest={(id) => console.log('Create request:', id)}
        onCreateVipInitiative={(id) => router.push(`/m/relationships/list?tab=initiatives&householdId=${id}`)}
      />
    </div>
  );
}
