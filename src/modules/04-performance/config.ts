import { ModuleConfig } from '../types';

export const performance: ModuleConfig = {
  id: '04',
  slug: 'performance',
  order: 4,
  icon: 'trending-up',
  title: { ru: 'Эффективность портфеля', en: 'Portfolio Performance', uk: 'Ефективність портфеля' },
  description: {
    ru: 'Измерение доходности, атрибуция, сравнение с бенчмарками',
    en: 'Performance measurement, attribution, benchmark comparison',
    uk: 'Вимірювання доходності, атрибуція, порівняння з бенчмарками'
  },
  clientSafeHidden: false,
  kpis: [
    { key: 'twrYtd', title: { ru: 'TWR YTD', en: 'TWR YTD', uk: 'TWR YTD' }, format: 'percent', status: 'ok' },
    { key: 'mwrYtd', title: { ru: 'MWR YTD', en: 'MWR YTD', uk: 'MWR YTD' }, format: 'percent', status: 'ok' },
    { key: 'volatility', title: { ru: 'Волатильность', en: 'Volatility', uk: 'Волатильність' }, format: 'percent', status: 'warning' },
    { key: 'maxDrawdown', title: { ru: 'Max Drawdown', en: 'Max Drawdown', uk: 'Max Drawdown' }, format: 'percent', status: 'warning' },
    { key: 'alphaYtd', title: { ru: 'Альфа YTD', en: 'Alpha YTD', uk: 'Альфа YTD' }, format: 'percent', status: 'ok' },
    { key: 'trackingError', title: { ru: 'Tracking Error', en: 'Tracking Error', uk: 'Tracking Error' }, format: 'percent', status: 'ok' },
  ],
  columns: [
    { key: 'name', header: { ru: 'Название', en: 'Name', uk: 'Назва' } },
    { key: 'portfolio', header: { ru: 'Портфель', en: 'Portfolio', uk: 'Портфель' } },
    { key: 'method', header: { ru: 'Метод', en: 'Method', uk: 'Метод' } },
    { key: 'timeframe', header: { ru: 'Период', en: 'Timeframe', uk: 'Період' } },
    { key: 'benchmark', header: { ru: 'Бенчмарк', en: 'Benchmark', uk: 'Бенчмарк' } },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
  ],
  actions: [
    { key: 'create', label: { ru: 'Создать отчёт', en: 'Create Report', uk: 'Створити звіт' }, variant: 'primary' },
    { key: 'export', label: { ru: 'Экспорт', en: 'Export', uk: 'Експорт' }, variant: 'secondary' },
  ],
};

export default performance;
