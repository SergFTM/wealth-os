'use client';

import React from 'react';
import { PortalPageHeader, PLiquidity } from '@/modules/45-portal';
import { LiquiditySummary } from '@/modules/45-portal/types';

export default function LiquidityPage() {
  // Demo data
  const liquidityData: LiquiditySummary = {
    cashToday: 1250000,
    cashForecast30d: 1180000,
    cashForecast90d: 1050000,
    inflows30d: 85000,
    outflows30d: 155000,
    alerts: [
      {
        type: 'info',
        message: 'Ожидается выплата дивидендов 15 февраля: $25,000',
      },
      {
        type: 'warning',
        message: 'Запланирован платёж по налогам 28 февраля: $85,000',
      },
    ],
    asOfDate: new Date().toISOString(),
  };

  return (
    <div>
      <PortalPageHeader
        title="Ликвидность"
        subtitle="Денежные средства и прогноз"
        breadcrumb={[
          { label: 'Портал', href: '/p' },
          { label: 'Ликвидность' },
        ]}
      />
      <PLiquidity data={liquidityData} locale="ru" />
    </div>
  );
}
