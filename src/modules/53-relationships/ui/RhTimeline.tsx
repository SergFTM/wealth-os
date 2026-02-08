"use client";

import React from 'react';
import { RhStatusPill } from './RhStatusPill';

export interface TimelineItem {
  id: string;
  date: string;
  type: 'meeting' | 'call' | 'message' | 'note' | 'initiative' | 'case';
  title: string;
  description?: string;
  status?: string;
  participants?: string[];
}

interface RhTimelineProps {
  items: TimelineItem[];
  maxItems?: number;
  onItemClick?: (item: TimelineItem) => void;
}

const TYPE_ICONS: Record<string, { icon: string; color: string }> = {
  meeting: { icon: '📅', color: 'bg-blue-100 border-blue-300' },
  call: { icon: '📞', color: 'bg-green-100 border-green-300' },
  message: { icon: '💬', color: 'bg-purple-100 border-purple-300' },
  note: { icon: '📝', color: 'bg-gray-100 border-gray-300' },
  initiative: { icon: '🚀', color: 'bg-amber-100 border-amber-300' },
  case: { icon: '📋', color: 'bg-red-100 border-red-300' },
};

export function RhTimeline({ items, maxItems = 10, onItemClick }: RhTimelineProps) {
  const displayItems = items.slice(0, maxItems);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (displayItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Нет записей в истории
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

      <div className="space-y-4">
        {displayItems.map((item, index) => {
          const typeConfig = TYPE_ICONS[item.type] || TYPE_ICONS.note;

          return (
            <div
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className={`
                relative pl-12 pr-4 py-3
                ${onItemClick ? 'cursor-pointer hover:bg-gray-50 rounded-lg transition-colors' : ''}
              `}
            >
              {/* Icon */}
              <div className={`
                absolute left-2 w-7 h-7 rounded-full border-2
                flex items-center justify-center text-sm
                ${typeConfig.color}
              `}>
                {typeConfig.icon}
              </div>

              {/* Content */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs text-gray-500">
                    {formatDate(item.date)} в {formatTime(item.date)}
                  </span>
                  {item.status && (
                    <RhStatusPill status={item.status} size="sm" />
                  )}
                </div>

                <h4 className="font-medium text-gray-900 truncate">
                  {item.title}
                </h4>

                {item.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {item.participants && item.participants.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs text-gray-500">Участники:</span>
                    <span className="text-xs text-gray-700">
                      {item.participants.slice(0, 3).join(', ')}
                      {item.participants.length > 3 && ` +${item.participants.length - 3}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {items.length > maxItems && (
        <div className="mt-4 text-center">
          <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            Показать ещё ({items.length - maxItems})
          </button>
        </div>
      )}
    </div>
  );
}

export default RhTimeline;
