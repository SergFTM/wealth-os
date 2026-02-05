import { ModuleConfig } from '../types';

export const consentsConfig: ModuleConfig = {
  id: '34',
  slug: 'consents',
  order: 34,
  icon: 'key',
  title: {
    ru: 'Согласия',
    en: 'Consents',
    uk: 'Згоди'
  },
  description: {
    ru: 'Управление согласиями, разрешениями и контурами доступа к данным',
    en: 'Manage consents, permissions and data sharing scopes',
    uk: 'Управління згодами, дозволами та контурами доступу до даних'
  },
  disclaimer: {
    ru: 'Доступы и согласия в MVP демонстрационные. Для production требуется юридическая проработка и инфраструктура.',
    en: 'Access and consents in MVP are demonstrative. Production requires legal review and infrastructure.',
    uk: 'Доступи і згоди в MVP демонстраційні. Для production потрібна юридична проробка та інфраструктура.'
  },
  kpis: [
    { key: 'activeConsents', title: { ru: 'Активные согласия', en: 'Active Consents', uk: 'Активні згоди' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'pendingRequests', title: { ru: 'Запросы на рассмотрении', en: 'Pending Requests', uk: 'Запити на розгляді' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'expiring30d', title: { ru: 'Истекают 30д', en: 'Expiring 30d', uk: 'Закінчуються 30д' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'revocations30d', title: { ru: 'Отозвано 30д', en: 'Revoked 30d', uk: 'Відкликано 30д' }, format: 'number', status: 'info', linkToList: true },
    { key: 'dataRoomsActive', title: { ru: 'Data Rooms активные', en: 'Active Data Rooms', uk: 'Data Rooms активні' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'downloadsBlocked', title: { ru: 'Скачивания заблокированы', en: 'Downloads Blocked', uk: 'Завантаження заблоковано' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'clientSafeShares', title: { ru: 'Client-safe шары', en: 'Client-safe Shares', uk: 'Client-safe шари' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'auditEvents', title: { ru: 'Audit события', en: 'Audit Events', uk: 'Audit події' }, format: 'number', status: 'info', linkToList: true }
  ],
  columns: [
    { key: 'subject', header: { ru: 'Субъект', en: 'Subject', uk: 'Субʼєкт' } },
    { key: 'subjectType', header: { ru: 'Тип субъекта', en: 'Subject Type', uk: 'Тип субʼєкта' }, type: 'badge' },
    { key: 'scopeType', header: { ru: 'Scope', en: 'Scope', uk: 'Scope' } },
    { key: 'permissions', header: { ru: 'Разрешения', en: 'Permissions', uk: 'Дозволи' }, type: 'badge' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'validUntil', header: { ru: 'Действует до', en: 'Valid Until', uk: 'Дійсно до' }, type: 'date' }
  ],
  actions: [
    { key: 'createConsent', label: { ru: 'Создать согласие', en: 'Create Consent', uk: 'Створити згоду' }, variant: 'primary' },
    { key: 'createRequest', label: { ru: 'Создать запрос', en: 'Create Request', uk: 'Створити запит' }, variant: 'secondary' },
    { key: 'createRoom', label: { ru: 'Создать Data Room', en: 'Create Data Room', uk: 'Створити Data Room' }, variant: 'secondary' },
    { key: 'revokeAccess', label: { ru: 'Отозвать доступ', en: 'Revoke Access', uk: 'Відкликати доступ' }, variant: 'ghost' },
    { key: 'generateDemo', label: { ru: 'Demo данные', en: 'Demo Data', uk: 'Demo дані' }, variant: 'ghost' }
  ],
  tabs: [
    { key: 'consents', label: { ru: 'Согласия', en: 'Consents', uk: 'Згоди' } },
    { key: 'requests', label: { ru: 'Запросы доступа', en: 'Access Requests', uk: 'Запити доступу' } },
    { key: 'policies', label: { ru: 'Политики шаринга', en: 'Sharing Policies', uk: 'Політики шарінгу' } },
    { key: 'rooms', label: { ru: 'Data Rooms', en: 'Data Rooms', uk: 'Data Rooms' } },
    { key: 'revocations', label: { ru: 'Отзыв', en: 'Revocations', uk: 'Відкликання' } },
    { key: 'audit', label: { ru: 'Аудит', en: 'Audit', uk: 'Аудит' } }
  ],
  collections: [
    'consents',
    'accessRequests',
    'sharingPolicies',
    'dataRooms',
    'dataRoomItems',
    'revocations'
  ]
};

export default consentsConfig;
