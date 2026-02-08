"use client";

interface RecipientData {
  recipientType: string;
  recipientOrg: string;
  recipientContactName?: string;
  recipientContactEmail?: string;
  purpose: string;
}

interface PaWizardStepRecipientProps {
  data: RecipientData;
  errors: Record<string, string>;
  onChange: (data: Partial<RecipientData>) => void;
}

const RECIPIENT_TYPES = [
  { key: 'auditor', label: 'Аудитор', icon: '📊', description: 'Внешний аудит, проверка отчётности' },
  { key: 'bank', label: 'Банк', icon: '🏦', description: 'KYC, кредитная заявка, отчётность' },
  { key: 'tax', label: 'Налоговый консультант', icon: '📋', description: 'Налоговое планирование, отчётность' },
  { key: 'legal', label: 'Юридический советник', icon: '⚖️', description: 'Due diligence, правовая экспертиза' },
  { key: 'committee', label: 'Инвестиционный комитет', icon: '👥', description: 'Квартальный отчёт, решения' },
  { key: 'investor', label: 'Со-инвестор', icon: '💼', description: 'Капитальный счёт, распределения' },
  { key: 'regulator', label: 'Регулятор', icon: '🏛️', description: 'Комплаенс, проверка' },
  { key: 'other', label: 'Другое', icon: '📁', description: 'Прочие запросы' },
];

export function PaWizardStepRecipient({ data, errors, onChange }: PaWizardStepRecipientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-stone-800 mb-2">Получатель пакета</h2>
        <p className="text-stone-500">Укажите, кому предназначен пакет документов</p>
      </div>

      {/* Recipient Type Selection */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-3">
          Тип получателя <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {RECIPIENT_TYPES.map((type) => (
            <button
              key={type.key}
              type="button"
              onClick={() => onChange({ recipientType: type.key })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                data.recipientType === type.key
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="text-2xl mb-2">{type.icon}</div>
              <div className="font-medium text-stone-800 text-sm">{type.label}</div>
              <div className="text-xs text-stone-500 mt-1">{type.description}</div>
            </button>
          ))}
        </div>
        {errors.recipientType && (
          <p className="text-sm text-red-600 mt-2">{errors.recipientType}</p>
        )}
      </div>

      {/* Organization */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Организация <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.recipientOrg}
          onChange={(e) => onChange({ recipientOrg: e.target.value })}
          placeholder="Название организации-получателя"
          className={`w-full px-4 py-2.5 rounded-lg border ${
            errors.recipientOrg ? 'border-red-300' : 'border-stone-300'
          } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
        />
        {errors.recipientOrg && (
          <p className="text-sm text-red-600 mt-1">{errors.recipientOrg}</p>
        )}
      </div>

      {/* Contact (Optional) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Контактное лицо
          </label>
          <input
            type="text"
            value={data.recipientContactName || ''}
            onChange={(e) => onChange({ recipientContactName: e.target.value })}
            placeholder="Имя контактного лица"
            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={data.recipientContactEmail || ''}
            onChange={(e) => onChange({ recipientContactEmail: e.target.value })}
            placeholder="email@example.com"
            className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Цель предоставления <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.purpose}
          onChange={(e) => onChange({ purpose: e.target.value })}
          placeholder="Опишите цель предоставления документов..."
          rows={3}
          className={`w-full px-4 py-2.5 rounded-lg border ${
            errors.purpose ? 'border-red-300' : 'border-stone-300'
          } focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none`}
        />
        {errors.purpose && (
          <p className="text-sm text-red-600 mt-1">{errors.purpose}</p>
        )}
        <p className="text-xs text-stone-500 mt-1">Минимум 10 символов</p>
      </div>
    </div>
  );
}
