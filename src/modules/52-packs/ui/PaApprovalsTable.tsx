"use client";

import Link from 'next/link';
import { PaStatusPill } from './PaStatusPill';

interface PackApproval {
  id: string;
  packId: string;
  packName?: string;
  requestedByUserId: string;
  requestedByName?: string;
  approverRoleKey: string;
  statusKey: string;
  decisionByUserId?: string;
  decisionByName?: string;
  decisionAt?: string;
  notes?: string;
  dueAt?: string;
  urgencyKey?: string;
  createdAt: string;
}

interface PaApprovalsTableProps {
  approvals: PackApproval[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onOpen?: (packId: string) => void;
}

const roleLabels: Record<string, string> = {
  admin: 'Администратор',
  cfo: 'CFO',
  controller: 'Контроллер',
  compliance: 'Комплаенс',
  legal: 'Юрист',
  family_office_head: 'Глава FO',
};

const urgencyLabels: Record<string, { label: string; color: string }> = {
  low: { label: 'Низкий', color: 'text-stone-500' },
  normal: { label: 'Обычный', color: 'text-stone-600' },
  high: { label: 'Высокий', color: 'text-amber-600' },
  urgent: { label: 'Срочно', color: 'text-red-600' },
};

export function PaApprovalsTable({ approvals, onApprove, onReject, onOpen }: PaApprovalsTableProps) {
  if (approvals.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        <svg className="w-12 h-12 mx-auto mb-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium">Нет запросов на согласование</p>
        <p className="text-sm mt-1">Все пакеты согласованы</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="text-left py-3 px-4 font-medium text-stone-600">Пакет</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Запросил</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Роль</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Приоритет</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Срок</th>
            <th className="text-left py-3 px-4 font-medium text-stone-600">Статус</th>
            <th className="text-right py-3 px-4 font-medium text-stone-600"></th>
          </tr>
        </thead>
        <tbody>
          {approvals.map((approval) => {
            const isOverdue = approval.dueAt && new Date(approval.dueAt) < new Date() && approval.statusKey === 'pending';

            return (
              <tr
                key={approval.id}
                className={`border-b border-stone-100 hover:bg-stone-50 transition-colors ${isOverdue ? 'bg-red-50' : ''}`}
              >
                <td className="py-3 px-4">
                  <Link
                    href={`/m/packs/pack/${approval.packId}`}
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    {approval.packName || approval.packId.slice(0, 8)}
                  </Link>
                </td>
                <td className="py-3 px-4 text-stone-600">
                  {approval.requestedByName || 'Неизвестно'}
                </td>
                <td className="py-3 px-4 text-stone-600">
                  {roleLabels[approval.approverRoleKey] || approval.approverRoleKey}
                </td>
                <td className="py-3 px-4">
                  <span className={urgencyLabels[approval.urgencyKey || 'normal']?.color}>
                    {urgencyLabels[approval.urgencyKey || 'normal']?.label}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {approval.dueAt ? (
                    <span className={isOverdue ? 'text-red-600 font-medium' : 'text-stone-600'}>
                      {formatDate(approval.dueAt)}
                      {isOverdue && ' ⚠️'}
                    </span>
                  ) : (
                    <span className="text-stone-400">—</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <PaStatusPill status={approval.statusKey} type="approval" />
                </td>
                <td className="py-3 px-4 text-right">
                  {approval.statusKey === 'pending' && (
                    <div className="flex items-center justify-end gap-2">
                      {onApprove && (
                        <button
                          onClick={() => onApprove(approval.id)}
                          className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200"
                        >
                          Одобрить
                        </button>
                      )}
                      {onReject && (
                        <button
                          onClick={() => onReject(approval.id)}
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          Отклонить
                        </button>
                      )}
                    </div>
                  )}
                  {approval.statusKey !== 'pending' && approval.decisionByName && (
                    <span className="text-xs text-stone-500">
                      {approval.decisionByName}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ru-RU');
}

export function PaApprovalCard({
  approval,
  onApprove,
  onReject,
}: {
  approval: PackApproval;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isOverdue = approval.dueAt && new Date(approval.dueAt) < new Date();

  return (
    <div className={`bg-white rounded-xl border p-4 ${isOverdue ? 'border-red-200 bg-red-50' : 'border-stone-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <Link
            href={`/m/packs/pack/${approval.packId}`}
            className="text-lg font-medium text-emerald-600 hover:text-emerald-700"
          >
            {approval.packName}
          </Link>
          <div className="text-sm text-stone-500 mt-1">
            Запросил: {approval.requestedByName}
          </div>
        </div>
        <PaStatusPill status={approval.statusKey} type="approval" />
      </div>

      <div className="flex items-center gap-4 text-sm text-stone-600 mb-4">
        <span>Роль: {roleLabels[approval.approverRoleKey]}</span>
        {approval.dueAt && (
          <span className={isOverdue ? 'text-red-600' : ''}>
            Срок: {formatDate(approval.dueAt)}
          </span>
        )}
      </div>

      {approval.notes && (
        <p className="text-sm text-stone-600 mb-4 bg-stone-50 p-2 rounded">
          {approval.notes}
        </p>
      )}

      {approval.statusKey === 'pending' && (
        <div className="flex items-center gap-2">
          <button
            onClick={onApprove}
            className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700"
          >
            Одобрить
          </button>
          <button
            onClick={onReject}
            className="flex-1 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200"
          >
            Отклонить
          </button>
        </div>
      )}
    </div>
  );
}
