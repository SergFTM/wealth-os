"use client";

import { Calendar, Clock, AlertTriangle, CheckCircle, Bell } from 'lucide-react';

interface CalendarTrigger {
  id: string;
  trustId: string;
  name: string;
  triggerDate: string;
  triggerType: 'review' | 'expiration' | 'reminder';
  status: 'upcoming' | 'done' | 'overdue';
  reminderDays: number[];
  notes: string | null;
}

interface TrCalendarPanelProps {
  triggers: CalendarTrigger[];
  onTriggerClick?: (trigger: CalendarTrigger) => void;
  trustNames?: Record<string, string>;
  showOnlyUpcoming?: boolean;
}

const triggerTypeConfig = {
  review: { label: 'Обзор', color: 'text-blue-600', bg: 'bg-blue-50', borderColor: 'border-blue-200', Icon: Calendar },
  expiration: { label: 'Истечение', color: 'text-amber-600', bg: 'bg-amber-50', borderColor: 'border-amber-200', Icon: Clock },
  reminder: { label: 'Напоминание', color: 'text-purple-600', bg: 'bg-purple-50', borderColor: 'border-purple-200', Icon: Bell },
};

const statusConfig = {
  upcoming: { label: 'Предстоит', color: 'text-blue-600' },
  done: { label: 'Выполнено', color: 'text-emerald-600' },
  overdue: { label: 'Просрочено', color: 'text-red-600' },
};

export function TrCalendarPanel({
  triggers,
  onTriggerClick,
  trustNames = {},
  showOnlyUpcoming = false,
}: TrCalendarPanelProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysUntil = (dateStr: string): number => {
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    const diff = date.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getDaysLabel = (days: number): string => {
    if (days < 0) return `${Math.abs(days)} дн. назад`;
    if (days === 0) return 'Сегодня';
    if (days === 1) return 'Завтра';
    return `Через ${days} дн.`;
  };

  const filteredTriggers = showOnlyUpcoming
    ? triggers.filter(t => t.status === 'upcoming')
    : triggers;

  const sortedTriggers = [...filteredTriggers].sort((a, b) => {
    const daysA = getDaysUntil(a.triggerDate);
    const daysB = getDaysUntil(b.triggerDate);
    return daysA - daysB;
  });

  const groupedByMonth: Record<string, CalendarTrigger[]> = {};
  sortedTriggers.forEach(trigger => {
    const date = new Date(trigger.triggerDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!groupedByMonth[monthKey]) {
      groupedByMonth[monthKey] = [];
    }
    groupedByMonth[monthKey].push(trigger);
  });

  const formatMonth = (monthKey: string): string => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedByMonth).map(([monthKey, monthTriggers]) => (
        <div key={monthKey}>
          <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wider mb-3 capitalize">
            {formatMonth(monthKey)}
          </h3>
          <div className="space-y-2">
            {monthTriggers.map(trigger => {
              const typeConfig = triggerTypeConfig[trigger.triggerType];
              const status = statusConfig[trigger.status];
              const TypeIcon = typeConfig.Icon;
              const daysUntil = getDaysUntil(trigger.triggerDate);
              const isUrgent = daysUntil >= 0 && daysUntil <= 7;
              const isOverdue = daysUntil < 0 && trigger.status !== 'done';

              return (
                <div
                  key={trigger.id}
                  onClick={() => onTriggerClick?.(trigger)}
                  className={`p-4 rounded-xl border ${typeConfig.borderColor} ${typeConfig.bg} cursor-pointer hover:shadow-md transition-all ${
                    isOverdue ? 'ring-2 ring-red-300' : isUrgent ? 'ring-2 ring-amber-300' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg ${typeConfig.bg} border ${typeConfig.borderColor} flex items-center justify-center`}>
                        <TypeIcon className={`w-5 h-5 ${typeConfig.color}`} />
                      </div>
                      <div>
                        <div className="font-semibold text-stone-800">{trigger.name}</div>
                        <div className="text-sm text-stone-600 mt-0.5">
                          {trustNames[trigger.trustId] || trigger.trustId}
                        </div>
                        {trigger.notes && (
                          <div className="text-xs text-stone-500 mt-1 line-clamp-1">{trigger.notes}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-stone-800">
                        {new Date(trigger.triggerDate).toLocaleDateString('ru-RU')}
                      </div>
                      <div className={`text-xs font-medium mt-0.5 ${
                        isOverdue ? 'text-red-600' : isUrgent ? 'text-amber-600' : status.color
                      }`}>
                        {trigger.status === 'done' ? (
                          <span className="flex items-center gap-1 justify-end">
                            <CheckCircle className="w-3 h-3" />
                            Выполнено
                          </span>
                        ) : isOverdue ? (
                          <span className="flex items-center gap-1 justify-end">
                            <AlertTriangle className="w-3 h-3" />
                            Просрочено
                          </span>
                        ) : (
                          getDaysLabel(daysUntil)
                        )}
                      </div>
                    </div>
                  </div>

                  {trigger.status === 'upcoming' && trigger.reminderDays.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-stone-200/50">
                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <Bell className="w-3 h-3" />
                        Напоминания за: {trigger.reminderDays.map(d => `${d} дн.`).join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {sortedTriggers.length === 0 && (
        <div className="p-8 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
          Нет предстоящих событий в календаре
        </div>
      )}
    </div>
  );
}
