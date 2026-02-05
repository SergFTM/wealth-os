import { ModuleConfig } from '../types';

export const dealsConfig: ModuleConfig = {
  id: '29',
  slug: 'deals',
  order: 29,
  icon: 'handshake',
  title: {
    ru: 'Сделки',
    en: 'Deals',
    uk: 'Угоди'
  },
  description: {
    ru: 'Сделки, корпоративные действия и капитальные события. Учет транзакций, согласования, влияние на капитал.',
    en: 'Deals, corporate actions and capital events. Transaction tracking, approvals, capital impact.',
    uk: 'Угоди, корпоративні дії та капітальні події. Облік транзакцій, погодження, вплив на капітал.'
  },
  kpis: [
    {
      key: 'activeDeals',
      title: { ru: 'Активные сделки', en: 'Active Deals', uk: 'Активні угоди' },
      format: 'number',
      status: 'ok',
      linkToList: true
    },
    {
      key: 'pendingApprovals',
      title: { ru: 'Ожидают согласования', en: 'Pending Approvals', uk: 'Очікують погодження' },
      format: 'number',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'transactions30d',
      title: { ru: 'Транзакции 30д', en: 'Transactions 30d', uk: 'Транзакції 30д' },
      format: 'number',
      status: 'ok',
      linkToList: true
    },
    {
      key: 'upcomingActions',
      title: { ru: 'Предстоящие действия', en: 'Upcoming Actions', uk: 'Майбутні дії' },
      format: 'number',
      status: 'ok',
      linkToList: true
    },
    {
      key: 'openEvents',
      title: { ru: 'Открытые события', en: 'Open Events', uk: 'Відкриті події' },
      format: 'number',
      status: 'ok',
      linkToList: true
    },
    {
      key: 'missingDocs',
      title: { ru: 'Документы отсутствуют', en: 'Missing Docs', uk: 'Відсутні документи' },
      format: 'number',
      status: 'critical',
      linkToList: true
    },
    {
      key: 'unpostedImpact',
      title: { ru: 'Не проведено', en: 'Unposted', uk: 'Не проведено' },
      format: 'number',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'closedDeals90d',
      title: { ru: 'Закрыто за 90д', en: 'Closed 90d', uk: 'Закрито за 90д' },
      format: 'number',
      status: 'ok',
      linkToList: true
    }
  ],
  columns: [
    { key: 'dealNumber', header: { ru: 'Номер', en: 'Number', uk: 'Номер' } },
    { key: 'name', header: { ru: 'Название', en: 'Name', uk: 'Назва' } },
    { key: 'assetType', header: { ru: 'Тип актива', en: 'Asset Type', uk: 'Тип активу' } },
    { key: 'stage', header: { ru: 'Стадия', en: 'Stage', uk: 'Стадія' }, type: 'badge' },
    { key: 'estimatedValue', header: { ru: 'Оценка', en: 'Est. Value', uk: 'Оцінка' }, type: 'currency' },
    { key: 'expectedCloseAt', header: { ru: 'Дата закрытия', en: 'Close Date', uk: 'Дата закриття' }, type: 'date' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' }
  ],
  actions: [
    { key: 'create', label: { ru: 'Создать сделку', en: 'Create Deal', uk: 'Створити угоду' }, variant: 'primary' },
    { key: 'addTransaction', label: { ru: 'Добавить транзакцию', en: 'Add Transaction', uk: 'Додати транзакцію' }, variant: 'secondary' },
    { key: 'addAction', label: { ru: 'Добавить действие', en: 'Add Action', uk: 'Додати дію' }, variant: 'secondary' },
    { key: 'addEvent', label: { ru: 'Добавить событие', en: 'Add Event', uk: 'Додати подію' }, variant: 'secondary' },
    { key: 'requestApproval', label: { ru: 'Запросить согласование', en: 'Request Approval', uk: 'Запросити погодження' }, variant: 'secondary' }
  ]
};

export const DEAL_STAGES = [
  { id: 'sourcing', name: { ru: 'Поиск', en: 'Sourcing', uk: 'Пошук' }, orderIndex: 1, isClosedStage: false },
  { id: 'screening', name: { ru: 'Скрининг', en: 'Screening', uk: 'Скринінг' }, orderIndex: 2, isClosedStage: false },
  { id: 'ic-review', name: { ru: 'Комитет', en: 'IC Review', uk: 'Комітет' }, orderIndex: 3, isClosedStage: false },
  { id: 'legal', name: { ru: 'Юридическая', en: 'Legal', uk: 'Юридична' }, orderIndex: 4, isClosedStage: false },
  { id: 'closing', name: { ru: 'Закрытие', en: 'Closing', uk: 'Закриття' }, orderIndex: 5, isClosedStage: false },
  { id: 'post-close', name: { ru: 'Пост-закрытие', en: 'Post-close', uk: 'Пост-закриття' }, orderIndex: 6, isClosedStage: false },
  { id: 'closed', name: { ru: 'Закрыто', en: 'Closed', uk: 'Закрито' }, orderIndex: 7, isClosedStage: true }
];

export const ASSET_TYPES = [
  { id: 'private-equity', label: { ru: 'Private Equity', en: 'Private Equity', uk: 'Private Equity' } },
  { id: 'venture', label: { ru: 'Венчур', en: 'Venture', uk: 'Венчур' } },
  { id: 'real-estate', label: { ru: 'Недвижимость', en: 'Real Estate', uk: 'Нерухомість' } },
  { id: 'public', label: { ru: 'Публичные', en: 'Public', uk: 'Публічні' } },
  { id: 'debt', label: { ru: 'Долговые', en: 'Debt', uk: 'Боргові' } },
  { id: 'infrastructure', label: { ru: 'Инфраструктура', en: 'Infrastructure', uk: 'Інфраструктура' } }
];

export const TX_TYPES = [
  { id: 'buy', label: { ru: 'Покупка', en: 'Buy', uk: 'Купівля' } },
  { id: 'sell', label: { ru: 'Продажа', en: 'Sell', uk: 'Продаж' } },
  { id: 'fee', label: { ru: 'Комиссия', en: 'Fee', uk: 'Комісія' } },
  { id: 'distribution', label: { ru: 'Распределение', en: 'Distribution', uk: 'Розподіл' } },
  { id: 'call', label: { ru: 'Вызов капитала', en: 'Capital Call', uk: 'Виклик капіталу' } },
  { id: 'dividend', label: { ru: 'Дивиденд', en: 'Dividend', uk: 'Дивіденд' } }
];

export const CA_TYPES = [
  { id: 'dividend', label: { ru: 'Дивиденд', en: 'Dividend', uk: 'Дивіденд' } },
  { id: 'split', label: { ru: 'Сплит', en: 'Split', uk: 'Спліт' } },
  { id: 'merger', label: { ru: 'Слияние', en: 'Merger', uk: 'Злиття' } },
  { id: 'spin-off', label: { ru: 'Спин-офф', en: 'Spin-off', uk: 'Спін-офф' } },
  { id: 'rights-issue', label: { ru: 'Права', en: 'Rights Issue', uk: 'Права' } },
  { id: 'tender', label: { ru: 'Тендер', en: 'Tender', uk: 'Тендер' } }
];

export const CE_TYPES = [
  { id: 'capital_call', label: { ru: 'Вызов капитала', en: 'Capital Call', uk: 'Виклик капіталу' } },
  { id: 'distribution', label: { ru: 'Распределение', en: 'Distribution', uk: 'Розподіл' } },
  { id: 'valuation', label: { ru: 'Оценка', en: 'Valuation', uk: 'Оцінка' } },
  { id: 'funding_round', label: { ru: 'Раунд', en: 'Funding Round', uk: 'Раунд' } }
];

export const APPROVAL_TYPES = [
  { id: 'ic', label: { ru: 'Инвестиционный комитет', en: 'Investment Committee', uk: 'Інвестиційний комітет' } },
  { id: 'legal', label: { ru: 'Юридический', en: 'Legal', uk: 'Юридичний' } },
  { id: 'cfo', label: { ru: 'CFO', en: 'CFO', uk: 'CFO' } },
  { id: 'compliance', label: { ru: 'Комплаенс', en: 'Compliance', uk: 'Комплаєнс' } },
  { id: 'cio', label: { ru: 'CIO', en: 'CIO', uk: 'CIO' } }
];

export const DOC_TYPES = [
  { id: 'term-sheet', label: { ru: 'Term Sheet', en: 'Term Sheet', uk: 'Term Sheet' } },
  { id: 'spa', label: { ru: 'SPA', en: 'SPA', uk: 'SPA' } },
  { id: 'memo', label: { ru: 'Меморандум', en: 'Memo', uk: 'Меморандум' } },
  { id: 'diligence', label: { ru: 'Due Diligence', en: 'Due Diligence', uk: 'Due Diligence' } },
  { id: 'legal-opinion', label: { ru: 'Юр. заключение', en: 'Legal Opinion', uk: 'Юр. висновок' } },
  { id: 'valuation', label: { ru: 'Оценка', en: 'Valuation', uk: 'Оцінка' } },
  { id: 'closing-docs', label: { ru: 'Документы закрытия', en: 'Closing Docs', uk: 'Документи закриття' } }
];

export default dealsConfig;
