import { ModuleConfig } from '../types';

export const packsConfig: ModuleConfig = {
  id: '52',
  slug: 'packs',
  order: 52,
  icon: 'package',
  color: '#059669',
  enabled: true,

  title: {
    ru: 'Пакеты',
    en: 'Advisor Packs',
    uk: 'Пакети'
  },

  description: {
    ru: 'Сборка пакетов документов для консультантов и аудиторов',
    en: 'Document packages for advisors and auditors',
    uk: 'Збірка пакетів документів для консультантів та аудиторів'
  },

  disclaimer: {
    ru: 'Пакеты содержат конфиденциальные материалы. Перед передачей третьим лицам требуется проверка и утверждение.',
    en: 'Packages contain confidential materials. Review and approval required before sharing with third parties.',
    uk: 'Пакети містять конфіденційні матеріали. Перед передачею третім особам потрібна перевірка та затвердження.'
  },

  kpis: [
    {
      key: 'packsCreated30d',
      title: { ru: 'Пакетов за 30д', en: 'Packs 30d', uk: 'Пакетів за 30д' },
      format: 'number',
      status: 'info',
      linkToList: true
    },
    {
      key: 'pendingApprovals',
      title: { ru: 'Ожидают одобрения', en: 'Pending Approvals', uk: 'Очікують схвалення' },
      format: 'number',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'activeShares',
      title: { ru: 'Активные ссылки', en: 'Active Shares', uk: 'Активні посилання' },
      format: 'number',
      status: 'ok',
      linkToList: true
    },
    {
      key: 'downloads7d',
      title: { ru: 'Скачиваний 7д', en: 'Downloads 7d', uk: 'Завантажень 7д' },
      format: 'number',
      status: 'info',
      linkToList: true
    },
    {
      key: 'expiringShares',
      title: { ru: 'Истекает 14д', en: 'Expiring 14d', uk: 'Спливає 14д' },
      format: 'number',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'missingDocs',
      title: { ru: 'Отсутствуют доки', en: 'Missing Docs', uk: 'Відсутні доки' },
      format: 'number',
      status: 'critical',
      linkToList: true
    },
    {
      key: 'clientSafePacks',
      title: { ru: 'Client-safe', en: 'Client-safe', uk: 'Client-safe' },
      format: 'number',
      status: 'ok',
      linkToList: true
    },
    {
      key: 'revokedShares30d',
      title: { ru: 'Отозвано 30д', en: 'Revoked 30d', uk: 'Відкликано 30д' },
      format: 'number',
      status: 'info',
      linkToList: true
    }
  ],

  columns: [
    { key: 'name', header: { ru: 'Название', en: 'Name', uk: 'Назва' }, width: 'w-48' },
    { key: 'recipient', header: { ru: 'Получатель', en: 'Recipient', uk: 'Отримувач' }, width: 'w-32' },
    { key: 'purpose', header: { ru: 'Цель', en: 'Purpose', uk: 'Ціль' }, width: 'w-28' },
    { key: 'period', header: { ru: 'Период', en: 'Period', uk: 'Період' }, width: 'w-24' },
    { key: 'scope', header: { ru: 'Scope', en: 'Scope', uk: 'Scope' }, width: 'w-24' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, width: 'w-28', type: 'status' },
    { key: 'clientSafe', header: { ru: 'Client-safe', en: 'Client-safe', uk: 'Client-safe' }, width: 'w-20', type: 'badge' }
  ],

  actions: [
    { key: 'createPack', label: { ru: 'Создать пакет', en: 'Create Pack', uk: 'Створити пакет' }, icon: 'plus', variant: 'primary' },
    { key: 'createTemplate', label: { ru: 'Создать шаблон', en: 'Create Template', uk: 'Створити шаблон' }, icon: 'file-plus', variant: 'secondary' },
    { key: 'quickPack', label: { ru: 'Быстрый пакет', en: 'Quick Pack', uk: 'Швидкий пакет' }, icon: 'zap', variant: 'secondary' },
    { key: 'publishShare', label: { ru: 'Опубликовать', en: 'Publish Share', uk: 'Опублікувати' }, icon: 'share-2', variant: 'secondary' },
    { key: 'generateDemo', label: { ru: 'Генерировать демо', en: 'Generate Demo', uk: 'Генерувати демо' }, icon: 'database', variant: 'ghost' }
  ],

  collections: ['reportPacks', 'packTemplates', 'packItems', 'packShares', 'packApprovals', 'packDownloads'],

  routes: {
    dashboard: '/m/packs',
    list: '/m/packs/list',
    create: '/m/packs/create',
    pack: '/m/packs/pack/[id]',
    template: '/m/packs/template/[id]',
    share: '/m/packs/share/[id]'
  },

  tabs: [
    { key: 'packs', label: { ru: 'Пакеты', en: 'Packs', uk: 'Пакети' } },
    { key: 'templates', label: { ru: 'Шаблоны', en: 'Templates', uk: 'Шаблони' } },
    { key: 'shares', label: { ru: 'Ссылки', en: 'Shares', uk: 'Посилання' } },
    { key: 'approvals', label: { ru: 'Одобрения', en: 'Approvals', uk: 'Схвалення' } },
    { key: 'downloads', label: { ru: 'Скачивания', en: 'Downloads', uk: 'Завантаження' } },
    { key: 'audit', label: { ru: 'Аудит', en: 'Audit', uk: 'Аудит' } }
  ],

  adminOnly: false,
  clientSafeHidden: false
};

export default packsConfig;
