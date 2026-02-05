import { ModuleConfig } from '../types';

export const platformConfig: ModuleConfig = {
  id: 'platform',
  slug: 'platform',
  icon: 'settings',
  order: 26,
  title: {
    en: 'Platform',
    ru: 'Платформа',
    uk: 'Платформа',
  },
  description: {
    en: 'Platform shell, demo mode, navigation, global search',
    ru: 'Оболочка платформы, демо режим, навигация, глобальный поиск',
    uk: 'Оболонка платформи, демо режим, навігація, глобальний пошук',
  },
  disclaimer: {
    en: 'Demo mode is for testing and demonstration. Data is synthetic.',
    ru: 'Демо режим предназначен для тестирования и демонстрации. Данные являются синтетическими.',
    uk: 'Демо режим призначений для тестування та демонстрації. Дані є синтетичними.',
  },
  kpis: [
    { key: 'demoInitialized', title: { en: 'Demo Active', ru: 'Демо активен', uk: 'Демо активний' }, format: 'number', status: 'ok', linkToList: false },
    { key: 'seedVersion', title: { en: 'Seed Version', ru: 'Версия seed', uk: 'Версія seed' }, format: 'number', status: 'ok', linkToList: false },
    { key: 'totalRecords', title: { en: 'Total Records', ru: 'Всего записей', uk: 'Всього записів' }, format: 'number', status: 'ok', linkToList: false },
    { key: 'navHealth', title: { en: 'Nav Health', ru: 'Навигация OK', uk: 'Навігація OK' }, format: 'percent', status: 'ok', linkToList: true },
    { key: 'openTasks', title: { en: 'Open Tasks', ru: 'Открытые задачи', uk: 'Відкриті задачі' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'openAlerts', title: { en: 'Open Alerts', ru: 'Открытые алерты', uk: 'Відкриті алерти' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'newNotifications', title: { en: 'Notifications', ru: 'Уведомления', uk: 'Сповіщення' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'lastReset', title: { en: 'Last Reset', ru: 'Последний сброс', uk: 'Останній скид' }, format: 'number', status: 'ok', linkToList: false },
  ],
  columns: [
    { key: 'name', header: { en: 'Name', ru: 'Название', uk: 'Назва' } },
    { key: 'type', header: { en: 'Type', ru: 'Тип', uk: 'Тип' } },
    { key: 'moduleKey', header: { en: 'Module', ru: 'Модуль', uk: 'Модуль' } },
    { key: 'isPinned', header: { en: 'Pinned', ru: 'Закреплено', uk: 'Закріплено' }, type: 'badge' },
    { key: 'createdAt', header: { en: 'Created', ru: 'Создано', uk: 'Створено' }, type: 'date' },
  ],
  actions: [
    { key: 'initDemo', label: { en: 'Initialize Demo', ru: 'Инициализировать демо', uk: 'Ініціалізувати демо' }, variant: 'primary' },
    { key: 'resetDemo', label: { en: 'Reset Demo', ru: 'Сбросить демо', uk: 'Скинути демо' }, variant: 'secondary' },
    { key: 'generateEvents', label: { en: 'Generate Events', ru: 'Сгенерировать события', uk: 'Згенерувати події' }, variant: 'secondary' },
    { key: 'exportData', label: { en: 'Export Data', ru: 'Экспорт данных', uk: 'Експорт даних' }, variant: 'ghost' },
  ],
  adminOnly: true,
  clientSafeHidden: true,
};

export default platformConfig;
