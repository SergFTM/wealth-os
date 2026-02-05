"use client";

import { FileWarning, Calendar, Clock, CheckCircle, XCircle, Ban, User, FileText, AlertTriangle } from 'lucide-react';

interface Waiver {
  id: string;
  policyId: string;
  constraintId?: string;
  breachId?: string;
  reason: string;
  startDate: string;
  endDate: string;
  allowedDeviation?: string;
  status: 'pending' | 'active' | 'expired' | 'revoked';
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

interface Constraint {
  id: string;
  type: string;
  segment?: string;
}

interface IpsWaiverDetailProps {
  waiver: Waiver;
  constraint?: Constraint;
  policyName?: string;
  onApprove?: () => void;
  onReject?: () => void;
  onRevoke?: () => void;
  onEdit?: () => void;
}

const statusLabels: Record<string, string> = {
  pending: 'Ожидает',
  active: 'Активен',
  expired: 'Истёк',
  revoked: 'Отозван',
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  expired: 'bg-stone-100 text-stone-500 border-stone-200',
  revoked: 'bg-red-100 text-red-700 border-red-200',
};

const approvalLabels: Record<string, string> = {
  pending: 'На согласовании',
  approved: 'Одобрен',
  rejected: 'Отклонён',
};

const approvalColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

const typeLabels: Record<string, string> = {
  asset_limit: 'Класс активов',
  concentration: 'Концентрация',
  geo: 'География',
  sector: 'Сектор',
  liquidity: 'Ликвидность',
  leverage: 'Плечо',
  esg: 'ESG',
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getDaysRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export function IpsWaiverDetail({
  waiver,
  constraint,
  policyName,
  onApprove,
  onReject,
  onRevoke,
  onEdit,
}: IpsWaiverDetailProps) {
  const daysRemaining = getDaysRemaining(waiver.endDate);
  const isExpiringSoon = waiver.status === 'active' && daysRemaining > 0 && daysRemaining <= 14;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <FileWarning className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-stone-800">
                Waiver: {constraint ? typeLabels[constraint.type] || constraint.type : 'Ограничение'}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {policyName && <span className="text-sm text-stone-500">{policyName}</span>}
                <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${approvalColors[waiver.approvalStatus]}`}>
                  {approvalLabels[waiver.approvalStatus]}
                </span>
              </div>
            </div>
          </div>
          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${statusColors[waiver.status]}`}>
            {statusLabels[waiver.status]}
          </span>
        </div>

        {/* Expiring Soon Warning */}
        {isExpiringSoon && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
            <Clock className="w-5 h-5 text-amber-600" />
            <span className="text-sm text-amber-700">
              Истекает через {daysRemaining} дн. ({formatDate(waiver.endDate)})
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-100">
          {waiver.approvalStatus === 'pending' && onApprove && (
            <button
              onClick={onApprove}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Одобрить
            </button>
          )}
          {waiver.approvalStatus === 'pending' && onReject && (
            <button
              onClick={onReject}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              Отклонить
            </button>
          )}
          {waiver.status === 'active' && onRevoke && (
            <button
              onClick={onRevoke}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
            >
              <Ban className="w-4 h-4" />
              Отозвать
            </button>
          )}
          {waiver.status === 'pending' && onEdit && (
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Редактировать
            </button>
          )}
        </div>
      </div>

      {/* Period */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <h2 className="font-semibold text-stone-800">Период действия</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500 mb-1">Начало</div>
            <div className="text-lg font-semibold text-stone-800">{formatDate(waiver.startDate)}</div>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500 mb-1">Окончание</div>
            <div className="text-lg font-semibold text-stone-800">{formatDate(waiver.endDate)}</div>
          </div>
        </div>
        {waiver.status === 'active' && (
          <div className="mt-4 p-3 bg-emerald-50 rounded-xl text-center">
            <div className="text-xs text-stone-500 mb-1">Осталось дней</div>
            <div className={`text-xl font-bold ${daysRemaining <= 14 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {daysRemaining > 0 ? daysRemaining : 0}
            </div>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-stone-200/50 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-emerald-600" />
          <h2 className="font-semibold text-stone-800">Детали</h2>
        </div>
        <div className="space-y-4">
          <div>
            <div className="text-xs text-stone-500 mb-1">Причина</div>
            <p className="text-sm text-stone-800 bg-stone-50 p-3 rounded-xl">{waiver.reason}</p>
          </div>
          {waiver.allowedDeviation && (
            <div>
              <div className="text-xs text-stone-500 mb-1">Допустимое отклонение</div>
              <div className="text-sm font-mono text-stone-800 bg-stone-50 p-3 rounded-xl">
                {waiver.allowedDeviation}
              </div>
            </div>
          )}
          {constraint?.segment && (
            <div>
              <div className="text-xs text-stone-500 mb-1">Сегмент ограничения</div>
              <div className="text-sm text-stone-800 bg-stone-50 p-3 rounded-xl">{constraint.segment}</div>
            </div>
          )}
        </div>
      </div>

      {/* Approval Info */}
      {waiver.approvalStatus === 'approved' && waiver.approvedAt && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h2 className="font-semibold text-emerald-800">Одобрено</h2>
          </div>
          <div className="flex items-center gap-4 text-sm text-emerald-700">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(waiver.approvedAt)}
            </div>
            {waiver.approvedBy && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {waiver.approvedBy}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rejected/Revoked Info */}
      {(waiver.approvalStatus === 'rejected' || waiver.status === 'revoked') && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h2 className="font-semibold text-red-800">
              {waiver.status === 'revoked' ? 'Отозван' : 'Отклонён'}
            </h2>
          </div>
          <p className="text-sm text-red-700">
            {waiver.status === 'revoked'
              ? 'Этот waiver был отозван и больше не действует.'
              : 'Запрос на waiver был отклонён.'}
          </p>
        </div>
      )}
    </div>
  );
}
