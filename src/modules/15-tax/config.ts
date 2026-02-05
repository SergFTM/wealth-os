import type { ModuleConfig } from '@/modules/types';

export const taxConfig: ModuleConfig = {
  id: '15',
  slug: 'tax',
  order: 15,
  icon: 'calculator',
  title: {
    ru: 'Налоги',
    en: 'Tax Center',
    uk: 'Податки',
  },
  description: {
    ru: 'Налоговые лоты, прибыль и убытки, harvesting, дедлайны, пакеты для консультантов',
    en: 'Tax lots, gains and losses, harvesting, deadlines, advisor packs',
    uk: 'Податкові лоти, прибуток і збитки, harvesting, дедлайни, пакети для консультантів',
  },
  disclaimer: {
    ru: 'Не является налоговой консультацией',
    en: 'This is not tax advice',
    uk: 'Не є податковою консультацією',
  },
  kpis: [
    {
      key: 'realizedGainsYtd',
      title: { ru: 'Realized gains YTD', en: 'Realized Gains YTD', uk: 'Realized gains YTD' },
      format: 'currency',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'unrealizedGains',
      title: { ru: 'Unrealized gains', en: 'Unrealized Gains', uk: 'Unrealized gains' },
      format: 'currency',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'lotsCount',
      title: { ru: 'Лотов всего', en: 'Total Lots', uk: 'Лотів всього' },
      format: 'number',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'shortTermExposure',
      title: { ru: 'Short-term exposure', en: 'Short-term Exposure', uk: 'Short-term exposure' },
      format: 'currency',
      status: 'warning',
      linkToList: true,
    },
    {
      key: 'harvestingOpportunities',
      title: { ru: 'Harvesting возможности', en: 'Harvesting Opportunities', uk: 'Harvesting можливості' },
      format: 'number',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'deadlinesNext60d',
      title: { ru: 'Дедлайны 60д', en: 'Deadlines 60d', uk: 'Дедлайни 60д' },
      format: 'number',
      status: 'warning',
      linkToList: true,
    },
    {
      key: 'advisorPacks',
      title: { ru: 'Advisor packs', en: 'Advisor Packs', uk: 'Advisor packs' },
      format: 'number',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'missingTaxDocs',
      title: { ru: 'Нет документов', en: 'Missing Docs', uk: 'Немає документів' },
      format: 'number',
      status: 'critical',
      linkToList: true,
    },
  ],
  columns: [
    { key: 'symbol', header: { ru: 'Symbol', en: 'Symbol', uk: 'Symbol' } },
    { key: 'entity', header: { ru: 'Entity', en: 'Entity', uk: 'Entity' } },
    { key: 'costBasis', header: { ru: 'Cost Basis', en: 'Cost Basis', uk: 'Cost Basis' }, type: 'currency' },
    { key: 'currentValue', header: { ru: 'Текущая стоимость', en: 'Current Value', uk: 'Поточна вартість' }, type: 'currency' },
    { key: 'unrealizedPL', header: { ru: 'Unrealized P/L', en: 'Unrealized P/L', uk: 'Unrealized P/L' }, type: 'currency' },
    { key: 'term', header: { ru: 'Срок', en: 'Term', uk: 'Термін' }, type: 'badge' },
  ],
  actions: [
    { key: 'addTaxProfile', label: { ru: 'Добавить tax profile', en: 'Add Tax Profile', uk: 'Додати tax profile' }, variant: 'primary' },
    { key: 'createDeadline', label: { ru: 'Создать deadline', en: 'Create Deadline', uk: 'Створити deadline' }, variant: 'secondary' },
    { key: 'createAdvisorPack', label: { ru: 'Создать advisor pack', en: 'Create Advisor Pack', uk: 'Створити advisor pack' }, variant: 'secondary' },
    { key: 'recalculate', label: { ru: 'Собрать данные', en: 'Recalculate', uk: 'Зібрати дані' }, variant: 'ghost' },
    { key: 'exportCsv', label: { ru: 'Экспорт CSV', en: 'Export CSV', uk: 'Експорт CSV' }, variant: 'ghost' },
  ],
};

export default taxConfig;
