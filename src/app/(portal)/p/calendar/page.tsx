'use client';

import React from 'react';
import { useCollection } from '@/lib/hooks';
import { PortalPageHeader, PCalendar } from '@/modules/45-portal';
import { PortalEvent } from '@/modules/45-portal/types';

export default function CalendarPage() {
  const { data: eventsData } = useCollection('ptPortalEvents');

  // Demo fallback data - events relative to current date
  const today = new Date();
  const addDays = (days: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  const events: PortalEvent[] = eventsData?.length ? (eventsData as unknown as PortalEvent[]) : [
    {
      id: 'evt-001',
      title: 'Квартальный обзор портфеля',
      date: addDays(0), // today
      time: '15:00',
      location: 'Zoom',
      description: 'Обсуждение результатов Q4 2025 и планов на Q1 2026.',
      type: 'meeting',
      clientSafeVisible: true,
    },
    {
      id: 'evt-002',
      title: 'Звонок с налоговым консультантом',
      date: addDays(1), // tomorrow
      time: '11:00',
      location: 'Телефон',
      description: 'Обсуждение налоговой декларации 2025.',
      type: 'call',
      clientSafeVisible: true,
    },
    {
      id: 'evt-003',
      title: 'Дедлайн: Подача заявки на визу',
      date: addDays(3),
      description: 'Последний день подачи документов на визу E-2.',
      type: 'deadline',
      clientSafeVisible: true,
    },
    {
      id: 'evt-004',
      title: 'Семейный совет',
      date: addDays(9),
      time: '14:00',
      location: 'Офис Family Office',
      description: 'Ежеквартальное заседание семейного совета. Повестка: инвестиционная стратегия, благотворительность.',
      type: 'meeting',
      clientSafeVisible: true,
    },
    {
      id: 'evt-005',
      title: 'Обзор недвижимости',
      date: addDays(5),
      time: '10:00',
      location: 'MS Teams',
      description: 'Анализ портфеля недвижимости и обсуждение новых возможностей.',
      type: 'review',
      clientSafeVisible: true,
    },
    {
      id: 'evt-006',
      title: 'Встреча с банкиром',
      date: addDays(14),
      time: '12:00',
      location: 'UBS Office, Zurich',
      description: 'Личная встреча с персональным банкиром для обсуждения новых продуктов.',
      type: 'meeting',
      clientSafeVisible: true,
    },
    {
      id: 'evt-007',
      title: 'Годовой отчёт по трастам',
      date: addDays(21),
      time: '16:00',
      location: 'Zoom',
      description: 'Презентация годового отчёта по семейным трастам.',
      type: 'review',
      clientSafeVisible: true,
    },
    {
      id: 'evt-008',
      title: 'Дедлайн: Налоговая декларация',
      date: addDays(45),
      description: 'Крайний срок подачи налоговой декларации за 2025 год.',
      type: 'deadline',
      clientSafeVisible: true,
    },
  ];

  return (
    <div>
      <PortalPageHeader
        title="Календарь"
        subtitle="Предстоящие события и встречи"
        breadcrumb={[
          { label: 'Портал', href: '/p' },
          { label: 'Календарь' },
        ]}
      />
      <PCalendar events={events} locale="ru" />
    </div>
  );
}
