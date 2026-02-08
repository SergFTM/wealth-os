'use client';

import React from 'react';
import { PortalPageHeader, PPerformance } from '@/modules/45-portal';
import { PerformanceSummary } from '@/modules/45-portal/types';

export default function PerformancePage() {
  // Demo data
  const performanceData: PerformanceSummary = {
    periods: [
      { period: '1M', return: 1.2, benchmark: 0.8 },
      { period: '3M', return: 3.5, benchmark: 2.9 },
      { period: '6M', return: 5.8, benchmark: 4.7 },
      { period: 'YTD', return: 8.5, benchmark: 7.2 },
      { period: '1Y', return: 12.4, benchmark: 10.8 },
      { period: '3Y', return: 28.6, benchmark: 24.5 },
      { period: '5Y', return: 45.2, benchmark: 38.9 },
      { period: 'SI', return: 62.8, benchmark: 52.4 },
    ],
    asOfDate: new Date().toISOString(),
    benchmarkName: 'MSCI World Index',
  };

  return (
    <div>
      <PortalPageHeader
        title="Доходность"
        subtitle="Результаты вашего портфеля"
        breadcrumb={[
          { label: 'Портал', href: '/p' },
          { label: 'Доходность' },
        ]}
      />
      <PPerformance data={performanceData} locale="ru" />
    </div>
  );
}
