"use client";

import Link from 'next/link';
import { ArrowLeft, Pin, Archive, MoreHorizontal, Share2, Bell, BellOff, Lock, Unlock } from 'lucide-react';
import { CmSlaBadge } from './CmSlaBadge';
import { CmClientSafeBadge } from './CmClientSafeToggle';

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
  createdAt: string;
}

interface CmThreadHeaderProps {
  thread: Thread;
  isPinned?: boolean;
  isMuted?: boolean;
  onBack?: () => void;
  onPin?: () => void;
  onMute?: () => void;
  onArchive?: () => void;
  onShare?: () => void;
  onClose?: () => void;
  onReopen?: () => void;
}

const typeConfig: Record<string, { label: string; color: string }> = {
  request: { label: 'Запрос', color: 'text-blue-600 bg-blue-50' },
  approval: { label: 'Согласование', color: 'text-purple-600 bg-purple-50' },
  incident: { label: 'Инцидент', color: 'text-red-600 bg-red-50' },
  advisor: { label: 'Консультация', color: 'text-emerald-600 bg-emerald-50' },
  client_service: { label: 'Сервис', color: 'text-amber-600 bg-amber-50' },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  open: { label: 'Открыт', color: 'text-emerald-600 bg-emerald-50' },
  escalated: { label: 'Эскалирован', color: 'text-red-600 bg-red-50' },
  closed: { label: 'Закрыт', color: 'text-stone-600 bg-stone-100' },
  archived: { label: 'Архив', color: 'text-stone-500 bg-stone-100' },
};

export function CmThreadHeader({
  thread,
  isPinned = false,
  isMuted = false,
  onBack,
  onPin,
  onMute,
  onArchive,
  onShare,
  onClose,
  onReopen,
}: CmThreadHeaderProps) {
  const type = typeConfig[thread.threadType] || typeConfig.request;
  const status = statusConfig[thread.status] || statusConfig.open;

  return (
    <div className="bg-white border-b border-stone-200 sticky top-0 z-10">
      <div className="px-6 py-4">
        {/* Top row: back button, title, actions */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/m/comms/list"
              className="flex-shrink-0 p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-stone-800 truncate">
                {thread.title}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
                <span className="capitalize">{thread.scopeType}</span>
                <span>•</span>
                <span>ID: {thread.scopeId}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={onPin}
              className={`p-2 rounded-lg transition-colors ${
                isPinned
                  ? 'text-amber-600 bg-amber-100 hover:bg-amber-200'
                  : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
              }`}
              title={isPinned ? 'Открепить' : 'Закрепить'}
            >
              <Pin className="w-4 h-4" />
            </button>

            <button
              onClick={onMute}
              className={`p-2 rounded-lg transition-colors ${
                isMuted
                  ? 'text-stone-600 bg-stone-200'
                  : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
              }`}
              title={isMuted ? 'Включить уведомления' : 'Отключить уведомления'}
            >
              {isMuted ? <BellOff className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
            </button>

            <button
              onClick={onShare}
              className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              title="Поделиться"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {thread.status !== 'archived' && (
              <button
                onClick={onArchive}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                title="Архивировать"
              >
                <Archive className="w-4 h-4" />
              </button>
            )}

            {/* More menu */}
            <div className="relative">
              <button
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                title="Дополнительно"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row: badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Type badge */}
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${type.color}`}>
            {type.label}
          </span>

          {/* Status badge */}
          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${status.color}`}>
            {status.label}
          </span>

          {/* SLA badge */}
          <CmSlaBadge dueAt={thread.slaDueAt} status={thread.status} size="md" />

          {/* Client safe badge */}
          <CmClientSafeBadge isClientSafe={thread.clientSafe} />

          {/* Divider and actions */}
          <div className="flex-1" />

          {thread.status === 'open' && (
            <button
              onClick={onClose}
              className="text-xs text-stone-600 hover:text-stone-800 px-3 py-1 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              Закрыть тред
            </button>
          )}

          {thread.status === 'closed' && (
            <button
              onClick={onReopen}
              className="text-xs text-emerald-600 hover:text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-50 transition-colors"
            >
              Открыть повторно
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
