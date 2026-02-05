import { ModuleConfig } from '../types';

export const integrationsConfig: ModuleConfig = {
  id: '18',
  slug: 'integrations',
  order: 18,
  icon: 'plug',
  title: { ru: 'Интеграции', en: 'Integrations', uk: 'Інтеграції' },
  description: {
    ru: 'Центр интеграций: подключение источников, мониторинг синхронизаций и качество данных',
    en: 'Integration hub: data sources, sync monitoring and data quality',
    uk: 'Центр інтеграцій: підключення джерел, моніторинг синхронізацій та якість даних',
  },
  disclaimer: {
    ru: 'Интеграции в MVP демонстрационные, реальные подключения требуют настройки и проверки',
    en: 'Integrations in MVP are demonstrative, real connections require setup and verification',
    uk: 'Інтеграції в MVP демонстраційні, реальні підключення потребують налаштування та перевірки',
  },
  clientSafeHidden: true,
  kpis: [
    { key: 'connectorsActive', title: { ru: 'Активные коннекторы', en: 'Active Connectors', uk: 'Активні конектори' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'jobsScheduled', title: { ru: 'Jobs запланировано', en: 'Jobs Scheduled', uk: 'Jobs заплановано' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'runsFailed7d', title: { ru: 'Ошибки 7д', en: 'Failed 7d', uk: 'Помилки 7д' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'qualityOpen', title: { ru: 'Открытые проблемы', en: 'Open Issues', uk: 'Відкриті проблеми' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'criticalIssues', title: { ru: 'Критические', en: 'Critical', uk: 'Критичні' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'mappingGaps', title: { ru: 'Пробелы маппинга', en: 'Mapping Gaps', uk: 'Прогалини мапінгу' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'reconciliationBreaks', title: { ru: 'Расхождения', en: 'Recon Breaks', uk: 'Розбіжності' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'errorsLast24h', title: { ru: 'Ошибки 24ч', en: 'Errors 24h', uk: 'Помилки 24г' }, format: 'number', status: 'warning', linkToList: true },
  ],
  columns: [
    { key: 'name', header: { ru: 'Название', en: 'Name', uk: 'Назва' } },
    { key: 'type', header: { ru: 'Тип', en: 'Type', uk: 'Тип' } },
    { key: 'provider', header: { ru: 'Провайдер', en: 'Provider', uk: 'Провайдер' } },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
    { key: 'health', header: { ru: 'Здоровье', en: 'Health', uk: 'Здоровʼя' }, type: 'badge' },
    { key: 'lastRunAt', header: { ru: 'Последний запуск', en: 'Last Run', uk: 'Останній запуск' }, type: 'date' },
  ],
  actions: [
    { key: 'createConnector', label: { ru: 'Создать коннектор', en: 'Create Connector', uk: 'Створити конектор' }, variant: 'primary' },
    { key: 'createJob', label: { ru: 'Создать job', en: 'Create Job', uk: 'Створити job' }, variant: 'secondary' },
    { key: 'runNow', label: { ru: 'Запустить сейчас', en: 'Run Now', uk: 'Запустити зараз' }, variant: 'secondary' },
    { key: 'createMapping', label: { ru: 'Создать маппинг', en: 'Create Mapping', uk: 'Створити мапінг' }, variant: 'ghost' },
    { key: 'generateIssues', label: { ru: 'Сгенерировать issues (demo)', en: 'Generate Issues (demo)', uk: 'Згенерувати issues (demo)' }, variant: 'ghost' },
    { key: 'exportHealth', label: { ru: 'Экспорт health report', en: 'Export Health Report', uk: 'Експорт health report' }, variant: 'ghost' },
  ],
};
