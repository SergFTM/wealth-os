// Module 45: Client Portal - Types

export type Locale = 'ru' | 'en' | 'uk';

// Portal User Role
export const PortalRole = {
  CLIENT_OWNER: 'client_owner',
  CLIENT_FAMILY: 'client_family',
  CLIENT_ADVISOR: 'client_advisor',
} as const;

export type PortalRoleKey = typeof PortalRole[keyof typeof PortalRole];

export const PortalRoleLabels: Record<PortalRoleKey, Record<string, string>> = {
  client_owner: { ru: 'Владелец', en: 'Owner', uk: 'Власник' },
  client_family: { ru: 'Член семьи', en: 'Family Member', uk: 'Член сім\'ї' },
  client_advisor: { ru: 'Консультант', en: 'Advisor', uk: 'Консультант' },
};

// Request Status
export const RequestStatus = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  AWAITING_CLIENT: 'awaiting_client',
  CLOSED: 'closed',
} as const;

export type RequestStatusKey = typeof RequestStatus[keyof typeof RequestStatus];

export const RequestStatusLabels: Record<RequestStatusKey, Record<string, string>> = {
  open: { ru: 'Открыт', en: 'Open', uk: 'Відкрито' },
  in_progress: { ru: 'В работе', en: 'In Progress', uk: 'В роботі' },
  awaiting_client: { ru: 'Ожидает вас', en: 'Awaiting You', uk: 'Очікує вас' },
  closed: { ru: 'Закрыт', en: 'Closed', uk: 'Закрито' },
};

// Request Category
export const RequestCategory = {
  GENERAL: 'general',
  DOCUMENTS: 'documents',
  TRANSACTIONS: 'transactions',
  REPORTING: 'reporting',
  GOVERNANCE: 'governance',
  COMPLIANCE: 'compliance',
  TAX: 'tax',
  LEGAL: 'legal',
  OTHER: 'other',
} as const;

export type RequestCategoryKey = typeof RequestCategory[keyof typeof RequestCategory];

export const RequestCategoryLabels: Record<RequestCategoryKey, Record<string, string>> = {
  general: { ru: 'Общий вопрос', en: 'General', uk: 'Загальне питання' },
  documents: { ru: 'Документы', en: 'Documents', uk: 'Документи' },
  transactions: { ru: 'Транзакции', en: 'Transactions', uk: 'Транзакції' },
  reporting: { ru: 'Отчётность', en: 'Reporting', uk: 'Звітність' },
  governance: { ru: 'Управление', en: 'Governance', uk: 'Управління' },
  compliance: { ru: 'Комплаенс', en: 'Compliance', uk: 'Комплаєнс' },
  tax: { ru: 'Налоги', en: 'Tax', uk: 'Податки' },
  legal: { ru: 'Юридический', en: 'Legal', uk: 'Юридичний' },
  other: { ru: 'Другое', en: 'Other', uk: 'Інше' },
};

// Document Type for Portal
export const PortalDocType = {
  REPORT: 'report',
  STATEMENT: 'statement',
  CONTRACT: 'contract',
  POLICY: 'policy',
  TAX: 'tax',
  LEGAL: 'legal',
  MINUTES: 'minutes',
  OTHER: 'other',
} as const;

export type PortalDocTypeKey = typeof PortalDocType[keyof typeof PortalDocType];

export const PortalDocTypeLabels: Record<PortalDocTypeKey, Record<string, string>> = {
  report: { ru: 'Отчёт', en: 'Report', uk: 'Звіт' },
  statement: { ru: 'Выписка', en: 'Statement', uk: 'Виписка' },
  contract: { ru: 'Договор', en: 'Contract', uk: 'Договір' },
  policy: { ru: 'Полис', en: 'Policy', uk: 'Поліс' },
  tax: { ru: 'Налоговый документ', en: 'Tax Document', uk: 'Податковий документ' },
  legal: { ru: 'Юридический документ', en: 'Legal Document', uk: 'Юридичний документ' },
  minutes: { ru: 'Протокол', en: 'Minutes', uk: 'Протокол' },
  other: { ru: 'Другое', en: 'Other', uk: 'Інше' },
};

// Thread Type
export const ThreadType = {
  GENERAL: 'general',
  REQUEST: 'request',
  URGENT: 'urgent',
} as const;

export type ThreadTypeKey = typeof ThreadType[keyof typeof ThreadType];

// Consent Scope
export const ConsentScope = {
  VIEW_NETWORTH: 'view_networth',
  VIEW_PORTFOLIOS: 'view_portfolios',
  VIEW_PERFORMANCE: 'view_performance',
  VIEW_LIQUIDITY: 'view_liquidity',
  VIEW_DOCUMENTS: 'view_documents',
  MANAGE_REQUESTS: 'manage_requests',
  COMMUNICATE: 'communicate',
} as const;

export type ConsentScopeKey = typeof ConsentScope[keyof typeof ConsentScope];

export const ConsentScopeLabels: Record<ConsentScopeKey, Record<string, string>> = {
  view_networth: { ru: 'Просмотр капитала', en: 'View Net Worth', uk: 'Перегляд капіталу' },
  view_portfolios: { ru: 'Просмотр портфелей', en: 'View Portfolios', uk: 'Перегляд портфелів' },
  view_performance: { ru: 'Просмотр доходности', en: 'View Performance', uk: 'Перегляд дохідності' },
  view_liquidity: { ru: 'Просмотр ликвидности', en: 'View Liquidity', uk: 'Перегляд ліквідності' },
  view_documents: { ru: 'Просмотр документов', en: 'View Documents', uk: 'Перегляд документів' },
  manage_requests: { ru: 'Управление запросами', en: 'Manage Requests', uk: 'Управління запитами' },
  communicate: { ru: 'Переписка', en: 'Communication', uk: 'Листування' },
};

// Portal Nav Items
export interface PortalNavItem {
  key: string;
  path: string;
  label: Record<string, string>;
  icon: string;
}

export const portalNavItems: PortalNavItem[] = [
  { key: 'overview', path: '/p/overview', label: { ru: 'Обзор', en: 'Overview', uk: 'Огляд' }, icon: 'home' },
  { key: 'net-worth', path: '/p/net-worth', label: { ru: 'Капитал', en: 'Net Worth', uk: 'Капітал' }, icon: 'wallet' },
  { key: 'portfolios', path: '/p/portfolios', label: { ru: 'Портфели', en: 'Portfolios', uk: 'Портфелі' }, icon: 'briefcase' },
  { key: 'performance', path: '/p/performance', label: { ru: 'Доходность', en: 'Performance', uk: 'Дохідність' }, icon: 'chart' },
  { key: 'liquidity', path: '/p/liquidity', label: { ru: 'Ликвидность', en: 'Liquidity', uk: 'Ліквідність' }, icon: 'droplet' },
  { key: 'documents', path: '/p/documents', label: { ru: 'Документы', en: 'Documents', uk: 'Документи' }, icon: 'file' },
  { key: 'packs', path: '/p/packs', label: { ru: 'Пакеты', en: 'Packs', uk: 'Пакети' }, icon: 'package' },
  { key: 'requests', path: '/p/requests', label: { ru: 'Запросы', en: 'Requests', uk: 'Запити' }, icon: 'inbox' },
  { key: 'threads', path: '/p/threads', label: { ru: 'Сообщения', en: 'Messages', uk: 'Повідомлення' }, icon: 'message' },
  { key: 'calendar', path: '/p/calendar', label: { ru: 'Календарь', en: 'Calendar', uk: 'Календар' }, icon: 'calendar' },
  { key: 'governance', path: '/p/governance', label: { ru: 'Governance', en: 'Governance', uk: 'Governance' }, icon: 'gavel' },
  { key: 'consents', path: '/p/consents', label: { ru: 'Доступы', en: 'Consents', uk: 'Доступи' }, icon: 'shield' },
  { key: 'settings', path: '/p/settings', label: { ru: 'Настройки', en: 'Settings', uk: 'Налаштування' }, icon: 'settings' },
];

// Portal i18n strings
export const portalI18n = {
  buttons: {
    createRequest: { ru: 'Создать запрос', en: 'Create Request', uk: 'Створити запит' },
    download: { ru: 'Скачать', en: 'Download', uk: 'Завантажити' },
    open: { ru: 'Открыть', en: 'Open', uk: 'Відкрити' },
    send: { ru: 'Отправить', en: 'Send', uk: 'Надіслати' },
    save: { ru: 'Сохранить', en: 'Save', uk: 'Зберегти' },
    cancel: { ru: 'Отмена', en: 'Cancel', uk: 'Скасувати' },
    close: { ru: 'Закрыть', en: 'Close', uk: 'Закрити' },
    revoke: { ru: 'Отозвать', en: 'Revoke', uk: 'Відкликати' },
    askCopilot: { ru: 'Спросить AI', en: 'Ask AI', uk: 'Запитати AI' },
  },
  labels: {
    sources: { ru: 'Источники', en: 'Sources', uk: 'Джерела' },
    asOf: { ru: 'По состоянию на', en: 'As of', uk: 'Станом на' },
    lastUpdated: { ru: 'Обновлено', en: 'Updated', uk: 'Оновлено' },
    category: { ru: 'Категория', en: 'Category', uk: 'Категорія' },
    status: { ru: 'Статус', en: 'Status', uk: 'Статус' },
    description: { ru: 'Описание', en: 'Description', uk: 'Опис' },
    attachments: { ru: 'Вложения', en: 'Attachments', uk: 'Вкладення' },
    noData: { ru: 'Нет данных', en: 'No data', uk: 'Немає даних' },
    loading: { ru: 'Загрузка...', en: 'Loading...', uk: 'Завантаження...' },
  },
  disclaimers: {
    ai: {
      ru: 'Выводы AI являются информационными и требуют проверки человеком.',
      en: 'AI conclusions are informational and require human verification.',
      uk: 'Висновки AI є інформаційними та потребують перевірки людиною.',
    },
    investment: {
      ru: 'Не является индивидуальной инвестиционной рекомендацией.',
      en: 'This is not individual investment advice.',
      uk: 'Не є індивідуальною інвестиційною рекомендацією.',
    },
    tax: {
      ru: 'Не является налоговой консультацией.',
      en: 'This is not tax advice.',
      uk: 'Не є податковою консультацією.',
    },
    legal: {
      ru: 'Не является юридической консультацией.',
      en: 'This is not legal advice.',
      uk: 'Не є юридичною консультацією.',
    },
    forecast: {
      ru: 'Прогноз основан на предположениях и может не соответствовать фактическим результатам.',
      en: 'Forecast is based on assumptions and may not match actual results.',
      uk: 'Прогноз базується на припущеннях і може не відповідати фактичним результатам.',
    },
  },
};

// Interfaces for Portal Data
export interface PortalUser {
  id: string;
  name: string;
  email: string;
  role: PortalRoleKey;
  householdId: string;
  language: Locale;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortalKpis {
  netWorth: number;
  netWorthChange: number;
  performanceYtd: number;
  cashToday: number;
  openRequests: number;
  newDocuments: number;
  nextMeetingDate?: string;
  nextMeetingTitle?: string;
}

export interface PortalDocument {
  id: string;
  title: string;
  type: PortalDocTypeKey;
  tags: string[];
  publishedAt: string;
  publishedBy: string;
  fileUrl: string;
  fileSize: number;
  clientSafePublished: boolean;
}

export interface PortalPack {
  id: string;
  title: string;
  description: string;
  documentIds: string[];
  documentCount: number;
  createdAt: string;
  expiresAt?: string;
  accessCode?: string;
}

export interface PortalRequest {
  id: string;
  number: string;
  category: RequestCategoryKey;
  subject: string;
  description: string;
  status: RequestStatusKey;
  clientSafeUpdates: string[];
  attachmentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PortalThread {
  id: string;
  subject: string;
  type: ThreadTypeKey;
  participantNames: string[];
  lastMessageAt: string;
  unreadCount: number;
  messages: PortalMessage[];
}

export interface PortalMessage {
  id: string;
  senderName: string;
  senderRole: string;
  content: string;
  attachmentIds: string[];
  sentAt: string;
  isClientMessage: boolean;
}

export interface PortalEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  location?: string;
  description?: string;
  type: string;
  clientSafeVisible: boolean;
}

export interface PortalMinutes {
  id: string;
  meetingTitle: string;
  meetingDate: string;
  summary: string;
  decisions: string[];
  publishedAt: string;
  clientSafePublished: boolean;
}

export interface PortalConsent {
  id: string;
  advisorName: string;
  advisorOrg: string;
  scopes: ConsentScopeKey[];
  grantedAt: string;
  expiresAt?: string;
  status: 'active' | 'revoked' | 'expired';
}

export interface PortalPreferences {
  userId: string;
  language: Locale;
  emailNotifications: boolean;
  pushNotifications: boolean;
  digestFrequency: 'daily' | 'weekly' | 'monthly' | 'none';
}

export interface NetWorthSummary {
  total: number;
  change30d: number;
  changePercent30d: number;
  asOfDate: string;
  byAssetClass: {
    name: string;
    value: number;
    percent: number;
  }[];
  sources: string[];
}

export interface PortfolioSummary {
  id: string;
  name: string;
  custodian: string;
  value: number;
  allocation: {
    assetClass: string;
    percent: number;
    value: number;
  }[];
  accountNumberMasked: string;
}

export interface PerformanceSummary {
  periods: {
    period: string;
    return: number;
    benchmark?: number;
  }[];
  asOfDate: string;
  benchmarkName?: string;
}

export interface LiquiditySummary {
  cashToday: number;
  cashForecast30d: number;
  cashForecast90d: number;
  inflows30d: number;
  outflows30d: number;
  alerts: {
    type: 'warning' | 'info';
    message: string;
  }[];
  asOfDate: string;
}
