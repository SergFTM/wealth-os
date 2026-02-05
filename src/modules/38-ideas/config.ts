import { ModuleConfig } from '../types';

export const ideasConfig: ModuleConfig = {
  id: '38',
  slug: 'ideas',
  order: 38,
  icon: 'lightbulb',
  color: 'amber',
  enabled: true,

  title: {
    ru: 'Идеи',
    en: 'Ideas',
    uk: 'Ідеї'
  },

  description: {
    ru: 'Инвестиционные идеи, Watchlist и Research Hub',
    en: 'Investment Ideas, Watchlist and Research Hub',
    uk: 'Інвестиційні ідеї, Watchlist та Research Hub'
  },

  disclaimer: {
    ru: 'Инвестиционные идеи информационные. Не является индивидуальной инвестиционной рекомендацией.',
    en: 'Investment ideas are informational only. This does not constitute individual investment advice.',
    uk: 'Інвестиційні ідеї інформаційні. Не є індивідуальною інвестиційною рекомендацією.'
  },

  kpis: [
    {
      key: 'ideasActive',
      title: { ru: 'Активные идеи', en: 'Active Ideas', uk: 'Активні ідеї' },
      format: 'number',
      status: 'ok',
      linkToList: true
    },
    {
      key: 'ideasPendingCommittee',
      title: { ru: 'На рассмотрении', en: 'Pending Committee', uk: 'На розгляді' },
      format: 'number',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'watchlistsCount',
      title: { ru: 'Watchlists', en: 'Watchlists', uk: 'Watchlists' },
      format: 'number',
      status: 'info',
      linkToList: true
    },
    {
      key: 'notesLast30d',
      title: { ru: 'Заметки (30д)', en: 'Notes (30d)', uk: 'Нотатки (30д)' },
      format: 'number',
      status: 'info',
      linkToList: true
    },
    {
      key: 'memosGenerated30d',
      title: { ru: 'Мемо (30д)', en: 'Memos (30d)', uk: 'Мемо (30д)' },
      format: 'number',
      status: 'info',
      linkToList: true
    },
    {
      key: 'highRiskIdeas',
      title: { ru: 'Высокий риск', en: 'High Risk', uk: 'Високий ризик' },
      format: 'number',
      status: 'critical',
      linkToList: true
    },
    {
      key: 'outcomesTracked',
      title: { ru: 'Отслеживается', en: 'Outcomes Tracked', uk: 'Відстежується' },
      format: 'number',
      status: 'ok',
      linkToList: true
    },
    {
      key: 'missingSources',
      title: { ru: 'Без источников', en: 'Missing Sources', uk: 'Без джерел' },
      format: 'number',
      status: 'warning',
      linkToList: true
    }
  ],

  columns: [
    {
      key: 'ideaNumber',
      header: { ru: '№ Идеи', en: 'Idea #', uk: '№ Ідеї' },
      width: 'w-28'
    },
    {
      key: 'title',
      header: { ru: 'Название', en: 'Title', uk: 'Назва' },
      width: 'w-48'
    },
    {
      key: 'assetClass',
      header: { ru: 'Класс актива', en: 'Asset Class', uk: 'Клас активу' },
      width: 'w-32'
    },
    {
      key: 'horizonKey',
      header: { ru: 'Горизонт', en: 'Horizon', uk: 'Горизонт' },
      width: 'w-24'
    },
    {
      key: 'status',
      header: { ru: 'Статус', en: 'Status', uk: 'Статус' },
      type: 'status',
      width: 'w-28'
    },
    {
      key: 'riskLevel',
      header: { ru: 'Риск', en: 'Risk', uk: 'Ризик' },
      type: 'badge',
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
      key: 'createIdea',
      label: { ru: 'Создать идею', en: 'Create Idea', uk: 'Створити ідею' },
      icon: 'plus',
      variant: 'primary'
    },
    {
      key: 'createWatchlist',
      label: { ru: 'Создать watchlist', en: 'Create Watchlist', uk: 'Створити watchlist' },
      icon: 'list',
      variant: 'secondary'
    },
    {
      key: 'addNote',
      label: { ru: 'Добавить заметку', en: 'Add Note', uk: 'Додати нотатку' },
      icon: 'file-text',
      variant: 'secondary'
    },
    {
      key: 'generateMemo',
      label: { ru: 'Сгенерировать мемо', en: 'Generate Memo', uk: 'Згенерувати мемо' },
      icon: 'sparkles',
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
    'ideas',
    'watchlists',
    'watchlistItems',
    'researchNotes',
    'ideaMemos',
    'ideaOutcomes',
    'documents',
    'commThreads',
    'committeeAgendaItems',
    'committeeDecisions',
    'riskAlerts',
    'ipsPolicies',
    'tasks',
    'auditEvents'
  ],

  routes: {
    dashboard: '/m/ideas',
    list: '/m/ideas/list',
    ideaDetail: '/m/ideas/idea/[id]',
    watchlistDetail: '/m/ideas/watchlist/[id]',
    noteDetail: '/m/ideas/note/[id]',
    memoDetail: '/m/ideas/memo/[id]'
  },

  tabs: [
    { key: 'ideas', label: { ru: 'Идеи', en: 'Ideas', uk: 'Ідеї' } },
    { key: 'watchlists', label: { ru: 'Watchlists', en: 'Watchlists', uk: 'Watchlists' } },
    { key: 'notes', label: { ru: 'Заметки', en: 'Notes', uk: 'Нотатки' } },
    { key: 'memos', label: { ru: 'Мемо', en: 'Memos', uk: 'Мемо' } },
    { key: 'committee', label: { ru: 'Комитет', en: 'Committee', uk: 'Комітет' } },
    { key: 'outcomes', label: { ru: 'Результаты', en: 'Outcomes', uk: 'Результати' } },
    { key: 'audit', label: { ru: 'Аудит', en: 'Audit', uk: 'Аудит' } }
  ],

  adminOnly: false,
  clientSafeHidden: false
};

// Status options for ideas
export const IDEA_STATUSES = {
  draft: { ru: 'Черновик', en: 'Draft', uk: 'Чернетка', color: 'gray' },
  active: { ru: 'Активная', en: 'Active', uk: 'Активна', color: 'green' },
  in_committee: { ru: 'В комитете', en: 'In Committee', uk: 'В комітеті', color: 'blue' },
  approved: { ru: 'Одобрена', en: 'Approved', uk: 'Схвалена', color: 'emerald' },
  rejected: { ru: 'Отклонена', en: 'Rejected', uk: 'Відхилена', color: 'red' },
  archived: { ru: 'Архив', en: 'Archived', uk: 'Архів', color: 'slate' }
};

// Risk levels
export const RISK_LEVELS = {
  low: { ru: 'Низкий', en: 'Low', uk: 'Низький', color: 'green' },
  medium: { ru: 'Средний', en: 'Medium', uk: 'Середній', color: 'amber' },
  high: { ru: 'Высокий', en: 'High', uk: 'Високий', color: 'orange' },
  very_high: { ru: 'Очень высокий', en: 'Very High', uk: 'Дуже високий', color: 'red' }
};

// Asset classes
export const ASSET_CLASSES = {
  equity: { ru: 'Акции', en: 'Equity', uk: 'Акції' },
  fixed_income: { ru: 'Облигации', en: 'Fixed Income', uk: 'Облігації' },
  alternatives: { ru: 'Альтернативы', en: 'Alternatives', uk: 'Альтернативи' },
  real_estate: { ru: 'Недвижимость', en: 'Real Estate', uk: 'Нерухомість' },
  commodities: { ru: 'Сырьё', en: 'Commodities', uk: 'Сировина' },
  crypto: { ru: 'Крипто', en: 'Crypto', uk: 'Крипто' },
  cash: { ru: 'Кэш', en: 'Cash', uk: 'Готівка' },
  multi_asset: { ru: 'Мульти-актив', en: 'Multi-Asset', uk: 'Мульти-актив' }
};

// Time horizons
export const TIME_HORIZONS = {
  tactical: { ru: 'Тактический (до 3м)', en: 'Tactical (<3m)', uk: 'Тактичний (до 3м)' },
  short: { ru: 'Краткосрочный (3-12м)', en: 'Short (3-12m)', uk: 'Короткостроковий (3-12м)' },
  medium: { ru: 'Среднесрочный (1-3г)', en: 'Medium (1-3y)', uk: 'Середньостроковий (1-3р)' },
  long: { ru: 'Долгосрочный (3-7л)', en: 'Long (3-7y)', uk: 'Довгостроковий (3-7р)' },
  strategic: { ru: 'Стратегический (7+л)', en: 'Strategic (7+y)', uk: 'Стратегічний (7+р)' }
};

// Watchlist types
export const WATCHLIST_TYPES = {
  tickers: { ru: 'Тикеры', en: 'Tickers', uk: 'Тікери' },
  funds: { ru: 'Фонды', en: 'Funds', uk: 'Фонди' },
  deals: { ru: 'Сделки', en: 'Deals', uk: 'Угоди' },
  managers: { ru: 'Менеджеры', en: 'Managers', uk: 'Менеджери' },
  custom: { ru: 'Пользовательский', en: 'Custom', uk: 'Користувацький' }
};

// Source types for research notes
export const SOURCE_TYPES = {
  article: { ru: 'Статья', en: 'Article', uk: 'Стаття' },
  doc: { ru: 'Документ', en: 'Document', uk: 'Документ' },
  call: { ru: 'Звонок', en: 'Call', uk: 'Дзвінок' },
  meeting: { ru: 'Встреча', en: 'Meeting', uk: 'Зустріч' },
  report: { ru: 'Отчёт', en: 'Report', uk: 'Звіт' },
  screenshot: { ru: 'Скриншот', en: 'Screenshot', uk: 'Знімок' }
};

// Memo audiences
export const MEMO_AUDIENCES = {
  staff: { ru: 'Внутренний', en: 'Staff Only', uk: 'Внутрішній' },
  client_safe: { ru: 'Для клиента', en: 'Client Safe', uk: 'Для клієнта' }
};

// Outcome types
export const OUTCOME_TYPES = {
  monitored: { ru: 'Мониторинг', en: 'Monitored', uk: 'Моніторинг' },
  implemented: { ru: 'Реализована', en: 'Implemented', uk: 'Реалізована' },
  closed: { ru: 'Закрыта', en: 'Closed', uk: 'Закрита' }
};

export default ideasConfig;
