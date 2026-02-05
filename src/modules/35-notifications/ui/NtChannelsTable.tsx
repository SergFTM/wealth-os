'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

interface NotificationChannel {
  id: string;
  type: string;
  name: string;
  description?: string;
  status: 'active' | 'paused' | 'error' | 'disabled';
  stats?: {
    sentCount: number;
    deliveredCount: number;
    failedCount: number;
    lastSentAt?: string | null;
    lastError?: string | null;
  };
  createdAt: string;
}

interface NtChannelsTableProps {
  channels: NotificationChannel[];
}

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  paused: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  disabled: 'bg-gray-100 text-gray-600',
};

const channelIcons: Record<string, string> = {
  inbox: '📥',
  email: '✉️',
  sms: '📱',
  push: '🔔',
  slack: '💬',
  teams: '👥',
  webhook: '🔗',
};

export function NtChannelsTable({ channels }: NtChannelsTableProps) {
  const t = useTranslation();

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDeliveryRate = (stats?: { deliveredCount: number; sentCount: number }) => {
    if (!stats || stats.sentCount === 0) return '—';
    const rate = (stats.deliveredCount / stats.sentCount) * 100;
    return `${rate.toFixed(1)}%`;
  };

  if (channels.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="text-4xl mb-2">📡</div>
        <div>{t('noChannels', { ru: 'Нет каналов', en: 'No channels', uk: 'Немає каналів' })}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('channel', { ru: 'Канал', en: 'Channel', uk: 'Канал' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('status', { ru: 'Статус', en: 'Status', uk: 'Статус' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('stats', { ru: 'Статистика', en: 'Stats', uk: 'Статистика' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('deliveryRate', { ru: 'Доставляемость', en: 'Delivery Rate', uk: 'Доставляємість' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('lastActivity', { ru: 'Последняя активность', en: 'Last Activity', uk: 'Остання активність' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('actions', { ru: 'Действия', en: 'Actions', uk: 'Дії' })}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {channels.map((channel) => (
            <tr key={channel.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{channelIcons[channel.type] || '📡'}</span>
                  <div>
                    <div className="font-medium text-gray-900">{channel.name}</div>
                    <div className="text-xs text-gray-500">{channel.type}</div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[channel.status]}`}>
                  {channel.status}
                </span>
                {channel.status === 'error' && channel.stats?.lastError && (
                  <div className="text-xs text-red-600 mt-1 truncate max-w-xs">
                    {channel.stats.lastError}
                  </div>
                )}
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-gray-600">
                  <div>{t('sent', { ru: 'Отправлено', en: 'Sent', uk: 'Надіслано' })}: {channel.stats?.sentCount?.toLocaleString('ru-RU') || 0}</div>
                  <div className="text-xs text-gray-400">
                    {t('failed', { ru: 'Ошибок', en: 'Failed', uk: 'Помилок' })}: {channel.stats?.failedCount || 0}
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`text-sm font-medium ${
                  channel.stats && channel.stats.sentCount > 0
                    ? channel.stats.deliveredCount / channel.stats.sentCount >= 0.95
                      ? 'text-emerald-600'
                      : channel.stats.deliveredCount / channel.stats.sentCount >= 0.9
                        ? 'text-amber-600'
                        : 'text-red-600'
                    : 'text-gray-400'
                }`}>
                  {calculateDeliveryRate(channel.stats)}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-gray-600">
                  {formatDate(channel.stats?.lastSentAt)}
                </div>
              </td>
              <td className="py-3 px-4">
                <Link
                  href={`/m/notifications/channel/${channel.id}`}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  {t('configure', { ru: 'Настроить', en: 'Configure', uk: 'Налаштувати' })}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
