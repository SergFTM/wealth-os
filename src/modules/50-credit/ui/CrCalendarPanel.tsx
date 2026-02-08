"use client";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'payment' | 'covenant_test' | 'maturity' | 'refinancing';
  linkedId?: string;
  linkedType?: string;
}

interface CrCalendarPanelProps {
  events: CalendarEvent[];
  onOpenEvent?: (id: string) => void;
}

const eventTypeConfig: Record<string, { label: string; color: string; icon: string }> = {
  payment: { label: 'Платеж', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '💰' },
  covenant_test: { label: 'Тест ковенанта', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '📋' },
  maturity: { label: 'Погашение', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: '📅' },
  refinancing: { label: 'Рефинансирование', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: '🔄' },
};

export function CrCalendarPanel({ events, onOpenEvent }: CrCalendarPanelProps) {
  const now = new Date();
  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10);

  // Group by month
  const eventsByMonth: Record<string, CalendarEvent[]> = {};
  for (const event of upcomingEvents) {
    const monthKey = new Date(event.date).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    if (!eventsByMonth[monthKey]) {
      eventsByMonth[monthKey] = [];
    }
    eventsByMonth[monthKey].push(event);
  }

  if (upcomingEvents.length === 0) {
    return (
      <div className="p-8 text-center text-stone-400">
        Нет предстоящих событий
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
        <div key={month}>
          <h3 className="text-sm font-semibold text-stone-500 uppercase mb-3">{month}</h3>
          <div className="space-y-2">
            {monthEvents.map((event) => {
              const config = eventTypeConfig[event.type] || eventTypeConfig.payment;
              const daysUntil = Math.floor(
                (new Date(event.date).getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
              );

              return (
                <div
                  key={event.id}
                  onClick={() => onOpenEvent?.(event.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${config.color}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">{config.icon}</span>
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs opacity-75">{config.label}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {new Date(event.date).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                      <div className="text-xs opacity-75">
                        {daysUntil === 0 ? 'сегодня' : daysUntil === 1 ? 'завтра' : `${daysUntil}д`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
