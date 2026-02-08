'use client';

import React from 'react';
import { useCollection } from '@/lib/hooks';
import { PortalPageHeader, PThreads } from '@/modules/45-portal';
import { PortalThread, PortalMessage } from '@/modules/45-portal/types';

export default function ThreadsPage() {
  const { data: threadsData } = useCollection('ptPortalThreads');

  // Demo fallback data
  const threads: PortalThread[] = threadsData?.length ? (threadsData as unknown as PortalThread[]) : [
    {
      id: 'thread-001',
      subject: 'Обсуждение инвестиционной стратегии на 2026',
      type: 'general',
      participantNames: ['Михаил Петров (Советник)', 'Анна Козлова (Аналитик)'],
      lastMessageAt: '2026-02-05T16:30:00Z',
      unreadCount: 2,
      messages: [
        {
          id: 'msg-001',
          senderName: 'Михаил Петров',
          senderRole: 'Советник',
          content: 'Добрый день! Подготовил предварительные рекомендации по корректировке портфеля на 2026 год. Основные изменения касаются увеличения доли облигаций.',
          attachmentIds: [],
          sentAt: '2026-02-04T10:00:00Z',
          isClientMessage: false,
        },
        {
          id: 'msg-002',
          senderName: 'Александр Иванов',
          senderRole: 'Клиент',
          content: 'Спасибо! Посмотрел рекомендации. Какой горизонт вы закладываете для этих изменений?',
          attachmentIds: [],
          sentAt: '2026-02-04T14:30:00Z',
          isClientMessage: true,
        },
        {
          id: 'msg-003',
          senderName: 'Михаил Петров',
          senderRole: 'Советник',
          content: 'Горизонт планирования — 12-18 месяцев. Учитывая текущую макроэкономическую ситуацию, рекомендуем постепенное ребалансирование в течение Q1-Q2.',
          attachmentIds: [],
          sentAt: '2026-02-05T09:15:00Z',
          isClientMessage: false,
        },
        {
          id: 'msg-004',
          senderName: 'Анна Козлова',
          senderRole: 'Аналитик',
          content: 'Добавлю, что наша модель показывает потенциал роста в секторе технологий. Подготовила детальный анализ.',
          attachmentIds: ['doc-analysis'],
          sentAt: '2026-02-05T16:30:00Z',
          isClientMessage: false,
        },
      ],
    },
    {
      id: 'thread-002',
      subject: 'Вопрос по налоговой оптимизации',
      type: 'request',
      participantNames: ['Елена Сидорова (Налоговый консультант)'],
      lastMessageAt: '2026-02-03T11:00:00Z',
      unreadCount: 0,
      messages: [
        {
          id: 'msg-005',
          senderName: 'Александр Иванов',
          senderRole: 'Клиент',
          content: 'Здравствуйте! Есть вопрос по налоговым последствиям продажи акций в декабре.',
          attachmentIds: [],
          sentAt: '2026-02-02T15:00:00Z',
          isClientMessage: true,
        },
        {
          id: 'msg-006',
          senderName: 'Елена Сидорова',
          senderRole: 'Налоговый консультант',
          content: 'Добрый день! Изучила ситуацию. Краткий ответ: убыток можно зачесть против прибыли от других операций в 2025 году. Подробный расчёт прилагаю.',
          attachmentIds: ['doc-tax-calc'],
          sentAt: '2026-02-03T11:00:00Z',
          isClientMessage: false,
        },
      ],
    },
    {
      id: 'thread-003',
      subject: 'Подготовка к семейному совету',
      type: 'general',
      participantNames: ['Ольга Николаева (Секретарь)'],
      lastMessageAt: '2026-01-28T14:00:00Z',
      unreadCount: 0,
      messages: [
        {
          id: 'msg-007',
          senderName: 'Ольга Николаева',
          senderRole: 'Секретарь',
          content: 'Напоминаю о предстоящем заседании семейного совета 15 февраля. Повестка дня направлена на почту.',
          attachmentIds: [],
          sentAt: '2026-01-28T14:00:00Z',
          isClientMessage: false,
        },
      ],
    },
  ];

  const handleSendMessage = async (threadId: string, content: string) => {
    console.log('Sending message to thread:', threadId, content);
    // In production: POST to API and update thread
  };

  const handleCreateThread = async (subject: string, message: string) => {
    console.log('Creating new thread:', subject, message);
    // In production: POST to API and create thread
  };

  return (
    <div>
      <PortalPageHeader
        title="Сообщения"
        subtitle="Переписка с консультантами"
        breadcrumb={[
          { label: 'Портал', href: '/p' },
          { label: 'Сообщения' },
        ]}
      />
      <PThreads
        threads={threads}
        locale="ru"
        onSendMessage={handleSendMessage}
        onCreateThread={handleCreateThread}
      />
    </div>
  );
}
