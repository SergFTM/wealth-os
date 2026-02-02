"use client";

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatusBadge } from '@/components/ui/StatusBadge';

// Import seed data
import cashAccountsData from '@/db/data/cashAccounts.json';
import obligationsData from '@/db/data/obligations.json';

const entityNames: Record<string, string> = {
  'entity-001': 'Family Trust',
  'entity-002': 'Investment Holdings',
  'entity-003': 'European Holdings',
  'entity-004': 'Asset Management'
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function LiquidityItemPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  // Parse data
  const accounts = (cashAccountsData as { cashAccounts?: unknown[] }).cashAccounts || [];
  const account = (accounts as Array<{
    id: string;
    name: string;
    entityId: string;
    bank: string;
    currency: string;
    balance: number;
    baseBalance: number;
    threshold: number;
    status: 'ok' | 'warning' | 'critical';
    lastSyncAt: string;
    sourceType: string;
  }>).find(a => a.id === id);

  const obligation = (obligationsData as Array<{
    id: string;
    name: string;
    entityId: string;
    type: string;
    dueDate: string;
    amount: number;
    currency: string;
    frequency: string;
    status: 'scheduled' | 'paid' | 'overdue' | 'cancelled';
    paidDate: string | null;
    sourceType: string;
    sourceRef: string | null;
  }>).find(o => o.id === id);

  const item = account || obligation;
  const isAccount = !!account;

  if (!item) {
    return (
      <div className="p-6 max-w-[1200px] mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center">
          <p className="text-stone-500">Запись не найдена</p>
          <button
            onClick={() => router.push('/m/liquidity/list')}
            className="mt-4 px-4 py-2 text-sm text-emerald-600 hover:text-emerald-700"
          >
            ← Вернуться к списку
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (val: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const tabs = isAccount 
    ? ['overview', 'movements', 'forecast', 'threshold', 'documents', 'audit']
    : ['overview', 'schedule', 'links', 'documents', 'audit'];

  const tabLabels: Record<string, string> = {
    overview: 'Обзор',
    movements: 'Движения',
    forecast: 'Прогноз',
    threshold: 'Порог',
    schedule: 'Расписание',
    links: 'Связи',
    documents: 'Документы',
    audit: 'Аудит'
  };

  const statusMap: Record<string, 'ok' | 'warning' | 'critical' | 'info'> = {
    ok: 'ok',
    warning: 'warning',
    critical: 'critical',
    paid: 'ok',
    scheduled: 'warning',
    overdue: 'critical',
    cancelled: 'info'
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/m/liquidity/list')}
            className="text-sm text-stone-500 hover:text-stone-700 mb-2"
          >
            ← Списки
          </button>
          <h1 className="text-2xl font-bold text-stone-800">
            {isAccount ? account.name : obligation?.name}
          </h1>
          <p className="text-stone-500 mt-1">
            {entityNames[item.entityId]} • {isAccount ? account.bank : obligation?.type}
          </p>
        </div>
        <StatusBadge status={statusMap[item.status]} label={item.status} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-stone-100 rounded-lg w-fit">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab
                ? 'bg-white text-stone-800 shadow-sm'
                : 'text-stone-600 hover:text-stone-800'
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
        {activeTab === 'overview' && isAccount && (
          <div className="space-y-6">
            {/* Balance Card */}
            <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-50 to-amber-50 border border-stone-200">
              <div className="text-sm text-stone-500 mb-1">Баланс</div>
              <div className="text-4xl font-bold text-stone-800">
                {formatCurrency(account.balance, account.currency)}
              </div>
              <div className="text-sm text-stone-500 mt-2">
                ≈ {formatCurrency(account.baseBalance, 'USD')}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-stone-50">
                <div className="text-xs text-stone-500 mb-1">Банк</div>
                <div className="font-medium">{account.bank}</div>
              </div>
              <div className="p-4 rounded-lg bg-stone-50">
                <div className="text-xs text-stone-500 mb-1">Валюта</div>
                <div className="font-medium">{account.currency}</div>
              </div>
              <div className="p-4 rounded-lg bg-stone-50">
                <div className="text-xs text-stone-500 mb-1">Порог</div>
                <div className="font-medium">{formatCurrency(account.threshold, account.currency)}</div>
              </div>
              <div className="p-4 rounded-lg bg-stone-50">
                <div className="text-xs text-stone-500 mb-1">Последняя синхронизация</div>
                <div className="font-medium text-sm">{formatDate(account.lastSyncAt)}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-200">
              <button className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors">
                Перевести средства
              </button>
              <button className="px-4 py-2 text-sm font-medium rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors">
                Редактировать
              </button>
              <button className="px-4 py-2 text-sm font-medium rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors">
                Создать задачу
              </button>
            </div>
          </div>
        )}

        {activeTab === 'overview' && !isAccount && obligation && (
          <div className="space-y-6">
            {/* Amount Card */}
            <div className={`p-6 rounded-xl border ${
              obligation.status === 'overdue' 
                ? 'bg-rose-50 border-rose-200' 
                : 'bg-gradient-to-r from-emerald-50 to-amber-50 border-stone-200'
            }`}>
              <div className="text-sm text-stone-500 mb-1">Сумма к оплате</div>
              <div className="text-4xl font-bold text-stone-800">
                {formatCurrency(obligation.amount, obligation.currency)}
              </div>
              <div className="text-sm text-stone-500 mt-2">
                Срок: {formatDate(obligation.dueDate)}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-stone-50">
                <div className="text-xs text-stone-500 mb-1">Тип</div>
                <div className="font-medium">{obligation.type}</div>
              </div>
              <div className="p-4 rounded-lg bg-stone-50">
                <div className="text-xs text-stone-500 mb-1">Частота</div>
                <div className="font-medium">{obligation.frequency}</div>
              </div>
              <div className="p-4 rounded-lg bg-stone-50">
                <div className="text-xs text-stone-500 mb-1">Источник</div>
                <div className="font-medium">{obligation.sourceType}</div>
              </div>
              <div className="p-4 rounded-lg bg-stone-50">
                <div className="text-xs text-stone-500 mb-1">Статус</div>
                <StatusBadge status={statusMap[obligation.status]} label={obligation.status} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-stone-200">
              {obligation.status !== 'paid' && (
                <>
                  <button className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors">
                    Отметить оплаченным
                  </button>
                  <button className="px-4 py-2 text-sm font-medium rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors">
                    Перенести
                  </button>
                  <button className="px-4 py-2 text-sm font-medium rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors">
                    В Bill Pay
                  </button>
                </>
              )}
              <button className="px-4 py-2 text-sm font-medium rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors">
                Создать задачу
              </button>
            </div>
          </div>
        )}

        {activeTab !== 'overview' && (
          <div className="text-center py-12 text-stone-500">
            <p>Раздел "{tabLabels[activeTab]}" в разработке</p>
          </div>
        )}
      </div>
    </div>
  );
}
