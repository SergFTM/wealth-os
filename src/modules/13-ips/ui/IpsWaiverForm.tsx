"use client";

import { useState } from 'react';
import { X, FileWarning } from 'lucide-react';

interface IpsWaiverFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: WaiverFormData) => void;
  policyId?: string;
  constraintId?: string;
  breachId?: string;
  initialData?: Partial<WaiverFormData>;
}

interface WaiverFormData {
  policyId: string;
  constraintId?: string;
  breachId?: string;
  reason: string;
  startDate: string;
  endDate: string;
  allowedDeviation?: string;
}

const durationPresets = [
  { label: '30 дней', days: 30 },
  { label: '60 дней', days: 60 },
  { label: '90 дней', days: 90 },
  { label: '180 дней', days: 180 },
  { label: '1 год', days: 365 },
];

export function IpsWaiverForm({ isOpen, onClose, onSave, policyId, constraintId, breachId, initialData }: IpsWaiverFormProps) {
  const today = new Date().toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState<WaiverFormData>({
    policyId: policyId || initialData?.policyId || '',
    constraintId: constraintId || initialData?.constraintId || '',
    breachId: breachId || initialData?.breachId || '',
    reason: initialData?.reason || '',
    startDate: initialData?.startDate || today,
    endDate: initialData?.endDate || defaultEnd,
    allowedDeviation: initialData?.allowedDeviation || '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const setDuration = (days: number) => {
    const start = new Date(formData.startDate);
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
    setFormData({ ...formData, endDate: end.toISOString().split('T')[0] });
  };

  const getDaysRemaining = () => {
    const end = new Date(formData.endDate);
    const start = new Date(formData.startDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <FileWarning className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-stone-800">
              {initialData ? 'Редактировать waiver' : 'Создать waiver'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Constraint ID
              </label>
              <input
                type="text"
                value={formData.constraintId}
                onChange={(e) => setFormData({ ...formData, constraintId: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="constraint-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Breach ID
              </label>
              <input
                type="text"
                value={formData.breachId}
                onChange={(e) => setFormData({ ...formData, breachId: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="breach-001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Причина *
            </label>
            <textarea
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Обоснование для исключения из ограничения..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Период действия
            </label>
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-xs text-stone-500 mb-1">Начало</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1">Окончание</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {durationPresets.map(preset => (
                <button
                  key={preset.days}
                  type="button"
                  onClick={() => setDuration(preset.days)}
                  className="px-2 py-1 text-xs rounded bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-amber-700">Срок waiver:</span>
              <span className="text-sm font-bold text-amber-800">{getDaysRemaining()} дней</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Допустимое отклонение
            </label>
            <input
              type="text"
              value={formData.allowedDeviation}
              onChange={(e) => setFormData({ ...formData, allowedDeviation: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              placeholder="Например: +5% сверх лимита"
            />
          </div>

          <div className="p-3 bg-stone-50 rounded-lg text-xs text-stone-600">
            <strong>Важно:</strong> Waiver требует одобрения инвестиционным комитетом. После создания запрос будет направлен на согласование.
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
            className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
          >
            Создать waiver
          </button>
        </div>
      </div>
    </>
  );
}
