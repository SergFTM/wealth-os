"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { GvStatusPill } from './GvStatusPill';
import { GvAgendaPanel } from './GvAgendaPanel';
import { GvQuorumBadge } from './GvQuorumBadge';
import { cn } from '@/lib/utils';

interface Participant {
  userId: string;
  role: string;
  name?: string;
}

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

interface Meeting {
  id: string;
  name: string;
  meetingDateTime: string;
  locationType: 'virtual' | 'in_person' | 'hybrid';
  locationDetails?: string;
  status: 'planned' | 'in_progress' | 'closed';
  participantRolesJson?: Participant[];
  quorumPct: number;
  clientSafeVisible: boolean;
  threadId?: string;
  notes?: string;
}

interface GvMeetingDetailProps {
  meeting: Meeting;
  agendaItems: AgendaItem[];
  onStart?: () => void;
  onClose?: () => void;
  onAddAgenda?: () => void;
  onCreateDecision?: (agendaItem: AgendaItem) => void;
  onOpenAudit?: () => void;
}

const roleLabels: Record<string, string> = {
  chair: 'Председатель',
  secretary: 'Секретарь',
  member: 'Член совета',
  observer: 'Наблюдатель',
  advisor: 'Советник',
};

const locationLabels: Record<string, string> = {
  virtual: 'Виртуальное',
  in_person: 'Очное',
  hybrid: 'Гибрид',
};

export function GvMeetingDetail({
  meeting,
  agendaItems,
  onStart,
  onClose,
  onAddAgenda,
  onCreateDecision,
  onOpenAudit,
}: GvMeetingDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'agenda' | 'participants'>('overview');

  const participants = meeting.participantRolesJson || [];
  const votingParticipants = participants.filter(p => !['observer', 'advisor'].includes(p.role));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/m/governance/list?tab=meetings">
              <Button variant="ghost" size="sm" className="gap-1 px-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-stone-800">{meeting.name}</h1>
            <GvStatusPill status={meeting.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-stone-500">
            <span>
              {new Date(meeting.meetingDateTime).toLocaleDateString('ru-RU', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span>|</span>
            <span>{locationLabels[meeting.locationType]}</span>
            {meeting.locationDetails && (
              <>
                <span>|</span>
                <span>{meeting.locationDetails}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {meeting.status === 'planned' && onStart && (
            <Button variant="primary" onClick={onStart}>
              Начать заседание
            </Button>
          )}
          {meeting.status === 'in_progress' && onClose && (
            <Button variant="primary" onClick={onClose}>
              Завершить заседание
            </Button>
          )}
          {onOpenAudit && (
            <Button variant="ghost" onClick={onOpenAudit}>
              Audit
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <nav className="flex gap-4">
          {(['overview', 'agenda', 'participants'] as const).map((tab) => (
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
              {tab === 'participants' && `Участники (${participants.length})`}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
                  <p className="text-sm text-stone-500">Участников</p>
                  <p className="text-2xl font-bold text-stone-800">{participants.length}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
                  <p className="text-sm text-stone-500">Голосующих</p>
                  <p className="text-2xl font-bold text-stone-800">{votingParticipants.length}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
                  <p className="text-sm text-stone-500">Пунктов повестки</p>
                  <p className="text-2xl font-bold text-stone-800">{agendaItems.length}</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
                  <p className="text-sm text-stone-500">Кворум</p>
                  <p className="text-2xl font-bold text-stone-800">{meeting.quorumPct}%</p>
                </div>
              </div>

              {meeting.notes && (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
                  <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-2">
                    Заметки
                  </h3>
                  <p className="text-stone-700">{meeting.notes}</p>
                </div>
              )}

              <GvAgendaPanel
                items={agendaItems}
                meetingStatus={meeting.status}
                onAddItem={onAddAgenda}
                onCreateDecision={onCreateDecision}
              />
            </>
          )}

          {activeTab === 'agenda' && (
            <GvAgendaPanel
              items={agendaItems}
              meetingStatus={meeting.status}
              onAddItem={onAddAgenda}
              onCreateDecision={onCreateDecision}
            />
          )}

          {activeTab === 'participants' && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
              <div className="px-4 py-3 border-b border-stone-200/50">
                <h3 className="font-semibold text-stone-800">Участники</h3>
              </div>
              <div className="divide-y divide-stone-100">
                {participants.map((p, idx) => (
                  <div key={p.userId || idx} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-stone-800">{p.name || p.userId}</p>
                      <p className="text-xs text-stone-500">{roleLabels[p.role] || p.role}</p>
                    </div>
                    {['observer', 'advisor'].includes(p.role) && (
                      <span className="text-xs text-stone-400">Без права голоса</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
            <h3 className="text-sm font-semibold text-stone-600 uppercase tracking-wide mb-3">
              Кворум
            </h3>
            <GvQuorumBadge
              participationPct={100}
              requiredPct={meeting.quorumPct}
              quorumReached={true}
              showProgress
            />
            <p className="text-xs text-stone-500 mt-2">
              Требуется {meeting.quorumPct}% для принятия решений
            </p>
          </div>

          {meeting.clientSafeVisible && (
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="font-medium">Client-safe</span>
              </div>
              <p className="text-xs text-emerald-600 mt-1">
                Видимо для членов семьи
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
