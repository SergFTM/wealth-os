"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { VdStatusPill } from './VdStatusPill';

interface Contract {
  id: string;
  name: string;
  vendorId: string;
  vendorName?: string;
  contractNumber?: string;
  startAt?: string;
  endAt?: string;
  renewalAt?: string;
  autoRenewal?: boolean;
  status: 'draft' | 'active' | 'expiring' | 'expired' | 'terminated';
  feeModelKey?: string;
  feeRulesJson?: {
    baseFee?: number;
    currency?: string;
    frequency?: string;
    aumRate?: number;
    minimumFee?: number;
    maximumFee?: number;
  };
  terminationNotice?: number;
  terminationNotes?: string;
  scopeOfServices?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContractAnalysis {
  renewalWindow: {
    daysUntilRenewal: number;
    urgency: string;
  };
  feeRisk: {
    level: string;
    reasons: string[];
  };
  flags: Array<{ type: string; message: string }>;
}

interface VdContractDetailProps {
  contract: Contract;
  analysis?: ContractAnalysis;
  linkedInvoices?: Array<{ id: string; invoiceRef: string; amount: number }>;
  linkedDocuments?: Array<{ id: string; name: string }>;
  onEdit?: () => void;
  onRenew?: () => void;
  onBack?: () => void;
}

const feeModelLabels: Record<string, string> = {
  fixed: 'Фиксированная',
  aum: 'От AUM',
  hourly: 'Почасовая',
  transaction: 'За транзакцию',
  retainer: 'Ретейнер',
  hybrid: 'Гибридная',
};

const frequencyLabels: Record<string, string> = {
  monthly: 'Ежемесячно',
  quarterly: 'Ежеквартально',
  annually: 'Ежегодно',
  per_transaction: 'За транзакцию',
};

const tabs = [
  { key: 'terms', label: 'Условия' },
  { key: 'fees', label: 'Комиссии' },
  { key: 'renewals', label: 'Продление' },
  { key: 'documents', label: 'Документы' },
  { key: 'analysis', label: 'Анализ' },
  { key: 'audit', label: 'Audit' },
];

function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getDaysUntil(dateStr?: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function VdContractDetail({
  contract,
  analysis,
  linkedInvoices = [],
  linkedDocuments = [],
  onEdit,
  onRenew,
  onBack,
}: VdContractDetailProps) {
  const [activeTab, setActiveTab] = useState('terms');

  const daysUntilRenewal = getDaysUntil(contract.renewalAt);
  const daysUntilEnd = getDaysUntil(contract.endAt);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {onBack && (
              <Button variant="ghost" onClick={onBack} className="mt-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-stone-800">{contract.name}</h1>
                <VdStatusPill status={contract.status} size="md" />
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
                {contract.vendorName && <span>Провайдер: {contract.vendorName}</span>}
                {contract.contractNumber && (
                  <>
                    <span>·</span>
                    <span>№ {contract.contractNumber}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {onRenew && contract.status === 'active' && (
              <Button variant="secondary" onClick={onRenew}>
                Продлить
              </Button>
            )}
            {onEdit && (
              <Button variant="primary" onClick={onEdit}>
                Редактировать
              </Button>
            )}
          </div>
        </div>

        {/* Alerts */}
        {analysis?.flags && analysis.flags.length > 0 && (
          <div className="mt-4 space-y-2">
            {analysis.flags.map((flag, idx) => (
              <div
                key={idx}
                className={`px-4 py-2 rounded-lg text-sm ${
                  flag.type === 'critical' ? 'bg-red-50 text-red-700' :
                  flag.type === 'warning' ? 'bg-amber-50 text-amber-700' :
                  'bg-blue-50 text-blue-700'
                }`}
              >
                {flag.message}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <nav className="flex gap-6 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        {activeTab === 'terms' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dates */}
            <div>
              <h3 className="font-semibold text-stone-800 mb-3">Сроки контракта</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Начало</span>
                  <span className="text-stone-800">{formatDate(contract.startAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Окончание</span>
                  <div className="text-right">
                    <span className="text-stone-800">{formatDate(contract.endAt)}</span>
                    {daysUntilEnd !== null && daysUntilEnd > 0 && (
                      <span className="ml-2 text-stone-400">({daysUntilEnd} дней)</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Срок уведомления о продлении</span>
                  <div className="text-right">
                    <span className="text-stone-800">{formatDate(contract.renewalAt)}</span>
                    {daysUntilRenewal !== null && (
                      <span className={`ml-2 ${daysUntilRenewal <= 30 ? 'text-amber-600' : 'text-stone-400'}`}>
                        ({daysUntilRenewal} дней)
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Автопродление</span>
                  <span className="text-stone-800">{contract.autoRenewal ? 'Да' : 'Нет'}</span>
                </div>
              </div>
            </div>

            {/* Termination */}
            <div>
              <h3 className="font-semibold text-stone-800 mb-3">Условия расторжения</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Срок уведомления</span>
                  <span className="text-stone-800">{contract.terminationNotice || 30} дней</span>
                </div>
                {contract.terminationNotes && (
                  <div>
                    <span className="text-stone-500">Примечания:</span>
                    <p className="mt-1 text-stone-700">{contract.terminationNotes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Scope */}
            {contract.scopeOfServices && (
              <div className="lg:col-span-2">
                <h3 className="font-semibold text-stone-800 mb-3">Scope услуг</h3>
                <p className="text-sm text-stone-600 whitespace-pre-wrap">{contract.scopeOfServices}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-stone-800 mb-3">Модель комиссий</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Тип</span>
                    <span className="text-stone-800">
                      {feeModelLabels[contract.feeModelKey || ''] || contract.feeModelKey || '—'}
                    </span>
                  </div>
                  {contract.feeRulesJson?.baseFee && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Базовая комиссия</span>
                      <span className="text-stone-800">
                        {contract.feeRulesJson.currency || 'USD'} {contract.feeRulesJson.baseFee.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {contract.feeRulesJson?.frequency && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Периодичность</span>
                      <span className="text-stone-800">
                        {frequencyLabels[contract.feeRulesJson.frequency] || contract.feeRulesJson.frequency}
                      </span>
                    </div>
                  )}
                  {contract.feeRulesJson?.aumRate && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">AUM Rate</span>
                      <span className="text-stone-800">{(contract.feeRulesJson.aumRate * 100).toFixed(2)}%</span>
                    </div>
                  )}
                  {contract.feeRulesJson?.minimumFee && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Минимум</span>
                      <span className="text-stone-800">
                        {contract.feeRulesJson.currency || 'USD'} {contract.feeRulesJson.minimumFee.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {contract.feeRulesJson?.maximumFee && (
                    <div className="flex justify-between">
                      <span className="text-stone-500">Максимум</span>
                      <span className="text-stone-800">
                        {contract.feeRulesJson.currency || 'USD'} {contract.feeRulesJson.maximumFee.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Risk Assessment */}
              {analysis?.feeRisk && (
                <div>
                  <h3 className="font-semibold text-stone-800 mb-3">Оценка риска комиссий</h3>
                  <div className={`px-4 py-3 rounded-lg ${
                    analysis.feeRisk.level === 'high' ? 'bg-red-50 text-red-700' :
                    analysis.feeRisk.level === 'medium' ? 'bg-amber-50 text-amber-700' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    <div className="font-medium capitalize mb-2">
                      Уровень: {analysis.feeRisk.level === 'high' ? 'Высокий' :
                               analysis.feeRisk.level === 'medium' ? 'Средний' : 'Низкий'}
                    </div>
                    {analysis.feeRisk.reasons.length > 0 && (
                      <ul className="text-sm space-y-1">
                        {analysis.feeRisk.reasons.map((reason, idx) => (
                          <li key={idx}>• {reason}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Linked Invoices */}
            {linkedInvoices.length > 0 && (
              <div>
                <h3 className="font-semibold text-stone-800 mb-3">Связанные счета</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium text-stone-500">Счет</th>
                        <th className="text-right py-2 font-medium text-stone-500">Сумма</th>
                      </tr>
                    </thead>
                    <tbody>
                      {linkedInvoices.map((inv) => (
                        <tr key={inv.id} className="border-b border-stone-100">
                          <td className="py-2">{inv.invoiceRef}</td>
                          <td className="py-2 text-right">${inv.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'renewals' && (
          <div className="text-center py-8 text-stone-500">
            История продлений контракта
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            {linkedDocuments.length > 0 ? (
              <div className="space-y-2">
                {linkedDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-stone-50">
                    <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-stone-700">{doc.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-stone-500">
                Нет прикрепленных документов
              </div>
            )}
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="text-center py-8 text-stone-500">
            AI анализ контракта (вкладка Fees содержит оценку риска)
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="text-center py-8 text-stone-500">
            Audit trail загружается из API
          </div>
        )}
      </div>
    </div>
  );
}
