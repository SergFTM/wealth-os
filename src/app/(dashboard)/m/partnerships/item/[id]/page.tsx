"use client";

import { useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PsDetailHeader } from '@/modules/07-partnerships/ui/PsDetailHeader';
import { PsInterestsTable } from '@/modules/07-partnerships/ui/PsInterestsTable';
import { PsTransactionsTable } from '@/modules/07-partnerships/ui/PsTransactionsTable';
import { PsDistributionsTable } from '@/modules/07-partnerships/ui/PsDistributionsTable';
import { PsAllocationPanel } from '@/modules/07-partnerships/ui/PsAllocationPanel';
import { PsStructureGraph } from '@/modules/07-partnerships/ui/PsStructureGraph';
import { PsDocumentsTable } from '@/modules/07-partnerships/ui/PsDocumentsTable';
import { PsAuditPanel } from '@/modules/07-partnerships/ui/PsAuditPanel';
import seedData from '@/modules/07-partnerships/seed.json';

const partnershipTabs = [
  { id: 'overview', label: 'Обзор' },
  { id: 'structure', label: 'Структура' },
  { id: 'interests', label: 'Доли' },
  { id: 'transactions', label: 'Транзакции' },
  { id: 'distributions', label: 'Распределения' },
  { id: 'allocations', label: 'Аллокации' },
  { id: 'documents', label: 'Документы' },
  { id: 'audit', label: 'Аудит' }
];

const ownerTabs = [
  { id: 'overview', label: 'Обзор' },
  { id: 'partnerships', label: 'Партнерства' },
  { id: 'transactions', label: 'Транзакции' },
  { id: 'distributions', label: 'Распределения' },
  { id: 'documents', label: 'Документы' },
  { id: 'audit', label: 'Аудит' }
];

export default function PartnershipsItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemType = searchParams.get('type') || 'partnership';
  const [activeTab, setActiveTab] = useState('overview');

  const partnership = seedData.partnerships.find(p => p.id === id);
  const owner = seedData.owners.find(o => o.id === id);
  const interest = seedData.interests.find(i => i.id === id);
  const tx = seedData.partnerTransactions.find(t => t.id === id);
  const dist = seedData.distributions.find(d => d.id === id);

  // Not found
  if (!partnership && !owner && !interest && !tx && !dist) {
    return (
      <div className="p-8 text-center">
        <p className="text-stone-500 mb-4">Запись не найдена</p>
        <Button variant="secondary" onClick={() => router.push('/m/partnerships')}>Назад</Button>
      </div>
    );
  }

  // Partnership Detail
  if (partnership) {
    const psInterests = seedData.interests.filter(i => i.partnershipId === id).map(i => ({
      ...i, ownerName: seedData.owners.find(o => o.id === i.ownerId)?.name, partnershipName: partnership.name
    }));
    const psTx = seedData.partnerTransactions.filter(t => t.partnershipId === id).map(t => ({
      ...t, ownerName: seedData.owners.find(o => o.id === t.ownerId)?.name, partnershipName: partnership.name
    }));
    const psDist = seedData.distributions.filter(d => d.partnershipId === id).map(d => ({
      ...d, ownerName: seedData.owners.find(o => o.id === d.ownerId)?.name, partnershipName: partnership.name
    }));
    const psAlloc = seedData.allocations.filter(a => a.partnershipId === id);
    const psDocs = seedData.documents.filter(d => d.linkedTo === id || psTx.some(t => d.linkedTo === t.id) || psDist.some(dist => d.linkedTo === dist.id));
    const psAudit = seedData.auditEvents.filter(e => e.recordId === id || e.recordId.startsWith('int-') || e.recordId.startsWith('ptx-') || e.recordId.startsWith('dist-'));
    const ownersForGraph = psInterests.map(i => ({
      id: i.ownerId, name: i.ownerName || '', ownerType: seedData.owners.find(o => o.id === i.ownerId)?.ownerType || 'entity',
      ownershipPct: i.ownershipPct, profitSharePct: i.profitSharePct, parentId: null
    }));

    return (
      <div className="space-y-6">
        <PsDetailHeader
          title={partnership.name}
          subtitle={`${partnership.type} · ${partnership.currency}`}
          type="partnership"
          status={partnership.status}
          splitMode={partnership.splitMode as 'ownership' | 'profit'}
          onBack={() => router.push('/m/partnerships/list?tab=partnerships')}
          onAddOwner={() => console.log('Add owner')}
          onAddInterest={() => console.log('Add interest')}
          onCreateTx={() => console.log('Create tx')}
          onCreateDist={() => console.log('Create dist')}
        />
        <div className="flex gap-1 border-b border-stone-200">
          {partnershipTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn("px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px", activeTab === tab.id ? "border-emerald-500 text-emerald-700" : "border-transparent text-stone-500 hover:text-stone-700")}>
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
              <p className="text-xs text-stone-500">NAV</p>
              <p className="text-2xl font-bold text-stone-800">{partnership.nav.toLocaleString('ru-RU', { style: 'currency', currency: partnership.currency, maximumFractionDigits: 0 })}</p>
              <p className="text-xs text-stone-400 mt-1">as of {partnership.asOf}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
              <p className="text-xs text-stone-500">Владельцы</p>
              <p className="text-2xl font-bold text-stone-800">{psInterests.filter(i => i.status === 'active').length}</p>
              <p className="text-xs text-stone-400 mt-1">активных долей</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
              <p className="text-xs text-stone-500">Документы</p>
              <p className="text-2xl font-bold text-stone-800">{psDocs.length}</p>
              <p className="text-xs text-stone-400 mt-1">прикреплено</p>
            </div>
          </div>
        )}
        {activeTab === 'structure' && <PsStructureGraph partnershipName={partnership.name} owners={ownersForGraph} onNodeClick={oid => router.push(`/m/partnerships/item/${oid}?type=owner`)} />}
        {activeTab === 'interests' && <PsInterestsTable interests={psInterests} onOpen={iid => router.push(`/m/partnerships/item/${iid}?type=interest`)} />}
        {activeTab === 'transactions' && <PsTransactionsTable transactions={psTx} onOpen={tid => router.push(`/m/partnerships/item/${tid}?type=tx`)} />}
        {activeTab === 'distributions' && <PsDistributionsTable distributions={psDist} onOpen={did => router.push(`/m/partnerships/item/${did}?type=dist`)} />}
        {activeTab === 'allocations' && <PsAllocationPanel allocations={psAlloc} partnershipName={partnership.name} />}
        {activeTab === 'documents' && <PsDocumentsTable documents={psDocs} linkedToName={partnership.name} onAttach={() => console.log('Attach')} />}
        {activeTab === 'audit' && <PsAuditPanel events={psAudit} filterRecordId={id} />}
      </div>
    );
  }

  // Owner Detail
  if (owner || itemType === 'owner') {
    const ownerData = owner || seedData.owners.find(o => o.id === id);
    if (!ownerData) {
      return <div className="p-8 text-center text-stone-500">Владелец не найден</div>;
    }
    const ownerInterests = seedData.interests.filter(i => i.ownerId === ownerData.id).map(i => ({
      ...i, partnershipName: seedData.partnerships.find(p => p.id === i.partnershipId)?.name, ownerName: ownerData.name
    }));
    const ownerTxs = seedData.partnerTransactions.filter(t => t.ownerId === ownerData.id).map(t => ({
      ...t, partnershipName: seedData.partnerships.find(p => p.id === t.partnershipId)?.name, ownerName: ownerData.name
    }));
    const ownerDists = seedData.distributions.filter(d => d.ownerId === ownerData.id).map(d => ({
      ...d, partnershipName: seedData.partnerships.find(p => p.id === d.partnershipId)?.name, ownerName: ownerData.name
    }));
    const ownerAudit = seedData.auditEvents.filter(e => e.recordId === ownerData.id || ownerInterests.some(i => e.recordId === i.id));

    return (
      <div className="space-y-6">
        <PsDetailHeader
          title={ownerData.name}
          subtitle={`${ownerData.ownerType === 'person' ? 'Физлицо' : ownerData.ownerType === 'trust' ? 'Траст' : 'Юрлицо'} · ${ownerData.residence || 'N/A'}`}
          type="owner"
          status={ownerData.status}
          onBack={() => router.push('/m/partnerships/list?tab=owners')}
        />
        <div className="flex gap-1 border-b border-stone-200">
          {ownerTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn("px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px", activeTab === tab.id ? "border-emerald-500 text-emerald-700" : "border-transparent text-stone-500 hover:text-stone-700")}>
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
              <p className="text-xs text-stone-500">KYC статус</p>
              <StatusBadge 
                status={ownerData.kycStatus === 'approved' ? 'ok' : ownerData.kycStatus === 'pending' ? 'warning' : ownerData.kycStatus === 'expired' ? 'critical' : 'pending'} 
                label={ownerData.kycStatus === 'approved' ? 'Одобрен' : ownerData.kycStatus === 'pending' ? 'Ожидает' : ownerData.kycStatus === 'expired' ? 'Истёк' : 'Не требуется'} 
              />
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
              <p className="text-xs text-stone-500">Партнерств</p>
              <p className="text-2xl font-bold text-stone-800">{ownerInterests.length}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
              <p className="text-xs text-stone-500">Транзакций</p>
              <p className="text-2xl font-bold text-stone-800">{ownerTxs.length}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-4">
              <p className="text-xs text-stone-500">Распределений</p>
              <p className="text-2xl font-bold text-stone-800">{ownerDists.length}</p>
            </div>
          </div>
        )}
        {activeTab === 'partnerships' && <PsInterestsTable interests={ownerInterests} onOpen={iid => router.push(`/m/partnerships/item/${iid}?type=interest`)} />}
        {activeTab === 'transactions' && <PsTransactionsTable transactions={ownerTxs} onOpen={tid => router.push(`/m/partnerships/item/${tid}?type=tx`)} />}
        {activeTab === 'distributions' && <PsDistributionsTable distributions={ownerDists} onOpen={did => router.push(`/m/partnerships/item/${did}?type=dist`)} />}
        {activeTab === 'documents' && <PsDocumentsTable documents={[]} linkedToName={ownerData.name} onAttach={() => console.log('Attach')} />}
        {activeTab === 'audit' && <PsAuditPanel events={ownerAudit} />}
      </div>
    );
  }

  // Interest Detail
  if (interest || itemType === 'interest') {
    const intData = interest || seedData.interests.find(i => i.id === id);
    if (!intData) {
      return <div className="p-8 text-center text-stone-500">Доля не найдена</div>;
    }
    const psName = seedData.partnerships.find(p => p.id === intData.partnershipId)?.name || '';
    const ownerName = seedData.owners.find(o => o.id === intData.ownerId)?.name || '';

    return (
      <div className="space-y-6">
        <PsDetailHeader
          title={`Доля: ${ownerName}`}
          subtitle={`${psName} · Действует с ${intData.effectiveDate}`}
          type="interest"
          status={intData.status}
          showApprovalActions={intData.status === 'pending_change' && !intData.approved}
          onBack={() => router.push('/m/partnerships/list?tab=interests')}
          onApprove={() => console.log('Approve interest')}
          onReject={() => console.log('Reject interest')}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
            <p className="text-xs text-stone-500 mb-1">Доля собственности</p>
            <p className="text-3xl font-bold text-blue-600">{intData.ownershipPct}%</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
            <p className="text-xs text-stone-500 mb-1">Доля прибыли</p>
            <p className="text-3xl font-bold text-purple-600">{intData.profitSharePct}%</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
            <p className="text-xs text-stone-500 mb-1">Статус</p>
            <StatusBadge 
              status={intData.approved ? 'ok' : 'warning'} 
              label={intData.approved ? 'Одобрено' : 'Ожидает одобрения'} 
            />
            {intData.approvedBy && (
              <p className="text-xs text-stone-400 mt-2">Одобрил: {intData.approvedBy}</p>
            )}
          </div>
        </div>
        {intData.changeReason && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-700"><strong>Причина изменения:</strong> {intData.changeReason}</p>
          </div>
        )}
      </div>
    );
  }

  // Transaction Detail
  if (tx || itemType === 'tx') {
    const txData = tx || seedData.partnerTransactions.find(t => t.id === id);
    if (!txData) {
      return <div className="p-8 text-center text-stone-500">Транзакция не найдена</div>;
    }
    const psName = seedData.partnerships.find(p => p.id === txData.partnershipId)?.name || '';
    const ownerName = seedData.owners.find(o => o.id === txData.ownerId)?.name || '';
    const txDocs = seedData.documents.filter(d => txData.docIds?.includes(d.id));

    const typeLabels: Record<string, string> = {
      contribution: 'Взнос', subscription: 'Подписка', redemption: 'Выкуп',
      buy_interest: 'Покупка доли', sell_interest: 'Продажа доли'
    };

    return (
      <div className="space-y-6">
        <PsDetailHeader
          title={`${typeLabels[txData.type] || txData.type}: ${ownerName}`}
          subtitle={`${psName} · ${txData.date}`}
          type="transaction"
          status={txData.status}
          showApprovalActions={txData.status === 'pending'}
          showPostToGL={txData.status === 'pending'}
          onBack={() => router.push('/m/partnerships/list?tab=transactions')}
          onApprove={() => console.log('Approve tx')}
          onPostToGL={() => console.log('Post to GL')}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
            <p className="text-xs text-stone-500 mb-1">Сумма</p>
            <p className="text-3xl font-bold text-stone-800">{txData.amount.toLocaleString('ru-RU', { style: 'currency', currency: txData.currency, maximumFractionDigits: 0 })}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
            <p className="text-xs text-stone-500 mb-1">GL ссылка</p>
            {txData.sourceRef ? (
              <p className="text-lg font-medium text-emerald-600">{txData.sourceRef}</p>
            ) : (
              <p className="text-stone-400">Не проведено</p>
            )}
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
            <p className="text-xs text-stone-500 mb-1">Источник</p>
            <p className="text-lg text-stone-700">{txData.sourceType || 'N/A'}</p>
          </div>
        </div>
        {txData.notes && (
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
            <p className="text-sm text-stone-600"><strong>Примечание:</strong> {txData.notes}</p>
          </div>
        )}
        <PsDocumentsTable documents={txDocs} linkedToName="Документы транзакции" onAttach={() => console.log('Attach')} />
      </div>
    );
  }

  // Distribution Detail
  if (dist || itemType === 'dist') {
    const distData = dist || seedData.distributions.find(d => d.id === id);
    if (!distData) {
      return <div className="p-8 text-center text-stone-500">Распределение не найдено</div>;
    }
    const psName = seedData.partnerships.find(p => p.id === distData.partnershipId)?.name || '';
    const ownerName = seedData.owners.find(o => o.id === distData.ownerId)?.name || '';
    const distDocs = seedData.documents.filter(d => distData.docIds?.includes(d.id));

    const typeLabels: Record<string, string> = {
      cash: 'Cash', in_kind: 'In-kind', return_of_capital: 'Возврат капитала', fee: 'Комиссия'
    };

    return (
      <div className="space-y-6">
        <PsDetailHeader
          title={`${typeLabels[distData.type] || distData.type}: ${ownerName}`}
          subtitle={`${psName} · ${distData.date}`}
          type="distribution"
          status={distData.status}
          showApprovalActions={distData.status === 'pending'}
          showPostToGL={distData.status === 'pending'}
          onBack={() => router.push('/m/partnerships/list?tab=distributions')}
          onApprove={() => console.log('Approve dist')}
          onPostToGL={() => console.log('Post to GL')}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
            <p className="text-xs text-stone-500 mb-1">Сумма</p>
            <p className="text-3xl font-bold text-emerald-600">{distData.amount.toLocaleString('ru-RU', { style: 'currency', currency: distData.currency, maximumFractionDigits: 0 })}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
            <p className="text-xs text-stone-500 mb-1">Тип</p>
            <p className="text-lg font-medium text-stone-700">{typeLabels[distData.type]}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/50 p-6">
            <p className="text-xs text-stone-500 mb-1">GL ссылка</p>
            {distData.sourceRef ? (
              <p className="text-lg font-medium text-emerald-600">{distData.sourceRef}</p>
            ) : (
              <p className="text-stone-400">Не проведено</p>
            )}
          </div>
        </div>
        {distData.notes && (
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4">
            <p className="text-sm text-stone-600"><strong>Примечание:</strong> {distData.notes}</p>
          </div>
        )}
        <PsDocumentsTable documents={distDocs} linkedToName="Документы распределения" onAttach={() => console.log('Attach')} />
      </div>
    );
  }

  return <div className="p-8 text-center"><p className="text-stone-500">Детальный вид для {itemType} {id}</p><Button variant="secondary" onClick={() => router.push('/m/partnerships')}>Назад</Button></div>;
}
