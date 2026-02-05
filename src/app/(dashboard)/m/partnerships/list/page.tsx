"use client";

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { PsPartnershipsTable } from '@/modules/07-partnerships/ui/PsPartnershipsTable';
import { PsOwnersTable } from '@/modules/07-partnerships/ui/PsOwnersTable';
import { PsInterestsTable } from '@/modules/07-partnerships/ui/PsInterestsTable';
import { PsTransactionsTable } from '@/modules/07-partnerships/ui/PsTransactionsTable';
import { PsDistributionsTable } from '@/modules/07-partnerships/ui/PsDistributionsTable';
import { PsAllocationPanel } from '@/modules/07-partnerships/ui/PsAllocationPanel';
import { PsSplitModeToggle } from '@/modules/07-partnerships/ui/PsSplitModeToggle';
import { PsDocumentsTable } from '@/modules/07-partnerships/ui/PsDocumentsTable';
import { PsAuditPanel } from '@/modules/07-partnerships/ui/PsAuditPanel';
import type { AuditEvent } from '@/db/storage/storage.types';
import seedData from '@/modules/07-partnerships/seed.json';

const tabs = [
  { id: 'partnerships', label: 'Партнерства' },
  { id: 'owners', label: 'Owners (EBO)' },
  { id: 'interests', label: 'Доли' },
  { id: 'transactions', label: 'Транзакции' },
  { id: 'distributions', label: 'Распределения' },
  { id: 'allocations', label: 'Аллокации' },
  { id: 'documents', label: 'Документы' },
  { id: 'approvals', label: 'Согласования' }
];

export default function PartnershipsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'partnerships';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [splitMode, setSplitMode] = useState<'ownership' | 'profit'>('ownership');
  
  // Filters
  const [filterPartnership, setFilterPartnership] = useState('');
  const [filterOwner, setFilterOwner] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const partnershipsWithOwners = seedData.partnerships.map(p => ({
    ...p, ownersCount: seedData.interests.filter(i => i.partnershipId === p.id && i.status === 'active').length
  }));

  const interestsWithNames = seedData.interests.map(i => ({
    ...i, partnershipName: seedData.partnerships.find(p => p.id === i.partnershipId)?.name,
    ownerName: seedData.owners.find(o => o.id === i.ownerId)?.name
  }));

  const txWithNames = seedData.partnerTransactions.map(tx => ({
    ...tx, partnershipName: seedData.partnerships.find(p => p.id === tx.partnershipId)?.name,
    ownerName: seedData.owners.find(o => o.id === tx.ownerId)?.name
  }));

  const distWithNames = seedData.distributions.map(d => ({
    ...d, partnershipName: seedData.partnerships.find(p => p.id === d.partnershipId)?.name,
    ownerName: seedData.owners.find(o => o.id === d.ownerId)?.name
  }));

  const handleApprove = (id: string) => {
    console.log('Approve:', id);
    // In production: call API, create audit event
  };

  const handleReject = (id: string) => {
    console.log('Reject:', id);
  };

  const handlePost = (id: string) => {
    console.log('Post to GL:', id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Партнерства и структура владения</h1>
          <p className="text-sm text-stone-500">Управление партнерствами, долями и распределениями</p>
        </div>
        <Button variant="primary" onClick={() => router.push('/m/partnerships')}>← Дашборд</Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-stone-200/50">
        <select
          value={filterPartnership}
          onChange={e => setFilterPartnership(e.target.value)}
          className="px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="">Все партнерства</option>
          {seedData.partnerships.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select
          value={filterOwner}
          onChange={e => setFilterOwner(e.target.value)}
          className="px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="">Все владельцы</option>
          {seedData.owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="">Все статусы</option>
          <option value="active">Активные</option>
          <option value="pending">Ожидающие</option>
          <option value="posted">Проведенные</option>
        </select>
        <input
          type="text"
          placeholder="Поиск..."
          className="px-3 py-2 text-sm border border-stone-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none flex-1 min-w-[200px]"
        />
        <Button variant="ghost" size="sm" onClick={() => { setFilterPartnership(''); setFilterOwner(''); setFilterStatus(''); }}>
          Сбросить
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-stone-200 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn("px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap",
              activeTab === tab.id ? "border-emerald-500 text-emerald-700" : "border-transparent text-stone-500 hover:text-stone-700")}>
            {tab.label}
            {tab.id === 'approvals' && seedData.approvals.filter(a => a.status === 'pending').length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full">
                {seedData.approvals.filter(a => a.status === 'pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'partnerships' && <PsPartnershipsTable partnerships={partnershipsWithOwners} onOpen={id => router.push(`/m/partnerships/item/${id}`)} />}
      {activeTab === 'owners' && <PsOwnersTable owners={seedData.owners} onOpen={id => router.push(`/m/partnerships/item/${id}?type=owner`)} />}
      {activeTab === 'interests' && (
        <div className="space-y-4">
          <PsSplitModeToggle value={splitMode} onChange={setSplitMode} />
          <PsInterestsTable interests={interestsWithNames} onOpen={id => router.push(`/m/partnerships/item/${id}?type=interest`)} splitMode={splitMode} onApprove={handleApprove} />
        </div>
      )}
      {activeTab === 'transactions' && <PsTransactionsTable transactions={txWithNames} onOpen={id => router.push(`/m/partnerships/item/${id}?type=tx`)} onApprove={handleApprove} onPost={handlePost} />}
      {activeTab === 'distributions' && <PsDistributionsTable distributions={distWithNames} onOpen={id => router.push(`/m/partnerships/item/${id}?type=dist`)} onApprove={handleApprove} onPost={handlePost} />}
      {activeTab === 'allocations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PsAllocationPanel allocations={seedData.allocations} dimension="assetClass" partnershipName="Все партнерства" />
          <PsAllocationPanel allocations={seedData.allocations} dimension="geo" partnershipName="Все партнерства" />
        </div>
      )}
      {activeTab === 'documents' && (
        <PsDocumentsTable
          documents={seedData.documents}
          onOpen={id => console.log('Open doc:', id)}
          onDownload={id => console.log('Download:', id)}
          onAttach={() => console.log('Attach new doc')}
        />
      )}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
            <h3 className="font-semibold text-stone-800 mb-4">Ожидающие согласования</h3>
            <div className="space-y-3">
              {seedData.approvals.filter(a => a.status === 'pending').map(a => (
                <div key={a.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("px-2 py-0.5 rounded text-xs font-medium",
                        a.type === 'interest_change' ? "bg-purple-100 text-purple-700" :
                        a.type === 'transaction_post' ? "bg-blue-100 text-blue-700" :
                        "bg-emerald-100 text-emerald-700"
                      )}>
                        {a.type === 'interest_change' ? 'Изменение доли' : 
                         a.type === 'transaction_post' ? 'Проведение транзакции' : 
                         'Распределение'}
                      </span>
                      <span className="text-xs text-stone-400">{a.recordId}</span>
                    </div>
                    <p className="text-sm text-stone-700">{a.comment}</p>
                    <p className="text-xs text-stone-400 mt-1">
                      Запросил: {a.requestedBy} · {new Date(a.requestedAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" onClick={() => handleApprove(a.id)}>Одобрить</Button>
                    <Button variant="ghost" size="sm" className="text-rose-600" onClick={() => handleReject(a.id)}>Отклонить</Button>
                  </div>
                </div>
              ))}
              {seedData.approvals.filter(a => a.status === 'pending').length === 0 && (
                <p className="text-stone-500 text-center py-4">Нет ожидающих согласований</p>
              )}
            </div>
          </div>
          <PsAuditPanel events={seedData.auditEvents as AuditEvent[]} title="Последние действия" compact />
        </div>
      )}
    </div>
  );
}
