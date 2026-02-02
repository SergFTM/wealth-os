"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import seedData from '@/modules/08-private-capital/seed.json';
import { PcFundDetail } from '@/modules/08-private-capital/ui/PcFundDetail';

export default function PrivateCapitalItemPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // Find the fund
  const fund = seedData.funds.find(f => f.id === id);
  
  if (!fund) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-stone-800">Не найдено</h2>
          <p className="text-stone-500 mt-2">Фонд с ID {id} не найден</p>
          <Link href="/m/private-capital" className="mt-4 inline-block text-emerald-600 hover:text-emerald-700">
            ← Вернуться к списку
          </Link>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const fundCommitments = seedData.commitments.filter(c => c.fundId === fund.id);
  const latestValuation = seedData.valuations
    .filter(v => v.fundId === fund.id)
    .sort((a, b) => new Date(b.asOf).getTime() - new Date(a.asOf).getTime())[0];
  
  const totalCommitment = fundCommitments.reduce((sum, c) => sum + c.amountCommitted, 0);
  const totalCalled = fundCommitments.reduce((sum, c) => sum + c.amountCalled, 0);
  const totalDistributed = fundCommitments.reduce((sum, c) => sum + c.amountDistributed, 0);
  const totalUnfunded = fundCommitments.reduce((sum, c) => sum + c.unfunded, 0);
  const nav = latestValuation?.nav || 0;
  const tvpi = totalCalled > 0 ? (totalDistributed + nav) / totalCalled : 0;
  const irr = seedData.vintageMetrics.find(v => v.vintageYear === fund.vintageYear)?.irr || 0;

  const metrics = {
    commitment: totalCommitment,
    called: totalCalled,
    distributed: totalDistributed,
    unfunded: totalUnfunded,
    nav,
    tvpi,
    irr,
    valuationAsOf: latestValuation?.asOf
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-stone-500 mb-6">
        <Link href="/m/private-capital" className="hover:text-emerald-600">Частный капитал</Link>
        <span>/</span>
        <Link href="/m/private-capital/list" className="hover:text-emerald-600">Список</Link>
        <span>/</span>
        <span className="text-stone-800">{fund.name}</span>
      </div>

      {/* Content - using the detail component inline */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <PcFundDetail
          fund={{
            id: fund.id,
            name: fund.name,
            strategy: fund.strategy,
            vintageYear: fund.vintageYear,
            manager: fund.manager,
            currency: fund.currency,
            status: fund.status,
            tags: fund.tags
          }}
          metrics={metrics}
          onClose={() => router.push('/m/private-capital/list')}
          onEdit={() => console.log('Edit fund')}
          onAddCommitment={() => console.log('Add commitment')}
          onCreateCall={() => console.log('Create call')}
          onAddValuation={() => console.log('Add valuation')}
        />
      </div>
    </div>
  );
}
