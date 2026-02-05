'use client';

import { useTranslation } from '@/lib/i18n';

export interface SlaPolicy {
  id: string;
  name: string;
  nameRu?: string | null;
  description?: string | null;
  appliesToType?: string | null;
  appliesToPriority?: string | null;
  responseHours?: number | null;
  resolutionHours: number;
  businessHoursOnly?: boolean;
  isDefault?: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CsSlaTableProps {
  policies: SlaPolicy[];
  locale?: string;
  onEdit?: (id: string) => void;
}

const typeLabels: Record<string, Record<string, string>> = {
  request: { ru: 'Запрос', en: 'Request', uk: 'Запит' },
  incident: { ru: 'Инцидент', en: 'Incident', uk: 'Інцидент' },
  change: { ru: 'Изменение', en: 'Change', uk: 'Зміна' },
  problem: { ru: 'Проблема', en: 'Problem', uk: 'Проблема' },
  all: { ru: 'Все', en: 'All', uk: 'Всі' },
};

const priorityLabels: Record<string, Record<string, string>> = {
  low: { ru: 'Низкий', en: 'Low', uk: 'Низький' },
  medium: { ru: 'Средний', en: 'Medium', uk: 'Середній' },
  high: { ru: 'Высокий', en: 'High', uk: 'Високий' },
  critical: { ru: 'Критичный', en: 'Critical', uk: 'Критичний' },
  all: { ru: 'Все', en: 'All', uk: 'Всі' },
};

function formatHours(hours: number, locale: string): string {
  if (hours < 1) {
    const minutes = Math.round(hours * 60);
    return locale === 'ru' ? `${minutes} мин` :
      locale === 'uk' ? `${minutes} хв` :
        `${minutes} min`;
  }
  if (hours < 24) {
    return locale === 'ru' ? `${hours} ч` :
      locale === 'uk' ? `${hours} год` :
        `${hours}h`;
  }
  const days = Math.round(hours / 24);
  return locale === 'ru' ? `${days} д` :
    locale === 'uk' ? `${days} д` :
      `${days}d`;
}

export function CsSlaTable({ policies, locale = 'ru', onEdit }: CsSlaTableProps) {
  const t = useTranslation();

  if (policies.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        {t('noSlaPolicies', { ru: 'Нет SLA политик', en: 'No SLA policies', uk: 'Немає SLA політик' })}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('name', { ru: 'Название', en: 'Name', uk: 'Назва' })}
            </th>
            <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('appliesTo', { ru: 'Применяется к', en: 'Applies To', uk: 'Застосовується до' })}
            </th>
            <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('responseTime', { ru: 'Ответ', en: 'Response', uk: 'Відповідь' })}
            </th>
            <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('resolutionTime', { ru: 'Решение', en: 'Resolution', uk: 'Рішення' })}
            </th>
            <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('hours', { ru: 'Часы', en: 'Hours', uk: 'Години' })}
            </th>
            <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('status', { ru: 'Статус', en: 'Status', uk: 'Статус' })}
            </th>
            {onEdit && (
              <th className="text-right p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('actions', { ru: 'Действия', en: 'Actions', uk: 'Дії' })}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {policies.map((policy) => (
            <tr key={policy.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    {locale === 'ru' && policy.nameRu ? policy.nameRu : policy.name}
                  </span>
                  {policy.isDefault && (
                    <span className="text-xs text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      {t('default', { ru: 'По умолч.', en: 'Default', uk: 'За замовч.' })}
                    </span>
                  )}
                </div>
                {policy.description && (
                  <div className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">
                    {policy.description}
                  </div>
                )}
              </td>
              <td className="p-3">
                <div className="text-sm text-gray-600">
                  {typeLabels[policy.appliesToType || 'all']?.[locale] || policy.appliesToType || '-'}
                  {' / '}
                  {priorityLabels[policy.appliesToPriority || 'all']?.[locale] || policy.appliesToPriority || '-'}
                </div>
              </td>
              <td className="p-3">
                <span className="text-sm text-gray-900">
                  {policy.responseHours ? formatHours(policy.responseHours, locale) : '-'}
                </span>
              </td>
              <td className="p-3">
                <span className="text-sm font-medium text-gray-900">
                  {formatHours(policy.resolutionHours, locale)}
                </span>
              </td>
              <td className="p-3">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  policy.businessHoursOnly
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {policy.businessHoursOnly
                    ? t('businessHours', { ru: 'Рабочие', en: 'Business', uk: 'Робочі' })
                    : t('allHours', { ru: '24/7', en: '24/7', uk: '24/7' })
                  }
                </span>
              </td>
              <td className="p-3">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  policy.isActive !== false
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {policy.isActive !== false
                    ? t('active', { ru: 'Активна', en: 'Active', uk: 'Активна' })
                    : t('inactive', { ru: 'Неактивна', en: 'Inactive', uk: 'Неактивна' })
                  }
                </span>
              </td>
              {onEdit && (
                <td className="p-3 text-right">
                  <button
                    onClick={() => onEdit(policy.id)}
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    {t('edit', { ru: 'Изменить', en: 'Edit', uk: 'Змінити' })}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
