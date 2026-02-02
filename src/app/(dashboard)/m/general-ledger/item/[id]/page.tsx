"use client";

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { GlEntryDetail } from '@/modules/06-general-ledger/ui/GlEntryDetail';
import seedData from '@/modules/06-general-ledger/seed.json';

const tabs = [
  { id: 'overview', label: 'Обзор' },
  { id: 'lines', label: 'Линии' },
  { id: 'documents', label: 'Документы' },
  { id: 'approvals', label: 'Согласования' },
  { id: 'audit', label: 'Аудит' }
];

export default function GeneralLedgerItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  const entry = seedData.journalEntries.find(e => e.id === id);
  const lines = seedData.journalLines
    .filter(l => l.entryId === id)
    .map(l => {
      const account = seedData.glAccounts.find(a => a.id === l.accountId);
      return {
        ...l,
        accountCode: account?.code || '',
        accountName: account?.name || ''
      };
    });

  if (!entry) {
    return (
      <div className="p-8 text-center">
        <p className="text-stone-500 mb-4">Проводка не найдена</p>
        <Button variant="secondary" onClick={() => router.push('/m/general-ledger')}>
          Назад
        </Button>
      </div>
    );
  }

  const typedEntry = {
    ...entry,
    status: entry.status as 'draft' | 'pending_approval' | 'posted' | 'rejected'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.push('/m/general-ledger/list?tab=journals')}
            className="text-sm text-stone-500 hover:text-stone-700 mb-2"
          >
            ← Назад к проводкам
          </button>
          <h1 className="text-2xl font-bold text-stone-800">Проводка {id}</h1>
        </div>
      </div>

      <div className="flex gap-1 border-b border-stone-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px",
              activeTab === tab.id
                ? "border-emerald-500 text-emerald-700"
                : "border-transparent text-stone-500 hover:text-stone-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(activeTab === 'overview' || activeTab === 'lines') && (
        <GlEntryDetail
          entry={typedEntry}
          lines={lines}
          onEdit={() => console.log('Edit')}
          onSubmit={() => console.log('Submit')}
          onPost={() => console.log('Post')}
          onDelete={() => console.log('Delete')}
          onAttachDoc={() => console.log('Attach')}
          onViewAudit={() => setActiveTab('audit')}
        />
      )}

      {activeTab === 'documents' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center">
          <p className="text-stone-500 mb-4">
            {entry.docIds.length > 0 ? `${entry.docIds.length} прикреплённых документов` : 'Нет прикреплённых документов'}
          </p>
          <Button variant="secondary">Прикрепить документ</Button>
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center">
          {entry.status === 'pending_approval' ? (
            <div>
              <p className="text-amber-600 mb-4">Ожидает согласования</p>
              <div className="flex gap-2 justify-center">
                <Button variant="primary">Одобрить</Button>
                <Button variant="ghost" className="text-rose-600">Отклонить</Button>
              </div>
            </div>
          ) : (
            <p className="text-stone-500">Нет активных запросов на согласование</p>
          )}
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-8 text-center">
          <p className="text-stone-500">Аудит-лог в разработке</p>
        </div>
      )}
    </div>
  );
}
