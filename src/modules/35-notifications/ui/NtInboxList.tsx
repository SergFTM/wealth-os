'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

interface Notification {
  id: string;
  title: string;
  body?: string;
  category: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: string;
  readAt?: string | null;
  sourceUrl?: string;
  aiScore?: number | null;
  aiTags?: string[];
  escalationId?: string | null;
  createdAt: string;
}

interface NtInboxListProps {
  notifications: Notification[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onMarkRead: (ids: string[]) => void;
}

const priorityColors = {
  urgent: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-amber-100 text-amber-700 border-amber-200',
  normal: 'bg-gray-100 text-gray-700 border-gray-200',
  low: 'bg-gray-50 text-gray-500 border-gray-100',
};

const categoryIcons: Record<string, string> = {
  task: '📋',
  approval: '✅',
  alert: '⚠️',
  reminder: '🔔',
  system: '⚙️',
  compliance: '📜',
  report: '📊',
  message: '💬',
  escalation: '🔺',
};

const categoryLabels: Record<string, Record<string, string>> = {
  task: { ru: 'Задача', en: 'Task', uk: 'Завдання' },
  approval: { ru: 'Одобрение', en: 'Approval', uk: 'Схвалення' },
  alert: { ru: 'Оповещение', en: 'Alert', uk: 'Оповіщення' },
  reminder: { ru: 'Напоминание', en: 'Reminder', uk: 'Нагадування' },
  system: { ru: 'Система', en: 'System', uk: 'Система' },
  compliance: { ru: 'Комплаенс', en: 'Compliance', uk: 'Комплаєнс' },
  report: { ru: 'Отчёт', en: 'Report', uk: 'Звіт' },
  message: { ru: 'Сообщение', en: 'Message', uk: 'Повідомлення' },
  escalation: { ru: 'Эскалация', en: 'Escalation', uk: 'Ескалація' },
};

export function NtInboxList({ notifications, selectedIds, onSelectionChange, onMarkRead }: NtInboxListProps) {
  const t = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(notifications.map(n => n.id));
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return t('justNow', { ru: 'только что', en: 'just now', uk: 'щойно' });
    if (diffMins < 60) return `${diffMins} ${t('minsAgo', { ru: 'мин. назад', en: 'mins ago', uk: 'хв. тому' })}`;
    if (diffHours < 24) return `${diffHours} ${t('hoursAgo', { ru: 'ч. назад', en: 'hours ago', uk: 'год. тому' })}`;
    if (diffDays < 7) return `${diffDays} ${t('daysAgo', { ru: 'дн. назад', en: 'days ago', uk: 'дн. тому' })}`;
    return date.toLocaleDateString('ru-RU');
  };

  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="text-4xl mb-2">📭</div>
        <div>{t('noNotifications', { ru: 'Нет уведомлений', en: 'No notifications', uk: 'Немає сповіщень' })}</div>
      </div>
    );
  }

  return (
    <div>
      {/* Select All Header */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
        <input
          type="checkbox"
          checked={selectedIds.length === notifications.length && notifications.length > 0}
          onChange={handleSelectAll}
          className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
        />
        <span className="text-sm text-gray-600">
          {selectedIds.length > 0
            ? t('selectedCount', { ru: `Выбрано: ${selectedIds.length}`, en: `Selected: ${selectedIds.length}`, uk: `Обрано: ${selectedIds.length}` })
            : t('selectAll', { ru: 'Выбрать все', en: 'Select all', uk: 'Обрати все' })
          }
        </span>
      </div>

      {/* Notification List */}
      <div className="divide-y divide-gray-100">
        {notifications.map((notif) => {
          const isUnread = !notif.readAt;
          const isSelected = selectedIds.includes(notif.id);
          const isExpanded = expandedId === notif.id;
          const hasEscalation = !!notif.escalationId;

          return (
            <div
              key={notif.id}
              className={`
                relative transition-colors
                ${isUnread ? 'bg-emerald-50/50' : 'bg-white'}
                ${isSelected ? 'bg-emerald-100/50' : ''}
                hover:bg-gray-50
              `}
            >
              <div className="p-4 flex items-start gap-3">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleSelect(notif.id)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />

                {/* Unread indicator */}
                {isUnread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l" />
                )}

                {/* Category Icon */}
                <div className="text-xl">{categoryIcons[notif.category] || '📌'}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <div
                        className={`font-medium ${isUnread ? 'text-gray-900' : 'text-gray-700'} truncate cursor-pointer`}
                        onClick={() => setExpandedId(isExpanded ? null : notif.id)}
                      >
                        {hasEscalation && <span className="text-red-500 mr-1">🔺</span>}
                        {notif.title}
                      </div>

                      {/* Body preview */}
                      {notif.body && !isExpanded && (
                        <div className="text-sm text-gray-500 truncate mt-0.5">
                          {notif.body}
                        </div>
                      )}

                      {/* Expanded body */}
                      {notif.body && isExpanded && (
                        <div className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">
                          {notif.body}
                        </div>
                      )}

                      {/* Tags and meta */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {/* Priority */}
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${priorityColors[notif.priority]}`}>
                          {notif.priority === 'urgent' && '🔥 '}{notif.priority}
                        </span>

                        {/* Category */}
                        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                          {categoryLabels[notif.category]?.ru || notif.category}
                        </span>

                        {/* AI Score */}
                        {notif.aiScore !== null && notif.aiScore !== undefined && (
                          <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                            AI: {notif.aiScore}
                          </span>
                        )}

                        {/* AI Tags */}
                        {notif.aiTags?.slice(0, 2).map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Time and actions */}
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatTime(notif.createdAt)}
                      </span>

                      <div className="flex items-center gap-1">
                        {isUnread && (
                          <button
                            onClick={() => onMarkRead([notif.id])}
                            className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                            title={t('markRead', { ru: 'Отметить прочитанным', en: 'Mark as read', uk: 'Позначити прочитаним' })}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}

                        {notif.sourceUrl && (
                          <Link
                            href={notif.sourceUrl}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title={t('openSource', { ru: 'Открыть источник', en: 'Open source', uk: 'Відкрити джерело' })}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
