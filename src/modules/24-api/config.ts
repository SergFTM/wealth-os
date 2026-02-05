import { ModuleConfig } from '../types';

export const apiConfig: ModuleConfig = {
  id: 'api',
  slug: 'api',
  icon: 'code',
  order: 24,
  title: {
    en: 'API & Webhooks',
    ru: 'API и Webhooks',
    uk: 'API та Webhooks',
  },
  description: {
    en: 'Public API, webhooks, developer console, rate limits and API documentation',
    ru: 'Публичный API, вебхуки, консоль разработчика, лимиты и документация API',
    uk: 'Публічний API, вебхуки, консоль розробника, ліміти та документація API',
  },
  disclaimer: {
    en: 'API and webhooks in MVP are demonstrational. Production requires infrastructure, secrets and security.',
    ru: 'API и вебхуки в MVP демонстрационные. Для production требуются инфраструктура, секреты и безопасность.',
    uk: 'API та вебхуки в MVP демонстраційні. Для production потрібні інфраструктура, секрети та безпека.',
  },
  kpis: [
    { key: 'activeKeys', title: { en: 'Active Keys', ru: 'Активных ключей', uk: 'Активних ключів' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'expiringKeys30d', title: { en: 'Expiring 30d', ru: 'Истекает 30д', uk: 'Закінчується 30д' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'webhooksActive', title: { en: 'Webhooks Active', ru: 'Вебхуков активно', uk: 'Вебхуків активно' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'deliveriesFailed7d', title: { en: 'Failed 7d', ru: 'Ошибок 7д', uk: 'Помилок 7д' }, format: 'number', status: 'critical', linkToList: true },
    { key: 'retriesPending', title: { en: 'Retries Pending', ru: 'Ожидает повтора', uk: 'Очікує повтору' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'rateLimitHits24h', title: { en: 'Rate Hits 24h', ru: 'Лимит хитов 24ч', uk: 'Ліміт хітів 24г' }, format: 'number', status: 'warning', linkToList: true },
    { key: 'apiCalls24h', title: { en: 'API Calls 24h', ru: 'Вызовов API 24ч', uk: 'Викликів API 24г' }, format: 'number', status: 'ok', linkToList: true },
    { key: 'clientSafeKeys', title: { en: 'Client-Safe Keys', ru: 'Клиентских ключей', uk: 'Клієнтських ключів' }, format: 'number', status: 'ok', linkToList: true },
  ],
  columns: [
    { key: 'name', header: { en: 'Name', ru: 'Название', uk: 'Назва' } },
    { key: 'keyMode', header: { en: 'Mode', ru: 'Режим', uk: 'Режим' }, type: 'badge' },
    { key: 'scopesCount', header: { en: 'Scopes', ru: 'Скоупы', uk: 'Скоупи' } },
    { key: 'status', header: { en: 'Status', ru: 'Статус', uk: 'Статус' }, type: 'status' },
    { key: 'expiresAt', header: { en: 'Expires', ru: 'Истекает', uk: 'Закінчується' }, type: 'date' },
    { key: 'lastUsedAt', header: { en: 'Last Used', ru: 'Последнее использование', uk: 'Останнє використання' }, type: 'date' },
  ],
  actions: [
    { key: 'createKey', label: { en: 'Create API Key', ru: 'Создать API ключ', uk: 'Створити API ключ' }, variant: 'primary' },
    { key: 'rotateKey', label: { en: 'Rotate Key', ru: 'Ротация ключа', uk: 'Ротація ключа' }, variant: 'secondary' },
    { key: 'revokeKey', label: { en: 'Revoke Key', ru: 'Отозвать ключ', uk: 'Відкликати ключ' }, variant: 'secondary' },
    { key: 'createWebhook', label: { en: 'Create Webhook', ru: 'Создать webhook', uk: 'Створити webhook' }, variant: 'secondary' },
    { key: 'testWebhook', label: { en: 'Test Webhook', ru: 'Тестировать webhook', uk: 'Тестувати webhook' }, variant: 'ghost' },
    { key: 'emitEvents', label: { en: 'Generate Events (Demo)', ru: 'Сгенерировать события', uk: 'Згенерувати події' }, variant: 'ghost' },
    { key: 'openExplorer', label: { en: 'Open Explorer', ru: 'Открыть Explorer', uk: 'Відкрити Explorer' }, variant: 'ghost' },
  ],
};

export default apiConfig;
