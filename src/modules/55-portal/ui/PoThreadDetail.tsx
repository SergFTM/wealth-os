'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Message {
  id: string;
  sender: 'client' | 'advisor';
  senderName: string;
  content: string;
  sentAt: string;
}

interface Props {
  threadId: string;
}

// ---------------------------------------------------------------------------
// Mock data factory
// ---------------------------------------------------------------------------
function getMockThread(threadId: string) {
  const subjects: Record<string, string> = {
    'thr-001': 'Запрос на перебалансировку',
    'thr-002': 'Квартальный обзор портфеля',
    'thr-003': 'Налоговое планирование 2026',
    'thr-004': 'Новая инвестиционная возможность',
    'thr-005': 'Обновление документов KYC',
  };

  const subject = subjects[threadId] || `Обсуждение #${threadId}`;

  const participants = [
    { name: 'Александр Петров', role: 'Клиент' },
    { name: 'Ирина Волкова', role: 'Старший советник' },
    { name: 'Дмитрий Козлов', role: 'Портфельный менеджер' },
  ];

  const messages: Message[] = [
    {
      id: 'msg-1',
      sender: 'client',
      senderName: 'Александр Петров',
      content: 'Добрый день! Хотел бы обсудить возможность перебалансировки портфеля. Текущая аллокация, на мой взгляд, слишком смещена в сторону акций.',
      sentAt: '2026-02-07T10:15:00Z',
    },
    {
      id: 'msg-2',
      sender: 'advisor',
      senderName: 'Ирина Волкова',
      content: 'Добрый день, Александр! Спасибо за обращение. Согласна, текущая доля акций составляет 68%, что выше вашего целевого уровня в 60%. Мы подготовим предложение по перебалансировке в течение двух рабочих дней.',
      sentAt: '2026-02-07T11:30:00Z',
    },
    {
      id: 'msg-3',
      sender: 'client',
      senderName: 'Александр Петров',
      content: 'Отлично, жду предложение. Также хотел бы рассмотреть увеличение позиции в облигациях инвестиционного класса.',
      sentAt: '2026-02-07T12:45:00Z',
    },
    {
      id: 'msg-4',
      sender: 'advisor',
      senderName: 'Дмитрий Козлов',
      content: 'Александр, добрый день! Подключился к обсуждению. Мы провели анализ и видим хорошие возможности в корпоративных облигациях с рейтингом A+ и выше. Средняя доходность к погашению сейчас 5.2% годовых. Подготовим детальное предложение.',
      sentAt: '2026-02-07T14:22:00Z',
    },
  ];

  return { subject, participants, messages };
}

const AI_DRAFT_SUGGESTION =
  'Спасибо за подробный анализ. Предложение по облигациям с рейтингом A+ выглядит привлекательно. Прошу подготовить сравнительную таблицу по 5-7 выпускам с указанием дюрации и доходности. Также интересует, как это повлияет на общий профиль риска портфеля.';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function PoThreadDetail({ threadId }: Props) {
  const router = useRouter();
  const thread = getMockThread(threadId);

  const [messageText, setMessageText] = useState('');
  const [showAiDraft, setShowAiDraft] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>(thread.messages);

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    });
  };

  const handleSend = () => {
    if (!messageText.trim()) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'client',
      senderName: 'Александр Петров',
      content: messageText.trim(),
      sentAt: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, newMsg]);
    setMessageText('');
    setShowAiDraft(false);
  };

  const applyAiDraft = () => {
    setMessageText(AI_DRAFT_SUGGESTION);
    setShowAiDraft(false);
  };

  // Group messages by date
  const groupedMessages: { date: string; msgs: Message[] }[] = [];
  let lastDate = '';
  for (const msg of localMessages) {
    const d = formatDate(msg.sentAt);
    if (d !== lastDate) {
      groupedMessages.push({ date: d, msgs: [msg] });
      lastDate = d;
    } else {
      groupedMessages[groupedMessages.length - 1].msgs.push(msg);
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[900px]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-5 mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/portal/messages')}
            className="p-2 hover:bg-stone-100 rounded-xl transition-colors shrink-0"
          >
            <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-stone-800 truncate">
              {thread.subject}
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-stone-400">Участники:</span>
              {thread.participants.map((p, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600"
                >
                  {p.name}
                  <span className="text-stone-400">({p.role})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6 space-y-6 mb-4">
        {groupedMessages.map((group) => (
          <div key={group.date}>
            {/* Date divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 border-t border-stone-200/50" />
              <span className="text-xs text-stone-400 font-medium shrink-0">{group.date}</span>
              <div className="flex-1 border-t border-stone-200/50" />
            </div>

            {/* Messages */}
            <div className="space-y-4">
              {group.msgs.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${msg.sender === 'client' ? 'order-2' : ''}`}>
                    {/* Sender name for advisor */}
                    {msg.sender === 'advisor' && (
                      <p className="text-xs font-medium text-emerald-600 mb-1 ml-1">
                        {msg.senderName}
                      </p>
                    )}
                    {/* Bubble */}
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'client'
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-br-md'
                          : 'bg-stone-100 text-stone-700 border border-stone-200/50 rounded-bl-md'
                      }`}
                    >
                      {msg.content}
                    </div>
                    {/* Timestamp */}
                    <p
                      className={`text-[11px] text-stone-400 mt-1 ${
                        msg.sender === 'client' ? 'text-right mr-1' : 'ml-1'
                      }`}
                    >
                      {formatTime(msg.sentAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* AI Draft suggestion */}
      {showAiDraft && (
        <div className="bg-amber-50/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-amber-700 mb-1">Предложение AI помощника</p>
              <p className="text-sm text-amber-800 leading-relaxed">{AI_DRAFT_SUGGESTION}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={applyAiDraft}
                  className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors"
                >
                  Использовать
                </button>
                <button
                  onClick={() => setShowAiDraft(false)}
                  className="px-3 py-1.5 bg-white text-amber-700 border border-amber-200 rounded-lg text-xs font-medium hover:bg-amber-50 transition-colors"
                >
                  Отклонить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compose bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-4">
        <div className="flex items-end gap-3">
          {/* AI helper button */}
          <button
            onClick={() => setShowAiDraft(true)}
            className="p-2.5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 hover:from-amber-100 hover:to-amber-200 transition-all shrink-0 border border-amber-200/50"
            title="AI помощник"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </button>

          {/* Text input */}
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Введите сообщение..."
            rows={2}
            className="flex-1 px-4 py-2.5 border border-stone-200/70 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all text-sm text-stone-800 placeholder:text-stone-400 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!messageText.trim()}
            className="p-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
