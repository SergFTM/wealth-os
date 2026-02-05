import type { ModuleConfig } from '@/modules/types';

export const riskConfig: ModuleConfig = {
  id: '14',
  slug: 'risk',
  order: 14,
  icon: 'shield',
  title: {
    ru: 'Риск и надзор',
    en: 'Risk Oversight',
    uk: 'Ризик та нагляд',
  },
  description: {
    ru: 'Управление рисками, стресс-тесты, метрики и оповещения',
    en: 'Risk management, stress testing, metrics and alerts',
    uk: 'Управління ризиками, стрес-тести, метрики та сповіщення',
  },
  disclaimer: {
    ru: 'Риск метрики информационные, не являются инвестиционной рекомендацией',
    en: 'Risk metrics are informational only and do not constitute investment advice',
    uk: 'Ризик метрики інформаційні, не є інвестиційною рекомендацією',
  },
  kpis: [
    {
      key: 'portfolioVar',
      title: { ru: 'VaR портфеля', en: 'Portfolio VaR', uk: 'VaR портфеля' },
      format: 'percent',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'activeAlerts',
      title: { ru: 'Активных алертов', en: 'Active Alerts', uk: 'Активних алертів' },
      format: 'number',
      status: 'warning',
      linkToList: true,
    },
    {
      key: 'concentrationScore',
      title: { ru: 'Концентрация', en: 'Concentration', uk: 'Концентрація' },
      format: 'number',
      status: 'ok',
    },
    {
      key: 'stressRuns',
      title: { ru: 'Стресс-тестов', en: 'Stress Runs', uk: 'Стрес-тестів' },
      format: 'number',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'breachedLimits',
      title: { ru: 'Превышений лимитов', en: 'Breached Limits', uk: 'Перевищень лімітів' },
      format: 'number',
      status: 'critical',
      linkToList: true,
    },
    {
      key: 'pendingActions',
      title: { ru: 'Действий в работе', en: 'Pending Actions', uk: 'Дій в роботі' },
      format: 'number',
      status: 'warning',
      linkToList: true,
    },
  ],
  columns: [
    { key: 'title', header: { ru: 'Название', en: 'Title', uk: 'Назва' } },
    { key: 'category', header: { ru: 'Категория', en: 'Category', uk: 'Категорія' } },
    { key: 'severity', header: { ru: 'Серьёзность', en: 'Severity', uk: 'Серйозність' }, type: 'badge' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'triggeredAt', header: { ru: 'Время', en: 'Time', uk: 'Час' }, type: 'date' },
  ],
  actions: [
    { key: 'runStressTest', label: { ru: 'Запустить стресс-тест', en: 'Run Stress Test', uk: 'Запустити стрес-тест' }, variant: 'primary' },
    { key: 'refreshMetrics', label: { ru: 'Обновить метрики', en: 'Refresh Metrics', uk: 'Оновити метрики' }, variant: 'secondary' },
    { key: 'exportReport', label: { ru: 'Экспорт отчёта', en: 'Export Report', uk: 'Експорт звіту' }, variant: 'ghost' },
    { key: 'scheduleReview', label: { ru: 'Запланировать обзор', en: 'Schedule Review', uk: 'Запланувати огляд' }, variant: 'ghost' },
  ],
};

export default riskConfig;
