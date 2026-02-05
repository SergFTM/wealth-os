'use client';

import { useTranslation } from '@/lib/i18n';

interface Digest {
  id: string;
  userId: string;
  userName: string;
  title: string;
  frequency: 'hourly' | 'daily' | 'weekly';
  periodStart: string;
  periodEnd: string;
  notificationCount: number;
  channel: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  sentAt?: string | null;
  readAt?: string | null;
  createdAt: string;
}

interface NtDigestsTableProps {
  digests: Digest[];
}

const statusColors = {
  pending: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-100 text-blue-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  read: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
};

const frequencyLabels: Record<string, Record<string, string>> = {
  hourly: { ru: 'Ежечасно', en: 'Hourly', uk: 'Щогодини' },
  daily: { ru: 'Ежедневно', en: 'Daily', uk: 'Щодня' },
  weekly: { ru: 'Еженедельно', en: 'Weekly', uk: 'Щотижня' },
};

export function NtDigestsTable({ digests }: NtDigestsTableProps) {
  const t = useTranslation();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (digests.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="text-4xl mb-2">📬</div>
        <div>{t('noDigests', { ru: 'Нет дайджестов', en: 'No digests', uk: 'Немає дайджестів' })}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('digest', { ru: 'Дайджест', en: 'Digest', uk: 'Дайджест' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('recipient', { ru: 'Получатель', en: 'Recipient', uk: 'Отримувач' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('frequency', { ru: 'Частота', en: 'Frequency', uk: 'Частота' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('content', { ru: 'Содержание', en: 'Content', uk: 'Вміст' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('status', { ru: 'Статус', en: 'Status', uk: 'Статус' })}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {digests.map((digest) => (
            <tr key={digest.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900">{digest.title}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {formatDate(digest.periodStart)} — {formatDate(digest.periodEnd)}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-gray-900">{digest.userName}</div>
                <div className="text-xs text-gray-500">{digest.channel}</div>
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                  {frequencyLabels[digest.frequency]?.ru || digest.frequency}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-gray-600">
                  {digest.notificationCount} {t('notifications', { ru: 'уведомлений', en: 'notifications', uk: 'сповіщень' })}
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[digest.status]}`}>
                  {digest.status}
                </span>
                {digest.readAt && (
                  <div className="text-xs text-gray-400 mt-1">
                    {t('readAt', { ru: 'Прочитано', en: 'Read', uk: 'Прочитано' })}: {formatDate(digest.readAt)}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
