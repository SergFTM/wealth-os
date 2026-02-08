'use client';

import React from 'react';
import { PortalPageHeader, PPortfolios } from '@/modules/45-portal';
import { PortfolioSummary } from '@/modules/45-portal/types';

export default function PortfoliosPage() {
  // Demo data
  const portfolios: PortfolioSummary[] = [
    {
      id: 'pf-001',
      name: 'Основной инвестиционный портфель',
      custodian: 'UBS Wealth Management',
      value: 8500000,
      allocation: [
        { assetClass: 'Акции', percent: 55, value: 4675000 },
        { assetClass: 'Облигации', percent: 25, value: 2125000 },
        { assetClass: 'Альтернативы', percent: 15, value: 1275000 },
        { assetClass: 'Кэш', percent: 5, value: 425000 },
      ],
      accountNumberMasked: '****4521',
    },
    {
      id: 'pf-002',
      name: 'Консервативный портфель',
      custodian: 'Credit Suisse',
      value: 4200000,
      allocation: [
        { assetClass: 'Облигации', percent: 60, value: 2520000 },
        { assetClass: 'Акции', percent: 25, value: 1050000 },
        { assetClass: 'Кэш', percent: 15, value: 630000 },
      ],
      accountNumberMasked: '****7832',
    },
    {
      id: 'pf-003',
      name: 'Венчурный портфель',
      custodian: 'JPMorgan Private Bank',
      value: 1800000,
      allocation: [
        { assetClass: 'Private Equity', percent: 70, value: 1260000 },
        { assetClass: 'Венчурные фонды', percent: 25, value: 450000 },
        { assetClass: 'Кэш', percent: 5, value: 90000 },
      ],
      accountNumberMasked: '****9156',
    },
    {
      id: 'pf-004',
      name: 'Семейный траст',
      custodian: 'Northern Trust',
      value: 1250000,
      allocation: [
        { assetClass: 'Диверсифицированный', percent: 85, value: 1062500 },
        { assetClass: 'Кэш', percent: 15, value: 187500 },
      ],
      accountNumberMasked: '****3289',
    },
  ];

  return (
    <div>
      <PortalPageHeader
        title="Портфели"
        subtitle="Ваши инвестиционные счета"
        breadcrumb={[
          { label: 'Портал', href: '/p' },
          { label: 'Портфели' },
        ]}
      />
      <PPortfolios portfolios={portfolios} locale="ru" />
    </div>
  );
}
