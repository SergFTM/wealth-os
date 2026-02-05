import { ModuleConfig } from './types';
import { trustsConfig } from './16-trusts/config';
import { feesConfig } from './17-fees/config';
import { integrationsConfig } from './18-integrations/config';
import { commsConfig } from './19-comms/config';
import { aiConfig } from './20-ai/config';
import { securityConfig } from './21-security/config';
import { platformConfig } from './22-platform/config';
import { reportsConfig } from './23-reports/config';
import { apiConfig } from './24-api/config';
import { adminConfig } from './25-admin/config';
import { planningConfig } from './26-planning/config';
import { dataQualityConfig } from './27-data-quality/config';
import { committeeConfig } from './28-committee/config';
import { dealsConfig } from './29-deals/config';
import { portalConfig } from './30-portal/config';
import { mobileConfig } from './31-mobile/config';
import { academyConfig } from './32-academy/config';
import { sandboxConfig } from './33-sandbox/config';
import { consentsConfig } from './34-consents/config';
import { notificationsConfig } from './35-notifications/config';
import { casesConfig } from './36-cases/config';
import { exportsConfig } from './37-exports/config';
import { ideasConfig } from './38-ideas/config';
import { liquidityPlanningConfig } from './39-liquidity/config';

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

// 10: documents (Document Vault — Module 11)
export const documentVault: ModuleConfig = {
  id: '10',
  slug: 'documents',
  order: 10,
  icon: 'file-text',
  title: { ru: 'Документы', en: 'Documents', uk: 'Документи' },
  description: {
    ru: 'Хранилище документов, версии, шаринг, пакеты доказательств для аудита',
    en: 'Document vault, versions, sharing, evidence packs for audit',
    uk: 'Сховище документів, версії, шарінг, пакети доказів для аудиту',
  },
  kpis: [
    { key: 'totalDocs', title: { ru: 'Всего документов', en: 'Total Documents', uk: 'Всього документів' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'newDocs30d', title: { ru: 'Новые за 30д', en: 'New 30d', uk: 'Нові за 30д' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'unlinkedDocs', title: { ru: 'Без связей', en: 'Unlinked', uk: 'Без зв\'язків' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'linkedDocs', title: { ru: 'Связанные', en: 'Linked', uk: 'Пов\'язані' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'missingRequired', title: { ru: 'Нет обязательных', en: 'Missing Required', uk: 'Немає обов\'язкових' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'evidencePacks', title: { ru: 'Пакеты', en: 'Evidence Packs', uk: 'Пакети доказів' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'activeShares', title: { ru: 'Активные шары', en: 'Active Shares', uk: 'Активні шари' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'auditAlerts', title: { ru: 'Audit алерты', en: 'Audit Alerts', uk: 'Audit алерти' }, format: 'number', status: 'warning', linkToList: true },
  ],
  columns: [
    { key: 'name', header: { ru: 'Имя', en: 'Name', uk: 'Ім\'я' } },
    { key: 'category', header: { ru: 'Категория', en: 'Category', uk: 'Категорія' } },
    { key: 'tags', header: { ru: 'Теги', en: 'Tags', uk: 'Теги' } },
    { key: 'linkedCount', header: { ru: 'Связи', en: 'Links', uk: 'Зв\'язки' } },
    { key: 'createdBy', header: { ru: 'Владелец', en: 'Owner', uk: 'Власник' } },
    { key: 'createdAt', header: { ru: 'Создан', en: 'Created', uk: 'Створено' }, type: 'date' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
  ],
  actions: [
    { key: 'uploadDoc', label: { ru: 'Загрузить документ', en: 'Upload Document', uk: 'Завантажити документ' }, variant: 'primary' },
    { key: 'createPack', label: { ru: 'Создать пакет', en: 'Create Pack', uk: 'Створити пакет' }, variant: 'secondary' },
    { key: 'exportList', label: { ru: 'Экспорт CSV', en: 'Export CSV', uk: 'Експорт CSV' }, variant: 'ghost' },
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
  title: { ru: 'Онбординг и комплаенс', en: 'Onboarding & Compliance', uk: 'Онбординг і комплаєнс' },
  description: {
    ru: 'Intake, KYC/KYB, AML-скрининг, риск-оценка, кейс-менеджмент и финальное согласование',
    en: 'Intake, KYC/KYB, AML screening, risk scoring, case management and final approval',
    uk: 'Intake, KYC/KYB, AML-скринінг, ризик-оцінка, кейс-менеджмент і фінальне погодження',
  },
  disclaimer: {
    ru: 'Комплаенс функции информационные, не являются юридической консультацией',
    en: 'Compliance features are informational and do not constitute legal advice',
    uk: 'Комплаєнс функції інформаційні, не є юридичною консультацією',
  },
  kpis: [
    { key: 'activeCases', title: { ru: 'Активные кейсы', en: 'Active Cases', uk: 'Активні кейси' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'newIntakes30d', title: { ru: 'Новые intake 30д', en: 'New Intakes 30d', uk: 'Нові intake 30д' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'screeningPending', title: { ru: 'Скрининг ожидает', en: 'Screening Pending', uk: 'Скринінг очікує' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'highRisk', title: { ru: 'Высокий риск', en: 'High Risk', uk: 'Високий ризик' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'slaAtRisk', title: { ru: 'SLA под угрозой', en: 'SLA at Risk', uk: 'SLA під загрозою' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'missingDocs', title: { ru: 'Нет документов', en: 'Missing Docs', uk: 'Немає документів' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'pendingApproval', title: { ru: 'Ожидают согласования', en: 'Pending Approval', uk: 'Очікують погодження' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'onHold', title: { ru: 'На удержании', en: 'On Hold', uk: 'На утриманні' }, format: 'number', status: 'critical', linkToList: true },
  ],
  columns: [
    { key: 'name', header: { ru: 'Кейс', en: 'Case', uk: 'Кейс' } },
    { key: 'caseType', header: { ru: 'Тип', en: 'Type', uk: 'Тип' } },
    { key: 'stage', header: { ru: 'Этап', en: 'Stage', uk: 'Етап' }, type: 'badge' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'riskTier', header: { ru: 'Риск', en: 'Risk', uk: 'Ризик' }, type: 'badge' },
    { key: 'assignee', header: { ru: 'Ответственный', en: 'Assignee', uk: 'Відповідальний' } },
    { key: 'createdAt', header: { ru: 'Создан', en: 'Created', uk: 'Створено' }, type: 'date' },
  ],
  actions: [
    { key: 'createCase', label: { ru: 'Создать кейс', en: 'Create Case', uk: 'Створити кейс' }, variant: 'primary' },
    { key: 'createIntake', label: { ru: 'Создать intake', en: 'Create Intake', uk: 'Створити intake' }, variant: 'secondary' },
    { key: 'createScreening', label: { ru: 'Скрининг', en: 'Screening', uk: 'Скринінг' }, variant: 'secondary' },
    { key: 'calcRisk', label: { ru: 'Рассчитать риск', en: 'Calculate Risk', uk: 'Розрахувати ризик' }, variant: 'ghost' },
    { key: 'submitApproval', label: { ru: 'На согласование', en: 'Submit Approval', uk: 'На погодження' }, variant: 'ghost' },
    { key: 'createEvidence', label: { ru: 'Evidence pack', en: 'Evidence Pack', uk: 'Evidence pack' }, variant: 'ghost' },
  ],
};

// 16: ips
export const ips: ModuleConfig = {
  id: '16',
  slug: 'ips',
  order: 16,
  icon: 'shield',
  title: { ru: 'IPS и ограничения', en: 'IPS & Constraints', uk: 'IPS і обмеження' },
  description: {
    ru: 'Инвестиционная политика, ограничения, нарушения, исключения и комитет',
    en: 'Investment Policy Statement, constraints, breaches, waivers and committee',
    uk: 'Інвестиційна політика, обмеження, порушення, винятки і комітет',
  },
  disclaimer: {
    ru: 'Информация об IPS носит справочный характер и требует подтверждения инвестиционным комитетом',
    en: 'IPS information is for reference only and requires investment committee confirmation',
    uk: 'Інформація про IPS носить довідковий характер і потребує підтвердження інвестиційним комітетом',
  },
  kpis: [
    { key: 'activePolicies', title: { ru: 'Активные политики', en: 'Active Policies', uk: 'Активні політики' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'constraintsCount', title: { ru: 'Ограничения', en: 'Constraints', uk: 'Обмеження' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'breachesOpen', title: { ru: 'Нарушения открытые', en: 'Breaches Open', uk: 'Порушення відкриті' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'breachesCritical', title: { ru: 'Критические', en: 'Critical', uk: 'Критичні' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'waiversActive', title: { ru: 'Исключения активные', en: 'Waivers Active', uk: 'Винятки активні' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'waiversExpiring', title: { ru: 'Истекают 30д', en: 'Expiring 30d', uk: 'Закінчуються 30д' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'meetingsCount', title: { ru: 'Заседания 90д', en: 'Meetings 90d', uk: 'Засідання 90д' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'missingDocs', title: { ru: 'Нет документов', en: 'Missing Docs', uk: 'Немає документів' }, format: 'number', status: 'warning', linkToList: true },
  ],
  columns: [
    { key: 'name', header: { ru: 'Название', en: 'Name', uk: 'Назва' } },
    { key: 'scopeType', header: { ru: 'Scope', en: 'Scope', uk: 'Scope' } },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'constraintsCount', header: { ru: 'Ограничения', en: 'Constraints', uk: 'Обмеження' } },
    { key: 'breachesOpen', header: { ru: 'Нарушения', en: 'Breaches', uk: 'Порушення' } },
    { key: 'updatedAt', header: { ru: 'Обновлено', en: 'Updated', uk: 'Оновлено' }, type: 'date' },
  ],
  actions: [
    { key: 'createPolicy', label: { ru: 'Создать политику', en: 'Create Policy', uk: 'Створити політику' }, variant: 'primary' },
    { key: 'addConstraint', label: { ru: 'Добавить ограничение', en: 'Add Constraint', uk: 'Додати обмеження' }, variant: 'secondary' },
    { key: 'createBreach', label: { ru: 'Зафиксировать breach', en: 'Record Breach', uk: 'Зафіксувати breach' }, variant: 'secondary' },
    { key: 'createWaiver', label: { ru: 'Создать waiver', en: 'Create Waiver', uk: 'Створити waiver' }, variant: 'ghost' },
    { key: 'createMeeting', label: { ru: 'Создать meeting', en: 'Create Meeting', uk: 'Створити meeting' }, variant: 'ghost' },
    { key: 'checkConstraints', label: { ru: 'Проверить ограничения', en: 'Check Constraints', uk: 'Перевірити обмеження' }, variant: 'ghost' },
  ],
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

// 19: trust-estate (now using comprehensive trusts module)
export const trusts = trustsConfig;
export const trustEstate = trustsConfig; // alias for backwards compatibility

// 20: integrations (comprehensive integrations hub module)
export const integrations = integrationsConfig;

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

// 22: fees (comprehensive fee billing module)
export const fees = feesConfig;

// 23: comms (secure communications module)
export const comms = commsConfig;

// 24: ai (AI Advisory Layer module)
export const ai = aiConfig;

// 25: security (Security Center module)
export const security = securityConfig;

// 26: platform (Platform Shell and Demo Mode)
export const platform = platformConfig;

// 27: reports (Reporting Studio)
export const reports = reportsConfig;

// 28: api (Public API, Webhooks and Developer Console)
export const api = apiConfig;

// 29: admin (Tenant Admin and White Label)
export const admin = adminConfig;

// 30: planning (Financial Planning and Scenarios)
export const planning = planningConfig;

// 31: data-quality (Data Quality and Observability)
export const dataQuality = dataQualityConfig;

// 32: committee (Investment Committee and Decisions Log)
export const committee = committeeConfig;

// 33: deals (Deals, Corporate Actions and Capital Events)
export const deals = dealsConfig;

// 34: portal (Client Portal and Self Service)
export const portal = portalConfig;

// 35: mobile (Mobile PWA and Offline)
export const mobile = mobileConfig;

// 36: academy (Academy and Knowledge Base)
export const academy = academyConfig;

// 37: sandbox (Integration Sandbox)
export const sandbox = sandboxConfig;

// 38: consents (Consents and Data Sharing)
export const consents = consentsConfig;

// 39: notifications (Notifications and Escalations Center)
export const notifications = notificationsConfig;

// 40: cases (Service Desk and Cases)
export const cases = casesConfig;

// 41: exports (Exports and Audit Packs)
export const exports = exportsConfig;

// 42: ideas (Investment Ideas and Research Hub)
export const ideas = ideasConfig;

// 43: liquidity-planning (Liquidity Planning and Cash Forecast)
export const liquidityPlanning = liquidityPlanningConfig;
