'use client';

import React, { useState } from 'react';
import { PortalEvent, Locale } from '../types';
import { PCard, PCardHeader, PCardBody } from './PCard';
import { PBadge } from './PStatusPill';

interface PCalendarProps {
  events: PortalEvent[];
  locale?: Locale;
}

export function PCalendar({ events, locale = 'ru' }: PCalendarProps) {
  const [view, setView] = useState<'list' | 'month'>('list');
  const [selectedEvent, setSelectedEvent] = useState<PortalEvent | null>(null);

  const labels: Record<string, Record<Locale, string>> = {
    title: { ru: 'Календарь', en: 'Calendar', uk: 'Календар' },
    upcoming: { ru: 'Предстоящие события', en: 'Upcoming Events', uk: 'Найближчі події' },
    noEvents: { ru: 'Нет предстоящих событий', en: 'No upcoming events', uk: 'Немає найближчих подій' },
    today: { ru: 'Сегодня', en: 'Today', uk: 'Сьогодні' },
    tomorrow: { ru: 'Завтра', en: 'Tomorrow', uk: 'Завтра' },
    thisWeek: { ru: 'На этой неделе', en: 'This Week', uk: 'Цього тижня' },
    later: { ru: 'Позже', en: 'Later', uk: 'Пізніше' },
    location: { ru: 'Место', en: 'Location', uk: 'Місце' },
    time: { ru: 'Время', en: 'Time', uk: 'Час' },
    close: { ru: 'Закрыть', en: 'Close', uk: 'Закрити' },
  };

  const eventTypeLabels: Record<string, Record<Locale, string>> = {
    meeting: { ru: 'Встреча', en: 'Meeting', uk: 'Зустріч' },
    call: { ru: 'Звонок', en: 'Call', uk: 'Дзвінок' },
    deadline: { ru: 'Дедлайн', en: 'Deadline', uk: 'Дедлайн' },
    review: { ru: 'Обзор', en: 'Review', uk: 'Огляд' },
    other: { ru: 'Другое', en: 'Other', uk: 'Інше' },
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
      day: 'numeric',
      month: 'short',
    });
  };

  // Group events by time period
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const todayEvents = upcomingEvents.filter(e => {
    const d = new Date(e.date);
    return d >= today && d < tomorrow;
  });

  const tomorrowEvents = upcomingEvents.filter(e => {
    const d = new Date(e.date);
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
    return d >= tomorrow && d < dayAfterTomorrow;
  });

  const thisWeekEvents = upcomingEvents.filter(e => {
    const d = new Date(e.date);
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
    return d >= dayAfterTomorrow && d < nextWeek;
  });

  const laterEvents = upcomingEvents.filter(e => new Date(e.date) >= nextWeek);

  const getEventTypeLabel = (type: string) => {
    return eventTypeLabels[type]?.[locale] || type;
  };

  const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
      meeting: 'from-emerald-400 to-emerald-500',
      call: 'from-blue-400 to-blue-500',
      deadline: 'from-red-400 to-red-500',
      review: 'from-purple-400 to-purple-500',
      other: 'from-slate-400 to-slate-500',
    };
    return colors[type] || colors.other;
  };

  const renderEventCard = (event: PortalEvent) => (
    <PCard key={event.id} hover onClick={() => setSelectedEvent(event)}>
      <div className="p-4 flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getEventColor(event.type)} flex flex-col items-center justify-center text-white flex-shrink-0`}>
          <span className="text-xs font-medium">{formatShortDate(event.date).split(' ')[1]?.slice(0, 3)}</span>
          <span className="text-lg font-bold leading-none">{new Date(event.date).getDate()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-slate-800">{event.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
            {event.time && (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{event.time}</span>
              </>
            )}
            {event.location && (
              <>
                <span>•</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{event.location}</span>
              </>
            )}
          </div>
        </div>
        <PBadge variant="default" size="sm">{getEventTypeLabel(event.type)}</PBadge>
      </div>
    </PCard>
  );

  const renderSection = (title: string, sectionEvents: PortalEvent[]) => {
    if (sectionEvents.length === 0) return null;
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
        <div className="space-y-2">
          {sectionEvents.map(renderEventCard)}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* No events */}
      {upcomingEvents.length === 0 ? (
        <PCard>
          <PCardBody>
            <div className="py-12 text-center">
              <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-slate-400">{labels.noEvents[locale]}</p>
            </div>
          </PCardBody>
        </PCard>
      ) : (
        <div className="space-y-8">
          {renderSection(labels.today[locale], todayEvents)}
          {renderSection(labels.tomorrow[locale], tomorrowEvents)}
          {renderSection(labels.thisWeek[locale], thisWeekEvents)}
          {renderSection(labels.later[locale], laterEvents)}
        </div>
      )}

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedEvent(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6 m-4">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getEventColor(selectedEvent.type)} flex flex-col items-center justify-center text-white`}>
                  <span className="text-xs font-medium">{formatShortDate(selectedEvent.date).split(' ')[1]?.slice(0, 3)}</span>
                  <span className="text-xl font-bold leading-none">{new Date(selectedEvent.date).getDate()}</span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">{selectedEvent.title}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{formatDate(selectedEvent.date)}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {selectedEvent.time && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-slate-400">{labels.time[locale]}</p>
                    <p className="font-medium text-slate-700">{selectedEvent.time}</p>
                  </div>
                </div>
              )}

              {selectedEvent.location && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-slate-400">{labels.location[locale]}</p>
                    <p className="font-medium text-slate-700">{selectedEvent.location}</p>
                  </div>
                </div>
              )}

              {selectedEvent.description && (
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600">{selectedEvent.description}</p>
                </div>
              )}

              <div className="pt-2">
                <PBadge variant="default">{getEventTypeLabel(selectedEvent.type)}</PBadge>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
