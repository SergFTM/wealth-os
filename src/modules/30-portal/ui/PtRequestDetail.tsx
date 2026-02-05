'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { PtStatusPill } from './PtStatusPill';

const labels = {
  back: { ru: '← Назад к запросам', en: '← Back to requests', uk: '← Назад до запитів' },
  type: { ru: 'Тип', en: 'Type', uk: 'Тип' },
  status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
  priority: { ru: 'Приоритет', en: 'Priority', uk: 'Пріоритет' },
  created: { ru: 'Создан', en: 'Created', uk: 'Створено' },
  slaDue: { ru: 'Срок SLA', en: 'SLA Due', uk: 'Термін SLA' },
  description: { ru: 'Описание', en: 'Description', uk: 'Опис' },
  attachments: { ru: 'Прикрепленные документы', en: 'Attachments', uk: 'Прикріплені документи' },
  messages: { ru: 'Сообщения', en: 'Messages', uk: 'Повідомлення' },
  addComment: { ru: 'Добавить комментарий', en: 'Add Comment', uk: 'Додати коментар' },
  attachFile: { ru: 'Прикрепить файл', en: 'Attach File', uk: 'Прикріпити файл' },
  send: { ru: 'Отправить', en: 'Send', uk: 'Відправити' },
  loading: { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' },
  notFound: { ru: 'Запрос не найден', en: 'Request not found', uk: 'Запит не знайдено' },
  markResolved: { ru: 'Отметить как решенный', en: 'Mark as Resolved', uk: 'Позначити як вирішений' },
  history: { ru: 'История', en: 'History', uk: 'Історія' },
};

const typeLabels: Record<string, Record<string, string>> = {
  document_request: { ru: 'Запрос документа', en: 'Document Request', uk: 'Запит документа' },
  payment_request: { ru: 'Запрос платежа', en: 'Payment Request', uk: 'Запит платежу' },
  change_request: { ru: 'Запрос изменения', en: 'Change Request', uk: 'Запит зміни' },
  question: { ru: 'Вопрос', en: 'Question', uk: 'Питання' },
};

interface ClientRequest {
  id: string;
  title: string;
  description: string;
  requestType: string;
  status: string;
  priority: string;
  createdAt: string;
  slaDueAt?: string;
  attachmentDocIds?: string[];
  linkedThreadId?: string;
  clientNotes?: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: string;
  isStaff: boolean;
}

interface PtRequestDetailProps {
  requestId: string;
}

export function PtRequestDetail({ requestId }: PtRequestDetailProps) {
  const { locale, user } = useApp();
  const [request, setRequest] = useState<ClientRequest | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch(`/api/collections/clientRequests/${requestId}`)
      .then(res => res.json())
      .then(data => {
        setRequest(data);
        setMessages([
          { id: '1', content: 'Ваш запрос получен и принят в работу.', createdAt: new Date().toISOString(), sender: 'Операционная команда', isStaff: true },
          { id: '2', content: 'Спасибо за обращение!', createdAt: new Date().toISOString(), sender: user?.name || 'Client', isStaff: false },
        ]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [requestId, user?.name]);

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    setSending(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setMessages(prev => [...prev, {
      id: String(Date.now()),
      content: newComment,
      createdAt: new Date().toISOString(),
      sender: user?.name || 'Client',
      isStaff: false,
    }]);
    setNewComment('');
    setSending(false);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-stone-500">{labels.loading[locale]}</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-8 text-center">
        <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-stone-500">{labels.notFound[locale]}</p>
        <Link href="/portal/requests" className="text-emerald-600 hover:text-emerald-700 mt-2 inline-block">
          {labels.back[locale]}
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <Link href="/portal/requests" className="text-sm text-emerald-600 hover:text-emerald-700">
        {labels.back[locale]}
      </Link>

      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-stone-800 mb-3">{request.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <PtStatusPill status={request.status} size="md" />
              <PtStatusPill status={request.priority} size="md" />
              <span className="text-sm text-stone-500">
                {typeLabels[request.requestType]?.[locale] || request.requestType}
              </span>
            </div>
          </div>
          {request.status !== 'completed' && request.status !== 'cancelled' && (
            <button className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors">
              {labels.markResolved[locale]}
            </button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-stone-500">{labels.created[locale]}</div>
            <div className="font-medium text-stone-800 mt-1">
              {new Date(request.createdAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US')}
            </div>
          </div>
          {request.slaDueAt && (
            <div>
              <div className="text-stone-500">{labels.slaDue[locale]}</div>
              <div className="font-medium text-stone-800 mt-1">
                {new Date(request.slaDueAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h2 className="font-semibold text-stone-800 mb-4">{labels.description[locale]}</h2>
        <p className="text-stone-600">{request.description || '—'}</p>
      </div>

      {/* Messages / Thread */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-100/50 p-6">
        <h2 className="font-semibold text-stone-800 mb-4">{labels.messages[locale]}</h2>

        <div className="space-y-4 mb-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-4 rounded-xl ${msg.isStaff ? 'bg-emerald-50/50 border border-emerald-100' : 'bg-stone-50 border border-stone-100'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${msg.isStaff ? 'text-emerald-700' : 'text-stone-700'}`}>
                  {msg.sender}
                </span>
                <span className="text-xs text-stone-400">
                  {new Date(msg.createdAt).toLocaleString(locale === 'ru' ? 'ru-RU' : locale === 'uk' ? 'uk-UA' : 'en-US')}
                </span>
              </div>
              <p className="text-sm text-stone-600">{msg.content}</p>
            </div>
          ))}
        </div>

        {/* Add comment */}
        <div className="border-t border-emerald-100 pt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={labels.addComment[locale]}
            className="w-full p-3 rounded-xl border border-emerald-100 bg-white text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
            rows={3}
          />
          <div className="flex justify-between items-center mt-3">
            <button className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              {labels.attachFile[locale]}
            </button>
            <button
              onClick={handleSendComment}
              disabled={!newComment.trim() || sending}
              className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {labels.send[locale]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
