"use client";

import { useState } from 'react';
import { DlStatusPill } from './DlStatusPill';
import { DlChecklistDetail } from './DlChecklistDetail';
import { DlApprovalsPanel } from './DlApprovalsPanel';
import { DlDocumentsPanel } from './DlDocumentsPanel';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface PrivateDeal {
  id: string;
  name: string;
  dealType: string;
  stage: 'draft' | 'in_review' | 'approved' | 'executed' | 'closed';
  amount?: number;
  currency?: string;
  targetEntityName?: string;
  closeDate?: string;
  termsJson?: Record<string, unknown>;
  taxFlag?: boolean;
  notes?: string;
}

interface DlPrivateDealDetailProps {
  deal: PrivateDeal;
  checklist?: {
    name: string;
    items: Array<{
      id: string;
      title: string;
      ownerRole: string;
      status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'na';
      dueAt?: string;
      order: number;
    }>;
    completionPct: number;
  };
  approvals?: Array<{
    id: string;
    linkedType?: string;
    linkedName?: string;
    approverRole: string;
    status: 'pending' | 'approved' | 'rejected' | 'escalated' | 'expired';
    dueAt?: string;
    requestedByName?: string;
  }>;
  documents?: Array<{
    id: string;
    docName: string;
    docType?: string;
    status: 'missing' | 'requested' | 'received' | 'under_review' | 'approved' | 'rejected';
    required?: boolean;
  }>;
  onStageChange?: (newStage: string) => void;
  onRequestApproval?: () => void;
  onGenerateChecklist?: () => void;
  onApprove?: (approval: { id: string }) => void;
  onReject?: (approval: { id: string }) => void;
  onEdit?: () => void;
}

type TabKey = 'overview' | 'terms' | 'checklist' | 'approvals' | 'documents' | 'impact';

const DEAL_TYPE_LABELS: Record<string, string> = {
  subscription: 'Подписка',
  secondary: 'Secondary',
  co_invest: 'Co-investment',
  spv: 'SPV',
  direct: 'Прямая инвестиция',
  fund_commitment: 'Commitment',
};

const STAGE_ORDER = ['draft', 'in_review', 'approved', 'executed', 'closed'];

export function DlPrivateDealDetail({
  deal,
  checklist,
  approvals = [],
  documents = [],
  onStageChange,
  onRequestApproval,
  onGenerateChecklist,
  onApprove,
  onReject,
  onEdit,
}: DlPrivateDealDetailProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const terms = deal.termsJson || {};
  const currentStageIndex = STAGE_ORDER.indexOf(deal.stage);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Обзор' },
    { key: 'terms', label: 'Условия' },
    { key: 'checklist', label: 'Checklist' },
    { key: 'approvals', label: 'Согласования' },
    { key: 'documents', label: 'Документы' },
    { key: 'impact', label: 'Влияние' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-stone-800">{deal.name}</h1>
            <DlStatusPill status={deal.stage} />
            {deal.taxFlag && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                Tax impact
              </span>
            )}
          </div>
          <p className="text-stone-600">
            {DEAL_TYPE_LABELS[deal.dealType] || deal.dealType}
            {deal.targetEntityName && ` • ${deal.targetEntityName}`}
          </p>
          {deal.amount && (
            <p className="text-xl font-semibold text-stone-800 mt-2">
              ${deal.amount.toLocaleString()} {deal.currency || 'USD'}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onRequestApproval && deal.stage === 'in_review' && (
            <Button variant="primary" onClick={onRequestApproval}>
              Запросить согласование
            </Button>
          )}
          {onEdit && (
            <Button variant="secondary" onClick={onEdit}>
              Редактировать
            </Button>
          )}
        </div>
      </div>

      {/* Stage progress */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
        <div className="flex items-center justify-between">
          {STAGE_ORDER.map((stage, index) => {
            const isPast = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const isClickable = onStageChange && Math.abs(index - currentStageIndex) === 1;

            return (
              <div key={stage} className="flex items-center">
                <button
                  onClick={() => isClickable && onStageChange(stage)}
                  disabled={!isClickable}
                  className={cn(
                    'flex flex-col items-center',
                    isClickable && 'cursor-pointer hover:opacity-80'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                      isPast && 'bg-emerald-500 text-white',
                      isCurrent && 'bg-blue-500 text-white',
                      !isPast && !isCurrent && 'bg-stone-100 text-stone-400'
                    )}
                  >
                    {isPast ? '✓' : index + 1}
                  </div>
                  <span className={cn(
                    'text-xs mt-1',
                    isCurrent ? 'text-blue-600 font-medium' : 'text-stone-500'
                  )}>
                    {stage === 'draft' && 'Черновик'}
                    {stage === 'in_review' && 'Рассмотрение'}
                    {stage === 'approved' && 'Утверждено'}
                    {stage === 'executed' && 'Исполнено'}
                    {stage === 'closed' && 'Закрыто'}
                  </span>
                </button>
                {index < STAGE_ORDER.length - 1 && (
                  <div className={cn(
                    'w-16 h-0.5 mx-2',
                    index < currentStageIndex ? 'bg-emerald-500' : 'bg-stone-200'
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <nav className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'pb-3 px-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.key
                  ? 'border-emerald-500 text-emerald-700'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
            <h3 className="font-semibold text-stone-800 mb-3">Информация</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone-500">Тип сделки</dt>
                <dd className="font-medium text-stone-800">{DEAL_TYPE_LABELS[deal.dealType]}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Целевая структура</dt>
                <dd className="font-medium text-stone-800">{deal.targetEntityName || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Дата закрытия</dt>
                <dd className="font-medium text-stone-800">
                  {deal.closeDate ? new Date(deal.closeDate).toLocaleDateString('ru-RU') : '-'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
            <h3 className="font-semibold text-stone-800 mb-3">Статус</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Checklist</span>
                <span className="font-medium">
                  {checklist ? `${checklist.completionPct}%` : 'Не создан'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Согласования</span>
                <span className="font-medium">
                  {approvals.filter(a => a.status === 'approved').length}/{approvals.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Документы</span>
                <span className="font-medium">
                  {documents.filter(d => d.status === 'received' || d.status === 'approved').length}/{documents.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'terms' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
          <h3 className="font-semibold text-stone-800 mb-4">Ключевые условия</h3>
          {Object.keys(terms).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {terms.managementFee !== undefined && (
                <div>
                  <div className="text-xs text-stone-500 mb-1">Management fee</div>
                  <div className="font-medium text-stone-800">{String(terms.managementFee)}%</div>
                </div>
              )}
              {terms.carriedInterest !== undefined && (
                <div>
                  <div className="text-xs text-stone-500 mb-1">Carried interest</div>
                  <div className="font-medium text-stone-800">{String(terms.carriedInterest)}%</div>
                </div>
              )}
              {terms.preferredReturn !== undefined && (
                <div>
                  <div className="text-xs text-stone-500 mb-1">Preferred return</div>
                  <div className="font-medium text-stone-800">{String(terms.preferredReturn)}%</div>
                </div>
              )}
              {terms.lockupPeriod !== undefined && (
                <div>
                  <div className="text-xs text-stone-500 mb-1">Lock-up period</div>
                  <div className="font-medium text-stone-800">{String(terms.lockupPeriod)}</div>
                </div>
              )}
              {terms.manager !== undefined && (
                <div>
                  <div className="text-xs text-stone-500 mb-1">Manager</div>
                  <div className="font-medium text-stone-800">{String(terms.manager)}</div>
                </div>
              )}
              {terms.legalStructure !== undefined && (
                <div>
                  <div className="text-xs text-stone-500 mb-1">Legal structure</div>
                  <div className="font-medium text-stone-800">{String(terms.legalStructure)}</div>
                </div>
              )}
              {terms.jurisdiction !== undefined && (
                <div>
                  <div className="text-xs text-stone-500 mb-1">Jurisdiction</div>
                  <div className="font-medium text-stone-800">{String(terms.jurisdiction)}</div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-stone-500">Условия не заполнены</p>
          )}
        </div>
      )}

      {activeTab === 'checklist' && (
        <div>
          {checklist ? (
            <DlChecklistDetail
              name={checklist.name}
              linkedName={deal.name}
              items={checklist.items}
              completionPct={checklist.completionPct}
            />
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6 text-center">
              <p className="text-stone-500 mb-3">Checklist не создан</p>
              {onGenerateChecklist && (
                <Button variant="primary" onClick={onGenerateChecklist}>
                  Сгенерировать checklist
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'approvals' && (
        <DlApprovalsPanel
          approvals={(approvals || []).map(a => ({ ...a, linkedType: a.linkedType || 'deal' })) as Array<{ id: string; linkedType: string; linkedName?: string; approverRole: string; status: 'pending' | 'approved' | 'rejected' | 'escalated' | 'expired'; dueAt?: string; requestedByName?: string }>}
          onApprove={onApprove}
          onReject={onReject}
        />
      )}

      {activeTab === 'documents' && (
        <DlDocumentsPanel documents={documents} />
      )}

      {activeTab === 'impact' && (
        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl border border-emerald-200/50 p-4">
          <h3 className="font-semibold text-stone-800 mb-4">Влияние на капитал</h3>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-3">
              <h4 className="text-sm font-medium text-stone-600 mb-2">GL Postings</h4>
              <p className="text-xs text-stone-500">Placeholder - GL проводки будут созданы при исполнении сделки</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <h4 className="text-sm font-medium text-stone-600 mb-2">Tax Impact</h4>
              <p className="text-xs text-stone-500">Placeholder - налоговые последствия требуют анализа</p>
              {deal.taxFlag && (
                <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-600">
                  Сделка помечена для налогового анализа
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg p-3">
              <h4 className="text-sm font-medium text-stone-600 mb-2">Performance</h4>
              <p className="text-xs text-stone-500">Placeholder - влияние на performance будет рассчитано</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DlPrivateDealDetail;
