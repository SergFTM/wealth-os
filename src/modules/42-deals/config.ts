import { ModuleConfig } from '../types';

export const dealsCorpActionsConfig: ModuleConfig = {
  id: '42',
  slug: 'deals',
  order: 42,
  icon: 'handshake',
  title: {
    ru: 'Сделки',
    en: 'Deals & Corporate Actions',
    uk: 'Угоди',
  },
  description: {
    ru: 'Корпоративные действия, private deals и события фондов. Workflow согласований, документы, влияние на капитал.',
    en: 'Corporate actions, private deals and fund events. Approval workflows, documents, capital impact.',
    uk: 'Корпоративні дії, private deals та події фондів. Workflow погоджень, документи, вплив на капітал.',
  },
  disclaimer: {
    ru: 'Deal документы информационные. Не является юридической или инвестиционной консультацией.',
    en: 'Deal documents are informational. Not legal or investment advice.',
    uk: 'Deal документи інформаційні. Не є юридичною або інвестиційною консультацією.',
  },
  color: '#10B981',
  enabled: true,
  collections: [
    'dlCorporateActions',
    'dlPrivateDeals',
    'dlFundEvents',
    'dlChecklists',
    'dlApprovals',
    'dlDocs',
  ],
  kpis: [
    {
      key: 'upcomingActions',
      title: { ru: 'Corporate actions', en: 'Corporate Actions', uk: 'Corporate actions' },
      format: 'number',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'dealsInReview',
      title: { ru: 'Deals на рассмотрении', en: 'Deals in Review', uk: 'Deals на розгляді' },
      format: 'number',
      status: 'warning',
      linkToList: true,
    },
    {
      key: 'approvalsPending',
      title: { ru: 'Согласования ожидают', en: 'Approvals Pending', uk: 'Погодження очікують' },
      format: 'number',
      status: 'warning',
      linkToList: true,
    },
    {
      key: 'checklistsIncomplete',
      title: { ru: 'Checklists незавершены', en: 'Checklists Incomplete', uk: 'Checklists незавершені' },
      format: 'number',
      status: 'warning',
      linkToList: true,
    },
    {
      key: 'fundEventsNext30d',
      title: { ru: 'Fund events 30д', en: 'Fund Events 30d', uk: 'Fund events 30д' },
      format: 'number',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'docsMissing',
      title: { ru: 'Документы отсутствуют', en: 'Docs Missing', uk: 'Документи відсутні' },
      format: 'number',
      status: 'critical',
      linkToList: true,
    },
    {
      key: 'glPostingsPending',
      title: { ru: 'GL проводки ожидают', en: 'GL Postings Pending', uk: 'GL проводки очікують' },
      format: 'number',
      status: 'warning',
      linkToList: true,
    },
    {
      key: 'taxImpactFlagged',
      title: { ru: 'Tax impact', en: 'Tax Impact Flagged', uk: 'Tax impact' },
      format: 'number',
      status: 'critical',
      linkToList: true,
    },
  ],
  columns: [
    { key: 'name', header: { ru: 'Название', en: 'Name', uk: 'Назва' } },
    { key: 'type', header: { ru: 'Тип', en: 'Type', uk: 'Тип' } },
    { key: 'stage', header: { ru: 'Стадия', en: 'Stage', uk: 'Стадія' }, type: 'badge' },
    { key: 'amount', header: { ru: 'Сумма', en: 'Amount', uk: 'Сума' }, type: 'currency' },
    { key: 'effectiveDate', header: { ru: 'Дата', en: 'Date', uk: 'Дата' }, type: 'date' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
  ],
  tabs: [
    { key: 'actions', label: { ru: 'Corporate Actions', en: 'Corporate Actions', uk: 'Corporate Actions' } },
    { key: 'deals', label: { ru: 'Private Deals', en: 'Private Deals', uk: 'Private Deals' } },
    { key: 'fund_events', label: { ru: 'События фондов', en: 'Fund Events', uk: 'Події фондів' } },
    { key: 'checklists', label: { ru: 'Checklists', en: 'Checklists', uk: 'Checklists' } },
    { key: 'approvals', label: { ru: 'Согласования', en: 'Approvals', uk: 'Погодження' } },
    { key: 'documents', label: { ru: 'Документы', en: 'Documents', uk: 'Документи' } },
    { key: 'audit', label: { ru: 'Audit', en: 'Audit', uk: 'Audit' } },
  ],
  actions: [
    { key: 'createAction', label: { ru: 'Создать corporate action', en: 'Create Corporate Action', uk: 'Створити corporate action' }, variant: 'primary' },
    { key: 'createDeal', label: { ru: 'Создать deal', en: 'Create Deal', uk: 'Створити deal' }, variant: 'secondary' },
    { key: 'createFundEvent', label: { ru: 'Создать fund event', en: 'Create Fund Event', uk: 'Створити fund event' }, variant: 'secondary' },
    { key: 'createChecklist', label: { ru: 'Создать checklist', en: 'Create Checklist', uk: 'Створити checklist' }, variant: 'secondary' },
    { key: 'requestApproval', label: { ru: 'Запросить согласование', en: 'Request Approval', uk: 'Запросити погодження' }, variant: 'ghost' },
    { key: 'generateDemo', label: { ru: 'Demo deals', en: 'Demo Deals', uk: 'Demo deals' }, variant: 'ghost' },
  ],
  routes: {
    dashboard: '/m/deals',
    list: '/m/deals/list',
    action: '/m/deals/action/[id]',
    deal: '/m/deals/deal/[id]',
    fundEvent: '/m/deals/fund-event/[id]',
  },
};

// Corporate Action Types
export const CORPORATE_ACTION_TYPES = [
  { id: 'dividend', label: { ru: 'Дивиденд', en: 'Dividend', uk: 'Дивіденд' } },
  { id: 'split', label: { ru: 'Сплит', en: 'Split', uk: 'Спліт' } },
  { id: 'reverse_split', label: { ru: 'Обратный сплит', en: 'Reverse Split', uk: 'Зворотний спліт' } },
  { id: 'merger', label: { ru: 'Слияние', en: 'Merger', uk: 'Злиття' } },
  { id: 'acquisition', label: { ru: 'Поглощение', en: 'Acquisition', uk: 'Поглинання' } },
  { id: 'tender', label: { ru: 'Тендерное предложение', en: 'Tender Offer', uk: 'Тендерна пропозиція' } },
  { id: 'spin_off', label: { ru: 'Спин-офф', en: 'Spin-off', uk: 'Спін-офф' } },
  { id: 'rights_issue', label: { ru: 'Выпуск прав', en: 'Rights Issue', uk: 'Випуск прав' } },
  { id: 'name_change', label: { ru: 'Смена названия', en: 'Name Change', uk: 'Зміна назви' } },
  { id: 'symbol_change', label: { ru: 'Смена тикера', en: 'Symbol Change', uk: 'Зміна тікера' } },
];

// Private Deal Types
export const PRIVATE_DEAL_TYPES = [
  { id: 'subscription', label: { ru: 'Подписка', en: 'Subscription', uk: 'Підписка' } },
  { id: 'secondary', label: { ru: 'Secondary', en: 'Secondary', uk: 'Secondary' } },
  { id: 'co_invest', label: { ru: 'Co-investment', en: 'Co-investment', uk: 'Co-investment' } },
  { id: 'spv', label: { ru: 'SPV', en: 'SPV', uk: 'SPV' } },
  { id: 'direct', label: { ru: 'Прямая инвестиция', en: 'Direct Investment', uk: 'Пряма інвестиція' } },
  { id: 'fund_commitment', label: { ru: 'Commitment в фонд', en: 'Fund Commitment', uk: 'Commitment в фонд' } },
];

// Deal Stages
export const DEAL_STAGES = [
  { id: 'draft', label: { ru: 'Черновик', en: 'Draft', uk: 'Чернетка' }, order: 1 },
  { id: 'in_review', label: { ru: 'На рассмотрении', en: 'In Review', uk: 'На розгляді' }, order: 2 },
  { id: 'approved', label: { ru: 'Утверждено', en: 'Approved', uk: 'Затверджено' }, order: 3 },
  { id: 'executed', label: { ru: 'Исполнено', en: 'Executed', uk: 'Виконано' }, order: 4 },
  { id: 'closed', label: { ru: 'Закрыто', en: 'Closed', uk: 'Закрито' }, order: 5 },
];

// Fund Event Types
export const FUND_EVENT_TYPES = [
  { id: 'capital_call', label: { ru: 'Capital call', en: 'Capital Call', uk: 'Capital call' } },
  { id: 'distribution', label: { ru: 'Distribution', en: 'Distribution', uk: 'Distribution' } },
  { id: 'nav_update', label: { ru: 'NAV update', en: 'NAV Update', uk: 'NAV update' } },
  { id: 'recallable', label: { ru: 'Recallable distribution', en: 'Recallable Distribution', uk: 'Recallable distribution' } },
  { id: 'equalization', label: { ru: 'Equalization', en: 'Equalization', uk: 'Equalization' } },
];

// Approval Roles
export const APPROVAL_ROLES = [
  { id: 'cio', label: { ru: 'CIO', en: 'CIO', uk: 'CIO' } },
  { id: 'cfo', label: { ru: 'CFO', en: 'CFO', uk: 'CFO' } },
  { id: 'controller', label: { ru: 'Controller', en: 'Controller', uk: 'Controller' } },
  { id: 'compliance', label: { ru: 'Compliance', en: 'Compliance', uk: 'Compliance' } },
  { id: 'legal', label: { ru: 'Legal', en: 'Legal', uk: 'Legal' } },
  { id: 'ic', label: { ru: 'Investment Committee', en: 'Investment Committee', uk: 'Investment Committee' } },
  { id: 'tax', label: { ru: 'Tax', en: 'Tax', uk: 'Tax' } },
];

// Checklist Item Statuses
export const CHECKLIST_ITEM_STATUSES = [
  { id: 'pending', label: { ru: 'Ожидает', en: 'Pending', uk: 'Очікує' } },
  { id: 'in_progress', label: { ru: 'В процессе', en: 'In Progress', uk: 'В процесі' } },
  { id: 'completed', label: { ru: 'Завершено', en: 'Completed', uk: 'Завершено' } },
  { id: 'blocked', label: { ru: 'Заблокировано', en: 'Blocked', uk: 'Заблоковано' } },
  { id: 'na', label: { ru: 'N/A', en: 'N/A', uk: 'N/A' } },
];

// Document Statuses
export const DOC_STATUSES = [
  { id: 'missing', label: { ru: 'Отсутствует', en: 'Missing', uk: 'Відсутній' } },
  { id: 'received', label: { ru: 'Получен', en: 'Received', uk: 'Отриманий' } },
  { id: 'under_review', label: { ru: 'На проверке', en: 'Under Review', uk: 'На перевірці' } },
  { id: 'approved', label: { ru: 'Одобрен', en: 'Approved', uk: 'Схвалений' } },
];

export const config = dealsCorpActionsConfig;
