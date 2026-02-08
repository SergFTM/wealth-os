"use client";

import { DlStatusPill } from './DlStatusPill';
import { DlDocumentsPanel } from './DlDocumentsPanel';
import { Button } from '@/components/ui/Button';

interface CorporateAction {
  id: string;
  ticker: string;
  securityName?: string;
  actionType: string;
  effectiveDate: string;
  recordDate?: string;
  exDate?: string;
  paymentDate?: string;
  status: 'planned' | 'announced' | 'processed' | 'cancelled';
  detailsJson?: Record<string, unknown>;
  impactJson?: Record<string, unknown>;
  notes?: string;
  processedAt?: string;
  processedBy?: string;
}

interface DlCorporateActionDetailProps {
  action: CorporateAction;
  documents?: Array<{
    id: string;
    docName: string;
    status: 'missing' | 'requested' | 'received' | 'under_review' | 'approved' | 'rejected';
  }>;
  onMarkProcessed?: () => void;
  onAttachDoc?: () => void;
  onEdit?: () => void;
}

const ACTION_TYPE_LABELS: Record<string, string> = {
  dividend: 'Дивиденд',
  split: 'Сплит',
  reverse_split: 'Обратный сплит',
  merger: 'Слияние',
  acquisition: 'Поглощение',
  tender: 'Тендерное предложение',
  spin_off: 'Спин-офф',
  rights_issue: 'Выпуск прав',
  name_change: 'Смена названия',
  symbol_change: 'Смена тикера',
};

export function DlCorporateActionDetail({
  action,
  documents = [],
  onMarkProcessed,
  onAttachDoc,
  onEdit,
}: DlCorporateActionDetailProps) {
  const details = action.detailsJson || {};
  const impact = action.impactJson || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold text-stone-800">{action.ticker}</span>
            <DlStatusPill status={action.status} />
          </div>
          <p className="text-stone-600">{action.securityName}</p>
          <p className="text-lg font-medium text-stone-700 mt-1">
            {ACTION_TYPE_LABELS[action.actionType] || action.actionType}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {action.status !== 'processed' && onMarkProcessed && (
            <Button variant="primary" onClick={onMarkProcessed}>
              Отметить обработано
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
        <h3 className="font-semibold text-stone-800 mb-3">Ключевые даты</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-xs text-stone-500 mb-1">Effective date</div>
            <div className="font-medium text-stone-800">
              {new Date(action.effectiveDate).toLocaleDateString('ru-RU')}
            </div>
          </div>
          {action.recordDate && (
            <div>
              <div className="text-xs text-stone-500 mb-1">Record date</div>
              <div className="font-medium text-stone-800">
                {new Date(action.recordDate).toLocaleDateString('ru-RU')}
              </div>
            </div>
          )}
          {action.exDate && (
            <div>
              <div className="text-xs text-stone-500 mb-1">Ex-date</div>
              <div className="font-medium text-stone-800">
                {new Date(action.exDate).toLocaleDateString('ru-RU')}
              </div>
            </div>
          )}
          {action.paymentDate && (
            <div>
              <div className="text-xs text-stone-500 mb-1">Payment date</div>
              <div className="font-medium text-stone-800">
                {new Date(action.paymentDate).toLocaleDateString('ru-RU')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      {Object.keys(details).length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <h3 className="font-semibold text-stone-800 mb-3">Детали</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {details.ratio !== undefined && (
              <div>
                <div className="text-xs text-stone-500 mb-1">Ratio</div>
                <div className="font-medium text-stone-800">{String(details.ratio)}</div>
              </div>
            )}
            {details.rate !== undefined && (
              <div>
                <div className="text-xs text-stone-500 mb-1">Rate</div>
                <div className="font-medium text-stone-800">${Number(details.rate).toFixed(4)}</div>
              </div>
            )}
            {details.cashAmount !== undefined && (
              <div>
                <div className="text-xs text-stone-500 mb-1">Cash amount</div>
                <div className="font-medium text-emerald-600">
                  ${Number(details.cashAmount).toLocaleString()}
                </div>
              </div>
            )}
            {details.newTicker !== undefined && (
              <div>
                <div className="text-xs text-stone-500 mb-1">New ticker</div>
                <div className="font-medium text-stone-800">{String(details.newTicker)}</div>
              </div>
            )}
            {details.terms !== undefined && (
              <div className="col-span-2">
                <div className="text-xs text-stone-500 mb-1">Terms</div>
                <div className="text-stone-700">{String(details.terms)}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Impact */}
      {Object.keys(impact).length > 0 && (
        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl border border-emerald-200/50 p-4">
          <h3 className="font-semibold text-stone-800 mb-3">Влияние на позиции</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {impact.affectedPositions !== undefined && (
              <div>
                <div className="text-xs text-stone-500 mb-1">Позиций затронуто</div>
                <div className="font-medium text-stone-800">{Number(impact.affectedPositions)}</div>
              </div>
            )}
            {impact.affectedShares !== undefined && (
              <div>
                <div className="text-xs text-stone-500 mb-1">Акций затронуто</div>
                <div className="font-medium text-stone-800">
                  {Number(impact.affectedShares).toLocaleString()}
                </div>
              </div>
            )}
            {impact.newShares !== undefined && (
              <div>
                <div className="text-xs text-stone-500 mb-1">Новое количество</div>
                <div className="font-medium text-blue-600">
                  {Number(impact.newShares).toLocaleString()}
                </div>
              </div>
            )}
            {impact.estimatedCashImpact !== undefined && (
              <div>
                <div className="text-xs text-stone-500 mb-1">Cash impact</div>
                <div className="font-medium text-emerald-600">
                  ${Number(impact.estimatedCashImpact).toLocaleString()}
                </div>
              </div>
            )}
            {impact.estimatedTaxImpact !== undefined && (
              <div>
                <div className="text-xs text-stone-500 mb-1">Tax impact (est.)</div>
                <div className="font-medium text-amber-600">
                  ${Number(impact.estimatedTaxImpact).toLocaleString()}
                </div>
              </div>
            )}
            {impact.costBasisAdjustment !== undefined && (
              <div>
                <div className="text-xs text-stone-500 mb-1">Cost basis adj.</div>
                <div className="font-medium text-stone-800">
                  ${Number(impact.costBasisAdjustment).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
      {action.notes && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <h3 className="font-semibold text-stone-800 mb-2">Заметки</h3>
          <p className="text-stone-600">{action.notes}</p>
        </div>
      )}

      {/* Processing info */}
      {action.status === 'processed' && action.processedAt && (
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-4">
          <p className="text-sm text-emerald-700">
            Обработано {new Date(action.processedAt).toLocaleString('ru-RU')}
            {action.processedBy && ` пользователем ${action.processedBy}`}
          </p>
        </div>
      )}
    </div>
  );
}

export default DlCorporateActionDetail;
