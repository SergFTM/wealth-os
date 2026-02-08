import { ModuleConfig } from '../types';

export const consentPrivacyConfig: ModuleConfig = {
  id: '54',
  slug: 'consent',
  order: 54,
  icon: 'shield-check',
  color: 'emerald',
  enabled: true,

  title: {
    ru: 'Consent',
    en: 'Consent',
    uk: 'Consent'
  },

  description: {
    ru: 'Управление согласиями, приватностью данных и правами доступа',
    en: 'Consent management, data privacy and access rights',
    uk: 'Управління згодами, приватністю даних та правами доступу'
  },

  disclaimer: {
    ru: 'Не является юридической консультацией. Политики и согласия требуют проверки юристом и compliance.',
    en: 'Not legal advice. Policies and consents require review by legal counsel and compliance.',
    uk: 'Не є юридичною консультацією. Політики та згоди потребують перевірки юристом і compliance.'
  },

  kpis: [
    {
      key: 'activeConsents',
      title: { ru: 'Активные согласия', en: 'Active Consents', uk: 'Активні згоди' },
      format: 'number',
      status: 'ok',
      linkToList: true
    },
    {
      key: 'expiring30d',
      title: { ru: 'Истекают 30д', en: 'Expiring 30d', uk: 'Закінчуються 30д' },
      format: 'number',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'requestsPending',
      title: { ru: 'Запросы ожидают', en: 'Requests Pending', uk: 'Запити очікують' },
      format: 'number',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'policiesActive',
      title: { ru: 'Политики активные', en: 'Policies Active', uk: 'Політики активні' },
      format: 'number',
      status: 'ok',
      linkToList: true
    },
    {
      key: 'reviewsDue',
      title: { ru: 'Проверки доступа', en: 'Reviews Due', uk: 'Перевірки доступу' },
      format: 'number',
      status: 'warning',
      linkToList: true
    },
    {
      key: 'conflictsOpen',
      title: { ru: 'Конфликты', en: 'Conflicts', uk: 'Конфлікти' },
      format: 'number',
      status: 'critical',
      linkToList: true
    },
    {
      key: 'clientSafeOverrides',
      title: { ru: 'Client-safe', en: 'Client-safe', uk: 'Client-safe' },
      format: 'number',
      status: 'info',
      linkToList: true
    },
    {
      key: 'revocations30d',
      title: { ru: 'Отзывы 30д', en: 'Revocations 30d', uk: 'Відкликання 30д' },
      format: 'number',
      status: 'info',
      linkToList: true
    }
  ],

  columns: [
    {
      key: 'grantorLabel',
      header: { ru: 'Грантор', en: 'Grantor', uk: 'Грантор' },
      width: 'w-36'
    },
    {
      key: 'granteeLabel',
      header: { ru: 'Получатель', en: 'Grantee', uk: 'Отримувач' },
      width: 'w-36'
    },
    {
      key: 'purposeKey',
      header: { ru: 'Цель', en: 'Purpose', uk: 'Мета' },
      type: 'badge',
      width: 'w-28'
    },
    {
      key: 'effectiveFrom',
      header: { ru: 'С', en: 'From', uk: 'З' },
      type: 'date',
      width: 'w-24'
    },
    {
      key: 'effectiveTo',
      header: { ru: 'До', en: 'To', uk: 'До' },
      type: 'date',
      width: 'w-24'
    },
    {
      key: 'statusKey',
      header: { ru: 'Статус', en: 'Status', uk: 'Статус' },
      type: 'status',
      width: 'w-24'
    }
  ],

  actions: [
    {
      key: 'createConsent',
      label: { ru: 'Создать согласие', en: 'Create Consent', uk: 'Створити згоду' },
      icon: 'plus',
      variant: 'primary'
    },
    {
      key: 'createRequest',
      label: { ru: 'Создать запрос', en: 'Create Request', uk: 'Створити запит' },
      icon: 'plus-circle',
      variant: 'secondary'
    },
    {
      key: 'createPolicy',
      label: { ru: 'Создать политику', en: 'Create Policy', uk: 'Створити політику' },
      icon: 'shield',
      variant: 'secondary'
    },
    {
      key: 'startReview',
      label: { ru: 'Запустить проверку', en: 'Start Review', uk: 'Запустити перевірку' },
      icon: 'check-circle',
      variant: 'secondary'
    },
    {
      key: 'generateDemo',
      label: { ru: 'Demo данные', en: 'Demo Data', uk: 'Demo дані' },
      icon: 'database',
      variant: 'ghost'
    }
  ],

  collections: [
    'consents',
    'consentRequests',
    'privacyPolicies',
    'accessReviews',
    'consentConflicts',
    'auditEvents'
  ],

  routes: {
    dashboard: '/m/consent',
    list: '/m/consent/list',
    consentDetail: '/m/consent/consent/[id]',
    requestDetail: '/m/consent/request/[id]',
    policyDetail: '/m/consent/policy/[id]',
    reviewDetail: '/m/consent/review/[id]'
  },

  tabs: [
    { key: 'consents', label: { ru: 'Согласия', en: 'Consents', uk: 'Згоди' } },
    { key: 'requests', label: { ru: 'Запросы', en: 'Requests', uk: 'Запити' } },
    { key: 'policies', label: { ru: 'Политики', en: 'Policies', uk: 'Політики' } },
    { key: 'access_reviews', label: { ru: 'Проверки доступа', en: 'Access Reviews', uk: 'Перевірки доступу' } },
    { key: 'conflicts', label: { ru: 'Конфликты', en: 'Conflicts', uk: 'Конфлікти' } },
    { key: 'audit', label: { ru: 'Аудит', en: 'Audit', uk: 'Аудит' } }
  ],

  adminOnly: false,
  clientSafeHidden: false
};

// Consent statuses
export const CONSENT_STATUSES = {
  active: { ru: 'Активное', en: 'Active', uk: 'Активне', color: 'green' },
  revoked: { ru: 'Отозвано', en: 'Revoked', uk: 'Відкликано', color: 'red' },
  expired: { ru: 'Истекло', en: 'Expired', uk: 'Закінчилось', color: 'gray' }
};

// Purpose keys
export const PURPOSE_KEYS = {
  audit: { ru: 'Аудит', en: 'Audit', uk: 'Аудит', color: 'blue' },
  tax: { ru: 'Налоги', en: 'Tax', uk: 'Податки', color: 'amber' },
  legal: { ru: 'Юридический', en: 'Legal', uk: 'Юридичний', color: 'purple' },
  advisor_access: { ru: 'Доступ адвайзера', en: 'Advisor Access', uk: 'Доступ адвайзера', color: 'teal' },
  banking: { ru: 'Банковский', en: 'Banking', uk: 'Банківський', color: 'emerald' },
  other: { ru: 'Другое', en: 'Other', uk: 'Інше', color: 'gray' }
};

// Request types
export const REQUEST_TYPES = {
  export: { ru: 'Экспорт данных', en: 'Data Export', uk: 'Експорт даних', color: 'blue' },
  correct: { ru: 'Исправление', en: 'Correction', uk: 'Виправлення', color: 'amber' },
  delete: { ru: 'Удаление', en: 'Deletion', uk: 'Видалення', color: 'red' },
  new_access: { ru: 'Новый доступ', en: 'New Access', uk: 'Новий доступ', color: 'green' }
};

// Request statuses
export const REQUEST_STATUSES = {
  pending: { ru: 'Ожидает', en: 'Pending', uk: 'Очікує', color: 'amber' },
  approved: { ru: 'Одобрен', en: 'Approved', uk: 'Схвалено', color: 'green' },
  rejected: { ru: 'Отклонён', en: 'Rejected', uk: 'Відхилено', color: 'red' },
  fulfilled: { ru: 'Исполнен', en: 'Fulfilled', uk: 'Виконано', color: 'blue' }
};

// Policy types
export const POLICY_TYPES = {
  retention: { ru: 'Хранение', en: 'Retention', uk: 'Зберігання', color: 'blue' },
  legal_hold: { ru: 'Legal hold', en: 'Legal Hold', uk: 'Legal hold', color: 'purple' },
  export_controls: { ru: 'Контроль экспорта', en: 'Export Controls', uk: 'Контроль експорту', color: 'amber' },
  client_safe: { ru: 'Client-safe', en: 'Client-safe', uk: 'Client-safe', color: 'teal' }
};

// Review statuses
export const REVIEW_STATUSES = {
  open: { ru: 'Открыта', en: 'Open', uk: 'Відкрита', color: 'amber' },
  closed: { ru: 'Закрыта', en: 'Closed', uk: 'Закрита', color: 'green' }
};

// Conflict types
export const CONFLICT_TYPES = {
  overlap: { ru: 'Пересечение', en: 'Overlap', uk: 'Перетин', color: 'amber' },
  expired_access: { ru: 'Просроченный доступ', en: 'Expired Access', uk: 'Прострочений доступ', color: 'red' },
  policy_violation: { ru: 'Нарушение политики', en: 'Policy Violation', uk: 'Порушення політики', color: 'purple' },
  client_safe_mismatch: { ru: 'Client-safe конфликт', en: 'Client-safe Mismatch', uk: 'Client-safe конфлікт', color: 'teal' }
};

// Severity levels
export const SEVERITY_LEVELS = {
  ok: { ru: 'OK', en: 'OK', uk: 'OK', color: 'green' },
  warning: { ru: 'Предупреждение', en: 'Warning', uk: 'Попередження', color: 'amber' },
  critical: { ru: 'Критический', en: 'Critical', uk: 'Критичний', color: 'red' }
};

// Grantee types
export const GRANTEE_TYPES = {
  user: { ru: 'Пользователь', en: 'User', uk: 'Користувач' },
  advisor: { ru: 'Адвайзер', en: 'Advisor', uk: 'Адвайзер' },
  vendor: { ru: 'Вендор', en: 'Vendor', uk: 'Вендор' }
};

// Scope types
export const SCOPE_TYPES = {
  modules: { ru: 'Модули', en: 'Modules', uk: 'Модулі', color: 'blue' },
  entities: { ru: 'Юридические лица', en: 'Entities', uk: 'Юридичні особи', color: 'green' },
  portfolios: { ru: 'Портфели', en: 'Portfolios', uk: 'Портфелі', color: 'purple' },
  documents: { ru: 'Документы', en: 'Documents', uk: 'Документи', color: 'amber' },
  packs: { ru: 'Пакеты', en: 'Packs', uk: 'Пакети', color: 'teal' }
};

export default consentPrivacyConfig;
