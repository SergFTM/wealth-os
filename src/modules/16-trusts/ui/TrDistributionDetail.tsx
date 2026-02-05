"use client";

import { ArrowLeft, Edit, CheckCircle, XCircle, Clock, FileEdit, Banknote, User, Calendar, FileText, AlertTriangle } from 'lucide-react';

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
  cashAccountId: string | null;
  liquidityRef: string | null;
  docIds: string[];
  notes: string | null;
  requestedBy: string;
  requestedAt: string;
  approvedBy: string | null;
  approvedAt: string | null;
  paidAt: string | null;
}

interface TrDistributionDetailProps {
  distribution: Distribution;
  trustName?: string;
  beneficiaryName?: string;
  onBack?: () => void;
  onEdit?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onMarkPaid?: () => void;
}

const statusConfig = {
  draft: { label: 'Черновик', color: 'text-stone-600', bg: 'bg-stone-100', Icon: FileEdit },
  pending: { label: 'В ожидании', color: 'text-amber-600', bg: 'bg-amber-50', Icon: Clock },
  approved: { label: 'Одобрено', color: 'text-blue-600', bg: 'bg-blue-50', Icon: CheckCircle },
  paid: { label: 'Выплачено', color: 'text-emerald-600', bg: 'bg-emerald-50', Icon: Banknote },
};

const approvalStatusConfig = {
  not_submitted: { label: 'Не подано', color: 'text-stone-500', bg: 'bg-stone-100' },
  pending_approval: { label: 'На одобрении', color: 'text-amber-600', bg: 'bg-amber-50' },
  approved: { label: 'Одобрено', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  rejected: { label: 'Отклонено', color: 'text-red-600', bg: 'bg-red-50' },
};

export function TrDistributionDetail({
  distribution,
  trustName,
  beneficiaryName,
  onBack,
  onEdit,
  onApprove,
  onReject,
  onMarkPaid,
}: TrDistributionDetailProps) {
  const status = statusConfig[distribution.status];
  const approvalStatus = approvalStatusConfig[distribution.approvalStatus];
  const StatusIcon = status.Icon;

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const canApprove = distribution.approvalStatus === 'pending_approval';
  const canMarkPaid = distribution.status === 'approved' && distribution.approvalStatus === 'approved';

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
          <h1 className="text-2xl font-bold text-stone-800">Распределение</h1>
          <p className="text-stone-600 mt-1">{distribution.purpose}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg ${status.bg} ${status.color}`}>
            <StatusIcon className="w-4 h-4" />
            {status.label}
          </span>
          {onEdit && distribution.status === 'draft' && (
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

      {/* Main Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <h3 className="font-semibold text-stone-700 mb-4">Детали распределения</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-stone-800">
                  {formatCurrency(distribution.amount, distribution.currency)}
                </div>
                <div className="text-sm text-stone-500">Сумма распределения</div>
              </div>
            </div>

            <div className="border-t border-stone-100 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Траст</span>
                <span className="font-medium text-stone-800">{trustName || distribution.trustId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Бенефициар</span>
                <span className="font-medium text-stone-800 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-stone-400" />
                  {beneficiaryName || distribution.beneficiaryId}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Дата выплаты</span>
                <span className="font-medium text-stone-800 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  {new Date(distribution.date).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Назначение</span>
                <span className="font-medium text-stone-800">{distribution.purpose}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <h3 className="font-semibold text-stone-700 mb-4">Статус одобрения</h3>
          <div className="space-y-4">
            <div className={`p-3 rounded-xl ${approvalStatus.bg}`}>
              <span className={`text-sm font-medium ${approvalStatus.color}`}>
                {approvalStatus.label}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-500">Запрошено</span>
                <span className="font-medium text-stone-800">{distribution.requestedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Дата запроса</span>
                <span className="font-medium text-stone-800">
                  {new Date(distribution.requestedAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
              {distribution.approvedBy && (
                <>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Одобрено</span>
                    <span className="font-medium text-stone-800">{distribution.approvedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Дата одобрения</span>
                    <span className="font-medium text-stone-800">
                      {distribution.approvedAt && new Date(distribution.approvedAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </>
              )}
              {distribution.paidAt && (
                <div className="flex justify-between">
                  <span className="text-stone-500">Дата выплаты</span>
                  <span className="font-medium text-emerald-600">
                    {new Date(distribution.paidAt).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {(canApprove || canMarkPaid) && (
              <div className="pt-4 border-t border-stone-100 flex gap-2">
                {canApprove && (
                  <>
                    <button
                      onClick={onApprove}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Одобрить
                    </button>
                    <button
                      onClick={onReject}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 font-medium rounded-xl border border-red-200 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      Отклонить
                    </button>
                  </>
                )}
                {canMarkPaid && (
                  <button
                    onClick={onMarkPaid}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                  >
                    <Banknote className="w-4 h-4" />
                    Отметить выплаченным
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* References */}
      {(distribution.cashAccountId || distribution.liquidityRef) && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <h3 className="font-semibold text-stone-700 mb-4">Связанные объекты</h3>
          <div className="flex flex-wrap gap-3">
            {distribution.cashAccountId && (
              <div className="flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-lg text-sm">
                <Banknote className="w-4 h-4 text-stone-500" />
                <span className="text-stone-600">Счёт: {distribution.cashAccountId}</span>
              </div>
            )}
            {distribution.liquidityRef && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg text-sm">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-blue-600">Ликвидность: {distribution.liquidityRef}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {distribution.notes && (
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <h3 className="font-semibold text-stone-700 mb-2">Заметки</h3>
          <p className="text-stone-600">{distribution.notes}</p>
        </div>
      )}
    </div>
  );
}
