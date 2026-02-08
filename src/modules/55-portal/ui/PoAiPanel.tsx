'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Props {
  isOpen: boolean;
  onClose: () => void;
  locale?: 'ru' | 'en' | 'uk';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  sources?: { label: string; asOfDate?: string }[];
  confidence?: 'high' | 'medium' | 'low';
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const labels: Record<string, Record<string, string>> = {
  title: { ru: 'AI Помощник', en: 'AI Assistant', uk: 'AI Помiчник' },
  disclaimer: {
    ru: 'Ответы генерируются ИИ на основе ваших данных и могут содержать неточности. Пожалуйста, проверяйте важную информацию с вашим советником.',
    en: 'Responses are AI-generated based on your data and may contain inaccuracies. Please verify important information with your advisor.',
    uk: 'Вiдповiдi генеруються ШI на основi ваших даних i можуть мiстити неточностi. Будь ласка, перевiряйте важливу iнформацiю з вашим радником.',
  },
  placeholder: {
    ru: 'Задайте вопрос о вашем портфеле...',
    en: 'Ask a question about your portfolio...',
    uk: 'Задайте питання про ваш портфель...',
  },
  send: { ru: 'Отправить', en: 'Send', uk: 'Надiслати' },
  sources: { ru: 'Источники', en: 'Sources', uk: 'Джерела' },
  confidence: { ru: 'Уверенность', en: 'Confidence', uk: 'Впевненiсть' },
  high: { ru: 'Высокая', en: 'High', uk: 'Висока' },
  medium: { ru: 'Средняя', en: 'Medium', uk: 'Середня' },
  low: { ru: 'Низкая', en: 'Low', uk: 'Низька' },
  thinking: { ru: 'Анализирую...', en: 'Analyzing...', uk: 'Аналiзую...' },
  suggested: { ru: 'Популярные вопросы', en: 'Suggested questions', uk: 'Популярнi питання' },
};

// ---------------------------------------------------------------------------
// Mock AI response
// ---------------------------------------------------------------------------
const MOCK_AI_RESPONSE: ChatMessage = {
  id: 'ai-1',
  role: 'ai',
  content:
    'За последний месяц произошло несколько значительных изменений в вашем портфеле:\n\n1. Доля акций увеличилась с 60% до 68% из-за роста рынков развитых стран (+4.2% за период).\n\n2. Позиция в облигациях сократилась до 22% от целевых 30%, что увеличивает общий профиль риска.\n\n3. Рекомендуется провести перебалансировку: продать часть акций технологического сектора и увеличить позиции в корпоративных облигациях инвестиционного класса (доходность 5.1-5.4% годовых).\n\nВаш советник Ирина Волкова уже подготовила предложение по перебалансировке.',
  sources: [
    { label: 'Портфельная аналитика Q4 2025', asOfDate: '2025-12-31' },
    { label: 'Рыночный обзор', asOfDate: '2026-02-07' },
    { label: 'Инвестиционная политика v3', asOfDate: '2025-11-15' },
  ],
  confidence: 'high',
};

const SUGGESTED_QUERIES: Record<string, string[]> = {
  ru: [
    'Какие изменения произошли в портфеле за месяц?',
    'Какова текущая доходность портфеля?',
    'Когда следующий налоговый дедлайн?',
    'Какие риски у текущего распределения?',
  ],
  en: [
    'What changes occurred in the portfolio this month?',
    'What is the current portfolio return?',
    'When is the next tax deadline?',
    'What are the risks of the current allocation?',
  ],
  uk: [
    'Якi змiни вiдбулися в портфелi за мiсяць?',
    'Яка поточна дохiднiсть портфеля?',
    'Коли наступний податковий дедлайн?',
    'Якi ризики поточного розподiлу?',
  ],
};

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function getConfidenceColor(c: 'high' | 'medium' | 'low'): string {
  if (c === 'high') return 'bg-emerald-100 text-emerald-700';
  if (c === 'medium') return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function PoAiPanel({ isOpen, onClose, locale = 'ru' }: Props) {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  const t = (key: string) => labels[key]?.[locale] || labels[key]?.['ru'] || key;

  const handleSend = async (text?: string) => {
    const q = (text || query).trim();
    if (!q || isThinking) return;

    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', content: q };
    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setIsThinking(true);

    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const aiMsg: ChatMessage = {
      ...MOCK_AI_RESPONSE,
      id: `ai-${Date.now()}`,
    };
    setMessages((prev) => [...prev, aiMsg]);
    setIsThinking(false);
  };

  const suggested = SUGGESTED_QUERIES[locale] || SUGGESTED_QUERIES['ru'];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 z-50 h-full w-96 max-w-full bg-white/90 backdrop-blur-xl shadow-2xl flex flex-col border-l border-stone-200/50">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-white text-base">{t('title')}</h2>
              <p className="text-[11px] text-white/70">Wealth OS Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Disclaimer banner */}
        <div className="shrink-0 px-5 py-3 bg-amber-50 border-b border-amber-200/60">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-[11px] text-amber-700 leading-relaxed">{t('disclaimer')}</p>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {/* Suggested questions (shown when empty) */}
          {messages.length === 0 && (
            <div>
              <p className="text-xs font-medium text-stone-400 mb-3">{t('suggested')}</p>
              <div className="space-y-2">
                {suggested.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="w-full text-left px-4 py-3 bg-stone-50 hover:bg-emerald-50 rounded-xl text-sm text-stone-700 transition-colors border border-stone-100 hover:border-emerald-200"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.role === 'user' ? (
                /* User message - right aligned, emerald */
                <div className="flex justify-end">
                  <div className="max-w-[85%] px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl rounded-br-md text-sm leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              ) : (
                /* AI message - left aligned, stone */
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div className="max-w-[90%] px-4 py-3 bg-stone-50 border border-stone-200/50 rounded-2xl rounded-bl-md text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                      {msg.content}
                    </div>
                  </div>

                  {/* Confidence indicator */}
                  {msg.confidence && (
                    <div className="ml-9 flex items-center gap-2">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium ${getConfidenceColor(msg.confidence)}`}
                      >
                        {t('confidence')}: {t(msg.confidence)}
                      </span>
                    </div>
                  )}

                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="ml-9 p-3 bg-stone-50 rounded-xl border border-stone-100">
                      <p className="text-[11px] font-semibold text-stone-500 mb-2">{t('sources')}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2.5 py-1 bg-white rounded-lg text-[11px] text-stone-600 border border-stone-200/70"
                          >
                            <svg className="w-3 h-3 text-emerald-500 mr-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {src.label}
                            {src.asOfDate && (
                              <span className="text-stone-400 ml-1">
                                ({new Date(src.asOfDate).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })})
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="flex items-center gap-2.5 pl-1">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shrink-0">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-sm text-stone-500">{t('thinking')}</p>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="shrink-0 border-t border-stone-200/50 p-4 bg-white/80">
          <div className="flex items-end gap-2.5">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('placeholder')}
              rows={2}
              className="flex-1 px-4 py-2.5 border border-stone-200/70 rounded-xl bg-white/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 transition-all text-sm text-stone-800 placeholder:text-stone-400 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!query.trim() || isThinking}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shrink-0"
            >
              {t('send')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
