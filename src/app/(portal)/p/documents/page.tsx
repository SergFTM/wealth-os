'use client';

import React from 'react';
import { useCollection } from '@/lib/hooks';
import { PortalPageHeader, PDocuments } from '@/modules/45-portal';
import { PortalDocument, PortalDocTypeKey } from '@/modules/45-portal/types';

export default function DocumentsPage() {
  const { data: documentsData } = useCollection('ptPortalDocuments');

  // Demo fallback data
  const documents: PortalDocument[] = documentsData?.length ? (documentsData as unknown as PortalDocument[]) : [
    {
      id: 'doc-001',
      title: 'Квартальный отчёт Q4 2025',
      type: 'report' as PortalDocTypeKey,
      tags: ['квартальный', 'инвестиции', '2025'],
      publishedAt: '2026-01-15T10:00:00Z',
      publishedBy: 'УК "Альфа Капитал"',
      fileUrl: '/files/q4-2025-report.pdf',
      fileSize: 2450000,
      clientSafePublished: true,
    },
    {
      id: 'doc-002',
      title: 'Выписка по счёту UBS - Январь 2026',
      type: 'statement' as PortalDocTypeKey,
      tags: ['выписка', 'UBS', 'январь'],
      publishedAt: '2026-02-01T09:00:00Z',
      publishedBy: 'UBS Wealth Management',
      fileUrl: '/files/ubs-statement-jan-2026.pdf',
      fileSize: 850000,
      clientSafePublished: true,
    },
    {
      id: 'doc-003',
      title: 'Договор доверительного управления',
      type: 'contract' as PortalDocTypeKey,
      tags: ['договор', 'ДУ', 'подписан'],
      publishedAt: '2025-06-10T14:00:00Z',
      publishedBy: 'Юридический отдел',
      fileUrl: '/files/trust-agreement.pdf',
      fileSize: 1200000,
      clientSafePublished: true,
    },
    {
      id: 'doc-004',
      title: 'Налоговая справка 2025',
      type: 'tax' as PortalDocTypeKey,
      tags: ['налоги', '2025', 'справка'],
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
      tags: ['страховка', 'КАСКО', 'авто'],
      publishedAt: '2025-11-20T16:00:00Z',
      publishedBy: 'СК "Ингосстрах"',
      fileUrl: '/files/kasko-policy.pdf',
      fileSize: 780000,
      clientSafePublished: true,
    },
    {
      id: 'doc-006',
      title: 'Протокол семейного совета - Декабрь 2025',
      type: 'minutes' as PortalDocTypeKey,
      tags: ['протокол', 'семейный совет', '2025'],
      publishedAt: '2025-12-18T12:00:00Z',
      publishedBy: 'Секретарь совета',
      fileUrl: '/files/family-council-dec-2025.pdf',
      fileSize: 320000,
      clientSafePublished: true,
    },
  ];

  const handleDownload = (doc: PortalDocument) => {
    console.log('Downloading:', doc.title);
    // In production: trigger actual download
  };

  const handleOpen = (doc: PortalDocument) => {
    console.log('Opening:', doc.title);
    // In production: open document viewer
  };

  return (
    <div>
      <PortalPageHeader
        title="Документы"
        subtitle="Ваши документы и выписки"
        breadcrumb={[
          { label: 'Портал', href: '/p' },
          { label: 'Документы' },
        ]}
      />
      <PDocuments
        documents={documents}
        locale="ru"
        onDownload={handleDownload}
        onOpen={handleOpen}
      />
    </div>
  );
}
