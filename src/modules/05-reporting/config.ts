import { ModuleConfig } from '../types';

export const reporting: ModuleConfig = {
  id: '05',
  slug: 'reporting',
  order: 5,
  icon: 'file-text',
  title: { ru: 'Отчётные пакеты', en: 'Reporting Packs', uk: 'Звітні пакети' },
  description: {
    ru: 'Сборка отчётных пакетов, версионирование, согласования, публикация',
    en: 'Report pack assembly, versioning, approvals, client-safe publishing',
    uk: 'Збірка звітних пакетів, версіонування, погодження, публікація'
  },
  kpis: [
    { key: 'active', title: { ru: 'Активные', en: 'Active', uk: 'Активні' }, format: 'number', status: 'ok' },
    { key: 'draft', title: { ru: 'Черновики', en: 'Drafts', uk: 'Чернетки' }, format: 'number', status: 'info' },
    { key: 'inReview', title: { ru: 'На согласовании', en: 'In Review', uk: 'На погодженні' }, format: 'number', status: 'warning' },
    { key: 'slaRisk', title: { ru: 'Просрочено SLA', en: 'SLA Risk', uk: 'Прострочено SLA' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'published', title: { ru: 'Опубликовано', en: 'Published', uk: 'Опубліковано' }, format: 'number', status: 'ok' },
    { key: 'missingSources', title: { ru: 'Missing данные', en: 'Missing Sources', uk: 'Missing дані' }, format: 'number', status: 'warning', linkToList: true },
  ],
  columns: [
    { key: 'name', header: { ru: 'Название', en: 'Name', uk: 'Назва' } },
    { key: 'client', header: { ru: 'Клиент', en: 'Client', uk: 'Клієнт' } },
    { key: 'template', header: { ru: 'Шаблон', en: 'Template', uk: 'Шаблон' } },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'asOf', header: { ru: 'As-of', en: 'As-of', uk: 'As-of' }, type: 'date' },
    { key: 'owner', header: { ru: 'Владелец', en: 'Owner', uk: 'Власник' } },
  ],
  actions: [
    { key: 'create', label: { ru: 'Создать пакет', en: 'Create Pack', uk: 'Створити пакет' }, variant: 'primary' },
    { key: 'template', label: { ru: 'Шаблоны', en: 'Templates', uk: 'Шаблони' }, variant: 'secondary' },
  ],
};

export default reporting;
