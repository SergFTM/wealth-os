'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WATCHLIST_TYPES } from '../config';

type Locale = 'ru' | 'en' | 'uk';

interface Watchlist {
  id: string;
  name: string;
  description?: string;
  listType: string;
  ownerUserId: string;
  isShared?: boolean;
  alertsEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WatchlistItem {
  id: string;
  itemType: string;
  itemKey: string;
  itemName?: string;
  notes?: string;
  metadataJson?: {
    lastPrice?: number;
    priceChangePct?: number;
  };
  linkedIdeaId?: string;
}

interface IdWatchlistDetailProps {
  watchlist: Watchlist;
  items: WatchlistItem[];
  locale?: Locale;
  onEdit?: () => void;
  onAddItem?: () => void;
  onRemoveItem?: (id: string) => void;
}

export function IdWatchlistDetail({
  watchlist,
  items,
  locale = 'ru',
  onEdit,
  onAddItem,
  onRemoveItem,
}: IdWatchlistDetailProps) {
  const router = useRouter();

  const getTypeLabel = (key: string) => {
    const config = WATCHLIST_TYPES[key as keyof typeof WATCHLIST_TYPES];
    return config?.[locale] || config?.ru || key;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US',
      { day: '2-digit', month: 'short', year: 'numeric' }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
                {getTypeLabel(watchlist.listType)}
              </span>
              {watchlist.isShared && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                  {locale === 'ru' ? 'Общий' : 'Shared'}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{watchlist.name}</h1>
            {watchlist.description && (
              <p className="text-gray-600 mt-1">{watchlist.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {locale === 'ru' ? 'Редактировать' : 'Edit'}
              </button>
            )}
            {onAddItem && (
              <button
                onClick={onAddItem}
                className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-colors"
              >
                + {locale === 'ru' ? 'Добавить' : 'Add Item'}
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-gray-500">{locale === 'ru' ? 'Элементов:' : 'Items:'}</span>
            <span className="ml-2 font-medium text-gray-900">{items.length}</span>
          </div>
          <div>
            <span className="text-gray-500">{locale === 'ru' ? 'Обновлено:' : 'Updated:'}</span>
            <span className="ml-2 text-gray-900">{formatDate(watchlist.updatedAt)}</span>
          </div>
          {watchlist.alertsEnabled && (
            <div className="flex items-center gap-1 text-emerald-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
              </svg>
              {locale === 'ru' ? 'Алерты включены' : 'Alerts enabled'}
            </div>
          )}
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {locale === 'ru' ? 'Элементы' : 'Items'}
          </h2>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {locale === 'ru' ? 'Список пуст' : 'List is empty'}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  {locale === 'ru' ? 'Название' : 'Name'}
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  {locale === 'ru' ? 'Тип' : 'Type'}
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  {locale === 'ru' ? 'Цена' : 'Price'}
                </th>
                <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  {locale === 'ru' ? 'Изм.' : 'Change'}
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  {locale === 'ru' ? 'Идея' : 'Idea'}
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.itemName || item.itemKey}
                      </div>
                      {item.notes && (
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {item.notes}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-600 capitalize">
                      {item.itemType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {item.metadataJson?.lastPrice ? (
                      <span className="font-mono text-sm text-gray-900">
                        ${item.metadataJson.lastPrice.toLocaleString()}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {item.metadataJson?.priceChangePct !== undefined ? (
                      <span className={`font-mono text-sm ${
                        item.metadataJson.priceChangePct >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.metadataJson.priceChangePct >= 0 ? '+' : ''}
                        {item.metadataJson.priceChangePct.toFixed(2)}%
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {item.linkedIdeaId ? (
                      <button
                        onClick={() => router.push(`/m/ideas/idea/${item.linkedIdeaId}`)}
                        className="text-xs text-emerald-600 hover:text-emerald-700"
                      >
                        {locale === 'ru' ? 'Связана' : 'Linked'}
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {onRemoveItem && (
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default IdWatchlistDetail;
