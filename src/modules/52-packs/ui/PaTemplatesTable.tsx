"use client";

import Link from 'next/link';

interface PackTemplate {
  id: string;
  name: string;
  description?: string;
  audienceKey: string;
  defaultClientSafe: boolean;
  defaultSensitivityKey: 'low' | 'medium' | 'high';
  defaultItemsJson?: Array<{ title: string }>;
  usageCount?: number;
  createdAt: string;
}

interface PaTemplatesTableProps {
  templates: PackTemplate[];
  onOpen: (id: string) => void;
  onCreatePack?: (templateId: string) => void;
}

const audienceLabels: Record<string, string> = {
  auditor: 'Аудитор',
  bank: 'Банк',
  tax: 'Налоговый',
  legal: 'Юридический',
  committee: 'Комитет',
  investor: 'Инвестор',
  regulator: 'Регулятор',
  general: 'Общий',
};

export function PaTemplatesTable({ templates, onOpen, onCreatePack }: PaTemplatesTableProps) {
  if (templates.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        <svg className="w-12 h-12 mx-auto mb-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="font-medium">Шаблоны не найдены</p>
        <p className="text-sm mt-1">Создайте шаблон для быстрого формирования пакетов</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="text-left py-3 px-4 font-medium text-stone-600">Название</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Аудитория</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Документов</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Client-safe</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Использований</th>
            <th className="text-right py-3 px-4 font-medium text-stone-600"></th>
          </tr>
        </thead>
        <tbody>
          {templates.map((template) => (
            <tr
              key={template.id}
              className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
              onClick={() => onOpen(template.id)}
            >
              <td className="py-3 px-4">
                <div>
                  <div className="font-medium text-stone-800">{template.name}</div>
                  {template.description && (
                    <div className="text-xs text-stone-500 mt-0.5">{template.description}</div>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 text-stone-600">
                {audienceLabels[template.audienceKey] || template.audienceKey}
              </td>
              <td className="py-3 px-4 text-stone-600">
                {template.defaultItemsJson?.length || 0}
              </td>
              <td className="py-3 px-4">
                {template.defaultClientSafe ? (
                  <span className="text-emerald-600">✓</span>
                ) : (
                  <span className="text-stone-400">—</span>
                )}
              </td>
              <td className="py-3 px-4 text-stone-600">
                {template.usageCount || 0}
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {onCreatePack && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCreatePack(template.id);
                      }}
                      className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200"
                    >
                      Создать пакет
                    </button>
                  )}
                  <Link
                    href={`/m/packs/template/${template.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Открыть
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PaTemplateCard({
  template,
  onUse,
}: {
  template: PackTemplate;
  onUse: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-stone-800">{template.name}</h3>
          <p className="text-sm text-stone-500 mt-1">{template.description}</p>
        </div>
        <span className="text-xs px-2 py-1 bg-stone-100 text-stone-600 rounded">
          {audienceLabels[template.audienceKey]}
        </span>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-stone-500">
          {template.defaultItemsJson?.length || 0} документов
        </span>
        <button
          onClick={onUse}
          className="px-3 py-1.5 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          Использовать
        </button>
      </div>
    </div>
  );
}
