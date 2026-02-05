import { ModuleConfig } from '../types';

export const liquidityPlanningConfig: ModuleConfig = {
  id: '39',
  slug: 'liquidity',
  order: 39,
  icon: 'droplet',
  color: 'teal',
  enabled: true,

  title: {
    ru: 'Ликвидность',
    en: 'Liquidity',
    uk: 'Ліквідність'
  },

  description: {
    ru: 'Планирование ликвидности, Cash Forecast, сценарии и стресс-тесты',
    en: 'Liquidity Planning, Cash Forecast, scenarios and stress tests',
    uk: 'Планування ліквідності, Cash Forecast, сценарії та стрес-тести'
  },

  disclaimer: {
    ru: 'Прогноз ликвидности основан на введенных данных и предположениях. Не является финансовой консультацией.',
    en: 'Liquidity forecast is based on input data and assumptions. This is not financial advice.',
    uk: 'Прогноз ліквідності базується на введених даних та припущеннях. Не є фінансовою консультацією.'
  },

  kpis: [
    {
      key: 'totalCashToday',
      title: { ru: 'Кэш сегодня', en: 'Cash Today', uk: 'Кеш сьогодні' },
      format: 'currency',
      status: 'ok',
      linkToList: true
    },
    {
      key: 'forecastsActive',
      title: { ru: 'Активных прогнозов', en: 'Forecasts Active', uk: 'Активних прогнозів' },
      format: 'number',
      status: 'ok',
      linkToList: true
    },
    {
      key: 'netOutflow30d',
      title: { ru: 'Нетто отток 30д', en: 'Net Outflow 30d', uk: 'Нетто відтік 30д' },
      format: 'currency',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'capitalCalls90d',
      title: { ru: 'Capital Calls 90д', en: 'Capital Calls 90d', uk: 'Capital Calls 90д' },
      format: 'currency',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'taxPayments90d',
      title: { ru: 'Налоги 90д', en: 'Tax Payments 90d', uk: 'Податки 90д' },
      format: 'currency',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'alertsCritical',
      title: { ru: 'Алерты критич.', en: 'Critical Alerts', uk: 'Алерти критич.' },
      format: 'number',
      status: 'critical',
      linkToList: true
    },
    {
      key: 'stressTests30d',
      title: { ru: 'Стресс-тесты 30д', en: 'Stress Tests 30d', uk: 'Стрес-тести 30д' },
      format: 'number',
      status: 'info',
      linkToList: true
    },
    {
      key: 'scenarioVarianceMax',
      title: { ru: 'Макс. отклонение', en: 'Max Variance', uk: 'Макс. відхилення' },
      format: 'percent',
      status: 'warning',
      linkToList: true
    }
  ],

  columns: [
    {
      key: 'name',
      header: { ru: 'Название', en: 'Name', uk: 'Назва' },
      width: 'w-48'
    },
    {
      key: 'scopeType',
      header: { ru: 'Scope', en: 'Scope', uk: 'Scope' },
      width: 'w-24'
    },
    {
      key: 'horizon',
      header: { ru: 'Горизонт', en: 'Horizon', uk: 'Горизонт' },
      width: 'w-24'
    },
    {
      key: 'scenario',
      header: { ru: 'Сценарий', en: 'Scenario', uk: 'Сценарій' },
      width: 'w-28'
    },
    {
      key: 'status',
      header: { ru: 'Статус', en: 'Status', uk: 'Статус' },
      type: 'status',
      width: 'w-24'
    },
    {
      key: 'updatedAt',
      header: { ru: 'Обновлено', en: 'Updated', uk: 'Оновлено' },
      type: 'date',
      width: 'w-28'
    }
  ],

  actions: [
    {
      key: 'createForecast',
      label: { ru: 'Создать прогноз', en: 'Create Forecast', uk: 'Створити прогноз' },
      icon: 'plus',
      variant: 'primary'
    },
    {
      key: 'addCashFlow',
      label: { ru: 'Добавить поток', en: 'Add Cash Flow', uk: 'Додати потік' },
      icon: 'plus-circle',
      variant: 'secondary'
    },
    {
      key: 'importFlows',
      label: { ru: 'Импорт потоков', en: 'Import Flows', uk: 'Імпорт потоків' },
      icon: 'upload',
      variant: 'secondary'
    },
    {
      key: 'createScenario',
      label: { ru: 'Создать сценарий', en: 'Create Scenario', uk: 'Створити сценарій' },
      icon: 'git-branch',
      variant: 'secondary'
    },
    {
      key: 'runStressTest',
      label: { ru: 'Запустить стресс', en: 'Run Stress Test', uk: 'Запустити стрес' },
      icon: 'zap',
      variant: 'secondary'
    },
    {
      key: 'generateDemo',
      label: { ru: 'Demo данные', en: 'Demo Data', uk: 'Demo дані' },
      icon: 'database',
      variant: 'ghost'
    }
  ],

  collections: [
    'cashPositions',
    'cashForecasts',
    'cashFlows',
    'cashScenarios',
    'cashStressTests',
    'liquidityAlerts',
    'glTransactions',
    'invoices',
    'payments',
    'capitalCalls',
    'distributions',
    'taxDeadlines',
    'auditEvents'
  ],

  routes: {
    dashboard: '/m/liquidity',
    list: '/m/liquidity/list',
    forecastDetail: '/m/liquidity/forecast/[id]',
    scenarioDetail: '/m/liquidity/scenario/[id]',
    alertDetail: '/m/liquidity/alert/[id]'
  },

  tabs: [
    { key: 'forecasts', label: { ru: 'Прогнозы', en: 'Forecasts', uk: 'Прогнози' } },
    { key: 'positions', label: { ru: 'Позиции кэш', en: 'Cash Positions', uk: 'Позиції кеш' } },
    { key: 'inflows', label: { ru: 'Притоки', en: 'Inflows', uk: 'Притоки' } },
    { key: 'outflows', label: { ru: 'Оттоки', en: 'Outflows', uk: 'Відтоки' } },
    { key: 'scenarios', label: { ru: 'Сценарии', en: 'Scenarios', uk: 'Сценарії' } },
    { key: 'stress', label: { ru: 'Стресс-тесты', en: 'Stress Tests', uk: 'Стрес-тести' } },
    { key: 'alerts', label: { ru: 'Алерты', en: 'Alerts', uk: 'Алерти' } },
    { key: 'audit', label: { ru: 'Аудит', en: 'Audit', uk: 'Аудит' } }
  ],

  adminOnly: false,
  clientSafeHidden: true
};

// Forecast statuses
export const FORECAST_STATUSES = {
  active: { ru: 'Активный', en: 'Active', uk: 'Активний', color: 'green' },
  draft: { ru: 'Черновик', en: 'Draft', uk: 'Чернетка', color: 'gray' },
  archived: { ru: 'Архив', en: 'Archived', uk: 'Архів', color: 'slate' }
};

// Scenario types
export const SCENARIO_TYPES = {
  base: { ru: 'Базовый', en: 'Base', uk: 'Базовий', color: 'blue' },
  conservative: { ru: 'Консервативный', en: 'Conservative', uk: 'Консервативний', color: 'amber' },
  aggressive: { ru: 'Агрессивный', en: 'Aggressive', uk: 'Агресивний', color: 'red' },
  custom: { ru: 'Пользовательский', en: 'Custom', uk: 'Користувацький', color: 'purple' }
};

// Cash flow categories
export const FLOW_CATEGORIES = {
  payroll: { ru: 'Зарплата', en: 'Payroll', uk: 'Зарплата' },
  rent: { ru: 'Аренда', en: 'Rent', uk: 'Оренда' },
  tax: { ru: 'Налоги', en: 'Tax', uk: 'Податки' },
  capital_call: { ru: 'Capital Call', en: 'Capital Call', uk: 'Capital Call' },
  distribution: { ru: 'Дистрибуция', en: 'Distribution', uk: 'Дистрибуція' },
  invoice: { ru: 'Счет', en: 'Invoice', uk: 'Рахунок' },
  debt: { ru: 'Долг', en: 'Debt', uk: 'Борг' },
  dividend: { ru: 'Дивиденды', en: 'Dividend', uk: 'Дивіденди' },
  interest: { ru: 'Проценты', en: 'Interest', uk: 'Відсотки' },
  fee: { ru: 'Комиссия', en: 'Fee', uk: 'Комісія' },
  other: { ru: 'Прочее', en: 'Other', uk: 'Інше' }
};

// Flow types
export const FLOW_TYPES = {
  inflow: { ru: 'Приток', en: 'Inflow', uk: 'Приток', color: 'green' },
  outflow: { ru: 'Отток', en: 'Outflow', uk: 'Відтік', color: 'red' }
};

// Stress test types
export const STRESS_TYPES = {
  market_drawdown: { ru: 'Рыночный спад', en: 'Market Drawdown', uk: 'Ринковий спад' },
  delayed_distributions: { ru: 'Задержка дистрибуций', en: 'Delayed Distributions', uk: 'Затримка дистрибуцій' },
  tax_spike: { ru: 'Скачок налогов', en: 'Tax Spike', uk: 'Стрибок податків' },
  debt_rate_shock: { ru: 'Шок ставок', en: 'Rate Shock', uk: 'Шок ставок' },
  capital_call_acceleration: { ru: 'Ускорение capital calls', en: 'Capital Call Acceleration', uk: 'Прискорення capital calls' }
};

// Alert severities
export const ALERT_SEVERITIES = {
  critical: { ru: 'Критический', en: 'Critical', uk: 'Критичний', color: 'red' },
  warning: { ru: 'Предупреждение', en: 'Warning', uk: 'Попередження', color: 'amber' },
  info: { ru: 'Информация', en: 'Info', uk: 'Інформація', color: 'blue' }
};

// Alert statuses
export const ALERT_STATUSES = {
  open: { ru: 'Открыт', en: 'Open', uk: 'Відкритий', color: 'red' },
  acknowledged: { ru: 'Подтверждён', en: 'Acknowledged', uk: 'Підтверджений', color: 'amber' },
  closed: { ru: 'Закрыт', en: 'Closed', uk: 'Закритий', color: 'gray' }
};

// Recurrence patterns
export const RECURRENCE_PATTERNS = {
  once: { ru: 'Однократно', en: 'Once', uk: 'Одноразово' },
  weekly: { ru: 'Еженедельно', en: 'Weekly', uk: 'Щотижня' },
  biweekly: { ru: 'Раз в 2 недели', en: 'Bi-weekly', uk: 'Раз на 2 тижні' },
  monthly: { ru: 'Ежемесячно', en: 'Monthly', uk: 'Щомісяця' },
  quarterly: { ru: 'Ежеквартально', en: 'Quarterly', uk: 'Щоквартально' },
  annually: { ru: 'Ежегодно', en: 'Annually', uk: 'Щорічно' }
};

// Currencies
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'RUB', 'UAH'];

export default liquidityPlanningConfig;
