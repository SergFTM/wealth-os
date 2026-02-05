import { ModuleConfig } from '../types';

export const exportsConfig: ModuleConfig = {
  id: '37',
  slug: 'exports',
  order: 37,
  icon: 'file-output',
  title: {
    ru: 'Экспорты',
    en: 'Exports',
    uk: 'Експорти',
  },
  description: {
    ru: 'Отчетность, экспорты и Audit Packs',
    en: 'Reporting, exports and Audit Packs',
    uk: 'Звітність, експорти та Audit Packs',
  },
  disclaimer: {
    ru: 'Audit pack демонстрационный. Tax: не является налоговой консультацией.',
    en: 'Audit pack is for demonstration. Tax: not tax advice.',
    uk: 'Audit pack демонстраційний. Tax: не є податковою консультацією.',
  },
  kpis: [
    { key: 'packsCreated30d', title: { ru: 'Пакетов за 30д', en: 'Packs 30d', uk: 'Пакетів за 30д' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'exportsRun7d', title: { ru: 'Выгрузок за 7д', en: 'Exports 7d', uk: 'Вигрузок за 7д' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'filesGenerated', title: { ru: 'Файлов', en: 'Files', uk: 'Файлів' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'sharesActive', title: { ru: 'Активных shares', en: 'Active shares', uk: 'Активних shares' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'clientSafePacks', title: { ru: 'Client-safe', en: 'Client-safe', uk: 'Client-safe' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'pendingApprovals', title: { ru: 'Ожидают', en: 'Pending', uk: 'Очікують' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'schedulesActive', title: { ru: 'Расписаний', en: 'Schedules', uk: 'Розкладів' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'lineageMissing', title: { ru: 'Без lineage', en: 'Missing lineage', uk: 'Без lineage' }, format: 'number', status: 'warning', linkToList: true },
  ],
  columns: [
    { key: 'name', header: { ru: 'Название', en: 'Name', uk: 'Назва' } },
    { key: 'packType', header: { ru: 'Тип', en: 'Type', uk: 'Тип' }, type: 'badge' },
    { key: 'scopeType', header: { ru: 'Scope', en: 'Scope', uk: 'Scope' } },
    { key: 'asOf', header: { ru: 'As-of', en: 'As-of', uk: 'As-of' }, type: 'date' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'lastRunAt', header: { ru: 'Последний запуск', en: 'Last run', uk: 'Останній запуск' }, type: 'date' },
  ],
  actions: [
    { key: 'createPack', label: { ru: 'Создать пакет', en: 'Create pack', uk: 'Створити пакет' }, variant: 'primary' },
    { key: 'runExport', label: { ru: 'Запустить экспорт', en: 'Run export', uk: 'Запустити експорт' }, variant: 'secondary' },
    { key: 'createTemplate', label: { ru: 'Создать шаблон', en: 'Create template', uk: 'Створити шаблон' }, variant: 'secondary' },
    { key: 'createShare', label: { ru: 'Поделиться', en: 'Share', uk: 'Поділитися' }, variant: 'ghost' },
  ],
  collections: [
    'exportPacks',
    'exportTemplates',
    'exportRuns',
    'exportFiles',
    'exportShares',
    'exportSchedules',
  ],
};

// Extended config for internal use
export const exportsExtendedConfig = {
  packTypes: [
    { id: 'audit', label: 'Audit Pack', icon: 'Shield' },
    { id: 'tax', label: 'Tax Advisor Pack', icon: 'Receipt' },
    { id: 'bank', label: 'Bank KYC Pack', icon: 'Building' },
    { id: 'ops', label: 'Operations Pack', icon: 'Settings' },
  ],
  exportFormats: [
    { id: 'csv', label: 'CSV', mimeType: 'text/csv' },
    { id: 'pdf', label: 'PDF', mimeType: 'application/pdf' },
  ],
  sections: [
    { id: 'gl_journal', label: 'GL Journal', collection: 'glTransactions' },
    { id: 'net_worth', label: 'Net Worth Snapshot', collection: 'netWorthSnapshots' },
    { id: 'positions', label: 'Positions', collection: 'positions' },
    { id: 'private_capital', label: 'Private Capital Schedule', collection: 'privateCapitalFunds' },
    { id: 'payments', label: 'Payments Summary', collection: 'payments' },
    { id: 'documents', label: 'Documents Index', collection: 'documents' },
  ],
  disclaimers: {
    tax: 'Данный отчет не является налоговой консультацией. Обратитесь к лицензированному налоговому консультанту.',
    audit: 'Audit pack демонстрационный. Для production требуется контроль форматов и цифровых подписей.',
  },
};

export default exportsConfig;
