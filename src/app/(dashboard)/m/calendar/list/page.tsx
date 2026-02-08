"use client";

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ModuleList } from '@/components/templates/ModuleList';
import { useCollection } from '@/lib/hooks';
import { CalCalendarView } from '@/modules/41-calendar/ui/CalCalendarView';
import { CalMeetingsTable } from '@/modules/41-calendar/ui/CalMeetingsTable';
import { CalAgendaPanel } from '@/modules/41-calendar/ui/CalAgendaPanel';
import { CalNotesPanel } from '@/modules/41-calendar/ui/CalNotesPanel';
import { CalActionItemsPanel } from '@/modules/41-calendar/ui/CalActionItemsPanel';
import { CalIntegrationsPanel } from '@/modules/41-calendar/ui/CalIntegrationsPanel';
import { cn } from '@/lib/utils';

type TabKey = 'calendar' | 'meetings' | 'agenda' | 'notes' | 'actions' | 'integrations' | 'audit';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'calendar', label: 'Календарь' },
  { key: 'meetings', label: 'Встречи' },
  { key: 'agenda', label: 'Повестка' },
  { key: 'notes', label: 'Заметки' },
  { key: 'actions', label: 'Action Items' },
  { key: 'integrations', label: 'Интеграции' },
  { key: 'audit', label: 'Audit' },
];

function CalendarListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>('calendar');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: events = [] } = useCollection('calendarEvents') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: agendaItems = [] } = useCollection('meetingAgenda') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: notes = [] } = useCollection('meetingNotes') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: actionItems = [] } = useCollection('meetingActionItems') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: integrations = [] } = useCollection('calendarIntegrations') as { data: any[] };

  useEffect(() => {
    const tab = searchParams.get('tab') as TabKey;
    if (tab && tabs.some(t => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    router.push(`/m/calendar/list?tab=${tab}`);
  };

  const meetings = events.filter((e) => e.eventType === 'meeting');

  // Enrich data with related info
  const enrichedAgenda = agendaItems.map((a) => ({
    ...a,
    eventTitle: events.find((e) => e.id === a.eventId)?.title,
  }));

  const enrichedNotes = notes.map((n) => ({
    ...n,
    eventTitle: events.find((e) => e.id === n.eventId)?.title,
  }));

  const enrichedActions = actionItems.map((a) => ({
    ...a,
    eventTitle: events.find((e) => e.id === a.eventId)?.title,
  }));

  return (
    <ModuleList
      moduleSlug="calendar"
      title="Календарь"
      backHref="/m/calendar"
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
        {activeTab === 'calendar' && (
          <CalCalendarView
            events={events}
            onEventClick={(e) => router.push(`/m/calendar/event/${e.id}`)}
          />
        )}

        {activeTab === 'meetings' && (
          <CalMeetingsTable
            meetings={meetings}
            onRowClick={(m) => router.push(`/m/calendar/event/${m.id}`)}
            emptyMessage="Нет встреч"
          />
        )}

        {activeTab === 'agenda' && (
          <div className="space-y-4">
            {/* Group agenda by event */}
            {Array.from(new Set(enrichedAgenda.map((a: { eventId: string }) => a.eventId))).map(eventId => {
              const event = events.find((e: { id: string }) => e.id === eventId);
              const items = enrichedAgenda.filter((a: { eventId: string }) => a.eventId === eventId);

              return (
                <div key={eventId as string}>
                  <h3 className="text-sm font-medium text-stone-600 mb-2">
                    {event?.title || eventId}
                  </h3>
                  <CalAgendaPanel items={items} />
                </div>
              );
            })}
            {enrichedAgenda.length === 0 && (
              <div className="text-center py-12 text-stone-500">
                Нет пунктов повестки
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <CalNotesPanel
            notes={enrichedNotes}
            onNoteClick={(n) => router.push(`/m/calendar/event/${n.eventId}?tab=notes`)}
          />
        )}

        {activeTab === 'actions' && (
          <CalActionItemsPanel
            items={enrichedActions}
            onItemClick={(a) => router.push(`/m/calendar/event/${a.eventId}?tab=actions`)}
          />
        )}

        {activeTab === 'integrations' && (
          <CalIntegrationsPanel integrations={integrations} />
        )}

        {activeTab === 'audit' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6 text-center text-stone-500">
            <p>Audit trail — см. модуль Audit</p>
          </div>
        )}
      </div>
    </ModuleList>
  );
}

export default function CalendarListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100/80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500">Загрузка...</p>
        </div>
      </div>
    }>
      <CalendarListContent />
    </Suspense>
  );
}
