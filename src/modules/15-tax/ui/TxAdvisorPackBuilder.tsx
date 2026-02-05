"use client";

import React, { useState } from 'react';
import { FileText, Plus, Trash2, Lock, Send, Download, AlertCircle, CheckCircle, X } from 'lucide-react';

interface PackDocument {
  documentId: string;
  name: string;
  type: string;
  addedAt: string;
}

interface AdvisorPack {
  id: string;
  profileId: string;
  title: string;
  year: number;
  jurisdiction: string;
  status: 'draft' | 'locked' | 'shared' | 'completed';
  createdBy: string;
  advisorEmail: string | null;
  advisorName: string | null;
  documents: PackDocument[];
  notes: string | null;
  sharedAt: string | null;
  expiresAt: string | null;
  lockedAt: string | null;
}

interface AvailableDocument {
  id: string;
  name: string;
  type: string;
  date: string;
}

interface TxAdvisorPackBuilderProps {
  pack: AdvisorPack;
  availableDocuments?: AvailableDocument[];
  onAddDocument?: (documentId: string) => void;
  onRemoveDocument?: (documentId: string) => void;
  onLock?: () => void;
  onShare?: (email: string) => void;
  onUpdateNotes?: (notes: string) => void;
}

const documentTypeLabels: Record<string, string> = {
  income_statement: 'Справка о доходах',
  brokerage_statement: 'Брокерский отчёт',
  dividend_statement: 'Справка о дивидендах',
  interest_statement: 'Справка о процентах',
  forex_report: 'Валютный отчёт',
  bank_statement: 'Банковская выписка',
  capital_gains: 'Расчёт прироста капитала',
  investment_summary: 'Сводка по инвестициям',
  pension_statement: 'Пенсионный отчёт',
  fbar_support: 'Документы для FBAR',
};

const statusConfig = {
  draft: { label: 'Черновик', color: 'text-stone-600', bg: 'bg-stone-100', icon: FileText },
  locked: { label: 'Заблокирован', color: 'text-amber-600', bg: 'bg-amber-100', icon: Lock },
  shared: { label: 'Отправлен', color: 'text-blue-600', bg: 'bg-blue-100', icon: Send },
  completed: { label: 'Завершён', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle },
};

export function TxAdvisorPackBuilder({
  pack,
  availableDocuments = [],
  onAddDocument,
  onRemoveDocument,
  onLock,
  onShare,
  onUpdateNotes,
}: TxAdvisorPackBuilderProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [shareEmail, setShareEmail] = useState(pack.advisorEmail || '');
  const [notes, setNotes] = useState(pack.notes || '');

  const status = statusConfig[pack.status];
  const StatusIcon = status.icon;
  const isEditable = pack.status === 'draft';
  const canShare = pack.status === 'locked';

  const filteredAvailable = availableDocuments.filter(
    doc => !pack.documents.some(pd => pd.documentId === doc.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold text-stone-800">{pack.title}</h2>
              <span className={`px-2 py-1 text-xs font-medium rounded-lg ${status.bg} ${status.color}`}>
                <StatusIcon className="w-3 h-3 inline mr-1" />
                {status.label}
              </span>
            </div>
            <div className="text-sm text-stone-500">
              {pack.year} • {pack.jurisdiction} • Создан: {pack.createdBy}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditable && pack.documents.length > 0 && onLock && (
              <button
                onClick={onLock}
                className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-medium hover:bg-amber-200 transition-colors"
              >
                <Lock className="w-4 h-4" />
                Заблокировать
              </button>
            )}
            {canShare && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
                Отправить
              </button>
            )}
            {pack.status === 'shared' && (
              <button className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors">
                <Download className="w-4 h-4" />
                Скачать архив
              </button>
            )}
          </div>
        </div>

        {/* Advisor Info */}
        {(pack.status === 'shared' || pack.status === 'completed') && pack.advisorName && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-700">
              <strong>Отправлено:</strong> {pack.advisorName} ({pack.advisorEmail})
            </div>
            {pack.sharedAt && (
              <div className="text-xs text-blue-600 mt-1">
                {new Date(pack.sharedAt).toLocaleString('ru-RU')}
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-stone-600 mb-2">Заметки</label>
          {isEditable ? (
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={() => onUpdateNotes?.(notes)}
              className="w-full p-3 border border-stone-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Добавьте заметки для консультанта..."
            />
          ) : (
            <div className="p-3 bg-stone-50 rounded-lg text-sm text-stone-600">
              {pack.notes || 'Нет заметок'}
            </div>
          )}
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-stone-800">
            Документы ({pack.documents.length})
          </h3>
          {isEditable && filteredAvailable.length > 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Добавить документ
            </button>
          )}
        </div>

        {pack.documents.length > 0 ? (
          <div className="space-y-2">
            {pack.documents.map((doc) => (
              <div
                key={doc.documentId}
                className="flex items-center justify-between p-3 bg-stone-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-stone-400" />
                  <div>
                    <div className="font-medium text-stone-800">{doc.name}</div>
                    <div className="text-xs text-stone-500">
                      {documentTypeLabels[doc.type] || doc.type} • Добавлен {new Date(doc.addedAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                {isEditable && onRemoveDocument && (
                  <button
                    onClick={() => onRemoveDocument(doc.documentId)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-stone-500 border border-dashed border-stone-300 rounded-xl">
            <FileText className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <div>Нет добавленных документов</div>
            {isEditable && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                Добавить первый документ
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Document Modal */}
      {showAddModal && isEditable && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg m-4 max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-stone-800">Добавить документ</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {filteredAvailable.length > 0 ? (
                <div className="space-y-2">
                  {filteredAvailable.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => {
                        onAddDocument?.(doc.id);
                        setShowAddModal(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition-colors text-left"
                    >
                      <FileText className="w-5 h-5 text-stone-400" />
                      <div className="flex-1">
                        <div className="font-medium text-stone-800">{doc.name}</div>
                        <div className="text-xs text-stone-500">
                          {documentTypeLabels[doc.type] || doc.type} • {new Date(doc.date).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                      <Plus className="w-5 h-5 text-blue-500" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-stone-500">
                  <AlertCircle className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <div>Нет доступных документов для добавления</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showAddModal && canShare && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md m-4">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-stone-800">Отправить консультанту</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  Email консультанта
                </label>
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  className="w-full p-3 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="advisor@example.com"
                />
              </div>
              <div className="p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                После отправки пакет станет доступен консультанту по ссылке
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={() => {
                    onShare?.(shareEmail);
                    setShowAddModal(false);
                  }}
                  disabled={!shareEmail}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  Отправить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
