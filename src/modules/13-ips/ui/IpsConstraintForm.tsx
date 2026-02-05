"use client";

import { useState } from 'react';
import { X } from 'lucide-react';

interface IpsConstraintFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ConstraintFormData) => void;
  policyId?: string;
  initialData?: Partial<ConstraintFormData>;
}

interface ConstraintFormData {
  policyId: string;
  type: 'asset_limit' | 'concentration' | 'geo' | 'sector' | 'liquidity' | 'leverage' | 'esg';
  metric: 'weight' | 'value' | 'exposure';
  dimension?: string;
  segment?: string;
  limitMin?: number;
  limitMax?: number;
  unit: 'percent' | 'usd' | 'ratio';
}

const typeOptions = [
  { value: 'asset_limit', label: 'Класс активов', description: 'Лимит на долю класса активов' },
  { value: 'concentration', label: 'Концентрация', description: 'Максимальная доля одной позиции' },
  { value: 'geo', label: 'География', description: 'Лимиты по регионам/странам' },
  { value: 'sector', label: 'Сектор', description: 'Лимиты по секторам экономики' },
  { value: 'liquidity', label: 'Ликвидность', description: 'Минимальная доля ликвидных активов' },
  { value: 'leverage', label: 'Плечо', description: 'Максимальный leverage' },
  { value: 'esg', label: 'ESG', description: 'ESG требования и исключения' },
];

const metricOptions = [
  { value: 'weight', label: 'Вес (%)' },
  { value: 'value', label: 'Стоимость ($)' },
  { value: 'exposure', label: 'Экспозиция' },
];

const unitOptions = [
  { value: 'percent', label: '%' },
  { value: 'usd', label: 'USD' },
  { value: 'ratio', label: 'Коэффициент' },
];

const segmentSuggestions: Record<string, string[]> = {
  asset_limit: ['Equities', 'Fixed Income', 'Real Estate', 'Private Equity', 'Hedge Funds', 'Cash', 'Commodities', 'Crypto'],
  concentration: ['Single Position', 'Top 5', 'Top 10', 'Single Issuer', 'Single Manager'],
  geo: ['US', 'Europe', 'Asia', 'Emerging Markets', 'China', 'Japan', 'UK', 'Switzerland'],
  sector: ['Technology', 'Healthcare', 'Financials', 'Energy', 'Consumer', 'Industrials', 'Materials', 'Utilities'],
  liquidity: ['T+1', 'T+3', 'Monthly', 'Quarterly', 'Illiquid'],
  leverage: ['Gross', 'Net', 'Margin'],
  esg: ['Carbon Exclusion', 'Weapons Exclusion', 'Tobacco Exclusion', 'ESG Score Min'],
};

export function IpsConstraintForm({ isOpen, onClose, onSave, policyId, initialData }: IpsConstraintFormProps) {
  const [formData, setFormData] = useState<ConstraintFormData>({
    policyId: policyId || initialData?.policyId || '',
    type: initialData?.type || 'asset_limit',
    metric: initialData?.metric || 'weight',
    dimension: initialData?.dimension || '',
    segment: initialData?.segment || '',
    limitMin: initialData?.limitMin,
    limitMax: initialData?.limitMax,
    unit: initialData?.unit || 'percent',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const suggestions = segmentSuggestions[formData.type] || [];

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-800">
            {initialData ? 'Редактировать ограничение' : 'Новое ограничение'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Тип ограничения *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {typeOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: opt.value as ConstraintFormData['type'], segment: '' })}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    formData.type === opt.value
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="text-sm font-medium">{opt.label}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{opt.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Сегмент *
            </label>
            <input
              type="text"
              required
              value={formData.segment}
              onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="Например: Equities, US, Technology"
            />
            {suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {suggestions.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFormData({ ...formData, segment: s })}
                    className={`px-2 py-0.5 text-xs rounded ${
                      formData.segment === s
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Метрика
              </label>
              <select
                value={formData.metric}
                onChange={(e) => setFormData({ ...formData, metric: e.target.value as ConstraintFormData['metric'] })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                {metricOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Единица
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value as ConstraintFormData['unit'] })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                {unitOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Минимум
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.limitMin ?? ''}
                onChange={(e) => setFormData({ ...formData, limitMin: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Максимум
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.limitMax ?? ''}
                onChange={(e) => setFormData({ ...formData, limitMax: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Dimension (опционально)
            </label>
            <input
              type="text"
              value={formData.dimension}
              onChange={(e) => setFormData({ ...formData, dimension: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="Дополнительное измерение"
            />
          </div>

          <div className="p-3 bg-stone-50 rounded-lg">
            <div className="text-xs text-stone-500 mb-1">Предпросмотр ограничения:</div>
            <div className="text-sm font-medium text-stone-800">
              {formData.segment || '[Сегмент]'}: {' '}
              {formData.limitMin !== undefined && `≥ ${formData.limitMin}`}
              {formData.limitMin !== undefined && formData.limitMax !== undefined && ' — '}
              {formData.limitMax !== undefined && `≤ ${formData.limitMax}`}
              {' '}{formData.unit === 'percent' ? '%' : formData.unit === 'usd' ? '$' : 'x'}
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
            {initialData ? 'Сохранить' : 'Добавить'}
          </button>
        </div>
      </div>
    </>
  );
}
