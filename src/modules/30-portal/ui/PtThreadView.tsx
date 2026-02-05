'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';

const labels = {
  back: { ru: '← Назад к сообщениям', en: '← Back to messages', uk: '← Назад до повідомлень' },
  send: { ru: 'Отправить', en: 'Send', uk: 'Відправити' },
  placeholder: { ru: 'Введите сообщение...', en: 'Type a message...', uk: 'Введіть повідомлення...' },
  loading: { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' },
  notFound: { ru: 'Тред не найден', en: 'Thread not found', uk: 'Тред не знайдено' },
  summarize: { ru: 'Суммировать тред (AI)', en: 'Summarize Thread (AI)', uk: 'Підсумувати тред (AI)' },
  sla: { ru: 'SLA на ответ', en: 'Response SLA', uk: 'SLA на відповідь' },
  aiDisclaimer: { ru: 'AI выводы информационные и требуют проверки человеком', en: 'AI outputs are informational and require human verification', uk: 'AI висновки інформаційні та потребують перевірки людиною' },
  attachFile: { ru: 'Прикрепить', en: 'Attach', uk: 'Прикріпити' },
};

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: string;
  isStaff: boolean;
  isInternal?: boolean;
}

interface Thread {
  id: string;
  subject: string;
  status: string;
  slaHours?: number;
  createdAt: string;
}

interface PtThreadViewProps {
  threadId: string;
}

export function PtThreadView({ threadId }: PtThreadViewProps) {
  const { locale, user } = useApp();
  const [thread, setThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showAiSummary, setShowAiSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/collections/commThreads/${threadId}`)
      .then(res => res.json())
      .then(data => {
        setThread(data);
        setMessages([
          { id: '1', content: 'Здравствуйте! Ваш запрос получен.', createdAt: new Date(Date.now() - 86400000).toISOString(), sender: 'Операционная команда', isStaff: true },
          { id: '2', content: 'Мы работаем над вашим вопросом.', createdAt: new Date(Date.now() - 43200000).toISOString(), sender: 'Операционная команда', isStaff: true },
          { id: '3', content: 'Спасибо за оперативность!', createdAt: new Date(Date.now() - 21600000).toISOString(), sender: user?.name || 'Client', isStaff: false },
        ]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [threadId, user?.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setSending(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    setMessages(prev => [...prev, {
      id: String(Date.now()),
      content: newMessage,
      createdAt: new Date().toISOString(),
      sender: user?.name || 'Client',
      isStaff: false,
    }]);
    setNewMessage('');
    setSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500">{labels.loading[locale]}</p>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="p-8 text-center">
        <p className="text-stone-500">{labels.notFound[locale]}</p>
        <Link href="/portal/threads" className="text-emerald-600 hover:text-emerald-700 mt-2 inline-block">
          {labels.back[locale]}
        </Link>
      </div>
    );
  }

  // Filter out internal notes (staff-only)
  const visibleMessages = messages.filter(m => !m.isInternal);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-emerald-100/50 px-6 py-4">
        <Link href="/portal/threads" className="text-sm text-emerald-600 hover:text-emerald-700 mb-2 inline-block">
          {labels.back[locale]}
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-stone-800">{thread.subject}</h1>
          <div className="flex items-center gap-3">
            {thread.slaHours && (
              <span className="text-xs text-stone-500">
                {labels.sla[locale]}: {thread.slaHours}h
              </span>
            )}
            <button
              onClick={() => setShowAiSummary(!showAiSummary)}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-amber-50 text-emerald-700 rounded-lg text-xs font-medium hover:from-emerald-100 hover:to-amber-100 transition-colors"
            >
              {labels.summarize[locale]}
            </button>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      {showAiSummary && (
        <div className="bg-gradient-to-r from-emerald-50 to-amber-50 border-b border-emerald-100/50 px-6 py-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            <div>
              <p className="text-sm text-stone-700">
                {locale === 'ru'
                  ? 'Краткое содержание: Клиент обратился с вопросом. Команда подтвердила получение и работает над решением. Клиент выразил благодарность за оперативность.'
                  : 'Summary: Client reached out with a question. Team confirmed receipt and is working on a solution. Client expressed gratitude for quick response.'}
              </p>
              <p className="text-xs text-stone-500 mt-2">{labels.aiDisclaimer[locale]}</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {visibleMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isStaff ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
              msg.isStaff
                ? 'bg-white border border-emerald-100'
                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
            }`}>
              <div className={`text-xs mb-1 ${msg.isStaff ? 'text-emerald-600' : 'text-emerald-100'}`}>
                {msg.sender}
              </div>
              <p className={`text-sm ${msg.isStaff ? 'text-stone-700' : 'text-white'}`}>
                {msg.content}
              </p>
              <div className={`text-xs mt-2 ${msg.isStaff ? 'text-stone-400' : 'text-emerald-100'}`}>
                {new Date(msg.createdAt).toLocaleString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US')}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white/70 backdrop-blur-sm border-t border-emerald-100/50 px-6 py-4">
        <div className="flex items-end gap-3">
          <button className="p-2 text-stone-400 hover:text-emerald-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={labels.placeholder[locale]}
              rows={1}
              className="w-full px-4 py-2.5 rounded-xl border border-emerald-100 bg-white text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
