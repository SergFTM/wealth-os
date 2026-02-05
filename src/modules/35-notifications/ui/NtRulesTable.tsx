'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

interface NotificationRule {
  id: string;
  name: string;
  description?: string;
  triggerType: string;
  triggerEvent?: string;
  priority: string;
  category?: string;
  status: 'active' | 'paused' | 'disabled';
  channels: string[];
  firedCount: number;
  lastFiredAt?: string | null;
  createdAt: string;
}

interface NtRulesTableProps {
  rules: NotificationRule[];
}

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  paused: 'bg-amber-100 text-amber-700',
  disabled: 'bg-gray-100 text-gray-600',
};

const triggerTypeLabels: Record<string, Record<string, string>> = {
  event: { ru: 'Событие', en: 'Event', uk: 'Подія' },
  schedule: { ru: 'Расписание', en: 'Schedule', uk: 'Розклад' },
  condition: { ru: 'Условие', en: 'Condition', uk: 'Умова' },
  threshold: { ru: 'Порог', en: 'Threshold', uk: 'Поріг' },
  manual: { ru: 'Ручной', en: 'Manual', uk: 'Ручний' },
};

export function NtRulesTable({ rules }: NtRulesTableProps) {
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

  if (rules.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="text-4xl mb-2">📋</div>
        <div>{t('noRules', { ru: 'Нет правил', en: 'No rules', uk: 'Немає правил' })}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('rule', { ru: 'Правило', en: 'Rule', uk: 'Правило' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('trigger', { ru: 'Триггер', en: 'Trigger', uk: 'Тригер' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('channels', { ru: 'Каналы', en: 'Channels', uk: 'Канали' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('status', { ru: 'Статус', en: 'Status', uk: 'Статус' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('stats', { ru: 'Статистика', en: 'Stats', uk: 'Статистика' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('actions', { ru: 'Действия', en: 'Actions', uk: 'Дії' })}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rules.map((rule) => (
            <tr key={rule.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900">{rule.name}</div>
                {rule.description && (
                  <div className="text-sm text-gray-500 truncate max-w-xs">{rule.description}</div>
                )}
              </td>
              <td className="py-3 px-4">
                <div className="text-sm">
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                    {triggerTypeLabels[rule.triggerType]?.ru || rule.triggerType}
                  </span>
                </div>
                {rule.triggerEvent && (
                  <div className="text-xs text-gray-500 mt-1">{rule.triggerEvent}</div>
                )}
              </td>
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1">
                  {rule.channels.map((ch, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded">
                      {ch}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[rule.status]}`}>
                  {rule.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-gray-600">
                  <div>{t('fired', { ru: 'Сработало', en: 'Fired', uk: 'Спрацювало' })}: {rule.firedCount}</div>
                  <div className="text-xs text-gray-400">
                    {t('lastFired', { ru: 'Последний раз', en: 'Last fired', uk: 'Останній раз' })}: {formatDate(rule.lastFiredAt)}
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <Link
                  href={`/m/notifications/rule/${rule.id}`}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  {t('edit', { ru: 'Изменить', en: 'Edit', uk: 'Змінити' })}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
