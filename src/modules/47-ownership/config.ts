import { ModuleConfig } from '../types';

export const OwnershipNodeType = {
  HOUSEHOLD: 'household',
  TRUST: 'trust',
  ENTITY: 'entity',
  PARTNERSHIP: 'partnership',
  SPV: 'spv',
  ACCOUNT: 'account',
  ASSET: 'asset',
} as const;

export type OwnershipNodeTypeKey = typeof OwnershipNodeType[keyof typeof OwnershipNodeType];

export const OwnershipNodeTypeLabels: Record<OwnershipNodeTypeKey, Record<string, string>> = {
  household: { ru: 'Домохозяйство', en: 'Household', uk: 'Домогосподарство' },
  trust: { ru: 'Траст', en: 'Trust', uk: 'Траст' },
  entity: { ru: 'Сущность', en: 'Entity', uk: 'Сутність' },
  partnership: { ru: 'Партнерство', en: 'Partnership', uk: 'Партнерство' },
  spv: { ru: 'SPV', en: 'SPV', uk: 'SPV' },
  account: { ru: 'Счет', en: 'Account', uk: 'Рахунок' },
  asset: { ru: 'Актив', en: 'Asset', uk: 'Актив' },
};

export const OwnershipNodeStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export type OwnershipNodeStatusKey = typeof OwnershipNodeStatus[keyof typeof OwnershipNodeStatus];

export const OwnershipLinkChangeType = {
  LINK_CREATED: 'link_created',
  LINK_UPDATED: 'link_updated',
  LINK_DELETED: 'link_deleted',
  PCT_CHANGED: 'pct_changed',
  EFFECTIVE_DATE_CHANGED: 'effective_date_changed',
} as const;

export type OwnershipLinkChangeTypeKey = typeof OwnershipLinkChangeType[keyof typeof OwnershipLinkChangeType];

export const OwnershipLinkChangeTypeLabels: Record<OwnershipLinkChangeTypeKey, Record<string, string>> = {
  link_created: { ru: 'Связь создана', en: 'Link Created', uk: 'Зв\'язок створено' },
  link_updated: { ru: 'Связь обновлена', en: 'Link Updated', uk: 'Зв\'язок оновлено' },
  link_deleted: { ru: 'Связь удалена', en: 'Link Deleted', uk: 'Зв\'язок видалено' },
  pct_changed: { ru: 'Доля изменена', en: 'Percentage Changed', uk: 'Частка змінена' },
  effective_date_changed: { ru: 'Дата изменена', en: 'Effective Date Changed', uk: 'Дата змінена' },
};

export const ConcentrationRiskLevel = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type ConcentrationRiskLevelKey = typeof ConcentrationRiskLevel[keyof typeof ConcentrationRiskLevel];

export const ownershipConfig: ModuleConfig = {
  id: '47',
  slug: 'ownership',
  order: 47,
  icon: 'share-2',
  color: '#059669',
  enabled: true,
  clientSafeHidden: false,
  adminOnly: false,

  title: {
    ru: 'Ownership',
    en: 'Ownership Map',
    uk: 'Ownership',
  },
  description: {
    ru: 'Визуализация структуры владения: Household → Trusts → Entities → Accounts → Assets. UBO, доли, источники.',
    en: 'Ownership structure visualization: Household → Trusts → Entities → Accounts → Assets. UBO, shares, sources.',
    uk: 'Візуалізація структури володіння: Household → Trusts → Entities → Accounts → Assets. UBO, частки, джерела.',
  },
  disclaimer: {
    ru: 'Ownership карта демонстрационная. Для юридически значимых выводов требуется проверка документов и юристов.',
    en: 'Ownership map is for demonstration purposes. Legally significant conclusions require document and legal review.',
    uk: 'Ownership карта демонстраційна. Для юридично значимих висновків потрібна перевірка документів та юристів.',
  },

  kpis: [
    {
      key: 'nodesTotal',
      title: { ru: 'Узлы', en: 'Nodes', uk: 'Вузли' },
      format: 'number',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'linksTotal',
      title: { ru: 'Связи', en: 'Links', uk: 'Зв\'язки' },
      format: 'number',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'uboRecords',
      title: { ru: 'UBO записи', en: 'UBO Records', uk: 'UBO записи' },
      format: 'number',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'missingSources',
      title: { ru: 'Без источников', en: 'Missing Sources', uk: 'Без джерел' },
      format: 'number',
      status: 'warning',
      linkToList: true,
    },
    {
      key: 'loopsDetected',
      title: { ru: 'Циклы', en: 'Loops', uk: 'Цикли' },
      format: 'number',
      status: 'critical',
      linkToList: true,
    },
    {
      key: 'concentrationsHigh',
      title: { ru: 'Концентрации', en: 'High Concentrations', uk: 'Концентрації' },
      format: 'number',
      status: 'warning',
      linkToList: true,
    },
    {
      key: 'clientSafeViews',
      title: { ru: 'Публикаций', en: 'Published Views', uk: 'Публікацій' },
      format: 'number',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'changesLast30d',
      title: { ru: 'Изменений 30д', en: 'Changes 30d', uk: 'Змін 30д' },
      format: 'number',
      status: 'info',
      linkToList: true,
    },
  ],

  columns: [
    { key: 'name', header: { ru: 'Название', en: 'Name', uk: 'Назва' }, width: 'w-48' },
    { key: 'nodeTypeKey', header: { ru: 'Тип', en: 'Type', uk: 'Тип' }, width: 'w-24', type: 'badge' },
    { key: 'jurisdiction', header: { ru: 'Юрисдикция', en: 'Jurisdiction', uk: 'Юрисдикція' }, width: 'w-28' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, width: 'w-24', type: 'status' },
    { key: 'linksCount', header: { ru: 'Связи', en: 'Links', uk: 'Зв\'язки' }, width: 'w-20' },
    { key: 'updatedAt', header: { ru: 'Обновлено', en: 'Updated', uk: 'Оновлено' }, width: 'w-28', type: 'date' },
  ],

  actions: [
    { key: 'createNode', label: { ru: 'Создать узел', en: 'Create Node', uk: 'Створити вузол' }, icon: 'plus', variant: 'primary' },
    { key: 'createLink', label: { ru: 'Создать связь', en: 'Create Link', uk: 'Створити зв\'язок' }, icon: 'link', variant: 'secondary' },
    { key: 'computeUbo', label: { ru: 'Рассчитать UBO', en: 'Compute UBO', uk: 'Розрахувати UBO' }, icon: 'calculator', variant: 'secondary' },
    { key: 'publishClientSafe', label: { ru: 'Опубликовать', en: 'Publish Client-Safe', uk: 'Опублікувати' }, icon: 'share', variant: 'secondary' },
    { key: 'openMap', label: { ru: 'Открыть карту', en: 'Open Map', uk: 'Відкрити карту' }, icon: 'map', variant: 'ghost' },
    { key: 'generateDemo', label: { ru: 'Генерировать демо', en: 'Generate Demo', uk: 'Генерувати демо' }, icon: 'sparkles', variant: 'ghost' },
  ],

  collections: [
    'ownershipNodes',
    'ownershipLinks',
    'ownershipUbo',
    'ownershipChanges',
    'ownershipViews',
  ],

  routes: {
    dashboard: '/m/ownership',
    map: '/m/ownership/map',
    list: '/m/ownership/list',
    node: '/m/ownership/node',
    link: '/m/ownership/link',
    ubo: '/m/ownership/ubo',
  },

  tabs: [
    { key: 'nodes', label: { ru: 'Узлы', en: 'Nodes', uk: 'Вузли' } },
    { key: 'links', label: { ru: 'Связи', en: 'Links', uk: 'Зв\'язки' } },
    { key: 'ubo', label: { ru: 'UBO', en: 'UBO', uk: 'UBO' } },
    { key: 'changes', label: { ru: 'Изменения', en: 'Changes', uk: 'Зміни' } },
    { key: 'concentrations', label: { ru: 'Концентрации', en: 'Concentrations', uk: 'Концентрації' } },
    { key: 'client_safe', label: { ru: 'Client-Safe', en: 'Client-Safe', uk: 'Client-Safe' } },
    { key: 'audit', label: { ru: 'Аудит', en: 'Audit', uk: 'Аудит' } },
  ],
};

export const config = ownershipConfig;
export default ownershipConfig;
