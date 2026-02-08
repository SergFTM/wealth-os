"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CalStatusPill } from './CalStatusPill';
import { cn } from '@/lib/utils';

interface AgendaItem {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  orderIndex: number;
  status: 'planned' | 'discussed' | 'deferred';
  ownerUserId?: string;
  ownerName?: string;
  durationMinutes?: number;
  linkedDecisionId?: string;
}

interface CalAgendaPanelProps {
  items: AgendaItem[];
  eventStatus?: 'planned' | 'done' | 'cancelled';
  onAddItem?: () => void;
  onItemClick?: (item: AgendaItem) => void;
  onMarkDiscussed?: (item: AgendaItem) => void;
  onMarkDeferred?: (item: AgendaItem) => void;
  className?: string;
}

export function CalAgendaPanel({
  items,
  eventStatus = 'planned',
  onAddItem,
  onItemClick,
  onMarkDiscussed,
  onMarkDeferred,
  className,
}: CalAgendaPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sortedItems = [...items].sort((a, b) => a.orderIndex - b.orderIndex);
  const totalDuration = items.reduce((sum, item) => sum + (item.durationMinutes || 0), 0);
  const canEdit = eventStatus !== 'cancelled';

  return (
    <div className={cn("bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50", className)}>
      <div className="px-4 py-3 border-b border-stone-200/50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-stone-800">Повестка дня</h3>
          <p className="text-xs text-stone-500">
            {items.length} пунктов · ~{totalDuration} мин
          </p>
        </div>
        {canEdit && onAddItem && (
          <Button variant="secondary" size="sm" onClick={onAddItem}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Добавить
          </Button>
        )}
      </div>

      <div className="divide-y divide-stone-100">
        {sortedItems.length === 0 ? (
          <div className="px-4 py-8 text-center text-stone-500">
            <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">Повестка пуста</p>
            {onAddItem && (
              <Button variant="secondary" size="sm" onClick={onAddItem} className="mt-3">
                Добавить пункт
              </Button>
            )}
          </div>
        ) : (
          sortedItems.map((item, idx) => (
            <div
              key={item.id}
              className={cn(
                "px-4 py-3 transition-colors",
                expandedId === item.id ? "bg-stone-50" : "hover:bg-stone-50/50"
              )}
            >
              <div
                className="flex items-start gap-3 cursor-pointer"
                onClick={() => {
                  setExpandedId(expandedId === item.id ? null : item.id);
                  onItemClick?.(item);
                }}
              >
                <span className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                  item.status === 'discussed'
                    ? "bg-emerald-100 text-emerald-700"
                    : item.status === 'deferred'
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gradient-to-br from-emerald-100 to-amber-100 text-emerald-700"
                )}>
                  {item.status === 'discussed' ? '✓' : idx + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={cn(
                      "font-medium text-stone-800 truncate",
                      item.status === 'discussed' && "line-through opacity-60"
                    )}>
                      {item.title}
                    </h4>
                    {item.linkedDecisionId && (
                      <span className="text-purple-600" title="Связано с решением">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-stone-500">
                    {item.ownerName && <span>{item.ownerName}</span>}
                    {item.durationMinutes && <span>{item.durationMinutes} мин</span>}
                  </div>
                </div>

                <CalStatusPill status={item.status} size="sm" />
              </div>

              {expandedId === item.id && (
                <div className="mt-3 pl-9 space-y-3">
                  {item.description && (
                    <p className="text-sm text-stone-600">{item.description}</p>
                  )}

                  {canEdit && item.status === 'planned' && (
                    <div className="flex items-center gap-2">
                      {onMarkDiscussed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkDiscussed(item);
                          }}
                        >
                          <svg className="w-4 h-4 mr-1 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Обсудили
                        </Button>
                      )}
                      {onMarkDeferred && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkDeferred(item);
                          }}
                        >
                          Отложить
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
