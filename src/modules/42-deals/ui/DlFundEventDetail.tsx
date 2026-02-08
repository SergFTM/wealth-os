"use client";

import { DlStatusPill } from './DlStatusPill';
import { DlDocumentsPanel } from './DlDocumentsPanel';
import { Button } from '@/components/ui/Button';

interface FundEvent {
  id: string;
  fundId: string;
  fundName: string;
  eventType: string;
  eventDate: string;
  dueDate?: string;
  amount: number;
  currency?: string;
  status: 'planned' | 'announced' | 'recorded' | 'paid' | 'cancelled';
  navDetailsJson?: Record<string, unknown>;
  callDetailsJson?: Record<string, unknown>;
  distributionDetailsJson?: Record<string, unknown>;
  linkedCashFlowId?: string;
  notes?: string;
}

interface DlFundEventDetailProps {
  event: FundEvent;
  documents?: Array<{
    id: string;
    docName: string;
    status: 'missing' | 'requested' | 'received' | 'under_review' | 'approved' | 'rejected';
  }>;
  onMarkRecorded?: () => void;
  onMarkPaid?: () => void;
  onAttachDoc?: () => void;
  onViewFund?: () => void;
  onViewCashFlow?: () => void;
  onEdit?: () => void;
}

const EVENT_TYPE_LABELS: Record<string, string> = {
  capital_call: 'Capital Call',
  distribution: 'Distribution',
  nav_update: 'NAV Update',
  recallable: 'Recallable Distribution',
  equalization: 'Equalization',
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  capital_call: 'text-red-600',
  distribution: 'text-emerald-600',
  nav_update: 'text-blue-600',
  recallable: 'text-amber-600',
  equalization: 'text-stone-600',
};

export function DlFundEventDetail({
  event,
  documents = [],
  onMarkRecorded,
  onMarkPaid,
  onAttachDoc,
  onViewFund,
  onViewCashFlow,
  onEdit,
}: DlFundEventDetailProps) {
  const isOutflow = event.eventType === 'capital_call';
  const navDetails = event.navDetailsJson || {};
  const callDetails = event.callDetailsJson || {};
  const distDetails = event.distributionDetailsJson || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-2xl font-bold ${EVENT_TYPE_COLORS[event.eventType]}`}>
              {EVENT_TYPE_LABELS[event.eventType]}
            </span>
            <DlStatusPill status={event.status} />
          </div>
          <p className="text-stone-600">{event.fundName}</p>
          <p className={`text-2xl font-bold mt-2 ${isOutflow ? 'text-red-600' : 'text-emerald-600'}`}>
            {isOutflow ? '-' : '+'}${event.amount.toLocaleString()} {event.currency || 'USD'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {event.status === 'announced' && onMarkRecorded && (
            <Button variant="primary" onClick={onMarkRecorded}>
              Записать
            </Button>
          )}
          {event.status === 'recorded' && event.eventType === 'capital_call' && onMarkPaid && (
            <Button variant="primary" onClick={onMarkPaid}>
              Отметить оплату
            </Button>
          )}
          {onEdit && (
            <Button variant="secondary" onClick={onEdit}>
              Редактировать
            </Button>
          )}
        </div>
      </div>

      {/* Key dates */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <h3 className="font-semibold text-stone-800 mb-3">Даты</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-stone-500 mb-1">Дата события</div>
            <div className="font-medium text-stone-800">
              {new Date(event.eventDate).toLocaleDateString('ru-RU')}
            </div>
          </div>
          {event.dueDate && (
            <div>
              <div className="text-xs text-stone-500 mb-1">Срок оплаты</div>
              <div className={`font-medium ${
                new Date(event.dueDate) < new Date() && event.status !== 'paid'
                  ? 'text-red-600'
                  : 'text-stone-800'
              }`}>
                {new Date(event.dueDate).toLocaleDateString('ru-RU')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Event-specific details */}
      {event.eventType === 'capital_call' && Object.keys(callDetails).length > 0 && (
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <h3 className="font-semibold text-red-800 mb-3">Capital Call Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {callDetails.callNumber !== undefined && (
              <div>
                <div className="text-xs text-red-600 mb-1">Call #</div>
                <div className="font-medium text-red-800">{String(callDetails.callNumber)}</div>
              </div>
            )}
            {callDetails.percentCalled !== undefined && (
              <div>
                <div className="text-xs text-red-600 mb-1">% called</div>
                <div className="font-medium text-red-800">{String(callDetails.percentCalled)}%</div>
              </div>
            )}
            {callDetails.cumulativeCalled !== undefined && (
              <div>
                <div className="text-xs text-red-600 mb-1">Cumulative</div>
                <div className="font-medium text-red-800">{String(callDetails.cumulativeCalled)}%</div>
              </div>
            )}
            {callDetails.unfundedCommitment !== undefined && (
              <div>
                <div className="text-xs text-red-600 mb-1">Unfunded</div>
                <div className="font-medium text-red-800">
                  ${Number(callDetails.unfundedCommitment).toLocaleString()}
                </div>
              </div>
            )}
            {callDetails.purpose !== undefined && (
              <div className="col-span-2">
                <div className="text-xs text-red-600 mb-1">Purpose</div>
                <div className="text-red-800">{String(callDetails.purpose)}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {event.eventType === 'distribution' && Object.keys(distDetails).length > 0 && (
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
          <h3 className="font-semibold text-emerald-800 mb-3">Distribution Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {distDetails.distributionType !== undefined && (
              <div>
                <div className="text-xs text-emerald-600 mb-1">Type</div>
                <div className="font-medium text-emerald-800">{String(distDetails.distributionType)}</div>
              </div>
            )}
            {distDetails.returnOfCapital !== undefined && (
              <div>
                <div className="text-xs text-emerald-600 mb-1">Return of Capital</div>
                <div className="font-medium text-emerald-800">
                  ${Number(distDetails.returnOfCapital).toLocaleString()}
                </div>
              </div>
            )}
            {distDetails.gains !== undefined && (
              <div>
                <div className="text-xs text-emerald-600 mb-1">Gains</div>
                <div className="font-medium text-emerald-800">
                  ${Number(distDetails.gains).toLocaleString()}
                </div>
              </div>
            )}
            {distDetails.income !== undefined && (
              <div>
                <div className="text-xs text-emerald-600 mb-1">Income</div>
                <div className="font-medium text-emerald-800">
                  ${Number(distDetails.income).toLocaleString()}
                </div>
              </div>
            )}
            {distDetails.recallable === true && (
              <div>
                <div className="text-xs text-amber-600 mb-1">Recallable</div>
                <div className="font-medium text-amber-700">Да</div>
              </div>
            )}
          </div>
        </div>
      )}

      {event.eventType === 'nav_update' && Object.keys(navDetails).length > 0 && (
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <h3 className="font-semibold text-blue-800 mb-3">NAV Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {navDetails.previousNav !== undefined && (
              <div>
                <div className="text-xs text-blue-600 mb-1">Previous NAV</div>
                <div className="font-medium text-blue-800">
                  ${Number(navDetails.previousNav).toLocaleString()}
                </div>
              </div>
            )}
            {navDetails.newNav !== undefined && (
              <div>
                <div className="text-xs text-blue-600 mb-1">New NAV</div>
                <div className="font-medium text-blue-800">
                  ${Number(navDetails.newNav).toLocaleString()}
                </div>
              </div>
            )}
            {navDetails.navPerUnit !== undefined && (
              <div>
                <div className="text-xs text-blue-600 mb-1">NAV per Unit</div>
                <div className="font-medium text-blue-800">
                  ${Number(navDetails.navPerUnit).toFixed(2)}
                </div>
              </div>
            )}
            {navDetails.valuationDate !== undefined && (
              <div>
                <div className="text-xs text-blue-600 mb-1">Valuation Date</div>
                <div className="font-medium text-blue-800">
                  {new Date(String(navDetails.valuationDate)).toLocaleDateString('ru-RU')}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="flex flex-wrap gap-2">
        {onViewFund && (
          <Button variant="ghost" size="sm" onClick={onViewFund}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Фонд в Private Capital
          </Button>
        )}
        {event.linkedCashFlowId && onViewCashFlow && (
          <Button variant="ghost" size="sm" onClick={onViewCashFlow}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Cash Flow в Liquidity
          </Button>
        )}
      </div>

      {/* Documents */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-stone-800">Документы</h3>
          {onAttachDoc && (
            <Button variant="ghost" size="sm" onClick={onAttachDoc}>
              Прикрепить
            </Button>
          )}
        </div>
        <DlDocumentsPanel documents={documents} compact />
      </div>

      {/* Notes */}
      {event.notes && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <h3 className="font-semibold text-stone-800 mb-2">Заметки</h3>
          <p className="text-stone-600">{event.notes}</p>
        </div>
      )}
    </div>
  );
}

export default DlFundEventDetail;
