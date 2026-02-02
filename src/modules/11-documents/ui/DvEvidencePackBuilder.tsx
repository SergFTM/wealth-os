"use client";

import { useState } from 'react';
import { Package, Plus, Lock, Search, X, Calendar, FileText } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  category: string;
}

interface DvEvidencePackBuilderProps {
  documents: Document[];
  onSave: (pack: {
    name: string;
    scopeType: string;
    periodStart: string;
    periodEnd: string;
    purpose: string;
    documentIds: string[];
  }) => void;
  onCancel: () => void;
}

const scopeTypes = [
  { value: 'period', label: 'Период' },
  { value: 'entity', label: 'Юрлицо' },
  { value: 'fund', label: 'Фонд' },
  { value: 'audit', label: 'Аудит' },
  { value: 'kyc', label: 'KYC' },
  { value: 'custom', label: 'Произвольный' },
];

export function DvEvidencePackBuilder({ documents, onSave, onCancel }: DvEvidencePackBuilderProps) {
  const [name, setName] = useState('');
  const [scopeType, setScopeType] = useState('period');
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [purpose, setPurpose] = useState('');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDoc = (id: string) => {
    setSelectedDocIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      scopeType,
      periodStart,
      periodEnd,
      purpose,
      documentIds: selectedDocIds,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-amber-500 flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-stone-800">Создать Evidence Pack</h2>
          <p className="text-sm text-stone-500">Соберите документы для аудита или отчетности</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Название пакета
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="
              w-full px-3 py-2 rounded-lg border border-stone-200
              focus:outline-none focus:ring-2 focus:ring-emerald-500
              bg-white text-stone-800
            "
            placeholder="Например: Q4 2025 Audit Pack"
            required
          />
        </div>

        {/* Scope Type */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Тип охвата
          </label>
          <select
            value={scopeType}
            onChange={(e) => setScopeType(e.target.value)}
            className="
              w-full px-3 py-2 rounded-lg border border-stone-200
              focus:outline-none focus:ring-2 focus:ring-emerald-500
              bg-white text-stone-800
            "
          >
            {scopeTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Period */}
        {scopeType === 'period' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Начало периода
              </label>
              <input
                type="date"
                value={periodStart}
                onChange={(e) => setPeriodStart(e.target.value)}
                className="
                  w-full px-3 py-2 rounded-lg border border-stone-200
                  focus:outline-none focus:ring-2 focus:ring-emerald-500
                  bg-white text-stone-800
                "
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Конец периода
              </label>
              <input
                type="date"
                value={periodEnd}
                onChange={(e) => setPeriodEnd(e.target.value)}
                className="
                  w-full px-3 py-2 rounded-lg border border-stone-200
                  focus:outline-none focus:ring-2 focus:ring-emerald-500
                  bg-white text-stone-800
                "
              />
            </div>
          </div>
        )}

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Назначение
          </label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows={2}
            className="
              w-full px-3 py-2 rounded-lg border border-stone-200
              focus:outline-none focus:ring-2 focus:ring-emerald-500
              bg-white text-stone-800 resize-none
            "
            placeholder="Для чего создается пакет..."
          />
        </div>

        {/* Document Selection */}
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Выберите документы ({selectedDocIds.length} выбрано)
          </label>
          
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200
                focus:outline-none focus:ring-2 focus:ring-emerald-500
                bg-white text-stone-800 text-sm
              "
              placeholder="Поиск документов..."
            />
          </div>

          <div className="max-h-[200px] overflow-y-auto border border-stone-200 rounded-lg divide-y divide-stone-100">
            {filteredDocs.length === 0 ? (
              <div className="p-4 text-center text-sm text-stone-500">
                Документы не найдены
              </div>
            ) : (
              filteredDocs.map(doc => (
                <label
                  key={doc.id}
                  className="flex items-center gap-3 p-2 hover:bg-stone-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedDocIds.includes(doc.id)}
                    onChange={() => toggleDoc(doc.id)}
                    className="w-4 h-4 text-emerald-600 border-stone-300 rounded focus:ring-emerald-500"
                  />
                  <FileText className="w-4 h-4 text-stone-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-stone-700 truncate">{doc.name}</p>
                    <p className="text-xs text-stone-400">{doc.category}</p>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={!name || selectedDocIds.length === 0}
            className="
              flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg
              bg-gradient-to-r from-emerald-500 to-emerald-600
              text-white text-sm font-medium
              hover:from-emerald-600 hover:to-emerald-700
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all
            "
          >
            <Lock className="w-4 h-4" />
            Создать пакет
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="
              px-4 py-2 rounded-lg border border-stone-200
              text-stone-600 text-sm font-medium
              hover:bg-stone-50 transition-all
            "
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
