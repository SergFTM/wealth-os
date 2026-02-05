'use client';

import { createContext, useContext } from 'react';

export type Locale = 'ru' | 'en' | 'uk';

// Context for i18n
const I18nContext = createContext<{ lang: Locale }>({ lang: 'ru' });

export const I18nProvider = I18nContext.Provider;

export function useI18n() {
  return useContext(I18nContext);
}

// Inline translation helper for multi-locale strings
export function useTranslation() {
  const { lang } = useI18n();
  return function t(_key: string, translations: Record<string, string>): string {
    return translations[lang] || translations.ru || translations.en || _key;
  };
}

export interface Dictionary {
  nav: {
    dashboard: string;
    netWorth: string;
    gl: string;
    performance: string;
    privateCapital: string;
    documents: string;
    billpay: string;
    workflow: string;
    onboarding: string;
    ips: string;
    risk: string;
    tax: string;
    trust: string;
    billing: string;
    integrations: string;
    comms: string;
    ai: string;
    security: string;
    platform: string;
    reports: string;
    deals: string;
    mobile: string;
    academy: string;
    sandbox: string;
    cases: string;
    exports: string;
  };
  common: {
    search: string;
    create: string;
    save: string;
    cancel: string;
    close: string;
    edit: string;
    delete: string;
    view: string;
    loading: string;
    error: string;
    empty: string;
    filter: string;
    export: string;
    refresh: string;
    logout: string;
    settings: string;
    notifications: string;
    copilot: string;
  };
  status: {
    active: string;
    pending: string;
    completed: string;
    overdue: string;
    critical: string;
    warning: string;
    info: string;
    success: string;
    error: string;
    inProgress: string;
    draft: string;
  };
  dashboard: {
    title: string;
    netWorth: string;
    openTasks: string;
    pendingApprovals: string;
    ipsBreaches: string;
    overdueInvoices: string;
    syncHealth: string;
    myTasks: string;
    alerts: string;
    recentDocuments: string;
    viewAll: string;
  };
  create: {
    title: string;
    task: string;
    request: string;
    invoice: string;
    reportPackage: string;
    case: string;
  };
  scope: {
    household: string;
    entity: string;
    portfolio: string;
    account: string;
  };
  roles: {
    admin: string;
    cio: string;
    cfo: string;
    operations: string;
    compliance: string;
    rm: string;
    advisor: string;
    client: string;
  };
  copilot: {
    title: string;
    ask: string;
    explain: string;
    draft: string;
    triage: string;
    summarize: string;
    explainChanges: string;
    draftMessage: string;
    draftReport: string;
    diagnoseSync: string;
    suggestActions: string;
    sources: string;
    confidence: string;
    assumptions: string;
    noData: string;
    disclaimer: string;
  };
  disclaimers: {
    tax: string;
    trust: string;
    ai: string;
  };
  portal: {
    title: string;
    home: string;
    netWorth: string;
    reports: string;
    documents: string;
    invoices: string;
    requests: string;
    messages: string;
    profile: string;
    createRequest: string;
    submit: string;
    attach: string;
    status: string;
    deadline: string;
    noData: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  ru: {
    nav: {
      dashboard: 'Дашборд',
      netWorth: 'Чистая стоимость',
      gl: 'Главная книга',
      performance: 'Эффективность',
      privateCapital: 'Частный капитал',
      documents: 'Документы',
      billpay: 'Платежи и чеки',
      workflow: 'Workflow',
      onboarding: 'Онбординг',
      ips: 'IPS',
      risk: 'Риски',
      tax: 'Налоги',
      trust: 'Трасты',
      billing: 'Биллинг',
      integrations: 'Интеграции',
      comms: 'Коммуникации',
      ai: 'AI Copilot',
      security: 'Безопасность',
      platform: 'Платформа',
      reports: 'Студия отчетов',
      deals: 'Сделки',
      mobile: 'Мобильный режим',
      academy: 'Академия',
      sandbox: 'Песочница',
      cases: 'Кейсы',
      exports: 'Экспорты',
    },
    common: {
      search: 'Поиск...',
      create: 'Создать',
      save: 'Сохранить',
      cancel: 'Отмена',
      close: 'Закрыть',
      edit: 'Редактировать',
      delete: 'Удалить',
      view: 'Просмотр',
      loading: 'Загрузка...',
      error: 'Ошибка',
      empty: 'Нет данных',
      filter: 'Фильтр',
      export: 'Экспорт',
      refresh: 'Обновить',
      logout: 'Выход',
      settings: 'Настройки',
      notifications: 'Уведомления',
      copilot: 'Copilot',
    },
    status: {
      active: 'Активно',
      pending: 'Ожидает',
      completed: 'Завершено',
      overdue: 'Просрочено',
      critical: 'Критично',
      warning: 'Внимание',
      info: 'Информация',
      success: 'Успешно',
      error: 'Ошибка',
      inProgress: 'В работе',
      draft: 'Черновик',
    },
    dashboard: {
      title: 'Дашборд',
      netWorth: 'Чистая стоимость',
      openTasks: 'Открытые задачи',
      pendingApprovals: 'Ожидают одобрения',
      ipsBreaches: 'Нарушения IPS',
      overdueInvoices: 'Просроченные счета',
      syncHealth: 'Состояние синхронизации',
      myTasks: 'Мои задачи',
      alerts: 'Алерты',
      recentDocuments: 'Недавние документы',
      viewAll: 'Смотреть все',
    },
    create: {
      title: 'Создать',
      task: 'Задача',
      request: 'Запрос',
      invoice: 'Счет',
      reportPackage: 'Отчетный пакет',
      case: 'Кейс',
    },
    scope: {
      household: 'Household',
      entity: 'Entity',
      portfolio: 'Портфель',
      account: 'Счет',
    },
    roles: {
      admin: 'Owner/Admin',
      cio: 'CIO',
      cfo: 'CFO',
      operations: 'Operations',
      compliance: 'Compliance',
      rm: 'RM',
      advisor: 'External Advisor',
      client: 'Client',
    },
    copilot: {
      title: 'AI Copilot',
      ask: 'Спросить',
      explain: 'Объяснить',
      draft: 'Черновик',
      triage: 'Триаж',
      summarize: 'Суммировать',
      explainChanges: 'Объяснить изменения',
      draftMessage: 'Черновик сообщения',
      draftReport: 'Черновик резюме отчета',
      diagnoseSync: 'Диагностировать синхронизацию',
      suggestActions: 'Предложить действия',
      sources: 'Источники',
      confidence: 'Уверенность',
      assumptions: 'Допущения',
      noData: 'Недостаточно данных, выберите scope или подключите источник',
      disclaimer: 'AI выводы информационные и требуют проверки человеком',
    },
    disclaimers: {
      tax: 'Не является налоговой консультацией',
      trust: 'Не является юридической консультацией',
      ai: 'AI выводы информационные и требуют проверки человеком',
    },
    portal: {
      title: 'Портал',
      home: 'Главная',
      netWorth: 'Капитал',
      reports: 'Отчеты',
      documents: 'Документы',
      invoices: 'Счета',
      requests: 'Запросы',
      messages: 'Сообщения',
      profile: 'Профиль',
      createRequest: 'Создать запрос',
      submit: 'Отправить',
      attach: 'Прикрепить',
      status: 'Статус',
      deadline: 'Срок',
      noData: 'Недостаточно данных',
    },
  },
  en: {
    nav: {
      dashboard: 'Dashboard',
      netWorth: 'Net Worth',
      gl: 'General Ledger',
      performance: 'Performance',
      privateCapital: 'Private Capital',
      documents: 'Documents',
      billpay: 'Bill Pay',
      workflow: 'Workflow',
      onboarding: 'Onboarding',
      ips: 'IPS',
      risk: 'Risk',
      tax: 'Tax',
      trust: 'Trust',
      billing: 'Billing',
      integrations: 'Integrations',
      comms: 'Communications',
      ai: 'AI Copilot',
      security: 'Security',
      platform: 'Platform',
      reports: 'Reporting Studio',
      deals: 'Deals',
      mobile: 'Mobile Mode',
      academy: 'Academy',
      sandbox: 'Sandbox',
      cases: 'Cases',
      exports: 'Exports',
    },
    common: {
      search: 'Search...',
      create: 'Create',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      loading: 'Loading...',
      error: 'Error',
      empty: 'No data',
      filter: 'Filter',
      export: 'Export',
      refresh: 'Refresh',
      logout: 'Logout',
      settings: 'Settings',
      notifications: 'Notifications',
      copilot: 'Copilot',
    },
    status: {
      active: 'Active',
      pending: 'Pending',
      completed: 'Completed',
      overdue: 'Overdue',
      critical: 'Critical',
      warning: 'Warning',
      info: 'Info',
      success: 'Success',
      error: 'Error',
      inProgress: 'In Progress',
      draft: 'Draft',
    },
    dashboard: {
      title: 'Dashboard',
      netWorth: 'Net Worth',
      openTasks: 'Open Tasks',
      pendingApprovals: 'Pending Approvals',
      ipsBreaches: 'IPS Breaches',
      overdueInvoices: 'Overdue Invoices',
      syncHealth: 'Sync Health',
      myTasks: 'My Tasks',
      alerts: 'Alerts',
      recentDocuments: 'Recent Documents',
      viewAll: 'View All',
    },
    create: {
      title: 'Create',
      task: 'Task',
      request: 'Request',
      invoice: 'Invoice',
      reportPackage: 'Report Package',
      case: 'Case',
    },
    scope: {
      household: 'Household',
      entity: 'Entity',
      portfolio: 'Portfolio',
      account: 'Account',
    },
    roles: {
      admin: 'Owner/Admin',
      cio: 'CIO',
      cfo: 'CFO',
      operations: 'Operations',
      compliance: 'Compliance',
      rm: 'RM',
      advisor: 'External Advisor',
      client: 'Client',
    },
    copilot: {
      title: 'AI Copilot',
      ask: 'Ask',
      explain: 'Explain',
      draft: 'Draft',
      triage: 'Triage',
      summarize: 'Summarize',
      explainChanges: 'Explain Changes',
      draftMessage: 'Draft Message',
      draftReport: 'Draft Report Summary',
      diagnoseSync: 'Diagnose Sync',
      suggestActions: 'Suggest Actions',
      sources: 'Sources',
      confidence: 'Confidence',
      assumptions: 'Assumptions',
      noData: 'Insufficient data, select scope or connect a source',
      disclaimer: 'AI outputs are informational and require human verification',
    },
    disclaimers: {
      tax: 'Not tax advice',
      trust: 'Not legal advice',
      ai: 'AI outputs are informational and require human verification',
    },
    portal: {
      title: 'Portal',
      home: 'Home',
      netWorth: 'Net Worth',
      reports: 'Reports',
      documents: 'Documents',
      invoices: 'Invoices',
      requests: 'Requests',
      messages: 'Messages',
      profile: 'Profile',
      createRequest: 'Create Request',
      submit: 'Submit',
      attach: 'Attach',
      status: 'Status',
      deadline: 'Deadline',
      noData: 'Insufficient data',
    },
  },
  uk: {
    nav: {
      dashboard: 'Дашборд',
      netWorth: 'Чиста вартість',
      gl: 'Головна книга',
      performance: 'Ефективність',
      privateCapital: 'Приватний капітал',
      documents: 'Документи',
      billpay: 'Платежі та чеки',
      workflow: 'Workflow',
      onboarding: 'Онбординг',
      ips: 'IPS',
      risk: 'Ризики',
      tax: 'Податки',
      trust: 'Трасти',
      billing: 'Біллінг',
      integrations: 'Інтеграції',
      comms: 'Комунікації',
      ai: 'AI Copilot',
      security: 'Безпека',
      platform: 'Платформа',
      reports: 'Студія звітів',
      deals: 'Угоди',
      mobile: 'Мобільний режим',
      academy: 'Академія',
      sandbox: 'Пісочниця',
      cases: 'Кейси',
      exports: 'Експорти',
    },
    common: {
      search: 'Пошук...',
      create: 'Створити',
      save: 'Зберегти',
      cancel: 'Скасувати',
      close: 'Закрити',
      edit: 'Редагувати',
      delete: 'Видалити',
      view: 'Переглянути',
      loading: 'Завантаження...',
      error: 'Помилка',
      empty: 'Немає даних',
      filter: 'Фільтр',
      export: 'Експорт',
      refresh: 'Оновити',
      logout: 'Вихід',
      settings: 'Налаштування',
      notifications: 'Сповіщення',
      copilot: 'Copilot',
    },
    status: {
      active: 'Активно',
      pending: 'Очікує',
      completed: 'Завершено',
      overdue: 'Прострочено',
      critical: 'Критично',
      warning: 'Увага',
      info: 'Інформація',
      success: 'Успішно',
      error: 'Помилка',
      inProgress: 'В роботі',
      draft: 'Чернетка',
    },
    dashboard: {
      title: 'Дашборд',
      netWorth: 'Чиста вартість',
      openTasks: 'Відкриті задачі',
      pendingApprovals: 'Очікують схвалення',
      ipsBreaches: 'Порушення IPS',
      overdueInvoices: 'Прострочені рахунки',
      syncHealth: 'Стан синхронізації',
      myTasks: 'Мої задачі',
      alerts: 'Алерти',
      recentDocuments: 'Останні документи',
      viewAll: 'Дивитись все',
    },
    create: {
      title: 'Створити',
      task: 'Задача',
      request: 'Запит',
      invoice: 'Рахунок',
      reportPackage: 'Звітний пакет',
      case: 'Кейс',
    },
    scope: {
      household: 'Household',
      entity: 'Entity',
      portfolio: 'Портфель',
      account: 'Рахунок',
    },
    roles: {
      admin: 'Owner/Admin',
      cio: 'CIO',
      cfo: 'CFO',
      operations: 'Operations',
      compliance: 'Compliance',
      rm: 'RM',
      advisor: 'External Advisor',
      client: 'Client',
    },
    copilot: {
      title: 'AI Copilot',
      ask: 'Запитати',
      explain: 'Пояснити',
      draft: 'Чернетка',
      triage: 'Тріаж',
      summarize: 'Підсумувати',
      explainChanges: 'Пояснити зміни',
      draftMessage: 'Чернетка повідомлення',
      draftReport: 'Чернетка резюме звіту',
      diagnoseSync: 'Діагностувати синхронізацію',
      suggestActions: 'Запропонувати дії',
      sources: 'Джерела',
      confidence: 'Впевненість',
      assumptions: 'Припущення',
      noData: 'Недостатньо даних, оберіть scope або підключіть джерело',
      disclaimer: 'AI висновки інформаційні та потребують перевірки людиною',
    },
    disclaimers: {
      tax: 'Не є податковою консультацією',
      trust: 'Не є юридичною консультацією',
      ai: 'AI висновки інформаційні та потребують перевірки людиною',
    },
    portal: {
      title: 'Портал',
      home: 'Головна',
      netWorth: 'Капітал',
      reports: 'Звіти',
      documents: 'Документи',
      invoices: 'Рахунки',
      requests: 'Запити',
      messages: 'Повідомлення',
      profile: 'Профіль',
      createRequest: 'Створити запит',
      submit: 'Відправити',
      attach: 'Прикріпити',
      status: 'Статус',
      deadline: 'Термін',
      noData: 'Недостатньо даних',
    },
  },
};
