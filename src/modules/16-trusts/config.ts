import type { ModuleConfig } from '@/modules/types';

export const trustsConfig: ModuleConfig = {
  id: '16',
  slug: 'trusts',
  order: 16,
  icon: 'landmark',
  title: {
    ru: 'Трасты и наследование',
    en: 'Trust & Estate',
    uk: 'Трасти і спадкування',
  },
  description: {
    ru: 'Управление трастами, бенефициарами, распределениями, события и календарь',
    en: 'Trust management, beneficiaries, distributions, events and calendar',
    uk: 'Управління трастами, бенефіціарами, розподілами, події і календар',
  },
  disclaimer: {
    ru: 'Не является юридической консультацией',
    en: 'This is not legal advice',
    uk: 'Не є юридичною консультацією',
  },
  kpis: [
    {
      key: 'trustsActive',
      title: { ru: 'Активных трастов', en: 'Active Trusts', uk: 'Активних трастів' },
      format: 'number',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'beneficiariesCount',
      title: { ru: 'Бенефициаров', en: 'Beneficiaries', uk: 'Бенефіціарів' },
      format: 'number',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'distributionsScheduled90d',
      title: { ru: 'Распределений 90д', en: 'Distributions 90d', uk: 'Розподілів 90д' },
      format: 'number',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'distributionsPending',
      title: { ru: 'Ожидают одобрения', en: 'Pending Approval', uk: 'Очікують схвалення' },
      format: 'number',
      status: 'warning',
      linkToList: true,
    },
    {
      key: 'eventsUpcoming60d',
      title: { ru: 'Событий 60д', en: 'Events 60d', uk: 'Подій 60д' },
      format: 'number',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'trusteeChanges1y',
      title: { ru: 'Смен trustee 1г', en: 'Trustee Changes 1y', uk: 'Змін trustee 1р' },
      format: 'number',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'missingDocs',
      title: { ru: 'Нет документов', en: 'Missing Docs', uk: 'Немає документів' },
      format: 'number',
      status: 'critical',
      linkToList: true,
    },
    {
      key: 'calendarTriggers30d',
      title: { ru: 'Триггеры 30д', en: 'Triggers 30d', uk: 'Тригери 30д' },
      format: 'number',
      status: 'warning',
      linkToList: true,
    },
  ],
  columns: [
    { key: 'name', header: { ru: 'Траст', en: 'Trust', uk: 'Траст' } },
    { key: 'jurisdiction', header: { ru: 'Юрисдикция', en: 'Jurisdiction', uk: 'Юрисдикція' } },
    { key: 'trustType', header: { ru: 'Тип', en: 'Type', uk: 'Тип' } },
    { key: 'trustee', header: { ru: 'Trustee', en: 'Trustee', uk: 'Trustee' } },
    { key: 'beneficiaries', header: { ru: 'Бенефициары', en: 'Beneficiaries', uk: 'Бенефіціари' } },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
  ],
  actions: [
    { key: 'createTrust', label: { ru: 'Создать траст', en: 'Create Trust', uk: 'Створити траст' }, variant: 'primary' },
    { key: 'addBeneficiary', label: { ru: 'Добавить бенефициара', en: 'Add Beneficiary', uk: 'Додати бенефіціара' }, variant: 'secondary' },
    { key: 'createEvent', label: { ru: 'Создать событие', en: 'Create Event', uk: 'Створити подію' }, variant: 'secondary' },
    { key: 'createDistribution', label: { ru: 'Создать распределение', en: 'Create Distribution', uk: 'Створити розподіл' }, variant: 'ghost' },
    { key: 'attachDocuments', label: { ru: 'Прикрепить документы', en: 'Attach Documents', uk: 'Прикріпити документи' }, variant: 'ghost' },
  ],
};

export default trustsConfig;
