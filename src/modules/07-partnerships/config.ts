import { ModuleConfig } from '../types';

export const psConfig: ModuleConfig = {
  id: '07',
  slug: 'partnerships',
  order: 7,
  icon: 'users',
  title: { ru: 'Партнерства и структура владения', en: 'Partnership Accounting', uk: 'Партнерства і структура володіння' },
  description: {
    ru: 'Партнерский учёт, структуры владения, доли, распределения и транзакции',
    en: 'Partnership accounting, ownership structures, interests, distributions and transactions',
    uk: 'Партнерський облік, структури володіння, частки, розподіли та транзакції'
  },
  kpis: [
    { key: 'partnerships', title: { ru: 'Партнерств', en: 'Partnerships', uk: 'Партнерств' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'owners', title: { ru: 'Владельцы/EBO', en: 'Owners/EBO', uk: 'Власники/EBO' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'activeInterests', title: { ru: 'Активные доли', en: 'Active Interests', uk: 'Активні частки' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'pendingApprovals', title: { ru: 'Ожидают одобрения', en: 'Pending Approvals', uk: 'Очікують схвалення' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'distributions30d', title: { ru: 'Распределения 30д', en: 'Distributions 30d', uk: 'Розподіли 30д' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'transactions30d', title: { ru: 'Транзакции 30д', en: 'Transactions 30d', uk: 'Транзакції 30д' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'missingDocs', title: { ru: 'Нет документов', en: 'Missing Docs', uk: 'Немає документів' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'topExposure', title: { ru: 'Концентрации', en: 'Top Exposure', uk: 'Концентрації' }, format: 'number', status: 'warning', linkToList: true }
  ],
  columns: [
    { key: 'name', header: { ru: 'Партнерство', en: 'Partnership', uk: 'Партнерство' } },
    { key: 'type', header: { ru: 'Тип', en: 'Type', uk: 'Тип' } },
    { key: 'splitMode', header: { ru: 'Режим', en: 'Split Mode', uk: 'Режим' } },
    { key: 'nav', header: { ru: 'NAV', en: 'NAV', uk: 'NAV' }, type: 'currency' },
    { key: 'owners', header: { ru: 'Владельцы', en: 'Owners', uk: 'Власники' } },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' }
  ],
  actions: [
    { key: 'createPartnership', label: { ru: 'Создать партнерство', en: 'Create Partnership', uk: 'Створити партнерство' }, variant: 'primary' },
    { key: 'addOwner', label: { ru: 'Добавить owner', en: 'Add Owner', uk: 'Додати власника' }, variant: 'secondary' },
    { key: 'addInterest', label: { ru: 'Добавить долю', en: 'Add Interest', uk: 'Додати частку' }, variant: 'secondary' },
    { key: 'createTransaction', label: { ru: 'Создать транзакцию', en: 'Create Transaction', uk: 'Створити транзакцію' }, variant: 'secondary' },
    { key: 'createDistribution', label: { ru: 'Создать распределение', en: 'Create Distribution', uk: 'Створити розподіл' }, variant: 'secondary' },
    { key: 'attachDocument', label: { ru: 'Прикрепить документ', en: 'Attach Document', uk: 'Прикріпити документ' }, variant: 'ghost' }
  ]
};

export default psConfig;
