"use client";

import { cn } from '@/lib/utils';

interface PcCommitmentDetailProps {
  commitment: {
    id: string;
    fundId: string;
    fundName?: string;
    entityId: string;
    entityName?: string;
    amountCommitted: number;
    amountCalled: number;
    amountDistributed: number;
    unfunded: number;
    currency: string;
    status: string;
    asOf?: string;
    notes?: string;
  };
  onClose: () => void;
  onEdit?: () => void;
  onCreateCall?: () => void;
  onViewCashFlows?: () => void;
}

export function PcCommitmentDetail({ commitment, onClose, onEdit, onCreateCall, onViewCashFlows }: PcCommitmentDetailProps) {
  const c = commitment;
  
  const formatCurrency = (val: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(val);
  };

  const calledPct = c.amountCommitted > 0 ? (c.amountCalled / c.amountCommitted) * 100 : 0;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
        <div>
          <h2 className="text-lg font-bold text-stone-800">Commitment</h2>
          <div className="text-sm text-stone-600">{c.fundName || c.fundId}</div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg transition-colors">✕</button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-stone-500">Called Progress</span>
            <span className="font-medium text-stone-700">{calledPct.toFixed(0)}%</span>
          </div>
          <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all"
              style={{ width: `${calledPct}%` }}
            />
          </div>
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-stone-50 rounded-lg">
            <div className="text-xs text-stone-500">Committed</div>
            <div className="text-lg font-bold text-stone-800">{formatCurrency(c.amountCommitted, c.currency)}</div>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg">
            <div className="text-xs text-stone-500">Called</div>
            <div className="text-lg font-bold text-stone-700">{formatCurrency(c.amountCalled, c.currency)}</div>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg">
            <div className="text-xs text-amber-600">Unfunded</div>
            <div className="text-lg font-bold text-amber-700">{formatCurrency(c.unfunded, c.currency)}</div>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg">
            <div className="text-xs text-emerald-600">Distributed</div>
            <div className="text-lg font-bold text-emerald-700">{formatCurrency(c.amountDistributed, c.currency)}</div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-sm text-stone-500">Entity</span>
            <span className="text-sm font-medium text-stone-800">{c.entityName || c.entityId}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-sm text-stone-500">Status</span>
            <span className={cn(
              "px-2 py-0.5 rounded text-xs font-medium",
              c.status === 'active' && "bg-emerald-100 text-emerald-700",
              c.status === 'fully_called' && "bg-blue-100 text-blue-700",
              c.status === 'closed' && "bg-stone-100 text-stone-600"
            )}>
              {c.status === 'active' ? 'Активно' : c.status === 'fully_called' ? 'Полностью выбрано' : 'Закрыто'}
            </span>
          </div>
          {c.asOf && (
            <div className="flex justify-between py-2 border-b border-stone-100">
              <span className="text-sm text-stone-500">As-of</span>
              <span className="text-sm text-stone-800">{c.asOf}</span>
            </div>
          )}
        </div>

        {c.notes && (
          <div>
            <h4 className="text-sm font-medium text-stone-700 mb-2">Notes</h4>
            <p className="text-sm text-stone-600 bg-stone-50 p-3 rounded-lg">{c.notes}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-stone-200 flex gap-2">
        {onEdit && (
          <button onClick={onEdit} className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm hover:bg-stone-200 transition-colors">
            Редактировать
          </button>
        )}
        {onCreateCall && c.unfunded > 0 && (
          <button onClick={onCreateCall} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm hover:bg-emerald-200 transition-colors">
            + Capital Call
          </button>
        )}
        {onViewCashFlows && (
          <button onClick={onViewCashFlows} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
            Cash Flows
          </button>
        )}
      </div>
    </div>
  );
}
