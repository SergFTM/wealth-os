"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecord, useCollection, useMutateRecord } from '@/lib/hooks';
import { GvMeetingDetail } from '@/modules/40-governance/ui/GvMeetingDetail';
import { Button } from '@/components/ui/Button';

export default function MeetingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.id as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: meeting, isLoading, error } = useRecord('gvMeetings', meetingId) as { data: any; isLoading: boolean; error: unknown };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: agendaItems = [] } = useCollection('gvAgendaItems') as { data: any[] };
  const { mutate: updateMeeting } = useMutateRecord('gvMeetings', meetingId);

  const meetingAgendaItems = agendaItems.filter(
    (item) => item.meetingId === meetingId
  );

  const handleStart = async () => {
    await updateMeeting({ status: 'in_progress' });
  };

  const handleClose = async () => {
    await updateMeeting({ status: 'closed' });
  };

  const handleAddAgenda = () => {
    // Open modal or navigate to add agenda
    router.push(`/m/governance/meeting/${meetingId}?action=add-agenda`);
  };

  const handleCreateDecision = (agendaItem: { id: string; title: string }) => {
    router.push(`/m/governance/list?tab=decisions&action=create&agendaItemId=${agendaItem.id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500 mb-4">Заседание не найдено</p>
          <Link href="/m/governance/list">
            <Button variant="secondary">К списку</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80">
      <div className="border-b border-stone-200/50 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/m/governance/list">
              <Button variant="ghost" className="gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-stone-800">{meeting.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <GvMeetingDetail
          meeting={meeting}
          agendaItems={meetingAgendaItems}
          onStart={meeting.status === 'planned' ? handleStart : undefined}
          onClose={meeting.status === 'in_progress' ? handleClose : undefined}
          onAddAgenda={meeting.status !== 'closed' ? handleAddAgenda : undefined}
          onCreateDecision={handleCreateDecision}
        />
      </div>
    </div>
  );
}
