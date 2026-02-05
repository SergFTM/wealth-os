"use client";

import { useState } from 'react';
import { X, Users, Calendar } from 'lucide-react';

interface IpsMeetingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: MeetingFormData) => void;
  initialData?: Partial<MeetingFormData>;
}

interface MeetingFormData {
  clientId: string;
  scopeType: 'household' | 'entity' | 'portfolio';
  scopeId?: string;
  date: string;
  agendaItemIds: string[];
  minutesText?: string;
}

const scopeOptions = [
  { value: 'household', label: 'Хозяйство' },
  { value: 'entity', label: 'Юридическое лицо' },
  { value: 'portfolio', label: 'Портфель' },
];

export function IpsMeetingForm({ isOpen, onClose, onSave, initialData }: IpsMeetingFormProps) {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<MeetingFormData>({
    clientId: initialData?.clientId || 'client-001',
    scopeType: initialData?.scopeType || 'household',
    scopeId: initialData?.scopeId || '',
    date: initialData?.date || today,
    agendaItemIds: initialData?.agendaItemIds || [],
    minutesText: initialData?.minutesText || '',
  });

  const [agendaInput, setAgendaInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addAgendaItem = () => {
    if (agendaInput.trim()) {
      setFormData({
        ...formData,
        agendaItemIds: [...formData.agendaItemIds, agendaInput.trim()]
      });
      setAgendaInput('');
    }
  };

  const removeAgendaItem = (index: number) => {
    setFormData({
      ...formData,
      agendaItemIds: formData.agendaItemIds.filter((_, i) => i !== index)
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-stone-800">
              {initialData ? 'Редактировать заседание' : 'Новое заседание комитета'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Дата заседания *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full pl-10 pr-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Scope
              </label>
              <select
                value={formData.scopeType}
                onChange={(e) => setFormData({ ...formData, scopeType: e.target.value as MeetingFormData['scopeType'] })}
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

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Повестка
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={agendaInput}
                onChange={(e) => setAgendaInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAgendaItem())}
                className="flex-1 px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="Добавить пункт повестки..."
              />
              <button
                type="button"
                onClick={addAgendaItem}
                className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-medium hover:bg-emerald-200 transition-colors"
              >
                +
              </button>
            </div>
            {formData.agendaItemIds.length > 0 ? (
              <ul className="space-y-1">
                {formData.agendaItemIds.map((item, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-stone-50 rounded-lg">
                    <span className="text-sm text-stone-700">{index + 1}. {item}</span>
                    <button
                      type="button"
                      onClick={() => removeAgendaItem(index)}
                      className="p-1 text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-stone-500 italic">Нет пунктов повестки</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Предварительные заметки
            </label>
            <textarea
              value={formData.minutesText}
              onChange={(e) => setFormData({ ...formData, minutesText: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none"
              placeholder="Предварительные заметки к заседанию..."
            />
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700">
            <strong>Примечание:</strong> После создания заседания вы сможете добавить решения (decisions), прикрепить документы и опубликовать протокол.
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
