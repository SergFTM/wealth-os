"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlKpiStrip } from './GlKpiStrip';
import { GlJournalTable } from './GlJournalTable';
import { GlTrialBalanceWidget } from './GlTrialBalanceWidget';
import { GlReportsPanel } from './GlReportsPanel';
import { GlReconPanel } from './GlReconPanel';
import { GlActionsBar } from './GlActionsBar';
import { GlEntryComposer } from './GlEntryComposer';
import { HelpPanel } from '@/components/ui/HelpPanel';
import seedData from '../seed.json';

export function GlDashboardPage() {
  const router = useRouter();
  const [showComposer, setShowComposer] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const kpis = [
    { id: 'openPeriods', label: 'Открытые периоды', value: seedData.periods.filter(p => p.status === 'open').length, status: 'ok' as const, linkTo: '/m/general-ledger/list?tab=periods&status=open' },
    { id: 'drafts', label: 'Черновики', value: seedData.journalEntries.filter(e => e.status === 'draft').length, status: 'info' as const, linkTo: '/m/general-ledger/list?tab=journals&status=draft' },
    { id: 'pending', label: 'На согласовании', value: seedData.journalEntries.filter(e => e.status === 'pending_approval').length, status: 'warning' as const, linkTo: '/m/general-ledger/list?tab=journals&status=pending' },
    { id: 'posted', label: 'Проведено сегодня', value: seedData.journalEntries.filter(e => e.status === 'posted').length, status: 'ok' as const },
    { id: 'unreconciled', label: 'Несверенные', value: seedData.glReconciliations.reduce((s, r) => s + r.openItems.length, 0), status: 'warning' as const, linkTo: '/m/general-ledger/list?tab=reconciliations' },
    { id: 'missingFx', label: 'Нет FX', value: seedData.fxRates.filter(r => r.status === 'missing').length, status: 'critical' as const, linkTo: '/m/general-ledger/list?tab=fx&status=missing' },
    { id: 'iborAbor', label: 'IBOR/ABOR', value: 2, status: 'critical' as const, linkTo: '/m/general-ledger/list?tab=ibor_abor' },
    { id: 'unlinked', label: 'Без связи', value: 3, status: 'info' as const }
  ];

  const recentEntries = seedData.journalEntries.slice(0, 8).map(e => ({
    ...e,
    status: e.status as 'draft' | 'pending_approval' | 'posted' | 'rejected'
  }));

  const trialBalanceRows = seedData.glAccounts.slice(0, 10).map(acc => ({
    accountCode: acc.code,
    accountName: acc.name,
    debit: acc.type === 'asset' || acc.type === 'expense' ? Math.random() * 50000 : 0,
    credit: acc.type === 'liability' || acc.type === 'equity' || acc.type === 'income' ? Math.random() * 50000 : 0
  }));

  const recons = seedData.glReconciliations.map(r => ({
    type: r.type as 'bank' | 'custodian',
    entityId: r.entityId,
    accountId: r.accountId,
    status: r.status as 'open' | 'in_progress' | 'completed',
    openItems: r.openItems.length,
    matchedCount: r.matchedCount,
    totalItems: r.totalItems
  }));

  return (
    <div className="flex gap-4">
      <div className="flex-1 space-y-6">
        <GlKpiStrip kpis={kpis} />
        <GlActionsBar
          onCreateEntry={() => setShowComposer(true)}
          onImportBank={() => console.log('Import bank')}
          onAddFxRate={() => router.push('/m/general-ledger/list?tab=fx')}
          onClosePeriod={() => router.push('/m/general-ledger/list?tab=periods')}
          onExport={() => console.log('Export')}
        />
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <GlTrialBalanceWidget rows={trialBalanceRows} period="2026-01" />
          </div>
          <GlReconPanel reconciliations={recons} />
        </div>
        <GlJournalTable
          entries={recentEntries}
          onOpen={id => router.push(`/m/general-ledger/item/${id}`)}
          onSubmit={id => console.log('Submit', id)}
          onPost={id => console.log('Post', id)}
        />
        <GlReportsPanel />
      </div>

      {showHelp && (
        <div className="w-80 flex-shrink-0">
          <HelpPanel
            title="Главная книга"
            description="Центральный учётный реестр для всех финансовых транзакций по IFRS/GAAP."
            features={['План счетов с иерархией', 'Журнальные проводки дебет/кредит', 'Мультисущность и консолидация', 'Мультивалюта с FX-курсами', 'Закрытие периодов с approval']}
            scenarios={['Создать проводку и провести', 'Сверить банковскую выписку', 'Сформировать P&L отчёт', 'Закрыть период']}
            dataSources={['Банковские feeds', 'Кастодианы', 'Billpay', 'Ручные проводки']}
          />
        </div>
      )}

      <button
        onClick={() => setShowHelp(!showHelp)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 flex items-center justify-center z-40"
      >
        ?
      </button>

      <GlEntryComposer
        open={showComposer}
        onClose={() => setShowComposer(false)}
        onSave={data => { console.log('Save', data); setShowComposer(false); }}
        accounts={seedData.glAccounts.map(a => ({ id: a.id, code: a.code, name: a.name }))}
        entities={seedData.entities}
        periods={seedData.periods.filter(p => p.status === 'open').map(p => ({ id: p.id, name: p.name }))}
      />
    </div>
  );
}
