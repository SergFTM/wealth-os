'use client';

import { ArrowLeft, Calendar, Building2, AlertCircle, Check, Link as LinkIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DlStatusPill } from './DlStatusPill';

interface CapitalEvent {
  id: string;
  scopeType: string;
  scopeId: string;
  vehicleName: string;
  eventDate: string;
  dueDate?: string;
  eventType: string;
  amount: number;
  currency: string;
  status: string;
  linkedRefsJson?: string;
  glRefId?: string;
  notes?: string;
  createdAt: string;
}

interface DlCapitalEventDetailProps {
  event: CapitalEvent;
  onClose?: () => void;
  onLink?: () => void;
}

const eventTypeLabels: Record<string, string> = {
  capital_call: 'Вызов капитала',
  distribution: 'Распределение',
  valuation: 'Оценка',
  funding_round: 'Раунд финансирования'
};

const eventTypeDescriptions: Record<string, string> = {
  capital_call: 'Запрос на внесение капитала в фонд или vehicle согласно обязательствам.',
  distribution: 'Возврат капитала или распределение прибыли от инвестиций.',
  valuation: 'Периодическая переоценка стоимости инвестиции.',
  funding_round: 'Новый раунд финансирования портфельной компании.'
};

export function DlCapitalEventDetail({ event, onClose, onLink }: DlCapitalEventDetailProps) {
  const router = useRouter();

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const parseLinkedRefs = (json?: string) => {
    try {
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  };

  const linkedRefs = parseLinkedRefs(event.linkedRefsJson);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => router.push('/m/deals/list?tab=events')}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад к списку
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">
              {eventTypeLabels[event.eventType] || event.eventType}
            </h1>
            <DlStatusPill status={event.status} />
          </div>
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <Building2 className="h-4 w-4" />
            <span className="font-medium text-slate-700">{event.vehicleName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {event.status === 'open' && onClose && (
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-green-700 transition-all"
            >
              <Check className="h-4 w-4" />
              Закрыть
            </button>
          )}
          {onLink && (
            <button
              onClick={onLink}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all"
            >
              <LinkIcon className="h-4 w-4" />
              Связать
            </button>
          )}
        </div>
      </div>

      {/* Amount */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100">
        <div className="text-sm text-emerald-600 mb-1">Сумма события</div>
        <div className="text-3xl font-bold text-emerald-700">
          {formatCurrency(event.amount, event.currency)}
        </div>
      </div>

      {/* Description */}
      <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-white/20">
        <p className="text-sm text-slate-600">
          {eventTypeDescriptions[event.eventType] || 'Капитальное событие.'}
        </p>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-xs text-slate-500">Дата события</span>
          </div>
          <div className="text-sm font-medium text-slate-900">{formatDate(event.eventDate)}</div>
        </div>

        {event.dueDate && (
          <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-white/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-xs text-slate-500">Срок</span>
            </div>
            <div className="text-sm font-medium text-slate-900">{formatDate(event.dueDate)}</div>
          </div>
        )}

        <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-white/20">
          <div className="text-xs text-slate-500 mb-2">Тип скоупа</div>
          <div className="text-sm font-medium text-slate-900 capitalize">{event.scopeType}</div>
        </div>

        {event.glRefId && (
          <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-white/20">
            <div className="text-xs text-slate-500 mb-2">GL Reference</div>
            <div className="text-sm font-mono text-slate-900">{event.glRefId}</div>
          </div>
        )}
      </div>

      {/* Linked References */}
      {linkedRefs.length > 0 && (
        <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-white/20">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Связанные записи</h3>
          <div className="flex flex-wrap gap-2">
            {linkedRefs.map((ref: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
              >
                {ref}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {event.notes && (
        <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-white/20">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Примечания</h3>
          <p className="text-sm text-slate-600">{event.notes}</p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div className="text-sm text-amber-700">
            <strong>Важно:</strong> Капитальные события влияют на обязательства и денежные потоки.
            Закрытие события создаст соответствующие записи в GL.
          </div>
        </div>
      </div>
    </div>
  );
}
