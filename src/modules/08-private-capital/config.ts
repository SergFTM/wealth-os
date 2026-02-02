import { ModuleConfig } from '../types';

export const pcConfig: ModuleConfig = {
  id: '08',
  slug: 'private-capital',
  order: 8,
  icon: 'briefcase',
  title: { 
    ru: 'Частный капитал', 
    en: 'Private Capital', 
    uk: 'Приватний капітал' 
  },
  description: {
    ru: 'PE/VC фонды, обязательства, capital calls, распределения, оценки и vintage analysis',
    en: 'PE/VC funds, commitments, capital calls, distributions, valuations and vintage analysis',
    uk: 'PE/VC фонди, зобов\'язання, capital calls, розподіли, оцінки та vintage analysis'
  },
  kpis: [
    { key: 'totalCommitments', title: { ru: 'Обязательства', en: 'Total Commitments', uk: 'Зобов\'язання' }, format: 'currency', status: 'ok', linkToList: true },
    { key: 'unfunded', title: { ru: 'Невыбрано', en: 'Unfunded', uk: 'Невибрано' }, format: 'currency', status: 'warning', linkToList: true },
    { key: 'calls30d', title: { ru: 'Calls 30д', en: 'Calls 30d', uk: 'Calls 30д' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'distributions30d', title: { ru: 'Распределения 30д', en: 'Distributions 30d', uk: 'Розподіли 30д' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'navTotal', title: { ru: 'NAV', en: 'NAV Total', uk: 'NAV' }, format: 'currency', status: 'ok', linkToList: true },
    { key: 'staleValuations', title: { ru: 'Устаревшие оценки', en: 'Stale Valuations', uk: 'Застарілі оцінки' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'missingDocs', title: { ru: 'Нет документов', en: 'Missing Docs', uk: 'Немає документів' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'underperformingVintages', title: { ru: 'Отстающие vintages', en: 'Underperforming', uk: 'Відстаючі vintages' }, format: 'number', status: 'warning', linkToList: true }
  ],
  columns: [
    { key: 'name', header: { ru: 'Фонд', en: 'Fund', uk: 'Фонд' } },
    { key: 'strategy', header: { ru: 'Стратегия', en: 'Strategy', uk: 'Стратегія' } },
    { key: 'vintageYear', header: { ru: 'Vintage', en: 'Vintage', uk: 'Vintage' } },
    { key: 'commitment', header: { ru: 'Обязательство', en: 'Commitment', uk: 'Зобов\'язання' }, type: 'currency' },
    { key: 'nav', header: { ru: 'NAV', en: 'NAV', uk: 'NAV' }, type: 'currency' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' }
  ],
  actions: [
    { key: 'addFund', label: { ru: 'Добавить фонд', en: 'Add Fund', uk: 'Додати фонд' }, variant: 'primary' },
    { key: 'addCommitment', label: { ru: 'Добавить обязательство', en: 'Add Commitment', uk: 'Додати зобов\'язання' }, variant: 'secondary' },
    { key: 'createCall', label: { ru: 'Создать capital call', en: 'Create Capital Call', uk: 'Створити capital call' }, variant: 'secondary' },
    { key: 'createDistribution', label: { ru: 'Создать распределение', en: 'Create Distribution', uk: 'Створити розподіл' }, variant: 'secondary' },
    { key: 'addValuation', label: { ru: 'Добавить оценку', en: 'Add Valuation', uk: 'Додати оцінку' }, variant: 'secondary' },
    { key: 'importExcel', label: { ru: 'Импорт из Excel', en: 'Import Excel', uk: 'Імпорт з Excel' }, variant: 'ghost' },
    { key: 'connectArch', label: { ru: 'Подключить Arch', en: 'Connect Arch', uk: 'Підключити Arch' }, variant: 'ghost' }
  ]
};

export default pcConfig;
