'use client';

import React from 'react';
import { useCollection } from '@/lib/hooks';
import { PortalPageHeader, PRequests } from '@/modules/45-portal';
import { PortalRequest, RequestCategoryKey, RequestStatusKey } from '@/modules/45-portal/types';

export default function RequestsPage() {
  const { data: requestsData } = useCollection('ptPortalRequests');

  // Demo fallback data
  const requests: PortalRequest[] = requestsData?.length ? (requestsData as unknown as PortalRequest[]) : [
    {
      id: 'req-001',
      number: 'REQ-2026-0142',
      category: 'documents' as RequestCategoryKey,
      subject: 'Запрос выписки по счёту за декабрь',
      description: 'Прошу предоставить детализированную выписку по инвестиционному счёту за декабрь 2025 года.',
      status: 'in_progress' as RequestStatusKey,
      clientSafeUpdates: [
        '[05.02.2026] Запрос принят в работу',
        '[05.02.2026] Документ формируется, ожидайте готовности в течение 2 рабочих дней',
      ],
      attachmentIds: [],
      createdAt: '2026-02-04T10:30:00Z',
      updatedAt: '2026-02-05T14:00:00Z',
    },
    {
      id: 'req-002',
      number: 'REQ-2026-0138',
      category: 'transactions' as RequestCategoryKey,
      subject: 'Перевод между счетами',
      description: 'Прошу осуществить перевод $50,000 с инвестиционного счёта UBS на текущий счёт.',
      status: 'awaiting_client' as RequestStatusKey,
      clientSafeUpdates: [
        '[03.02.2026] Запрос принят',
        '[04.02.2026] Требуется подтверждение операции. Пожалуйста, подтвердите перевод в приложении банка.',
      ],
      attachmentIds: [],
      createdAt: '2026-02-03T09:15:00Z',
      updatedAt: '2026-02-04T11:00:00Z',
    },
    {
      id: 'req-003',
      number: 'REQ-2026-0125',
      category: 'tax' as RequestCategoryKey,
      subject: 'Подготовка налоговой декларации',
      description: 'Прошу подготовить материалы для налоговой декларации за 2025 год.',
      status: 'closed' as RequestStatusKey,
      clientSafeUpdates: [
        '[25.01.2026] Запрос принят',
        '[28.01.2026] Документы собраны и направлены налоговому консультанту',
        '[01.02.2026] Декларация подготовлена и отправлена вам на email',
      ],
      attachmentIds: ['doc-004'],
      createdAt: '2026-01-25T14:00:00Z',
      updatedAt: '2026-02-01T16:00:00Z',
    },
    {
      id: 'req-004',
      number: 'REQ-2026-0118',
      category: 'reporting' as RequestCategoryKey,
      subject: 'Консолидированный отчёт по всем портфелям',
      description: 'Прошу подготовить консолидированный отчёт по всем инвестиционным портфелям с разбивкой по классам активов.',
      status: 'open' as RequestStatusKey,
      clientSafeUpdates: [
        '[06.02.2026] Запрос зарегистрирован',
      ],
      attachmentIds: [],
      createdAt: '2026-02-06T08:00:00Z',
      updatedAt: '2026-02-06T08:00:00Z',
    },
  ];

  const handleCreateRequest = async (data: { category: RequestCategoryKey; subject: string; description: string }) => {
    const newRequest: PortalRequest = {
      id: `req-${Date.now()}`,
      number: `REQ-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      category: data.category,
      subject: data.subject,
      description: data.description,
      status: 'open',
      clientSafeUpdates: [
        `[${new Date().toLocaleDateString('ru-RU')}] Запрос создан`,
      ],
      attachmentIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In production: POST to API
    console.log('Creating request:', newRequest);
  };

  return (
    <div>
      <PortalPageHeader
        title="Запросы"
        subtitle="Ваши обращения и их статус"
        breadcrumb={[
          { label: 'Портал', href: '/p' },
          { label: 'Запросы' },
        ]}
      />
      <PRequests
        requests={requests}
        locale="ru"
        onCreateRequest={handleCreateRequest}
      />
    </div>
  );
}
