"use client";

import { Users, UserCheck, FileText, Wallet, MoreHorizontal, Clock, CheckCircle, AlertCircle, FileEdit } from 'lucide-react';

interface TrustEvent {
  id: string;
  trustId: string;
  eventType: 'beneficiary_change' | 'trustee_change' | 'amendment' | 'distribution_decision' | 'other';
  date: string;
  status: 'draft' | 'pending' | 'approved' | 'closed';
  proposedChangesJson: string;
  owner: string;
  notes: string | null;
}

interface TrEventsTableProps {
  events: TrustEvent[];
  onRowClick?: (event: TrustEvent) => void;
  showTrustColumn?: boolean;
  trustNames?: Record<string, string>;
}

const eventTypeConfig = {
  beneficiary_change: { label: 'Изменение бенефициаров', color: 'text-purple-600', bg: 'bg-purple-50', Icon: Users },
  trustee_change: { label: 'Изменение trustee', color: 'text-blue-600', bg: 'bg-blue-50', Icon: UserCheck },
  amendment: { label: 'Поправка', color: 'text-amber-600', bg: 'bg-amber-50', Icon: FileText },
  distribution_decision: { label: 'Решение о распределении', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: Wallet },
  other: { label: 'Другое', color: 'text-stone-600', bg: 'bg-stone-100', Icon: MoreHorizontal },
};

const statusConfig = {
  draft: { label: 'Черновик', color: 'text-stone-600', bg: 'bg-stone-100', Icon: FileEdit },
  pending: { label: 'На рассмотрении', color: 'text-amber-600', bg: 'bg-amber-50', Icon: Clock },
  approved: { label: 'Одобрено', color: 'text-blue-600', bg: 'bg-blue-50', Icon: CheckCircle },
  closed: { label: 'Закрыто', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircle },
};

export function TrEventsTable({
  events,
  onRowClick,
  showTrustColumn = false,
  trustNames = {},
}: TrEventsTableProps) {
  const parseChanges = (json: string): string => {
    try {
      const obj = JSON.parse(json);
      if (obj.action) return obj.action;
      if (obj.decision) return obj.decision;
      if (obj.amendmentType) return obj.amendmentType;
      if (obj.eventDescription) return obj.eventDescription;
      return 'Изменения';
    } catch {
      return 'Изменения';
    }
  };

  const sortedEvents = [...events].sort((a, b) => {
    const statusOrder = { pending: 0, draft: 1, approved: 2, closed: 3 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Дата</th>
              {showTrustColumn && (
                <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Траст</th>
              )}
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Тип события</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Описание</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Владелец</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
            </tr>
          </thead>
          <tbody>
            {sortedEvents.map((event) => {
              const eventType = eventTypeConfig[event.eventType];
              const status = statusConfig[event.status];
              const EventIcon = eventType.Icon;
              const StatusIcon = status.Icon;
              const changeSummary = parseChanges(event.proposedChangesJson);

              return (
                <tr
                  key={event.id}
                  onClick={() => onRowClick?.(event)}
                  className="border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-stone-800">
                      {new Date(event.date).toLocaleDateString('ru-RU')}
                    </div>
                  </td>
                  {showTrustColumn && (
                    <td className="px-4 py-3 text-stone-600">
                      {trustNames[event.trustId] || event.trustId}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg ${eventType.bg} ${eventType.color}`}>
                      <EventIcon className="w-3.5 h-3.5" />
                      {eventType.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-stone-700 capitalize">{changeSummary.replace(/_/g, ' ')}</div>
                    {event.notes && (
                      <div className="text-xs text-stone-500 line-clamp-1 mt-0.5">{event.notes}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {event.owner}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedEvents.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет событий для отображения
        </div>
      )}
    </div>
  );
}
