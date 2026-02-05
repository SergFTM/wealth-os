import { ModuleConfig } from '../types';

export const mobileConfig: ModuleConfig = {
  id: '31',
  slug: 'mobile',
  order: 31,
  icon: 'smartphone',
  color: '#10B981',
  title: {
    ru: 'Мобильный режим',
    en: 'Mobile Mode',
    uk: 'Мобільний режим',
  },
  description: {
    ru: 'PWA, Offline режим и Push уведомления',
    en: 'PWA, Offline mode and Push notifications',
    uk: 'PWA, Offline режим та Push сповіщення',
  },
  disclaimer: {
    ru: 'Offline и push в MVP демонстрационные. Для production требуются service workers, VAPID ключи и инфраструктура.',
    en: 'Offline and push are demo in MVP. For production, service workers, VAPID keys and infrastructure are required.',
    uk: 'Offline та push в MVP демонстраційні. Для production потрібні service workers, VAPID ключі та інфраструктура.',
  },
  collections: [
    'mobileDevices',
    'pushSubscriptions',
    'pushMessages',
    'offlineCachePlans',
    'quickActions',
  ],
  routes: {
    dashboard: '/m/mobile',
    list: '/m/mobile/list',
    item: '/m/mobile/device',
  },
  tabs: [
    { key: 'pwa', label: { ru: 'PWA', en: 'PWA', uk: 'PWA' } },
    { key: 'offline', label: { ru: 'Offline Cache', en: 'Offline Cache', uk: 'Offline Cache' } },
    { key: 'push', label: { ru: 'Push', en: 'Push', uk: 'Push' } },
    { key: 'actions', label: { ru: 'Быстрые действия', en: 'Quick Actions', uk: 'Швидкі дії' } },
    { key: 'devices', label: { ru: 'Устройства', en: 'Devices', uk: 'Пристрої' } },
    { key: 'settings', label: { ru: 'Настройки', en: 'Settings', uk: 'Налаштування' } },
  ],
  kpis: [
    { key: 'devicesRegistered', title: { ru: 'Устройства', en: 'Devices', uk: 'Пристрої' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'pushSubscriptionsActive', title: { ru: 'Push подписки', en: 'Push Subscriptions', uk: 'Push підписки' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'messagesUnread', title: { ru: 'Непрочитанные', en: 'Unread', uk: 'Непрочитані' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'offlinePlans', title: { ru: 'Offline планы', en: 'Offline Plans', uk: 'Offline плани' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'quickActionsConfigured', title: { ru: 'Quick actions', en: 'Quick Actions', uk: 'Quick actions' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'portalCached', title: { ru: 'Portal cached', en: 'Portal Cached', uk: 'Portal cached' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'staffCached', title: { ru: 'Staff cached', en: 'Staff Cached', uk: 'Staff cached' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'lastSync', title: { ru: 'Посл. синхр.', en: 'Last Sync', uk: 'Ост. синхр.' }, status: 'ok' },
  ],
  columns: [
    { key: 'deviceName', header: { ru: 'Устройство', en: 'Device', uk: 'Пристрій' } },
    { key: 'platform', header: { ru: 'Платформа', en: 'Platform', uk: 'Платформа' } },
    { key: 'browser', header: { ru: 'Браузер', en: 'Browser', uk: 'Браузер' } },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'lastSeenAt', header: { ru: 'Последняя активность', en: 'Last Seen', uk: 'Остання активність' }, type: 'date' },
  ],
  actions: [
    { key: 'createOfflinePlan', label: { ru: 'Создать offline план', en: 'Create Offline Plan', uk: 'Створити offline план' }, variant: 'primary' },
    { key: 'subscribeDevice', label: { ru: 'Подписать устройство', en: 'Subscribe Device', uk: 'Підписати пристрій' }, variant: 'secondary' },
    { key: 'sendPush', label: { ru: 'Отправить push', en: 'Send Push', uk: 'Надіслати push' }, variant: 'secondary' },
    { key: 'generateQuickActions', label: { ru: 'Сгенерировать quick actions', en: 'Generate Quick Actions', uk: 'Згенерувати quick actions' }, variant: 'ghost' },
    { key: 'generateDemoDevices', label: { ru: 'Сгенерировать demo устройства', en: 'Generate Demo Devices', uk: 'Згенерувати demo пристрої' }, variant: 'ghost' },
  ],
};

export default mobileConfig;
