'use client';

import { cn } from '@/lib/utils';

interface TimelineEvent {
  at: string;
  type: 'created' | 'assigned' | 'severity_changed' | 'status_changed' | 'remediation_updated' | 'comment' | 'escalated' | 'closed' | 'reopened';
  by?: string;
  notes?: string;
}

interface ExTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const eventConfig: Record<string, { label: string; icon: string; color: string }> = {
  created: { label: 'Создано', icon: '●', color: 'text-blue-500' },
  assigned: { label: 'Назначено', icon: '◐', color: 'text-indigo-500' },
  severity_changed: { label: 'Приоритет изменён', icon: '▲', color: 'text-amber-500' },
  status_changed: { label: 'Статус изменён', icon: '◆', color: 'text-teal-500' },
  remediation_updated: { label: 'Шаг устранения', icon: '◇', color: 'text-purple-500' },
  comment: { label: 'Комментарий', icon: '○', color: 'text-stone-500' },
  escalated: { label: 'Эскалировано', icon: '⬆', color: 'text-red-500' },
  closed: { label: 'Закрыто', icon: '✓', color: 'text-emerald-500' },
  reopened: { label: 'Открыто заново', icon: '↻', color: 'text-amber-600' }
};

export function ExTimeline({ events, className }: ExTimelineProps) {
  const sortedEvents = [...events].sort((a, b) =>
    new Date(b.at).getTime() - new Date(a.at).getTime()
  );

  if (events.length === 0) {
    return (
      <div className={cn('text-center text-stone-500 py-4', className)}>
        Нет событий
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {sortedEvents.map((event, index) => {
        const config = eventConfig[event.type] || eventConfig.comment;

        return (
          <div key={index} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={cn('text-lg', config.color)}>{config.icon}</span>
              {index < sortedEvents.length - 1 && (
                <div className="w-px flex-1 bg-stone-200 mt-1" />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium text-stone-900">{config.label}</span>
                <span className="text-xs text-stone-500">{formatDateTime(event.at)}</span>
              </div>
              {event.by && (
                <div className="text-xs text-stone-500 mt-0.5">
                  {event.by}
                </div>
              )}
              {event.notes && (
                <div className="text-sm text-stone-700 mt-1 bg-stone-50 rounded-lg p-2">
                  {event.notes}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default ExTimeline;
