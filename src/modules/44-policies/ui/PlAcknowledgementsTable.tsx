"use client";

import { PlStatusPill } from './PlStatusPill';
import { Button } from '@/components/ui/Button';

interface Acknowledgement {
  id: string;
  docType: 'policy' | 'sop';
  docTitle: string;
  versionLabel: string;
  subjectName: string;
  status: string;
  dueAt: string;
  acknowledgedAt?: string;
}

interface PlAcknowledgementsTableProps {
  acknowledgements: Acknowledgement[];
  onRemind?: (ack: Acknowledgement) => void;
  onMarkAcknowledged?: (ack: Acknowledgement) => void;
  onSelect?: (ack: Acknowledgement) => void;
}

export function PlAcknowledgementsTable({
  acknowledgements,
  onRemind,
  onMarkAcknowledged,
  onSelect,
}: PlAcknowledgementsTableProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getDaysUntilDue = (dueAt: string) => {
    const now = new Date();
    const due = new Date(dueAt);
    const diffMs = due.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  if (acknowledgements.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center">
        <div className="text-stone-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-stone-600 font-medium">Нет подтверждений</p>
        <p className="text-stone-500 text-sm mt-1">Запросите подтверждение ознакомления с документом</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-stone-50/50 border-b border-stone-200/50">
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Документ
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Версия
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Пользователь/Роль
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Статус
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Срок
            </th>
            <th className="text-left text-xs font-semibold text-stone-600 uppercase tracking-wider px-4 py-3">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {acknowledgements.map((ack) => {
            const daysLeft = getDaysUntilDue(ack.dueAt);
            const isOverdue = daysLeft < 0;

            return (
              <tr
                key={ack.id}
                onClick={() => onSelect?.(ack)}
                className="hover:bg-stone-50/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-800">{ack.docTitle}</div>
                  <span className="text-xs text-stone-500">
                    {ack.docType === 'policy' ? 'Политика' : 'SOP'}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-sm text-stone-600">
                  {ack.versionLabel}
                </td>
                <td className="px-4 py-3 text-stone-700">
                  {ack.subjectName}
                </td>
                <td className="px-4 py-3">
                  <PlStatusPill status={ack.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    {formatDate(ack.dueAt)}
                  </div>
                  {ack.status !== 'acknowledged' && (
                    <div className={`text-xs ${isOverdue ? 'text-red-600' : daysLeft <= 3 ? 'text-amber-600' : 'text-stone-500'}`}>
                      {isOverdue ? `Просрочено на ${Math.abs(daysLeft)} дн.` : `Осталось ${daysLeft} дн.`}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {ack.status !== 'acknowledged' && onRemind && (
                      <Button
                        variant="ghost"
                        onClick={() => onRemind(ack)}
                        className="text-xs px-2 py-1"
                      >
                        Напомнить
                      </Button>
                    )}
                    {ack.status !== 'acknowledged' && onMarkAcknowledged && (
                      <Button
                        variant="ghost"
                        onClick={() => onMarkAcknowledged(ack)}
                        className="text-xs px-2 py-1"
                      >
                        Подтвердить
                      </Button>
                    )}
                    {ack.status === 'acknowledged' && ack.acknowledgedAt && (
                      <span className="text-xs text-stone-500">
                        {formatDate(ack.acknowledgedAt)}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
