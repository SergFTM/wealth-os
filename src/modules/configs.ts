import { ModuleConfig } from './types';

// 01: dashboard-home
export const dashboardHome: ModuleConfig = {
  id: '01',
  slug: 'dashboard-home',
  order: 1,
  icon: 'home',
  title: { ru: 'Домой', en: 'Home', uk: 'Домів' },
  kpis: [
    { key: 'netWorth', title: { ru: 'Чистая стоимость', en: 'Net Worth', uk: 'Чиста вартість' }, format: 'currency', status: 'ok', linkToList: false },
    { key: 'openTasks', title: { ru: 'Открытые задачи', en: 'Open Tasks', uk: 'Відкриті задачі' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'pendingApprovals', title: { ru: 'Ожидают одобрения', en: 'Pending Approvals', uk: 'Очікують схвалення' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'alerts', title: { ru: 'Алерты', en: 'Alerts', uk: 'Алерти' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'syncHealth', title: { ru: 'Синхронизация', en: 'Sync Health', uk: 'Синхронізація' }, format: 'percent', status: 'ok' },
    { key: 'clients', title: { ru: 'Клиентов', en: 'Clients', uk: 'Клієнтів' }, format: 'number', status: 'ok' },
  ],
  columns: [
    { key: 'title', header: { ru: 'Задача', en: 'Task', uk: 'Задача' } },
    { key: 'client', header: { ru: 'Клиент', en: 'Client', uk: 'Клієнт' } },
    { key: 'priority', header: { ru: 'Приоритет', en: 'Priority', uk: 'Пріоритет' }, type: 'badge' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'dueDate', header: { ru: 'Срок', en: 'Due Date', uk: 'Термін' }, type: 'date' },
  ],
  actions: [
    { key: 'create', label: { ru: 'Создать задачу', en: 'Create Task', uk: 'Створити задачу' }, variant: 'primary' },
  ],
};

// 02: net-worth
export const netWorth: ModuleConfig = {
  id: '02',
  slug: 'net-worth',
  order: 2,
  icon: 'chart-pie',
  title: { ru: 'Единый капитал', en: 'Net Worth', uk: 'Єдиний капітал' },
  kpis: [
    { key: 'totalAssets', title: { ru: 'Активы', en: 'Total Assets', uk: 'Активи' }, format: 'currency', status: 'ok' },
    { key: 'liabilities', title: { ru: 'Обязательства', en: 'Liabilities', uk: 'Зобовязання' }, format: 'currency', status: 'warning' },
    { key: 'netWorth', title: { ru: 'Чистая стоимость', en: 'Net Worth', uk: 'Чиста вартість' }, format: 'currency', status: 'ok' },
    { key: 'changeMonth', title: { ru: 'Изменение (мес)', en: 'Change (month)', uk: 'Зміна (міс)' }, format: 'percent', status: 'ok' },
  ],
  columns: [
    { key: 'name', header: { ru: 'Актив', en: 'Asset', uk: 'Актив' } },
    { key: 'type', header: { ru: 'Тип', en: 'Type', uk: 'Тип' } },
    { key: 'custodian', header: { ru: 'Кастодиан', en: 'Custodian', uk: 'Кастодіан' } },
    { key: 'value', header: { ru: 'Стоимость', en: 'Value', uk: 'Вартість' }, type: 'currency' },
    { key: 'allocation', header: { ru: 'Доля', en: 'Allocation', uk: 'Частка' }, type: 'text' },
  ],
  actions: [
    { key: 'audit', label: { ru: 'Audit trail', en: 'Audit trail', uk: 'Audit trail' }, variant: 'secondary' },
  ],
};

// 03: reconciliation
export const reconciliation: ModuleConfig = {
  id: '03',
  slug: 'reconciliation',
  order: 3,
  icon: 'scale',
  title: { ru: 'Сверка депозитария', en: 'Reconciliation', uk: 'Звірка депозитарію' },
  kpis: [
    { key: 'matched', title: { ru: 'Соответствует', en: 'Matched', uk: 'Відповідає' }, format: 'number', status: 'ok' },
    { key: 'breaks', title: { ru: 'Расхождения', en: 'Breaks', uk: 'Розбіжності' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'pending', title: { ru: 'Ожидают', en: 'Pending', uk: 'Очікують' }, format: 'number', status: 'warning' },
    { key: 'accuracy', title: { ru: 'Точность', en: 'Accuracy', uk: 'Точність' }, format: 'percent', status: 'ok' },
  ],
  columns: [
    { key: 'account', header: { ru: 'Счет', en: 'Account', uk: 'Рахунок' } },
    { key: 'custodian', header: { ru: 'Кастодиан', en: 'Custodian', uk: 'Кастодіан' } },
    { key: 'ourValue', header: { ru: 'Наши данные', en: 'Our Value', uk: 'Наші дані' }, type: 'currency' },
    { key: 'theirValue', header: { ru: 'Их данные', en: 'Their Value', uk: 'Їх дані' }, type: 'currency' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
  ],
  actions: [],
};

// 04: performance
export const performance: ModuleConfig = {
  id: '04',
  slug: 'performance',
  order: 4,
  icon: 'trending-up',
  title: { ru: 'Эффективность портфеля', en: 'Performance', uk: 'Ефективність портфеля' },
  kpis: [
    { key: 'ytdReturn', title: { ru: 'YTD доходность', en: 'YTD Return', uk: 'YTD дохідність' }, format: 'percent', status: 'ok' },
    { key: 'oneYearReturn', title: { ru: '1Y доходность', en: '1Y Return', uk: '1Y дохідність' }, format: 'percent', status: 'ok' },
    { key: 'vsBenchmark', title: { ru: 'vs Benchmark', en: 'vs Benchmark', uk: 'vs Benchmark' }, format: 'percent', status: 'ok' },
    { key: 'sharpe', title: { ru: 'Sharpe Ratio', en: 'Sharpe Ratio', uk: 'Sharpe Ratio' }, format: 'number', status: 'ok' },
  ],
  columns: [
    { key: 'portfolio', header: { ru: 'Портфель', en: 'Portfolio', uk: 'Портфель' } },
    { key: 'strategy', header: { ru: 'Стратегия', en: 'Strategy', uk: 'Стратегія' } },
    { key: 'ytd', header: { ru: 'YTD', en: 'YTD', uk: 'YTD' }, type: 'text' },
    { key: 'oneYear', header: { ru: '1Y', en: '1Y', uk: '1Y' }, type: 'text' },
    { key: 'benchmark', header: { ru: 'Benchmark', en: 'Benchmark', uk: 'Benchmark' } },
  ],
  actions: [],
};

// 05: reporting
export const reporting: ModuleConfig = {
  id: '05',
  slug: 'reporting',
  order: 5,
  icon: 'file-text',
  title: { ru: 'Отчетные пакеты', en: 'Reporting', uk: 'Звітні пакети' },
  kpis: [
    { key: 'scheduled', title: { ru: 'Запланировано', en: 'Scheduled', uk: 'Заплановано' }, format: 'number', status: 'ok' },
    { key: 'generated', title: { ru: 'Сгенерировано', en: 'Generated', uk: 'Згенеровано' }, format: 'number', status: 'ok' },
    { key: 'delivered', title: { ru: 'Доставлено', en: 'Delivered', uk: 'Доставлено' }, format: 'number', status: 'ok' },
    { key: 'pending', title: { ru: 'Ожидают', en: 'Pending', uk: 'Очікують' }, format: 'number', status: 'warning' },
  ],
  columns: [
    { key: 'name', header: { ru: 'Отчет', en: 'Report', uk: 'Звіт' } },
    { key: 'client', header: { ru: 'Клиент', en: 'Client', uk: 'Клієнт' } },
    { key: 'period', header: { ru: 'Период', en: 'Period', uk: 'Період' } },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'deliveryDate', header: { ru: 'Дата', en: 'Date', uk: 'Дата' }, type: 'date' },
  ],
  actions: [
    { key: 'create', label: { ru: 'Создать пакет', en: 'Create Package', uk: 'Створити пакет' }, variant: 'primary' },
  ],
};

// 06: general-ledger
export const generalLedger: ModuleConfig = {
  id: '06',
  slug: 'general-ledger',
  order: 6,
  icon: 'book-open',
  title: { ru: 'Главная книга', en: 'General Ledger', uk: 'Головна книга' },
  kpis: [
    { key: 'transactions', title: { ru: 'Транзакций', en: 'Transactions', uk: 'Транзакцій' }, format: 'number', status: 'ok' },
    { key: 'debit', title: { ru: 'Дебет', en: 'Debit', uk: 'Дебет' }, format: 'currency', status: 'ok' },
    { key: 'credit', title: { ru: 'Кредит', en: 'Credit', uk: 'Кредит' }, format: 'currency', status: 'ok' },
    { key: 'balance', title: { ru: 'Баланс', en: 'Balance', uk: 'Баланс' }, format: 'currency', status: 'ok' },
  ],
  columns: [
    { key: 'date', header: { ru: 'Дата', en: 'Date', uk: 'Дата' }, type: 'date' },
    { key: 'account', header: { ru: 'Счет', en: 'Account', uk: 'Рахунок' } },
    { key: 'description', header: { ru: 'Описание', en: 'Description', uk: 'Опис' } },
    { key: 'debit', header: { ru: 'Дебет', en: 'Debit', uk: 'Дебет' }, type: 'currency' },
    { key: 'credit', header: { ru: 'Кредит', en: 'Credit', uk: 'Кредит' }, type: 'currency' },
  ],
  actions: [],
};

// 07: partnerships
export const partnerships: ModuleConfig = {
  id: '07',
  slug: 'partnerships',
  order: 7,
  icon: 'users',
  title: { ru: 'Партнерства и структура владения', en: 'Partnerships', uk: 'Партнерства і структура володіння' },
  kpis: [
    { key: 'entities', title: { ru: 'Entities', en: 'Entities', uk: 'Entities' }, format: 'number', status: 'ok' },
    { key: 'partnerships', title: { ru: 'Партнерства', en: 'Partnerships', uk: 'Партнерства' }, format: 'number', status: 'ok' },
    { key: 'totalValue', title: { ru: 'Общая стоимость', en: 'Total Value', uk: 'Загальна вартість' }, format: 'currency', status: 'ok' },
    { key: 'pending', title: { ru: 'Ожидают K-1', en: 'Pending K-1', uk: 'Очікують K-1' }, format: 'number', status: 'warning' },
  ],
  columns: [
    { key: 'name', header: { ru: 'Партнерство', en: 'Partnership', uk: 'Партнерство' } },
    { key: 'type', header: { ru: 'Тип', en: 'Type', uk: 'Тип' } },
    { key: 'ownership', header: { ru: 'Доля %', en: 'Ownership %', uk: 'Частка %' } },
    { key: 'value', header: { ru: 'Стоимость', en: 'Value', uk: 'Вартість' }, type: 'currency' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
  ],
  actions: [],
};

// 08: private-capital
export const privateCapital: ModuleConfig = {
  id: '08',
  slug: 'private-capital',
  order: 8,
  icon: 'briefcase',
  title: { ru: 'Частный капитал и альтернативы', en: 'Private Capital', uk: 'Приватний капітал і альтернативи' },
  kpis: [
    { key: 'commitments', title: { ru: 'Обязательства', en: 'Commitments', uk: 'Зобовязання' }, format: 'currency', status: 'ok' },
    { key: 'called', title: { ru: 'Внесено', en: 'Called', uk: 'Внесено' }, format: 'currency', status: 'ok' },
    { key: 'nav', title: { ru: 'NAV', en: 'NAV', uk: 'NAV' }, format: 'currency', status: 'ok' },
    { key: 'tvpi', title: { ru: 'TVPI', en: 'TVPI', uk: 'TVPI' }, format: 'number', status: 'ok' },
  ],
  columns: [
    { key: 'fund', header: { ru: 'Фонд', en: 'Fund', uk: 'Фонд' } },
    { key: 'type', header: { ru: 'Тип', en: 'Type', uk: 'Тип' } },
    { key: 'vintage', header: { ru: 'Год', en: 'Vintage', uk: 'Рік' } },
    { key: 'commitment', header: { ru: 'Обязательство', en: 'Commitment', uk: 'Зобовязання' }, type: 'currency' },
    { key: 'nav', header: { ru: 'NAV', en: 'NAV', uk: 'NAV' }, type: 'currency' },
  ],
  actions: [],
};

// 09: liquidity
export const liquidity: ModuleConfig = {
  id: '09',
  slug: 'liquidity',
  order: 9,
  icon: 'droplet',
  title: { ru: 'Ликвидность и прогноз денежных потоков', en: 'Liquidity', uk: 'Ліквідність і прогноз грошових потоків' },
  kpis: [
    { key: 'cashAvailable', title: { ru: 'Доступно', en: 'Cash Available', uk: 'Доступно' }, format: 'currency', status: 'ok' },
    { key: 'inflows30', title: { ru: 'Приход 30д', en: 'Inflows 30d', uk: 'Прихід 30д' }, format: 'currency', status: 'ok' },
    { key: 'outflows30', title: { ru: 'Расход 30д', en: 'Outflows 30d', uk: 'Витрати 30д' }, format: 'currency', status: 'warning' },
    { key: 'runway', title: { ru: 'Runway', en: 'Runway', uk: 'Runway' }, format: 'number', status: 'ok' },
  ],
  columns: [
    { key: 'date', header: { ru: 'Дата', en: 'Date', uk: 'Дата' }, type: 'date' },
    { key: 'description', header: { ru: 'Описание', en: 'Description', uk: 'Опис' } },
    { key: 'type', header: { ru: 'Тип', en: 'Type', uk: 'Тип' } },
    { key: 'amount', header: { ru: 'Сумма', en: 'Amount', uk: 'Сума' }, type: 'currency' },
    { key: 'account', header: { ru: 'Счет', en: 'Account', uk: 'Рахунок' } },
  ],
  actions: [],
};

// 10: document-vault
export const documentVault: ModuleConfig = {
  id: '10',
  slug: 'document-vault',
  order: 10,
  icon: 'folder',
  title: { ru: 'Хранилище документов', en: 'Document Vault', uk: 'Сховище документів' },
  kpis: [
    { key: 'total', title: { ru: 'Всего', en: 'Total', uk: 'Всього' }, format: 'number', status: 'ok' },
    { key: 'pendingSignature', title: { ru: 'Ожидают подписи', en: 'Pending Signature', uk: 'Очікують підпису' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'expiringSoon', title: { ru: 'Истекают скоро', en: 'Expiring Soon', uk: 'Закінчуються скоро' }, format: 'number', status: 'warning' },
    { key: 'recentUploads', title: { ru: 'Загружено (7д)', en: 'Uploads (7d)', uk: 'Завантажено (7д)' }, format: 'number', status: 'ok' },
  ],
  columns: [
    { key: 'name', header: { ru: 'Документ', en: 'Document', uk: 'Документ' } },
    { key: 'client', header: { ru: 'Клиент', en: 'Client', uk: 'Клієнт' } },
    { key: 'type', header: { ru: 'Тип', en: 'Type', uk: 'Тип' } },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'uploadedAt', header: { ru: 'Загружен', en: 'Uploaded', uk: 'Завантажено' }, type: 'date' },
  ],
  actions: [
    { key: 'upload', label: { ru: 'Загрузить', en: 'Upload', uk: 'Завантажити' }, variant: 'primary' },
  ],
};

// 11: billpay-checks
export const billpayChecks: ModuleConfig = {
  id: '11',
  slug: 'billpay-checks',
  order: 11,
  icon: 'credit-card',
  title: { ru: 'Платежи и выписка чеков', en: 'Bill Pay & Checks', uk: 'Платежі та виписка чеків' },
  kpis: [
    { key: 'pending', title: { ru: 'К оплате', en: 'Pending', uk: 'До оплати' }, format: 'currency', status: 'warning', linkToList: true },
    { key: 'overdue', title: { ru: 'Просрочено', en: 'Overdue', uk: 'Прострочено' }, format: 'currency', status: 'critical', linkToList: true },
    { key: 'paidMonth', title: { ru: 'Оплачено (мес)', en: 'Paid (month)', uk: 'Оплачено (міс)' }, format: 'currency', status: 'ok' },
    { key: 'checksIssued', title: { ru: 'Чеков выписано', en: 'Checks Issued', uk: 'Чеків виписано' }, format: 'number', status: 'ok' },
  ],
  columns: [
    { key: 'number', header: { ru: '№', en: '#', uk: '№' } },
    { key: 'payee', header: { ru: 'Получатель', en: 'Payee', uk: 'Отримувач' } },
    { key: 'amount', header: { ru: 'Сумма', en: 'Amount', uk: 'Сума' }, type: 'currency' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'dueDate', header: { ru: 'Срок', en: 'Due Date', uk: 'Термін' }, type: 'date' },
  ],
  actions: [
    { key: 'create', label: { ru: 'Создать платеж', en: 'Create Payment', uk: 'Створити платіж' }, variant: 'primary' },
  ],
};

// 12: ar-revenue
export const arRevenue: ModuleConfig = {
  id: '12',
  slug: 'ar-revenue',
  order: 12,
  icon: 'dollar-sign',
  title: { ru: 'Дебиторская задолженность и выручка', en: 'AR & Revenue', uk: 'Дебіторська заборгованість і виручка' },
  kpis: [
    { key: 'totalAr', title: { ru: 'Всего AR', en: 'Total AR', uk: 'Всього AR' }, format: 'currency', status: 'ok' },
    { key: 'overdue', title: { ru: 'Просрочено', en: 'Overdue', uk: 'Прострочено' }, format: 'currency', status: 'critical' },
    { key: 'revenueMonth', title: { ru: 'Выручка (мес)', en: 'Revenue (month)', uk: 'Виручка (міс)' }, format: 'currency', status: 'ok' },
    { key: 'dso', title: { ru: 'DSO', en: 'DSO', uk: 'DSO' }, format: 'number', status: 'warning' },
  ],
  columns: [
    { key: 'invoice', header: { ru: 'Счет', en: 'Invoice', uk: 'Рахунок' } },
    { key: 'client', header: { ru: 'Клиент', en: 'Client', uk: 'Клієнт' } },
    { key: 'amount', header: { ru: 'Сумма', en: 'Amount', uk: 'Сума' }, type: 'currency' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'dueDate', header: { ru: 'Срок', en: 'Due', uk: 'Термін' }, type: 'date' },
  ],
  actions: [],
};

// 13: fee-billing
export const feeBilling: ModuleConfig = {
  id: '13',
  slug: 'fee-billing',
  order: 13,
  icon: 'receipt',
  title: { ru: 'Биллинг и счета', en: 'Fee & Billing', uk: 'Білінг і рахунки' },
  kpis: [
    { key: 'aum', title: { ru: 'AUM', en: 'AUM', uk: 'AUM' }, format: 'currency', status: 'ok' },
    { key: 'feesQuarter', title: { ru: 'Fees (квартал)', en: 'Fees (quarter)', uk: 'Fees (квартал)' }, format: 'currency', status: 'ok' },
    { key: 'avgRate', title: { ru: 'Ставка', en: 'Avg Rate', uk: 'Ставка' }, format: 'percent', status: 'ok' },
    { key: 'clients', title: { ru: 'Клиентов', en: 'Clients', uk: 'Клієнтів' }, format: 'number', status: 'ok' },
  ],
  columns: [
    { key: 'client', header: { ru: 'Клиент', en: 'Client', uk: 'Клієнт' } },
    { key: 'aum', header: { ru: 'AUM', en: 'AUM', uk: 'AUM' }, type: 'currency' },
    { key: 'fee', header: { ru: 'Fee', en: 'Fee', uk: 'Fee' }, type: 'currency' },
    { key: 'rate', header: { ru: 'Ставка', en: 'Rate', uk: 'Ставка' } },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
  ],
  actions: [],
};

// 14: workflow
export const workflow: ModuleConfig = {
  id: '14',
  slug: 'workflow',
  order: 14,
  icon: 'git-branch',
  title: { ru: 'Workflow и согласования', en: 'Workflow', uk: 'Workflow і погодження' },
  kpis: [
    { key: 'openTasks', title: { ru: 'Открытые', en: 'Open Tasks', uk: 'Відкриті' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'highPriority', title: { ru: 'Высокий приоритет', en: 'High Priority', uk: 'Високий пріоритет' }, format: 'number', status: 'critical' },
    { key: 'pendingApprovals', title: { ru: 'Ожидают одобрения', en: 'Pending Approvals', uk: 'Очікують схвалення' }, format: 'number', status: 'warning' },
    { key: 'completedWeek', title: { ru: 'Завершено (нед)', en: 'Completed (week)', uk: 'Завершено (тиж)' }, format: 'number', status: 'ok' },
  ],
  columns: [
    { key: 'title', header: { ru: 'Задача', en: 'Task', uk: 'Задача' } },
    { key: 'client', header: { ru: 'Клиент', en: 'Client', uk: 'Клієнт' } },
    { key: 'assignee', header: { ru: 'Исполнитель', en: 'Assignee', uk: 'Виконавець' } },
    { key: 'priority', header: { ru: 'Приоритет', en: 'Priority', uk: 'Пріоритет' }, type: 'badge' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
  ],
  actions: [
    { key: 'create', label: { ru: 'Создать задачу', en: 'Create Task', uk: 'Створити задачу' }, variant: 'primary' },
  ],
};

// 15: onboarding
export const onboarding: ModuleConfig = {
  id: '15',
  slug: 'onboarding',
  order: 15,
  icon: 'user-plus',
  title: { ru: 'Onboarding и KYC', en: 'Onboarding & KYC', uk: 'Onboarding і KYC' },
  kpis: [
    { key: 'active', title: { ru: 'Активные', en: 'Active', uk: 'Активні' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'pendingDocs', title: { ru: 'Ожидают документы', en: 'Pending Docs', uk: 'Очікують документи' }, format: 'number', status: 'warning' },
    { key: 'kycReview', title: { ru: 'KYC на проверке', en: 'KYC Review', uk: 'KYC на перевірці' }, format: 'number', status: 'info' },
    { key: 'completedMonth', title: { ru: 'Завершено (мес)', en: 'Completed (month)', uk: 'Завершено (міс)' }, format: 'number', status: 'ok' },
  ],
  columns: [
    { key: 'name', header: { ru: 'Название', en: 'Name', uk: 'Назва' } },
    { key: 'stage', header: { ru: 'Этап', en: 'Stage', uk: 'Етап' } },
    { key: 'progress', header: { ru: 'Прогресс', en: 'Progress', uk: 'Прогрес' } },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'dueDate', header: { ru: 'Срок', en: 'Due Date', uk: 'Термін' }, type: 'date' },
  ],
  actions: [
    { key: 'start', label: { ru: 'Начать онбординг', en: 'Start Onboarding', uk: 'Почати онбординг' }, variant: 'primary' },
  ],
};

// 16: ips
export const ips: ModuleConfig = {
  id: '16',
  slug: 'ips',
  order: 16,
  icon: 'shield',
  title: { ru: 'IPS и ограничения', en: 'IPS & Constraints', uk: 'IPS і обмеження' },
  kpis: [
    { key: 'breaches', title: { ru: 'Нарушения', en: 'Breaches', uk: 'Порушення' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'critical', title: { ru: 'Критические', en: 'Critical', uk: 'Критичні' }, format: 'number', status: 'critical' },
    { key: 'warnings', title: { ru: 'Предупреждения', en: 'Warnings', uk: 'Попередження' }, format: 'number', status: 'warning' },
    { key: 'compliance', title: { ru: 'Compliance', en: 'Compliance', uk: 'Compliance' }, format: 'percent', status: 'ok' },
  ],
  columns: [
    { key: 'rule', header: { ru: 'Правило', en: 'Rule', uk: 'Правило' } },
    { key: 'client', header: { ru: 'Клиент', en: 'Client', uk: 'Клієнт' } },
    { key: 'current', header: { ru: 'Текущее', en: 'Current', uk: 'Поточне' } },
    { key: 'threshold', header: { ru: 'Лимит', en: 'Threshold', uk: 'Ліміт' } },
    { key: 'severity', header: { ru: 'Уровень', en: 'Severity', uk: 'Рівень' }, type: 'status' },
  ],
  actions: [],
};

// 17: risk
export const risk: ModuleConfig = {
  id: '17',
  slug: 'risk',
  order: 17,
  icon: 'alert-triangle',
  title: { ru: 'Риски и контроль', en: 'Risk & Control', uk: 'Ризики і контроль' },
  kpis: [
    { key: 'alerts', title: { ru: 'Алерты', en: 'Alerts', uk: 'Алерти' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'critical', title: { ru: 'Критические', en: 'Critical', uk: 'Критичні' }, format: 'number', status: 'critical' },
    { key: 'warnings', title: { ru: 'Предупреждения', en: 'Warnings', uk: 'Попередження' }, format: 'number', status: 'warning' },
    { key: 'riskScore', title: { ru: 'Risk Score', en: 'Risk Score', uk: 'Risk Score' }, format: 'number', status: 'warning' },
  ],
  columns: [
    { key: 'title', header: { ru: 'Алерт', en: 'Alert', uk: 'Алерт' } },
    { key: 'client', header: { ru: 'Клиент', en: 'Client', uk: 'Клієнт' } },
    { key: 'category', header: { ru: 'Категория', en: 'Category', uk: 'Категорія' } },
    { key: 'severity', header: { ru: 'Уровень', en: 'Severity', uk: 'Рівень' }, type: 'status' },
    { key: 'timestamp', header: { ru: 'Время', en: 'Time', uk: 'Час' }, type: 'date' },
  ],
  actions: [],
};

// 18: tax
export const tax: ModuleConfig = {
  id: '18',
  slug: 'tax',
  order: 18,
  icon: 'calculator',
  title: { ru: 'Налоги и tax lots', en: 'Tax & Tax Lots', uk: 'Податки і tax lots' },
  disclaimer: { ru: 'Не является налоговой консультацией', en: 'Not tax advice', uk: 'Не є податковою консультацією' },
  kpis: [
    { key: 'taxSavings', title: { ru: 'Экономия (YTD)', en: 'Tax Savings (YTD)', uk: 'Економія (YTD)' }, format: 'currency', status: 'ok' },
    { key: 'harvestingOpportunity', title: { ru: 'Tax-Loss Harvesting', en: 'Tax-Loss Harvesting', uk: 'Tax-Loss Harvesting' }, format: 'currency', status: 'ok' },
    { key: 'unrealizedGains', title: { ru: 'Нереализ. прибыль', en: 'Unrealized Gains', uk: 'Нереаліз. прибуток' }, format: 'currency', status: 'info' },
    { key: 'estimatedTax', title: { ru: 'Оценочный налог', en: 'Estimated Tax', uk: 'Оцінковий податок' }, format: 'currency', status: 'warning' },
  ],
  columns: [
    { key: 'security', header: { ru: 'Инструмент', en: 'Security', uk: 'Інструмент' } },
    { key: 'acquired', header: { ru: 'Дата покупки', en: 'Acquired', uk: 'Дата покупки' }, type: 'date' },
    { key: 'costBasis', header: { ru: 'Cost Basis', en: 'Cost Basis', uk: 'Cost Basis' }, type: 'currency' },
    { key: 'marketValue', header: { ru: 'Рыночная', en: 'Market Value', uk: 'Ринкова' }, type: 'currency' },
    { key: 'gainLoss', header: { ru: 'Gain/Loss', en: 'Gain/Loss', uk: 'Gain/Loss' }, type: 'currency' },
  ],
  actions: [],
};

// 19: trust-estate
export const trustEstate: ModuleConfig = {
  id: '19',
  slug: 'trust-estate',
  order: 19,
  icon: 'landmark',
  title: { ru: 'Трасты и наследование', en: 'Trust & Estate', uk: 'Трасти і спадкування' },
  disclaimer: { ru: 'Не является юридической консультацией', en: 'Not legal advice', uk: 'Не є юридичною консультацією' },
  kpis: [
    { key: 'trusts', title: { ru: 'Трастов', en: 'Trusts', uk: 'Трастів' }, format: 'number', status: 'ok' },
    { key: 'trustAssets', title: { ru: 'Активы в трастах', en: 'Trust Assets', uk: 'Активи в трастах' }, format: 'currency', status: 'ok' },
    { key: 'beneficiaries', title: { ru: 'Бенефициаров', en: 'Beneficiaries', uk: 'Бенефіціарів' }, format: 'number', status: 'ok' },
    { key: 'jurisdictions', title: { ru: 'Юрисдикций', en: 'Jurisdictions', uk: 'Юрисдикцій' }, format: 'number', status: 'ok' },
  ],
  columns: [
    { key: 'name', header: { ru: 'Траст', en: 'Trust', uk: 'Траст' } },
    { key: 'jurisdiction', header: { ru: 'Юрисдикция', en: 'Jurisdiction', uk: 'Юрисдикція' } },
    { key: 'assets', header: { ru: 'Активы', en: 'Assets', uk: 'Активи' }, type: 'currency' },
    { key: 'beneficiaries', header: { ru: 'Бенефициары', en: 'Beneficiaries', uk: 'Бенефіціари' } },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
  ],
  actions: [],
};

// 20: integrations
export const integrations: ModuleConfig = {
  id: '20',
  slug: 'integrations',
  order: 20,
  icon: 'plug',
  title: { ru: 'Интеграции и синхронизация данных', en: 'Integrations', uk: 'Інтеграції і синхронізація даних' },
  clientSafeHidden: true,
  kpis: [
    { key: 'total', title: { ru: 'Интеграций', en: 'Integrations', uk: 'Інтеграцій' }, format: 'number', status: 'ok' },
    { key: 'syncHealth', title: { ru: 'Sync Health', en: 'Sync Health', uk: 'Sync Health' }, format: 'percent', status: 'ok' },
    { key: 'errors', title: { ru: 'Ошибки', en: 'Errors', uk: 'Помилки' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'warnings', title: { ru: 'Предупреждения', en: 'Warnings', uk: 'Попередження' }, format: 'number', status: 'warning' },
  ],
  columns: [
    { key: 'provider', header: { ru: 'Провайдер', en: 'Provider', uk: 'Провайдер' } },
    { key: 'client', header: { ru: 'Клиент', en: 'Client', uk: 'Клієнт' } },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'records', header: { ru: 'Записей', en: 'Records', uk: 'Записів' } },
    { key: 'lastSync', header: { ru: 'Последняя синхр.', en: 'Last Sync', uk: 'Остання синхр.' }, type: 'date' },
  ],
  actions: [],
};

// 21: communications
export const communications: ModuleConfig = {
  id: '21',
  slug: 'communications',
  order: 21,
  icon: 'message-square',
  title: { ru: 'Коммуникации и запросы клиентов', en: 'Communications', uk: 'Комунікації і запити клієнтів' },
  kpis: [
    { key: 'sentMonth', title: { ru: 'Отправлено (мес)', en: 'Sent (month)', uk: 'Відправлено (міс)' }, format: 'number', status: 'ok' },
    { key: 'emails', title: { ru: 'Email', en: 'Emails', uk: 'Email' }, format: 'number', status: 'ok' },
    { key: 'notifications', title: { ru: 'Уведомления', en: 'Notifications', uk: 'Сповіщення' }, format: 'number', status: 'ok' },
    { key: 'pendingRequests', title: { ru: 'Ожидают ответа', en: 'Pending Requests', uk: 'Очікують відповіді' }, format: 'number', status: 'warning', linkToList: true },
  ],
  columns: [
    { key: 'type', header: { ru: 'Тип', en: 'Type', uk: 'Тип' } },
    { key: 'subject', header: { ru: 'Тема', en: 'Subject', uk: 'Тема' } },
    { key: 'recipient', header: { ru: 'Получатель', en: 'Recipient', uk: 'Отримувач' } },
    { key: 'sentAt', header: { ru: 'Отправлено', en: 'Sent', uk: 'Відправлено' }, type: 'date' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
  ],
  actions: [
    { key: 'compose', label: { ru: 'Написать', en: 'Compose', uk: 'Написати' }, variant: 'primary' },
  ],
};
