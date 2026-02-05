"use client";

import { X, ThumbsUp, ThumbsDown, Minus, FileText, AlertTriangle, FileWarning } from 'lucide-react';
import { useState } from 'react';

interface Decision {
  id: string;
  meetingId: string;
  title: string;
  decisionType: 'approve_waiver' | 'revise_ips' | 'rebalance' | 'other';
  relatedBreachId?: string;
  relatedWaiverId?: string;
  voteYes?: number;
  voteNo?: number;
  voteAbstain?: number;
  result: 'approved' | 'rejected' | 'deferred';
  notes?: string;
}

interface IpsDecisionDrawerProps {
  decision?: Decision;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (decision: Partial<Decision>) => void;
  isNew?: boolean;
}

const typeLabels: Record<string, string> = {
  approve_waiver: 'Утверждение waiver',
  revise_ips: 'Пересмотр IPS',
  rebalance: 'Ребалансировка',
  other: 'Прочее',
};

const typeIcons: Record<string, React.ReactNode> = {
  approve_waiver: <FileWarning className="w-4 h-4" />,
  revise_ips: <FileText className="w-4 h-4" />,
  rebalance: <AlertTriangle className="w-4 h-4" />,
  other: <FileText className="w-4 h-4" />,
};

const resultLabels: Record<string, string> = {
  approved: 'Одобрено',
  rejected: 'Отклонено',
  deferred: 'Отложено',
};

const resultColors: Record<string, string> = {
  approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  deferred: 'bg-amber-100 text-amber-700 border-amber-200',
};

export function IpsDecisionDrawer({
  decision,
  isOpen,
  onClose,
  onSave,
  isNew = false,
}: IpsDecisionDrawerProps) {
  const [formData, setFormData] = useState<Partial<Decision>>(
    decision || {
      title: '',
      decisionType: 'other',
      result: 'approved',
      voteYes: 0,
      voteNo: 0,
      voteAbstain: 0,
      notes: '',
    }
  );

  if (!isOpen) return null;

  const handleSave = () => {
    onSave?.(formData);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h2 className="text-lg font-semibold text-stone-800">
            {isNew ? 'Новое решение' : 'Решение комитета'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Заголовок
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Описание решения"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Тип решения
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(typeLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFormData({ ...formData, decisionType: key as Decision['decisionType'] })}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors
                    ${formData.decisionType === key
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'}
                  `}
                >
                  {typeIcons[key]}
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Голосование
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs text-stone-600">За</span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={formData.voteYes || 0}
                  onChange={(e) => setFormData({ ...formData, voteYes: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 text-center border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <ThumbsDown className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-stone-600">Против</span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={formData.voteNo || 0}
                  onChange={(e) => setFormData({ ...formData, voteNo: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 text-center border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Minus className="w-4 h-4 text-stone-500" />
                  <span className="text-xs text-stone-600">Воздерж.</span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={formData.voteAbstain || 0}
                  onChange={(e) => setFormData({ ...formData, voteAbstain: parseInt(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 text-center border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Результат
            </label>
            <div className="flex gap-2">
              {Object.entries(resultLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setFormData({ ...formData, result: key as Decision['result'] })}
                  className={`
                    flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-colors
                    ${formData.result === key
                      ? resultColors[key]
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'}
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Примечания
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              placeholder="Дополнительные комментарии..."
            />
          </div>
        </div>

        <div className="p-4 border-t border-stone-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-stone-200 rounded-lg text-stone-700 font-medium hover:bg-stone-50 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            {isNew ? 'Создать' : 'Сохранить'}
          </button>
        </div>
      </div>
    </>
  );
}
