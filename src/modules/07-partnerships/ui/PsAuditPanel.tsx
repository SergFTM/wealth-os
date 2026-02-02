"use client";

import { cn } from '@/lib/utils';

interface AuditEvent {
  id: string;
  action: string;
  collection: string;
  recordId: string;
  summary: string;
  actorRole: string;
  actor?: string;
  ts: string;
  scope?: string;
  severity?: 'info' | 'warning' | 'critical';
}

interface PsAuditPanelProps {
  events: AuditEvent[];
  filterCollection?: string;
  filterRecordId?: string;
  title?: string;
  compact?: boolean;
}

const actionLabels: Record<string, string> = {
  create: 'Создано', update: 'Изменено', delete: 'Удалено',
  approve: 'Одобрено', reject: 'Отклонено', post: 'Проведено',
  attach: 'Прикреплено', detach: 'Откреплено', submit: 'Отправлено'
};

const actionColors: Record<string, string> = {
  create: 'bg-emerald-500', update: 'bg-blue-500', delete: 'bg-rose-500',
  approve: 'bg-emerald-600', reject: 'bg-rose-600', post: 'bg-purple-500',
  attach: 'bg-amber-500', detach: 'bg-stone-400', submit: 'bg-blue-400'
};

const severityColors: Record<string, string> = {
  info: 'border-stone-200', warning: 'border-amber-300', critical: 'border-rose-300'
};

export function PsAuditPanel({ events, filterCollection, filterRecordId, title = 'Аудит-лог', compact }: PsAuditPanelProps) {
  let filtered = events;
  if (filterCollection) {
    filtered = filtered.filter(e => e.collection === filterCollection);
  }
  if (filterRecordId) {
    filtered = filtered.filter(e => e.recordId === filterRecordId);
  }
  filtered = filtered.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
      <h3 className="font-semibold text-stone-800 mb-4">{title}</h3>
      {filtered.length === 0 ? (
        <p className="text-stone-500 text-sm text-center py-8">Нет записей аудита</p>
      ) : (
        <div className="space-y-3">
          {filtered.slice(0, compact ? 10 : 50).map(event => (
            <div
              key={event.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border bg-stone-50/50",
                severityColors[event.severity || 'info']
              )}
            >
              <div className={cn("w-2 h-2 rounded-full mt-2 flex-shrink-0", actionColors[event.action] || 'bg-stone-400')} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-stone-800 text-sm">
                    {actionLabels[event.action] || event.action}
                  </span>
                  <span className="text-xs text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                    {event.collection}
                  </span>
                </div>
                <p className="text-sm text-stone-600 mb-1">{event.summary}</p>
                <div className="flex items-center gap-3 text-xs text-stone-400">
                  <span>{event.actorRole}{event.actor ? `: ${event.actor}` : ''}</span>
                  <span>{formatTime(event.ts)}</span>
                  {event.scope && <span className="bg-stone-100 px-1 rounded">{event.scope}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {filtered.length > (compact ? 10 : 50) && (
        <p className="text-xs text-stone-400 text-center mt-4">
          Показано {compact ? 10 : 50} из {filtered.length} записей
        </p>
      )}
    </div>
  );
}
