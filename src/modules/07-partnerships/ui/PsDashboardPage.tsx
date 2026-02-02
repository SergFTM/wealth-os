"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PsKpiStrip } from './PsKpiStrip';
import { PsPartnershipsTable } from './PsPartnershipsTable';
import { PsTransactionsTable } from './PsTransactionsTable';
import { PsDistributionsTable } from './PsDistributionsTable';
import { PsStructureGraph } from './PsStructureGraph';
import { PsActionsBar } from './PsActionsBar';
import { HelpPanel } from '@/components/ui/HelpPanel';
import seedData from '../seed.json';

export function PsDashboardPage() {
  const router = useRouter();
  const [selectedPs, setSelectedPs] = useState(seedData.partnerships[0]);

  const interestsWithOwners = seedData.interests.map(i => {
    const owner = seedData.owners.find(o => o.id === i.ownerId);
    return { ...i, name: owner?.name || '', ownerType: owner?.ownerType || 'entity', parentId: null };
  }).filter(i => i.partnershipId === selectedPs.id);

  const kpis = [
    { id: 'partnerships', label: 'Партнерств', value: seedData.partnerships.length, status: 'ok' as const, linkTo: '/m/partnerships/list?tab=partnerships' },
    { id: 'owners', label: 'Owners/EBO', value: seedData.owners.length, status: 'ok' as const, linkTo: '/m/partnerships/list?tab=owners' },
    { id: 'activeInterests', label: 'Активные доли', value: seedData.interests.filter(i => i.status === 'active').length, status: 'ok' as const, linkTo: '/m/partnerships/list?tab=interests' },
    { id: 'pending', label: 'Ожидают одобр.', value: seedData.approvals.filter(a => a.status === 'pending').length, status: 'warning' as const, linkTo: '/m/partnerships/list?tab=approvals' },
    { id: 'dist30d', label: 'Распред. 30д', value: seedData.distributions.length, status: 'ok' as const, linkTo: '/m/partnerships/list?tab=distributions' },
    { id: 'tx30d', label: 'Транз. 30д', value: seedData.partnerTransactions.length, status: 'ok' as const, linkTo: '/m/partnerships/list?tab=transactions' },
    { id: 'missingDocs', label: 'Нет документов', value: 6, status: 'critical' as const, linkTo: '/m/partnerships/list?filter=missing_docs' },
    { id: 'concentration', label: 'Концентрации', value: 2, status: 'warning' as const, linkTo: '/m/partnerships/list?tab=allocations' }
  ];

  const partnershipsWithOwners = seedData.partnerships.map(p => ({
    ...p, ownersCount: seedData.interests.filter(i => i.partnershipId === p.id && i.status === 'active').length
  }));

  const txWithNames = seedData.partnerTransactions.slice(0, 8).map(tx => ({
    ...tx, partnershipName: seedData.partnerships.find(p => p.id === tx.partnershipId)?.name,
    ownerName: seedData.owners.find(o => o.id === tx.ownerId)?.name
  }));

  const distWithNames = seedData.distributions.slice(0, 5).map(d => ({
    ...d, partnershipName: seedData.partnerships.find(p => p.id === d.partnershipId)?.name,
    ownerName: seedData.owners.find(o => o.id === d.ownerId)?.name
  }));

  const handleCreatePartnership = () => router.push('/m/partnerships/list?tab=partnerships&create=true');
  const handleAddOwner = () => router.push('/m/partnerships/list?tab=owners&create=true');
  const handleAddInterest = () => router.push('/m/partnerships/list?tab=interests&create=true');
  const handleCreateTx = () => router.push('/m/partnerships/list?tab=transactions&create=true');
  const handleCreateDist = () => router.push('/m/partnerships/list?tab=distributions&create=true');
  const handleAttachDoc = () => router.push('/m/partnerships/list?tab=documents&create=true');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <PsKpiStrip kpis={kpis} />
        <PsActionsBar
          onCreatePartnership={handleCreatePartnership}
          onAddOwner={handleAddOwner}
          onAddInterest={handleAddInterest}
          onCreateTransaction={handleCreateTx}
          onCreateDistribution={handleCreateDist}
          onAttachDoc={handleAttachDoc}
        />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <PsStructureGraph
            partnershipName={selectedPs.name}
            owners={interestsWithOwners}
            onNodeClick={id => router.push(`/m/partnerships/item/${id}?type=owner`)}
          />
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
              <p className="text-xs text-stone-500 mb-2">Выберите партнерство:</p>
              <select 
                value={selectedPs.id} 
                onChange={e => setSelectedPs(seedData.partnerships.find(p => p.id === e.target.value) || selectedPs)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                {seedData.partnerships.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <PsPartnershipsTable partnerships={partnershipsWithOwners.slice(0, 4)} onOpen={id => router.push(`/m/partnerships/item/${id}`)} compact />
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <PsTransactionsTable transactions={txWithNames} onOpen={id => router.push(`/m/partnerships/item/${id}?type=tx`)} compact />
          <PsDistributionsTable distributions={distWithNames} onOpen={id => router.push(`/m/partnerships/item/${id}?type=dist`)} compact />
        </div>
      </div>
      <div className="space-y-4">
        <HelpPanel 
          title="Партнерства и структура владения" 
          description="Учёт партнерских структур, долей владения, транзакций и распределений для MFO."
          features={[
            'Режимы: Ownership vs Profit Share',
            'Многоуровневое владение (EBO)',
            'Транзакции партнерства',
            'Распределения и возвраты',
            'Audit trail и approvals',
            'Связь с GL и Reporting'
          ]}
          scenarios={[
            'Кто конечный бенефициар?',
            'Какая доля у партнера?',
            'Распределение за квартал',
            'Транзакция + документ'
          ]}
          dataSources={[
            'Partnership agreements',
            'Cap tables',
            'Bank feeds',
            'Legal documents'
          ]} 
        />
      </div>
    </div>
  );
}
