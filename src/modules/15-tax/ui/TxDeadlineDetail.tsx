"use client";

import { ArrowLeft, Calendar, AlertTriangle, Clock, CheckCircle, FileText, DollarSign, Flag, User, Bell, Link } from 'lucide-react';

interface TaxDeadline {
  id: string;
  profileId: string;
  title: string;
  type: 'filing' | 'payment';
  jurisdiction: string;
  dueDate: string;
  status: 'overdue' | 'pending' | 'in_progress' | 'completed';
  amount: number | null;
  currency: string;
  description: string;
  penaltyRate: number | null;
  reminderDays: number[];
  assignedTo: string;
  completedAt: string | null;
  notes: string | null;
  linkedDocuments: string[];
  createdAt: string;
  updatedAt: string;
}

interface TxDeadlineDetailProps {
  deadline: TaxDeadline;
  onBack?: () => void;
  onComplete?: () => void;
  onStartWork?: () => void;
}

const typeConfig = {
  filing: { label: 'Подача декларации', color: 'text-blue-600', bg: 'bg-blue-50', icon: FileText },
  payment: { label: 'Оплата налога', color: 'text-purple-600', bg: 'bg-purple-50', icon: DollarSign },
};

const statusConfig = {
  overdue: { label: 'Просрочено', color: 'text-red-600', bg: 'bg-red-100', icon: AlertTriangle },
  pending: { label: 'Ожидает', color: 'text-amber-600', bg: 'bg-amber-100', icon: Clock },
  in_progress: { label: 'В работе', color: 'text-blue-600', bg: 'bg-blue-100', icon: Clock },
  completed: { label: 'Выполнено', color: 'text-emerald-600', bg: 'bg-emerald-100', icon: CheckCircle },
};

const jurisdictionDetails: Record<string, { flag: string; name: string; taxAuthority: string }> = {
  RU: { flag: '🇷🇺', name: 'Российская Федерация', taxAuthority: 'ФНС России' },
  US: { flag: '🇺🇸', name: 'Соединённые Штаты', taxAuthority: 'IRS' },
  GB: { flag: '🇬🇧', name: 'Великобритания', taxAuthority: 'HMRC' },
  AE: { flag: '🇦🇪', name: 'ОАЭ', taxAuthority: 'FTA' },
  CH: { flag: '🇨🇭', name: 'Швейцария', taxAuthority: 'ESTV' },
  SG: { flag: '🇸🇬', name: 'Сингапур', taxAuthority: 'IRAS' },
  CY: { flag: '🇨🇾', name: 'Кипр', taxAuthority: 'Tax Department' },
};

export function TxDeadlineDetail({ deadline, onBack, onComplete, onStartWork }: TxDeadlineDetailProps) {
  const type = typeConfig[deadline.type];
  const status = statusConfig[deadline.status];
  const TypeIcon = type.icon;
  const StatusIcon = status.icon;
  const jurisdiction = jurisdictionDetails[deadline.jurisdiction] || { flag: '🌍', name: deadline.jurisdiction, taxAuthority: 'N/A' };

  const now = new Date();
  const dueDate = new Date(deadline.dueDate);
  const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculatePenalty = () => {
    if (!deadline.penaltyRate || deadline.status !== 'overdue' || !deadline.amount) return null;
    const daysOverdue = Math.abs(daysUntil);
    return deadline.amount * deadline.penaltyRate * daysOverdue;
  };

  const estimatedPenalty = calculatePenalty();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-stone-500" />
            </button>
          )}
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${type.bg} rounded-xl flex items-center justify-center`}>
              <TypeIcon className={`w-6 h-6 ${type.color}`} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-800">{deadline.title}</h1>
              <div className="text-stone-500">{deadline.description}</div>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1.5 text-sm font-medium rounded-lg ${status.bg} ${status.color}`}>
          <StatusIcon className="w-4 h-4 inline mr-1" />
          {status.label}
        </span>
      </div>

      {/* Overdue Warning */}
      {deadline.status === 'overdue' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <div className="font-semibold text-red-800">Дедлайн просрочен на {Math.abs(daysUntil)} дней</div>
            <div className="text-sm text-red-600 mt-1">
              Срок истёк {dueDate.toLocaleDateString('ru-RU')}. Необходимо срочно завершить или обратиться к консультанту.
            </div>
            {estimatedPenalty !== null && (
              <div className="text-sm text-red-700 mt-2 font-medium">
                Расчётный штраф: {formatCurrency(estimatedPenalty, deadline.currency)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-2 text-stone-500 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Срок</span>
          </div>
          <div className={`text-2xl font-bold ${deadline.status === 'overdue' ? 'text-red-600' : 'text-stone-800'}`}>
            {dueDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
          </div>
          <div className={`text-xs ${deadline.status === 'overdue' ? 'text-red-500' : daysUntil <= 7 ? 'text-amber-500' : 'text-stone-500'}`}>
            {deadline.status === 'completed'
              ? 'Выполнено'
              : deadline.status === 'overdue'
                ? `${Math.abs(daysUntil)} дн. назад`
                : `через ${daysUntil} дн.`
            }
          </div>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-2 text-stone-500 mb-2">
            <Flag className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Юрисдикция</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{jurisdiction.flag}</span>
            <div>
              <div className="font-medium text-stone-800">{jurisdiction.name}</div>
              <div className="text-xs text-stone-500">{jurisdiction.taxAuthority}</div>
            </div>
          </div>
        </div>

        {deadline.amount !== null && (
          <div className="bg-white rounded-xl border border-stone-200 p-4">
            <div className="flex items-center gap-2 text-stone-500 mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium uppercase">Сумма</span>
            </div>
            <div className="text-2xl font-bold text-stone-800">
              {formatCurrency(deadline.amount, deadline.currency)}
            </div>
            {deadline.penaltyRate !== null && (
              <div className="text-xs text-stone-500">
                Штраф: {(deadline.penaltyRate * 100).toFixed(2)}% в день
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-2 text-stone-500 mb-2">
            <User className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Ответственный</span>
          </div>
          <div className="font-medium text-stone-800">{deadline.assignedTo}</div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reminders */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-stone-400" />
            Напоминания
          </h3>
          <div className="space-y-2">
            {deadline.reminderDays.map((days) => {
              const reminderDate = new Date(dueDate.getTime() - days * 24 * 60 * 60 * 1000);
              const isPast = reminderDate < now;
              return (
                <div
                  key={days}
                  className={`flex items-center justify-between p-3 rounded-lg ${isPast ? 'bg-stone-100' : 'bg-amber-50'}`}
                >
                  <span className={isPast ? 'text-stone-500' : 'text-amber-700'}>
                    За {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}
                  </span>
                  <span className={`text-sm ${isPast ? 'text-stone-400 line-through' : 'text-amber-600'}`}>
                    {reminderDate.toLocaleDateString('ru-RU')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Linked Documents */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h3 className="text-lg font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <Link className="w-5 h-5 text-stone-400" />
            Связанные документы
          </h3>
          {deadline.linkedDocuments.length > 0 ? (
            <div className="space-y-2">
              {deadline.linkedDocuments.map((docId) => (
                <div
                  key={docId}
                  className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg hover:bg-stone-100 cursor-pointer transition-colors"
                >
                  <FileText className="w-5 h-5 text-stone-400" />
                  <span className="text-stone-700">{docId}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-stone-500 border border-dashed border-stone-300 rounded-lg">
              Нет связанных документов
            </div>
          )}
        </div>
      </div>

      {/* Notes */}
      {deadline.notes && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="text-sm font-medium text-amber-700 mb-1">Заметки</div>
          <div className="text-amber-800">{deadline.notes}</div>
        </div>
      )}

      {/* Completion Info */}
      {deadline.status === 'completed' && deadline.completedAt && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Выполнено {new Date(deadline.completedAt).toLocaleString('ru-RU')}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      {deadline.status !== 'completed' && (
        <div className="flex justify-end gap-3">
          {deadline.status === 'pending' && onStartWork && (
            <button
              onClick={onStartWork}
              className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg font-medium hover:bg-stone-200 transition-colors"
            >
              Начать работу
            </button>
          )}
          {onComplete && (
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Отметить выполненным
            </button>
          )}
        </div>
      )}

      {/* Timestamps */}
      <div className="text-xs text-stone-500 pt-4 border-t border-stone-200">
        <div>Создано: {new Date(deadline.createdAt).toLocaleString('ru-RU')}</div>
        <div>Обновлено: {new Date(deadline.updatedAt).toLocaleString('ru-RU')}</div>
      </div>
    </div>
  );
}
