"use client";

import { use } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { useAuditEvents } from '@/lib/hooks';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { NetWorthSourceBadge } from '@/modules/02-net-worth/ui/NetWorthSourceBadge';
import { NetWorthValuationPanel } from '@/modules/02-net-worth/ui/NetWorthValuationPanel';
import { NetWorthReconciliationFlags } from '@/modules/02-net-worth/ui/NetWorthReconciliationFlags';
import { cn } from '@/lib/utils';

import seedData from '@/modules/02-net-worth/seed.json';

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
  asOf: string;
  sourceType?: string;
  sourceRef?: string;
  reconStatus?: string;
  liquidity: string;
  tags?: string[];
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

export default function NetWorthItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { locale, user } = useApp();
  const clientSafe = user?.role === 'client';
  const [activeTab, setActiveTab] = useState('overview');

  // Find holding from seed data
  const holding = (seedData.holdings as HoldingDetail[]).find(h => h.id === id);
  const valuations = seedData.valuations.filter(v => v.objectId === id);
  const { events: auditEvents, loading: auditLoading } = useAuditEvents(id);

  if (!holding) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-stone-600">{locale === 'ru' ? 'Актив не найден' : 'Holding not found'}</p>
          <Button variant="secondary" size="sm" onClick={() => router.push('/m/net-worth')} className="mt-4">
            ← {locale === 'ru' ? 'Назад' : 'Back'}
          </Button>
        </div>
      </div>
    );
  }

  const visibleTabs = clientSafe 
    ? tabs.filter(t => ['overview', 'documents'].includes(t.key))
    : tabs;

  const currentValuation = valuations.length > 0 ? valuations[0] : undefined;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.push('/m/net-worth')} className="mb-2">
            ← {locale === 'ru' ? 'Назад к обзору' : 'Back to overview'}
          </Button>
          <h1 className="text-2xl font-bold text-stone-800">{holding.name}</h1>
          {holding.ticker && <span className="text-stone-500">{holding.ticker}</span>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm">
            {locale === 'ru' ? 'Редактировать' : 'Edit'}
          </Button>
          {!clientSafe && (
            <Button variant="ghost" size="sm">
              {locale === 'ru' ? 'Удалить' : 'Delete'}
            </Button>
          )}
        </div>
      </div>

      {/* Value Card */}
      <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-xl p-6">
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-bold text-stone-800">
            {formatCurrency(holding.value, holding.currency)}
          </span>
          <StatusBadge 
            status={holding.valuationStatus === 'priced' ? 'ok' : holding.valuationStatus === 'stale' ? 'warning' : 'pending'} 
            label={holding.valuationStatus} 
          />
        </div>
        <div className="mt-2 text-sm text-stone-500">
          {locale === 'ru' ? 'На дату:' : 'As-of:'} {new Date(holding.asOf).toLocaleDateString('ru-RU')}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        {visibleTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.key
                ? "border-emerald-500 text-emerald-700"
                : "border-transparent text-stone-500 hover:text-stone-700"
            )}
          >
            {tab.label[locale as 'ru' | 'en']}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-stone-50 rounded-lg p-4">
                <span className="text-xs text-stone-500 block mb-1">{locale === 'ru' ? 'Класс актива' : 'Asset Class'}</span>
                <p className="font-semibold text-stone-800">{holding.assetClass}</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <span className="text-xs text-stone-500 block mb-1">{locale === 'ru' ? 'Ликвидность' : 'Liquidity'}</span>
                <p className="font-semibold text-stone-800">{holding.liquidity}</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <span className="text-xs text-stone-500 block mb-1">{locale === 'ru' ? 'Валюта' : 'Currency'}</span>
                <p className="font-semibold text-stone-800">{holding.currency}</p>
              </div>
              <div className="bg-stone-50 rounded-lg p-4">
                <span className="text-xs text-stone-500 block mb-1">{locale === 'ru' ? 'Entity' : 'Entity'}</span>
                <p className="font-semibold text-stone-800">{holding.entityId || '-'}</p>
              </div>
            </div>

            {holding.quantity && holding.price && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 rounded-lg p-4">
                  <span className="text-xs text-stone-500 block mb-1">{locale === 'ru' ? 'Количество' : 'Quantity'}</span>
                  <p className="font-semibold text-stone-800">{holding.quantity.toLocaleString()}</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-4">
                  <span className="text-xs text-stone-500 block mb-1">{locale === 'ru' ? 'Цена' : 'Price'}</span>
                  <p className="font-semibold text-stone-800">{formatCurrency(holding.price, holding.currency)}</p>
                </div>
              </div>
            )}

            <div>
              <span className="text-xs text-stone-500 block mb-2">{locale === 'ru' ? 'Источник' : 'Source'}</span>
              <NetWorthSourceBadge 
                sourceType={holding.sourceType} 
                sourceRef={holding.sourceRef} 
                asOf={holding.asOf} 
              />
            </div>

            {holding.tags && holding.tags.length > 0 && (
              <div>
                <span className="text-xs text-stone-500 block mb-2">{locale === 'ru' ? 'Теги' : 'Tags'}</span>
                <div className="flex flex-wrap gap-2">
                  {holding.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-stone-200 text-stone-600 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-200">
              <Button variant="secondary" size="sm">
                {locale === 'ru' ? 'Создать задачу' : 'Create Task'}
              </Button>
              <Button variant="secondary" size="sm">
                {locale === 'ru' ? 'Прикрепить документ' : 'Attach Document'}
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'valuation' && (
          <NetWorthValuationPanel
            currentValuation={currentValuation}
            valuationHistory={valuations}
            onAddValuation={() => alert('Add valuation modal')}
            onCreateTask={() => alert('Create task')}
          />
        )}

        {activeTab === 'documents' && (
          <div className="text-center py-12">
            <p className="text-stone-400 mb-4">{locale === 'ru' ? 'Нет связанных документов' : 'No linked documents'}</p>
            <Button variant="secondary" size="sm">
              {locale === 'ru' ? 'Добавить документ' : 'Add Document'}
            </Button>
          </div>
        )}

        {activeTab === 'recon' && !clientSafe && (
          <NetWorthReconciliationFlags
            reconStatus={(holding.reconStatus as 'ok' | 'issue' | 'pending') || 'pending'}
            issues={holding.reconStatus === 'issue' ? [
              { type: 'quantity', description: 'Custodian statement shows different quantity', severity: 'critical' as const }
            ] : []}
            onCreateTicket={() => alert('Create ticket')}
            onCreateTask={() => alert('Create task')}
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
                <div key={event.id} className="p-4 bg-stone-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-stone-800">{event.actorName}</span>
                    <span className="text-xs text-stone-400">
                      {new Date(event.ts).toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <p className="text-sm text-stone-600">{event.summary}</p>
                  <span className="text-xs px-2 py-0.5 bg-stone-200 rounded mt-2 inline-block">
                    {event.action}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
