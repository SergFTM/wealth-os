// Module Knowledge Base — provides structured knowledge per module for AI panel

export interface HelpTopic {
  title: string;
  summary: string;
  section: string;
}

export interface IndustryRule {
  id: string;
  title: string;
  description: string;
  threshold?: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface BestPractice {
  id: string;
  title: string;
  description: string;
  applicableWhen: string;
}

export interface ModuleKnowledge {
  helpTopics: HelpTopic[];
  industryRules: IndustryRule[];
  bestPractices: BestPractice[];
}

const KNOWLEDGE_MAP: Record<string, ModuleKnowledge> = {
  'net-worth': {
    helpTopics: [
      { title: 'Агрегация активов', summary: 'Консолидация всех активов из разных кастодианов и источников в единое представление', section: 'Основы' },
      { title: 'Устаревшие оценки', summary: 'Мониторинг актуальности рыночных оценок — stale данные снижают достоверность', section: 'Качество данных' },
      { title: 'Структура ликвидности', summary: 'Баланс между ликвидными и неликвидными активами для управления потребностями', section: 'Ликвидность' },
    ],
    industryRules: [
      { id: 'nw-conc-01', title: 'Концентрация эмитента', description: 'Максимальная доля одного эмитента не должна превышать лимит IPS', threshold: '15%', severity: 'critical' },
      { id: 'nw-liq-01', title: 'Минимум ликвидности', description: 'Минимальная доля ликвидных активов должна соответствовать IPS', threshold: '20%', severity: 'warning' },
      { id: 'nw-val-01', title: 'Актуальность оценок', description: 'Все позиции должны иметь оценку не старше 30 дней', threshold: '30 дней', severity: 'warning' },
      { id: 'nw-fx-01', title: 'Валютная экспозиция', description: 'Доля в иностранной валюте не должна превышать лимит', threshold: '30%', severity: 'warning' },
    ],
    bestPractices: [
      { id: 'nw-bp-01', title: 'Ежедневная сверка', description: 'Сверять позиции с кастодианами ежедневно для раннего обнаружения расхождений', applicableWhen: 'Есть активные кастодианские счета' },
      { id: 'nw-bp-02', title: 'Ребалансировка', description: 'Проводить ребалансировку при отклонении от целевой аллокации более 5%', applicableWhen: 'Отклонение от целевой аллокации' },
      { id: 'nw-bp-03', title: 'Стресс-тестирование', description: 'Квартально проводить стресс-тесты портфеля на основные факторы риска', applicableWhen: 'Ежеквартально' },
    ],
  },

  'performance': {
    helpTopics: [
      { title: 'TWR и MWRR', summary: 'Два метода расчёта доходности — Time-Weighted для сравнения с benchmark, Money-Weighted для оценки решений', section: 'Методология' },
      { title: 'Attribution Analysis', summary: 'Декомпозиция доходности на факторы: аллокация, выбор бумаг, валютный эффект', section: 'Аналитика' },
      { title: 'Benchmark Comparison', summary: 'Сравнение с индексами и целевыми портфелями для оценки качества управления', section: 'Оценка' },
    ],
    industryRules: [
      { id: 'pf-bench-01', title: 'Отклонение от benchmark', description: 'Отклонение доходности от benchmark более 3% требует объяснения', threshold: '3%', severity: 'warning' },
      { id: 'pf-draw-01', title: 'Drawdown лимит', description: 'Максимальная просадка не должна превышать установленный IPS лимит', threshold: '15%', severity: 'critical' },
      { id: 'pf-sharpe-01', title: 'Risk-adjusted return', description: 'Sharpe ratio ниже 0.5 сигнализирует о неэффективности портфеля', threshold: '0.5', severity: 'info' },
    ],
    bestPractices: [
      { id: 'pf-bp-01', title: 'Ежемесячная атрибуция', description: 'Проводить атрибуцию доходности ежемесячно для понимания источников возврата', applicableWhen: 'Ежемесячно' },
      { id: 'pf-bp-02', title: 'GIPS compliance', description: 'Соблюдать стандарты GIPS для presentation of performance', applicableWhen: 'Клиентские отчёты' },
    ],
  },

  'data-quality': {
    helpTopics: [
      { title: 'Health Score', summary: 'Общий показатель качества данных 0-100: выше 90 — отлично, ниже 50 — критично', section: 'Обзор' },
      { title: 'Правила и исключения', summary: 'Автоматические проверки (rules) и обнаруженные проблемы (exceptions) с SLA', section: 'Мониторинг' },
      { title: 'Remediation Workflow', summary: 'Процесс исправления: создать задачу → назначить → исправить → закрыть → перепроверить', section: 'Процесс' },
    ],
    industryRules: [
      { id: 'dq-sla-01', title: 'SLA Critical', description: 'Critical исключения должны быть исправлены в течение 24 часов', threshold: '24ч', severity: 'critical' },
      { id: 'dq-sla-02', title: 'SLA Warning', description: 'Warning исключения — в течение 72 часов', threshold: '72ч', severity: 'warning' },
      { id: 'dq-health-01', title: 'Минимальный Health Score', description: 'Health Score не должен падать ниже 70 для production-данных', threshold: '70', severity: 'warning' },
    ],
    bestPractices: [
      { id: 'dq-bp-01', title: 'Ежедневная проверка', description: 'Проверять Health Score и новые исключения каждое утро', applicableWhen: 'Ежедневно' },
      { id: 'dq-bp-02', title: 'Эскалация', description: 'Эскалировать нерешённые critical исключения через 12 часов', applicableWhen: 'SLA > 50% elapsed' },
    ],
  },

  'risk': {
    helpTopics: [
      { title: 'VaR и Expected Shortfall', summary: 'Value at Risk — максимальный убыток при заданной вероятности, ES — средний убыток при превышении VaR', section: 'Метрики' },
      { title: 'Лимиты IPS', summary: 'Ограничения по концентрации, секторам, валютам, дюрации', section: 'Ограничения' },
      { title: 'Стресс-тесты', summary: 'Сценарный анализ влияния рыночных шоков на портфель', section: 'Сценарии' },
    ],
    industryRules: [
      { id: 'rsk-breach-01', title: 'IPS Breach', description: 'Любое нарушение лимитов IPS требует немедленного уведомления и плана коррекции', severity: 'critical' },
      { id: 'rsk-var-01', title: 'VaR лимит', description: 'VaR 95% не должен превышать установленный лимит', severity: 'warning' },
      { id: 'rsk-corr-01', title: 'Корреляция позиций', description: 'Высокая корреляция (>0.8) между крупными позициями увеличивает риск концентрации', threshold: '0.8', severity: 'info' },
    ],
    bestPractices: [
      { id: 'rsk-bp-01', title: 'Ежедневный мониторинг', description: 'Проверять риск-метрики и лимиты ежедневно', applicableWhen: 'Ежедневно' },
      { id: 'rsk-bp-02', title: 'Квартальный stress-test', description: 'Проводить полный стресс-тест минимум раз в квартал', applicableWhen: 'Ежеквартально' },
    ],
  },

  'committee': {
    helpTopics: [
      { title: 'Кворум', summary: 'Минимальное количество участников для принятия решений — обычно 60%', section: 'Процедура' },
      { title: 'Протокол заседания', summary: 'Фиксация повестки, решений, голосований и follow-up задач', section: 'Документирование' },
      { title: 'Follow-up задачи', summary: 'Контроль исполнения решений комитета с дедлайнами', section: 'Контроль' },
    ],
    industryRules: [
      { id: 'cm-quorum-01', title: 'Обязательный кворум', description: 'Решения без кворума не имеют силы', threshold: '60%', severity: 'critical' },
      { id: 'cm-minutes-01', title: 'Протокол в 48ч', description: 'Протокол должен быть подготовлен в течение 48 часов после заседания', threshold: '48ч', severity: 'warning' },
    ],
    bestPractices: [
      { id: 'cm-bp-01', title: 'Предварительная рассылка', description: 'Материалы комитета рассылать за 3 рабочих дня до заседания', applicableWhen: 'Подготовка к заседанию' },
      { id: 'cm-bp-02', title: 'Трекинг решений', description: 'Каждое решение должно иметь ответственного и дедлайн', applicableWhen: 'После голосования' },
    ],
  },

  'tax': {
    helpTopics: [
      { title: 'Tax Lot Tracking', summary: 'Отслеживание налоговых лотов для оптимизации реализованных P&L', section: 'Учёт' },
      { title: 'Дедлайны подачи', summary: 'Контроль сроков подачи деклараций по юрисдикциям', section: 'Сроки' },
    ],
    industryRules: [
      { id: 'tx-deadline-01', title: 'Filing deadline', description: 'Пропуск срока подачи налоговой декларации влечёт штрафные санкции', severity: 'critical' },
      { id: 'tx-withhold-01', title: 'Withholding mismatch', description: 'Расхождение удержанного налога с расчётным требует проверки', severity: 'warning' },
    ],
    bestPractices: [
      { id: 'tx-bp-01', title: 'Tax-loss harvesting', description: 'Использовать убыточные позиции для оптимизации налогообложения', applicableWhen: 'Конец финансового года' },
    ],
  },

  'fees': {
    helpTopics: [
      { title: 'Fee Schedule', summary: 'Структура комиссий по типам: management fee, performance fee, custody fee', section: 'Тарифы' },
      { title: 'Billing Cycle', summary: 'Периодичность выставления счетов: ежемесячно, ежеквартально, ежегодно', section: 'Расчёт' },
    ],
    industryRules: [
      { id: 'fee-cap-01', title: 'Fee Cap', description: 'Общая комиссия не должна превышать установленный Cap в договоре', severity: 'warning' },
      { id: 'fee-unbilled-01', title: 'Unbilled Period', description: 'Период без выставленного счёта более 45 дней требует проверки', threshold: '45 дней', severity: 'warning' },
    ],
    bestPractices: [
      { id: 'fee-bp-01', title: 'Ежемесячная сверка', description: 'Сверять начисленные комиссии с договорными условиями', applicableWhen: 'Конец расчётного периода' },
    ],
  },

  'ips': {
    helpTopics: [
      { title: 'Investment Policy Statement', summary: 'Документ определяющий цели, ограничения и стратегию инвестирования', section: 'Основы' },
      { title: 'Breaches & Waivers', summary: 'Нарушения лимитов и процедура получения временных исключений', section: 'Compliance' },
    ],
    industryRules: [
      { id: 'ips-breach-01', title: 'Breach уведомление', description: 'О нарушении IPS необходимо уведомить клиента и compliance в течение 24 часов', threshold: '24ч', severity: 'critical' },
      { id: 'ips-review-01', title: 'Ежегодный пересмотр', description: 'IPS должен пересматриваться минимум раз в год', severity: 'info' },
    ],
    bestPractices: [
      { id: 'ips-bp-01', title: 'Pre-trade check', description: 'Проверять сделку на соответствие IPS до исполнения', applicableWhen: 'Каждая сделка' },
    ],
  },

  'integrations': {
    helpTopics: [
      { title: 'Коннекторы', summary: 'Подключения к внешним системам: кастодианы, банки, ценовые провайдеры', section: 'Настройка' },
      { title: 'Sync Jobs', summary: 'Автоматическая синхронизация данных с мониторингом статуса и retry', section: 'Мониторинг' },
    ],
    industryRules: [
      { id: 'int-stale-01', title: 'Staleness', description: 'Данные интеграции не обновлявшиеся более 24ч считаются stale', threshold: '24ч', severity: 'warning' },
    ],
    bestPractices: [
      { id: 'int-bp-01', title: 'Мониторинг ошибок', description: 'Проверять статус sync jobs минимум раз в день', applicableWhen: 'Ежедневно' },
    ],
  },
};

/** Get structured knowledge for a module */
export function getModuleKnowledge(slug: string): ModuleKnowledge {
  return KNOWLEDGE_MAP[slug] || {
    helpTopics: [
      { title: 'Обзор модуля', summary: 'Подробная информация доступна в разделе помощи модуля', section: 'Общее' },
    ],
    industryRules: [],
    bestPractices: [],
  };
}
