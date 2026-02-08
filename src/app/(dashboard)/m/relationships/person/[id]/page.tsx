"use client";

import { useParams, useRouter } from 'next/navigation';
import { useCollection, useRecord } from '@/lib/hooks';
import { RhPersonDetail } from '@/modules/53-relationships/ui/RhPersonDetail';
import type { PersonDetailData } from '@/modules/53-relationships/ui/RhPersonDetail';
import type { MapNode, MapEdge } from '@/modules/53-relationships/ui/RhRelationshipMap';
import type { TimelineItem } from '@/modules/53-relationships/ui/RhTimeline';

export default function PersonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: person, loading } = useRecord('mdmPeople', id) as { data: any; loading: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: relationships = [] } = useCollection('relRelationships') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: interactions = [] } = useCollection('relInteractions') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: households = [] } = useCollection('relHouseholds') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: coverages = [] } = useCollection('relCoverage') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: people = [] } = useCollection('mdmPeople') as { data: any[] };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!person) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Запись не найдена</p>
        <button onClick={() => router.back()} className="mt-4 text-emerald-600 hover:underline">Назад</button>
      </div>
    );
  }

  const hh = households.find((h: any) => (h.membersMdmIdsJson || []).includes(id));
  const coverage = coverages.find((c: any) => c.scopeTypeKey === 'person' && c.scopeId === id);

  const personData: PersonDetailData = {
    id: person.id,
    name: person.name || `${person.firstName || ''} ${person.lastName || ''}`.trim(),
    email: person.email,
    phone: person.phone,
    roleKey: person.roleKey || 'owner',
    tierKey: coverage?.tierKey || hh?.tierKey,
    householdId: hh?.id,
    householdName: hh?.name,
    rmOwnerName: coverage?.primaryUserId || hh?.primaryRmUserId,
    notes: person.notes,
  };

  // Build relationship map
  const personRels = relationships.filter((r: any) => {
    const fromId = r.fromRefJson?.id;
    const toId = r.toRefJson?.id;
    return fromId === id || toId === id;
  });

  const nodes: MapNode[] = [{ id, type: 'person', label: personData.name }];
  const edges: MapEdge[] = [];

  personRels.forEach((r: any) => {
    const fromId = r.fromRefJson?.id;
    const toId = r.toRefJson?.id;
    const otherId = fromId === id ? toId : fromId;
    const otherType = fromId === id ? r.toRefJson?.type : r.fromRefJson?.type;
    const otherPerson = people.find((p: any) => p.id === otherId);
    const otherHh = households.find((h: any) => h.id === otherId);

    if (!nodes.find(n => n.id === otherId)) {
      nodes.push({
        id: otherId,
        type: otherType || 'person',
        label: otherPerson?.name || otherHh?.name || otherId,
      });
    }
    edges.push({
      from: fromId,
      to: toId,
      type: r.relationshipTypeKey,
      label: r.roleLabel,
    });
  });

  // Build timeline
  const personInteractions = interactions
    .filter((i: any) => (i.participantMdmIdsJson || []).includes(id))
    .sort((a: any, b: any) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
    .slice(0, 20);

  const timeline: TimelineItem[] = personInteractions.map((i: any) => ({
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
          onClick={() => router.push('/m/relationships/list?tab=people')}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Люди
        </button>
      </div>

      <RhPersonDetail
        person={personData}
        relationships={{ nodes, edges }}
        timeline={timeline}
        initiatives={[]}
        documents={[]}
      />
    </div>
  );
}
