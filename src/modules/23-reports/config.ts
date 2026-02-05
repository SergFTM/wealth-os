import { ModuleConfig } from '../types';

export const reportsConfig: ModuleConfig = {
  id: 'reports',
  slug: 'reports',
  icon: 'file-text',
  order: 23,
  title: {
    en: 'Reports & Packs',
    ru: 'Отчеты и пакеты',
    uk: 'Звіти та пакети',
  },
  description: {
    en: 'Report packs, committee packages, templates, sections, exports and publishing',
    ru: 'Отчетные пакеты, комитетские пакеты, шаблоны, секции, экспорты и публикация',
    uk: 'Звітні пакети, комітетські пакети, шаблони, секції, експорти та публікація',
  },
  disclaimer: {
    en: 'Reports are for informational purposes. Verify data and sources before distribution.',
    ru: 'Отчеты носят информационный характер. Проверьте данные и источники перед распространением.',
    uk: 'Звіти мають інформаційний характер. Перевірте дані та джерела перед розповсюдженням.',
  },
  kpis: [
    { key: 'draftPacks', title: { en: 'Draft Packs', ru: 'Черновики', uk: 'Чернетки' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'lockedPacks', title: { en: 'Locked', ru: 'Заблокированы', uk: 'Заблоковані' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'publishedPacks', title: { en: 'Published', ru: 'Опубликованы', uk: 'Опубліковані' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'exports7d', title: { en: 'Exports 7d', ru: 'Экспорты 7д', uk: 'Експорти 7д' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'activeShares', title: { en: 'Active Shares', ru: 'Активные ссылки', uk: 'Активні посилання' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'missingSources', title: { en: 'Missing Sources', ru: 'Без источников', uk: 'Без джерел' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'clientSafePacks', title: { en: 'Client Safe', ru: 'Клиентские', uk: 'Клієнтські' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'libraryItems', title: { en: 'Library Items', ru: 'В библиотеке', uk: 'У бібліотеці' }, format: 'number', status: 'ok', linkToList: true },
  ],
  columns: [
    { key: 'name', header: { en: 'Pack Name', ru: 'Название', uk: 'Назва' } },
    { key: 'packType', header: { en: 'Type', ru: 'Тип', uk: 'Тип' }, type: 'badge' },
    { key: 'scopeType', header: { en: 'Scope', ru: 'Область', uk: 'Область' } },
    { key: 'status', header: { en: 'Status', ru: 'Статус', uk: 'Статус' }, type: 'status' },
    { key: 'sectionsCount', header: { en: 'Sections', ru: 'Секции', uk: 'Секції' } },
    { key: 'updatedAt', header: { en: 'Updated', ru: 'Обновлено', uk: 'Оновлено' }, type: 'date' },
  ],
  actions: [
    { key: 'createPack', label: { en: 'Create Pack', ru: 'Создать пакет', uk: 'Створити пакет' }, variant: 'primary' },
    { key: 'createTemplate', label: { en: 'Create Template', ru: 'Создать шаблон', uk: 'Створити шаблон' }, variant: 'secondary' },
    { key: 'addSection', label: { en: 'Add Section', ru: 'Добавить секцию', uk: 'Додати секцію' }, variant: 'secondary' },
    { key: 'export', label: { en: 'Export', ru: 'Экспорт', uk: 'Експорт' }, variant: 'ghost' },
    { key: 'publish', label: { en: 'Publish', ru: 'Опубликовать', uk: 'Опублікувати' }, variant: 'ghost' },
    { key: 'seedDemo', label: { en: 'Generate Demo', ru: 'Сгенерировать демо', uk: 'Згенерувати демо' }, variant: 'ghost' },
  ],
};

export default reportsConfig;
