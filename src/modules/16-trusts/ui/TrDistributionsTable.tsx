"use client";

import { Clock, CheckCircle, AlertCircle, FileEdit, Banknote } from 'lucide-react';

interface Distribution {
  id: string;
  trustId: string;
  beneficiaryId: string;
  date: string;
  amount: number;
  currency: string;
  purpose: string;
  status: 'draft' | 'pending' | 'approved' | 'paid';
  approvalStatus: 'not_submitted' | 'pending_approval' | 'approved' | 'rejected';
  requestedBy: string;
  approvedBy: string | null;
  paidAt: string | null;
  notes: string | null;
}

interface TrDistributionsTableProps {
  distributions: Distribution[];
  onRowClick?: (distribution: Distribution) => void;
  showTrustColumn?: boolean;
  trustNames?: Record<string, string>;
  beneficiaryNames?: Record<string, string>;
}

const statusConfig = {
  draft: { label: 'Черновик', color: 'text-stone-600', bg: 'bg-stone-100', Icon: FileEdit },
  pending: { label: 'В ожидании', color: 'text-amber-600', bg: 'bg-amber-50', Icon: Clock },
  approved: { label: 'Одобрено', color: 'text-blue-600', bg: 'bg-blue-50', Icon: CheckCircle },
  paid: { label: 'Выплачено', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: Banknote },
};

const approvalStatusConfig = {
  not_submitted: { label: 'Не подано', color: 'text-stone-500' },
  pending_approval: { label: 'На одобрении', color: 'text-amber-600' },
  approved: { label: 'Одобрено', color: 'text-emerald-600' },
  rejected: { label: 'Отклонено', color: 'text-red-600' },
};

export function TrDistributionsTable({
  distributions,
  onRowClick,
  showTrustColumn = false,
  trustNames = {},
  beneficiaryNames = {},
}: TrDistributionsTableProps) {
  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const sortedDistributions = [...distributions].sort((a, b) => {
    const statusOrder = { pending: 0, approved: 1, draft: 2, paid: 3 };
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Бенефициар</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-stone-600 uppercase">Сумма</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Назначение</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-stone-600 uppercase">Статус</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-stone-600 uppercase">Одобрение</th>
            </tr>
          </thead>
          <tbody>
            {sortedDistributions.map((dist) => {
              const status = statusConfig[dist.status];
              const approvalStatus = approvalStatusConfig[dist.approvalStatus];
              const StatusIcon = status.Icon;
              const isPastDue = dist.status === 'pending' && new Date(dist.date) < new Date();

              return (
                <tr
                  key={dist.id}
                  onClick={() => onRowClick?.(dist)}
                  className={`border-b border-stone-100 hover:bg-stone-50 cursor-pointer transition-colors ${
                    isPastDue ? 'bg-red-50/30' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-stone-800">
                      {new Date(dist.date).toLocaleDateString('ru-RU')}
                    </div>
                    {isPastDue && (
                      <div className="flex items-center gap-1 text-xs text-red-600 mt-0.5">
                        <AlertCircle className="w-3 h-3" />
                        Просрочено
                      </div>
                    )}
                  </td>
                  {showTrustColumn && (
                    <td className="px-4 py-3 text-stone-600">
                      {trustNames[dist.trustId] || dist.trustId}
                    </td>
                  )}
                  <td className="px-4 py-3 text-stone-700 font-medium">
                    {beneficiaryNames[dist.beneficiaryId] || dist.beneficiaryId}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-semibold text-stone-800">
                      {formatCurrency(dist.amount, dist.currency)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-stone-700 line-clamp-1">{dist.purpose}</div>
                    {dist.notes && (
                      <div className="text-xs text-stone-500 line-clamp-1 mt-0.5">{dist.notes}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className={`text-xs font-medium ${approvalStatus.color}`}>
                      {approvalStatus.label}
                    </div>
                    {dist.approvedBy && (
                      <div className="text-xs text-stone-500 mt-0.5">
                        {dist.approvedBy}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortedDistributions.length === 0 && (
        <div className="p-8 text-center text-stone-500">
          Нет распределений для отображения
        </div>
      )}
    </div>
  );
}
