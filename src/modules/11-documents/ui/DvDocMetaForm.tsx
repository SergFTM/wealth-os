"use client";

import { useState } from 'react';
import { Save, X } from 'lucide-react';

interface DvDocMetaFormProps {
  document?: {
    id?: string;
    name: string;
    category: string;
    tags: string[];
    description?: string;
    confidentiality: string;
    clientId?: string;
  };
  onSave: (data: {
    name: string;
    category: string;
    tags: string[];
    description: string;
    confidentiality: string;
  }) => void;
  onCancel?: () => void;
  isNew?: boolean;
}

const categories = [
  { value: 'invoice', label: 'Инвойс' },
  { value: 'statement', label: 'Выписка' },
  { value: 'agreement', label: 'Соглашение' },
  { value: 'quarterly_report', label: 'Квартальный отчет' },
  { value: 'kyc', label: 'KYC документ' },
  { value: 'tax', label: 'Налоговый документ' },
  { value: 'contract', label: 'Контракт' },
  { value: 'bank_statement', label: 'Банковская выписка' },
  { value: 'payment_confirmation', label: 'Подтверждение платежа' },
  { value: 'misc', label: 'Прочее' },
];

const availableTags = [
  'vendor', 'quarterly', 'bank', 'monthly', 'partnership', 'legal',
  'report', 'kyc', 'onboarding', 'tax', 'annual', 'fund', 'investment',
  'capital_call', 'distribution', 'trust', 'identity', 'valuation', 'payment',
];

export function DvDocMetaForm({ document, onSave, onCancel, isNew = false }: DvDocMetaFormProps) {
  const [name, setName] = useState(document?.name || '');
  const [category, setCategory] = useState(document?.category || 'misc');
  const [tags, setTags] = useState<string[]>(document?.tags || []);
  const [description, setDescription] = useState(document?.description || '');
  const [confidentiality, setConfidentiality] = useState(document?.confidentiality || 'internal');

  const toggleTag = (tag: string) => {
    setTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, category, tags, description, confidentiality });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Название документа
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="
            w-full px-3 py-2 rounded-lg border border-stone-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
            bg-white text-stone-800
          "
          placeholder="Введите название..."
          required
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Категория
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="
            w-full px-3 py-2 rounded-lg border border-stone-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
            bg-white text-stone-800
          "
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Теги
        </label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`
                px-2.5 py-1 text-xs rounded-full transition-all
                ${tags.includes(tag)
                  ? 'bg-emerald-500 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }
              `}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Описание
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="
            w-full px-3 py-2 rounded-lg border border-stone-200
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
            bg-white text-stone-800 resize-none
          "
          placeholder="Добавьте описание..."
        />
      </div>

      {/* Confidentiality */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Конфиденциальность
        </label>
        <div className="flex gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="confidentiality"
              value="internal"
              checked={confidentiality === 'internal'}
              onChange={(e) => setConfidentiality(e.target.value)}
              className="w-4 h-4 text-emerald-600 border-stone-300 focus:ring-emerald-500"
            />
            <span className="text-sm text-stone-700">Внутренний</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="confidentiality"
              value="client_safe"
              checked={confidentiality === 'client_safe'}
              onChange={(e) => setConfidentiality(e.target.value)}
              className="w-4 h-4 text-emerald-600 border-stone-300 focus:ring-emerald-500"
            />
            <span className="text-sm text-stone-700">Клиентский доступ</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="
            flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
            bg-gradient-to-r from-emerald-500 to-emerald-600
            text-white text-sm font-medium
            hover:from-emerald-600 hover:to-emerald-700
            transition-all
          "
        >
          <Save className="w-4 h-4" />
          {isNew ? 'Сохранить документ' : 'Сохранить изменения'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="
              px-4 py-2 rounded-lg border border-stone-200
              text-stone-600 text-sm font-medium
              hover:bg-stone-50
              transition-all
            "
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
