"use client";

import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/lib/utils';

interface PsDetailHeaderProps {
  title: string;
  subtitle?: string;
  type?: 'partnership' | 'owner' | 'interest' | 'transaction' | 'distribution';
  status?: string;
  splitMode?: 'ownership' | 'profit';
  onBack?: () => void;
  onEdit?: () => void;
  onAddOwner?: () => void;
  onAddInterest?: () => void;
  onCreateTx?: () => void;
  onCreateDist?: () => void;
  onPostToGL?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  showApprovalActions?: boolean;
  showPostToGL?: boolean;
}

const statusMap: Record<string, 'ok' | 'warning' | 'critical' | 'pending'> = {
  active: 'ok', inactive: 'pending', liquidating: 'warning', pending: 'warning',
  posted: 'ok', draft: 'pending', pending_change: 'warning', approved: 'ok', rejected: 'critical'
};

const statusLabels: Record<string, string> = {
  active: 'Активен', inactive: 'Неактивен', liquidating: 'Ликвидация',
  pending: 'Ожидает', posted: 'Проведено', draft: 'Черновик',
  pending_change: 'Ожидает изменения', approved: 'Одобрено', rejected: 'Отклонено'
};

const typeIcons: Record<string, string> = {
  partnership: '🏢', owner: '👤', interest: '📊', transaction: '💰', distribution: '💸'
};

export function PsDetailHeader({
  title, subtitle, type = 'partnership', status = 'active', splitMode,
  onBack, onEdit, onAddOwner, onAddInterest, onCreateTx, onCreateDist,
  onPostToGL, onApprove, onReject, showApprovalActions, showPostToGL
}: PsDetailHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        {onBack && (
          <button onClick={onBack} className="text-sm text-stone-500 hover:text-stone-700 mb-2 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Назад
          </button>
        )}
        <div className="flex items-center gap-3">
          <span className="text-2xl">{typeIcons[type]}</span>
          <div>
            <h1 className="text-2xl font-bold text-stone-800">{title}</h1>
            {subtitle && <p className="text-sm text-stone-500">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <StatusBadge status={statusMap[status] || 'pending'} label={statusLabels[status] || status} />
          {splitMode && (
            <span className={cn("px-2 py-0.5 rounded text-xs font-medium",
              splitMode === 'ownership' ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700")}>
              {splitMode === 'ownership' ? 'По собственности' : 'По прибыли'}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {showApprovalActions && (
          <>
            <Button variant="primary" size="sm" onClick={onApprove}>Одобрить</Button>
            <Button variant="ghost" size="sm" className="text-rose-600" onClick={onReject}>Отклонить</Button>
          </>
        )}
        {showPostToGL && (
          <Button variant="secondary" size="sm" onClick={onPostToGL}>Post to GL</Button>
        )}
        {type === 'partnership' && (
          <>
            {onAddOwner && <Button variant="secondary" size="sm" onClick={onAddOwner}>+ Owner</Button>}
            {onAddInterest && <Button variant="secondary" size="sm" onClick={onAddInterest}>+ Доля</Button>}
            {onCreateTx && <Button variant="secondary" size="sm" onClick={onCreateTx}>+ Транзакция</Button>}
            {onCreateDist && <Button variant="secondary" size="sm" onClick={onCreateDist}>+ Распределение</Button>}
          </>
        )}
        {onEdit && <Button variant="ghost" size="sm" onClick={onEdit}>Изменить</Button>}
      </div>
    </div>
  );
}
