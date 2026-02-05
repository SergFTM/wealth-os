/**
 * Module 26: Financial Planning and Scenarios
 * Goals, scenarios, cashflow, projections, plan vs actual
 */

import { ModuleConfig } from '../types';

export const planningConfig: ModuleConfig = {
  id: '26',
  slug: 'planning',
  order: 26,
  icon: 'target',
  title: { ru: 'Планирование', en: 'Planning', uk: 'Планування' },
  description: {
    ru: 'Финансовые цели, сценарии, денежные потоки, прогнозы и план-факт анализ',
    en: 'Financial goals, scenarios, cashflows, projections and plan vs actual analysis',
    uk: 'Фінансові цілі, сценарії, грошові потоки, прогнози та план-факт аналіз',
  },
  disclaimer: {
    ru: 'Планирование носит информационный характер и требует проверки консультантом. Не является индивидуальной инвестиционной рекомендацией.',
    en: 'Planning is informational and requires advisor review. Not an individual investment recommendation.',
    uk: 'Планування носить інформаційний характер і потребує перевірки консультантом. Не є індивідуальною інвестиційною рекомендацією.',
  },
  kpis: [
    { key: 'activeGoals', title: { ru: 'Активных целей', en: 'Active Goals', uk: 'Активних цілей' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'scenarios', title: { ru: 'Сценариев', en: 'Scenarios', uk: 'Сценаріїв' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'netCashflow12m', title: { ru: 'Чистый CF 12м', en: 'Net CF 12m', uk: 'Чистий CF 12м' }, format: 'currency', status: 'ok', linkToList: true },
    { key: 'largestOutflow', title: { ru: 'Макс. отток', en: 'Largest Outflow', uk: 'Макс. відтік' }, format: 'currency', status: 'warning', linkToList: true },
    { key: 'runsLast30d', title: { ru: 'Расчетов 30д', en: 'Runs 30d', uk: 'Розрахунків 30д' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'planActualGaps', title: { ru: 'Расхождений', en: 'Gaps', uk: 'Розбіжностей' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'missingAssumptions', title: { ru: 'Нет assumptions', en: 'Missing Assumptions', uk: 'Немає assumptions' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'staleSources', title: { ru: 'Устаревших', en: 'Stale Sources', uk: 'Застарілих' }, format: 'number', status: 'warning', linkToList: true },
  ],
  columns: [
    { key: 'name', header: { ru: 'Название', en: 'Name', uk: 'Назва' } },
    { key: 'type', header: { ru: 'Тип', en: 'Type', uk: 'Тип' } },
    { key: 'amount', header: { ru: 'Сумма', en: 'Amount', uk: 'Сума' }, type: 'currency' },
    { key: 'date', header: { ru: 'Дата', en: 'Date', uk: 'Дата' }, type: 'date' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
  ],
  actions: [
    { key: 'createGoal', label: { ru: 'Создать цель', en: 'Create Goal', uk: 'Створити ціль' }, variant: 'primary' },
    { key: 'createScenario', label: { ru: 'Создать сценарий', en: 'Create Scenario', uk: 'Створити сценарій' }, variant: 'secondary' },
    { key: 'addCashflow', label: { ru: 'Добавить cashflow', en: 'Add Cashflow', uk: 'Додати cashflow' }, variant: 'secondary' },
    { key: 'runCalculation', label: { ru: 'Запустить расчет', en: 'Run Calculation', uk: 'Запустити розрахунок' }, variant: 'ghost' },
  ],
};
