"use client";

import { useState } from 'react';
import { X } from 'lucide-react';

interface IpsPolicyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PolicyFormData) => void;
  initialData?: Partial<PolicyFormData>;
}

interface PolicyFormData {
  name: string;
  scopeType: 'household' | 'entity' | 'portfolio';
  scopeId?: string;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  liquidityNeeds?: string;
  timeHorizon?: string;
  objectives?: {
    returnTarget?: string;
    incomeNeeds?: string;
    capitalPreservation?: string;
  };
}

const scopeOptions = [
  { value: 'household', label: 'Хозяйство' },
  { value: 'entity', label: 'Юридическое лицо' },
  { value: 'portfolio', label: 'Портфель' },
];

const riskOptions = [
  { value: 'conservative', label: 'Консервативный' },
  { value: 'moderate', label: 'Умеренный' },
  { value: 'aggressive', label: 'Агрессивный' },
];

const timeHorizonOptions = [
  { value: '1-3 years', label: '1-3 года' },
  { value: '3-5 years', label: '3-5 лет' },
  { value: '5-10 years', label: '5-10 лет' },
  { value: '10+ years', label: '10+ лет' },
  { value: 'perpetual', label: 'Бессрочно' },
];

export function IpsPolicyForm({ isOpen, onClose, onSave, initialData }: IpsPolicyFormProps) {
  const [formData, setFormData] = useState<PolicyFormData>({
    name: initialData?.name || '',
    scopeType: initialData?.scopeType || 'household',
    scopeId: initialData?.scopeId || '',
    riskTolerance: initialData?.riskTolerance || 'moderate',
    liquidityNeeds: initialData?.liquidityNeeds || '',
    timeHorizon: initialData?.timeHorizon || '5-10 years',
    objectives: initialData?.objectives || {},
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-800">
            {initialData ? 'Редактировать политику' : 'Новая политика IPS'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Название политики *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="IPS Family Office 2024"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Scope *
              </label>
              <select
                value={formData.scopeType}
                onChange={(e) => setFormData({ ...formData, scopeType: e.target.value as PolicyFormData['scopeType'] })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                {scopeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Scope ID
              </label>
              <input
                type="text"
                value={formData.scopeId}
                onChange={(e) => setFormData({ ...formData, scopeId: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="household-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Риск-профиль *
              </label>
              <select
                value={formData.riskTolerance}
                onChange={(e) => setFormData({ ...formData, riskTolerance: e.target.value as PolicyFormData['riskTolerance'] })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                {riskOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Горизонт
              </label>
              <select
                value={formData.timeHorizon}
                onChange={(e) => setFormData({ ...formData, timeHorizon: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                {timeHorizonOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Потребность в ликвидности
            </label>
            <textarea
              value={formData.liquidityNeeds}
              onChange={(e) => setFormData({ ...formData, liquidityNeeds: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Описание требований к ликвидности..."
            />
          </div>

          <div className="border-t border-stone-200 pt-4">
            <h3 className="text-sm font-semibold text-stone-800 mb-3">Инвестиционные цели</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-stone-500 mb-1">Целевая доходность</label>
                <input
                  type="text"
                  value={formData.objectives?.returnTarget || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    objectives: { ...formData.objectives, returnTarget: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="CPI + 4% годовых"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1">Потребность в доходе</label>
                <input
                  type="text"
                  value={formData.objectives?.incomeNeeds || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    objectives: { ...formData.objectives, incomeNeeds: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="$500K в год"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-500 mb-1">Сохранение капитала</label>
                <input
                  type="text"
                  value={formData.objectives?.capitalPreservation || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    objectives: { ...formData.objectives, capitalPreservation: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="Не более -15% в худший год"
                />
              </div>
            </div>
          </div>
        </form>

        <div className="p-4 border-t border-stone-200 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-stone-200 rounded-lg text-stone-700 font-medium hover:bg-stone-50 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            {initialData ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </div>
    </>
  );
}
