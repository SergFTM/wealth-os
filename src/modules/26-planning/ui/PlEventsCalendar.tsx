'use client';

/**
 * Planning Events Calendar Component
 * Timeline view of life events
 */

import { useMemo } from 'react';
import { useI18n } from '@/lib/i18n';
import { LifeEvent, LIFE_EVENT_CATEGORIES } from '../schema/lifeEvent';

interface PlEventsCalendarProps {
  events: LifeEvent[];
  lang?: 'ru' | 'en' | 'uk';
  onEventClick?: (id: string) => void;
}

export function PlEventsCalendar({ events, lang: propLang, onEventClick }: PlEventsCalendarProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const headers = {
    year: { ru: 'Год', en: 'Year', uk: 'Рік' },
    noEvents: { ru: 'Нет событий', en: 'No events', uk: 'Немає подій' },
    upcoming: { ru: 'Предстоящие события', en: 'Upcoming Events', uk: 'Майбутні події' },
    past: { ru: 'Прошедшие события', en: 'Past Events', uk: 'Минулі події' },
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount?: number): string => {
    if (!amount) return '';
    return `$${amount.toLocaleString()}`;
  };

  // Group events by year
  const eventsByYear = useMemo(() => {
    const grouped: Record<number, LifeEvent[]> = {};
    events.forEach((event) => {
      const year = new Date(event.eventDate).getFullYear();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(event);
    });

    // Sort years
    const years = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b);

    return { grouped, years };
  }, [events]);

  const currentYear = new Date().getFullYear();

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {headers.noEvents[lang]}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timeline View */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        {eventsByYear.years.map((year) => {
          const yearEvents = eventsByYear.grouped[year];
          const isPast = year < currentYear;
          const isCurrent = year === currentYear;

          return (
            <div key={year} className="relative mb-6">
              {/* Year marker */}
              <div className="flex items-center mb-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isPast
                      ? 'bg-gray-300 text-gray-600'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {year}
                </div>
                <div className={`ml-4 text-sm font-medium ${isPast ? 'text-gray-400' : 'text-gray-700'}`}>
                  {yearEvents.length} {lang === 'ru' ? 'событий' : lang === 'uk' ? 'подій' : 'events'}
                </div>
              </div>

              {/* Events for year */}
              <div className="ml-16 space-y-2">
                {yearEvents
                  .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
                  .map((event) => {
                    const category = LIFE_EVENT_CATEGORIES[event.category];
                    const eventDate = new Date(event.eventDate);
                    const isPastEvent = eventDate < new Date();

                    return (
                      <div
                        key={event.id}
                        onClick={() => onEventClick?.(event.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-shadow hover:shadow-md ${
                          isPastEvent
                            ? 'bg-gray-50 border-gray-200'
                            : 'bg-white border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{category.icon}</span>
                            <div>
                              <div className={`font-medium ${isPastEvent ? 'text-gray-500' : 'text-gray-900'}`}>
                                {event.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(event.eventDate)} • {category.label[lang]}
                              </div>
                            </div>
                          </div>
                          {event.estimatedImpact && (
                            <div className={`text-sm font-medium ${
                              event.estimatedImpact > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {event.estimatedImpact > 0 ? '+' : ''}{formatCurrency(event.estimatedImpact)}
                            </div>
                          )}
                        </div>
                        {event.description && (
                          <div className="mt-2 text-sm text-gray-600">{event.description}</div>
                        )}
                        {event.linkedGoalId && (
                          <div className="mt-2 text-xs text-blue-600">
                            🎯 {lang === 'ru' ? 'Связано с целью' : lang === 'uk' ? "Пов'язано з ціллю" : 'Linked to goal'}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Summary stats component
interface PlEventsStatsProps {
  events: LifeEvent[];
  lang?: 'ru' | 'en' | 'uk';
}

export function PlEventsStats({ events, lang: propLang }: PlEventsStatsProps) {
  const { lang: ctxLang } = useI18n();
  const lang = propLang || ctxLang;

  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.eventDate) > now);
  const totalImpact = upcomingEvents.reduce((sum, e) => sum + (e.estimatedImpact || 0), 0);

  const labels = {
    upcoming: { ru: 'Предстоящих событий', en: 'Upcoming Events', uk: 'Майбутніх подій' },
    totalImpact: { ru: 'Общее влияние', en: 'Total Impact', uk: 'Загальний вплив' },
    nextEvent: { ru: 'Ближайшее событие', en: 'Next Event', uk: 'Найближча подія' },
  };

  const nextEvent = upcomingEvents.sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  )[0];

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
        <div className="text-xs text-blue-600 mb-1">{labels.upcoming[lang]}</div>
        <div className="text-xl font-semibold text-blue-900">{upcomingEvents.length}</div>
      </div>
      <div className={`p-3 rounded-lg ${totalImpact >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
        <div className={`text-xs ${totalImpact >= 0 ? 'text-green-600' : 'text-red-600'} mb-1`}>
          {labels.totalImpact[lang]}
        </div>
        <div className={`text-xl font-semibold ${totalImpact >= 0 ? 'text-green-900' : 'text-red-900'}`}>
          {totalImpact >= 0 ? '+' : ''}${Math.abs(totalImpact).toLocaleString()}
        </div>
      </div>
      <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
        <div className="text-xs text-gray-600 mb-1">{labels.nextEvent[lang]}</div>
        <div className="text-sm font-medium text-gray-900">
          {nextEvent ? (
            <>
              <span className="mr-1">{LIFE_EVENT_CATEGORIES[nextEvent.category].icon}</span>
              {nextEvent.title}
            </>
          ) : '—'}
        </div>
      </div>
    </div>
  );
}
