import type { ModuleConfig } from '../types';

export const notificationsConfig: ModuleConfig = {
  id: '35',
  slug: 'notifications',
  order: 35,
  icon: 'bell',
  title: {
    ru: 'Уведомления',
    en: 'Notifications',
    uk: 'Сповіщення',
  },
  description: {
    ru: 'Центр уведомлений, правила маршрутизации, эскалации и дайджесты',
    en: 'Notifications center, routing rules, escalations and digests',
    uk: 'Центр сповіщень, правила маршрутизації, ескалації та дайджести',
  },
  disclaimer: {
    ru: 'Уведомления формируются автоматически на основе правил. Проверяйте настройки каналов доставки.',
    en: 'Notifications are generated automatically based on rules. Check delivery channel settings.',
    uk: 'Сповіщення формуються автоматично на основі правил. Перевіряйте налаштування каналів доставки.',
  },
  kpis: [
    {
      key: 'unreadCount',
      title: { ru: 'Непрочитано', en: 'Unread', uk: 'Непрочитано' },
      format: 'number',
    },
    {
      key: 'todayCount',
      title: { ru: 'Сегодня', en: 'Today', uk: 'Сьогодні' },
      format: 'number',
    },
    {
      key: 'escalationsActive',
      title: { ru: 'Активные эскалации', en: 'Active Escalations', uk: 'Активні ескалації' },
      format: 'number',
    },
    {
      key: 'rulesFiring',
      title: { ru: 'Правил сработало', en: 'Rules Fired', uk: 'Правил спрацювало' },
      format: 'number',
    },
    {
      key: 'deliveryRate',
      title: { ru: 'Успешная доставка', en: 'Delivery Rate', uk: 'Успішна доставка' },
      format: 'percent',
    },
    {
      key: 'avgResponseTime',
      title: { ru: 'Ср. время реакции', en: 'Avg Response Time', uk: 'Сер. час реакції' },
      format: 'number',
    },
    {
      key: 'channelsActive',
      title: { ru: 'Активных каналов', en: 'Active Channels', uk: 'Активних каналів' },
      format: 'number',
    },
    {
      key: 'aiTriageRate',
      title: { ru: 'AI-триаж', en: 'AI Triage', uk: 'AI-тріаж' },
      format: 'percent',
    },
  ],
  columns: [
    { key: 'title', header: { ru: 'Заголовок', en: 'Title', uk: 'Заголовок' } },
    { key: 'category', header: { ru: 'Категория', en: 'Category', uk: 'Категорія' } },
    { key: 'priority', header: { ru: 'Приоритет', en: 'Priority', uk: 'Пріоритет' } },
    { key: 'channel', header: { ru: 'Канал', en: 'Channel', uk: 'Канал' } },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'createdAt', header: { ru: 'Создано', en: 'Created', uk: 'Створено' }, type: 'date' },
  ],
  actions: [
    {
      key: 'markRead',
      label: { ru: 'Отметить прочитанным', en: 'Mark as Read', uk: 'Позначити прочитаним' },
      icon: 'check',
      variant: 'secondary',
    },
    {
      key: 'markAllRead',
      label: { ru: 'Прочитать все', en: 'Mark All Read', uk: 'Прочитати все' },
      icon: 'checkAll',
      variant: 'secondary',
    },
    {
      key: 'snooze',
      label: { ru: 'Отложить', en: 'Snooze', uk: 'Відкласти' },
      icon: 'clock',
      variant: 'secondary',
    },
    {
      key: 'escalate',
      label: { ru: 'Эскалировать', en: 'Escalate', uk: 'Ескалювати' },
      icon: 'arrowUp',
      variant: 'secondary',
    },
    {
      key: 'createRule',
      label: { ru: 'Создать правило', en: 'Create Rule', uk: 'Створити правило' },
      icon: 'plus',
      variant: 'primary',
    },
  ],
  tabs: [
    { key: 'inbox', label: { ru: 'Входящие', en: 'Inbox', uk: 'Вхідні' } },
    { key: 'rules', label: { ru: 'Правила', en: 'Rules', uk: 'Правила' } },
    { key: 'escalations', label: { ru: 'Эскалации', en: 'Escalations', uk: 'Ескалації' } },
    { key: 'digests', label: { ru: 'Дайджесты', en: 'Digests', uk: 'Дайджести' } },
    { key: 'templates', label: { ru: 'Шаблоны', en: 'Templates', uk: 'Шаблони' } },
    { key: 'channels', label: { ru: 'Каналы', en: 'Channels', uk: 'Канали' } },
    { key: 'preferences', label: { ru: 'Настройки', en: 'Preferences', uk: 'Налаштування' } },
    { key: 'audit', label: { ru: 'Аудит', en: 'Audit', uk: 'Аудит' } },
  ],
  collections: [
    'notifications',
    'notificationRules',
    'escalations',
    'digests',
    'notificationTemplates',
    'notificationChannels',
    'userNotificationPrefs',
  ],
};
