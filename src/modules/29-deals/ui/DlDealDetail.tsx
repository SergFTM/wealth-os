'use client';

import { useState } from 'react';
import { ArrowLeft, Calendar, Building2, User, FileText, Clock, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DlStatusPill, DlStagePill, DlAssetTypePill } from './DlStatusPill';
import { DlTransactionsTable } from './DlTransactionsTable';
import { DlApprovalsTable } from './DlApprovalsTable';
import { DlDocumentsPanel } from './DlDocumentsPanel';
import { DlImpactPanel } from './DlImpactPanel';

interface Deal {
  id: string;
  dealNumber: string;
  name: string;
  assetType: string;
  stageId: string;
  status: string;
  estimatedValue: number;
  currency: string;
  expectedCloseAt: string;
  ownerUserId: string;
  description?: string;
  counterparty?: string;
  createdAt: string;
  updatedAt: string;
}

interface DlDealDetailProps {
  deal: Deal;
  transactions: any[];
  approvals: any[];
  documents: any[];
  stages: any[];
  auditEvents?: any[];
}

type TabKey = 'overview' | 'transactions' | 'approvals' | 'documents' | 'impact' | 'audit';

export function DlDealDetail({
  deal,
  transactions,
  approvals,
  documents,
  stages,
  auditEvents = []
}: DlDealDetailProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const currentStage = stages.find((s: any) => s.id === deal.stageId);

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: 'overview', label: 'Обзор' },
    { key: 'transactions', label: 'Транзакции', count: transactions.length },
    { key: 'approvals', label: 'Согласования', count: approvals.filter((a: any) => a.status === 'pending').length },
    { key: 'documents', label: 'Документы', count: documents.filter((d: any) => d.status === 'missing').length },
    { key: 'impact', label: 'Влияние' },
    { key: 'audit', label: 'Аудит' }
  ];

  // Calculate impact
  const dealTransactions = transactions.filter((t: any) => t.dealId === deal.id);
  let totalInvested = 0;
  let totalDistributions = 0;
  let totalFees = 0;

  dealTransactions.forEach((tx: any) => {
    switch (tx.txType) {
      case 'buy':
      case 'call':
        totalInvested += tx.amount;
        break;
      case 'sell':
        totalInvested -= tx.amount;
        break;
      case 'distribution':
      case 'dividend':
        totalDistributions += tx.amount;
        break;
      case 'fee':
        totalFees += tx.amount;
        break;
    }
  });

  const impactLines = dealTransactions.map((tx: any) => ({
    id: tx.id,
    sourceType: 'transaction',
    sourceRef: `TX-${deal.dealNumber}`,
    asOfDate: tx.txDate,
    netWorthDelta: tx.txType === 'dividend' || tx.txType === 'distribution' ? tx.amount : tx.txType === 'fee' ? -tx.amount : 0,
    glDebit: { accountCode: '1200', accountName: 'Инвестиции', amount: tx.amount },
    glCredit: { accountCode: '1100', accountName: 'Денежные средства', amount: tx.amount },
    performanceTag: tx.txType === 'dividend' || tx.txType === 'distribution' ? 'income' : 'capital',
    status: tx.status === 'posted' ? 'posted' as const : 'planned' as const
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={() => router.push('/m/deals/list?tab=pipeline')}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад к списку
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">{deal.name}</h1>
            <DlAssetTypePill type={deal.assetType} />
            <DlStatusPill status={deal.status} />
          </div>
          <div className="mt-1 text-sm text-slate-500 font-mono">{deal.dealNumber}</div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-slate-900">
            {formatCurrency(deal.estimatedValue, deal.currency)}
          </div>
          <div className="text-sm text-slate-500">Оценка сделки</div>
        </div>
      </div>

      {/* Stage Timeline */}
      <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-white/20">
        <div className="flex items-center justify-between">
          {stages.map((stage: any, index: number) => {
            const isActive = stage.id === deal.stageId;
            const isPast = stages.findIndex((s: any) => s.id === deal.stageId) > index;
            return (
              <div key={stage.id} className="flex-1 flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isActive
                      ? 'bg-emerald-500 text-white'
                      : isPast
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="ml-2 flex-1">
                  <div className={`text-sm font-medium ${isActive ? 'text-emerald-700' : isPast ? 'text-slate-700' : 'text-slate-400'}`}>
                    {stage.nameRu || stage.name}
                  </div>
                </div>
                {index < stages.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${isPast || isActive ? 'bg-emerald-200' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-emerald-700 border-t border-x border-slate-200 -mb-px'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                  activeTab === tab.key ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              {deal.description && (
                <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-white/20">
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Описание</h3>
                  <p className="text-sm text-slate-600">{deal.description}</p>
                </div>
              )}

              {/* Details */}
              <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-white/20">
                <h3 className="text-sm font-medium text-slate-700 mb-4">Детали сделки</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-slate-400" />
                    <div>
                      <div className="text-xs text-slate-500">Контрагент</div>
                      <div className="text-sm font-medium text-slate-900">{deal.counterparty || '—'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-slate-400" />
                    <div>
                      <div className="text-xs text-slate-500">Ожидаемое закрытие</div>
                      <div className="text-sm font-medium text-slate-900">{formatDate(deal.expectedCloseAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-slate-400" />
                    <div>
                      <div className="text-xs text-slate-500">Владелец</div>
                      <div className="text-sm font-medium text-slate-900">{deal.ownerUserId}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-slate-400" />
                    <div>
                      <div className="text-xs text-slate-500">Создано</div>
                      <div className="text-sm font-medium text-slate-900">{formatDate(deal.createdAt)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Current Stage */}
              <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-white/20">
                <h3 className="text-sm font-medium text-slate-700 mb-2">Текущая стадия</h3>
                <DlStagePill stageId={deal.stageId} stageName={currentStage?.nameRu || currentStage?.name} />
              </div>

              {/* Quick Stats */}
              <div className="p-4 rounded-xl bg-white/60 backdrop-blur border border-white/20">
                <h3 className="text-sm font-medium text-slate-700 mb-3">Краткая статистика</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Транзакции</span>
                    <span className="font-medium text-slate-900">{dealTransactions.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Согласования</span>
                    <span className="font-medium text-slate-900">{approvals.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Документы</span>
                    <span className="font-medium text-slate-900">{documents.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <DlTransactionsTable transactions={dealTransactions} deals={[deal]} />
        )}

        {activeTab === 'approvals' && (
          <DlApprovalsTable approvals={approvals} deals={[deal]} />
        )}

        {activeTab === 'documents' && (
          <DlDocumentsPanel documents={documents} />
        )}

        {activeTab === 'impact' && (
          <DlImpactPanel
            totalInvested={totalInvested}
            totalDistributions={totalDistributions}
            totalFees={totalFees}
            netCashFlow={totalDistributions - totalInvested - totalFees}
            impactLines={impactLines}
            currency={deal.currency}
          />
        )}

        {activeTab === 'audit' && (
          <div className="rounded-xl border border-white/20 bg-white/60 backdrop-blur overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Время</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Действие</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Пользователь</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Описание</th>
                </tr>
              </thead>
              <tbody>
                {auditEvents.slice(0, 20).map((event: any) => (
                  <tr key={event.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(event.ts).toLocaleString('ru-RU')}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">{event.action}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{event.actorName}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{event.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
