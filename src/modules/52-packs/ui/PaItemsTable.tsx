"use client";

import { useState } from 'react';
import { PaSensitivityPill, PaClientSafeBadge } from './PaStatusPill';

interface PackItem {
  id: string;
  packId: string;
  itemTypeKey: string;
  title: string;
  description?: string;
  include: boolean;
  clientSafe: boolean;
  sensitivityKey: 'low' | 'medium' | 'high';
  orderIndex: number;
  fileSize?: number;
  fileType?: string;
}

interface PaItemsTableProps {
  items: PackItem[];
  editable?: boolean;
  onToggleInclude?: (itemId: string, include: boolean) => void;
  onRemoveItem?: (itemId: string) => void;
  onAddItem?: () => void;
}

const itemTypeLabels: Record<string, { label: string; icon: string }> = {
  document: { label: 'Документ', icon: '📄' },
  export: { label: 'Экспорт', icon: '📊' },
  snapshot: { label: 'Снимок', icon: '📸' },
  cover_letter: { label: 'Cover Letter', icon: '✉️' },
  checklist: { label: 'Чеклист', icon: '✅' },
};

export function PaItemsTable({
  items,
  editable = false,
  onToggleInclude,
  onRemoveItem,
  onAddItem,
}: PaItemsTableProps) {
  const sortedItems = [...items].sort((a, b) => a.orderIndex - b.orderIndex);
  const includedCount = items.filter(i => i.include).length;

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-stone-50 rounded-xl border border-dashed border-stone-300">
        <svg className="w-12 h-12 mx-auto mb-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <p className="font-medium text-stone-600">Нет документов в пакете</p>
        {editable && onAddItem && (
          <button
            onClick={onAddItem}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
          >
            Добавить документ
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-stone-500">
          Включено: {includedCount} из {items.length}
        </div>
        {editable && onAddItem && (
          <button
            onClick={onAddItem}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-sm font-medium"
          >
            + Добавить
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              {editable && <th className="w-12 py-3 px-4"></th>}
              <th className="text-left py-3 px-4 font-medium text-stone-600">Тип</th>
              <th className="text-left py-3 px-4 font-medium text-stone-600">Название</th>
              <th className="text-left py-3 px-4 font-medium text-stone-600">Чувствительность</th>
              <th className="text-left py-3 px-4 font-medium text-stone-600">Client-safe</th>
              {editable && <th className="w-20 py-3 px-4"></th>}
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-stone-100 ${!item.include ? 'opacity-50' : ''}`}
              >
                {editable && (
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={item.include}
                      onChange={(e) => onToggleInclude?.(item.id, e.target.checked)}
                      className="w-4 h-4 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>
                )}
                <td className="py-3 px-4">
                  <span className="flex items-center gap-2">
                    <span>{itemTypeLabels[item.itemTypeKey]?.icon || '📎'}</span>
                    <span className="text-stone-600">{itemTypeLabels[item.itemTypeKey]?.label || item.itemTypeKey}</span>
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-stone-800">{item.title}</div>
                    {item.description && (
                      <div className="text-xs text-stone-500 mt-0.5">{item.description}</div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <PaSensitivityPill level={item.sensitivityKey} />
                </td>
                <td className="py-3 px-4">
                  {item.clientSafe ? (
                    <span className="text-emerald-600">✓</span>
                  ) : (
                    <span className="text-stone-400">—</span>
                  )}
                </td>
                {editable && (
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onRemoveItem?.(item.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Удалить
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function PaItemsSummary({ items }: { items: PackItem[] }) {
  const included = items.filter(i => i.include);
  const byType = included.reduce((acc, item) => {
    acc[item.itemTypeKey] = (acc[item.itemTypeKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const highSensitivity = included.filter(i => i.sensitivityKey === 'high').length;

  return (
    <div className="bg-stone-50 rounded-lg p-4 text-sm">
      <div className="flex flex-wrap gap-4">
        <div>
          <span className="text-stone-500">Всего: </span>
          <span className="font-medium text-stone-800">{included.length}</span>
        </div>
        {Object.entries(byType).map(([type, count]) => (
          <div key={type}>
            <span className="text-stone-500">{itemTypeLabels[type]?.label || type}: </span>
            <span className="font-medium text-stone-800">{count}</span>
          </div>
        ))}
        {highSensitivity > 0 && (
          <div className="text-amber-600">
            <span>⚠️ Высокая чувствительность: {highSensitivity}</span>
          </div>
        )}
      </div>
    </div>
  );
}
