export const config = {
  id: '01',
  slug: 'dashboard-home',
  title: { ru: 'Домой', en: 'Home', uk: 'Домів' },
  description: { 
    ru: 'Executive Home Dashboard — центр управления MFO',
    en: 'Executive Home Dashboard — MFO control center',
    uk: 'Executive Home Dashboard — центр управління MFO'
  },
  icon: 'home',
  collections: ['tasks', 'approvals', 'alerts', 'breaches', 'invoices', 'threads', 'messages', 'auditEvents'],
  primaryCollection: 'tasks',
  rbac: {
    owner: { fullAccess: true },
    admin: { fullAccess: true },
    cio: { hideSecuritySection: true, fullAccess: true },
    cfo: { fullAccess: true },
    operations: { fullAccess: true },
    compliance: { fullAccess: true },
    rm: { fullAccess: true },
    advisor: { limitedQueues: true },
    client: { 
      clientSafe: true,
      visibleSections: ['netWorth', 'documents', 'messages', 'reports'],
      hiddenSections: ['integrations', 'internalQueues', 'dataQuality']
    }
  },
  kpis: [
    { key: 'netWorth', title: 'Единый капитал', icon: 'wallet', link: '/m/net-worth', format: 'currency' },
    { key: 'openTasks', title: 'Открытые задачи', icon: 'tasks', link: '/m/workflow/list?status=open', format: 'number' },
    { key: 'pendingApprovals', title: 'На согласовании', icon: 'check', link: '/m/workflow/list?status=pending_approval', format: 'number' },
    { key: 'ipsBreaches', title: 'IPS нарушения', icon: 'alert', link: '/m/ips/list?status=breach', format: 'number' },
    { key: 'riskAlerts', title: 'Риск алерты', icon: 'warning', link: '/m/risk/list?severity=critical', format: 'number' },
    { key: 'overdueInvoices', title: 'Просрочено', icon: 'invoice', link: '/m/fee-billing/list?status=overdue', format: 'number' },
    { key: 'dataIssues', title: 'Проблемы данных', icon: 'database', link: '/m/integrations/list?tab=data_quality', format: 'number' },
    { key: 'unreadMessages', title: 'Сообщения', icon: 'message', link: '/m/communications/list?filter=unread', format: 'number' }
  ],
  queues: [
    { key: 'tasks', title: 'Задачи', collection: 'tasks' },
    { key: 'approvals', title: 'Согласования', collection: 'approvals' },
    { key: 'riskAlerts', title: 'Алерты рисков', collection: 'alerts' },
    { key: 'dataQuality', title: 'Проблемы интеграций', collection: 'syncJobs' },
    { key: 'messages', title: 'Сообщения клиентов', collection: 'threads' }
  ],
  quickActions: [
    { key: 'createTask', title: 'Создать задачу', collection: 'tasks' },
    { key: 'createRequest', title: 'Создать запрос клиенту', collection: 'threads' },
    { key: 'createReport', title: 'Создать отчетный пакет', collection: 'documents' },
    { key: 'createInvoice', title: 'Создать счет', collection: 'invoices' },
    { key: 'addDocument', title: 'Добавить документ', collection: 'documents' }
  ]
};
