"use client";

import { useApp } from '@/lib/store';
import Link from 'next/link';

interface AuditEvent {
  id: string;
  ts: string;
  actorName: string;
  action: string;
  collection: string;
  summary: string;
}

interface HomeAuditWidgetProps {
  events: AuditEvent[];
  loading?: boolean;
}

export function HomeAuditWidget({ events, loading }: HomeAuditWidgetProps) {
  const { locale } = useApp();

  const actionLabels: Record<string, string> = {
    create: 'создал',
    update: 'обновил',
    delete: 'удалил',
    approve: 'согласовал',
    reject: 'отклонил',
    view: 'просмотрел',
    share: 'поделился',
  };

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <div className="h-4 bg-stone-200 rounded w-32 mb-3 animate-pulse" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 bg-stone-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-stone-800 text-sm">
          {locale === 'ru' ? 'Последние действия' : 'Recent Activity'}
        </h3>
        <Link href="/m/security/list?tab=audit" className="text-xs text-emerald-600 hover:underline">
          {locale === 'ru' ? 'Все' : 'View all'}
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-stone-400 py-4 text-center">
          {locale === 'ru' ? 'Нет событий' : 'No events'}
        </p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {events.slice(0, 10).map((event) => (
            <div key={event.id} className="flex items-start gap-2 text-sm py-2 border-b border-stone-100 last:border-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-stone-700 line-clamp-1">
                  <span className="font-medium">{event.actorName}</span>
                  {' '}
                  <span className="text-stone-500">
                    {locale === 'ru' ? actionLabels[event.action] || event.action : event.action}
                  </span>
                  {' '}
                  <span>{event.summary}</span>
                </p>
                <p className="text-xs text-stone-400">
                  {new Date(event.ts).toLocaleString('ru-RU', {
                    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
