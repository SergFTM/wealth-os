"use client";

import { DataTable } from '@/components/ui/DataTable';
import { GvStatusPill } from './GvStatusPill';

interface Minutes {
  id: string;
  meetingId: string;
  meetingName?: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  clientSafePublished?: boolean;
  publishedAt?: string;
  aiMetaJson?: {
    generated?: boolean;
    confidence?: number;
  };
  createdAt?: string;
}

interface GvMinutesTableProps {
  minutes: Minutes[];
  onRowClick?: (minutes: Minutes) => void;
  emptyMessage?: string;
}

export function GvMinutesTable({ minutes, onRowClick, emptyMessage }: GvMinutesTableProps) {
  const columns = [
    {
      key: 'meetingName',
      header: 'Заседание',
      render: (item: Minutes) => (
        <div className="font-medium text-stone-800">
          {item.meetingName || `Meeting #${item.meetingId.slice(-4)}`}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Статус',
      width: 'w-28',
      render: (item: Minutes) => <GvStatusPill status={item.status} size="sm" />,
    },
    {
      key: 'aiGenerated',
      header: 'AI',
      width: 'w-16',
      render: (item: Minutes) => (
        item.aiMetaJson?.generated ? (
          <span
            className="inline-flex items-center text-purple-600"
            title={`AI-generated (confidence: ${((item.aiMetaJson.confidence || 0) * 100).toFixed(0)}%)`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </span>
        ) : (
          <span className="text-stone-400">-</span>
        )
      ),
    },
    {
      key: 'clientSafePublished',
      header: 'Client-safe',
      width: 'w-24',
      render: (item: Minutes) => (
        item.clientSafePublished ? (
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
    {
      key: 'publishedAt',
      header: 'Опубликовано',
      render: (item: Minutes) => (
        <span className="text-stone-600">
          {item.publishedAt
            ? new Date(item.publishedAt).toLocaleDateString('ru-RU')
            : '-'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Создано',
      render: (item: Minutes) => (
        <span className="text-stone-500 text-sm">
          {item.createdAt
            ? new Date(item.createdAt).toLocaleDateString('ru-RU')
            : '-'}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={minutes}
      columns={columns}
      onRowClick={onRowClick}
      emptyMessage={emptyMessage || "Нет протоколов"}
    />
  );
}
