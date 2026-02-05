import { ModuleConfig } from '../types';

export const documentsConfig: ModuleConfig = {
  id: '11',
  slug: 'documents',
  order: 11,
  icon: 'file-text',
  title: { 
    ru: 'Документы', 
    en: 'Documents', 
    uk: 'Документи' 
  },
  description: {
    ru: 'Хранилище документов, версии, шаринг, пакеты доказательств для аудита',
    en: 'Document vault, versions, sharing, evidence packs for audit',
    uk: 'Сховище документів, версії, шарінг, пакети доказів для аудиту'
  },
  kpis: [
    { key: 'totalDocs', title: { ru: 'Всего документов', en: 'Total Documents', uk: 'Всього документів' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'newDocs30d', title: { ru: 'Новые за 30д', en: 'New 30d', uk: 'Нові за 30д' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'unlinkedDocs', title: { ru: 'Без связей', en: 'Unlinked', uk: 'Без зв\'язків' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'linkedDocs', title: { ru: 'Связанные', en: 'Linked', uk: 'Пов\'язані' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'missingRequired', title: { ru: 'Нет обязательных', en: 'Missing Required', uk: 'Немає обов\'язкових' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'evidencePacks', title: { ru: 'Пакеты доказательств', en: 'Evidence Packs', uk: 'Пакети доказів' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'activeShares', title: { ru: 'Активные шары', en: 'Active Shares', uk: 'Активні шари' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'auditAlerts', title: { ru: 'Audit алерты', en: 'Audit Alerts', uk: 'Audit алерти' }, format: 'number', status: 'warning', linkToList: true }
  ],
  columns: [
    { key: 'name', header: { ru: 'Имя', en: 'Name', uk: 'Ім\'я' } },
    { key: 'category', header: { ru: 'Категория', en: 'Category', uk: 'Категорія' } },
    { key: 'tags', header: { ru: 'Теги', en: 'Tags', uk: 'Теги' } },
    { key: 'linkedCount', header: { ru: 'Связи', en: 'Links', uk: 'Зв\'язки' }, type: 'text' },
    { key: 'createdBy', header: { ru: 'Владелец', en: 'Owner', uk: 'Власник' } },
    { key: 'createdAt', header: { ru: 'Создан', en: 'Created', uk: 'Створено' }, type: 'date' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' }
  ],
  actions: [
    { key: 'uploadDoc', label: { ru: 'Загрузить документ', en: 'Upload Document', uk: 'Завантажити документ' }, variant: 'primary' },
    { key: 'createPack', label: { ru: 'Создать пакет', en: 'Create Pack', uk: 'Створити пакет' }, variant: 'secondary' },
    { key: 'bulkTags', label: { ru: 'Массовые теги', en: 'Bulk Tags', uk: 'Масові теги' }, variant: 'secondary' },
    { key: 'exportList', label: { ru: 'Экспорт CSV', en: 'Export CSV', uk: 'Експорт CSV' }, variant: 'ghost' },
    { key: 'createTask', label: { ru: 'Создать задачу', en: 'Create Task', uk: 'Створити задачу' }, variant: 'ghost' }
  ]
};

export default documentsConfig;
