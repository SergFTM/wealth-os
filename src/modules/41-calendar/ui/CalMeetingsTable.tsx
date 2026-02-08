"use client";

import { DataTable } from '@/components/ui/DataTable';
import { CalStatusPill, CalCategoryPill } from './CalStatusPill';
import { CalParticipantChips } from './CalTagChips';
import { Button } from '@/components/ui/Button';

interface Meeting {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  categoryKey: string;
  participantTypesJson?: Array<{
    userId: string;
    name: string;
    role?: string;
    status?: string;
  }>;
  status: 'planned' | 'done' | 'cancelled';
  linkedGovernanceMeetingId?: string;
  linkedCommitteeMeetingId?: string;
  clientSafeVisible?: boolean;
}

interface CalMeetingsTableProps {
  meetings: Meeting[];
  onRowClick?: (meeting: Meeting) => void;
  onMarkDone?: (meeting: Meeting) => void;
  onAddNotes?: (meeting: Meeting) => void;
  emptyMessage?: string;
}

export function CalMeetingsTable({
  meetings,
  onRowClick,
  onMarkDone,
  onAddNotes,
  emptyMessage = 'Нет встреч',
}: CalMeetingsTableProps) {
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getLinkedModule = (meeting: Meeting) => {
    if (meeting.linkedGovernanceMeetingId) {
      return { type: 'governance', label: 'Governance' };
    }
    if (meeting.linkedCommitteeMeetingId) {
      return { type: 'committee', label: 'Committee' };
    }
    return null;
  };

  const columns = [
    {
      key: 'title',
      header: 'Встреча',
      render: (item: Meeting) => (
        <div>
          <p className="font-medium text-stone-800">{item.title}</p>
          {item.clientSafeVisible && (
            <span className="text-xs text-emerald-600">Client-safe</span>
          )}
        </div>
      ),
    },
    {
      key: 'startAt',
      header: 'Дата/Время',
      width: 'w-36',
      render: (item: Meeting) => (
        <span className="text-stone-600 text-sm">{formatDateTime(item.startAt)}</span>
      ),
    },
    {
      key: 'categoryKey',
      header: 'Категория',
      width: 'w-28',
      render: (item: Meeting) => (
        <CalCategoryPill category={item.categoryKey} size="sm" />
      ),
    },
    {
      key: 'participants',
      header: 'Участники',
      render: (item: Meeting) => (
        <CalParticipantChips
          participants={item.participantTypesJson || []}
          maxVisible={2}
        />
      ),
    },
    {
      key: 'linked',
      header: 'Связь',
      width: 'w-28',
      render: (item: Meeting) => {
        const linked = getLinkedModule(item);
        if (!linked) return <span className="text-stone-400">-</span>;
        return (
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
            {linked.label}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Статус',
      width: 'w-32',
      render: (item: Meeting) => <CalStatusPill status={item.status} size="sm" />,
    },
    {
      key: 'actions',
      header: '',
      width: 'w-24',
      render: (item: Meeting) => (
        <div className="flex items-center gap-1">
          {item.status === 'planned' && onMarkDone && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onMarkDone(item);
              }}
              title="Отметить как проведено"
            >
              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </Button>
          )}
          {onAddNotes && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddNotes(item);
              }}
              title="Добавить заметки"
            >
              <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={meetings}
      columns={columns}
      onRowClick={onRowClick}
      emptyMessage={emptyMessage}
    />
  );
}

// Upcoming meetings list for dashboard
export function CalUpcomingMeetings({
  meetings,
  onMeetingClick,
  className,
}: {
  meetings: Meeting[];
  onMeetingClick?: (meeting: Meeting) => void;
  className?: string;
}) {
  const upcomingMeetings = meetings
    .filter(m => m.status === 'planned' && new Date(m.startAt) >= new Date())
    .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
    .slice(0, 5);

  if (upcomingMeetings.length === 0) {
    return (
      <div className={className}>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <h3 className="font-semibold text-stone-800 mb-3">Ближайшие встречи</h3>
          <p className="text-stone-500 text-sm">Нет запланированных встреч</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50">
        <div className="px-4 py-3 border-b border-stone-100">
          <h3 className="font-semibold text-stone-800">Ближайшие встречи</h3>
        </div>
        <div className="divide-y divide-stone-100">
          {upcomingMeetings.map(meeting => (
            <button
              key={meeting.id}
              onClick={() => onMeetingClick?.(meeting)}
              className="w-full px-4 py-3 text-left hover:bg-stone-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-800 truncate">{meeting.title}</p>
                  <p className="text-sm text-stone-500 mt-0.5">
                    {new Date(meeting.startAt).toLocaleDateString('ru-RU', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <CalCategoryPill category={meeting.categoryKey} size="sm" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
