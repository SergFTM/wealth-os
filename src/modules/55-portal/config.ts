import { ModuleConfig } from '../types';

export const clientPortalSafeConfig: ModuleConfig = {
  id: '55',
  slug: 'client-portal',
  order: 55,
  icon: 'portal',
  color: 'emerald',
  enabled: true,

  title: {
    ru: 'Клиентский портал',
    en: 'Client Portal',
    uk: 'Клієнтський портал'
  },

  description: {
    ru: 'Отдельный client-safe контур для владельца и семьи: net worth, отчёты, документы, пакеты, коммуникации, запросы',
    en: 'Dedicated client-safe portal for owner and family: net worth, reports, documents, packs, communications, requests',
    uk: 'Окремий client-safe контур для власника та родини: net worth, звіти, документи, пакети, комунікації, запити'
  },

  disclaimer: {
    ru: 'Портал предоставляет client-safe данные. AI выводы информационные и требуют проверки. Не является налоговой или юридической консультацией.',
    en: 'Portal provides client-safe data. AI outputs are informational and require verification. Not tax or legal advice.',
    uk: 'Портал надає client-safe дані. AI висновки інформаційні та потребують перевірки. Не є податковою або юридичною консультацією.'
  },

  kpis: [
    { key: 'portalUsers', title: { ru: 'Пользователей', en: 'Portal Users', uk: 'Користувачів' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'activeSessions', title: { ru: 'Сессий', en: 'Sessions', uk: 'Сесій' }, format: 'number', status: 'ok' },
    { key: 'viewsToday', title: { ru: 'Просмотров сегодня', en: 'Views Today', uk: 'Переглядів сьогодні' }, format: 'number', status: 'info' },
    { key: 'openRequests', title: { ru: 'Открытые запросы', en: 'Open Requests', uk: 'Відкриті запити' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'publishedDocs', title: { ru: 'Документов', en: 'Published Docs', uk: 'Документів' }, format: 'number', status: 'ok' },
    { key: 'publishedPacks', title: { ru: 'Пакетов', en: 'Published Packs', uk: 'Пакетів' }, format: 'number', status: 'ok' },
    { key: 'announcements', title: { ru: 'Объявлений', en: 'Announcements', uk: 'Оголошень' }, format: 'number', status: 'info' },
    { key: 'downloads30d', title: { ru: 'Скачиваний 30д', en: 'Downloads 30d', uk: 'Завантажень 30д' }, format: 'number', status: 'ok' }
  ],

  columns: [
    { key: 'displayName', header: { ru: 'Имя', en: 'Name', uk: 'Ім\'я' } },
    { key: 'email', header: { ru: 'Email', en: 'Email', uk: 'Email' } },
    { key: 'householdId', header: { ru: 'Household', en: 'Household', uk: 'Household' } },
    { key: 'lastSeenAt', header: { ru: 'Последний вход', en: 'Last Seen', uk: 'Останній вхід' }, type: 'date' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' }
  ],

  actions: [
    { key: 'openPortal', label: { ru: 'Открыть портал', en: 'Open Portal', uk: 'Відкрити портал' }, icon: 'portal', variant: 'primary' },
    { key: 'manageUsers', label: { ru: 'Пользователи', en: 'Manage Users', uk: 'Користувачі' }, icon: 'users', variant: 'secondary' },
    { key: 'manageAnnouncements', label: { ru: 'Объявления', en: 'Announcements', uk: 'Оголошення' }, icon: 'bell', variant: 'secondary' }
  ],

  collections: [
    'portalUsers',
    'portalSessions',
    'portalViews',
    'portalRequests',
    'portalAnnouncements'
  ],

  routes: {
    dashboard: '/m/client-portal',
    portal: '/portal',
    portalHome: '/portal',
    portalNetWorth: '/portal/net-worth',
    portalPerformance: '/portal/performance',
    portalDocuments: '/portal/documents',
    portalPacks: '/portal/packs',
    portalOwnership: '/portal/ownership',
    portalPhilanthropy: '/portal/philanthropy',
    portalRelationships: '/portal/relationships',
    portalRequests: '/portal/requests',
    portalConsent: '/portal/consent',
    portalMessages: '/portal/messages',
    portalAudit: '/portal/audit'
  },

  tabs: [
    { key: 'users', label: { ru: 'Пользователи', en: 'Users', uk: 'Користувачі' } },
    { key: 'requests', label: { ru: 'Запросы', en: 'Requests', uk: 'Запити' } },
    { key: 'announcements', label: { ru: 'Объявления', en: 'Announcements', uk: 'Оголошення' } },
    { key: 'audit', label: { ru: 'Аудит просмотров', en: 'View Audit', uk: 'Аудит переглядів' } }
  ],

  adminOnly: false,
  clientSafeHidden: true
};

export const REQUEST_CATEGORIES = {
  documents: { ru: 'Документы', en: 'Documents', uk: 'Документи', color: 'blue' },
  payments: { ru: 'Платежи', en: 'Payments', uk: 'Платежі', color: 'emerald' },
  reporting: { ru: 'Отчётность', en: 'Reporting', uk: 'Звітність', color: 'purple' },
  tax: { ru: 'Налоги', en: 'Tax', uk: 'Податки', color: 'amber' },
  trust: { ru: 'Трасты', en: 'Trust', uk: 'Трасти', color: 'teal' },
  other: { ru: 'Другое', en: 'Other', uk: 'Інше', color: 'stone' }
};

export const REQUEST_URGENCY = {
  low: { ru: 'Низкая', en: 'Low', uk: 'Низька', color: 'stone' },
  medium: { ru: 'Средняя', en: 'Medium', uk: 'Середня', color: 'amber' },
  high: { ru: 'Высокая', en: 'High', uk: 'Висока', color: 'red' }
};

export const REQUEST_STATUSES = {
  open: { ru: 'Открыт', en: 'Open', uk: 'Відкритий', color: 'blue' },
  in_progress: { ru: 'В работе', en: 'In Progress', uk: 'В роботі', color: 'amber' },
  resolved: { ru: 'Решён', en: 'Resolved', uk: 'Вирішено', color: 'green' }
};

export const PORTAL_DISCLAIMERS = {
  ai: { ru: 'Выводы информационные и требуют проверки человеком', en: 'Outputs are informational and require human verification', uk: 'Висновки інформаційні та потребують перевірки людиною' },
  tax: { ru: 'Не является налоговой консультацией', en: 'Not tax advice', uk: 'Не є податковою консультацією' },
  trust: { ru: 'Не является юридической консультацией', en: 'Not legal advice', uk: 'Не є юридичною консультацією' }
};

export default clientPortalSafeConfig;
