import { ModuleConfig } from '../types';

export const ipsConfig: ModuleConfig = {
  id: '16',
  slug: 'ips',
  order: 16,
  icon: 'shield',
  title: {
    ru: 'IPS и ограничения',
    en: 'IPS & Constraints',
    uk: 'IPS і обмеження',
  },
  description: {
    ru: 'Инвестиционная политика, ограничения, нарушения, исключения и комитет',
    en: 'Investment Policy Statement, constraints, breaches, waivers and committee',
    uk: 'Інвестиційна політика, обмеження, порушення, винятки і комітет',
  },
  disclaimer: {
    ru: 'Информация об IPS носит справочный характер и требует подтверждения инвестиционным комитетом',
    en: 'IPS information is for reference only and requires investment committee confirmation',
    uk: 'Інформація про IPS носить довідковий характер і потребує підтвердження інвестиційним комітетом',
  },
  kpis: [
    { key: 'activePolicies', title: { ru: 'Активные политики', en: 'Active Policies', uk: 'Активні політики' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'constraintsCount', title: { ru: 'Ограничения', en: 'Constraints', uk: 'Обмеження' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'breachesOpen', title: { ru: 'Нарушения открытые', en: 'Breaches Open', uk: 'Порушення відкриті' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'breachesCritical', title: { ru: 'Критические', en: 'Critical', uk: 'Критичні' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'waiversActive', title: { ru: 'Исключения активные', en: 'Waivers Active', uk: 'Винятки активні' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'waiversExpiring', title: { ru: 'Истекают 30д', en: 'Expiring 30d', uk: 'Закінчуються 30д' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'meetingsCount', title: { ru: 'Заседания 90д', en: 'Meetings 90d', uk: 'Засідання 90д' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'missingDocs', title: { ru: 'Нет документов', en: 'Missing Docs', uk: 'Немає документів' }, format: 'number', status: 'warning', linkToList: true },
  ],
  columns: [
    { key: 'name', header: { ru: 'Название', en: 'Name', uk: 'Назва' } },
    { key: 'scopeType', header: { ru: 'Scope', en: 'Scope', uk: 'Scope' } },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'constraintsCount', header: { ru: 'Ограничения', en: 'Constraints', uk: 'Обмеження' } },
    { key: 'breachesOpen', header: { ru: 'Нарушения', en: 'Breaches', uk: 'Порушення' } },
    { key: 'updatedAt', header: { ru: 'Обновлено', en: 'Updated', uk: 'Оновлено' }, type: 'date' },
  ],
  actions: [
    { key: 'createPolicy', label: { ru: 'Создать политику', en: 'Create Policy', uk: 'Створити політику' }, variant: 'primary' },
    { key: 'addConstraint', label: { ru: 'Добавить ограничение', en: 'Add Constraint', uk: 'Додати обмеження' }, variant: 'secondary' },
    { key: 'createBreach', label: { ru: 'Зафиксировать breach', en: 'Record Breach', uk: 'Зафіксувати breach' }, variant: 'secondary' },
    { key: 'createWaiver', label: { ru: 'Создать waiver', en: 'Create Waiver', uk: 'Створити waiver' }, variant: 'ghost' },
    { key: 'createMeeting', label: { ru: 'Создать meeting', en: 'Create Meeting', uk: 'Створити meeting' }, variant: 'ghost' },
    { key: 'checkConstraints', label: { ru: 'Проверить ограничения', en: 'Check Constraints', uk: 'Перевірити обмеження' }, variant: 'ghost' },
  ],
};

export default ipsConfig;
