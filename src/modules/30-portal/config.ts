import { ModuleConfig } from '../types';

export const portalConfig: ModuleConfig = {
  id: 'portal',
  slug: 'portal',
  icon: 'globe',
  order: 30,
  title: {
    en: 'Client Portal',
    ru: 'Клиентский портал',
    uk: 'Клієнтський портал',
  },
  description: {
    en: 'Self-service portal for clients, family members, trustees and external advisors',
    ru: 'Портал самообслуживания для клиентов, членов семьи, трасти и внешних советников',
    uk: 'Портал самообслуговування для клієнтів, членів сім\'ї, трасті та зовнішніх радників',
  },
  disclaimer: {
    en: 'Information is for reference only. AI outputs require human verification. Not tax or legal advice.',
    ru: 'Информация носит справочный характер. AI выводы требуют проверки человеком. Не является налоговой или юридической консультацией.',
    uk: 'Інформація має довідковий характер. AI висновки потребують перевірки людиною. Не є податковою або юридичною консультацією.',
  },
  kpis: [
    { key: 'openRequests', title: { en: 'Open Requests', ru: 'Открытые запросы', uk: 'Відкриті запити' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'unpaidInvoices', title: { en: 'Unpaid Invoices', ru: 'Неоплаченные счета', uk: 'Неоплачені рахунки' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'unreadMessages', title: { en: 'Unread Messages', ru: 'Непрочитанные', uk: 'Непрочитані' }, format: 'number', status: 'info', linkToList: true },
    { key: 'publishedReports', title: { en: 'Published Reports', ru: 'Опубликованные отчеты', uk: 'Опубліковані звіти' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'availableDocs', title: { en: 'Documents', ru: 'Документы', uk: 'Документи' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'activeSessions', title: { en: 'Active Sessions', ru: 'Активные сессии', uk: 'Активні сесії' }, format: 'number', status: 'ok' },
  ],
  columns: [
    { key: 'title', header: { en: 'Title', ru: 'Название', uk: 'Назва' } },
    { key: 'type', header: { en: 'Type', ru: 'Тип', uk: 'Тип' }, type: 'badge' },
    { key: 'status', header: { en: 'Status', ru: 'Статус', uk: 'Статус' }, type: 'status' },
    { key: 'priority', header: { en: 'Priority', ru: 'Приоритет', uk: 'Пріоритет' }, type: 'badge' },
    { key: 'slaDue', header: { en: 'SLA Due', ru: 'Срок SLA', uk: 'Термін SLA' }, type: 'date' },
    { key: 'createdAt', header: { en: 'Created', ru: 'Создано', uk: 'Створено' }, type: 'date' },
  ],
  actions: [
    { key: 'createRequest', label: { en: 'Create Request', ru: 'Создать запрос', uk: 'Створити запит' }, variant: 'primary' },
    { key: 'viewReports', label: { en: 'View Reports', ru: 'Открыть отчеты', uk: 'Відкрити звіти' }, variant: 'secondary' },
    { key: 'viewDocuments', label: { en: 'View Documents', ru: 'Открыть документы', uk: 'Відкрити документи' }, variant: 'secondary' },
  ],
  clientSafeHidden: true, // Hidden from main app - portal has its own routes
  collections: [
    'clientRequests',
    'clientPreferences',
    'clientSubscriptions',
    'portalAnnouncements',
    'reportShares',
    'documents',
    'feeInvoices',
    'commThreads',
    'tasks',
    'auditEvents',
  ],
  routes: {
    home: '/portal',
    networth: '/portal/networth',
    reports: '/portal/reports',
    documents: '/portal/documents',
    invoices: '/portal/invoices',
    requests: '/portal/requests',
    threads: '/portal/threads',
    profile: '/portal/profile',
    newRequest: '/portal/request/new',
  },
};

export default portalConfig;
