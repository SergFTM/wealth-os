"use client";

import { useApp } from '@/lib/store';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { BaseRecord } from '@/db/storage/storage.types';

interface DetailDrawerProps {
  open: boolean;
  onClose: () => void;
  item: (BaseRecord & Record<string, unknown>) | null;
  columns: Array<{ key: string; header: string; type: string }>;
  onOpenFull: () => void;
}

export function DetailDrawer({ open, onClose, item, columns, onOpenFull }: DetailDrawerProps) {
  const { locale } = useApp();

  if (!item) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={String(item[columns[0]?.key] || `Запись #${item.id}`)}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          {columns.map(col => (
            <div key={col.key}>
              <label className="text-xs text-stone-500 uppercase tracking-wide">{col.header}</label>
              <div className="mt-1">
                {col.type === 'status' || col.type === 'badge' ? (
                  <StatusBadge status={String(item[col.key]) as 'pending' | 'success'} />
                ) : col.type === 'currency' ? (
                  <p className="text-lg font-semibold text-stone-800">${Number(item[col.key] || 0).toLocaleString()}</p>
                ) : (
                  <p className="text-stone-800">{String(item[col.key] || '-')}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2 pt-4 border-t border-stone-200">
          <Button variant="primary" onClick={onOpenFull} className="w-full">
            Открыть карточку
          </Button>
          <Button variant="secondary" onClick={onClose} className="w-full">
            Закрыть
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
