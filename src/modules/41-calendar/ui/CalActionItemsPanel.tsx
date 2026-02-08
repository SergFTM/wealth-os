"use client";

import { Button } from '@/components/ui/Button';
import { CalStatusPill, CalPriorityPill } from './CalStatusPill';
import { cn } from '@/lib/utils';

interface ActionItem {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  ownerUserId?: string;
  ownerName?: string;
  dueAt?: string;
  status: 'open' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  linkedTaskId?: string;
  source: 'manual' | 'ai_extracted' | 'agenda';
  createdAt: string;
}

interface CalActionItemsPanelProps {
  items: ActionItem[];
  onAddItem?: () => void;
  onItemClick?: (item: ActionItem) => void;
  onMarkDone?: (item: ActionItem) => void;
  onLinkTask?: (item: ActionItem) => void;
  className?: string;
}

export function CalActionItemsPanel({
  items,
  onAddItem,
  onItemClick,
  onMarkDone,
  onLinkTask,
  className,
}: CalActionItemsPanelProps) {
  const openItems = items.filter(i => i.status !== 'done');
  const doneItems = items.filter(i => i.status === 'done');

  const isOverdue = (item: ActionItem) => {
    if (!item.dueAt || item.status === 'done') return false;
    return new Date(item.dueAt) < new Date();
  };

  const isDueSoon = (item: ActionItem, days: number = 3) => {
    if (!item.dueAt || item.status === 'done') return false;
    const due = new Date(item.dueAt);
    const now = new Date();
    const diff = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= days;
  };

  const formatDue = (dateStr?: string) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  };

  const renderItem = (item: ActionItem) => (
    <div
      key={item.id}
      className={cn(
        "px-4 py-3 hover:bg-stone-50/50 transition-colors cursor-pointer",
        isOverdue(item) && "bg-rose-50/50",
        isDueSoon(item) && !isOverdue(item) && "bg-amber-50/50"
      )}
      onClick={() => onItemClick?.(item)}
    >
      <div className="flex items-start gap-3">
        <button
          className={cn(
            "flex-shrink-0 w-5 h-5 rounded border-2 mt-0.5 transition-colors",
            item.status === 'done'
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-stone-300 hover:border-emerald-500"
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (item.status !== 'done' && onMarkDone) {
              onMarkDone(item);
            }
          }}
        >
          {item.status === 'done' && (
            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn(
              "font-medium text-stone-800",
              item.status === 'done' && "line-through opacity-60"
            )}>
              {item.title}
            </span>
            {item.source === 'ai_extracted' && (
              <span className="text-xs px-1.5 py-0.5 rounded bg-purple-100 text-purple-700">
                AI
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs">
            {item.ownerName && (
              <span className="text-stone-500">{item.ownerName}</span>
            )}
            {item.dueAt && (
              <span className={cn(
                isOverdue(item) ? "text-rose-600 font-medium" :
                isDueSoon(item) ? "text-amber-600" : "text-stone-500"
              )}>
                {isOverdue(item) ? '⚠ ' : ''}{formatDue(item.dueAt)}
              </span>
            )}
            <CalPriorityPill priority={item.priority} size="sm" />
          </div>
        </div>

        <div className="flex items-center gap-1">
          <CalStatusPill status={item.status} size="sm" />
          {item.linkedTaskId && (
            <span className="text-blue-600" title="Связано с задачей">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </span>
          )}
          {!item.linkedTaskId && item.status !== 'done' && onLinkTask && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onLinkTask(item);
              }}
              title="Создать задачу"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50", className)}>
      <div className="px-4 py-3 border-b border-stone-200/50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-stone-800">Action Items</h3>
          <p className="text-xs text-stone-500">
            {openItems.length} открытых · {doneItems.length} выполнено
          </p>
        </div>
        {onAddItem && (
          <Button variant="secondary" size="sm" onClick={onAddItem}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Добавить
          </Button>
        )}
      </div>

      <div className="divide-y divide-stone-100">
        {items.length === 0 ? (
          <div className="px-4 py-8 text-center text-stone-500">
            <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">Нет action items</p>
            {onAddItem && (
              <Button variant="secondary" size="sm" onClick={onAddItem} className="mt-3">
                Добавить
              </Button>
            )}
          </div>
        ) : (
          <>
            {openItems.map(renderItem)}
            {doneItems.length > 0 && (
              <>
                <div className="px-4 py-2 bg-stone-50 text-xs text-stone-500 font-medium">
                  Выполнено ({doneItems.length})
                </div>
                {doneItems.map(renderItem)}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
