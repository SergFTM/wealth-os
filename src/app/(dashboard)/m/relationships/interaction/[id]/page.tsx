"use client";

import { useParams, useRouter } from 'next/navigation';
import { useRecord, useCollection } from '@/lib/hooks';
import { RhInteractionDetail } from '@/modules/53-relationships/ui/RhInteractionDetail';
import type { InteractionDetailData } from '@/modules/53-relationships/ui/RhInteractionDetail';

export default function InteractionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: interaction, loading } = useRecord('relInteractions', id) as { data: any; loading: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: people = [] } = useCollection('mdmPeople') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: households = [] } = useCollection('relHouseholds') as { data: any[] };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!interaction) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Взаимодействие не найдено</p>
        <button onClick={() => router.back()} className="mt-4 text-emerald-600 hover:underline">Назад</button>
      </div>
    );
  }

  const hh = households.find((h: any) => h.id === interaction.householdId);
  const participants = (interaction.participantMdmIdsJson || []).map((pid: string) => {
    const p = people.find((pp: any) => pp.id === pid);
    return { id: pid, name: p?.name || pid };
  });

  const linkedTasks = (interaction.linkedTaskIdsJson || []).map((tid: string) => ({
    id: tid,
    title: tid,
    status: 'open',
  }));

  const interactionData: InteractionDetailData = {
    id: interaction.id,
    interactionTypeKey: interaction.interactionTypeKey,
    occurredAt: interaction.occurredAt,
    summary: interaction.summary,
    notesInternal: interaction.notesInternal,
    clientSafeSnippet: interaction.clientSafeSnippet,
    followUpDueAt: interaction.followUpDueAt,
    statusKey: interaction.statusKey,
    participants,
    householdId: interaction.householdId,
    householdName: hh?.name,
    linkedThread: interaction.linkedThreadId
      ? { id: interaction.linkedThreadId, subject: 'Linked Thread' }
      : undefined,
    linkedCase: interaction.linkedCaseId
      ? { id: interaction.linkedCaseId, title: 'Linked Case' }
      : undefined,
    linkedTasks,
    createdByUser: interaction.createdByUserId
      ? { id: interaction.createdByUserId, name: interaction.createdByUserId }
      : undefined,
    createdAt: interaction.createdAt,
    updatedAt: interaction.updatedAt,
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          onClick={() => router.push('/m/relationships/list?tab=interactions')}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Взаимодействия
        </button>
      </div>

      <RhInteractionDetail
        interaction={interactionData}
        onParticipantClick={(pid) => router.push(`/m/relationships/person/${pid}`)}
        onHouseholdClick={() => {
          if (interaction.householdId) router.push(`/m/relationships/household/${interaction.householdId}`);
        }}
        onClose={() => console.log('Close interaction')}
        onSetFollowUp={() => console.log('Set follow-up')}
        onCreateTask={() => console.log('Create task')}
        onLinkCase={() => console.log('Link case')}
        onPublishSnippet={() => console.log('Publish snippet')}
      />
    </div>
  );
}
