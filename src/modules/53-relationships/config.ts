import { ModuleConfig } from '../types';

export const relationshipsConfig: ModuleConfig = {
  id: '53',
  slug: 'relationships',
  order: 53,
  icon: 'heart-handshake',
  color: 'emerald',
  title: {
    ru: 'Отношения',
    en: 'Relationships',
    uk: 'Відносини'
  },
  description: {
    ru: 'Relationship Hub — управление отношениями, CRM-слой для MFO',
    en: 'Relationship Hub — relationship management, CRM layer for MFO',
    uk: 'Relationship Hub — управління відносинами, CRM-шар для MFO',
  },
  disclaimer: {
    ru: 'Рекомендации AI носят информационный характер и требуют проверки человеком',
    en: 'AI recommendations are informational and require human verification',
    uk: 'Рекомендації AI носять інформаційний характер і потребують перевірки людиною',
  },
  kpis: [
    {
      key: 'vipHouseholds',
      title: { ru: 'VIP домохозяйства', en: 'VIP Households', uk: 'VIP домогосподарства' },
      format: 'number',
      status: 'ok',
      linkToList: true
    },
    {
      key: 'openInitiatives',
      title: { ru: 'Открытые инициативы', en: 'Open Initiatives', uk: 'Відкриті ініціативи' },
      format: 'number',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'overdueFollowups',
      title: { ru: 'Просроченные follow-up', en: 'Overdue Follow-ups', uk: 'Прострочені follow-up' },
      format: 'number',
      status: 'critical',
      linkToList: true
    },
    {
      key: 'coverageGaps',
      title: { ru: 'Gaps в покрытии', en: 'Coverage Gaps', uk: 'Gaps у покритті' },
      format: 'number',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'interactions7d',
      title: { ru: 'Взаимодействия 7д', en: 'Interactions 7d', uk: 'Взаємодії 7д' },
      format: 'number',
      status: 'ok',
      linkToList: true
    },
    {
      key: 'topAdvisors',
      title: { ru: 'Топ RM по активности', en: 'Top RMs by Activity', uk: 'Топ RM за активністю' },
      format: 'number',
      status: 'info',
      linkToList: true
    },
    {
      key: 'clientSafeCards',
      title: { ru: 'Client-safe карточки', en: 'Client-safe Cards', uk: 'Client-safe картки' },
      format: 'number',
      status: 'ok',
      linkToList: true
    },
    {
      key: 'linkedCases',
      title: { ru: 'Связанные кейсы', en: 'Linked Cases', uk: 'Пов\'язані кейси' },
      format: 'number',
      status: 'warning',
      linkToList: true
    },
  ],
  columns: [
    { key: 'name', header: { ru: 'Название', en: 'Name', uk: 'Назва' } },
    { key: 'type', header: { ru: 'Тип', en: 'Type', uk: 'Тип' } },
    { key: 'tier', header: { ru: 'Уровень', en: 'Tier', uk: 'Рівень' }, type: 'badge' },
    { key: 'owner', header: { ru: 'RM', en: 'RM', uk: 'RM' } },
    { key: 'lastInteraction', header: { ru: 'Последний контакт', en: 'Last Interaction', uk: 'Останній контакт' }, type: 'date' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
  ],
  actions: [
    { key: 'createInteraction', label: { ru: 'Создать взаимодействие', en: 'Create Interaction', uk: 'Створити взаємодію' }, variant: 'primary' },
    { key: 'createInitiative', label: { ru: 'Создать инициативу', en: 'Create Initiative', uk: 'Створити ініціативу' }, variant: 'secondary' },
    { key: 'assignCoverage', label: { ru: 'Назначить RM', en: 'Assign Coverage', uk: 'Призначити RM' }, variant: 'secondary' },
    { key: 'publishClientSafe', label: { ru: 'Опубликовать карточку', en: 'Publish Client Card', uk: 'Опублікувати картку' }, variant: 'ghost' },
    { key: 'generateDemo', label: { ru: 'Сгенерировать demo', en: 'Generate Demo', uk: 'Згенерувати demo' }, variant: 'ghost' },
  ],
  collections: [
    'relHouseholds',
    'relRelationships',
    'relInteractions',
    'relInitiatives',
    'relCoverage',
    'relVipViews',
    'mdmPeople',
    'mdmEntities',
    'commThreads',
    'cases',
    'tasks',
    'calendarEvents',
    'consents',
    'auditEvents',
  ],
  routes: {
    dashboard: '/m/relationships',
    list: '/m/relationships/list',
    personDetail: '/m/relationships/person/[id]',
    householdDetail: '/m/relationships/household/[id]',
    relationshipDetail: '/m/relationships/relationship/[id]',
    interactionDetail: '/m/relationships/interaction/[id]',
    initiativeDetail: '/m/relationships/initiative/[id]',
  },
  tabs: [
    { key: 'people', label: { ru: 'Люди', en: 'People', uk: 'Люди' } },
    { key: 'households', label: { ru: 'Домохозяйства', en: 'Households', uk: 'Домогосподарства' } },
    { key: 'relationships', label: { ru: 'Связи', en: 'Relationships', uk: 'Зв\'язки' } },
    { key: 'interactions', label: { ru: 'Взаимодействия', en: 'Interactions', uk: 'Взаємодії' } },
    { key: 'initiatives', label: { ru: 'Инициативы', en: 'Initiatives', uk: 'Ініціативи' } },
    { key: 'coverage', label: { ru: 'Покрытие', en: 'Coverage', uk: 'Покриття' } },
    { key: 'vip', label: { ru: 'VIP', en: 'VIP', uk: 'VIP' } },
    { key: 'audit', label: { ru: 'Аудит', en: 'Audit', uk: 'Аудит' } },
  ],
  clientSafeHidden: false,
  enabled: true,
};

// Relationship types
export const RELATIONSHIP_TYPES = {
  family: { ru: 'Семья', en: 'Family', uk: 'Родина', color: 'purple' },
  role: { ru: 'Роль', en: 'Role', uk: 'Роль', color: 'blue' },
  authority: { ru: 'Доверенность', en: 'Authority', uk: 'Довіреність', color: 'amber' },
  vendor_contact: { ru: 'Контакт вендора', en: 'Vendor Contact', uk: 'Контакт вендора', color: 'gray' },
  ownership_link: { ru: 'Связь владения', en: 'Ownership Link', uk: 'Зв\'язок володіння', color: 'emerald' },
};

// Person roles
export const PERSON_ROLES = {
  owner: { ru: 'Владелец', en: 'Owner', uk: 'Власник', color: 'emerald' },
  spouse: { ru: 'Супруг(а)', en: 'Spouse', uk: 'Чоловік/Дружина', color: 'purple' },
  child: { ru: 'Ребенок', en: 'Child', uk: 'Дитина', color: 'blue' },
  trustee: { ru: 'Трасти', en: 'Trustee', uk: 'Трасті', color: 'amber' },
  advisor: { ru: 'Советник', en: 'Advisor', uk: 'Радник', color: 'cyan' },
  vendor: { ru: 'Вендор', en: 'Vendor', uk: 'Вендор', color: 'gray' },
  beneficiary: { ru: 'Бенефициар', en: 'Beneficiary', uk: 'Бенефіціар', color: 'pink' },
  executor: { ru: 'Исполнитель', en: 'Executor', uk: 'Виконавець', color: 'orange' },
};

// Tier levels
export const TIER_LEVELS = {
  A: { ru: 'Уровень A', en: 'Tier A', uk: 'Рівень A', color: 'emerald' },
  B: { ru: 'Уровень B', en: 'Tier B', uk: 'Рівень B', color: 'blue' },
  C: { ru: 'Уровень C', en: 'Tier C', uk: 'Рівень C', color: 'gray' },
};

// Interaction types
export const INTERACTION_TYPES = {
  meeting: { ru: 'Встреча', en: 'Meeting', uk: 'Зустріч', color: 'blue' },
  call: { ru: 'Звонок', en: 'Call', uk: 'Дзвінок', color: 'green' },
  message: { ru: 'Сообщение', en: 'Message', uk: 'Повідомлення', color: 'purple' },
  note: { ru: 'Заметка', en: 'Note', uk: 'Нотатка', color: 'gray' },
};

// Interaction statuses
export const INTERACTION_STATUSES = {
  open: { ru: 'Открыто', en: 'Open', uk: 'Відкрито', color: 'blue' },
  closed: { ru: 'Закрыто', en: 'Closed', uk: 'Закрито', color: 'gray' },
};

// Initiative stages
export const INITIATIVE_STAGES = {
  idea: { ru: 'Идея', en: 'Idea', uk: 'Ідея', color: 'gray' },
  in_analysis: { ru: 'В анализе', en: 'In Analysis', uk: 'В аналізі', color: 'blue' },
  in_progress: { ru: 'В работе', en: 'In Progress', uk: 'В роботі', color: 'amber' },
  done: { ru: 'Завершено', en: 'Done', uk: 'Завершено', color: 'green' },
};

// Coverage specialist roles
export const SPECIALIST_ROLES = {
  primary_rm: { ru: 'Основной RM', en: 'Primary RM', uk: 'Основний RM' },
  backup_rm: { ru: 'Резервный RM', en: 'Backup RM', uk: 'Резервний RM' },
  cio: { ru: 'CIO', en: 'CIO', uk: 'CIO' },
  cfo: { ru: 'CFO', en: 'CFO', uk: 'CFO' },
  compliance: { ru: 'Compliance', en: 'Compliance', uk: 'Compliance' },
  tax: { ru: 'Tax Advisor', en: 'Tax Advisor', uk: 'Податковий радник' },
  legal: { ru: 'Legal Counsel', en: 'Legal Counsel', uk: 'Юридичний радник' },
};

export default relationshipsConfig;
