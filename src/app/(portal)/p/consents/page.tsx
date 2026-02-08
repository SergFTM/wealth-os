'use client';

import React from 'react';
import { useCollection } from '@/lib/hooks';
import { PortalPageHeader, PConsents } from '@/modules/45-portal';
import { PortalConsent, ConsentScopeKey } from '@/modules/45-portal/types';

export default function ConsentsPage() {
  const { data: consentsData } = useCollection('ptPortalConsents');

  // Demo fallback data
  const consents: PortalConsent[] = consentsData?.length ? (consentsData as unknown as PortalConsent[]) : [
    {
      id: 'consent-001',
      advisorName: 'Михаил Петров',
      advisorOrg: 'Альфа Капитал',
      scopes: ['view_networth', 'view_portfolios', 'view_performance', 'view_documents', 'communicate'] as ConsentScopeKey[],
      grantedAt: '2024-01-15T10:00:00Z',
      expiresAt: '2027-01-15T10:00:00Z',
      status: 'active',
    },
    {
      id: 'consent-002',
      advisorName: 'Елена Сидорова',
      advisorOrg: 'Налоговые консультанты',
      scopes: ['view_documents', 'communicate'] as ConsentScopeKey[],
      grantedAt: '2024-06-01T10:00:00Z',
      expiresAt: '2026-06-01T10:00:00Z',
      status: 'active',
    },
    {
      id: 'consent-003',
      advisorName: 'Анна Козлова',
      advisorOrg: 'Альфа Капитал',
      scopes: ['view_networth', 'view_portfolios', 'view_performance', 'view_liquidity'] as ConsentScopeKey[],
      grantedAt: '2025-03-10T10:00:00Z',
      status: 'active',
    },
    {
      id: 'consent-004',
      advisorName: 'Ольга Николаева',
      advisorOrg: 'Family Office',
      scopes: ['view_documents', 'manage_requests', 'communicate'] as ConsentScopeKey[],
      grantedAt: '2024-09-01T10:00:00Z',
      status: 'active',
    },
    {
      id: 'consent-005',
      advisorName: 'Игорь Смирнов',
      advisorOrg: 'Юридическая фирма "Правовед"',
      scopes: ['view_documents'] as ConsentScopeKey[],
      grantedAt: '2023-05-15T10:00:00Z',
      expiresAt: '2024-05-15T10:00:00Z',
      status: 'expired',
    },
    {
      id: 'consent-006',
      advisorName: 'Сергей Волков',
      advisorOrg: 'Бывший консультант',
      scopes: ['view_networth', 'view_portfolios'] as ConsentScopeKey[],
      grantedAt: '2023-01-10T10:00:00Z',
      status: 'revoked',
    },
  ];

  const handleRevoke = async (consentId: string) => {
    console.log('Revoking consent:', consentId);
    // In production: POST to API to revoke consent
  };

  return (
    <div>
      <PortalPageHeader
        title="Доступы"
        subtitle="Управление доступом консультантов"
        breadcrumb={[
          { label: 'Портал', href: '/p' },
          { label: 'Доступы' },
        ]}
      />
      <PConsents
        consents={consents}
        locale="ru"
        onRevoke={handleRevoke}
      />
    </div>
  );
}
