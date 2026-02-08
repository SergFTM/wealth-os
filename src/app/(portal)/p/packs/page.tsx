'use client';

import React from 'react';
import { useCollection } from '@/lib/hooks';
import { PortalPageHeader, PPacks } from '@/modules/45-portal';
import { PortalPack, PortalDocument, PortalDocTypeKey } from '@/modules/45-portal/types';

export default function PacksPage() {
  const { data: packsData } = useCollection('ptPortalPacks');
  const { data: documentsData } = useCollection('ptPortalDocuments');

  // Demo fallback data
  const packs: PortalPack[] = packsData?.length ? (packsData as unknown as PortalPack[]) : [
    {
      id: 'pack-001',
      title: 'Годовой пакет отчётности 2025',
      description: 'Полный комплект документов по итогам 2025 года: инвестиционные отчёты, налоговые справки, выписки.',
      documentIds: ['doc-001', 'doc-004'],
      documentCount: 8,
      createdAt: '2026-01-20T10:00:00Z',
      expiresAt: '2026-07-20T10:00:00Z',
    },
    {
      id: 'pack-002',
      title: 'Квартальный обзор Q4 2025',
      description: 'Аналитика и результаты портфеля за четвёртый квартал.',
      documentIds: ['doc-001'],
      documentCount: 4,
      createdAt: '2026-01-15T14:00:00Z',
      expiresAt: '2026-04-15T14:00:00Z',
    },
    {
      id: 'pack-003',
      title: 'Страховые документы',
      description: 'Действующие страховые полисы и сертификаты.',
      documentIds: ['doc-005'],
      documentCount: 5,
      createdAt: '2025-11-20T16:00:00Z',
    },
    {
      id: 'pack-004',
      title: 'Протоколы семейного совета 2025',
      description: 'Все протоколы заседаний семейного совета за 2025 год.',
      documentIds: ['doc-006'],
      documentCount: 4,
      createdAt: '2025-12-31T18:00:00Z',
    },
  ];

  const documents: PortalDocument[] = documentsData?.length ? (documentsData as unknown as PortalDocument[]) : [
    {
      id: 'doc-001',
      title: 'Квартальный отчёт Q4 2025',
      type: 'report' as PortalDocTypeKey,
      tags: ['квартальный', 'инвестиции'],
      publishedAt: '2026-01-15T10:00:00Z',
      publishedBy: 'УК "Альфа Капитал"',
      fileUrl: '/files/q4-2025-report.pdf',
      fileSize: 2450000,
      clientSafePublished: true,
    },
    {
      id: 'doc-004',
      title: 'Налоговая справка 2025',
      type: 'tax' as PortalDocTypeKey,
      tags: ['налоги', '2025'],
      publishedAt: '2026-01-25T11:00:00Z',
      publishedBy: 'Налоговый консультант',
      fileUrl: '/files/tax-certificate-2025.pdf',
      fileSize: 450000,
      clientSafePublished: true,
    },
    {
      id: 'doc-005',
      title: 'Страховой полис КАСКО',
      type: 'policy' as PortalDocTypeKey,
      tags: ['страховка', 'КАСКО'],
      publishedAt: '2025-11-20T16:00:00Z',
      publishedBy: 'СК "Ингосстрах"',
      fileUrl: '/files/kasko-policy.pdf',
      fileSize: 780000,
      clientSafePublished: true,
    },
    {
      id: 'doc-006',
      title: 'Протокол семейного совета',
      type: 'minutes' as PortalDocTypeKey,
      tags: ['протокол', 'семейный совет'],
      publishedAt: '2025-12-18T12:00:00Z',
      publishedBy: 'Секретарь совета',
      fileUrl: '/files/family-council-dec-2025.pdf',
      fileSize: 320000,
      clientSafePublished: true,
    },
  ];

  const handleDownloadPack = (pack: PortalPack) => {
    console.log('Downloading pack:', pack.title);
    // In production: trigger zip download of all documents
  };

  return (
    <div>
      <PortalPageHeader
        title="Пакеты отчётов"
        subtitle="Подготовленные комплекты документов"
        breadcrumb={[
          { label: 'Портал', href: '/p' },
          { label: 'Пакеты' },
        ]}
      />
      <PPacks
        packs={packs}
        documents={documents}
        locale="ru"
        onDownloadPack={handleDownloadPack}
      />
    </div>
  );
}
