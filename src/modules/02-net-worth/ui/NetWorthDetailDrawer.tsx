"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useAuditEvents } from '@/lib/hooks';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { NetWorthSourceBadge } from './NetWorthSourceBadge';
import { NetWorthValuationPanel } from './NetWorthValuationPanel';
import { NetWorthReconciliationFlags } from './NetWorthReconciliationFlags';

interface HoldingDetail {
  id: string;
  name: string;
  ticker?: string;
  assetClass: string;
  entityId?: string;
  accountId?: string;
  currency: string;
  quantity?: number;
  price?: number;
  value: number;
  valuationStatus: string;
  asOf?: string;
  sourceType?: string;
  sourceRef?: string;
  reconStatus?: string;
  liquidity?: string;
  tags?: string[];
}

interface Valuation {
  id: string;
  value: number;
  currency: string;
  method: string;
  asOf: string;
  status: string;
  sourceType?: string;
  sourceRef?: string;
}

interface NetWorthDetailDrawerProps {
  open: boolean;
  item: HoldingDetail | null;
  type: 'holding' | 'liability';
  valuations?: Valuation[];
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCreateTask: () => void;
  onAddDocument: () => void;
  onAddValuation: () => void;
  clientSafe?: boolean;
}

const tabs = [
  { key: 'overview', label: { ru: 'Обзор', en: 'Overview' } },
  { key: 'valuation', label: { ru: 'Оценка', en: 'Valuation' } },
  { key: 'documents', label: { ru: 'Документы', en: 'Documents' } },
  { key: 'recon', label: { ru: 'Сверка', en: 'Recon' } },
  { key: 'audit', label: { ru: 'Аудит', en: 'Audit' } }
];

function formatCurrency(value: number, currency: string): string {
  const symbols: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', CHF: 'CHF ', RUB: '₽' };
  const symbol = symbols[currency] || currency + ' ';
  if (value >= 1000000) return `${symbol}${(value / 1000000).toFixed(2)}M`;
  return `${symbol}${value.toLocaleString()}`;
}

export function NetWorthDetailDrawer({
  open,
  item,
  type,
  valuations = [],
  onClose,
  onEdit,
  onDelete,
  onCreateTask,
  onAddDocument,
  onAddValuation,
  clientSafe
}: NetWorthDetailDrawerProps) {
  const router = useRouter();
  const { locale } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const { events: auditEvents, loading: auditLoading } = useAuditEvents(item?.id || null);

  if (!open || !item) return null;

  const visibleTabs = clientSafe 
    ? tabs.filter(t => ['overview', 'documents'].includes(t.key))
    : tabs;

  const currentValuation = valuations.find(v => v.asOf === item.asOf);

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-[520px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <div>
            <h2 className="text-lg font-semibold text-stone-800">{item.name}</h2>
            {item.ticker && <span className="text-sm text-stone-500">{item.ticker}</span>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => router.push(`/m/net-worth/item/${item.id}`)}>
              {locale === 'ru' ? 'Открыть' : 'Open'}
            </Button>
            <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 px-4">
          {visibleTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-emerald-500 text-emerald-700'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab.label[locale as 'ru' | 'en']}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Value Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl p-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-stone-800">
                    {formatCurrency(item.value, item.currency)}
                  </span>
                  <StatusBadge 
                    status={item.valuationStatus === 'priced' ? 'ok' : item.valuationStatus === 'stale' ? 'warning' : 'pending'} 
                    label={item.valuationStatus} 
                  />
                </div>
                <div className="mt-2 text-sm text-stone-500">
                  {locale === 'ru' ? 'На дату:' : 'As-of:'} {item.asOf ? new Date(item.asOf).toLocaleDateString('ru-RU') : '—'}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-stone-50 rounded-lg p-3">
                  <span className="text-xs text-stone-500">{locale === 'ru' ? 'Класс актива' : 'Asset Class'}</span>
                  <p className="font-medium text-stone-800">{item.assetClass}</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-3">
                  <span className="text-xs text-stone-500">{locale === 'ru' ? 'Ликвидность' : 'Liquidity'}</span>
                  <p className="font-medium text-stone-800">{item.liquidity}</p>
                </div>
                {item.quantity && (
                  <div className="bg-stone-50 rounded-lg p-3">
                    <span className="text-xs text-stone-500">{locale === 'ru' ? 'Количество' : 'Quantity'}</span>
                    <p className="font-medium text-stone-800">{item.quantity.toLocaleString()}</p>
                  </div>
                )}
                {item.price && (
                  <div className="bg-stone-50 rounded-lg p-3">
                    <span className="text-xs text-stone-500">{locale === 'ru' ? 'Цена' : 'Price'}</span>
                    <p className="font-medium text-stone-800">{formatCurrency(item.price, item.currency)}</p>
                  </div>
                )}
              </div>

              {/* Source */}
              <div className="bg-stone-50 rounded-lg p-3">
                <span className="text-xs text-stone-500 block mb-1">{locale === 'ru' ? 'Источник' : 'Source'}</span>
                <NetWorthSourceBadge sourceType={item.sourceType} sourceRef={item.sourceRef} asOf={item.asOf} />
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div>
                  <span className="text-xs text-stone-500 block mb-2">{locale === 'ru' ? 'Теги' : 'Tags'}</span>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-stone-200 text-stone-600 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-200">
                <Button variant="primary" size="sm" onClick={onEdit}>
                  {locale === 'ru' ? 'Редактировать' : 'Edit'}
                </Button>
                <Button variant="secondary" size="sm" onClick={onCreateTask}>
                  {locale === 'ru' ? 'Создать задачу' : 'Create Task'}
                </Button>
                <Button variant="secondary" size="sm" onClick={onAddDocument}>
                  {locale === 'ru' ? 'Документ' : 'Document'}
                </Button>
                {!clientSafe && (
                  <Button variant="ghost" size="sm" onClick={onDelete}>
                    {locale === 'ru' ? 'Удалить' : 'Delete'}
                  </Button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'valuation' && (
            <NetWorthValuationPanel
              currentValuation={currentValuation}
              valuationHistory={valuations}
              onAddValuation={onAddValuation}
              onCreateTask={onCreateTask}
            />
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="text-center py-8 text-stone-400">
                <p>{locale === 'ru' ? 'Нет связанных документов' : 'No linked documents'}</p>
              </div>
              <Button variant="secondary" size="sm" onClick={onAddDocument} className="w-full">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {locale === 'ru' ? 'Добавить документ' : 'Add Document'}
              </Button>
            </div>
          )}

          {activeTab === 'recon' && !clientSafe && (
            <NetWorthReconciliationFlags
              reconStatus={(item.reconStatus as 'ok' | 'issue' | 'pending') || 'pending'}
              issues={item.reconStatus === 'issue' ? [
                { type: 'quantity', description: 'Custodian shows different quantity', severity: 'critical' as const }
              ] : []}
              onCreateTicket={() => {}}
              onCreateTask={onCreateTask}
            />
          )}

          {activeTab === 'audit' && (
            <div className="space-y-3">
              {auditLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-stone-100 rounded animate-pulse" />
                ))
              ) : auditEvents.length === 0 ? (
                <div className="text-center py-8 text-stone-400">
                  <p>{locale === 'ru' ? 'Нет записей аудита' : 'No audit records'}</p>
                </div>
              ) : (
                auditEvents.slice(0, 15).map(event => (
                  <div key={event.id} className="p-3 bg-stone-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-stone-800">{event.actorName}</span>
                      <span className="text-xs text-stone-400">
                        {new Date(event.ts).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <p className="text-sm text-stone-600">{event.summary}</p>
                    <span className="text-xs px-2 py-0.5 bg-stone-200 rounded mt-1 inline-block">
                      {event.action}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
