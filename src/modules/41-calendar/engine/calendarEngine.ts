/**
 * Calendar Engine - CRUD operations and business logic for calendar events
 */

export interface CalendarEvent {
  id: string;
  clientId: string;
  title: string;
  description?: string;
  eventType: 'event' | 'meeting';
  categoryKey: string;
  startAt: string;
  endAt: string;
  timezone: string;
  location?: string;
  videoUrl?: string;
  participantIdsJson: string[];
  participantTypesJson: Array<{
    userId: string;
    name: string;
    role: 'organizer' | 'attendee' | 'optional';
    status: 'pending' | 'accepted' | 'declined' | 'tentative';
  }>;
  tagsJson: string[];
  status: 'planned' | 'done' | 'cancelled';
  clientSafeVisible: boolean;
  linkedGovernanceMeetingId?: string;
  linkedCommitteeMeetingId?: string;
  recurrenceRule?: string;
  reminderMinutes: number;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventData {
  clientId: string;
  title: string;
  description?: string;
  eventType?: 'event' | 'meeting';
  categoryKey?: string;
  startAt: string;
  endAt: string;
  timezone?: string;
  location?: string;
  videoUrl?: string;
  participants?: Array<{ userId: string; name: string; role?: string }>;
  tags?: string[];
  clientSafeVisible?: boolean;
  linkedGovernanceMeetingId?: string;
  linkedCommitteeMeetingId?: string;
  recurrenceRule?: string;
  reminderMinutes?: number;
  createdByUserId: string;
}

export function createEventData(data: CreateEventData): Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    clientId: data.clientId,
    title: data.title,
    description: data.description,
    eventType: data.eventType || 'event',
    categoryKey: data.categoryKey || 'other',
    startAt: data.startAt,
    endAt: data.endAt,
    timezone: data.timezone || 'Europe/Moscow',
    location: data.location,
    videoUrl: data.videoUrl,
    participantIdsJson: data.participants?.map(p => p.userId) || [],
    participantTypesJson: data.participants?.map(p => ({
      userId: p.userId,
      name: p.name,
      role: (p.role as 'organizer' | 'attendee' | 'optional') || 'attendee',
      status: 'pending' as const,
    })) || [],
    tagsJson: data.tags || [],
    status: 'planned',
    clientSafeVisible: data.clientSafeVisible ?? false,
    linkedGovernanceMeetingId: data.linkedGovernanceMeetingId,
    linkedCommitteeMeetingId: data.linkedCommitteeMeetingId,
    recurrenceRule: data.recurrenceRule,
    reminderMinutes: data.reminderMinutes ?? 30,
    createdByUserId: data.createdByUserId,
  };
}

export function markEventDone(event: CalendarEvent): Partial<CalendarEvent> {
  return {
    status: 'done',
    updatedAt: new Date().toISOString(),
  };
}

export function cancelEvent(event: CalendarEvent): Partial<CalendarEvent> {
  return {
    status: 'cancelled',
    updatedAt: new Date().toISOString(),
  };
}

export function addParticipant(
  event: CalendarEvent,
  userId: string,
  name: string,
  role: 'organizer' | 'attendee' | 'optional' = 'attendee'
): Partial<CalendarEvent> {
  const existingIds = new Set(event.participantIdsJson);
  if (existingIds.has(userId)) {
    return {};
  }

  return {
    participantIdsJson: [...event.participantIdsJson, userId],
    participantTypesJson: [
      ...event.participantTypesJson,
      { userId, name, role, status: 'pending' as const },
    ],
    updatedAt: new Date().toISOString(),
  };
}

export function removeParticipant(event: CalendarEvent, userId: string): Partial<CalendarEvent> {
  return {
    participantIdsJson: event.participantIdsJson.filter(id => id !== userId),
    participantTypesJson: event.participantTypesJson.filter(p => p.userId !== userId),
    updatedAt: new Date().toISOString(),
  };
}

export function updateParticipantStatus(
  event: CalendarEvent,
  userId: string,
  status: 'pending' | 'accepted' | 'declined' | 'tentative'
): Partial<CalendarEvent> {
  return {
    participantTypesJson: event.participantTypesJson.map(p =>
      p.userId === userId ? { ...p, status } : p
    ),
    updatedAt: new Date().toISOString(),
  };
}

export function getEventsInRange(
  events: CalendarEvent[],
  startDate: Date,
  endDate: Date
): CalendarEvent[] {
  return events.filter(event => {
    const eventStart = new Date(event.startAt);
    const eventEnd = new Date(event.endAt);
    return eventStart <= endDate && eventEnd >= startDate;
  });
}

export function getEventsForDay(events: CalendarEvent[], date: Date): CalendarEvent[] {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);
  return getEventsInRange(events, dayStart, dayEnd);
}

export function getMeetings(events: CalendarEvent[]): CalendarEvent[] {
  return events.filter(e => e.eventType === 'meeting');
}

export function getEventsByCategory(events: CalendarEvent[], category: string): CalendarEvent[] {
  return events.filter(e => e.categoryKey === category);
}

export function getClientSafeEvents(events: CalendarEvent[]): CalendarEvent[] {
  return events.filter(e => e.clientSafeVisible);
}

export function getUpcomingEvents(events: CalendarEvent[], days: number = 7): CalendarEvent[] {
  const now = new Date();
  const future = new Date();
  future.setDate(future.getDate() + days);
  return getEventsInRange(events, now, future).filter(e => e.status === 'planned');
}

export function getGovernanceLinkedEvents(events: CalendarEvent[]): CalendarEvent[] {
  return events.filter(e => !!e.linkedGovernanceMeetingId);
}

export function getCommitteeLinkedEvents(events: CalendarEvent[]): CalendarEvent[] {
  return events.filter(e => !!e.linkedCommitteeMeetingId);
}

export function formatEventTime(event: CalendarEvent, locale: string = 'ru-RU'): string {
  const start = new Date(event.startAt);
  const end = new Date(event.endAt);

  const dateStr = start.toLocaleDateString(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const timeStr = `${start.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`;

  return `${dateStr}, ${timeStr}`;
}

export function getEventDuration(event: CalendarEvent): number {
  const start = new Date(event.startAt);
  const end = new Date(event.endAt);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
}
