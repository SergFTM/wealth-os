'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRecord } from '@/lib/hooks';
import { useTranslation } from '@/lib/i18n';

interface Notification {
  id: string;
  clientId: string;
  userId: string;
  userName: string;
  title: string;
  body?: string;
  category: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  channel: string;
  status: string;
  readAt?: string | null;
  deliveredAt?: string | null;
  sourceType?: string;
  sourceId?: string;
  sourceName?: string;
  sourceUrl?: string;
  templateId?: string | null;
  ruleId?: string | null;
  escalationId?: string | null;
  aiScore?: number | null;
  aiTags?: string[];
  actions?: Array<{ key: string; label: string; url: string; style: string }>;
  createdAt: string;
  updatedAt: string;
}

const priorityColors = {
  urgent: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-amber-100 text-amber-700 border-amber-200',
  normal: 'bg-gray-100 text-gray-700 border-gray-200',
  low: 'bg-gray-50 text-gray-500 border-gray-100',
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-100 text-blue-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  read: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
  snoozed: 'bg-amber-100 text-amber-700',
  archived: 'bg-gray-100 text-gray-600',
};

export default function NotificationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const t = useTranslation();
  const { record: notification, loading } = useRecord<Notification>('notifications', id);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleMarkRead = async () => {
    await fetch(`/api/collections/notifications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'read', readAt: new Date().toISOString() }),
    });
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        {t('loading', { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' })}
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="p-8 text-center text-gray-500">
        {t('notificationNotFound', { ru: 'Уведомление не найдено', en: 'Notification not found', uk: 'Сповіщення не знайдено' })}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/m/notifications"
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('back', { ru: 'Назад', en: 'Back', uk: 'Назад' })}
        </Link>

        {!notification.readAt && (
          <button
            onClick={handleMarkRead}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-lg shadow-sm transition-all"
          >
            {t('markAsRead', { ru: 'Отметить прочитанным', en: 'Mark as Read', uk: 'Позначити прочитаним' })}
          </button>
        )}
      </div>

      {/* Main Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm overflow-hidden">
        {/* Title Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{notification.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${priorityColors[notification.priority]}`}>
                  {notification.priority}
                </span>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[notification.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-600'}`}>
                  {notification.status}
                </span>
                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                  {notification.category}
                </span>
              </div>
            </div>

            {notification.aiScore !== null && notification.aiScore !== undefined && (
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{notification.aiScore}</div>
                <div className="text-xs text-gray-500">AI Score</div>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        {notification.body && (
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              {t('content', { ru: 'Содержание', en: 'Content', uk: 'Вміст' })}
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">{notification.body}</p>
          </div>
        )}

        {/* AI Tags */}
        {notification.aiTags && notification.aiTags.length > 0 && (
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">AI Tags</h3>
            <div className="flex flex-wrap gap-2">
              {notification.aiTags.map((tag, i) => (
                <span key={i} className="px-2 py-1 text-sm bg-purple-50 text-purple-700 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {notification.actions && notification.actions.length > 0 && (
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              {t('actions', { ru: 'Действия', en: 'Actions', uk: 'Дії' })}
            </h3>
            <div className="flex flex-wrap gap-2">
              {notification.actions.map((action, i) => (
                <Link
                  key={i}
                  href={action.url}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    action.style === 'primary'
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : action.style === 'success'
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : action.style === 'danger'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="p-6 bg-gray-50">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            {t('details', { ru: 'Детали', en: 'Details', uk: 'Деталі' })}
          </h3>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">{t('recipient', { ru: 'Получатель', en: 'Recipient', uk: 'Отримувач' })}</dt>
              <dd className="font-medium text-gray-900">{notification.userName}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{t('channel', { ru: 'Канал', en: 'Channel', uk: 'Канал' })}</dt>
              <dd className="font-medium text-gray-900">{notification.channel}</dd>
            </div>
            <div>
              <dt className="text-gray-500">{t('created', { ru: 'Создано', en: 'Created', uk: 'Створено' })}</dt>
              <dd className="font-medium text-gray-900">{formatDate(notification.createdAt)}</dd>
            </div>
            {notification.deliveredAt && (
              <div>
                <dt className="text-gray-500">{t('delivered', { ru: 'Доставлено', en: 'Delivered', uk: 'Доставлено' })}</dt>
                <dd className="font-medium text-gray-900">{formatDate(notification.deliveredAt)}</dd>
              </div>
            )}
            {notification.readAt && (
              <div>
                <dt className="text-gray-500">{t('read', { ru: 'Прочитано', en: 'Read', uk: 'Прочитано' })}</dt>
                <dd className="font-medium text-gray-900">{formatDate(notification.readAt)}</dd>
              </div>
            )}
            {notification.sourceUrl && (
              <div className="col-span-2">
                <dt className="text-gray-500">{t('source', { ru: 'Источник', en: 'Source', uk: 'Джерело' })}</dt>
                <dd>
                  <Link href={notification.sourceUrl} className="text-emerald-600 hover:underline">
                    {notification.sourceName || notification.sourceUrl}
                  </Link>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
