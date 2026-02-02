"use client";

import { useState } from 'react';
import { Link as LinkIcon, Plus, X, ExternalLink } from 'lucide-react';

interface DocumentLink {
  id: string;
  linkedType: string;
  linkedId: string;
  label: string | null;
  createdAt: string;
}

interface DvLinksPanelProps {
  links: DocumentLink[];
  onAddLink: () => void;
  onRemoveLink: (id: string) => void;
  onNavigate: (type: string, id: string) => void;
}

const typeLabels: Record<string, string> = {
  bill: 'Счет',
  payment: 'Платеж',
  checkRun: 'Check Run',
  journalEntry: 'Проводка',
  transaction: 'Транзакция',
  fund: 'Фонд',
  capitalCall: 'Capital Call',
  distribution: 'Распределение',
  valuation: 'Оценка',
  partnership: 'Партнерство',
  agreement: 'Соглашение',
  kycCase: 'KYC кейс',
  reportPack: 'Пакет отчетов',
  cashAccount: 'Счет',
  obligation: 'Обязательство',
};

const typeColors: Record<string, string> = {
  bill: 'bg-blue-100 text-blue-700',
  payment: 'bg-green-100 text-green-700',
  fund: 'bg-purple-100 text-purple-700',
  capitalCall: 'bg-orange-100 text-orange-700',
  distribution: 'bg-pink-100 text-pink-700',
  valuation: 'bg-indigo-100 text-indigo-700',
  partnership: 'bg-emerald-100 text-emerald-700',
  kycCase: 'bg-cyan-100 text-cyan-700',
  journalEntry: 'bg-amber-100 text-amber-700',
};

export function DvLinksPanel({ links, onAddLink, onRemoveLink, onNavigate }: DvLinksPanelProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-stone-700">
          Связанные объекты ({links.length})
        </h3>
        <button
          onClick={onAddLink}
          className="
            inline-flex items-center gap-1 px-3 py-1.5 rounded-lg
            text-emerald-600 text-sm font-medium
            hover:bg-emerald-50 transition-colors
          "
        >
          <Plus className="w-4 h-4" />
          Добавить связь
        </button>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-8">
          <LinkIcon className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <p className="text-sm text-stone-500">Нет связанных объектов</p>
          <button
            onClick={onAddLink}
            className="mt-3 text-sm text-emerald-600 hover:text-emerald-700"
          >
            Добавить первую связь
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="
                flex items-center justify-between p-3
                bg-white rounded-lg border border-stone-200
                hover:border-stone-300 transition-colors
              "
            >
              <div className="flex items-center gap-3">
                <span className={`
                  px-2 py-0.5 text-xs font-medium rounded-full
                  ${typeColors[link.linkedType] || 'bg-stone-100 text-stone-700'}
                `}>
                  {typeLabels[link.linkedType] || link.linkedType}
                </span>
                <div>
                  <p className="text-sm font-medium text-stone-800">
                    {link.label || link.linkedId}
                  </p>
                  <p className="text-xs text-stone-500">ID: {link.linkedId}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onNavigate(link.linkedType, link.linkedId)}
                  className="p-1.5 hover:bg-stone-100 rounded transition-colors"
                  title="Открыть объект"
                >
                  <ExternalLink className="w-4 h-4 text-stone-400" />
                </button>

                {confirmDelete === link.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        onRemoveLink(link.id);
                        setConfirmDelete(null);
                      }}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Удалить
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="px-2 py-1 text-xs bg-stone-200 text-stone-600 rounded hover:bg-stone-300"
                    >
                      Отмена
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(link.id)}
                    className="p-1.5 hover:bg-red-50 rounded transition-colors"
                    title="Удалить связь"
                  >
                    <X className="w-4 h-4 text-stone-400 hover:text-red-500" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
