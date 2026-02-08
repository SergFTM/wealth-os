"use client";

import { useParams, useRouter } from 'next/navigation';
import { useCollection, useRecord } from '@/lib/hooks';
import { RhHouseholdDetail } from '@/modules/53-relationships/ui/RhHouseholdDetail';
import type { HouseholdDetailData } from '@/modules/53-relationships/ui/RhHouseholdDetail';
import type { TimelineItem } from '@/modules/53-relationships/ui/RhTimeline';

export default function HouseholdDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: household, loading } = useRecord('relHouseholds', id) as { data: any; loading: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: interactions = [] } = useCollection('relInteractions') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: initiatives = [] } = useCollection('relInitiatives') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: people = [] } = useCollection('mdmPeople') as { data: any[] };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!household) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Домохозяйство не найдено</p>
        <button onClick={() => router.back()} className="mt-4 text-emerald-600 hover:underline">Назад</button>
      </div>
    );
  }

  const members = (household.membersMdmIdsJson || []).map((pid: string) => {
    const person = people.find((p: any) => p.id === pid);
    return {
      id: pid,
      name: person?.name || pid,
      roleKey: person?.roleKey,
    };
  });

  const householdData: HouseholdDetailData = {
    id: household.id,
    name: household.name,
    tierKey: household.tierKey as 'A' | 'B' | 'C',
    primaryRmUserId: household.primaryRmUserId,
    primaryRmName: household.primaryRmUserId,
    members,
    notesInternal: household.notesInternal,
    clientSafeSummary: household.clientSafeSummary,
    clientSafePublished: household.clientSafePublished || false,
    publishedAt: household.publishedAt,
  };

  const hhInteractions = interactions
    .filter((i: any) => i.householdId === id)
    .sort((a: any, b: any) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());

  const openCases = initiatives
    .filter((i: any) => i.householdId === id && i.linkedCaseId)
    .map((i: any) => ({ id: i.linkedCaseId, title: i.title, status: i.stageKey }));

  const openInitiatives = initiatives
    .filter((i: any) => i.householdId === id && i.stageKey !== 'done')
    .map((i: any) => ({ id: i.id, title: i.title, stageKey: i.stageKey }));

  const timeline: TimelineItem[] = hhInteractions.slice(0, 20).map((i: any) => ({
    id: i.id,
    type: i.interactionTypeKey as TimelineItem['type'],
    date: i.occurredAt,
    title: i.summary,
    status: i.statusKey,
    participants: (i.participantMdmIdsJson || []).map((pid: string) => {
      const p = people.find((pp: any) => pp.id === pid);
      return p?.name || pid;
    }),
  }));

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          onClick={() => router.push('/m/relationships/list?tab=households')}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Домохозяйства
        </button>
      </div>

      <RhHouseholdDetail
        household={householdData}
        openCases={openCases}
        openInitiatives={openInitiatives}
        upcomingMeetings={[]}
        timeline={timeline}
        onPublishClientSafe={() => console.log('Publish client safe')}
        onMemberClick={(memberId) => router.push(`/m/relationships/person/${memberId}`)}
        onInitiativeClick={(initId) => router.push(`/m/relationships/initiative/${initId}`)}
      />
    </div>
  );
}
