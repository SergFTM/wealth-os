import { ModuleConfig } from '../types';

export const liquidityConfig: ModuleConfig = {
  id: '09',
  slug: 'liquidity',
  order: 9,
  icon: 'wallet',
  title: { 
    ru: 'Ликвидность и кэш', 
    en: 'Liquidity & Cash', 
    uk: 'Ліквідність і кеш' 
  },
  description: {
    ru: 'Управление денежными потоками, прогноз ликвидности, обязательства и алерты',
    en: 'Cash flow management, liquidity forecast, obligations and alerts',
    uk: 'Управління грошовими потоками, прогноз ліквідності, зобов\'язання та алерти'
  },
  kpis: [
    { key: 'totalCash', title: { ru: 'Общий кэш', en: 'Total Cash', uk: 'Загальний кеш' }, format: 'currency', status: 'ok', linkToList: true },
    { key: 'cashToday', title: { ru: 'Bucket Today', en: 'Cash Today', uk: 'Bucket Today' }, format: 'currency', status: 'ok', linkToList: true },
    { key: 'netCash30d', title: { ru: 'Нетто 30д', en: 'Net 30d', uk: 'Нетто 30д' }, format: 'currency', status: 'ok', linkToList: true },
    { key: 'upcoming7d', title: { ru: 'Платежи 7д', en: 'Upcoming 7d', uk: 'Платежі 7д' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'capitalCalls30d', title: { ru: 'Capital calls 30д', en: 'Capital Calls 30d', uk: 'Capital calls 30д' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'alertsCritical', title: { ru: 'Критич. алерты', en: 'Critical Alerts', uk: 'Критичні алерти' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'belowThreshold', title: { ru: 'Ниже порога', en: 'Below Threshold', uk: 'Нижче порогу' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'missingFeeds', title: { ru: 'Нет синка', en: 'Missing Feeds', uk: 'Немає синку' }, format: 'number', status: 'warning', linkToList: true }
  ],
  columns: [
    { key: 'name', header: { ru: 'Счет', en: 'Account', uk: 'Рахунок' } },
    { key: 'entity', header: { ru: 'Юрлицо', en: 'Entity', uk: 'Юрособа' } },
    { key: 'bank', header: { ru: 'Банк', en: 'Bank', uk: 'Банк' } },
    { key: 'currency', header: { ru: 'Валюта', en: 'Currency', uk: 'Валюта' } },
    { key: 'balance', header: { ru: 'Баланс', en: 'Balance', uk: 'Баланс' }, type: 'currency' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' }
  ],
  actions: [
    { key: 'addAccount', label: { ru: 'Добавить счет', en: 'Add Account', uk: 'Додати рахунок' }, variant: 'primary' },
    { key: 'addMovement', label: { ru: 'Добавить движение', en: 'Add Movement', uk: 'Додати рух' }, variant: 'secondary' },
    { key: 'addObligation', label: { ru: 'Добавить обязательство', en: 'Add Obligation', uk: 'Додати зобов\'язання' }, variant: 'secondary' },
    { key: 'addForecast', label: { ru: 'Добавить прогноз', en: 'Add Forecast', uk: 'Додати прогноз' }, variant: 'secondary' },
    { key: 'exportReport', label: { ru: 'Экспорт отчета', en: 'Export Report', uk: 'Експорт звіту' }, variant: 'ghost' },
    { key: 'createTask', label: { ru: 'Создать задачу', en: 'Create Task', uk: 'Створити задачу' }, variant: 'ghost' }
  ]
};

export default liquidityConfig;
