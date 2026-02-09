/**
 * Module 28: Investment Committee and Decisions Log
 * Управление комитетскими решениями, голосованиями и протоколами
 */

import { ModuleConfig } from '../types';

export const committeeConfig: ModuleConfig = {
  id: 'committee',
  slug: 'committee',
  title: { ru: 'Комитет', en: 'Committee', uk: 'Комітет' },
  description: {
    ru: 'Инвестиционный комитет, решения и журнал решений',
    en: 'Investment Committee and Decisions Log',
    uk: 'Інвестиційний комітет, рішення та журнал рішень',
  },
  icon: 'people',
  color: 'emerald',
  order: 28,
  enabled: true,
  collections: [
    'committeeMeetings',
    'committeeAgendaItems',
    'committeeDecisions',
    'committeeVotes',
    'committeeFollowUps',
    'committeeTemplates',
  ],
  routes: {
    dashboard: '/m/committee',
    list: '/m/committee/list',
    meetingDetail: '/m/committee/meeting/[id]',
    itemDetail: '/m/committee/item/[id]',
    decisionDetail: '/m/committee/decision/[id]',
  },
  tabs: [
    { key: 'meetings', label: { ru: 'Заседания', en: 'Meetings', uk: 'Засідання' } },
    { key: 'agenda', label: { ru: 'Повестка', en: 'Agenda', uk: 'Порядок денний' } },
    { key: 'decisions', label: { ru: 'Решения', en: 'Decisions', uk: 'Рішення' } },
    { key: 'votes', label: { ru: 'Голоса', en: 'Votes', uk: 'Голоси' } },
    { key: 'followups', label: { ru: 'Исполнение', en: 'Follow-ups', uk: 'Виконання' } },
    { key: 'templates', label: { ru: 'Шаблоны', en: 'Templates', uk: 'Шаблони' } },
    { key: 'audit', label: { ru: 'Аудит', en: 'Audit', uk: 'Аудит' } },
  ],
  disclaimer: {
    ru: 'Решения комитета фиксируются для отчетности. Не является индивидуальной инвестиционной рекомендацией',
    en: 'Committee decisions are recorded for reporting purposes. Not individual investment advice',
    uk: 'Рішення комітету фіксуються для звітності. Не є індивідуальною інвестиційною рекомендацією',
  },
};

export const CM_MEETING_STATUS = {
  scheduled: { label: { ru: 'Запланировано', en: 'Scheduled', uk: 'Заплановано' }, color: 'blue' },
  in_progress: { label: { ru: 'Проходит', en: 'In Progress', uk: 'Проходить' }, color: 'amber' },
  closed: { label: { ru: 'Закрыто', en: 'Closed', uk: 'Закрито' }, color: 'gray' },
} as const;

export type CmMeetingStatus = keyof typeof CM_MEETING_STATUS;

export const CM_MINUTES_STATUS = {
  draft: { label: { ru: 'Черновик', en: 'Draft', uk: 'Чернетка' }, color: 'gray' },
  published: { label: { ru: 'Опубликовано', en: 'Published', uk: 'Опубліковано' }, color: 'emerald' },
} as const;

export type CmMinutesStatus = keyof typeof CM_MINUTES_STATUS;

export const CM_AGENDA_CATEGORY = {
  allocation: { label: { ru: 'Аллокация', en: 'Allocation', uk: 'Алокація' }, icon: '📊' },
  risk: { label: { ru: 'Риски', en: 'Risk', uk: 'Ризики' }, icon: '⚠️' },
  ips_waiver: { label: { ru: 'IPS исключение', en: 'IPS Waiver', uk: 'IPS виняток' }, icon: '📜' },
  manager_selection: { label: { ru: 'Выбор менеджера', en: 'Manager Selection', uk: 'Вибір менеджера' }, icon: '👤' },
  liquidity: { label: { ru: 'Ликвидность', en: 'Liquidity', uk: 'Ліквідність' }, icon: '💧' },
  rebalancing: { label: { ru: 'Ребалансировка', en: 'Rebalancing', uk: 'Ребалансування' }, icon: '⚖️' },
  other: { label: { ru: 'Другое', en: 'Other', uk: 'Інше' }, icon: '📋' },
} as const;

export type CmAgendaCategory = keyof typeof CM_AGENDA_CATEGORY;

export const CM_AGENDA_STATUS = {
  draft: { label: { ru: 'Черновик', en: 'Draft', uk: 'Чернетка' }, color: 'gray' },
  pending: { label: { ru: 'Ожидает', en: 'Pending', uk: 'Очікує' }, color: 'amber' },
  approved: { label: { ru: 'Одобрено', en: 'Approved', uk: 'Схвалено' }, color: 'emerald' },
  rejected: { label: { ru: 'Отклонено', en: 'Rejected', uk: 'Відхилено' }, color: 'red' },
} as const;

export type CmAgendaStatus = keyof typeof CM_AGENDA_STATUS;

export const CM_DECISION_RESULT = {
  approved: { label: { ru: 'Одобрено', en: 'Approved', uk: 'Схвалено' }, color: 'emerald' },
  rejected: { label: { ru: 'Отклонено', en: 'Rejected', uk: 'Відхилено' }, color: 'red' },
  waived: { label: { ru: 'Исключение', en: 'Waived', uk: 'Виняток' }, color: 'amber' },
  deferred: { label: { ru: 'Отложено', en: 'Deferred', uk: 'Відкладено' }, color: 'blue' },
} as const;

export type CmDecisionResult = keyof typeof CM_DECISION_RESULT;

export const CM_DECISION_STATUS = {
  open: { label: { ru: 'Открыто', en: 'Open', uk: 'Відкрито' }, color: 'blue' },
  in_progress: { label: { ru: 'В работе', en: 'In Progress', uk: 'В роботі' }, color: 'amber' },
  done: { label: { ru: 'Выполнено', en: 'Done', uk: 'Виконано' }, color: 'emerald' },
} as const;

export type CmDecisionStatus = keyof typeof CM_DECISION_STATUS;

export const CM_VOTE_STATUS = {
  open: { label: { ru: 'Открыто', en: 'Open', uk: 'Відкрито' }, color: 'blue' },
  closed: { label: { ru: 'Закрыто', en: 'Closed', uk: 'Закрито' }, color: 'gray' },
} as const;

export type CmVoteStatus = keyof typeof CM_VOTE_STATUS;

export const CM_VOTE_CHOICE = {
  for: { label: { ru: 'За', en: 'For', uk: 'За' }, color: 'emerald' },
  against: { label: { ru: 'Против', en: 'Against', uk: 'Проти' }, color: 'red' },
  abstain: { label: { ru: 'Воздержался', en: 'Abstain', uk: 'Утримався' }, color: 'gray' },
} as const;

export type CmVoteChoice = keyof typeof CM_VOTE_CHOICE;

export const CM_DEFAULT_QUORUM_PCT = 60;

export const CM_ROLES = {
  chair: { label: { ru: 'Председатель', en: 'Chair', uk: 'Голова' } },
  cio: { label: { ru: 'CIO', en: 'CIO', uk: 'CIO' } },
  member: { label: { ru: 'Член комитета', en: 'Member', uk: 'Член комітету' } },
  secretary: { label: { ru: 'Секретарь', en: 'Secretary', uk: 'Секретар' } },
  observer: { label: { ru: 'Наблюдатель', en: 'Observer', uk: 'Спостерігач' } },
} as const;

export type CmRole = keyof typeof CM_ROLES;

export default committeeConfig;
