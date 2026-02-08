import { ModuleConfig } from '../types';

export const creditConfig: ModuleConfig = {
  id: '50',
  slug: 'credit',
  order: 50,
  icon: 'landmark',
  color: 'emerald',
  enabled: true,

  title: {
    ru: 'Кредиты',
    en: 'Credit',
    uk: 'Кредити'
  },

  description: {
    ru: 'Управление банковскими отношениями, кредитами и ковенантами',
    en: 'Banking relationships, loans and covenant management',
    uk: 'Управління банківськими відносинами, кредитами та ковенантами'
  },

  disclaimer: {
    ru: 'Не является финансовой рекомендацией. Условия кредитов требуют подтверждения банком и юристами.',
    en: 'Not financial advice. Loan terms require confirmation from banks and lawyers.',
    uk: 'Не є фінансовою рекомендацією. Умови кредитів потребують підтвердження банком та юристами.'
  },

  kpis: [
    {
      key: 'totalDebtOutstanding',
      title: { ru: 'Общий долг', en: 'Total Debt', uk: 'Загальний борг' },
      format: 'currency',
      status: 'ok',
      linkToList: true
    },
    {
      key: 'paymentsDue30d',
      title: { ru: 'Платежи 30д', en: 'Payments 30d', uk: 'Платежі 30д' },
      format: 'currency',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'covenantsAtRisk',
      title: { ru: 'Ковенанты at risk', en: 'Covenants at Risk', uk: 'Ковенанти at risk' },
      format: 'number',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'breachesOpen',
      title: { ru: 'Нарушения', en: 'Breaches', uk: 'Порушення' },
      format: 'number',
      status: 'critical',
      linkToList: true
    },
    {
      key: 'ltvAboveTarget',
      title: { ru: 'LTV выше целевого', en: 'LTV Above Target', uk: 'LTV вище цільового' },
      format: 'number',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'facilitiesMaturing180d',
      title: { ru: 'Погашения 180д', en: 'Maturing 180d', uk: 'Погашення 180д' },
      format: 'number',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'interestCostYtd',
      title: { ru: 'Проценты YTD', en: 'Interest YTD', uk: 'Відсотки YTD' },
      format: 'currency',
      status: 'info',
      linkToList: true
    },
    {
      key: 'missingDocs',
      title: { ru: 'Нет документов', en: 'Missing Docs', uk: 'Немає документів' },
      format: 'number',
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
      key: 'bank',
      header: { ru: 'Банк', en: 'Bank', uk: 'Банк' },
      width: 'w-32'
    },
    {
      key: 'principal',
      header: { ru: 'Основной долг', en: 'Principal', uk: 'Основний борг' },
      type: 'currency',
      width: 'w-28'
    },
    {
      key: 'rate',
      header: { ru: 'Ставка', en: 'Rate', uk: 'Ставка' },
      width: 'w-20'
    },
    {
      key: 'maturity',
      header: { ru: 'Погашение', en: 'Maturity', uk: 'Погашення' },
      type: 'date',
      width: 'w-28'
    },
    {
      key: 'status',
      header: { ru: 'Статус', en: 'Status', uk: 'Статус' },
      type: 'status',
      width: 'w-24'
    }
  ],

  actions: [
    {
      key: 'createBank',
      label: { ru: 'Создать банк', en: 'Create Bank', uk: 'Створити банк' },
      icon: 'plus',
      variant: 'primary'
    },
    {
      key: 'createFacility',
      label: { ru: 'Создать facility', en: 'Create Facility', uk: 'Створити facility' },
      icon: 'plus-circle',
      variant: 'secondary'
    },
    {
      key: 'createLoan',
      label: { ru: 'Создать loan', en: 'Create Loan', uk: 'Створити loan' },
      icon: 'plus-circle',
      variant: 'secondary'
    },
    {
      key: 'addCollateral',
      label: { ru: 'Добавить залог', en: 'Add Collateral', uk: 'Додати заставу' },
      icon: 'shield',
      variant: 'secondary'
    },
    {
      key: 'addCovenant',
      label: { ru: 'Добавить ковенант', en: 'Add Covenant', uk: 'Додати ковенант' },
      icon: 'check-circle',
      variant: 'secondary'
    },
    {
      key: 'schedulePayment',
      label: { ru: 'Запланировать платеж', en: 'Schedule Payment', uk: 'Запланувати платіж' },
      icon: 'calendar',
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
    'creditBanks',
    'creditFacilities',
    'creditLoans',
    'creditCollateral',
    'creditCovenants',
    'creditPayments',
    'creditSchedules',
    'documents',
    'calendarEvents',
    'liquidityAlerts',
    'glTransactions',
    'vdVendors',
    'exceptions',
    'auditEvents',
    'notifications'
  ],

  routes: {
    dashboard: '/m/credit',
    list: '/m/credit/list',
    bankDetail: '/m/credit/bank/[id]',
    facilityDetail: '/m/credit/facility/[id]',
    loanDetail: '/m/credit/loan/[id]',
    collateralDetail: '/m/credit/collateral/[id]',
    covenantDetail: '/m/credit/covenant/[id]',
    paymentDetail: '/m/credit/payment/[id]'
  },

  tabs: [
    { key: 'banks', label: { ru: 'Банки', en: 'Banks', uk: 'Банки' } },
    { key: 'facilities', label: { ru: 'Facilities', en: 'Facilities', uk: 'Facilities' } },
    { key: 'loans', label: { ru: 'Займы', en: 'Loans', uk: 'Позики' } },
    { key: 'collateral', label: { ru: 'Залог', en: 'Collateral', uk: 'Застава' } },
    { key: 'covenants', label: { ru: 'Ковенанты', en: 'Covenants', uk: 'Ковенанти' } },
    { key: 'payments', label: { ru: 'Платежи', en: 'Payments', uk: 'Платежі' } },
    { key: 'calendar', label: { ru: 'Календарь', en: 'Calendar', uk: 'Календар' } },
    { key: 'analytics', label: { ru: 'Аналитика', en: 'Analytics', uk: 'Аналітика' } },
    { key: 'audit', label: { ru: 'Аудит', en: 'Audit', uk: 'Аудит' } }
  ],

  adminOnly: false,
  clientSafeHidden: true
};

// Bank regions
export const BANK_REGIONS = {
  us: { ru: 'США', en: 'USA', uk: 'США', color: 'blue' },
  eu: { ru: 'Европа', en: 'Europe', uk: 'Європа', color: 'green' },
  uk: { ru: 'Великобритания', en: 'UK', uk: 'Великобританія', color: 'purple' },
  ch: { ru: 'Швейцария', en: 'Switzerland', uk: 'Швейцарія', color: 'red' },
  sg: { ru: 'Сингапур', en: 'Singapore', uk: 'Сінгапур', color: 'amber' },
  other: { ru: 'Другой', en: 'Other', uk: 'Інший', color: 'gray' }
};

// Facility types
export const FACILITY_TYPES = {
  revolver: { ru: 'Револьвер', en: 'Revolver', uk: 'Револьвер', color: 'blue' },
  term: { ru: 'Срочный', en: 'Term', uk: 'Строковий', color: 'green' },
  margin: { ru: 'Маржин', en: 'Margin', uk: 'Маржин', color: 'amber' },
  lombard: { ru: 'Ломбард', en: 'Lombard', uk: 'Ломбард', color: 'purple' },
  bridge: { ru: 'Бридж', en: 'Bridge', uk: 'Бридж', color: 'orange' },
  construction: { ru: 'Строительный', en: 'Construction', uk: 'Будівельний', color: 'teal' }
};

// Facility statuses
export const FACILITY_STATUSES = {
  active: { ru: 'Активный', en: 'Active', uk: 'Активний', color: 'green' },
  closed: { ru: 'Закрыт', en: 'Closed', uk: 'Закритий', color: 'gray' },
  pending: { ru: 'Ожидает', en: 'Pending', uk: 'Очікує', color: 'amber' }
};

// Loan statuses
export const LOAN_STATUSES = {
  active: { ru: 'Активный', en: 'Active', uk: 'Активний', color: 'green' },
  paid_off: { ru: 'Погашен', en: 'Paid Off', uk: 'Погашений', color: 'blue' },
  default: { ru: 'Дефолт', en: 'Default', uk: 'Дефолт', color: 'red' }
};

// Rate types
export const RATE_TYPES = {
  fixed: { ru: 'Фиксированная', en: 'Fixed', uk: 'Фіксована', color: 'blue' },
  floating: { ru: 'Плавающая', en: 'Floating', uk: 'Плаваюча', color: 'amber' }
};

// Base rates
export const BASE_RATES = {
  sofr: { ru: 'SOFR', en: 'SOFR', uk: 'SOFR' },
  euribor: { ru: 'EURIBOR', en: 'EURIBOR', uk: 'EURIBOR' },
  sonia: { ru: 'SONIA', en: 'SONIA', uk: 'SONIA' },
  prime: { ru: 'Prime', en: 'Prime', uk: 'Prime' },
  libor: { ru: 'LIBOR (legacy)', en: 'LIBOR (legacy)', uk: 'LIBOR (legacy)' }
};

// Amortization types
export const AMORTIZATION_TYPES = {
  interest_only: { ru: 'Только проценты', en: 'Interest Only', uk: 'Тільки відсотки', color: 'blue' },
  amortizing: { ru: 'Амортизируемый', en: 'Amortizing', uk: 'Амортизований', color: 'green' },
  bullet: { ru: 'Bullet', en: 'Bullet', uk: 'Bullet', color: 'amber' }
};

// Payment frequencies
export const PAYMENT_FREQUENCIES = {
  monthly: { ru: 'Ежемесячно', en: 'Monthly', uk: 'Щомісяця' },
  quarterly: { ru: 'Ежеквартально', en: 'Quarterly', uk: 'Щоквартально' },
  semi_annual: { ru: 'Полугодовой', en: 'Semi-Annual', uk: 'Піврічний' },
  annual: { ru: 'Ежегодно', en: 'Annually', uk: 'Щорічно' }
};

// Collateral types
export const COLLATERAL_TYPES = {
  cash: { ru: 'Денежные средства', en: 'Cash', uk: 'Грошові кошти', color: 'green' },
  securities: { ru: 'Ценные бумаги', en: 'Securities', uk: 'Цінні папери', color: 'blue' },
  real_estate: { ru: 'Недвижимость', en: 'Real Estate', uk: 'Нерухомість', color: 'amber' },
  equipment: { ru: 'Оборудование', en: 'Equipment', uk: 'Обладнання', color: 'purple' },
  inventory: { ru: 'Товарные запасы', en: 'Inventory', uk: 'Товарні запаси', color: 'teal' },
  receivables: { ru: 'Дебиторская задолженность', en: 'Receivables', uk: 'Дебіторська заборгованість', color: 'orange' },
  other: { ru: 'Прочее', en: 'Other', uk: 'Інше', color: 'gray' }
};

// Collateral statuses
export const COLLATERAL_STATUSES = {
  ok: { ru: 'OK', en: 'OK', uk: 'OK', color: 'green' },
  at_risk: { ru: 'At Risk', en: 'At Risk', uk: 'At Risk', color: 'amber' },
  breach: { ru: 'Breach', en: 'Breach', uk: 'Breach', color: 'red' }
};

// Covenant types
export const COVENANT_TYPES = {
  min_liquidity: { ru: 'Мин. ликвидность', en: 'Min Liquidity', uk: 'Мін. ліквідність' },
  max_ltv: { ru: 'Макс. LTV', en: 'Max LTV', uk: 'Макс. LTV' },
  min_net_worth: { ru: 'Мин. чистая стоимость', en: 'Min Net Worth', uk: 'Мін. чиста вартість' },
  max_leverage: { ru: 'Макс. leverage', en: 'Max Leverage', uk: 'Макс. leverage' },
  min_ebitda: { ru: 'Мин. EBITDA', en: 'Min EBITDA', uk: 'Мін. EBITDA' },
  debt_service_coverage: { ru: 'DSCR', en: 'DSCR', uk: 'DSCR' },
  other: { ru: 'Другой', en: 'Other', uk: 'Інший' }
};

// Covenant statuses
export const COVENANT_STATUSES = {
  ok: { ru: 'OK', en: 'OK', uk: 'OK', color: 'green' },
  at_risk: { ru: 'At Risk', en: 'At Risk', uk: 'At Risk', color: 'amber' },
  breach: { ru: 'Breach', en: 'Breach', uk: 'Breach', color: 'red' }
};

// Covenant test frequencies
export const TEST_FREQUENCIES = {
  monthly: { ru: 'Ежемесячно', en: 'Monthly', uk: 'Щомісяця' },
  quarterly: { ru: 'Ежеквартально', en: 'Quarterly', uk: 'Щоквартально' },
  semi_annual: { ru: 'Полугодовой', en: 'Semi-Annual', uk: 'Піврічний' },
  annual: { ru: 'Ежегодно', en: 'Annually', uk: 'Щорічно' }
};

// Waiver statuses
export const WAIVER_STATUSES = {
  none: { ru: 'Нет', en: 'None', uk: 'Немає', color: 'gray' },
  requested: { ru: 'Запрошен', en: 'Requested', uk: 'Запитаний', color: 'amber' },
  granted: { ru: 'Получен', en: 'Granted', uk: 'Отриманий', color: 'green' },
  denied: { ru: 'Отказано', en: 'Denied', uk: 'Відмовлено', color: 'red' }
};

// Payment statuses
export const PAYMENT_STATUSES = {
  scheduled: { ru: 'Запланирован', en: 'Scheduled', uk: 'Заплановано', color: 'blue' },
  paid: { ru: 'Оплачен', en: 'Paid', uk: 'Оплачено', color: 'green' },
  late: { ru: 'Просрочен', en: 'Late', uk: 'Прострочено', color: 'red' },
  partial: { ru: 'Частично', en: 'Partial', uk: 'Частково', color: 'amber' }
};

// Currencies
export const CURRENCIES = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'RUB', 'UAH'];

export default creditConfig;
