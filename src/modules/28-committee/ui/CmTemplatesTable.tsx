'use client';

/**
 * Committee Templates Table Component
 */

import { CommitteeTemplate } from '../schema/committeeTemplate';

interface CmTemplatesTableProps {
  templates: CommitteeTemplate[];
  onEdit?: (id: string) => void;
  onApply?: (id: string) => void;
  onDelete?: (id: string) => void;
  lang?: 'ru' | 'en' | 'uk';
}

const labels = {
  ru: {
    name: 'Название',
    type: 'Тип',
    items: 'Пунктов',
    default: 'По умолчанию',
    created: 'Создан',
    actions: 'Действия',
    edit: 'Редактировать',
    apply: 'Применить',
    delete: 'Удалить',
    noTemplates: 'Нет шаблонов',
    types: {
      agenda: 'Повестка',
      minutes: 'Протокол',
      pack: 'Пакет',
    },
    yes: 'Да',
    no: 'Нет',
  },
  en: {
    name: 'Name',
    type: 'Type',
    items: 'Items',
    default: 'Default',
    created: 'Created',
    actions: 'Actions',
    edit: 'Edit',
    apply: 'Apply',
    delete: 'Delete',
    noTemplates: 'No templates',
    types: {
      agenda: 'Agenda',
      minutes: 'Minutes',
      pack: 'Pack',
    },
    yes: 'Yes',
    no: 'No',
  },
  uk: {
    name: 'Назва',
    type: 'Тип',
    items: 'Пунктів',
    default: 'За замовч.',
    created: 'Створено',
    actions: 'Дії',
    edit: 'Редагувати',
    apply: 'Застосувати',
    delete: 'Видалити',
    noTemplates: 'Немає шаблонів',
    types: {
      agenda: 'Порядок',
      minutes: 'Протокол',
      pack: 'Пакет',
    },
    yes: 'Так',
    no: 'Ні',
  },
};

export function CmTemplatesTable({
  templates,
  onEdit,
  onApply,
  onDelete,
  lang = 'ru',
}: CmTemplatesTableProps) {
  const l = labels[lang];

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(
      lang === 'ru' ? 'ru-RU' : lang === 'uk' ? 'uk-UA' : 'en-US',
      { day: 'numeric', month: 'short', year: 'numeric' }
    );
  };

  const getTypeLabel = (type: CommitteeTemplate['type']) => {
    return l.types[type] || type;
  };

  if (templates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">{l.noTemplates}</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.name}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.type}
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.items}
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.default}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.created}
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {l.actions}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {templates.map(template => (
            <tr key={template.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div>
                  <span className="font-medium text-gray-900">{template.name}</span>
                  {template.description && (
                    <p className="text-sm text-gray-500 truncate max-w-xs">{template.description}</p>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1">
                  {getTypeLabel(template.type)}
                </span>
              </td>
              <td className="px-4 py-3 text-center text-sm text-gray-600">
                {template.agendaDefaults.length}
              </td>
              <td className="px-4 py-3 text-center">
                {template.isDefault ? (
                  <span className="text-emerald-600 text-sm font-medium">{l.yes}</span>
                ) : (
                  <span className="text-gray-400 text-sm">{l.no}</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {formatDate(template.createdAt)}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  {onApply && (
                    <button
                      onClick={() => onApply(template.id)}
                      className="text-sm text-emerald-600 hover:text-emerald-700"
                    >
                      {l.apply}
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(template.id)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {l.edit}
                    </button>
                  )}
                  {onDelete && !template.isDefault && (
                    <button
                      onClick={() => onDelete(template.id)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      {l.delete}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
