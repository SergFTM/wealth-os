/**
 * Module 25: Tenant Admin and White Label
 * Branding, portal config, languages, notifications, policies, flags, domains, data
 */

import { ModuleConfig } from '../types';

export const adminConfig: ModuleConfig = {
  id: '25',
  slug: 'admin',
  order: 25,
  icon: 'settings',
  title: { ru: 'Администрирование', en: 'Administration', uk: 'Адміністрування' },
  description: {
    ru: 'Брендинг, портал клиента, языки, уведомления, политики, флаги, домены, данные',
    en: 'Branding, client portal, languages, notifications, policies, flags, domains, data',
    uk: 'Брендинг, портал клієнта, мови, сповіщення, політики, флаги, домени, дані',
  },
  disclaimer: {
    ru: 'White label настройки в MVP демонстрационные. Для production требуется инфраструктура и доменная настройка.',
    en: 'White label settings are demonstrational in MVP. Production requires infrastructure and domain configuration.',
    uk: 'White label налаштування в MVP демонстраційні. Для production потрібна інфраструктура і доменна конфігурація.',
  },
  kpis: [
    { key: 'brandingConfigured', title: { ru: 'Брендинг настроен', en: 'Branding Configured', uk: 'Брендинг налаштовано' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'portalModulesEnabled', title: { ru: 'Модулей портала', en: 'Portal Modules', uk: 'Модулів порталу' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'languageOverrides', title: { ru: 'Переопределений языка', en: 'Language Overrides', uk: 'Перевизначень мови' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'notificationTemplates', title: { ru: 'Шаблонов уведомлений', en: 'Notification Templates', uk: 'Шаблонів сповіщень' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'activePolicyBanners', title: { ru: 'Активных баннеров', en: 'Active Banners', uk: 'Активних банерів' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'featureFlagsEnabled', title: { ru: 'Флагов включено', en: 'Flags Enabled', uk: 'Флагів увімкнено' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'domainsConfigured', title: { ru: 'Доменов настроено', en: 'Domains Configured', uk: 'Доменів налаштовано' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'retentionDays', title: { ru: 'Хранение данных (дни)', en: 'Retention Days', uk: 'Зберігання даних (дні)' }, format: 'number', status: 'ok', linkToList: true },
  ],
  columns: [
    { key: 'name', header: { ru: 'Название', en: 'Name', uk: 'Назва' } },
    { key: 'type', header: { ru: 'Тип', en: 'Type', uk: 'Тип' } },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'updatedAt', header: { ru: 'Обновлено', en: 'Updated', uk: 'Оновлено' }, type: 'date' },
  ],
  actions: [
    { key: 'saveBranding', label: { ru: 'Сохранить брендинг', en: 'Save Branding', uk: 'Зберегти брендинг' }, variant: 'primary' },
    { key: 'addPolicyBanner', label: { ru: 'Добавить баннер', en: 'Add Banner', uk: 'Додати банер' }, variant: 'secondary' },
    { key: 'createFlag', label: { ru: 'Создать флаг', en: 'Create Flag', uk: 'Створити флаг' }, variant: 'secondary' },
    { key: 'addDomain', label: { ru: 'Добавить домен', en: 'Add Domain', uk: 'Додати домен' }, variant: 'ghost' },
    { key: 'resetDefaults', label: { ru: 'Сбросить к дефолту', en: 'Reset to Defaults', uk: 'Скинути до дефолту' }, variant: 'ghost' },
  ],
};
