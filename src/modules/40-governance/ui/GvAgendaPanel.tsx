"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { GvStatusPill } from './GvStatusPill';
import { cn } from '@/lib/utils';

interface AgendaItem {
  id: string;
  title: string;
  description?: string;
  orderIndex: number;
  status: 'planned' | 'discussed' | 'deferred' | 'tabled';
  ownerUserId?: string;
  ownerName?: string;
  durationMinutes?: number;
  decisionId?: string;
}

interface GvAgendaPanelProps {
  items: AgendaItem[];
  meetingStatus?: 'planned' | 'in_progress' | 'closed';
  onAddItem?: () => void;
  onItemClick?: (item: AgendaItem) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onMarkDiscussed?: (item: AgendaItem) => void;
  onCreateDecision?: (item: AgendaItem) => void;
}

export function GvAgendaPanel({
  items,
  meetingStatus = 'planned',
  onAddItem,
  onItemClick,
  onReorder,
  onMarkDiscussed,
  onCreateDecision,
}: GvAgendaPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sortedItems = [...items].sort((a, b) => a.orderIndex - b.orderIndex);
  const totalDuration = items.reduce((sum, item) => sum + (item.durationMinutes || 0), 0);

  const canEdit = meetingStatus !== 'closed';

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
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
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-100 to-amber-100 flex items-center justify-center text-xs font-medium text-emerald-700">
                  {idx + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-stone-800 truncate">{item.title}</h4>
                    {item.decisionId && (
                      <span className="text-emerald-600" title="Связано с решением">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-stone-500">
                    {item.ownerName && <span>{item.ownerName}</span>}
                    {item.durationMinutes && <span>{item.durationMinutes} мин</span>}
                  </div>
                </div>

                <GvStatusPill status={item.status} size="sm" />
              </div>

              {expandedId === item.id && (
                <div className="mt-3 pl-9 space-y-3">
                  {item.description && (
                    <p className="text-sm text-stone-600">{item.description}</p>
                  )}

                  {canEdit && (
                    <div className="flex items-center gap-2">
                      {item.status !== 'discussed' && onMarkDiscussed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkDiscussed(item);
                          }}
                        >
                          Обсудили
                        </Button>
                      )}
                      {!item.decisionId && onCreateDecision && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCreateDecision(item);
                          }}
                        >
                          Создать решение
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
