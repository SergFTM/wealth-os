"use client";

import { useParams, useRouter } from 'next/navigation';
import { useRecord, useCollection } from '@/lib/hooks';
import { RhInitiativeDetail } from '@/modules/53-relationships/ui/RhInitiativeDetail';
import type { InitiativeDetailData } from '@/modules/53-relationships/ui/RhInitiativeDetail';

export default function InitiativeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: initiative, loading } = useRecord('relInitiatives', id) as { data: any; loading: boolean };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: households = [] } = useCollection('relHouseholds') as { data: any[] };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!initiative) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>Инициатива не найдена</p>
        <button onClick={() => router.back()} className="mt-4 text-emerald-600 hover:underline">Назад</button>
      </div>
    );
  }

  const hh = households.find((h: any) => h.id === initiative.householdId);

  const linkedTasks = (initiative.linkedTaskIdsJson || []).map((tid: string) => ({
    id: tid,
    title: tid,
    status: 'open',
  }));

  const attachments = (initiative.attachmentsDocIdsJson || []).map((docId: string) => ({
    id: docId,
    name: docId,
    type: 'document',
  }));

  const initiativeData: InitiativeDetailData = {
    id: initiative.id,
    title: initiative.title,
    description: initiative.description,
    stageKey: initiative.stageKey,
    ownerUser: {
      id: initiative.ownerUserId,
      name: initiative.ownerUserId,
    },
    household: {
      id: initiative.householdId,
      name: hh?.name || initiative.householdId,
    },
    dueAt: initiative.dueAt,
    successCriteria: initiative.successCriteria,
    linkedCase: initiative.linkedCaseId
      ? { id: initiative.linkedCaseId, title: 'Linked Case' }
      : undefined,
    linkedTasks,
    attachments,
    closedAt: initiative.closedAt,
    createdAt: initiative.createdAt,
    updatedAt: initiative.updatedAt,
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <button
          onClick={() => router.push('/m/relationships/list?tab=initiatives')}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Инициативы
        </button>
      </div>

      <RhInitiativeDetail
        initiative={initiativeData}
        onHouseholdClick={() => router.push(`/m/relationships/household/${initiative.householdId}`)}
        onMoveToNextStage={() => console.log('Move to next stage')}
        onLinkCase={() => console.log('Link case')}
        onCreateTask={() => console.log('Create task')}
        onAiSuggestPlan={() => console.log('Suggest plan')}
      />
    </div>
  );
}
