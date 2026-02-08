'use client';

import React from 'react';
import { useCollection } from '@/lib/hooks';
import { PortalPageHeader, PGovernance } from '@/modules/45-portal';
import { PortalMinutes } from '@/modules/45-portal/types';

export default function GovernancePage() {
  const { data: minutesData } = useCollection('ptPortalMinutes');

  // Demo fallback data
  const minutes: PortalMinutes[] = minutesData?.length ? (minutesData as unknown as PortalMinutes[]) : [
    {
      id: 'min-001',
      meetingTitle: 'Семейный совет — Q4 2025',
      meetingDate: '2025-12-15T14:00:00Z',
      summary: 'Обсуждены результаты инвестиционной деятельности за 2025 год. Портфель показал доходность +12.4% при бенчмарке +10.8%. Рассмотрены благотворительные инициативы и план на 2026 год. Принято решение об увеличении аллокации в ESG-инвестиции.',
      decisions: [
        'Утвердить инвестиционную стратегию на 2026 год с увеличением доли ESG до 15%',
        'Выделить $100,000 на благотворительный фонд образования',
        'Провести аудит структуры семейного траста в Q1 2026',
        'Назначить следующее заседание на 15 марта 2026',
      ],
      publishedAt: '2025-12-18T10:00:00Z',
      clientSafePublished: true,
    },
    {
      id: 'min-002',
      meetingTitle: 'Семейный совет — Q3 2025',
      meetingDate: '2025-09-20T14:00:00Z',
      summary: 'Промежуточный обзор года. Обсуждены изменения в налоговом законодательстве и их влияние на структуру активов. Рассмотрен вопрос приобретения недвижимости в Швейцарии.',
      decisions: [
        'Поручить налоговым консультантам подготовить анализ новых налоговых правил',
        'Продолжить мониторинг рынка недвижимости в Швейцарии',
        'Утвердить бюджет на обучение следующего поколения',
      ],
      publishedAt: '2025-09-25T10:00:00Z',
      clientSafePublished: true,
    },
    {
      id: 'min-003',
      meetingTitle: 'Семейный совет — Q2 2025',
      meetingDate: '2025-06-18T14:00:00Z',
      summary: 'Обзор первого полугодия. Обсуждена диверсификация в альтернативные инвестиции. Представлен отчёт о деятельности семейного фонда.',
      decisions: [
        'Увеличить аллокацию в private equity на 5%',
        'Утвердить грантовую программу семейного фонда на 2025-2026',
        'Инициировать процесс обновления завещательных документов',
      ],
      publishedAt: '2025-06-22T10:00:00Z',
      clientSafePublished: true,
    },
    {
      id: 'min-004',
      meetingTitle: 'Семейный совет — Q1 2025',
      meetingDate: '2025-03-15T14:00:00Z',
      summary: 'Годовое планирование. Утверждён инвестиционный план на 2025 год. Рассмотрены вопросы преемственности и обучения младшего поколения.',
      decisions: [
        'Утвердить инвестиционную политику на 2025 год',
        'Начать программу финансового обучения для детей',
        'Провести ревизию страхового покрытия',
      ],
      publishedAt: '2025-03-20T10:00:00Z',
      clientSafePublished: true,
    },
  ];

  const handleExportPdf = (item: PortalMinutes) => {
    console.log('Exporting PDF:', item.meetingTitle);
    // In production: trigger PDF export via module 37
  };

  return (
    <div>
      <PortalPageHeader
        title="Governance"
        subtitle="Протоколы заседаний семейного совета"
        breadcrumb={[
          { label: 'Портал', href: '/p' },
          { label: 'Governance' },
        ]}
      />
      <PGovernance
        minutes={minutes}
        locale="ru"
        onExportPdf={handleExportPdf}
      />
    </div>
  );
}
