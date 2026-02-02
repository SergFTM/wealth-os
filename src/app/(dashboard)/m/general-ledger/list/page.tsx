"use client";

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { GlCoATable } from '@/modules/06-general-ledger/ui/GlCoATable';
import { GlJournalTable } from '@/modules/06-general-ledger/ui/GlJournalTable';
import { GlFxPanel } from '@/modules/06-general-ledger/ui/GlFxPanel';
import { GlPeriodClosePanel } from '@/modules/06-general-ledger/ui/GlPeriodClosePanel';
import { GlReportsPanel } from '@/modules/06-general-ledger/ui/GlReportsPanel';
import seedData from '@/modules/06-general-ledger/seed.json';

const tabs = [
  { id: 'coa', label: 'План счетов' },
  { id: 'journals', label: 'Проводки' },
  { id: 'transactions', label: 'Транзакции' },
  { id: 'reconciliations', label: 'Сверка' },
  { id: 'fx', label: 'Валюта и FX' },
  { id: 'periods', label: 'Периоды' },
  { id: 'reports', label: 'Отчёты' },
  { id: 'ibor_abor', label: 'IBOR/ABOR' }
];

export default function GeneralLedgerListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'coa';
  const [activeTab, setActiveTab] = useState(initialTab);

  const accounts = seedData.glAccounts.map(a => ({
    ...a,
    type: a.type as 'asset' | 'liability' | 'equity' | 'income' | 'expense'
  }));

  const entries = seedData.journalEntries.map(e => ({
    ...e,
    status: e.status as 'draft' | 'pending_approval' | 'posted' | 'rejected'
  }));

  const fxRates = seedData.fxRates.map(r => ({
    ...r,
    status: r.status as 'ok' | 'missing' | 'stale'
  }));

  const periods = seedData.periods.map(p => ({
    ...p,
    status: p.status as 'open' | 'closing' | 'closed',
    closeChecklist: p.closeChecklist as {
      journalsPosted: boolean;
      fxRatesPresent: boolean;
      reconciliationsComplete: boolean;
      approvalsComplete: boolean;
    }
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Главная книга</h1>
          <p className="text-sm text-stone-500">Управление счетами, проводками и периодами</p>
        </div>
        <Button variant="primary" onClick={() => router.push('/m/general-ledger')}>
          ← Дашборд
        </Button>
      </div>

      <div className="flex gap-1 border-b border-stone-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
              activeTab === tab.id
                ? "border-emerald-500 text-emerald-700"
                : "border-transparent text-stone-500 hover:text-stone-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'coa' && (
        <GlCoATable
          accounts={accounts}
          onEdit={id => console.log('Edit', id)}
          onDisable={id => console.log('Disable', id)}
        />
      )}

      {activeTab === 'journals' && (
        <GlJournalTable
          entries={entries}
          onOpen={id => router.push(`/m/general-ledger/item/${id}`)}
          onSubmit={id => console.log('Submit', id)}
          onPost={id => console.log('Post', id)}
        />
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center">
          <p className="text-stone-500 mb-4">Транзакции (ledgerTransactions)</p>
          <p className="text-sm text-stone-400">Показывает проведённые транзакции с фильтрами по entity, периоду, счёту</p>
        </div>
      )}

      {activeTab === 'reconciliations' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center">
          <p className="text-stone-500 mb-4">{seedData.glReconciliations.length} записей сверки</p>
          <Button variant="secondary" onClick={() => router.push('/m/reconciliation')}>
            Перейти в модуль Сверка
          </Button>
        </div>
      )}

      {activeTab === 'fx' && (
        <GlFxPanel
          rates={fxRates}
          onAddRate={() => console.log('Add rate')}
          onImport={() => console.log('Import')}
        />
      )}

      {activeTab === 'periods' && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {periods.map(p => (
            <GlPeriodClosePanel
              key={p.id}
              period={p}
              onStartClose={() => console.log('Start close', p.id)}
              onRequestApproval={() => console.log('Request approval', p.id)}
              onClose={() => console.log('Close', p.id)}
              onReopen={() => console.log('Reopen', p.id)}
              canClose={p.closeChecklist.approvalsComplete}
              canReopen={p.status === 'closed'}
            />
          ))}
        </div>
      )}

      {activeTab === 'reports' && <GlReportsPanel />}

      {activeTab === 'ibor_abor' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center">
          <p className="text-stone-500 mb-4">IBOR vs ABOR расхождения</p>
          <p className="text-sm text-stone-400 mb-4">Показывает несоответствия между Investment Book и Accounting Book</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-lg">
            <span className="font-bold">2</span>
            <span>открытых issue</span>
          </div>
        </div>
      )}
    </div>
  );
}
