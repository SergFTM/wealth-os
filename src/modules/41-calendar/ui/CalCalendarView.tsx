"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { CalCategoryPill } from './CalStatusPill';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  categoryKey: string;
  status: string;
  clientSafeVisible?: boolean;
}

interface CalCalendarViewProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  className?: string;
}

export function CalCalendarView({
  events,
  onEventClick,
  onDateClick,
  className,
}: CalCalendarViewProps) {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekDays = useMemo(() => {
    const days: Date[] = [];
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Start from Monday
    startOfWeek.setDate(startOfWeek.getDate() + diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  }, [currentDate]);

  const getEventsForDay = (date: Date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return events.filter(event => {
      const eventStart = new Date(event.startAt);
      return eventStart >= dayStart && eventStart <= dayEnd;
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      family: 'bg-emerald-100 border-emerald-300 text-emerald-800',
      advisor: 'bg-blue-100 border-blue-300 text-blue-800',
      bank: 'bg-amber-100 border-amber-300 text-amber-800',
      committee: 'bg-purple-100 border-purple-300 text-purple-800',
      governance: 'bg-rose-100 border-rose-300 text-rose-800',
      ops: 'bg-stone-100 border-stone-300 text-stone-800',
    };
    return colors[category] || 'bg-gray-100 border-gray-300 text-gray-800';
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const navigateWeek = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  return (
    <div className={cn("bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50", className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-stone-200/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigateWeek(-1)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <h3 className="font-semibold text-stone-800">
            {weekDays[0].toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigateWeek(1)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Сегодня
          </Button>
          <div className="flex rounded-lg border border-stone-200 overflow-hidden">
            <button
              className={cn(
                "px-3 py-1 text-sm",
                viewMode === 'week'
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-white text-stone-600 hover:bg-stone-50"
              )}
              onClick={() => setViewMode('week')}
            >
              Неделя
            </button>
            <button
              className={cn(
                "px-3 py-1 text-sm",
                viewMode === 'month'
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-white text-stone-600 hover:bg-stone-50"
              )}
              onClick={() => setViewMode('month')}
            >
              Месяц
            </button>
          </div>
        </div>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-7 divide-x divide-stone-100">
        {weekDays.map((day, idx) => (
          <div key={idx} className="min-h-[200px]">
            {/* Day Header */}
            <div
              className={cn(
                "sticky top-0 px-2 py-2 text-center border-b border-stone-100 bg-stone-50/50",
                isToday(day) && "bg-emerald-50"
              )}
              onClick={() => onDateClick?.(day)}
            >
              <p className="text-xs text-stone-500">{dayNames[idx]}</p>
              <p
                className={cn(
                  "text-lg font-semibold",
                  isToday(day) ? "text-emerald-600" : "text-stone-800"
                )}
              >
                {day.getDate()}
              </p>
            </div>

            {/* Events */}
            <div className="p-1 space-y-1">
              {getEventsForDay(day).map(event => (
                <button
                  key={event.id}
                  onClick={() => onEventClick?.(event)}
                  className={cn(
                    "w-full text-left p-1.5 rounded border text-xs transition-colors hover:shadow-sm",
                    getCategoryColor(event.categoryKey),
                    event.status === 'cancelled' && "opacity-50 line-through"
                  )}
                >
                  <p className="font-medium truncate">{event.title}</p>
                  <p className="text-[10px] opacity-75">{formatTime(event.startAt)}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="px-4 py-2 border-t border-stone-100 flex flex-wrap gap-2">
        {['family', 'advisor', 'bank', 'committee', 'governance', 'ops'].map(cat => (
          <CalCategoryPill key={cat} category={cat} size="sm" />
        ))}
      </div>
    </div>
  );
}

// Mini calendar for dashboard
export function CalCalendarMini({
  events,
  onEventClick,
  className,
}: {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}) {
  const today = new Date();
  const nextDays: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() + i);
    nextDays.push(day);
  }

  const getEventsForDay = (date: Date) => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return events.filter(event => {
      const eventStart = new Date(event.startAt);
      return eventStart >= dayStart && eventStart <= dayEnd;
    });
  };

  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

  return (
    <div className={cn("bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4", className)}>
      <h3 className="font-semibold text-stone-800 mb-3">Эта неделя</h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {nextDays.map((day, idx) => {
          const dayEvents = getEventsForDay(day);
          const isToday = idx === 0;

          return (
            <div
              key={idx}
              className={cn(
                "flex-shrink-0 w-20 p-2 rounded-lg border text-center",
                isToday
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-stone-50 border-stone-200"
              )}
            >
              <p className="text-xs text-stone-500">{dayNames[day.getDay()]}</p>
              <p className={cn(
                "text-lg font-semibold",
                isToday ? "text-emerald-600" : "text-stone-800"
              )}>
                {day.getDate()}
              </p>
              <p className={cn(
                "text-xs mt-1",
                dayEvents.length > 0 ? "text-emerald-600 font-medium" : "text-stone-400"
              )}>
                {dayEvents.length} событий
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
