'use client';

import { useTranslation } from '@/lib/i18n';
import { CsPriorityPill } from './CsPriorityPill';

export interface TemplateDetail {
  id: string;
  clientId: string;
  name: string;
  nameRu?: string | null;
  nameUk?: string | null;
  description?: string | null;
  descriptionRu?: string | null;
  descriptionUk?: string | null;
  defaultType: string;
  defaultPriority: 'low' | 'medium' | 'high' | 'critical';
  defaultSlaPolicyId?: string | null;
  defaultRoutingRole?: string | null;
  defaultAssigneeUserId?: string | null;
  defaultScopeType?: string | null;
  defaultClientVisible?: boolean;
  titleTemplate?: string | null;
  descriptionTemplate?: string | null;
  fieldsJson?: string | null;
  tagsJson?: string | null;
  isActive?: boolean;
  usageCount?: number;
  category?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CsTemplateDetailProps {
  template: TemplateDetail;
  locale?: string;
  onUseTemplate?: () => void;
  onEdit?: () => void;
}

const typeLabels: Record<string, Record<string, string>> = {
  request: { ru: 'Запрос', en: 'Request', uk: 'Запит' },
  incident: { ru: 'Инцидент', en: 'Incident', uk: 'Інцидент' },
  change: { ru: 'Изменение', en: 'Change', uk: 'Зміна' },
  problem: { ru: 'Проблема', en: 'Problem', uk: 'Проблема' },
};

export function CsTemplateDetail({ template, locale = 'ru', onUseTemplate, onEdit }: CsTemplateDetailProps) {
  const t = useTranslation();

  const name = locale === 'ru' && template.nameRu ? template.nameRu :
    locale === 'uk' && template.nameUk ? template.nameUk :
      template.name;

  const description = locale === 'ru' && template.descriptionRu ? template.descriptionRu :
    locale === 'uk' && template.descriptionUk ? template.descriptionUk :
      template.description;

  const fields = template.fieldsJson ? JSON.parse(template.fieldsJson) : [];
  const tags = template.tagsJson ? JSON.parse(template.tagsJson) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                {t('template', { ru: 'Шаблон', en: 'Template', uk: 'Шаблон' })}
              </span>
              <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                {typeLabels[template.defaultType]?.[locale] || template.defaultType}
              </span>
              {template.isActive === false && (
                <span className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded">
                  {t('inactive', { ru: 'Неактивен', en: 'Inactive', uk: 'Неактивний' })}
                </span>
              )}
            </div>

            <h1 className="text-xl font-semibold text-gray-900 mb-2">{name}</h1>

            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
          </div>

          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {t('edit', { ru: 'Редактировать', en: 'Edit', uk: 'Редагувати' })}
              </button>
            )}
            {onUseTemplate && template.isActive !== false && (
              <button
                onClick={onUseTemplate}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
              >
                {t('createCase', { ru: 'Создать кейс', en: 'Create Case', uk: 'Створити кейс' })}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Defaults */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm p-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4">
          {t('defaultValues', { ru: 'Значения по умолчанию', en: 'Default Values', uk: 'Значення за замовчуванням' })}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">
              {t('priority', { ru: 'Приоритет', en: 'Priority', uk: 'Пріоритет' })}
            </div>
            <CsPriorityPill priority={template.defaultPriority} locale={locale} />
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">
              {t('routing', { ru: 'Маршрутизация', en: 'Routing', uk: 'Маршрутизація' })}
            </div>
            <div className="text-sm text-gray-900">
              {template.defaultRoutingRole || '-'}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">
              {t('scopeType', { ru: 'Scope', en: 'Scope Type', uk: 'Scope' })}
            </div>
            <div className="text-sm text-gray-900 capitalize">
              {template.defaultScopeType || '-'}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">
              {t('clientVisible', { ru: 'Видно клиенту', en: 'Client Visible', uk: 'Видно клієнту' })}
            </div>
            <div className="text-sm text-gray-900">
              {template.defaultClientVisible
                ? t('yes', { ru: 'Да', en: 'Yes', uk: 'Так' })
                : t('no', { ru: 'Нет', en: 'No', uk: 'Ні' })
              }
            </div>
          </div>
        </div>
      </div>

      {/* Title/Description Templates */}
      {(template.titleTemplate || template.descriptionTemplate) && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">
            {t('templates', { ru: 'Шаблоны текста', en: 'Text Templates', uk: 'Шаблони тексту' })}
          </h2>

          {template.titleTemplate && (
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">
                {t('titleTemplate', { ru: 'Шаблон заголовка', en: 'Title Template', uk: 'Шаблон заголовку' })}
              </div>
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg font-mono">
                {template.titleTemplate}
              </div>
            </div>
          )}

          {template.descriptionTemplate && (
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {t('descriptionTemplate', { ru: 'Шаблон описания', en: 'Description Template', uk: 'Шаблон опису' })}
              </div>
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                {template.descriptionTemplate}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Fields */}
      {fields.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">
            {t('customFields', { ru: 'Дополнительные поля', en: 'Custom Fields', uk: 'Додаткові поля' })}
          </h2>

          <div className="space-y-2">
            {fields.map((field: { name: string; type: string; required?: boolean }, idx: number) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <span className="text-gray-900">{field.name}</span>
                <span className="text-gray-400 text-xs">{field.type}</span>
                {field.required && (
                  <span className="text-red-500 text-xs">*</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm p-6">
          <h2 className="text-sm font-medium text-gray-900 mb-4">
            {t('tags', { ru: 'Теги', en: 'Tags', uk: 'Теги' })}
          </h2>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag: string, idx: number) => (
              <span key={idx} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Usage Stats */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm p-6">
        <h2 className="text-sm font-medium text-gray-900 mb-4">
          {t('statistics', { ru: 'Статистика', en: 'Statistics', uk: 'Статистика' })}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">
              {t('timesUsed', { ru: 'Использований', en: 'Times Used', uk: 'Разів використано' })}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {template.usageCount || 0}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">
              {t('lastUpdated', { ru: 'Обновлен', en: 'Last Updated', uk: 'Оновлено' })}
            </div>
            <div className="text-sm text-gray-900">
              {new Date(template.updatedAt).toLocaleDateString(locale)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
