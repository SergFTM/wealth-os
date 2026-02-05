import { ModuleConfig } from '../types';

export const commsConfig: ModuleConfig = {
  id: '19',
  slug: 'comms',
  order: 19,
  icon: 'message-square',
  title: { ru: 'Коммуникации', en: 'Communications', uk: 'Комунікації' },
  description: {
    ru: 'Защищенные коммуникации: треды, сообщения, SLA, client-safe режим',
    en: 'Secure communications: threads, messages, SLA, client-safe mode',
    uk: 'Захищені комунікації: треди, повідомлення, SLA, client-safe режим',
  },
  disclaimer: {
    ru: 'Коммуникации внутри платформы являются защищенными, но требуют соблюдения политик доступа',
    en: 'Communications within the platform are secure but require compliance with access policies',
    uk: 'Комунікації всередині платформи є захищеними, але потребують дотримання політик доступу',
  },
  kpis: [
    { key: 'unreadThreads', title: { ru: 'Непрочитанные', en: 'Unread', uk: 'Непрочитані' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'requestsPending', title: { ru: 'Запросы открыты', en: 'Requests Pending', uk: 'Запити відкриті' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'approvalDiscussions', title: { ru: 'Обсуждения approval', en: 'Approval Discussions', uk: 'Обговорення approval' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'slaAtRisk', title: { ru: 'SLA под угрозой', en: 'SLA at Risk', uk: 'SLA під загрозою' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'slaOverdue', title: { ru: 'SLA просрочено', en: 'SLA Overdue', uk: 'SLA прострочено' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'pinnedThreads', title: { ru: 'Закрепленные', en: 'Pinned', uk: 'Закріплені' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'clientVisibleThreads', title: { ru: 'Видимы клиенту', en: 'Client Visible', uk: 'Видимі клієнту' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'archivedThreads', title: { ru: 'Архив', en: 'Archived', uk: 'Архів' }, format: 'number', status: 'ok', linkToList: true },
  ],
  columns: [
    { key: 'title', header: { ru: 'Тема', en: 'Subject', uk: 'Тема' } },
    { key: 'threadType', header: { ru: 'Тип', en: 'Type', uk: 'Тип' }, type: 'badge' },
    { key: 'scopeType', header: { ru: 'Scope', en: 'Scope', uk: 'Scope' } },
    { key: 'participantsCount', header: { ru: 'Участники', en: 'Participants', uk: 'Учасники' } },
    { key: 'lastMessageAt', header: { ru: 'Последнее', en: 'Last Message', uk: 'Останнє' }, type: 'date' },
    { key: 'unreadCount', header: { ru: 'Непрочит.', en: 'Unread', uk: 'Непрочит.' } },
    { key: 'slaStatus', header: { ru: 'SLA', en: 'SLA', uk: 'SLA' }, type: 'status' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
  ],
  actions: [
    { key: 'createThread', label: { ru: 'Новый тред', en: 'New Thread', uk: 'Новий тред' }, variant: 'primary' },
    { key: 'createRequest', label: { ru: 'Новый запрос', en: 'New Request', uk: 'Новий запит' }, variant: 'secondary' },
    { key: 'createApprovalThread', label: { ru: 'Тред для approval', en: 'Approval Thread', uk: 'Тред для approval' }, variant: 'secondary' },
    { key: 'addParticipants', label: { ru: 'Добавить участников', en: 'Add Participants', uk: 'Додати учасників' }, variant: 'ghost' },
    { key: 'archiveSelected', label: { ru: 'Архивировать', en: 'Archive', uk: 'Архівувати' }, variant: 'ghost' },
    { key: 'exportThreads', label: { ru: 'Экспорт', en: 'Export', uk: 'Експорт' }, variant: 'ghost' },
  ],
};
