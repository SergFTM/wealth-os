import { ModuleConfig } from '../types';

export const glConfig: ModuleConfig = {
  id: '06',
  slug: 'general-ledger',
  order: 6,
  icon: 'book-open',
  title: { ru: 'Главная книга', en: 'General Ledger', uk: 'Головна книга' },
  description: {
    ru: 'Интегрированный учёт GL/ABOR, план счетов, проводки, мультивалюта, консолидация и закрытие периодов',
    en: 'Integrated GL/ABOR accounting, chart of accounts, journal entries, multi-currency, consolidation and period close',
    uk: 'Інтегрований облік GL/ABOR, план рахунків, проводки, мультивалюта, консолідація і закриття періодів'
  },
  kpis: [
    { key: 'openPeriods', title: { ru: 'Открытые периоды', en: 'Open Periods', uk: 'Відкриті періоди' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'draftEntries', title: { ru: 'Черновики', en: 'Draft Entries', uk: 'Чернетки' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'pendingApprovals', title: { ru: 'На согласовании', en: 'Pending Approvals', uk: 'На погодженні' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'postedToday', title: { ru: 'Проведено сегодня', en: 'Posted Today', uk: 'Проведено сьогодні' }, format: 'number', status: 'ok' },
    { key: 'unreconciled', title: { ru: 'Несверенные', en: 'Unreconciled', uk: 'Несвірені' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'missingFx', title: { ru: 'Нет FX курсов', en: 'Missing FX', uk: 'Немає FX курсів' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'iborAborIssues', title: { ru: 'IBOR/ABOR расхождения', en: 'IBOR/ABOR Issues', uk: 'IBOR/ABOR розбіжності' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'unlinkedDocs', title: { ru: 'Документы без связи', en: 'Unlinked Docs', uk: 'Документи без звʼязку' }, format: 'number', status: 'info' }
  ],
  columns: [
    { key: 'entryId', header: { ru: 'ID проводки', en: 'Entry ID', uk: 'ID проводки' } },
    { key: 'entity', header: { ru: 'Юрлицо', en: 'Entity', uk: 'Юрособа' } },
    { key: 'date', header: { ru: 'Дата', en: 'Date', uk: 'Дата' }, type: 'date' },
    { key: 'period', header: { ru: 'Период', en: 'Period', uk: 'Період' } },
    { key: 'memo', header: { ru: 'Описание', en: 'Memo', uk: 'Опис' } },
    { key: 'debit', header: { ru: 'Дебет', en: 'Debit', uk: 'Дебет' }, type: 'currency' },
    { key: 'credit', header: { ru: 'Кредит', en: 'Credit', uk: 'Кредит' }, type: 'currency' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' }
  ],
  actions: [
    { key: 'createEntry', label: { ru: 'Создать проводку', en: 'Create Entry', uk: 'Створити проводку' }, variant: 'primary' },
    { key: 'importBank', label: { ru: 'Импорт банка', en: 'Import Bank', uk: 'Імпорт банку' }, variant: 'secondary' },
    { key: 'addFxRate', label: { ru: 'Добавить курс', en: 'Add FX Rate', uk: 'Додати курс' }, variant: 'secondary' },
    { key: 'closePeriod', label: { ru: 'Закрыть период', en: 'Close Period', uk: 'Закрити період' }, variant: 'secondary' }
  ]
};

export default glConfig;
