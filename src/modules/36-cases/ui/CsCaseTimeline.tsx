'use client';

import { useCollection } from '@/lib/hooks';
import { useTranslation } from '@/lib/i18n';

interface TimelineEvent {
  id: string;
  caseId: string;
  authorName?: string | null;
  authorRole?: string | null;
  actionType?: string | null;
  visibility: string;
  body: string;
  isSystemGenerated?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CsCaseTimelineProps {
  caseId: string;
  locale?: string;
}

const actionLabels: Record<string, Record<string, string>> = {
  status_change: { ru: 'Изменение статуса', en: 'Status Change', uk: 'Зміна статусу' },
  assignment: { ru: 'Назначение', en: 'Assignment', uk: 'Призначення' },
  escalation: { ru: 'Эскалация', en: 'Escalation', uk: 'Ескалація' },
  sla_breach: { ru: 'Нарушение SLA', en: 'SLA Breach', uk: 'Порушення SLA' },
  link_added: { ru: 'Добавлена связь', en: 'Link Added', uk: 'Додано зв\'язок' },
  task_created: { ru: 'Создана задача', en: 'Task Created', uk: 'Створено задачу' },
};

const actionIcons: Record<string, string> = {
  status_change: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  assignment: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  escalation: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
  sla_breach: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  link_added: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1',
  task_created: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
};

const actionColors: Record<string, string> = {
  status_change: 'bg-blue-100 text-blue-600',
  assignment: 'bg-purple-100 text-purple-600',
  escalation: 'bg-amber-100 text-amber-600',
  sla_breach: 'bg-red-100 text-red-600',
  link_added: 'bg-green-100 text-green-600',
  task_created: 'bg-indigo-100 text-indigo-600',
};

export function CsCaseTimeline({ caseId, locale = 'ru' }: CsCaseTimelineProps) {
  const t = useTranslation();

  const { items: comments = [], loading } = useCollection<TimelineEvent>('caseComments');

  // Filter to this case and only system-generated events
  const events = comments
    .filter(c => c.caseId === caseId && c.isSystemGenerated)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (loading) {
    return (
      <div className="py-8 text-center text-gray-500">
        {t('loading', { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' })}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        {t('noTimelineEvents', { ru: 'Нет событий в истории', en: 'No timeline events', uk: 'Немає подій в історії' })}
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, idx) => {
          const actionType = event.actionType || 'status_change';
          const icon = actionIcons[actionType] || actionIcons.status_change;
          const color = actionColors[actionType] || 'bg-gray-100 text-gray-600';
          const label = actionLabels[actionType]?.[locale] || actionType;

          return (
            <li key={event.id}>
              <div className="relative pb-8">
                {idx !== events.length - 1 && (
                  <span
                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3">
                  <div className={`relative p-2 rounded-full ${color}`}>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d={icon}
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900">{label}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {event.authorName || t('system', { ru: 'Система', en: 'System', uk: 'Система' })}
                        {' · '}
                        {new Date(event.createdAt).toLocaleString(locale)}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      {event.body}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
