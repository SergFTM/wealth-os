"use client";

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface IpsBreachFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BreachFormData) => void;
  policyId?: string;
  constraintId?: string;
  initialData?: Partial<BreachFormData>;
}

interface BreachFormData {
  policyId: string;
  constraintId: string;
  measuredValue: number;
  limitValue: number;
  severity: 'ok' | 'warning' | 'critical';
  sourceType: 'auto' | 'manual';
  explanation?: string;
  owner?: string;
}

const severityOptions = [
  { value: 'ok', label: 'OK', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'warning', label: 'Warning', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-700 border-red-200' },
];

export function IpsBreachForm({ isOpen, onClose, onSave, policyId, constraintId, initialData }: IpsBreachFormProps) {
  const [formData, setFormData] = useState<BreachFormData>({
    policyId: policyId || initialData?.policyId || '',
    constraintId: constraintId || initialData?.constraintId || '',
    measuredValue: initialData?.measuredValue || 0,
    limitValue: initialData?.limitValue || 0,
    severity: initialData?.severity || 'warning',
    sourceType: initialData?.sourceType || 'manual',
    explanation: initialData?.explanation || '',
    owner: initialData?.owner || '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const deviation = formData.limitValue !== 0
    ? ((formData.measuredValue - formData.limitValue) / formData.limitValue * 100).toFixed(1)
    : '0';

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-stone-800">
              Зафиксировать нарушение
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Policy ID *
              </label>
              <input
                type="text"
                required
                value={formData.policyId}
                onChange={(e) => setFormData({ ...formData, policyId: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="ips-policy-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Constraint ID *
              </label>
              <input
                type="text"
                required
                value={formData.constraintId}
                onChange={(e) => setFormData({ ...formData, constraintId: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="constraint-001"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Измеренное значение *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.measuredValue}
                onChange={(e) => setFormData({ ...formData, measuredValue: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Лимит *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.limitValue}
                onChange={(e) => setFormData({ ...formData, limitValue: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-600">Отклонение:</span>
              <span className={`text-lg font-bold ${parseFloat(deviation) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {parseFloat(deviation) > 0 ? '+' : ''}{deviation}%
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Серьезность *
            </label>
            <div className="flex gap-2">
              {severityOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, severity: opt.value as BreachFormData['severity'] })}
                  className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    formData.severity === opt.value ? opt.color : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Источник
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, sourceType: 'manual' })}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  formData.sourceType === 'manual'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                Ручная фиксация
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, sourceType: 'auto' })}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  formData.sourceType === 'auto'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                Автопроверка
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Ответственный
            </label>
            <input
              type="text"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="cio@wealth.os"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Объяснение
            </label>
            <textarea
              value={formData.explanation}
              onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Описание причины нарушения и контекст..."
            />
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
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Зафиксировать
          </button>
        </div>
      </div>
    </>
  );
}
