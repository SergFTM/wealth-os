'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export interface CaseTemplate {
  id: string;
  name: string;
  nameRu?: string | null;
  description?: string | null;
  defaultType: string;
  defaultPriority: string;
  defaultRoutingRole?: string | null;
  isActive?: boolean;
  usageCount?: number;
  category?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CsTemplatesTableProps {
  templates: CaseTemplate[];
  locale?: string;
  onUseTemplate?: (id: string) => void;
}

const typeLabels: Record<string, Record<string, string>> = {
  request: { ru: 'Запрос', en: 'Request', uk: 'Запит' },
  incident: { ru: 'Инцидент', en: 'Incident', uk: 'Інцидент' },
  change: { ru: 'Изменение', en: 'Change', uk: 'Зміна' },
  problem: { ru: 'Проблема', en: 'Problem', uk: 'Проблема' },
};

const typeStyles: Record<string, string> = {
  request: 'bg-blue-50 text-blue-700',
  incident: 'bg-red-50 text-red-700',
  change: 'bg-purple-50 text-purple-700',
  problem: 'bg-orange-50 text-orange-700',
};

const priorityLabels: Record<string, Record<string, string>> = {
  low: { ru: 'Низкий', en: 'Low', uk: 'Низький' },
  medium: { ru: 'Средний', en: 'Medium', uk: 'Середній' },
  high: { ru: 'Высокий', en: 'High', uk: 'Високий' },
  critical: { ru: 'Критичный', en: 'Critical', uk: 'Критичний' },
};

export function CsTemplatesTable({ templates, locale = 'ru', onUseTemplate }: CsTemplatesTableProps) {
  const t = useTranslation();

  if (templates.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        {t('noTemplates', { ru: 'Нет шаблонов кейсов', en: 'No case templates', uk: 'Немає шаблонів кейсів' })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <div
          key={template.id}
          className={`
            p-4 rounded-xl border transition-all hover:shadow-md
            ${template.isActive !== false
              ? 'bg-white/80 border-gray-200 hover:border-emerald-300'
              : 'bg-gray-50 border-gray-200 opacity-60'
            }
          `}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <Link
                href={`/m/cases/template/${template.id}`}
                className="text-sm font-medium text-gray-900 hover:text-emerald-600"
              >
                {locale === 'ru' && template.nameRu ? template.nameRu : template.name}
              </Link>
              {template.category && (
                <div className="text-xs text-gray-500 mt-0.5">{template.category}</div>
              )}
            </div>
            {template.isActive === false && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {t('inactive', { ru: 'Неактивен', en: 'Inactive', uk: 'Неактивний' })}
              </span>
            )}
          </div>

          {template.description && (
            <p className="text-xs text-gray-600 mb-3 line-clamp-2">{template.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`px-2 py-0.5 text-xs font-medium rounded ${typeStyles[template.defaultType] || ''}`}>
              {typeLabels[template.defaultType]?.[locale] || template.defaultType}
            </span>
            <span className="text-xs text-gray-500">
              {priorityLabels[template.defaultPriority]?.[locale] || template.defaultPriority}
            </span>
            {template.defaultRoutingRole && (
              <span className="text-xs text-gray-400">
                → {template.defaultRoutingRole}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-400">
              {t('usedTimes', {
                ru: `Использован ${template.usageCount || 0} раз`,
                en: `Used ${template.usageCount || 0} times`,
                uk: `Використано ${template.usageCount || 0} разів`,
              })}
            </div>
            {onUseTemplate && template.isActive !== false && (
              <button
                onClick={() => onUseTemplate(template.id)}
                className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
              >
                {t('useTemplate', { ru: 'Использовать', en: 'Use', uk: 'Використати' })}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
