'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { MbStatusPill } from './MbStatusPill';
import { getAvailableTopics, type PushMessage, type PushTopic } from '../engine';

const labels = {
  title: { ru: 'Push Inbox', en: 'Push Inbox', uk: 'Push Inbox' },
  all: { ru: 'Все', en: 'All', uk: 'Всі' },
  unread: { ru: 'Непрочитанные', en: 'Unread', uk: 'Непрочитані' },
  noMessages: { ru: 'Нет сообщений', en: 'No messages', uk: 'Немає повідомлень' },
  markRead: { ru: 'Отметить прочитанным', en: 'Mark as Read', uk: 'Позначити прочитаним' },
  open: { ru: 'Открыть', en: 'Open', uk: 'Відкрити' },
};

export function MbPushInbox() {
  const { locale } = useApp();
  const [messages, setMessages] = useState<PushMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [topicFilter, setTopicFilter] = useState<PushTopic | null>(null);

  useEffect(() => {
    fetch('/api/collections/pushMessages')
      .then(r => r.json())
      .then(data => {
        const sorted = (data || []).sort((a: PushMessage, b: PushMessage) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setMessages(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleMarkRead = async (messageId: string) => {
    const now = new Date().toISOString();
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, status: 'read' as const, readAt: now } : m
    ));
  };

  const filteredMessages = messages
    .filter(m => filter === 'all' || m.status === 'unread')
    .filter(m => !topicFilter || m.topic === topicFilter);

  const topics = getAvailableTopics();
  const unreadCount = messages.filter(m => m.status === 'unread').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-white/80 text-stone-600 hover:bg-stone-100'
          }`}
        >
          {labels.all[locale]} ({messages.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === 'unread' 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-white/80 text-stone-600 hover:bg-stone-100'
          }`}
        >
          {labels.unread[locale]} ({unreadCount})
        </button>
        <div className="w-px h-6 bg-stone-200 self-center" />
        <button
          onClick={() => setTopicFilter(null)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            !topicFilter 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-white/80 text-stone-600 hover:bg-stone-100'
          }`}
        >
          {labels.all[locale]}
        </button>
        {topics.slice(0, 4).map((topic) => (
          <button
            key={topic.value}
            onClick={() => setTopicFilter(topicFilter === topic.value ? null : topic.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              topicFilter === topic.value 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-white/80 text-stone-600 hover:bg-stone-100'
            }`}
          >
            {topic.label[locale]}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-sm">
            {labels.noMessages[locale]}
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredMessages.slice(0, 20).map((message) => (
              <div 
                key={message.id} 
                className={`p-4 hover:bg-emerald-50/30 transition-colors ${
                  message.status === 'unread' ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    message.priority === 'urgent' ? 'bg-red-100 text-red-600' :
                    message.priority === 'high' ? 'bg-amber-100 text-amber-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-stone-800">{message.title}</span>
                      {message.status === 'unread' && (
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                    <p className="text-sm text-stone-600 mb-2">{message.body}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-600">{message.topic}</span>
                      <span className="text-stone-400">
                        {new Date(message.createdAt).toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US')}
                      </span>
                      <MbStatusPill status={message.priority} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {message.status === 'unread' && (
                      <button
                        onClick={() => handleMarkRead(message.id)}
                        className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title={labels.markRead[locale]}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                    <Link
                      href={message.deepLink}
                      className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title={labels.open[locale]}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
