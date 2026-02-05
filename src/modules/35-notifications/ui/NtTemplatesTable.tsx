'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

interface NotificationTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  locale: string;
  channels: string[];
  status: 'active' | 'draft' | 'archived';
  version: number;
  usageCount: number;
  createdAt: string;
}

interface NtTemplatesTableProps {
  templates: NotificationTemplate[];
}

const statusColors = {
  active: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-amber-100 text-amber-700',
  archived: 'bg-gray-100 text-gray-600',
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
  digest: { ru: 'Дайджест', en: 'Digest', uk: 'Дайджест' },
};

export function NtTemplatesTable({ templates }: NtTemplatesTableProps) {
  const t = useTranslation();

  if (templates.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="text-4xl mb-2">📝</div>
        <div>{t('noTemplates', { ru: 'Нет шаблонов', en: 'No templates', uk: 'Немає шаблонів' })}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('template', { ru: 'Шаблон', en: 'Template', uk: 'Шаблон' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('category', { ru: 'Категория', en: 'Category', uk: 'Категорія' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('channels', { ru: 'Каналы', en: 'Channels', uk: 'Канали' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('status', { ru: 'Статус', en: 'Status', uk: 'Статус' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('usage', { ru: 'Использование', en: 'Usage', uk: 'Використання' })}
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('actions', { ru: 'Действия', en: 'Actions', uk: 'Дії' })}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {templates.map((tpl) => (
            <tr key={tpl.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900">{tpl.name}</div>
                {tpl.description && (
                  <div className="text-sm text-gray-500 truncate max-w-xs">{tpl.description}</div>
                )}
                <div className="text-xs text-gray-400 mt-1">v{tpl.version}</div>
              </td>
              <td className="py-3 px-4">
                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">
                  {categoryLabels[tpl.category]?.ru || tpl.category}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1">
                  {tpl.channels.map((ch, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded">
                      {ch}
                    </span>
                  ))}
                </div>
              </td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[tpl.status]}`}>
                  {tpl.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="text-sm text-gray-600">
                  {tpl.usageCount.toLocaleString('ru-RU')} {t('times', { ru: 'раз', en: 'times', uk: 'разів' })}
                </div>
              </td>
              <td className="py-3 px-4">
                <Link
                  href={`/m/notifications/template/${tpl.id}`}
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
