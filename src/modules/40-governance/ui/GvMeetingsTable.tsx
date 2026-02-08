"use client";

import { DataTable } from '@/components/ui/DataTable';
import { GvStatusPill } from './GvStatusPill';

interface Meeting {
  id: string;
  name: string;
  meetingDateTime: string;
  locationType: string;
  status: 'planned' | 'in_progress' | 'closed';
  participantIdsJson?: string[];
  clientSafeVisible?: boolean;
}

interface GvMeetingsTableProps {
  meetings: Meeting[];
  onRowClick?: (meeting: Meeting) => void;
  emptyMessage?: string;
}

export function GvMeetingsTable({ meetings, onRowClick, emptyMessage }: GvMeetingsTableProps) {
  const columns = [
    {
      key: 'name',
      header: 'Название',
      render: (item: Meeting) => (
        <div className="font-medium text-stone-800">{item.name}</div>
      ),
    },
    {
      key: 'meetingDateTime',
      header: 'Дата',
      render: (item: Meeting) => (
        <span className="text-stone-600">
          {new Date(item.meetingDateTime).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      key: 'locationType',
      header: 'Формат',
      render: (item: Meeting) => {
        const labels: Record<string, string> = {
          virtual: 'Виртуальное',
          in_person: 'Очное',
          hybrid: 'Гибрид',
        };
        return <span className="text-stone-600">{labels[item.locationType] || item.locationType}</span>;
      },
    },
    {
      key: 'status',
      header: 'Статус',
      width: 'w-32',
      render: (item: Meeting) => <GvStatusPill status={item.status} size="sm" />,
    },
    {
      key: 'participants',
      header: 'Участников',
      width: 'w-24',
      render: (item: Meeting) => (
        <span className="text-stone-600">{item.participantIdsJson?.length || 0}</span>
      ),
    },
    {
      key: 'clientSafe',
      header: 'Client-safe',
      width: 'w-24',
      render: (item: Meeting) => (
        item.clientSafeVisible ? (
          <span className="inline-flex items-center text-emerald-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </span>
        ) : (
          <span className="text-stone-400">-</span>
        )
      ),
    },
  ];

  return (
    <DataTable
      data={meetings}
      columns={columns}
      onRowClick={onRowClick}
      emptyMessage={emptyMessage || "Нет заседаний"}
    />
  );
}
