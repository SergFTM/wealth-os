"use client";

import { useState } from 'react';
import { PaAiCompact } from './PaAiPanel';

interface WizardItem {
  id: string;
  itemTypeKey: string;
  title: string;
  include: boolean;
  clientSafe: boolean;
  sensitivityKey: string;
}

interface ContentData {
  items: WizardItem[];
  coverLetterMd?: string;
  recipientType?: string;
}

interface PaWizardStepContentProps {
  data: ContentData;
  errors: Record<string, string>;
  onChange: (data: Partial<ContentData>) => void;
}

const SUGGESTED_ITEMS: WizardItem[] = [
  { id: 'cover', itemTypeKey: 'cover_letter', title: 'Сопроводительное письмо', include: true, clientSafe: true, sensitivityKey: 'low' },
  { id: 'net_worth', itemTypeKey: 'export', title: 'Отчёт о чистой стоимости', include: true, clientSafe: true, sensitivityKey: 'medium' },
  { id: 'gl', itemTypeKey: 'export', title: 'Выписка из главной книги (GL)', include: false, clientSafe: true, sensitivityKey: 'high' },
  { id: 'performance', itemTypeKey: 'export', title: 'Отчёт о доходности', include: true, clientSafe: true, sensitivityKey: 'medium' },
  { id: 'liquidity', itemTypeKey: 'export', title: 'Сводка по ликвидности', include: true, clientSafe: true, sensitivityKey: 'medium' },
  { id: 'ownership', itemTypeKey: 'snapshot', title: 'Структура владения (snapshot)', include: true, clientSafe: true, sensitivityKey: 'medium' },
  { id: 'bank_stmt', itemTypeKey: 'document', title: 'Банковские выписки', include: false, clientSafe: true, sensitivityKey: 'high' },
  { id: 'custodian', itemTypeKey: 'document', title: 'Отчёты кастодианов', include: false, clientSafe: true, sensitivityKey: 'high' },
];

const itemTypeLabels: Record<string, { label: string; icon: string }> = {
  document: { label: 'Документ', icon: '📄' },
  export: { label: 'Экспорт', icon: '📊' },
  snapshot: { label: 'Снимок', icon: '📸' },
  cover_letter: { label: 'Cover Letter', icon: '✉️' },
  checklist: { label: 'Чеклист', icon: '✅' },
};

const sensitivityColors: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

export function PaWizardStepContent({ data, errors, onChange }: PaWizardStepContentProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  // Initialize with suggested items if empty
  if (data.items.length === 0) {
    onChange({ items: SUGGESTED_ITEMS });
  }

  const handleToggleItem = (itemId: string) => {
    const newItems = data.items.map(item =>
      item.id === itemId ? { ...item, include: !item.include } : item
    );
    onChange({ items: newItems });
  };

  const handleRemoveItem = (itemId: string) => {
    const newItems = data.items.filter(item => item.id !== itemId);
    onChange({ items: newItems });
  };

  const handleAiAction = async (action: string) => {
    setAiLoading(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAiLoading(false);
  };

  const includedCount = data.items.filter(i => i.include).length;
  const totalCount = data.items.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-800 mb-2">Содержимое пакета</h2>
        <p className="text-stone-500">Выберите документы и отчёты для включения в пакет</p>
      </div>

      {/* AI Actions */}
      <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
        <PaAiCompact onAction={handleAiAction} isLoading={aiLoading} />
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between bg-stone-50 rounded-lg p-3">
        <span className="text-sm text-stone-600">
          Выбрано: <span className="font-medium text-stone-800">{includedCount}</span> из {totalCount}
        </span>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 text-sm bg-white border border-stone-300 rounded-lg hover:bg-stone-50"
        >
          + Добавить из Vault
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {data.items.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
              item.include
                ? 'bg-white border-stone-200'
                : 'bg-stone-50 border-stone-100 opacity-60'
            }`}
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={item.include}
              onChange={() => handleToggleItem(item.id)}
              className="w-5 h-5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
            />

            {/* Icon */}
            <span className="text-xl">
              {itemTypeLabels[item.itemTypeKey]?.icon || '📎'}
            </span>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-stone-800">{item.title}</div>
              <div className="text-xs text-stone-500">
                {itemTypeLabels[item.itemTypeKey]?.label}
              </div>
            </div>

            {/* Sensitivity */}
            <span className={`px-2 py-0.5 text-xs rounded ${sensitivityColors[item.sensitivityKey]}`}>
              {item.sensitivityKey === 'low' ? 'Низкий' :
               item.sensitivityKey === 'medium' ? 'Средний' : 'Высокий'}
            </span>

            {/* Client-safe */}
            {item.clientSafe && (
              <span className="text-xs text-violet-600">CS</span>
            )}

            {/* Remove */}
            <button
              onClick={() => handleRemoveItem(item.id)}
              className="text-stone-400 hover:text-red-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Error */}
      {errors.items && (
        <p className="text-sm text-red-600">{errors.items}</p>
      )}

      {/* Add Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-stone-800 mb-4">Добавить из Document Vault</h3>
            <p className="text-stone-500 text-sm mb-4">
              Здесь будет интеграция с модулем Document Vault для выбора документов.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
