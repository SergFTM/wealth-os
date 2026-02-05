'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';

const labels = {
  title: { ru: 'Сообщения', en: 'Messages', uk: 'Повідомлення' },
  subtitle: { ru: 'Общение с командой', en: 'Communication with team', uk: 'Спілкування з командою' },
  unread: { ru: 'Непрочитанные', en: 'Unread', uk: 'Непрочитані' },
  all: { ru: 'Все', en: 'All', uk: 'Всі' },
  noThreads: { ru: 'Нет сообщений', en: 'No messages', uk: 'Немає повідомлень' },
  lastMessage: { ru: 'Последнее сообщение', en: 'Last message', uk: 'Останнє повідомлення' },
  newMessages: { ru: 'новых', en: 'new', uk: 'нових' },
};

interface Thread {
  id: string;
  subject: string;
  lastMessageAt: string;
  lastMessagePreview: string;
  lastMessageSender: string;
  unreadCount: number;
  status: string;
}

export function PtThreadsList() {
  const { locale } = useApp();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetch('/api/collections/commThreads')
      .then(res => res.json())
      .then(data => {
        const mapped = (data || []).map((t: Thread & { unreadCount?: number }) => ({
          ...t,
          unreadCount: t.unreadCount || Math.floor(Math.random() * 3),
          lastMessagePreview: t.lastMessagePreview || 'Спасибо за обращение, ваш запрос в работе...',
          lastMessageSender: t.lastMessageSender || 'Операционная команда',
        }));
        setThreads(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredThreads = threads.filter(t => {
    if (filter === 'unread') return t.unreadCount > 0;
    return true;
  });

  const totalUnread = threads.reduce((sum, t) => sum + t.unreadCount, 0);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800">{labels.title[locale]}</h1>
          <p className="text-sm text-stone-500 mt-1">{labels.subtitle[locale]}</p>
        </div>
        {totalUnread > 0 && (
          <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
            {totalUnread} {labels.newMessages[locale]}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-emerald-500 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          {labels.all[locale]}
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            filter === 'unread'
              ? 'bg-emerald-500 text-white'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          {labels.unread[locale]} ({threads.filter(t => t.unreadCount > 0).length})
        </button>
      </div>

      {/* Threads list */}
      {filteredThreads.length > 0 ? (
        <div className="space-y-3">
          {filteredThreads.map((thread) => (
            <Link
              key={thread.id}
              href={`/portal/threads/${thread.id}`}
              className="block bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-5 hover:shadow-lg hover:shadow-emerald-500/10 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  thread.unreadCount > 0
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-stone-100 text-stone-400'
                }`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className={`font-semibold truncate ${
                      thread.unreadCount > 0 ? 'text-stone-800' : 'text-stone-600'
                    }`}>
                      {thread.subject}
                    </h3>
                    {thread.unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded-full flex-shrink-0">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-stone-500 truncate">{thread.lastMessagePreview}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-stone-400">
                    <span>{thread.lastMessageSender}</span>
                    <span>•</span>
                    <span>
                      {new Date(thread.lastMessageAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US')}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-12 text-center">
          <svg className="w-12 h-12 text-stone-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-stone-500">{labels.noThreads[locale]}</p>
        </div>
      )}
    </div>
  );
}
