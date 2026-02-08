'use client';

import React, { useState } from 'react';
import { PortalThread, PortalMessage, Locale, portalI18n } from '../types';
import { PCard, PCardHeader, PCardBody } from './PCard';

interface PThreadsProps {
  threads: PortalThread[];
  locale?: Locale;
  onSendMessage?: (threadId: string, content: string) => void;
  onCreateThread?: (subject: string, message: string) => void;
}

export function PThreads({ threads, locale = 'ru', onSendMessage, onCreateThread }: PThreadsProps) {
  const [selectedThread, setSelectedThread] = useState<PortalThread | null>(null);
  const [showNewThread, setShowNewThread] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const labels: Record<string, Record<Locale, string>> = {
    title: { ru: 'Сообщения', en: 'Messages', uk: 'Повідомлення' },
    newMessage: { ru: 'Новое сообщение', en: 'New Message', uk: 'Нове повідомлення' },
    subject: { ru: 'Тема', en: 'Subject', uk: 'Тема' },
    message: { ru: 'Сообщение', en: 'Message', uk: 'Повідомлення' },
    send: { ru: 'Отправить', en: 'Send', uk: 'Надіслати' },
    cancel: { ru: 'Отмена', en: 'Cancel', uk: 'Скасувати' },
    noThreads: { ru: 'Нет сообщений', en: 'No messages', uk: 'Немає повідомлень' },
    placeholder: { ru: 'Введите сообщение...', en: 'Type a message...', uk: 'Введіть повідомлення...' },
    subjectPlaceholder: { ru: 'Тема сообщения...', en: 'Message subject...', uk: 'Тема повідомлення...' },
    you: { ru: 'Вы', en: 'You', uk: 'Ви' },
    participants: { ru: 'Участники', en: 'Participants', uk: 'Учасники' },
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffDays === 1) {
      return locale === 'ru' ? 'Вчера' : locale === 'en' ? 'Yesterday' : 'Вчора';
    } else if (diffDays < 7) {
      return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
        weekday: 'short',
      });
    }
    return date.toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
      day: 'numeric',
      month: 'short',
    });
  };

  const formatMessageTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSendMessage = () => {
    if (selectedThread && messageInput.trim()) {
      onSendMessage?.(selectedThread.id, messageInput.trim());
      setMessageInput('');
    }
  };

  const handleCreateThread = () => {
    if (newSubject.trim() && newMessage.trim()) {
      onCreateThread?.(newSubject.trim(), newMessage.trim());
      setNewSubject('');
      setNewMessage('');
      setShowNewThread(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setShowNewThread(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {labels.newMessage[locale]}
        </button>
      </div>

      {/* Threads List */}
      {threads.length === 0 ? (
        <PCard>
          <PCardBody>
            <div className="py-12 text-center">
              <svg className="w-12 h-12 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-slate-400">{labels.noThreads[locale]}</p>
            </div>
          </PCardBody>
        </PCard>
      ) : (
        <div className="space-y-2">
          {threads.map(thread => (
            <PCard key={thread.id} hover onClick={() => setSelectedThread(thread)}>
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-amber-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-medium text-slate-800 truncate">{thread.subject}</h3>
                    <span className="text-xs text-slate-400 flex-shrink-0">{formatDate(thread.lastMessageAt)}</span>
                  </div>
                  <p className="text-sm text-slate-500 truncate mt-0.5">
                    {thread.participantNames.join(', ')}
                  </p>
                </div>
                {thread.unreadCount > 0 && (
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-medium flex items-center justify-center">
                    {thread.unreadCount}
                  </span>
                )}
              </div>
            </PCard>
          ))}
        </div>
      )}

      {/* New Thread Modal */}
      {showNewThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowNewThread(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-800">{labels.newMessage[locale]}</h2>
              <button
                onClick={() => setShowNewThread(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{labels.subject[locale]}</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder={labels.subjectPlaceholder[locale]}
                  className="w-full px-4 py-2.5 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{labels.message[locale]}</label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={labels.placeholder[locale]}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all resize-none"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowNewThread(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  {labels.cancel[locale]}
                </button>
                <button
                  onClick={handleCreateThread}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
                >
                  {labels.send[locale]}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thread Detail Drawer */}
      {selectedThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSelectedThread(null)} />
          <div className="relative w-full max-w-lg h-full bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 border-b border-emerald-100 px-6 py-4 flex items-center justify-between bg-white">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">{selectedThread.subject}</h2>
                <p className="text-sm text-slate-500">
                  {labels.participants[locale]}: {selectedThread.participantNames.join(', ')}
                </p>
              </div>
              <button
                onClick={() => setSelectedThread(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {selectedThread.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isClientMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${msg.isClientMessage ? 'order-2' : ''}`}>
                    <div className={`px-4 py-3 rounded-2xl ${
                      msg.isClientMessage
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-br-md'
                        : 'bg-white shadow-sm border border-emerald-50 rounded-bl-md'
                    }`}>
                      {!msg.isClientMessage && (
                        <p className="text-xs font-medium text-emerald-600 mb-1">{msg.senderName}</p>
                      )}
                      <p className={`text-sm ${msg.isClientMessage ? 'text-white' : 'text-slate-700'}`}>
                        {msg.content}
                      </p>
                    </div>
                    <p className={`text-xs text-slate-400 mt-1 ${msg.isClientMessage ? 'text-right' : ''}`}>
                      {formatMessageTime(msg.sentAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex-shrink-0 border-t border-emerald-100 p-4 bg-white">
              <div className="flex items-end gap-3">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={labels.placeholder[locale]}
                  rows={2}
                  className="flex-1 px-4 py-2.5 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
