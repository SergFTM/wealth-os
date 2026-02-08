"use client";

import { useRouter } from 'next/navigation';
import { ModuleDashboard } from '@/components/templates/ModuleDashboard';
import { useCollection } from '@/lib/hooks';
import { CalKpiStrip } from '@/modules/41-calendar/ui/CalKpiStrip';
import { CalActionsBar } from '@/modules/41-calendar/ui/CalActionsBar';
import { CalCalendarMini } from '@/modules/41-calendar/ui/CalCalendarView';
import { CalUpcomingMeetings } from '@/modules/41-calendar/ui/CalMeetingsTable';
import { CalAiPanel } from '@/modules/41-calendar/ui/CalAiPanel';

export default function CalendarDashboardPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: events = [] } = useCollection('calendarEvents') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: actionItems = [] } = useCollection('meetingActionItems') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: notes = [] } = useCollection('meetingNotes') as { data: any[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: integrations = [] } = useCollection('calendarIntegrations') as { data: any[] };

  // Calculate KPIs
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const in7Days = new Date(today);
  in7Days.setDate(in7Days.getDate() + 7);
  const in30Days = new Date(today);
  in30Days.setDate(in30Days.getDate() + 30);

  const eventsToday = events.filter((e) => {
    const start = new Date(e.startAt);
    return start >= today && start < tomorrow && e.status !== 'cancelled';
  }).length;

  const upcoming7d = events.filter((e) => {
    const start = new Date(e.startAt);
    return start >= now && start < in7Days && e.status === 'planned';
  }).length;

  const clientMeetings30d = events.filter((e) => {
    const start = new Date(e.startAt);
    return start >= now && start < in30Days && e.eventType === 'meeting' &&
      ['family', 'advisor', 'bank'].includes(e.categoryKey);
  }).length;

  const committeeMeetings = events.filter((e) =>
    e.eventType === 'meeting' && e.linkedCommitteeMeetingId
  ).length;

  const governanceMeetings = events.filter((e) =>
    e.eventType === 'meeting' && e.linkedGovernanceMeetingId
  ).length;

  const actionsDue7d = actionItems.filter((a) => {
    if (!a.dueAt || a.status === 'done') return false;
    const due = new Date(a.dueAt);
    return due >= now && due < in7Days;
  }).length;

  const meetingIds = new Set(events.filter((e) => e.eventType === 'meeting').map((e) => e.id));
  const eventsWithNotes = new Set(notes.map((n) => n.eventId));
  const doneMeetings = events.filter((e) =>
    e.eventType === 'meeting' && e.status === 'done'
  );
  const notesMissing = doneMeetings.filter((m) => !eventsWithNotes.has(m.id)).length;

  const integrationsConfigured = integrations.filter((i) =>
    i.status === 'configured' || i.status === 'connected'
  ).length;

  const kpis = {
    eventsToday,
    upcoming7d,
    clientMeetings30d,
    committeeMeetings,
    governanceMeetings,
    actionsDue7d,
    notesMissing,
    integrationsConfigured,
  };

  // Get meetings for display
  const meetings = events.filter((e) => e.eventType === 'meeting');

  return (
    <ModuleDashboard
      moduleSlug="calendar"
      title="Календарь"
      subtitle="Единый календарь встреч и событий"
    >
      <div className="space-y-6">
        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>
              Календарь в MVP демонстрационный. Для production требуется интеграция Google/Microsoft.
            </p>
          </div>
        </div>

        {/* KPI Strip */}
        <CalKpiStrip kpis={kpis} />

        {/* Actions Bar */}
        <CalActionsBar
          onCreateEvent={() => router.push('/m/calendar/list?tab=calendar&action=create')}
          onCreateMeeting={() => router.push('/m/calendar/list?tab=meetings&action=create')}
          onAddAgenda={() => router.push('/m/calendar/list?tab=agenda&action=create')}
          onAddNote={() => router.push('/m/calendar/list?tab=notes&action=create')}
          onCreateAction={() => router.push('/m/calendar/list?tab=actions&action=create')}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Mini Calendar */}
            <CalCalendarMini events={events} onEventClick={(e) => router.push(`/m/calendar/event/${e.id}`)} />

            {/* Upcoming Meetings */}
            <CalUpcomingMeetings
              meetings={meetings}
              onMeetingClick={(m) => router.push(`/m/calendar/event/${m.id}`)}
            />
          </div>

          {/* AI Panel */}
          <div>
            <CalAiPanel
              onDraftAgenda={async () => ({
                content: '## Черновик повестки\n\n1. Приветствие\n2. Обзор текущих вопросов\n3. Обсуждение\n4. Следующие шаги',
                confidence: 0.75,
                assumptions: ['Стандартная повестка встречи'],
                sources: ['Шаблон по умолчанию'],
              })}
              onSummarizeNotes={async () => ({
                content: '## Резюме\n\nВыберите встречу для суммаризации заметок.',
                confidence: 0.5,
                assumptions: ['Требуются заметки встречи'],
                sources: [],
              })}
              onExtractActions={async () => ({
                content: '## Action Items\n\nВыберите встречу с заметками для извлечения задач.',
                confidence: 0.5,
                assumptions: ['Требуются заметки встречи'],
                sources: [],
              })}
            />
          </div>
        </div>
      </div>
    </ModuleDashboard>
  );
}
