"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CalStatusPill, CalCategoryPill } from './CalStatusPill';
import { CalParticipantChips, CalTagChips } from './CalTagChips';
import { CalAgendaPanel } from './CalAgendaPanel';
import { CalNotesPanel } from './CalNotesPanel';
import { CalActionItemsPanel } from './CalActionItemsPanel';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  eventType: 'event' | 'meeting';
  categoryKey: string;
  startAt: string;
  endAt: string;
  timezone: string;
  location?: string;
  videoUrl?: string;
  participantTypesJson: Array<{
    userId: string;
    name: string;
    role: string;
    status: string;
  }>;
  tagsJson: string[];
  status: 'planned' | 'done' | 'cancelled';
  clientSafeVisible: boolean;
  linkedGovernanceMeetingId?: string;
  linkedCommitteeMeetingId?: string;
  createdAt: string;
}

interface AgendaItem {
  id: string;
  eventId: string;
  title: string;
  description?: string;
  orderIndex: number;
  status: 'planned' | 'discussed' | 'deferred';
  ownerName?: string;
  durationMinutes?: number;
}

interface MeetingNote {
  id: string;
  eventId: string;
  authorUserId: string;
  authorName?: string;
  bodyMdRu?: string;
  bodyMdEn?: string;
  bodyMdUk?: string;
  status: 'draft' | 'published';
  clientSafePublished: boolean;
  createdAt: string;
  updatedAt: string;
}

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

interface CalEventDetailProps {
  event: CalendarEvent;
  agendaItems?: AgendaItem[];
  notes?: MeetingNote[];
  actionItems?: ActionItem[];
  onMarkDone?: () => void;
  onCancel?: () => void;
  onAddAgenda?: () => void;
  onAddNote?: () => void;
  onAddAction?: () => void;
  onOpenAudit?: () => void;
}

export function CalEventDetail({
  event,
  agendaItems = [],
  notes = [],
  actionItems = [],
  onMarkDone,
  onCancel,
  onAddAgenda,
  onAddNote,
  onAddAction,
  onOpenAudit,
}: CalEventDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'agenda' | 'notes' | 'actions' | 'links'>('overview');

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDuration = () => {
    const start = new Date(event.startAt);
    const end = new Date(event.endAt);
    const minutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes} мин`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} ч ${mins} мин` : `${hours} ч`;
  };

  const tabs = event.eventType === 'meeting'
    ? ['overview', 'agenda', 'notes', 'actions', 'links'] as const
    : ['overview', 'links'] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/m/calendar/list">
              <Button variant="ghost" size="sm" className="gap-1 px-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-stone-800">{event.title}</h1>
            <CalStatusPill status={event.status} />
            <CalCategoryPill category={event.categoryKey} />
          </div>
          <div className="flex items-center gap-4 text-sm text-stone-500">
            <span>{formatDateTime(event.startAt)}</span>
            <span>·</span>
            <span>{getDuration()}</span>
            {event.timezone && event.timezone !== 'Europe/Moscow' && (
              <>
                <span>·</span>
                <span>{event.timezone}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {event.status === 'planned' && onMarkDone && (
            <Button variant="primary" onClick={onMarkDone}>
              Отметить проведённой
            </Button>
          )}
          {event.status === 'planned' && onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Отменить
            </Button>
          )}
          {onOpenAudit && (
            <Button variant="ghost" onClick={onOpenAudit}>
              Audit
            </Button>
          )}
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-3">
        {event.clientSafeVisible && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Client-safe
          </div>
        )}
        {event.linkedGovernanceMeetingId && (
          <Link
            href={`/m/governance/meeting/${event.linkedGovernanceMeetingId}`}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs hover:bg-purple-200"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Governance Meeting
          </Link>
        )}
        {event.linkedCommitteeMeetingId && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            Committee Meeting
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "pb-3 px-1 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab
                  ? "border-emerald-500 text-emerald-700"
                  : "border-transparent text-stone-500 hover:text-stone-700"
              )}
            >
              {tab === 'overview' && 'Обзор'}
              {tab === 'agenda' && `Повестка (${agendaItems.length})`}
              {tab === 'notes' && `Заметки (${notes.length})`}
              {tab === 'actions' && `Actions (${actionItems.length})`}
              {tab === 'links' && 'Связи'}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {event.description && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
                  <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-2">
                    Описание
                  </h3>
                  <p className="text-stone-700">{event.description}</p>
                </div>
              )}

              {(event.location || event.videoUrl) && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
                  <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-2">
                    Место
                  </h3>
                  {event.location && (
                    <p className="text-stone-700 mb-2">{event.location}</p>
                  )}
                  {event.videoUrl && (
                    <a
                      href={event.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Присоединиться к видеозвонку
                    </a>
                  )}
                </div>
              )}

              {event.participantTypesJson.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
                  <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3">
                    Участники
                  </h3>
                  <div className="space-y-2">
                    {event.participantTypesJson.map((p, idx) => (
                      <div key={p.userId || idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-stone-800">{p.name}</span>
                          {p.role === 'organizer' && (
                            <span className="text-xs text-emerald-600">(организатор)</span>
                          )}
                        </div>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          p.status === 'accepted' ? "bg-emerald-100 text-emerald-700" :
                          p.status === 'declined' ? "bg-rose-100 text-rose-700" :
                          p.status === 'tentative' ? "bg-amber-100 text-amber-700" :
                          "bg-stone-100 text-stone-600"
                        )}>
                          {p.status === 'accepted' ? 'Подтвердил' :
                           p.status === 'declined' ? 'Отклонил' :
                           p.status === 'tentative' ? 'Возможно' : 'Ожидает'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'agenda' && (
            <CalAgendaPanel
              items={agendaItems}
              eventStatus={event.status}
              onAddItem={onAddAgenda}
            />
          )}

          {activeTab === 'notes' && (
            <CalNotesPanel
              notes={notes}
              onAddNote={onAddNote}
            />
          )}

          {activeTab === 'actions' && (
            <CalActionItemsPanel
              items={actionItems}
              onAddItem={onAddAction}
            />
          )}

          {activeTab === 'links' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
              <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3">
                Связанные объекты
              </h3>
              <div className="space-y-2">
                {event.linkedGovernanceMeetingId ? (
                  <Link
                    href={`/m/governance/meeting/${event.linkedGovernanceMeetingId}`}
                    className="flex items-center gap-2 p-3 rounded-lg bg-purple-50 border border-purple-200 hover:bg-purple-100"
                  >
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-purple-700">Governance Meeting</span>
                  </Link>
                ) : event.linkedCommitteeMeetingId ? (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-blue-700">Committee Meeting</span>
                  </div>
                ) : (
                  <p className="text-stone-500 text-sm">Нет связанных объектов</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
            <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3">
              Метаданные
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">ID</span>
                <span className="text-stone-800 font-mono">{event.id.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Тип</span>
                <span className="text-stone-800">
                  {event.eventType === 'meeting' ? 'Встреча' : 'Событие'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Создано</span>
                <span className="text-stone-800">
                  {new Date(event.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>
          </div>

          {event.tagsJson.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
              <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3">
                Теги
              </h3>
              <CalTagChips tags={event.tagsJson} maxVisible={10} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
