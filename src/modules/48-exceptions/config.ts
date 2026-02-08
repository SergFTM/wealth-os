import { ModuleConfig } from '../types';

export const exceptionsConfig: ModuleConfig = {
  id: '48',
  slug: 'exceptions',
  order: 48,
  icon: 'alert-triangle',
  color: 'red',
  enabled: true,
  clientSafeHidden: true,
  adminOnly: false,

  title: {
    ru: 'Исключения',
    en: 'Exception Center',
    uk: 'Виключення'
  },
  description: {
    ru: 'Единый центр исключений, Data Quality и Recon Breaks',
    en: 'Unified Exception Center, Data Quality and Recon Breaks',
    uk: 'Єдиний центр виключень, Data Quality та Recon Breaks'
  },
  disclaimer: {
    ru: 'Центр исключений предназначен для операционной команды. Решения требуют проверки человеком.',
    en: 'Exception Center is intended for operations team. Decisions require human verification.',
    uk: 'Центр виключень призначений для операційної команди. Рішення потребують перевірки людиною.'
  },

  kpis: [
    {
      key: 'openExceptions',
      title: { ru: 'Открытые', en: 'Open Exceptions', uk: 'Відкриті' },
      format: 'number',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'criticalToday',
      title: { ru: 'Критичные сегодня', en: 'Critical Today', uk: 'Критичні сьогодні' },
      format: 'number',
      status: 'critical',
      linkToList: true
    },
    {
      key: 'slaAtRisk',
      title: { ru: 'SLA под риском', en: 'SLA at Risk', uk: 'SLA під ризиком' },
      format: 'number',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'overdueAssigned',
      title: { ru: 'Просрочено', en: 'Overdue Assigned', uk: 'Прострочено' },
      format: 'number',
      status: 'critical',
      linkToList: true
    },
    {
      key: 'autoClosed7d',
      title: { ru: 'Авто-закрыто 7д', en: 'Auto-closed 7d', uk: 'Авто-закрито 7д' },
      format: 'number',
      status: 'ok',
      linkToList: true
    },
    {
      key: 'topModuleSource',
      title: { ru: 'Топ источник', en: 'Top Module Source', uk: 'Топ джерело' },
      format: 'number',
      status: 'info',
      linkToList: true
    },
    {
      key: 'activeClusters',
      title: { ru: 'Активные кластеры', en: 'Active Clusters', uk: 'Активні кластери' },
      format: 'number',
      status: 'info',
      linkToList: true
    },
    {
      key: 'enabledRules',
      title: { ru: 'Активные правила', en: 'Enabled Rules', uk: 'Активні правила' },
      format: 'number',
      status: 'ok',
      linkToList: true
    }
  ],

  columns: [
    { key: 'severity', header: { ru: 'Важность', en: 'Severity', uk: 'Важливість' }, width: 'w-24', type: 'badge' },
    { key: 'title', header: { ru: 'Название', en: 'Title', uk: 'Назва' }, width: 'w-64', type: 'text' },
    { key: 'sourceModuleKey', header: { ru: 'Источник', en: 'Source Module', uk: 'Джерело' }, width: 'w-32', type: 'text' },
    { key: 'typeKey', header: { ru: 'Тип', en: 'Type', uk: 'Тип' }, width: 'w-28', type: 'badge' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, width: 'w-28', type: 'status' },
    { key: 'slaDueAt', header: { ru: 'SLA срок', en: 'SLA Due', uk: 'SLA термін' }, width: 'w-32', type: 'date' },
    { key: 'assignedToRole', header: { ru: 'Назначено', en: 'Assigned', uk: 'Призначено' }, width: 'w-32', type: 'text' },
    { key: 'createdAt', header: { ru: 'Создано', en: 'Created', uk: 'Створено' }, width: 'w-32', type: 'date' }
  ],

  actions: [
    { key: 'createException', label: { ru: 'Создать исключение', en: 'Create Exception', uk: 'Створити виключення' }, icon: 'plus', variant: 'primary' },
    { key: 'runClustering', label: { ru: 'Запустить кластеризацию', en: 'Run Clustering', uk: 'Запустити кластеризацію' }, icon: 'layers', variant: 'secondary' },
    { key: 'createRule', label: { ru: 'Создать правило', en: 'Create Rule', uk: 'Створити правило' }, icon: 'settings', variant: 'secondary' },
    { key: 'applyAutoRules', label: { ru: 'Применить авто-правила', en: 'Apply Auto-rules', uk: 'Застосувати авто-правила' }, icon: 'zap', variant: 'secondary' },
    { key: 'generateDemo', label: { ru: 'Генерировать демо', en: 'Generate Demo', uk: 'Генерувати демо' }, icon: 'sparkles', variant: 'ghost' }
  ],

  collections: ['exceptions', 'exceptionClusters', 'exceptionRules', 'exceptionSlaPolicies'],

  routes: {
    dashboard: '/m/exceptions',
    list: '/m/exceptions/list',
    exception: '/m/exceptions/exception',
    cluster: '/m/exceptions/cluster',
    rule: '/m/exceptions/rule'
  },

  tabs: [
    { key: 'queue', label: { ru: 'Очередь', en: 'Queue', uk: 'Черга' } },
    { key: 'clusters', label: { ru: 'Кластеры', en: 'Clusters', uk: 'Кластери' } },
    { key: 'rules', label: { ru: 'Правила', en: 'Rules', uk: 'Правила' } },
    { key: 'slas', label: { ru: 'SLA', en: 'SLAs', uk: 'SLA' } },
    { key: 'analytics', label: { ru: 'Аналитика', en: 'Analytics', uk: 'Аналітика' } },
    { key: 'audit', label: { ru: 'Аудит', en: 'Audit', uk: 'Аудит' } }
  ]
};

export const exceptionTypes = {
  sync: { ru: 'Ошибка синхронизации', en: 'Sync Failure', uk: 'Помилка синхронізації' },
  recon: { ru: 'Recon Break', en: 'Recon Break', uk: 'Recon Break' },
  missing_doc: { ru: 'Отсутствует документ', en: 'Missing Document', uk: 'Відсутній документ' },
  stale_price: { ru: 'Устаревшая цена', en: 'Stale Price', uk: 'Застаріла ціна' },
  approval: { ru: 'Просрочено согласование', en: 'Approval Overdue', uk: 'Прострочено погодження' },
  vendor_sla: { ru: 'Нарушение SLA поставщика', en: 'Vendor SLA Breach', uk: 'Порушення SLA постачальника' },
  security: { ru: 'Инцидент безопасности', en: 'Security Incident', uk: 'Інцидент безпеки' }
};

export const exceptionStatuses = {
  open: { ru: 'Открыто', en: 'Open', uk: 'Відкрито' },
  triage: { ru: 'Триаж', en: 'Triage', uk: 'Тріаж' },
  in_progress: { ru: 'В работе', en: 'In Progress', uk: 'В роботі' },
  closed: { ru: 'Закрыто', en: 'Closed', uk: 'Закрито' }
};

export const exceptionSeverities = {
  ok: { ru: 'Норма', en: 'OK', uk: 'Норма' },
  warning: { ru: 'Предупреждение', en: 'Warning', uk: 'Попередження' },
  critical: { ru: 'Критично', en: 'Critical', uk: 'Критично' }
};

export const ruleTypes = {
  assign: { ru: 'Авто-назначение', en: 'Auto-assign', uk: 'Авто-призначення' },
  escalate: { ru: 'Авто-эскалация', en: 'Auto-escalate', uk: 'Авто-ескалація' },
  close: { ru: 'Авто-закрытие', en: 'Auto-close', uk: 'Авто-закриття' }
};

export const clusterTypes = {
  type_source: { ru: 'По типу и источнику', en: 'By Type & Source', uk: 'За типом та джерелом' },
  title_pattern: { ru: 'По паттерну названия', en: 'By Title Pattern', uk: 'За патерном назви' },
  temporal: { ru: 'Временной', en: 'Temporal', uk: 'Часовий' }
};

export default exceptionsConfig;
