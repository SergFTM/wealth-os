"use client";

import { useApp } from '@/lib/store';
import { Drawer } from '@/components/ui/Drawer';
import { useAuditEvents } from '@/lib/hooks';

interface AuditDrawerProps {
  open: boolean;
  onClose: () => void;
  recordId: string | null;
}

export function AuditDrawer({ open, onClose, recordId }: AuditDrawerProps) {
  const { locale } = useApp();
  const { events, loading } = useAuditEvents(recordId);

  const actionLabels: Record<string, string> = {
    create: 'Создание',
    update: 'Обновление',
    delete: 'Удаление',
    approve: 'Одобрение',
    reject: 'Отклонение',
    view: 'Просмотр',
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={locale === 'ru' ? 'Audit Trail' : 'Audit Trail'}
      width="w-[500px]"
    >
      <div className="space-y-4">
        <p className="text-sm text-stone-500">
          {locale === 'ru' ? 'История изменений' : 'Change history'}
        </p>

        {loading ? (
          <div className="text-center py-8 text-stone-400">Загрузка...</div>
        ) : events.length === 0 ? (
          <div className="text-center py-8 text-stone-400">
            {locale === 'ru' ? 'Нет записей' : 'No records'}
          </div>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="bg-stone-50 rounded-lg p-4 border border-stone-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-stone-800">
                    {actionLabels[event.action] || event.action}
                  </span>
                  <span className="text-xs text-stone-500">
                    {new Date(event.ts).toLocaleString('ru-RU')}
                  </span>
                </div>
                <div className="text-sm text-stone-600">
                  <span className="font-medium">{event.actorName}</span>
                </div>
                <div className="mt-1 text-xs text-stone-500">{event.summary}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
}
