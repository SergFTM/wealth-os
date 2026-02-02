interface ModuleSchema {
  id: string;
  slug: string;
  title: Record<string, string>;
  description?: Record<string, string>;
  disclaimer?: Record<string, string>;
  adminOnly?: boolean;
  collections: string[];
  primaryCollection: string;
  kpis: Array<{ key: string; title: string; format: string }>;
  listColumns: Array<{ key: string; header: string; type: string }>;
  createFields?: Array<{ key: string; label: string; type: string; required?: boolean; options?: string[] }>;
  help: {
    title: string;
    description: string;
    features: string[];
    scenarios: string[];
    dataSources: string[];
  };
}

export const moduleSchemas: ModuleSchema[] = [
  {
    id: "01", slug: "dashboard-home",
    title: { ru: "Домой", en: "Home", uk: "Домів" },
    description: { ru: "Обзор состояния и ключевых показателей" },
    collections: ["tasks", "alerts", "approvals"], primaryCollection: "tasks",
    kpis: [
      { key: "netWorth", title: "Единый капитал", format: "currency" },
      { key: "openTasks", title: "Открытые задачи", format: "number" },
      { key: "pendingApprovals", title: "На согласовании", format: "number" },
      { key: "alerts", title: "Алерты", format: "number" }
    ],
    listColumns: [
      { key: "title", header: "Задача", type: "text" },
      { key: "assignee", header: "Исполнитель", type: "text" },
      { key: "priority", header: "Приоритет", type: "badge" },
      { key: "status", header: "Статус", type: "status" },
      { key: "dueDate", header: "Срок", type: "date" }
    ],
    createFields: [
      { key: "title", label: "Название", type: "text", required: true },
      { key: "description", label: "Описание", type: "textarea" },
      { key: "priority", label: "Приоритет", type: "select", options: ["low", "medium", "high", "critical"], required: true },
      { key: "dueDate", label: "Срок", type: "date", required: true },
      { key: "assignee", label: "Исполнитель", type: "text" }
    ],
    help: { title: "Главная панель", description: "Централизованный обзор всех ключевых показателей.", features: ["Обзор капитала", "Список задач", "Алерты"], scenarios: ["Утренний обзор", "Проверка срочных задач"], dataSources: ["Портфели", "Система задач"] }
  },
  {
    id: "02", slug: "net-worth",
    title: { ru: "Единый капитал", en: "Net Worth", uk: "Єдиний капітал" },
    collections: ["accounts", "portfolios"], primaryCollection: "accounts",
    kpis: [
      { key: "totalAssets", title: "Активы", format: "currency" },
      { key: "liabilities", title: "Обязательства", format: "currency" },
      { key: "netWorth", title: "Чистая стоимость", format: "currency" },
      { key: "changeMonth", title: "За месяц", format: "percent" }
    ],
    listColumns: [
      { key: "number", header: "Счёт", type: "text" },
      { key: "custodian", header: "Депозитарий", type: "text" },
      { key: "type", header: "Тип", type: "badge" },
      { key: "value", header: "Стоимость", type: "currency" },
      { key: "status", header: "Статус", type: "status" }
    ],
    createFields: [
      { key: "number", label: "Номер счёта", type: "text", required: true },
      { key: "custodian", label: "Депозитарий", type: "text", required: true },
      { key: "type", label: "Тип", type: "select", options: ["brokerage", "custody", "prime", "ira"], required: true },
      { key: "value", label: "Стоимость", type: "number", required: true }
    ],
    help: { title: "Единый капитал", description: "Полная картина активов.", features: ["Агрегация счетов", "Drill-down"], scenarios: ["Ежемесячный отчёт"], dataSources: ["Депозитарии"] }
  },
  {
    id: "03", slug: "reconciliation",
    title: { ru: "Сверка депозитария", en: "Reconciliation", uk: "Звірка" },
    collections: ["accounts"], primaryCollection: "accounts",
    kpis: [
      { key: "matched", title: "Сверено", format: "percent" },
      { key: "breaks", title: "Расхождений", format: "number" },
      { key: "pending", title: "На проверке", format: "number" },
      { key: "lastRun", title: "Последняя сверка", format: "text" }
    ],
    listColumns: [
      { key: "number", header: "Счёт", type: "text" },
      { key: "custodian", header: "Депозитарий", type: "text" },
      { key: "status", header: "Статус", type: "status" },
      { key: "value", header: "Стоимость", type: "currency" }
    ],
    help: { title: "Сверка", description: "Мониторинг расхождений.", features: ["Автоматическая сверка", "Break resolution"], scenarios: ["Ежедневная сверка"], dataSources: ["Депозитарии", "GL"] }
  },
  {
    id: "04", slug: "performance",
    title: { ru: "Эффективность портфеля", en: "Performance", uk: "Ефективність" },
    collections: ["portfolios"], primaryCollection: "portfolios",
    kpis: [
      { key: "ytdReturn", title: "YTD Return", format: "percent" },
      { key: "twrr", title: "TWR", format: "percent" },
      { key: "mwrr", title: "MWR", format: "percent" },
      { key: "alpha", title: "Alpha", format: "percent" }
    ],
    listColumns: [
      { key: "name", header: "Портфель", type: "text" },
      { key: "strategy", header: "Стратегия", type: "badge" },
      { key: "value", header: "Стоимость", type: "currency" },
      { key: "status", header: "Статус", type: "status" }
    ],
    help: { title: "Эффективность", description: "Анализ доходности портфелей.", features: ["TWR/MWR", "Attribution"], scenarios: ["Квартальный отчёт"], dataSources: ["Портфели", "Market data"] }
  },
  {
    id: "05", slug: "reporting",
    title: { ru: "Отчетные пакеты", en: "Reporting", uk: "Звітність" },
    collections: ["documents"], primaryCollection: "documents",
    kpis: [
      { key: "generated", title: "Сгенерировано", format: "number" },
      { key: "pending", title: "Ожидают", format: "number" },
      { key: "delivered", title: "Доставлено", format: "number" },
      { key: "thisMonth", title: "За месяц", format: "number" }
    ],
    listColumns: [
      { key: "title", header: "Отчет", type: "text" },
      { key: "type", header: "Тип", type: "badge" },
      { key: "status", header: "Статус", type: "status" },
      { key: "uploadedAt", header: "Дата", type: "date" }
    ],
    help: { title: "Отчетность", description: "Генерация и доставка отчетов.", features: ["Шаблоны отчетов", "Автоматизация"], scenarios: ["Квартальный пакет"], dataSources: ["Все модули"] }
  },
  {
    id: "06", slug: "general-ledger",
    title: { ru: "Главная книга", en: "General Ledger", uk: "Головна книга" },
    collections: ["accounts"], primaryCollection: "accounts",
    kpis: [
      { key: "entries", title: "Проводок", format: "number" },
      { key: "unposted", title: "Не разнесено", format: "number" },
      { key: "balance", title: "Баланс", format: "currency" },
      { key: "period", title: "Период", format: "text" }
    ],
    listColumns: [
      { key: "number", header: "Счёт", type: "text" },
      { key: "custodian", header: "Название", type: "text" },
      { key: "type", header: "Тип", type: "badge" },
      { key: "value", header: "Баланс", type: "currency" }
    ],
    help: { title: "Главная книга", description: "Учет и проводки.", features: ["Multi-currency", "Drill-down"], scenarios: ["Закрытие периода"], dataSources: ["Транзакции"] }
  },
  {
    id: "07", slug: "partnerships",
    title: { ru: "Партнерства", en: "Partnerships", uk: "Партнерства" },
    collections: ["entities"], primaryCollection: "entities",
    kpis: [
      { key: "total", title: "Всего структур", format: "number" },
      { key: "active", title: "Активных", format: "number" },
      { key: "totalValue", title: "Общая стоимость", format: "currency" },
      { key: "jurisdictions", title: "Юрисдикций", format: "number" }
    ],
    listColumns: [
      { key: "name", header: "Название", type: "text" },
      { key: "type", header: "Тип", type: "badge" },
      { key: "jurisdiction", header: "Юрисдикция", type: "text" },
      { key: "status", header: "Статус", type: "status" }
    ],
    help: { title: "Партнерства", description: "Структура владения.", features: ["Entity hierarchy", "Ownership"], scenarios: ["Добавление структуры"], dataSources: ["Registry"] }
  },
  {
    id: "08", slug: "private-capital",
    title: { ru: "Частный капитал", en: "Private Capital", uk: "Приватний капітал" },
    collections: ["portfolios"], primaryCollection: "portfolios",
    kpis: [
      { key: "committed", title: "Committed", format: "currency" },
      { key: "called", title: "Called", format: "currency" },
      { key: "distributed", title: "Distributed", format: "currency" },
      { key: "nav", title: "NAV", format: "currency" }
    ],
    listColumns: [
      { key: "name", header: "Фонд", type: "text" },
      { key: "strategy", header: "Стратегия", type: "badge" },
      { key: "value", header: "NAV", type: "currency" },
      { key: "status", header: "Статус", type: "status" }
    ],
    help: { title: "Частный капитал", description: "PE/VC инвестиции.", features: ["Capital calls", "Distributions"], scenarios: ["Обработка capital call"], dataSources: ["GP reports"] }
  },
  {
    id: "09", slug: "liquidity",
    title: { ru: "Ликвидность", en: "Liquidity", uk: "Ліквідність" },
    collections: ["accounts", "payments"], primaryCollection: "payments",
    kpis: [
      { key: "available", title: "Доступно", format: "currency" },
      { key: "committed", title: "Зарезервировано", format: "currency" },
      { key: "inflow30d", title: "Приход 30д", format: "currency" },
      { key: "outflow30d", title: "Расход 30д", format: "currency" }
    ],
    listColumns: [
      { key: "number", header: "Платеж", type: "text" },
      { key: "payee", header: "Получатель", type: "text" },
      { key: "amount", header: "Сумма", type: "currency" },
      { key: "status", header: "Статус", type: "status" },
      { key: "dueDate", header: "Дата", type: "date" }
    ],
    help: { title: "Ликвидность", description: "Прогноз денежных потоков.", features: ["Cash forecast", "Runway"], scenarios: ["Планирование расходов"], dataSources: ["Счета", "Платежи"] }
  },
  {
    id: "10", slug: "document-vault",
    title: { ru: "Хранилище документов", en: "Document Vault", uk: "Сховище документів" },
    collections: ["documents"], primaryCollection: "documents",
    kpis: [
      { key: "total", title: "Всего документов", format: "number" },
      { key: "pendingSign", title: "На подпись", format: "number" },
      { key: "expiring", title: "Истекают", format: "number" },
      { key: "shared", title: "Shared", format: "number" }
    ],
    listColumns: [
      { key: "title", header: "Документ", type: "text" },
      { key: "type", header: "Тип", type: "badge" },
      { key: "status", header: "Статус", type: "status" },
      { key: "uploadedAt", header: "Загружен", type: "date" }
    ],
    createFields: [
      { key: "title", label: "Название", type: "text", required: true },
      { key: "type", label: "Тип", type: "select", options: ["legal", "tax", "report", "ips", "banking"], required: true }
    ],
    help: { title: "Документы", description: "Централизованное хранилище.", features: ["Версионирование", "Sharing"], scenarios: ["Загрузка документа"], dataSources: ["Uploads", "Generated"] }
  },
  {
    id: "11", slug: "billpay-checks",
    title: { ru: "Платежи и чеки", en: "Bill Pay & Checks", uk: "Платежі та чеки" },
    collections: ["payments"], primaryCollection: "payments",
    kpis: [
      { key: "pending", title: "Ожидают", format: "number" },
      { key: "paidMonth", title: "Оплачено за месяц", format: "currency" },
      { key: "overdue", title: "Просрочено", format: "number" },
      { key: "scheduled", title: "Запланировано", format: "number" }
    ],
    listColumns: [
      { key: "number", header: "Номер", type: "text" },
      { key: "payee", header: "Получатель", type: "text" },
      { key: "amount", header: "Сумма", type: "currency" },
      { key: "method", header: "Способ", type: "badge" },
      { key: "status", header: "Статус", type: "status" },
      { key: "dueDate", header: "Срок", type: "date" }
    ],
    createFields: [
      { key: "payee", label: "Получатель", type: "text", required: true },
      { key: "amount", label: "Сумма", type: "number", required: true },
      { key: "method", label: "Способ", type: "select", options: ["wire", "check", "ach"], required: true },
      { key: "dueDate", label: "Срок оплаты", type: "date", required: true }
    ],
    help: { title: "Платежи", description: "Управление исходящими платежами.", features: ["Wire/ACH/Check", "Approvals"], scenarios: ["Создание платежа"], dataSources: ["Банки", "Invoices"] }
  },
  {
    id: "12", slug: "ar-revenue",
    title: { ru: "AR и выручка", en: "AR & Revenue", uk: "AR та виручка" },
    collections: ["invoices"], primaryCollection: "invoices",
    kpis: [
      { key: "outstanding", title: "К получению", format: "currency" },
      { key: "collected", title: "Получено", format: "currency" },
      { key: "overdue", title: "Просрочено", format: "currency" },
      { key: "aging30", title: "30+ дней", format: "number" }
    ],
    listColumns: [
      { key: "number", header: "Инвойс", type: "text" },
      { key: "type", header: "Тип", type: "badge" },
      { key: "amount", header: "Сумма", type: "currency" },
      { key: "status", header: "Статус", type: "status" },
      { key: "dueDate", header: "Срок", type: "date" }
    ],
    help: { title: "AR и выручка", description: "Дебиторская задолженность.", features: ["Aging reports", "Collections"], scenarios: ["Follow-up"], dataSources: ["Billing"] }
  },
  {
    id: "13", slug: "fee-billing",
    title: { ru: "Биллинг", en: "Fee Billing", uk: "Білінг" },
    collections: ["invoices"], primaryCollection: "invoices",
    kpis: [
      { key: "billed", title: "Выставлено", format: "currency" },
      { key: "collected", title: "Собрано", format: "currency" },
      { key: "pending", title: "Ожидают", format: "number" },
      { key: "aum", title: "AUM base", format: "currency" }
    ],
    listColumns: [
      { key: "number", header: "Счёт", type: "text" },
      { key: "type", header: "Тип комиссии", type: "badge" },
      { key: "amount", header: "Сумма", type: "currency" },
      { key: "status", header: "Статус", type: "status" },
      { key: "dueDate", header: "Срок", type: "date" }
    ],
    createFields: [
      { key: "type", label: "Тип", type: "select", options: ["management_fee", "performance_fee", "advisory_fee", "admin_fee"], required: true },
      { key: "amount", label: "Сумма", type: "number", required: true },
      { key: "dueDate", label: "Срок", type: "date", required: true }
    ],
    help: { title: "Биллинг", description: "Расчет и выставление комиссий.", features: ["Fee schedules", "Auto-billing"], scenarios: ["Квартальный биллинг"], dataSources: ["AUM", "Agreements"] }
  },
  {
    id: "14", slug: "workflow",
    title: { ru: "Workflow", en: "Workflow", uk: "Workflow" },
    collections: ["tasks", "approvals"], primaryCollection: "tasks",
    kpis: [
      { key: "open", title: "Открытые", format: "number" },
      { key: "highPriority", title: "Высокий приоритет", format: "number" },
      { key: "pending", title: "На согласовании", format: "number" },
      { key: "completedWeek", title: "За неделю", format: "number" }
    ],
    listColumns: [
      { key: "title", header: "Задача", type: "text" },
      { key: "assignee", header: "Исполнитель", type: "text" },
      { key: "priority", header: "Приоритет", type: "badge" },
      { key: "status", header: "Статус", type: "status" },
      { key: "dueDate", header: "Срок", type: "date" }
    ],
    createFields: [
      { key: "title", label: "Название", type: "text", required: true },
      { key: "description", label: "Описание", type: "textarea" },
      { key: "priority", label: "Приоритет", type: "select", options: ["low", "medium", "high", "critical"], required: true },
      { key: "dueDate", label: "Срок", type: "date", required: true },
      { key: "assignee", label: "Исполнитель", type: "text" }
    ],
    help: { title: "Workflow", description: "Управление задачами.", features: ["Задачи", "Approvals"], scenarios: ["Создание задачи"], dataSources: ["Все модули"] }
  },
  {
    id: "15", slug: "onboarding",
    title: { ru: "Onboarding", en: "Onboarding", uk: "Onboarding" },
    collections: ["tasks", "documents"], primaryCollection: "tasks",
    kpis: [
      { key: "inProgress", title: "В процессе", format: "number" },
      { key: "completed", title: "Завершено", format: "number" },
      { key: "pendingDocs", title: "Ожидают документы", format: "number" },
      { key: "avgDays", title: "Среднее время", format: "text" }
    ],
    listColumns: [
      { key: "title", header: "Клиент", type: "text" },
      { key: "status", header: "Статус", type: "status" },
      { key: "priority", header: "Приоритет", type: "badge" },
      { key: "dueDate", header: "Срок", type: "date" }
    ],
    help: { title: "Onboarding", description: "KYC и подключение клиентов.", features: ["Checklists", "KYC"], scenarios: ["Новый клиент"], dataSources: ["Документы", "Forms"] }
  },
  {
    id: "16", slug: "ips",
    title: { ru: "IPS и ограничения", en: "IPS & Mandates", uk: "IPS та обмеження" },
    collections: ["portfolios", "breaches"], primaryCollection: "breaches",
    kpis: [
      { key: "activeIps", title: "Активных IPS", format: "number" },
      { key: "openBreaches", title: "Нарушений", format: "number" },
      { key: "compliance", title: "Compliance", format: "percent" },
      { key: "expiring", title: "Истекают", format: "number" }
    ],
    listColumns: [
      { key: "rule", header: "Правило", type: "text" },
      { key: "severity", header: "Severity", type: "badge" },
      { key: "status", header: "Статус", type: "status" },
      { key: "createdAt", header: "Дата", type: "date" }
    ],
    help: { title: "IPS", description: "Инвестиционные ограничения.", features: ["Rules engine", "Monitoring"], scenarios: ["Добавление правила"], dataSources: ["Портфели", "Mandates"] }
  },
  {
    id: "17", slug: "risk",
    title: { ru: "Риски", en: "Risk", uk: "Ризики" },
    collections: ["alerts", "breaches"], primaryCollection: "alerts",
    kpis: [
      { key: "openAlerts", title: "Алертов", format: "number" },
      { key: "critical", title: "Критических", format: "number" },
      { key: "concentration", title: "Концентрация", format: "percent" },
      { key: "var", title: "VaR (95%)", format: "currency" }
    ],
    listColumns: [
      { key: "title", header: "Алерт", type: "text" },
      { key: "type", header: "Тип", type: "badge" },
      { key: "severity", header: "Severity", type: "badge" },
      { key: "status", header: "Статус", type: "status" },
      { key: "createdAt", header: "Дата", type: "date" }
    ],
    help: { title: "Риски", description: "Мониторинг рисков.", features: ["VaR", "Stress testing"], scenarios: ["Проверка алертов"], dataSources: ["Портфели", "Market"] }
  },
  {
    id: "18", slug: "tax",
    title: { ru: "Налоги", en: "Tax", uk: "Податки" },
    disclaimer: { ru: "Не является налоговой консультацией", en: "Not tax advice", uk: "Не є податковою консультацією" },
    collections: ["documents"], primaryCollection: "documents",
    kpis: [
      { key: "unrealizedGains", title: "Нереализованная прибыль", format: "currency" },
      { key: "realizedYtd", title: "Реализовано YTD", format: "currency" },
      { key: "taxLoss", title: "Tax loss harvest", format: "currency" },
      { key: "pendingK1", title: "Ожидают K-1", format: "number" }
    ],
    listColumns: [
      { key: "title", header: "Документ", type: "text" },
      { key: "type", header: "Тип", type: "badge" },
      { key: "status", header: "Статус", type: "status" },
      { key: "uploadedAt", header: "Дата", type: "date" }
    ],
    help: { title: "Налоги", description: "Tax lots и отчетность.", features: ["Tax lots", "Harvesting"], scenarios: ["End of year"], dataSources: ["Trades", "K-1s"] }
  },
  {
    id: "19", slug: "trust-estate",
    title: { ru: "Трасты и наследование", en: "Trust & Estate", uk: "Трасти та спадкування" },
    disclaimer: { ru: "Не является юридической консультацией", en: "Not legal advice", uk: "Не є юридичною консультацією" },
    collections: ["entities", "documents"], primaryCollection: "entities",
    kpis: [
      { key: "trusts", title: "Трастов", format: "number" },
      { key: "beneficiaries", title: "Бенефициаров", format: "number" },
      { key: "totalValue", title: "Общая стоимость", format: "currency" },
      { key: "reviewsDue", title: "Требуют review", format: "number" }
    ],
    listColumns: [
      { key: "name", header: "Траст", type: "text" },
      { key: "type", header: "Тип", type: "badge" },
      { key: "jurisdiction", header: "Юрисдикция", type: "text" },
      { key: "status", header: "Статус", type: "status" }
    ],
    help: { title: "Трасты", description: "Наследственное планирование.", features: ["Trust admin", "Succession"], scenarios: ["Trust review"], dataSources: ["Legal docs"] }
  },
  {
    id: "20", slug: "integrations",
    title: { ru: "Интеграции", en: "Integrations", uk: "Інтеграції" },
    adminOnly: true,
    collections: ["connections", "syncJobs"], primaryCollection: "connections",
    kpis: [
      { key: "total", title: "Подключений", format: "number" },
      { key: "healthy", title: "Здоровых", format: "percent" },
      { key: "errors", title: "Ошибок", format: "number" },
      { key: "lastSync", title: "Последняя синхр.", format: "text" }
    ],
    listColumns: [
      { key: "provider", header: "Провайдер", type: "text" },
      { key: "status", header: "Статус", type: "status" },
      { key: "lastSync", header: "Последняя синхр.", type: "datetime" },
      { key: "frequency", header: "Частота", type: "badge" }
    ],
    createFields: [
      { key: "provider", label: "Провайдер", type: "select", options: ["Charles Schwab", "Goldman Sachs", "UBS", "JP Morgan", "Fidelity"], required: true },
      { key: "frequency", label: "Частота", type: "select", options: ["hourly", "daily", "weekly"], required: true }
    ],
    help: { title: "Интеграции", description: "Подключения и синхронизация.", features: ["API connections", "Monitoring"], scenarios: ["Добавление депозитария"], dataSources: ["External APIs"] }
  },
  {
    id: "21", slug: "communications",
    title: { ru: "Коммуникации", en: "Communications", uk: "Комунікації" },
    collections: ["threads", "messages"], primaryCollection: "threads",
    kpis: [
      { key: "openThreads", title: "Открытых", format: "number" },
      { key: "sentMonth", title: "За месяц", format: "number" },
      { key: "pending", title: "Ожидают ответа", format: "number" },
      { key: "avgResponse", title: "Среднее время", format: "text" }
    ],
    listColumns: [
      { key: "subject", header: "Тема", type: "text" },
      { key: "status", header: "Статус", type: "status" },
      { key: "messageCount", header: "Сообщений", type: "number" },
      { key: "lastMessageAt", header: "Последнее", type: "datetime" }
    ],
    createFields: [
      { key: "subject", label: "Тема", type: "text", required: true },
      { key: "message", label: "Сообщение", type: "textarea", required: true }
    ],
    help: { title: "Коммуникации", description: "Общение с клиентами.", features: ["Threads", "Attachments"], scenarios: ["Ответ клиенту"], dataSources: ["Email", "Portal"] }
  }
];

export function getSchemaBySlug(slug: string): ModuleSchema | undefined {
  return moduleSchemas.find(s => s.slug === slug);
}
