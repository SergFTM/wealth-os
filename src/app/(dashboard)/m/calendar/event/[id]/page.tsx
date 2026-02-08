"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useRecord, useCollection, useMutateRecord } from '@/lib/hooks';
import { CalEventDetail } from '@/modules/41-calendar/ui/CalEventDetail';
import { Button } from '@/components/ui/Button';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: event, isLoading, error } = useRecord('calendarEvents', eventId) as { data: any; isLoading: boolean; error: unknown };
  const { data: agendaItems = [] } = useCollection('meetingAgenda');
  const { data: notes = [] } = useCollection('meetingNotes');
  const { data: actionItems = [] } = useCollection('meetingActionItems');
  const { mutate: updateEvent } = useMutateRecord('calendarEvents', eventId);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventAgenda = (agendaItems as any[]).filter(
    (item) => item.eventId === eventId
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventNotes = (notes as any[]).filter(
    (note) => note.eventId === eventId
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventActions = (actionItems as any[]).filter(
    (action) => action.eventId === eventId
  );

  const handleMarkDone = async () => {
    await updateEvent({ status: 'done' });
  };

  const handleCancel = async () => {
    await updateEvent({ status: 'cancelled' });
  };

  const handleAddAgenda = () => {
    router.push(`/m/calendar/event/${eventId}?action=add-agenda`);
  };

  const handleAddNote = () => {
    router.push(`/m/calendar/event/${eventId}?action=add-note`);
  };

  const handleAddAction = () => {
    router.push(`/m/calendar/event/${eventId}?action=add-action`);
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

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500 mb-4">Событие не найдено</p>
          <Link href="/m/calendar/list">
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
            <Link href="/m/calendar/list">
              <Button variant="ghost" className="gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Назад
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-stone-800">{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <CalEventDetail
          event={event}
          agendaItems={eventAgenda}
          notes={eventNotes}
          actionItems={eventActions}
          onMarkDone={event.status === 'planned' ? handleMarkDone : undefined}
          onCancel={event.status === 'planned' ? handleCancel : undefined}
          onAddAgenda={event.eventType === 'meeting' ? handleAddAgenda : undefined}
          onAddNote={event.eventType === 'meeting' ? handleAddNote : undefined}
          onAddAction={event.eventType === 'meeting' ? handleAddAction : undefined}
        />
      </div>
    </div>
  );
}
