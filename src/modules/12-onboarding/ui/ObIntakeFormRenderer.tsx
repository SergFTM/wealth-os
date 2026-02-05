"use client";

import { useState } from 'react';

interface IntakeStep {
  key: string;
  label: string;
  fields: { key: string; label: string; type: 'text' | 'email' | 'phone' | 'select' | 'textarea' | 'date'; options?: string[] }[];
}

const INTAKE_STEPS: IntakeStep[] = [
  {
    key: 'basic',
    label: 'Basic Info',
    fields: [
      { key: 'fullName', label: 'Полное имя', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'phone', label: 'Телефон', type: 'phone' },
      { key: 'dateOfBirth', label: 'Дата рождения', type: 'date' },
      { key: 'citizenship', label: 'Гражданство', type: 'text' },
    ],
  },
  {
    key: 'address',
    label: 'Адрес и резидентство',
    fields: [
      { key: 'addressLine1', label: 'Адрес строка 1', type: 'text' },
      { key: 'addressLine2', label: 'Адрес строка 2', type: 'text' },
      { key: 'city', label: 'Город', type: 'text' },
      { key: 'country', label: 'Страна', type: 'text' },
      { key: 'postalCode', label: 'Индекс', type: 'text' },
    ],
  },
  {
    key: 'tax',
    label: 'Налоговое резидентство',
    fields: [
      { key: 'taxCountry', label: 'Страна налогового резидентства', type: 'text' },
      { key: 'tin', label: 'ИНН / TIN', type: 'text' },
      { key: 'usPerson', label: 'US Person', type: 'select', options: ['Нет', 'Да'] },
    ],
  },
  {
    key: 'sow',
    label: 'Source of Wealth',
    fields: [
      { key: 'sowDescription', label: 'Описание источника богатства', type: 'textarea' },
      { key: 'sowType', label: 'Тип', type: 'select', options: ['Бизнес', 'Наследство', 'Инвестиции', 'Зарплата', 'Другое'] },
      { key: 'estimatedWealth', label: 'Оценка состояния', type: 'text' },
    ],
  },
  {
    key: 'sof',
    label: 'Source of Funds',
    fields: [
      { key: 'sofDescription', label: 'Описание источника средств', type: 'textarea' },
      { key: 'sofType', label: 'Тип', type: 'select', options: ['Доход от бизнеса', 'Дивиденды', 'Продажа активов', 'Кредит', 'Другое'] },
      { key: 'expectedVolume', label: 'Ожидаемый объем операций', type: 'text' },
    ],
  },
  {
    key: 'consents',
    label: 'Согласия и декларации',
    fields: [
      { key: 'consentDataProcessing', label: 'Согласие на обработку данных', type: 'select', options: ['Нет', 'Да'] },
      { key: 'consentKyc', label: 'Согласие на KYC проверку', type: 'select', options: ['Нет', 'Да'] },
      { key: 'declarationPep', label: 'Декларация PEP', type: 'select', options: ['Не являюсь PEP', 'Являюсь PEP'] },
      { key: 'declarationTruthful', label: 'Подтверждение достоверности', type: 'select', options: ['Нет', 'Да'] },
    ],
  },
];

interface ObIntakeFormRendererProps {
  payload: Record<string, string>;
  onSave: (data: Record<string, string>) => void;
  readOnly?: boolean;
}

export function ObIntakeFormRenderer({ payload, onSave, readOnly }: ObIntakeFormRendererProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>(payload || {});

  const step = INTAKE_STEPS[currentStep];
  const totalSteps = INTAKE_STEPS.length;

  const filledFields = Object.values(formData).filter(v => v && v.trim()).length;
  const totalFields = INTAKE_STEPS.reduce((acc, s) => acc + s.fields.length, 0);
  const completionPct = Math.round((filledFields / totalFields) * 100);

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveStep = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-2 text-sm text-stone-500">
        <span>Шаг {currentStep + 1} из {totalSteps}</span>
        <span className="text-stone-300">|</span>
        <span>Заполнено {completionPct}%</span>
      </div>
      <div className="w-full bg-stone-200 rounded-full h-2">
        <div
          className="bg-emerald-500 h-2 rounded-full transition-all"
          style={{ width: `${completionPct}%` }}
        />
      </div>

      {/* Step tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {INTAKE_STEPS.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setCurrentStep(i)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              i === currentStep
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Fields */}
      <div className="space-y-3">
        <h4 className="font-semibold text-stone-800">{step.label}</h4>
        {step.fields.map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-medium text-stone-500 mb-1">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                value={formData[field.key] || ''}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                disabled={readOnly}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-stone-50"
                rows={3}
              />
            ) : field.type === 'select' ? (
              <select
                value={formData[field.key] || ''}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                disabled={readOnly}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-stone-50"
              >
                <option value="">Выберите...</option>
                {field.options?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type === 'email' ? 'email' : field.type === 'date' ? 'date' : 'text'}
                value={formData[field.key] || ''}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                disabled={readOnly}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-stone-50"
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      {!readOnly && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-lg disabled:opacity-50"
          >
            ← Назад
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleSaveStep}
              className="px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg"
            >
              Сохранить черновик
            </button>
            {currentStep < totalSteps - 1 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
              >
                Далее →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
