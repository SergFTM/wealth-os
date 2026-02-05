"use client";

import { ArrowLeft, Edit, CheckCircle, Clock, FileEdit, Users, UserCheck, FileText, Wallet, MoreHorizontal, AlertTriangle } from 'lucide-react';

interface TrustEvent {
  id: string;
  trustId: string;
  eventType: 'beneficiary_change' | 'trustee_change' | 'amendment' | 'distribution_decision' | 'other';
  date: string;
  status: 'draft' | 'pending' | 'approved' | 'closed';
  proposedChangesJson: string;
  owner: string;
  docIds: string[];
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TrEventDetailProps {
  event: TrustEvent;
  trustName?: string;
  onBack?: () => void;
  onEdit?: () => void;
  onApprove?: () => void;
  onClose?: () => void;
}

const eventTypeConfig = {
  beneficiary_change: { label: 'Изменение бенефициаров', color: 'text-purple-600', bg: 'bg-purple-50', Icon: Users },
  trustee_change: { label: 'Изменение trustee', color: 'text-blue-600', bg: 'bg-blue-50', Icon: UserCheck },
  amendment: { label: 'Поправка к трасту', color: 'text-amber-600', bg: 'bg-amber-50', Icon: FileText },
  distribution_decision: { label: 'Решение о распределении', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: Wallet },
  other: { label: 'Другое событие', color: 'text-stone-600', bg: 'bg-stone-100', Icon: MoreHorizontal },
};

const statusConfig = {
  draft: { label: 'Черновик', color: 'text-stone-600', bg: 'bg-stone-100', Icon: FileEdit },
  pending: { label: 'На рассмотрении', color: 'text-amber-600', bg: 'bg-amber-50', Icon: Clock },
  approved: { label: 'Одобрено', color: 'text-blue-600', bg: 'bg-blue-50', Icon: CheckCircle },
  closed: { label: 'Закрыто', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircle },
};

export function TrEventDetail({
  event,
  trustName,
  onBack,
  onEdit,
  onApprove,
  onClose,
}: TrEventDetailProps) {
  const eventType = eventTypeConfig[event.eventType];
  const status = statusConfig[event.status];
  const EventIcon = eventType.Icon;
  const StatusIcon = status.Icon;

  let parsedChanges: Record<string, unknown> = {};
  try {
    parsedChanges = JSON.parse(event.proposedChangesJson);
  } catch {
    parsedChanges = { error: 'Не удалось разобрать изменения' };
  }

  const renderChangeValue = (value: unknown): string => {
    if (Array.isArray(value)) {
      return value.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    if (typeof value === 'boolean') {
      return value ? 'Да' : 'Нет';
    }
    return String(value);
  };

  const changeLabels: Record<string, string> = {
    action: 'Действие',
    beneficiaryName: 'Бенефициар',
    newTrusteeName: 'Новый trustee',
    oldTrusteeName: 'Предыдущий trustee',
    type: 'Тип',
    role: 'Роль',
    effectiveDate: 'Дата вступления',
    reason: 'Причина',
    notes: 'Примечания',
    amendmentType: 'Тип поправки',
    summary: 'Описание',
    documentId: 'Документ',
    decision: 'Решение',
    totalAmount: 'Сумма',
    currency: 'Валюта',
    fiscalYear: 'Финансовый год',
    programs: 'Программы',
    eventDescription: 'Описание события',
    attendees: 'Участники',
    decisions: 'Решения',
    proposedAgenda: 'Повестка',
    rate: 'Ставка',
    amount: 'Сумма',
    purpose: 'Назначение',
    beneficiary: 'Бенефициар',
    beneficiaries: 'Бенефициары',
  };

  const canApprove = event.status === 'pending';
  const canClose = event.status === 'approved';
  const canEdit = event.status === 'draft';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-800 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к списку
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${eventType.bg} flex items-center justify-center`}>
              <EventIcon className={`w-6 h-6 ${eventType.color}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-800">{eventType.label}</h1>
              <p className="text-stone-600">
                {trustName || event.trustId} • {new Date(event.date).toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg ${status.bg} ${status.color}`}>
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </span>
          {canEdit && onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-stone-50 text-stone-700 font-medium rounded-xl border border-stone-200 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Редактировать
            </button>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>Не является юридической консультацией</span>
      </div>

      {/* Proposed Changes */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5">
        <h3 className="font-semibold text-stone-700 mb-4">Предлагаемые изменения</h3>
        <div className="space-y-3">
          {Object.entries(parsedChanges).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2 border-b border-stone-100 last:border-0">
              <span className="text-stone-500">{changeLabels[key] || key}</span>
              <span className="font-medium text-stone-800 text-right max-w-[60%]">
                {renderChangeValue(value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Meta Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <h3 className="font-semibold text-stone-700 mb-4">Информация</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Владелец</span>
              <span className="font-medium text-stone-800">{event.owner}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Создано</span>
              <span className="font-medium text-stone-800">
                {new Date(event.createdAt).toLocaleDateString('ru-RU')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Обновлено</span>
              <span className="font-medium text-stone-800">
                {new Date(event.updatedAt).toLocaleDateString('ru-RU')}
              </span>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <h3 className="font-semibold text-stone-700 mb-4">Документы</h3>
          {event.docIds.length > 0 ? (
            <div className="space-y-2">
              {event.docIds.map(docId => (
                <div key={docId} className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-lg text-sm">
                  <FileText className="w-4 h-4 text-stone-500" />
                  <span className="text-stone-600">{docId}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-500">Нет прикреплённых документов</p>
          )}
        </div>
      </div>

      {/* Actions */}
      {(canApprove || canClose) && (
        <div className="flex gap-3">
          {canApprove && onApprove && (
            <button
              onClick={onApprove}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              Одобрить событие
            </button>
          )}
          {canClose && onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              Закрыть событие
            </button>
          )}
        </div>
      )}

      {/* Notes */}
      {event.notes && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <h3 className="font-semibold text-stone-700 mb-2">Заметки</h3>
          <p className="text-stone-600">{event.notes}</p>
        </div>
      )}
    </div>
  );
}
