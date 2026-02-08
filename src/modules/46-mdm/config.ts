import { ModuleConfig } from '../types';

// Person type enums
export const PersonType = {
  FAMILY_MEMBER: 'family_member',
  TRUSTEE: 'trustee',
  ADVISOR: 'advisor',
  VENDOR_CONTACT: 'vendor_contact',
  BENEFICIARY: 'beneficiary',
  NOMINEE: 'nominee',
} as const;

export type PersonTypeKey = typeof PersonType[keyof typeof PersonType];

export const PersonTypeLabels: Record<PersonTypeKey, Record<string, string>> = {
  family_member: { ru: 'Член семьи', en: 'Family Member', uk: 'Член сім\'ї' },
  trustee: { ru: 'Доверительный управляющий', en: 'Trustee', uk: 'Довірчий керуючий' },
  advisor: { ru: 'Советник', en: 'Advisor', uk: 'Радник' },
  vendor_contact: { ru: 'Контакт провайдера', en: 'Vendor Contact', uk: 'Контакт провайдера' },
  beneficiary: { ru: 'Бенефициар', en: 'Beneficiary', uk: 'Бенефіціар' },
  nominee: { ru: 'Номинал', en: 'Nominee', uk: 'Номінал' },
};

// Entity type enums
export const EntityType = {
  HOUSEHOLD: 'household',
  HOLDING: 'holding',
  TRUST: 'trust',
  PARTNERSHIP: 'partnership',
  SPV: 'spv',
  FOUNDATION: 'foundation',
  LLC: 'llc',
  CORPORATION: 'corporation',
} as const;

export type EntityTypeKey = typeof EntityType[keyof typeof EntityType];

export const EntityTypeLabels: Record<EntityTypeKey, Record<string, string>> = {
  household: { ru: 'Домохозяйство', en: 'Household', uk: 'Домогосподарство' },
  holding: { ru: 'Холдинг', en: 'Holding', uk: 'Холдинг' },
  trust: { ru: 'Траст', en: 'Trust', uk: 'Траст' },
  partnership: { ru: 'Партнерство', en: 'Partnership', uk: 'Партнерство' },
  spv: { ru: 'SPV', en: 'SPV', uk: 'SPV' },
  foundation: { ru: 'Фонд', en: 'Foundation', uk: 'Фонд' },
  llc: { ru: 'ООО', en: 'LLC', uk: 'ТОВ' },
  corporation: { ru: 'Корпорация', en: 'Corporation', uk: 'Корпорація' },
};

// Account type enums
export const AccountType = {
  BANK: 'bank',
  CUSTODIAN: 'custodian',
  BROKER: 'broker',
  CRYPTO_WALLET: 'crypto_wallet',
  RETIREMENT: 'retirement',
  ESCROW: 'escrow',
} as const;

export type AccountTypeKey = typeof AccountType[keyof typeof AccountType];

export const AccountTypeLabels: Record<AccountTypeKey, Record<string, string>> = {
  bank: { ru: 'Банк', en: 'Bank', uk: 'Банк' },
  custodian: { ru: 'Кастодиан', en: 'Custodian', uk: 'Кастодіан' },
  broker: { ru: 'Брокер', en: 'Broker', uk: 'Брокер' },
  crypto_wallet: { ru: 'Крипто-кошелек', en: 'Crypto Wallet', uk: 'Крипто-гаманець' },
  retirement: { ru: 'Пенсионный', en: 'Retirement', uk: 'Пенсійний' },
  escrow: { ru: 'Эскроу', en: 'Escrow', uk: 'Ескроу' },
};

// Asset type enums
export const AssetType = {
  TICKER: 'ticker',
  FUND: 'fund',
  PRIVATE_DEAL: 'private_deal',
  REAL_ESTATE: 'real_estate',
  COLLECTIBLE: 'collectible',
  CRYPTO: 'crypto',
  CASH: 'cash',
  LOAN: 'loan',
} as const;

export type AssetTypeKey = typeof AssetType[keyof typeof AssetType];

export const AssetTypeLabels: Record<AssetTypeKey, Record<string, string>> = {
  ticker: { ru: 'Тикер', en: 'Ticker', uk: 'Тікер' },
  fund: { ru: 'Фонд', en: 'Fund', uk: 'Фонд' },
  private_deal: { ru: 'Частная сделка', en: 'Private Deal', uk: 'Приватна угода' },
  real_estate: { ru: 'Недвижимость', en: 'Real Estate', uk: 'Нерухомість' },
  collectible: { ru: 'Коллекционное', en: 'Collectible', uk: 'Колекційне' },
  crypto: { ru: 'Криптовалюта', en: 'Crypto', uk: 'Криптовалюта' },
  cash: { ru: 'Наличные', en: 'Cash', uk: 'Готівка' },
  loan: { ru: 'Займ', en: 'Loan', uk: 'Позика' },
};

// Record status
export const MdmRecordStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  MERGED: 'merged',
  PENDING_REVIEW: 'pending_review',
} as const;

export type MdmRecordStatusKey = typeof MdmRecordStatus[keyof typeof MdmRecordStatus];

// Duplicate status
export const DuplicateStatus = {
  OPEN: 'open',
  IGNORED: 'ignored',
  MERGE_IN_PROGRESS: 'merge_in_progress',
  MERGED: 'merged',
} as const;

export type DuplicateStatusKey = typeof DuplicateStatus[keyof typeof DuplicateStatus];

// Merge job status
export const MergeJobStatus = {
  DRAFT: 'draft',
  PENDING_APPROVAL: 'pending_approval',
  APPLIED: 'applied',
  CANCELLED: 'cancelled',
} as const;

export type MergeJobStatusKey = typeof MergeJobStatus[keyof typeof MergeJobStatus];

// Steward queue issue types
export const StewardIssueType = {
  MISSING_SOURCE: 'missing_source',
  CONFLICTING_VALUES: 'conflicting_values',
  LOW_CONFIDENCE: 'low_confidence',
  BROKEN_LINK: 'broken_link',
  INVALID_FORMAT: 'invalid_format',
  STALE_DATA: 'stale_data',
} as const;

export type StewardIssueTypeKey = typeof StewardIssueType[keyof typeof StewardIssueType];

export const StewardIssueLabels: Record<StewardIssueTypeKey, Record<string, string>> = {
  missing_source: { ru: 'Нет источника', en: 'Missing Source', uk: 'Немає джерела' },
  conflicting_values: { ru: 'Конфликт значений', en: 'Conflicting Values', uk: 'Конфлікт значень' },
  low_confidence: { ru: 'Низкая уверенность', en: 'Low Confidence', uk: 'Низька впевненість' },
  broken_link: { ru: 'Сломанная связь', en: 'Broken Link', uk: 'Зламаний зв\'язок' },
  invalid_format: { ru: 'Неверный формат', en: 'Invalid Format', uk: 'Невірний формат' },
  stale_data: { ru: 'Устаревшие данные', en: 'Stale Data', uk: 'Застарілі дані' },
};

// Steward queue status
export const StewardQueueStatus = {
  OPEN: 'open',
  ASSIGNED: 'assigned',
  RESOLVED: 'resolved',
} as const;

export type StewardQueueStatusKey = typeof StewardQueueStatus[keyof typeof StewardQueueStatus];

// Rule types
export const MdmRuleType = {
  MATCHING: 'matching',
  NORMALIZATION: 'normalization',
  SURVIVORSHIP: 'survivorship',
} as const;

export type MdmRuleTypeKey = typeof MdmRuleType[keyof typeof MdmRuleType];

export const MdmRuleTypeLabels: Record<MdmRuleTypeKey, Record<string, string>> = {
  matching: { ru: 'Сопоставление', en: 'Matching', uk: 'Зіставлення' },
  normalization: { ru: 'Нормализация', en: 'Normalization', uk: 'Нормалізація' },
  survivorship: { ru: 'Выживаемость', en: 'Survivorship', uk: 'Виживаність' },
};

// Record type keys
export const MdmRecordType = {
  PEOPLE: 'people',
  ENTITIES: 'entities',
  ACCOUNTS: 'accounts',
  ASSETS: 'assets',
} as const;

export type MdmRecordTypeKey = typeof MdmRecordType[keyof typeof MdmRecordType];

// Severity levels
export const Severity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type SeverityKey = typeof Severity[keyof typeof Severity];

export const mdmConfig: ModuleConfig = {
  id: '46',
  slug: 'mdm',
  order: 46,
  icon: 'database',
  title: { ru: 'MDM', en: 'MDM', uk: 'MDM' },
  description: {
    ru: 'Master Data Management: единый справочник, устранение дублей, Golden Record',
    en: 'Master Data Management: unified registry, deduplication, Golden Record',
    uk: 'Master Data Management: єдиний довідник, усунення дублів, Golden Record',
  },
  disclaimer: {
    ru: 'MDM рекомендации и совпадения носят информационный характер. Слияние записей требует подтверждения ответственным лицом.',
    en: 'MDM recommendations and matches are informational only. Record merging requires confirmation by an authorized person.',
    uk: 'MDM рекомендації та збіги носять інформаційний характер. Злиття записів потребує підтвердження відповідальною особою.',
  },
  color: '#059669',
  enabled: true,
  clientSafeHidden: true,
  collections: [
    'mdmPeople',
    'mdmEntities',
    'mdmAccounts',
    'mdmAssets',
    'mdmDuplicates',
    'mdmMergeJobs',
    'mdmStewardQueue',
    'mdmRules',
  ],
  kpis: [
    { key: 'peopleRecords', title: { ru: 'Записи People', en: 'People Records', uk: 'Записи People' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'entitiesRecords', title: { ru: 'Записи Entities', en: 'Entities Records', uk: 'Записи Entities' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'accountsRecords', title: { ru: 'Записи Accounts', en: 'Accounts Records', uk: 'Записи Accounts' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'assetsRecords', title: { ru: 'Записи Assets', en: 'Assets Records', uk: 'Записи Assets' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'duplicatesOpen', title: { ru: 'Дубли открытые', en: 'Duplicates Open', uk: 'Дублі відкриті' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'mergesPending', title: { ru: 'Merge ожидают', en: 'Merges Pending', uk: 'Merge очікують' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'stewardQueueOpen', title: { ru: 'Очередь открыта', en: 'Queue Open', uk: 'Черга відкрита' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'fieldsMissingSources', title: { ru: 'Без источников', en: 'Missing Sources', uk: 'Без джерел' }, format: 'number', status: 'critical', linkToList: true },
  ],
  columns: [
    { key: 'name', header: { ru: 'Название', en: 'Name', uk: 'Назва' } },
    { key: 'recordType', header: { ru: 'Тип записи', en: 'Record Type', uk: 'Тип запису' }, type: 'badge' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'confidence', header: { ru: 'Уверенность', en: 'Confidence', uk: 'Впевненість' } },
    { key: 'sources', header: { ru: 'Источники', en: 'Sources', uk: 'Джерела' } },
    { key: 'updatedAt', header: { ru: 'Обновлено', en: 'Updated', uk: 'Оновлено' }, type: 'date' },
  ],
  tabs: [
    { key: 'people', label: { ru: 'Люди', en: 'People', uk: 'Люди' } },
    { key: 'entities', label: { ru: 'Сущности', en: 'Entities', uk: 'Сутності' } },
    { key: 'accounts', label: { ru: 'Счета', en: 'Accounts', uk: 'Рахунки' } },
    { key: 'assets', label: { ru: 'Активы', en: 'Assets', uk: 'Активи' } },
    { key: 'duplicates', label: { ru: 'Дубли', en: 'Duplicates', uk: 'Дублі' } },
    { key: 'stewardship', label: { ru: 'Очередь', en: 'Stewardship', uk: 'Черга' } },
    { key: 'rules', label: { ru: 'Правила', en: 'Rules', uk: 'Правила' } },
    { key: 'audit', label: { ru: 'Audit', en: 'Audit', uk: 'Audit' } },
  ],
  actions: [
    { key: 'createRecord', label: { ru: 'Создать запись', en: 'Create Record', uk: 'Створити запис' }, variant: 'primary' },
    { key: 'runMatch', label: { ru: 'Запустить матчинг', en: 'Run Matching', uk: 'Запустити матчинг' }, variant: 'secondary' },
    { key: 'createRule', label: { ru: 'Создать правило', en: 'Create Rule', uk: 'Створити правило' }, variant: 'secondary' },
    { key: 'openMergeWizard', label: { ru: 'Merge wizard', en: 'Merge Wizard', uk: 'Merge wizard' }, variant: 'secondary' },
    { key: 'generateDemo', label: { ru: 'Demo MDM', en: 'Demo MDM', uk: 'Demo MDM' }, variant: 'ghost' },
  ],
  routes: {
    dashboard: '/m/mdm',
    list: '/m/mdm/list',
    person: '/m/mdm/person/[id]',
    entity: '/m/mdm/entity/[id]',
    account: '/m/mdm/account/[id]',
    asset: '/m/mdm/asset/[id]',
    duplicate: '/m/mdm/duplicate/[id]',
    rule: '/m/mdm/rule/[id]',
  },
};

export const config = mdmConfig;
