import { ModuleConfig } from '../types';

export const philanthropyConfig: ModuleConfig = {
  id: '49',
  slug: 'philanthropy',
  order: 49,
  icon: 'heart',
  title: { ru: 'Philanthropy', en: 'Philanthropy', uk: 'Philanthropy' },
  description: {
    ru: 'Благотворительные программы семьи: структуры, гранты, выплаты, impact reporting',
    en: 'Family charitable giving: entities, grants, payouts, impact reporting',
    uk: 'Благодійні програми родини: структури, гранти, виплати, impact reporting',
  },
  disclaimer: {
    ru: 'Не является юридической или налоговой консультацией. Благотворительные решения требуют проверки специалистами.',
    en: 'Not legal or tax advice. Charitable giving decisions require professional review.',
    uk: 'Не є юридичною або податковою консультацією. Благодійні рішення потребують перевірки фахівцями.',
  },
  color: '#059669',
  enabled: true,
  collections: [
    'philEntities',
    'philPrograms',
    'philGrants',
    'philPayouts',
    'philBudgets',
    'philImpactReports',
    'philComplianceChecks',
  ],
  kpis: [
    { key: 'grantsInReview', title: { ru: 'Гранты на рассмотрении', en: 'Grants in Review', uk: 'Гранти на розгляді' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'approvalsPending', title: { ru: 'Ожидают согласования', en: 'Approvals Pending', uk: 'Очікують погодження' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'payoutsScheduled', title: { ru: 'Выплаты 30д', en: 'Payouts 30d', uk: 'Виплати 30д' }, format: 'currency', status: 'ok', linkToList: true },
    { key: 'budgetRemaining', title: { ru: 'Бюджет YTD', en: 'Budget YTD', uk: 'Бюджет YTD' }, format: 'currency', status: 'ok', linkToList: true },
    { key: 'complianceOpen', title: { ru: 'Комплаенс проверки', en: 'Compliance Open', uk: 'Комплаєнс перевірки' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'missingDocs', title: { ru: 'Нет документов', en: 'Missing Docs', uk: 'Немає документів' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'impactDue', title: { ru: 'Impact reports due', en: 'Impact Reports Due', uk: 'Impact reports due' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'clientSafePublished', title: { ru: 'Опубликовано', en: 'Published', uk: 'Опубліковано' }, format: 'number', status: 'ok', linkToList: true },
  ],
  columns: [
    { key: 'name', header: { ru: 'Название', en: 'Name', uk: 'Назва' } },
    { key: 'grantee', header: { ru: 'Получатель', en: 'Grantee', uk: 'Отримувач' } },
    { key: 'amount', header: { ru: 'Сумма', en: 'Amount', uk: 'Сума' }, type: 'currency' },
    { key: 'stage', header: { ru: 'Этап', en: 'Stage', uk: 'Етап' }, type: 'badge' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'program', header: { ru: 'Программа', en: 'Program', uk: 'Програма' } },
  ],
  tabs: [
    { key: 'entities', label: { ru: 'Структуры', en: 'Entities', uk: 'Структури' } },
    { key: 'programs', label: { ru: 'Программы', en: 'Programs', uk: 'Програми' } },
    { key: 'grants', label: { ru: 'Гранты', en: 'Grants', uk: 'Гранти' } },
    { key: 'payouts', label: { ru: 'Выплаты', en: 'Payouts', uk: 'Виплати' } },
    { key: 'budgets', label: { ru: 'Бюджеты', en: 'Budgets', uk: 'Бюджети' } },
    { key: 'impact', label: { ru: 'Impact', en: 'Impact', uk: 'Impact' } },
    { key: 'compliance', label: { ru: 'Комплаенс', en: 'Compliance', uk: 'Комплаєнс' } },
    { key: 'audit', label: { ru: 'Audit', en: 'Audit', uk: 'Audit' } },
  ],
  actions: [
    { key: 'createEntity', label: { ru: 'Создать структуру', en: 'Create Entity', uk: 'Створити структуру' }, variant: 'primary' },
    { key: 'createProgram', label: { ru: 'Создать программу', en: 'Create Program', uk: 'Створити програму' }, variant: 'secondary' },
    { key: 'createGrant', label: { ru: 'Создать грант', en: 'Create Grant', uk: 'Створити грант' }, variant: 'secondary' },
    { key: 'createPayout', label: { ru: 'Запланировать выплату', en: 'Schedule Payout', uk: 'Запланувати виплату' }, variant: 'secondary' },
    { key: 'createImpact', label: { ru: 'Создать Impact report', en: 'Create Impact Report', uk: 'Створити Impact report' }, variant: 'ghost' },
    { key: 'generateDemo', label: { ru: 'Demo philanthropy', en: 'Demo Philanthropy', uk: 'Demo philanthropy' }, variant: 'ghost' },
  ],
  routes: {
    dashboard: '/m/philanthropy',
    list: '/m/philanthropy/list',
    entity: '/m/philanthropy/entity/[id]',
    program: '/m/philanthropy/program/[id]',
    grant: '/m/philanthropy/grant/[id]',
    payout: '/m/philanthropy/payout/[id]',
    report: '/m/philanthropy/report/[id]',
  },
};

// Entity type keys
export const ENTITY_TYPE_KEYS = {
  foundation: { ru: 'Фонд', en: 'Foundation', uk: 'Фонд', color: 'emerald' },
  daf: { ru: 'DAF', en: 'DAF', uk: 'DAF', color: 'blue' },
  trust: { ru: 'Charitable Trust', en: 'Charitable Trust', uk: 'Charitable Trust', color: 'purple' },
  direct: { ru: 'Прямые дарения', en: 'Direct Giving', uk: 'Прямі дарування', color: 'amber' },
} as const;

// Program theme keys
export const PROGRAM_THEME_KEYS = {
  education: { ru: 'Образование', en: 'Education', uk: 'Освіта', color: 'blue' },
  health: { ru: 'Здоровье', en: 'Health', uk: 'Здоров\'я', color: 'rose' },
  climate: { ru: 'Климат', en: 'Climate', uk: 'Клімат', color: 'green' },
  community: { ru: 'Местное сообщество', en: 'Local Community', uk: 'Місцева громада', color: 'amber' },
  arts: { ru: 'Искусство', en: 'Arts & Culture', uk: 'Мистецтво', color: 'purple' },
  humanitarian: { ru: 'Гуманитарная помощь', en: 'Humanitarian', uk: 'Гуманітарна допомога', color: 'red' },
} as const;

// Grant stage keys
export const GRANT_STAGE_KEYS = {
  draft: { ru: 'Черновик', en: 'Draft', uk: 'Чернетка', color: 'stone' },
  submitted: { ru: 'Подана', en: 'Submitted', uk: 'Подано', color: 'blue' },
  in_review: { ru: 'На рассмотрении', en: 'In Review', uk: 'На розгляді', color: 'amber' },
  approved: { ru: 'Одобрен', en: 'Approved', uk: 'Схвалено', color: 'emerald' },
  rejected: { ru: 'Отклонен', en: 'Rejected', uk: 'Відхилено', color: 'red' },
  paid: { ru: 'Выплачен', en: 'Paid', uk: 'Виплачено', color: 'green' },
  closed: { ru: 'Закрыт', en: 'Closed', uk: 'Закрито', color: 'stone' },
} as const;

// Payout status keys
export const PAYOUT_STATUS_KEYS = {
  scheduled: { ru: 'Запланирована', en: 'Scheduled', uk: 'Заплановано', color: 'blue' },
  sent: { ru: 'Отправлена', en: 'Sent', uk: 'Відправлено', color: 'amber' },
  confirmed: { ru: 'Подтверждена', en: 'Confirmed', uk: 'Підтверджено', color: 'green' },
} as const;

// Payout method keys
export const PAYOUT_METHOD_KEYS = {
  check: { ru: 'Чек', en: 'Check', uk: 'Чек' },
  ach: { ru: 'ACH', en: 'ACH', uk: 'ACH' },
  wire: { ru: 'Wire', en: 'Wire', uk: 'Wire' },
} as const;

// Compliance check type keys
export const COMPLIANCE_CHECK_TYPE_KEYS = {
  sanctions: { ru: 'Санкционный скрининг', en: 'Sanctions Screening', uk: 'Санкційний скринінг', color: 'red' },
  kyc: { ru: 'KYC получателя', en: 'Grantee KYC', uk: 'KYC отримувача', color: 'blue' },
  conflict: { ru: 'Конфликт интересов', en: 'Conflict of Interest', uk: 'Конфлікт інтересів', color: 'amber' },
  board: { ru: 'Одобрение правления', en: 'Board Approval', uk: 'Схвалення правління', color: 'purple' },
} as const;

// Compliance check status keys
export const COMPLIANCE_STATUS_KEYS = {
  open: { ru: 'Открыта', en: 'Open', uk: 'Відкрито', color: 'amber' },
  cleared: { ru: 'Закрыта', en: 'Cleared', uk: 'Закрито', color: 'green' },
  flagged: { ru: 'Флаг', en: 'Flagged', uk: 'Флаг', color: 'red' },
} as const;

// Impact report status keys
export const IMPACT_STATUS_KEYS = {
  draft: { ru: 'Черновик', en: 'Draft', uk: 'Чернетка', color: 'stone' },
  submitted: { ru: 'Подан', en: 'Submitted', uk: 'Подано', color: 'blue' },
  published: { ru: 'Опубликован', en: 'Published', uk: 'Опубліковано', color: 'green' },
} as const;

export const config = philanthropyConfig;
