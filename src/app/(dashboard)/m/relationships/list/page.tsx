"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useCollection } from '@/lib/hooks';
import { RhListPage } from '@/modules/53-relationships/ui/RhListPage';
import type { PersonRow } from '@/modules/53-relationships/ui/RhPeopleTable';
import type { HouseholdRow } from '@/modules/53-relationships/ui/RhHouseholdsTable';
import type { RelationshipRow } from '@/modules/53-relationships/ui/RhRelationshipsTable';
import type { InteractionRow } from '@/modules/53-relationships/ui/RhInteractionsTable';
import type { InitiativeRow } from '@/modules/53-relationships/ui/RhInitiativesTable';
import type { CoverageRow } from '@/modules/53-relationships/ui/RhCoverageTable';
import type { VipHouseholdView } from '@/modules/53-relationships/ui/RhVipCockpit';

export default function RelationshipsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'people';

  const [filters, setFilters] = useState({
    search: '',
    roleKey: '',
    tierKey: '',
    statusKey: searchParams.get('status') || '',
    period: searchParams.get('period') || '',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: householdsRaw = [], loading: loadingHH } = useCollection('relHouseholds') as { data: any[]; loading: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: relationshipsRaw = [] } = useCollection('relRelationships') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: interactionsRaw = [] } = useCollection('relInteractions') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: initiativesRaw = [] } = useCollection('relInitiatives') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: coveragesRaw = [] } = useCollection('relCoverage') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: vipViewsRaw = [] } = useCollection('relVipViews') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: peopleRaw = [] } = useCollection('mdmPeople') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: auditRaw = [] } = useCollection('auditEvents') as { data: any[] };

  const now = new Date();

  // Transform people
  const people: PersonRow[] = useMemo(() => {
    return peopleRaw.map((p: any) => {
      const coverage = coveragesRaw.find((c: any) => c.scopeTypeKey === 'person' && c.scopeId === p.id);
      const hh = householdsRaw.find((h: any) => (h.membersMdmIdsJson || []).includes(p.id));
      return {
        id: p.id,
        name: p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim(),
        email: p.email,
        phone: p.phone,
        roleKey: p.roleKey || 'owner',
        tierKey: coverage?.tierKey || hh?.tierKey,
        rmOwnerName: coverage?.primaryUserId || hh?.primaryRmUserId,
        nextInteractionDate: undefined,
        householdId: hh?.id,
        householdName: hh?.name,
      };
    }).filter((p: PersonRow) => {
      if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.tierKey && p.tierKey !== filters.tierKey) return false;
      return true;
    });
  }, [peopleRaw, coveragesRaw, householdsRaw, filters]);

  // Transform households
  const households: HouseholdRow[] = useMemo(() => {
    return householdsRaw.map((h: any) => {
      const openInit = initiativesRaw.filter((i: any) => i.householdId === h.id && i.stageKey !== 'done').length;
      const lastInt = interactionsRaw
        .filter((i: any) => i.householdId === h.id)
        .sort((a: any, b: any) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())[0];
      return {
        id: h.id,
        name: h.name,
        tierKey: h.tierKey as 'A' | 'B' | 'C',
        primaryRmName: h.primaryRmUserId,
        membersCount: (h.membersMdmIdsJson || []).length,
        openInitiatives: openInit,
        clientSafePublished: h.clientSafePublished || false,
        lastInteractionDate: lastInt?.occurredAt,
      };
    }).filter((h: HouseholdRow) => {
      if (filters.search && !h.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.tierKey && h.tierKey !== filters.tierKey) return false;
      return true;
    });
  }, [householdsRaw, initiativesRaw, interactionsRaw, filters]);

  // Transform relationships
  const relationships: RelationshipRow[] = useMemo(() => {
    return relationshipsRaw.map((r: any) => {
      const fromRef = r.fromRefJson || {};
      const toRef = r.toRefJson || {};
      const fromPerson = peopleRaw.find((p: any) => p.id === fromRef.id);
      const toPerson = peopleRaw.find((p: any) => p.id === toRef.id);
      return {
        id: r.id,
        fromName: fromPerson?.name || fromRef.id || '—',
        fromType: fromRef.type || 'person',
        toName: toPerson?.name || toRef.id || '—',
        toType: toRef.type || 'person',
        relationshipTypeKey: r.relationshipTypeKey,
        roleLabel: r.roleLabel,
        effectiveFrom: r.effectiveFrom,
        effectiveTo: r.effectiveTo,
        hasEvidence: (r.evidenceDocIdsJson || []).length > 0,
      };
    }).filter((r: RelationshipRow) => {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        if (!r.fromName.toLowerCase().includes(s) && !r.toName.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [relationshipsRaw, peopleRaw, filters]);

  // Transform interactions
  const interactions: InteractionRow[] = useMemo(() => {
    return interactionsRaw.map((i: any) => {
      const hh = householdsRaw.find((h: any) => h.id === i.householdId);
      const participantNames = (i.participantMdmIdsJson || []).map((pid: string) => {
        const person = peopleRaw.find((p: any) => p.id === pid);
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
    }).filter((i: InteractionRow) => {
      if (filters.search && !i.summary.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.statusKey && i.statusKey !== filters.statusKey) return false;
      return true;
    });
  }, [interactionsRaw, householdsRaw, peopleRaw, filters]);

  // Transform initiatives
  const initiatives: InitiativeRow[] = useMemo(() => {
    return initiativesRaw.map((i: any) => {
      const hh = householdsRaw.find((h: any) => h.id === i.householdId);
      return {
        id: i.id,
        title: i.title,
        householdName: hh?.name || '—',
        ownerName: i.ownerUserId,
        stageKey: i.stageKey,
        dueAt: i.dueAt,
        hasLinkedCase: !!i.linkedCaseId,
        hasLinkedTasks: (i.linkedTaskIdsJson || []).length > 0,
        createdAt: i.createdAt,
      };
    }).filter((i: InitiativeRow) => {
      if (filters.search && !i.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.statusKey === 'open' && i.stageKey === 'done') return false;
      if (filters.statusKey === 'closed' && i.stageKey !== 'done') return false;
      return true;
    });
  }, [initiativesRaw, householdsRaw, filters]);

  // Transform coverages
  const coverages: CoverageRow[] = useMemo(() => {
    return coveragesRaw.map((c: any) => {
      const hh = householdsRaw.find((h: any) => h.id === c.scopeId);
      const person = peopleRaw.find((p: any) => p.id === c.scopeId);
      return {
        id: c.id,
        scopeTypeKey: c.scopeTypeKey as 'household' | 'person',
        scopeName: hh?.name || person?.name || c.scopeId,
        tierKey: c.tierKey as 'A' | 'B' | 'C',
        primaryUserName: c.primaryUserId,
        backupUserName: c.backupUserId,
        specialists: (c.specialistsJson || []).map((s: any) => ({
          roleKey: s.roleKey,
          userName: s.userId,
        })),
        hasGaps: c.hasGaps || false,
        slaNotes: c.slaNotes,
      };
    }).filter((c: CoverageRow) => {
      if (filters.search && !c.scopeName.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.tierKey && c.tierKey !== filters.tierKey) return false;
      return true;
    });
  }, [coveragesRaw, householdsRaw, peopleRaw, filters]);

  // Transform VIP households
  const vipHouseholds: VipHouseholdView[] = useMemo(() => {
    return householdsRaw
      .filter((h: any) => h.tierKey === 'A')
      .map((h: any) => {
        const vipView = vipViewsRaw.find((v: any) => v.householdId === h.id);
        const snapshot = vipView?.snapshotJson || {};
        return {
          id: h.id,
          name: h.name,
          tierKey: h.tierKey as 'A' | 'B' | 'C',
          primaryRmName: h.primaryRmUserId,
          openItems: snapshot.openItems || 0,
          openInitiatives: snapshot.openInitiatives || 0,
          overdueFollowups: snapshot.overdueFollowups || 0,
          pendingApprovals: snapshot.pendingApprovals || 0,
          nextMeeting: snapshot.nextMeeting,
          alerts: snapshot.alerts || [],
          clientSafePublished: h.clientSafePublished || false,
        };
      });
  }, [householdsRaw, vipViewsRaw]);

  // Audit events
  const auditEvents = useMemo(() => {
    return auditRaw
      .filter((e: any) => {
        const relCollections = ['relHouseholds', 'relRelationships', 'relInteractions', 'relInitiatives', 'relCoverage', 'relVipViews'];
        return relCollections.includes(e.collection);
      })
      .sort((a: any, b: any) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
      .slice(0, 100)
      .map((e: any) => ({
        id: e.id,
        ts: e.ts,
        actorName: e.actorName,
        action: e.action,
        collection: e.collection,
        recordId: e.recordId,
        summary: e.summary,
      }));
  }, [auditRaw]);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => router.push('/m/relationships')}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад
        </button>
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Relationships — Список</h1>
          <p className="text-sm text-stone-500 mt-1">Просмотр и управление данными отношений</p>
        </div>
      </div>

      <RhListPage
        initialTab={initialTab}
        people={people}
        households={households}
        relationships={relationships}
        interactions={interactions}
        initiatives={initiatives}
        coverages={coverages}
        vipHouseholds={vipHouseholds}
        auditEvents={auditEvents}
        loading={loadingHH}
        filters={filters}
        onFiltersChange={(f) => setFilters(f as typeof filters)}
        onRefreshVip={(id) => console.log('Refresh VIP:', id)}
        onPublishVip={(id) => console.log('Publish:', id)}
        onCreateThread={(id) => console.log('Thread:', id)}
        onCreateRequest={(id) => console.log('Request:', id)}
        onCreateInitiative={(id) => router.push(`/m/relationships/list?tab=initiatives&householdId=${id}`)}
        onAssignCoverage={(id) => console.log('Assign:', id)}
      />
    </div>
  );
}
