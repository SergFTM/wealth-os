"use client";

import { Pin, Archive, Eye, MessageSquare, AlertTriangle, CheckCircle, Users, Shield } from 'lucide-react';
import { CmSlaBadge } from './CmSlaBadge';

interface Thread {
  id: string;
  clientId: string;
  title: string;
  threadType: 'request' | 'approval' | 'incident' | 'advisor' | 'client_service';
  status: 'open' | 'escalated' | 'closed' | 'archived';
  scopeType: string;
  scopeId: string;
  clientSafe: boolean;
  slaDueAt: string | null;
  lastMessageAt: string | null;
  unreadCountByUserJson: string;
  linkedRefsJson: string;
  createdAt: string;
}

interface CmInboxTableProps {
  threads: Thread[];
  pinnedThreadIds?: string[];
  currentUserId?: string;
  onRowClick?: (thread: Thread) => void;
  onPin?: (thread: Thread) => void;
  onArchive?: (thread: Thread) => void;
  compact?: boolean;
}

const typeConfig: Record<string, { label: string; color: string; Icon: React.ComponentType<{ className?: string }> }> = {
  request: { label: 'Запрос', color: 'text-blue-600 bg-blue-50', Icon: MessageSquare },
  approval: { label: 'Согласование', color: 'text-purple-600 bg-purple-50', Icon: CheckCircle },
  incident: { label: 'Инцидент', color: 'text-red-600 bg-red-50', Icon: AlertTriangle },
  advisor: { label: 'Консультация', color: 'text-emerald-600 bg-emerald-50', Icon: Users },
  client_service: { label: 'Сервис', color: 'text-amber-600 bg-amber-50', Icon: MessageSquare },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  open: { label: 'Открыт', color: 'text-emerald-600 bg-emerald-50' },
  escalated: { label: 'Эскалирован', color: 'text-red-600 bg-red-50' },
  closed: { label: 'Закрыт', color: 'text-stone-600 bg-stone-100' },
  archived: { label: 'Архив', color: 'text-stone-500 bg-stone-100' },
};

export function CmInboxTable({
  threads,
  pinnedThreadIds = [],
  currentUserId = 'user-rm-001',
  onRowClick,
  onPin,
  onArchive,
  compact = false,
}: CmInboxTableProps) {
  const displayThreads = compact ? threads.slice(0, 10) : threads;

  // Sort: pinned first, then by lastMessageAt
  const sortedThreads = [...displayThreads].sort((a, b) => {
    const aPinned = pinnedThreadIds.includes(a.id);
    const bPinned = pinnedThreadIds.includes(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return new Date(b.lastMessageAt || b.createdAt).getTime() - new Date(a.lastMessageAt || a.createdAt).getTime();
  });

  const formatDate = (date: string | null): string => {
    if (!date) return '—';
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Вчера';
    } else if (diffDays < 7) {
      return d.toLocaleDateString('ru-RU', { weekday: 'short' });
    }
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  };

  const getUnreadCount = (thread: Thread): number => {
    try {
      const unreadMap = JSON.parse(thread.unreadCountByUserJson || '{}');
      return unreadMap[currentUserId] || 0;
    } catch {
      return 0;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="w-8 px-4 py-3"></th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Тема</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Тип</th>
              {!compact && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Scope</th>
              )}
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Последнее</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">SLA</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
              {!compact && (
                <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Действия</th>
              )}
            </tr>
          </thead>
          <tbody>
            {sortedThreads.map((thread) => {
              const isPinned = pinnedThreadIds.includes(thread.id);
              const unreadCount = getUnreadCount(thread);
              const type = typeConfig[thread.threadType] || typeConfig.request;
              const status = statusConfig[thread.status] || statusConfig.open;
              const TypeIcon = type.Icon;

              return (
                <tr
                  key={thread.id}
                  onClick={() => onRowClick?.(thread)}
                  className={`border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors ${
                    isPinned ? 'bg-amber-50/30' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {isPinned && <Pin className="w-3.5 h-3.5 text-amber-500" />}
                      {thread.clientSafe && <Shield className="w-3.5 h-3.5 text-emerald-500" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-medium flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                      <div className={`${unreadCount > 0 ? 'font-semibold' : ''} text-stone-800 line-clamp-1`}>
                        {thread.title}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded ${type.color}`}>
                      <TypeIcon className="w-3 h-3" />
                      {type.label}
                    </span>
                  </td>
                  {!compact && (
                    <td className="px-4 py-3 text-stone-600">
                      <span className="text-xs capitalize">{thread.scopeType}</span>
                    </td>
                  )}
                  <td className="px-4 py-3 text-center text-stone-600">
                    {formatDate(thread.lastMessageAt)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <CmSlaBadge dueAt={thread.slaDueAt} status={thread.status} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  {!compact && (
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPin?.(thread);
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isPinned
                              ? 'text-amber-600 bg-amber-100 hover:bg-amber-200'
                              : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
                          }`}
                        >
                          <Pin className="w-4 h-4" />
                        </button>
                        {thread.status !== 'archived' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onArchive?.(thread);
                            }}
                            className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {threads.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет тредов для отображения
        </div>
      )}
    </div>
  );
}
