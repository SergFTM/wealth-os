'use client';

import { useRouter } from 'next/navigation';
import { MoreHorizontal, Link as LinkIcon } from 'lucide-react';
import { DlStatusPill } from './DlStatusPill';

interface CapitalEvent {
  id: string;
  vehicleName: string;
  eventDate: string;
  dueDate?: string;
  eventType: string;
  amount: number;
  currency: string;
  status: string;
  linkedRefsJson?: string;
}

interface DlCapitalEventsTableProps {
  events: CapitalEvent[];
  compact?: boolean;
  onClose?: (eventId: string) => void;
  onLink?: (eventId: string) => void;
}

const eventTypeLabels: Record<string, string> = {
  capital_call: 'Вызов капитала',
  distribution: 'Распределение',
  valuation: 'Оценка',
  funding_round: 'Раунд'
};

export function DlCapitalEventsTable({ events, compact = false, onClose, onLink }: DlCapitalEventsTableProps) {
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
      month: 'short',
      year: compact ? undefined : 'numeric'
    });
  };

  const handleRowClick = (eventId: string) => {
    router.push(`/m/deals/event/${eventId}`);
  };

  const sortedEvents = [...events].sort((a, b) =>
    new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
  );

  if (compact) {
    return (
      <div className="rounded-xl border border-white/20 bg-white/60 backdrop-blur overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Дата</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Фонд</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-slate-500">Сумма</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-500">Статус</th>
            </tr>
          </thead>
          <tbody>
            {sortedEvents.slice(0, 5).map(event => (
              <tr
                key={event.id}
                onClick={() => handleRowClick(event.id)}
                className="border-b border-slate-50 last:border-0 hover:bg-emerald-50/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-2 text-sm text-slate-600">{formatDate(event.eventDate)}</td>
                <td className="px-4 py-2 text-sm font-medium text-slate-900 truncate max-w-[150px]">{event.vehicleName}</td>
                <td className="px-4 py-2 text-right text-sm font-medium text-slate-900">
                  {formatCurrency(event.amount, event.currency)}
                </td>
                <td className="px-4 py-2">
                  <DlStatusPill status={event.status} size="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/20 bg-white/60 backdrop-blur overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/50">
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Дата</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Фонд/Vehicle</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Тип</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Сумма</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">До</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Статус</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody>
          {sortedEvents.map(event => (
            <tr
              key={event.id}
              onClick={() => handleRowClick(event.id)}
              className="border-b border-slate-50 last:border-0 hover:bg-emerald-50/50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3 text-sm text-slate-600">{formatDate(event.eventDate)}</td>
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-slate-900">{event.vehicleName}</div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                  {eventTypeLabels[event.eventType] || event.eventType}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">
                {formatCurrency(event.amount, event.currency)}
              </td>
              <td className="px-4 py-3 text-sm text-slate-600">
                {event.dueDate ? formatDate(event.dueDate) : '—'}
              </td>
              <td className="px-4 py-3">
                <DlStatusPill status={event.status} />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  {event.status === 'open' && onClose && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onClose(event.id);
                      }}
                      className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                    >
                      Закрыть
                    </button>
                  )}
                  {onLink && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLink(event.id);
                      }}
                      className="p-1 rounded hover:bg-slate-100 transition-colors"
                      title="Связать"
                    >
                      <LinkIcon className="h-4 w-4 text-slate-400" />
                    </button>
                  )}
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 rounded hover:bg-slate-100 transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
