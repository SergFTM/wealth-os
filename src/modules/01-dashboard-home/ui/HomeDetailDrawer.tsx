"use client";

import { useApp } from '@/lib/store';
import { useAuditEvents } from '@/lib/hooks';
import { BaseRecord } from '@/db/storage/storage.types';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface DetailItem extends BaseRecord {
  title?: string;
  subject?: string;
  name?: string;
  status?: string;
}

interface HomeDetailDrawerProps {
  open: boolean;
  item: DetailItem | null;
  queueKey: string;
  onClose: () => void;
}

export function HomeDetailDrawer({ open, item, queueKey, onClose }: HomeDetailDrawerProps) {
  const { locale } = useApp();
  const { events: auditEvents, loading: auditLoading } = useAuditEvents(item?.id || null);

  if (!open || !item) return null;

  const displayTitle = item.title || item.subject || item.name || 'Детали';

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-[480px] bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-800">
            {displayTitle}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {item.status && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-500">{locale === 'ru' ? 'Статус:' : 'Status:'}</span>
              <StatusBadge status={item.status as 'pending'} />
            </div>
          )}

          <div className="bg-stone-50 rounded-lg p-4 space-y-3">
            {Object.entries(item)
              .filter(([k]) => !['id', 'createdAt', 'updatedAt'].includes(k))
              .slice(0, 8)
              .map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-stone-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="text-stone-800 font-medium truncate max-w-[200px]">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value ?? '-')}
                  </span>
                </div>
              ))}
          </div>

          <div className="flex gap-2">
            <Button variant="primary" size="sm">
              {locale === 'ru' ? 'Редактировать' : 'Edit'}
            </Button>
            {queueKey === 'approvals' && (
              <>
                <Button variant="secondary" size="sm">
                  {locale === 'ru' ? 'Согласовать' : 'Approve'}
                </Button>
                <Button variant="ghost" size="sm">
                  {locale === 'ru' ? 'Отклонить' : 'Reject'}
                </Button>
              </>
            )}
            {queueKey === 'tasks' && (
              <Button variant="secondary" size="sm">
                {locale === 'ru' ? 'Завершить' : 'Complete'}
              </Button>
            )}
          </div>

          <div className="pt-4 border-t border-stone-200">
            <h3 className="font-semibold text-stone-800 text-sm mb-3">
              {locale === 'ru' ? 'История изменений' : 'Audit Trail'}
            </h3>
            
            {auditLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-8 bg-stone-100 rounded animate-pulse" />
                ))}
              </div>
            ) : auditEvents.length === 0 ? (
              <p className="text-sm text-stone-400">
                {locale === 'ru' ? 'Нет записей' : 'No records'}
              </p>
            ) : (
              <div className="space-y-2">
                {auditEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="text-sm py-2 border-b border-stone-100 last:border-0">
                    <div className="flex justify-between">
                      <span className="font-medium">{event.actorName}</span>
                      <span className="text-stone-400 text-xs">
                        {new Date(event.ts).toLocaleString('ru-RU', { 
                          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-stone-500">{event.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
