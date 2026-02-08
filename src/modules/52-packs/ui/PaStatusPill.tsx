"use client";

type PackStatus = 'draft' | 'pending_approval' | 'approved' | 'shared' | 'closed';
type ShareStatus = 'active' | 'expired' | 'revoked';
type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired';

const packStatusConfig: Record<PackStatus, { label: string; color: string }> = {
  draft: { label: 'Черновик', color: 'bg-stone-100 text-stone-700 border-stone-200' },
  pending_approval: { label: 'На согласовании', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved: { label: 'Одобрен', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  shared: { label: 'Опубликован', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  closed: { label: 'Закрыт', color: 'bg-stone-200 text-stone-600 border-stone-300' },
};

const shareStatusConfig: Record<ShareStatus, { label: string; color: string }> = {
  active: { label: 'Активна', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  expired: { label: 'Истекла', color: 'bg-stone-100 text-stone-600 border-stone-200' },
  revoked: { label: 'Отозвана', color: 'bg-red-50 text-red-700 border-red-200' },
};

const approvalStatusConfig: Record<ApprovalStatus, { label: string; color: string }> = {
  pending: { label: 'Ожидает', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  approved: { label: 'Одобрено', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  rejected: { label: 'Отклонено', color: 'bg-red-50 text-red-700 border-red-200' },
  expired: { label: 'Просрочено', color: 'bg-stone-100 text-stone-600 border-stone-200' },
};

interface PaStatusPillProps {
  status: string;
  type?: 'pack' | 'share' | 'approval';
}

export function PaStatusPill({ status, type = 'pack' }: PaStatusPillProps) {
  let config: { label: string; color: string };

  switch (type) {
    case 'share':
      config = shareStatusConfig[status as ShareStatus] || { label: status, color: 'bg-stone-100 text-stone-700' };
      break;
    case 'approval':
      config = approvalStatusConfig[status as ApprovalStatus] || { label: status, color: 'bg-stone-100 text-stone-700' };
      break;
    default:
      config = packStatusConfig[status as PackStatus] || { label: status, color: 'bg-stone-100 text-stone-700' };
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
}

export function PaSensitivityPill({ level }: { level: 'low' | 'medium' | 'high' }) {
  const config = {
    low: { label: 'Низкий', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    medium: { label: 'Средний', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    high: { label: 'Высокий', color: 'bg-red-50 text-red-700 border-red-200' },
  };

  const { label, color } = config[level];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      {label}
    </span>
  );
}

export function PaClientSafeBadge({ isClientSafe }: { isClientSafe: boolean }) {
  if (!isClientSafe) return null;

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200">
      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      Client-safe
    </span>
  );
}
