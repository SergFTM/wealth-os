'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCollection } from '@/lib/hooks';

// ---------------------------------------------------------------------------
// Demo fallback data
// ---------------------------------------------------------------------------
const DEMO_THREADS = [
  {
    id: 'thr-001',
    subject: 'Запрос на перебалансировку',
    lastMessageAt: '2026-02-07T14:22:00Z',
    participantCount: 3,
    unreadCount: 2,
    status: 'open',
  },
  {
    id: 'thr-002',
    subject: 'Квартальный обзор портфеля',
    lastMessageAt: '2026-02-05T09:45:00Z',
    participantCount: 2,
    unreadCount: 0,
    status: 'open',
  },
  {
    id: 'thr-003',
    subject: 'Налоговое планирование 2026',
    lastMessageAt: '2026-02-03T16:10:00Z',
    participantCount: 4,
    unreadCount: 1,
    status: 'open',
  },
  {
    id: 'thr-004',
    subject: 'Новая инвестиционная возможность',
    lastMessageAt: '2026-01-28T11:30:00Z',
    participantCount: 2,
    unreadCount: 0,
    status: 'closed',
  },
  {
    id: 'thr-005',
    subject: 'Обновление документов KYC',
    lastMessageAt: '2026-01-20T08:15:00Z',
    participantCount: 3,
    unreadCount: 0,
    status: 'closed',
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function PoMessagesPage() {
  const router = useRouter();
  const { items, loading } = useCollection<any>('commThreads');
  const [showCompose, setShowCompose] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newBody, setNewBody] = useState('');

  const threads: any[] = items.length > 0 ? items : DEMO_THREADS;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    }
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) {
      return d.toLocaleDateString('ru-RU', { weekday: 'short' });
    }
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const handleSend = () => {
    if (newSubject.trim() && newBody.trim()) {
      setNewSubject('');
      setNewBody('');
      setShowCompose(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">Сообщения</h1>
          <p className="text-sm text-stone-500 mt-1">
            Ваши переписки с командой советников
          </p>
        </div>
        <button
          onClick={() => setShowCompose(!showCompose)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all font-medium text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Новое сообщение
        </button>
      </div>

      {/* Inline compose form */}
      {showCompose && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
          <h2 className="text-base font-semibold text-stone-800 mb-4">Новое сообщение</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Тема</label>
              <input
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Тема сообщения..."
                className="w-full px-4 py-2.5 border border-stone-200/70 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all text-sm text-stone-800 placeholder:text-stone-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-1.5">Сообщение</label>
              <textarea
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Введите текст сообщения..."
                rows={4}
                className="w-full px-4 py-2.5 border border-stone-200/70 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all text-sm text-stone-800 placeholder:text-stone-400 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCompose(false)}
                className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSend}
                disabled={!newSubject.trim() || !newBody.trim()}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && items.length === 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-12 text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-stone-500">Загрузка сообщений...</p>
        </div>
      )}

      {/* Threads list */}
      <div className="space-y-2">
        {threads.map((thread: any) => (
          <button
            key={thread.id}
            onClick={() => router.push(`/portal/thread/${thread.id}`)}
            className="w-full text-left bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-5 hover:shadow-md hover:border-emerald-200/60 transition-all group"
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-100 to-amber-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:from-emerald-200 group-hover:to-amber-100 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-medium text-stone-800 truncate text-sm group-hover:text-emerald-700 transition-colors">
                    {thread.subject}
                  </h3>
                  <span className="text-xs text-stone-400 shrink-0">
                    {formatDate(thread.lastMessageAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-stone-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {thread.participantCount} участников
                  </span>
                  {thread.status === 'closed' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-500 font-medium">
                      Закрыт
                    </span>
                  )}
                </div>
              </div>

              {/* Unread badge */}
              {thread.unreadCount > 0 && (
                <span className="shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xs font-semibold flex items-center justify-center shadow-sm shadow-emerald-200">
                  {thread.unreadCount}
                </span>
              )}

              {/* Chevron */}
              <svg className="w-4 h-4 text-stone-300 group-hover:text-emerald-400 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
