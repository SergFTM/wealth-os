'use client';

import { createContext, useContext } from 'react';

/** Core locale for inline { ru, en, uk } label maps */
export type Locale = 'ru' | 'en' | 'uk';

/** Full set of UI languages */
export type DisplayLocale = 'ru' | 'en' | 'uk' | 'es' | 'de' | 'it' | 'fr' | 'el';
export const DISPLAY_LOCALES: DisplayLocale[] = ['en', 'ru', 'uk', 'es', 'de', 'it', 'fr', 'el'];

/** Map display locale to core locale for inline label maps */
export function coreLocale(dl: DisplayLocale): Locale {
  if (dl === 'ru') return 'ru';
  if (dl === 'uk') return 'uk';
  return 'en';
}

/** Create a full Record<string, string> from core translations; missing locales fall back to English */
export function lm(m: { en: string; ru?: string; uk?: string; es?: string; de?: string; it?: string; fr?: string; el?: string }): Record<string, string> {
  return {
    en: m.en,
    ru: m.ru ?? m.en,
    uk: m.uk ?? m.en,
    es: m.es ?? m.en,
    de: m.de ?? m.en,
    it: m.it ?? m.en,
    fr: m.fr ?? m.en,
    el: m.el ?? m.en,
  };
}

// Context for i18n
const I18nContext = createContext<{ lang: Locale }>({ lang: 'en' });

export const I18nProvider = I18nContext.Provider;

export function useI18n() {
  return useContext(I18nContext);
}

// Inline translation helper for multi-locale strings
export function useTranslation() {
  const { lang } = useI18n();
  return function t(_key: string, translations: Record<string, string>): string {
    return translations[lang] || translations.en || translations.ru || _key;
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

export const dictionaries: Record<DisplayLocale, Dictionary> = {
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
  es: {
    nav: {
      dashboard: 'Panel',
      netWorth: 'Patrimonio neto',
      gl: 'Libro mayor',
      performance: 'Rendimiento',
      privateCapital: 'Capital privado',
      documents: 'Documentos',
      billpay: 'Pagos',
      workflow: 'Workflow',
      onboarding: 'Incorporacion',
      ips: 'IPS',
      risk: 'Riesgos',
      tax: 'Impuestos',
      trust: 'Fideicomisos',
      billing: 'Facturacion',
      integrations: 'Integraciones',
      comms: 'Comunicaciones',
      ai: 'AI Copilot',
      security: 'Seguridad',
      platform: 'Plataforma',
      reports: 'Estudio de informes',
      deals: 'Operaciones',
      mobile: 'Modo movil',
      academy: 'Academia',
      sandbox: 'Sandbox',
      cases: 'Casos',
      exports: 'Exportaciones',
    },
    common: {
      search: 'Buscar...',
      create: 'Crear',
      save: 'Guardar',
      cancel: 'Cancelar',
      close: 'Cerrar',
      edit: 'Editar',
      delete: 'Eliminar',
      view: 'Ver',
      loading: 'Cargando...',
      error: 'Error',
      empty: 'Sin datos',
      filter: 'Filtro',
      export: 'Exportar',
      refresh: 'Actualizar',
      logout: 'Cerrar sesion',
      settings: 'Configuracion',
      notifications: 'Notificaciones',
      copilot: 'Copilot',
    },
    status: {
      active: 'Activo',
      pending: 'Pendiente',
      completed: 'Completado',
      overdue: 'Vencido',
      critical: 'Critico',
      warning: 'Advertencia',
      info: 'Informacion',
      success: 'Exitoso',
      error: 'Error',
      inProgress: 'En progreso',
      draft: 'Borrador',
    },
    dashboard: {
      title: 'Panel',
      netWorth: 'Patrimonio neto',
      openTasks: 'Tareas abiertas',
      pendingApprovals: 'Aprobaciones pendientes',
      ipsBreaches: 'Incumplimientos IPS',
      overdueInvoices: 'Facturas vencidas',
      syncHealth: 'Estado de sincronizacion',
      myTasks: 'Mis tareas',
      alerts: 'Alertas',
      recentDocuments: 'Documentos recientes',
      viewAll: 'Ver todo',
    },
    create: {
      title: 'Crear',
      task: 'Tarea',
      request: 'Solicitud',
      invoice: 'Factura',
      reportPackage: 'Paquete de informes',
      case: 'Caso',
    },
    scope: {
      household: 'Household',
      entity: 'Entidad',
      portfolio: 'Cartera',
      account: 'Cuenta',
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
      ask: 'Preguntar',
      explain: 'Explicar',
      draft: 'Borrador',
      triage: 'Triaje',
      summarize: 'Resumir',
      explainChanges: 'Explicar cambios',
      draftMessage: 'Borrador de mensaje',
      draftReport: 'Borrador de informe',
      diagnoseSync: 'Diagnosticar sincronizacion',
      suggestActions: 'Sugerir acciones',
      sources: 'Fuentes',
      confidence: 'Confianza',
      assumptions: 'Supuestos',
      noData: 'Datos insuficientes, seleccione un alcance o conecte una fuente',
      disclaimer: 'Los resultados de IA son informativos y requieren verificacion humana',
    },
    disclaimers: {
      tax: 'No constituye asesoramiento fiscal',
      trust: 'No constituye asesoramiento legal',
      ai: 'Los resultados de IA son informativos y requieren verificacion humana',
    },
    portal: {
      title: 'Portal',
      home: 'Inicio',
      netWorth: 'Patrimonio',
      reports: 'Informes',
      documents: 'Documentos',
      invoices: 'Facturas',
      requests: 'Solicitudes',
      messages: 'Mensajes',
      profile: 'Perfil',
      createRequest: 'Crear solicitud',
      submit: 'Enviar',
      attach: 'Adjuntar',
      status: 'Estado',
      deadline: 'Plazo',
      noData: 'Datos insuficientes',
    },
  },
  de: {
    nav: {
      dashboard: 'Dashboard',
      netWorth: 'Nettovermogen',
      gl: 'Hauptbuch',
      performance: 'Performance',
      privateCapital: 'Privatkapital',
      documents: 'Dokumente',
      billpay: 'Zahlungen',
      workflow: 'Workflow',
      onboarding: 'Onboarding',
      ips: 'IPS',
      risk: 'Risiken',
      tax: 'Steuern',
      trust: 'Trusts',
      billing: 'Abrechnung',
      integrations: 'Integrationen',
      comms: 'Kommunikation',
      ai: 'AI Copilot',
      security: 'Sicherheit',
      platform: 'Plattform',
      reports: 'Berichtsstudio',
      deals: 'Transaktionen',
      mobile: 'Mobiler Modus',
      academy: 'Akademie',
      sandbox: 'Sandbox',
      cases: 'Falle',
      exports: 'Exporte',
    },
    common: {
      search: 'Suchen...',
      create: 'Erstellen',
      save: 'Speichern',
      cancel: 'Abbrechen',
      close: 'Schliessen',
      edit: 'Bearbeiten',
      delete: 'Loschen',
      view: 'Ansehen',
      loading: 'Laden...',
      error: 'Fehler',
      empty: 'Keine Daten',
      filter: 'Filter',
      export: 'Exportieren',
      refresh: 'Aktualisieren',
      logout: 'Abmelden',
      settings: 'Einstellungen',
      notifications: 'Benachrichtigungen',
      copilot: 'Copilot',
    },
    status: {
      active: 'Aktiv',
      pending: 'Ausstehend',
      completed: 'Abgeschlossen',
      overdue: 'Uberfalllig',
      critical: 'Kritisch',
      warning: 'Warnung',
      info: 'Info',
      success: 'Erfolgreich',
      error: 'Fehler',
      inProgress: 'In Bearbeitung',
      draft: 'Entwurf',
    },
    dashboard: {
      title: 'Dashboard',
      netWorth: 'Nettovermogen',
      openTasks: 'Offene Aufgaben',
      pendingApprovals: 'Ausstehende Genehmigungen',
      ipsBreaches: 'IPS-Verstosse',
      overdueInvoices: 'Uberfallige Rechnungen',
      syncHealth: 'Synchronisierungsstatus',
      myTasks: 'Meine Aufgaben',
      alerts: 'Warnungen',
      recentDocuments: 'Aktuelle Dokumente',
      viewAll: 'Alle anzeigen',
    },
    create: {
      title: 'Erstellen',
      task: 'Aufgabe',
      request: 'Anfrage',
      invoice: 'Rechnung',
      reportPackage: 'Berichtspaket',
      case: 'Fall',
    },
    scope: {
      household: 'Household',
      entity: 'Entitat',
      portfolio: 'Portfolio',
      account: 'Konto',
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
      ask: 'Fragen',
      explain: 'Erklaren',
      draft: 'Entwurf',
      triage: 'Triage',
      summarize: 'Zusammenfassen',
      explainChanges: 'Anderungen erklaren',
      draftMessage: 'Nachrichtenentwurf',
      draftReport: 'Berichtsentwurf',
      diagnoseSync: 'Synchronisierung diagnostizieren',
      suggestActions: 'Aktionen vorschlagen',
      sources: 'Quellen',
      confidence: 'Konfidenz',
      assumptions: 'Annahmen',
      noData: 'Unzureichende Daten, wahlen Sie einen Bereich oder verbinden Sie eine Quelle',
      disclaimer: 'KI-Ergebnisse sind informativ und erfordern menschliche Uberprufung',
    },
    disclaimers: {
      tax: 'Keine Steuerberatung',
      trust: 'Keine Rechtsberatung',
      ai: 'KI-Ergebnisse sind informativ und erfordern menschliche Uberprufung',
    },
    portal: {
      title: 'Portal',
      home: 'Startseite',
      netWorth: 'Vermogen',
      reports: 'Berichte',
      documents: 'Dokumente',
      invoices: 'Rechnungen',
      requests: 'Anfragen',
      messages: 'Nachrichten',
      profile: 'Profil',
      createRequest: 'Anfrage erstellen',
      submit: 'Absenden',
      attach: 'Anhangen',
      status: 'Status',
      deadline: 'Frist',
      noData: 'Unzureichende Daten',
    },
  },
  it: {
    nav: {
      dashboard: 'Dashboard',
      netWorth: 'Patrimonio netto',
      gl: 'Libro mastro',
      performance: 'Performance',
      privateCapital: 'Capitale privato',
      documents: 'Documenti',
      billpay: 'Pagamenti',
      workflow: 'Workflow',
      onboarding: 'Onboarding',
      ips: 'IPS',
      risk: 'Rischi',
      tax: 'Tasse',
      trust: 'Trust',
      billing: 'Fatturazione',
      integrations: 'Integrazioni',
      comms: 'Comunicazioni',
      ai: 'AI Copilot',
      security: 'Sicurezza',
      platform: 'Piattaforma',
      reports: 'Studio report',
      deals: 'Operazioni',
      mobile: 'Modalita mobile',
      academy: 'Accademia',
      sandbox: 'Sandbox',
      cases: 'Casi',
      exports: 'Esportazioni',
    },
    common: {
      search: 'Cerca...',
      create: 'Crea',
      save: 'Salva',
      cancel: 'Annulla',
      close: 'Chiudi',
      edit: 'Modifica',
      delete: 'Elimina',
      view: 'Visualizza',
      loading: 'Caricamento...',
      error: 'Errore',
      empty: 'Nessun dato',
      filter: 'Filtro',
      export: 'Esporta',
      refresh: 'Aggiorna',
      logout: 'Esci',
      settings: 'Impostazioni',
      notifications: 'Notifiche',
      copilot: 'Copilot',
    },
    status: {
      active: 'Attivo',
      pending: 'In attesa',
      completed: 'Completato',
      overdue: 'Scaduto',
      critical: 'Critico',
      warning: 'Attenzione',
      info: 'Informazione',
      success: 'Successo',
      error: 'Errore',
      inProgress: 'In corso',
      draft: 'Bozza',
    },
    dashboard: {
      title: 'Dashboard',
      netWorth: 'Patrimonio netto',
      openTasks: 'Attivita aperte',
      pendingApprovals: 'Approvazioni in attesa',
      ipsBreaches: 'Violazioni IPS',
      overdueInvoices: 'Fatture scadute',
      syncHealth: 'Stato sincronizzazione',
      myTasks: 'Le mie attivita',
      alerts: 'Avvisi',
      recentDocuments: 'Documenti recenti',
      viewAll: 'Vedi tutto',
    },
    create: {
      title: 'Crea',
      task: 'Attivita',
      request: 'Richiesta',
      invoice: 'Fattura',
      reportPackage: 'Pacchetto report',
      case: 'Caso',
    },
    scope: {
      household: 'Household',
      entity: 'Entita',
      portfolio: 'Portafoglio',
      account: 'Conto',
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
      ask: 'Chiedi',
      explain: 'Spiega',
      draft: 'Bozza',
      triage: 'Triage',
      summarize: 'Riassumi',
      explainChanges: 'Spiega modifiche',
      draftMessage: 'Bozza messaggio',
      draftReport: 'Bozza report',
      diagnoseSync: 'Diagnostica sincronizzazione',
      suggestActions: 'Suggerisci azioni',
      sources: 'Fonti',
      confidence: 'Affidabilita',
      assumptions: 'Ipotesi',
      noData: 'Dati insufficienti, seleziona un ambito o collega una fonte',
      disclaimer: 'I risultati AI sono informativi e richiedono verifica umana',
    },
    disclaimers: {
      tax: 'Non costituisce consulenza fiscale',
      trust: 'Non costituisce consulenza legale',
      ai: 'I risultati AI sono informativi e richiedono verifica umana',
    },
    portal: {
      title: 'Portale',
      home: 'Home',
      netWorth: 'Patrimonio',
      reports: 'Report',
      documents: 'Documenti',
      invoices: 'Fatture',
      requests: 'Richieste',
      messages: 'Messaggi',
      profile: 'Profilo',
      createRequest: 'Crea richiesta',
      submit: 'Invia',
      attach: 'Allega',
      status: 'Stato',
      deadline: 'Scadenza',
      noData: 'Dati insufficienti',
    },
  },
  fr: {
    nav: {
      dashboard: 'Tableau de bord',
      netWorth: 'Valeur nette',
      gl: 'Grand livre',
      performance: 'Performance',
      privateCapital: 'Capital prive',
      documents: 'Documents',
      billpay: 'Paiements',
      workflow: 'Workflow',
      onboarding: 'Integration',
      ips: 'IPS',
      risk: 'Risques',
      tax: 'Fiscalite',
      trust: 'Fiducies',
      billing: 'Facturation',
      integrations: 'Integrations',
      comms: 'Communications',
      ai: 'AI Copilot',
      security: 'Securite',
      platform: 'Plateforme',
      reports: 'Studio de rapports',
      deals: 'Transactions',
      mobile: 'Mode mobile',
      academy: 'Academie',
      sandbox: 'Sandbox',
      cases: 'Dossiers',
      exports: 'Exportations',
    },
    common: {
      search: 'Rechercher...',
      create: 'Creer',
      save: 'Enregistrer',
      cancel: 'Annuler',
      close: 'Fermer',
      edit: 'Modifier',
      delete: 'Supprimer',
      view: 'Voir',
      loading: 'Chargement...',
      error: 'Erreur',
      empty: 'Aucune donnee',
      filter: 'Filtre',
      export: 'Exporter',
      refresh: 'Actualiser',
      logout: 'Deconnexion',
      settings: 'Parametres',
      notifications: 'Notifications',
      copilot: 'Copilot',
    },
    status: {
      active: 'Actif',
      pending: 'En attente',
      completed: 'Termine',
      overdue: 'En retard',
      critical: 'Critique',
      warning: 'Avertissement',
      info: 'Information',
      success: 'Succes',
      error: 'Erreur',
      inProgress: 'En cours',
      draft: 'Brouillon',
    },
    dashboard: {
      title: 'Tableau de bord',
      netWorth: 'Valeur nette',
      openTasks: 'Taches ouvertes',
      pendingApprovals: 'Approbations en attente',
      ipsBreaches: 'Violations IPS',
      overdueInvoices: 'Factures en retard',
      syncHealth: 'Etat de synchronisation',
      myTasks: 'Mes taches',
      alerts: 'Alertes',
      recentDocuments: 'Documents recents',
      viewAll: 'Voir tout',
    },
    create: {
      title: 'Creer',
      task: 'Tache',
      request: 'Demande',
      invoice: 'Facture',
      reportPackage: 'Package de rapports',
      case: 'Dossier',
    },
    scope: {
      household: 'Household',
      entity: 'Entite',
      portfolio: 'Portefeuille',
      account: 'Compte',
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
      ask: 'Demander',
      explain: 'Expliquer',
      draft: 'Brouillon',
      triage: 'Triage',
      summarize: 'Resumer',
      explainChanges: 'Expliquer les modifications',
      draftMessage: 'Brouillon de message',
      draftReport: 'Brouillon de rapport',
      diagnoseSync: 'Diagnostiquer la synchronisation',
      suggestActions: 'Suggerer des actions',
      sources: 'Sources',
      confidence: 'Confiance',
      assumptions: 'Hypotheses',
      noData: 'Donnees insuffisantes, selectionnez un perimetre ou connectez une source',
      disclaimer: 'Les resultats IA sont informatifs et necessitent une verification humaine',
    },
    disclaimers: {
      tax: 'Ne constitue pas un conseil fiscal',
      trust: 'Ne constitue pas un conseil juridique',
      ai: 'Les resultats IA sont informatifs et necessitent une verification humaine',
    },
    portal: {
      title: 'Portail',
      home: 'Accueil',
      netWorth: 'Patrimoine',
      reports: 'Rapports',
      documents: 'Documents',
      invoices: 'Factures',
      requests: 'Demandes',
      messages: 'Messages',
      profile: 'Profil',
      createRequest: 'Creer une demande',
      submit: 'Soumettre',
      attach: 'Joindre',
      status: 'Statut',
      deadline: 'Echeance',
      noData: 'Donnees insuffisantes',
    },
  },
  el: {
    nav: {
      dashboard: 'Dashboard',
      netWorth: 'Kathari axia',
      gl: 'Geniko katholiko',
      performance: 'Apodosi',
      privateCapital: 'Idiotiko kefalaio',
      documents: 'Engrafa',
      billpay: 'Pliromes',
      workflow: 'Workflow',
      onboarding: 'Ensomatosi',
      ips: 'IPS',
      risk: 'Kindynoi',
      tax: 'Forologia',
      trust: 'Trusts',
      billing: 'Timologisi',
      integrations: 'Ensomatoseis',
      comms: 'Epikoinonies',
      ai: 'AI Copilot',
      security: 'Asfaleia',
      platform: 'Platforma',
      reports: 'Studio anaforon',
      deals: 'Synallages',
      mobile: 'Kiniti leitourgia',
      academy: 'Akadimia',
      sandbox: 'Sandbox',
      cases: 'Ypotheseis',
      exports: 'Exagoges',
    },
    common: {
      search: 'Anazitisi...',
      create: 'Dimiourgia',
      save: 'Apothikefsi',
      cancel: 'Akyrosi',
      close: 'Kleisimo',
      edit: 'Epexergasia',
      delete: 'Diagrafi',
      view: 'Provoli',
      loading: 'Fortosi...',
      error: 'Sfalma',
      empty: 'Den yparxoun dedomena',
      filter: 'Filtro',
      export: 'Exagogi',
      refresh: 'Ananeosin',
      logout: 'Exodos',
      settings: 'Rythmiseis',
      notifications: 'Eidopoiiseis',
      copilot: 'Copilot',
    },
    status: {
      active: 'Energo',
      pending: 'Se ekremmotita',
      completed: 'Oloklirothike',
      overdue: 'Ekprosthesmo',
      critical: 'Krisimo',
      warning: 'Proeidopoiisi',
      info: 'Pliroforisi',
      success: 'Epitychis',
      error: 'Sfalma',
      inProgress: 'Se exelixi',
      draft: 'Proschedio',
    },
    dashboard: {
      title: 'Dashboard',
      netWorth: 'Kathari axia',
      openTasks: 'Anoichtes ergasies',
      pendingApprovals: 'Ekkremeis egkriseis',
      ipsBreaches: 'Paraviaseis IPS',
      overdueInvoices: 'Ekprosthesma timologia',
      syncHealth: 'Katastasi sygchronismou',
      myTasks: 'Oi ergasies mou',
      alerts: 'Eidopoiiseis',
      recentDocuments: 'Prosfata engrafa',
      viewAll: 'Provoli olon',
    },
    create: {
      title: 'Dimiourgia',
      task: 'Ergasia',
      request: 'Aitima',
      invoice: 'Timologio',
      reportPackage: 'Paketo anaforon',
      case: 'Ypothesi',
    },
    scope: {
      household: 'Household',
      entity: 'Ontotita',
      portfolio: 'Chartofylakio',
      account: 'Logariasmos',
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
      ask: 'Erotisi',
      explain: 'Exigisi',
      draft: 'Proschedio',
      triage: 'Triage',
      summarize: 'Perilipsi',
      explainChanges: 'Exigisi allagon',
      draftMessage: 'Proschedio minimatos',
      draftReport: 'Proschedio anaforas',
      diagnoseSync: 'Diagnosi sygchronismou',
      suggestActions: 'Protasi energeion',
      sources: 'Piges',
      confidence: 'Empistosyni',
      assumptions: 'Ypotheseis',
      noData: 'Aneparkis dedomena, epilexte perimetre i syndeste mia pigi',
      disclaimer: 'Ta apotelesmata AI einai pliroforiakou charaktira kai apaitoun anthropini epivevaiosin',
    },
    disclaimers: {
      tax: 'Den apoteli forologiki symvouli',
      trust: 'Den apoteli nomiki symvouli',
      ai: 'Ta apotelesmata AI einai pliroforiakou charaktira kai apaitoun anthropini epivevaiosin',
    },
    portal: {
      title: 'Portal',
      home: 'Archikin',
      netWorth: 'Periousia',
      reports: 'Anafores',
      documents: 'Engrafa',
      invoices: 'Timologia',
      requests: 'Aitimata',
      messages: 'Minimata',
      profile: 'Profil',
      createRequest: 'Dimiourgia aitimatos',
      submit: 'Ypovoli',
      attach: 'Ependisi',
      status: 'Katastasi',
      deadline: 'Prothesmia',
      noData: 'Aneparkis dedomena',
    },
  },
};
