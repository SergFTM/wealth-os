'use client';

import React from 'react';
import { PortalPageHeader, PNetWorth } from '@/modules/45-portal';
import { NetWorthSummary } from '@/modules/45-portal/types';

export default function NetWorthPage() {
  // Demo data
  const netWorthData: NetWorthSummary = {
    total: 15750000,
    change30d: 320000,
    changePercent30d: 2.1,
    asOfDate: new Date().toISOString(),
    byAssetClass: [
      { name: 'Публичные акции', value: 5500000, percent: 34.9 },
      { name: 'Облигации', value: 3200000, percent: 20.3 },
      { name: 'Альтернативные инвестиции', value: 2800000, percent: 17.8 },
      { name: 'Недвижимость', value: 2500000, percent: 15.9 },
      { name: 'Денежные средства', value: 1250000, percent: 7.9 },
      { name: 'Прочее', value: 500000, percent: 3.2 },
    ],
    sources: ['UBS Wealth Management', 'Credit Suisse', 'JPMorgan Private Bank'],
  };

  return (
    <div>
      <PortalPageHeader
        title="Капитал"
        subtitle="Консолидированная оценка активов"
        breadcrumb={[
          { label: 'Портал', href: '/p' },
          { label: 'Капитал' },
        ]}
      />
      <PNetWorth data={netWorthData} locale="ru" />
    </div>
  );
}
