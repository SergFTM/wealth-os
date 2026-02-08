"use client";

import { useState } from 'react';

interface PackTemplate {
  id: string;
  name: string;
  description?: string;
  audienceKey: string;
  defaultClientSafe: boolean;
  defaultSensitivityKey: 'low' | 'medium' | 'high';
  defaultWatermarkKey?: 'on' | 'off';
  defaultItemsJson?: TemplateItem[];
  coverLetterTemplateMd?: string;
  usageCount?: number;
  createdAt: string;
  updatedAt?: string;
}

interface TemplateItem {
  itemTypeKey: string;
  title: string;
  required?: boolean;
  clientSafe?: boolean;
}

interface PaTemplateDetailProps {
  template: PackTemplate;
  onEdit?: () => void;
  onCreatePack?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
}

const audienceLabels: Record<string, string> = {
  auditor: 'Аудитор',
  bank: 'Банк',
  tax: 'Налоговый консультант',
  legal: 'Юридический советник',
  committee: 'Инвестиционный комитет',
  investor: 'Со-инвестор',
  regulator: 'Регулятор',
  general: 'Общий',
};

const sensitivityLabels: Record<string, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
};

const itemTypeLabels: Record<string, { label: string; icon: string }> = {
  document: { label: 'Документ', icon: '📄' },
  export: { label: 'Экспорт', icon: '📊' },
  snapshot: { label: 'Снимок', icon: '📸' },
  cover_letter: { label: 'Cover Letter', icon: '✉️' },
  checklist: { label: 'Чеклист', icon: '✅' },
};

export function PaTemplateDetail({
  template,
  onEdit,
  onCreatePack,
  onDelete,
  onBack,
}: PaTemplateDetailProps) {
  const [activeTab, setActiveTab] = useState<'items' | 'settings' | 'cover_letter'>('items');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          {onBack && (
            <button onClick={onBack} className="text-sm text-stone-500 hover:text-stone-700 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Назад к списку
            </button>
          )}
          <h1 className="text-2xl font-semibold text-stone-800">{template.name}</h1>
          {template.description && (
            <p className="text-stone-500 mt-1">{template.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs px-2 py-1 bg-stone-100 text-stone-600 rounded">
              {audienceLabels[template.audienceKey]}
            </span>
            <span className="text-sm text-stone-500">
              Использований: {template.usageCount || 0}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onCreatePack && (
            <button
              onClick={onCreatePack}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
            >
              Создать пакет
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200"
            >
              Редактировать
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-4 py-2 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50"
            >
              Удалить
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab('items')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'items'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            Документы ({template.defaultItemsJson?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            Настройки
          </button>
          <button
            onClick={() => setActiveTab('cover_letter')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'cover_letter'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            Cover Letter
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          {template.defaultItemsJson && template.defaultItemsJson.length > 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50">
                    <th className="text-left py-3 px-4 font-medium text-stone-600">Тип</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-600">Название</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-600">Обязательный</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-600">Client-safe</th>
                  </tr>
                </thead>
                <tbody>
                  {template.defaultItemsJson.map((item, idx) => (
                    <tr key={idx} className="border-b border-stone-100">
                      <td className="py-3 px-4">
                        <span className="flex items-center gap-2">
                          <span>{itemTypeLabels[item.itemTypeKey]?.icon || '📎'}</span>
                          <span className="text-stone-600">{itemTypeLabels[item.itemTypeKey]?.label || item.itemTypeKey}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-800">{item.title}</td>
                      <td className="py-3 px-4">
                        {item.required ? (
                          <span className="text-amber-600">Да</span>
                        ) : (
                          <span className="text-stone-400">Нет</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {item.clientSafe !== false ? (
                          <span className="text-emerald-600">✓</span>
                        ) : (
                          <span className="text-stone-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-stone-500">
              <p>Нет документов в шаблоне</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="font-medium text-stone-800 mb-4">Настройки по умолчанию</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Client-safe</span>
                <span className={template.defaultClientSafe ? 'text-emerald-600' : 'text-stone-600'}>
                  {template.defaultClientSafe ? 'Да' : 'Нет'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Чувствительность</span>
                <span className="text-stone-800">{sensitivityLabels[template.defaultSensitivityKey]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Водяной знак</span>
                <span className={template.defaultWatermarkKey === 'on' ? 'text-emerald-600' : 'text-stone-600'}>
                  {template.defaultWatermarkKey === 'on' ? 'Включён' : 'Выключен'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="font-medium text-stone-800 mb-4">Информация</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Создан</span>
                <span className="text-stone-800">{formatDate(template.createdAt)}</span>
              </div>
              {template.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Обновлён</span>
                  <span className="text-stone-800">{formatDate(template.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'cover_letter' && (
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <h3 className="font-medium text-stone-800 mb-4">Шаблон сопроводительного письма</h3>
          {template.coverLetterTemplateMd ? (
            <pre className="whitespace-pre-wrap text-sm text-stone-600 bg-stone-50 p-4 rounded-lg">
              {template.coverLetterTemplateMd}
            </pre>
          ) : (
            <p className="text-stone-500 text-sm">Шаблон не задан. Будет использован стандартный.</p>
          )}
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU');
}
