"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface DistributionList {
  id: string;
  name: string;
  audience: string;
  contactsCount: number;
}

interface ReportsSharePanelProps {
  isClientSafePublished: boolean;
  distributionLists: DistributionList[];
  selectedListId?: string | null;
  onSelectList?: (listId: string) => void;
  onCreateList?: () => void;
  onPublish?: () => void;
  onUnpublish?: () => void;
  onPreview?: () => void;
  packStatus: string;
  readOnly?: boolean;
}

export function ReportsSharePanel({
  isClientSafePublished,
  distributionLists,
  selectedListId,
  onSelectList,
  onCreateList,
  onPublish,
  onUnpublish,
  onPreview,
  packStatus,
  readOnly = false
}: ReportsSharePanelProps) {
  const [selected, setSelected] = useState(selectedListId || '');
  const canPublish = packStatus === 'approved' && !readOnly;

  const handleSelect = (listId: string) => {
    setSelected(listId);
    onSelectList?.(listId);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <div className="p-4 border-b border-stone-200">
        <h3 className="font-semibold text-stone-800">Публикация и Client-Safe</h3>
      </div>

      <div className="p-4 space-y-4">
        {/* Status */}
        <div className={cn(
          "p-4 rounded-lg border",
          isClientSafePublished
            ? "bg-emerald-50 border-emerald-200"
            : "bg-stone-50 border-stone-200"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-stone-800">
                {isClientSafePublished ? '✓ Опубликован клиенту' : 'Не опубликован'}
              </p>
              <p className="text-xs text-stone-500">
                {isClientSafePublished
                  ? 'Клиент видит client-safe версию'
                  : 'Пакет виден только внутренним пользователям'}
              </p>
            </div>
            {isClientSafePublished && !readOnly && (
              <Button variant="ghost" size="sm" onClick={onUnpublish}>
                Снять публикацию
              </Button>
            )}
          </div>
        </div>

        {/* Distribution list selection */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Список рассылки
          </label>
          <div className="space-y-2">
            {distributionLists.map(list => (
              <div
                key={list.id}
                onClick={() => !readOnly && handleSelect(list.id)}
                className={cn(
                  "p-3 rounded-lg border cursor-pointer transition-colors",
                  selected === list.id
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-stone-200 hover:bg-stone-50",
                  readOnly && "cursor-default"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-stone-800">{list.name}</p>
                    <p className="text-xs text-stone-500">
                      {list.contactsCount} контактов · {list.audience}
                    </p>
                  </div>
                  {selected === list.id && (
                    <span className="text-emerald-600">✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {!readOnly && (
            <Button variant="ghost" size="sm" className="mt-2" onClick={onCreateList}>
              + Создать список
            </Button>
          )}
        </div>

        {/* Preview */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 mb-2">
            ℹ️ Preview показывает, как пакет увидит клиент
          </p>
          <Button variant="secondary" size="sm" onClick={onPreview}>
            Открыть Preview
          </Button>
        </div>

        {/* What is hidden */}
        <div className="p-4 bg-stone-50 rounded-lg">
          <p className="text-xs font-medium text-stone-600 mb-2">
            Скрыто от клиента:
          </p>
          <ul className="text-xs text-stone-500 space-y-1">
            <li>• Секции с visibility=internal</li>
            <li>• Внутренние комментарии и причины issues</li>
            <li>• Технические детали источников и mappings</li>
            <li>• Документы с isShared=false</li>
          </ul>
        </div>

        {/* Publish button */}
        {canPublish && !isClientSafePublished && (
          <Button
            variant="primary"
            className="w-full"
            onClick={onPublish}
            disabled={!selected}
          >
            Опубликовать Client-Safe
          </Button>
        )}
      </div>
    </div>
  );
}
