import type { ModuleConfig } from '@/modules/types';

export const feesConfig: ModuleConfig = {
  id: '17',
  slug: 'fees',
  order: 17,
  icon: 'receipt',
  title: {
    ru: 'Комиссии и счета',
    en: 'Fee Billing & Invoicing',
    uk: 'Комісії і рахунки',
  },
  description: {
    ru: 'Договоры, fee schedules, расчет комиссий, инвойсы, AR и интеграция с GL',
    en: 'Contracts, fee schedules, fee calculation, invoices, AR and GL integration',
    uk: 'Договори, fee schedules, розрахунок комісій, інвойси, AR та інтеграція з GL',
  },
  disclaimer: {
    ru: 'Расчёты комиссий являются расчетными и требуют проверки бухгалтерией',
    en: 'Fee calculations are estimates and require accounting verification',
    uk: 'Розрахунки комісій є розрахунковими і потребують перевірки бухгалтерією',
  },
  kpis: [
    {
      key: 'contractsActive',
      title: { ru: 'Активные договоры', en: 'Active Contracts', uk: 'Активні договори' },
      format: 'number',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'feeRunsQuarter',
      title: { ru: 'Расчётов за квартал', en: 'Fee Runs Quarter', uk: 'Розрахунків за квартал' },
      format: 'number',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'invoicesDraft',
      title: { ru: 'Черновики счетов', en: 'Draft Invoices', uk: 'Чернетки рахунків' },
      format: 'number',
      status: 'warning',
      linkToList: true,
    },
    {
      key: 'invoicesPendingApproval',
      title: { ru: 'Ожидают одобрения', en: 'Pending Approval', uk: 'Очікують схвалення' },
      format: 'number',
      status: 'warning',
      linkToList: true,
    },
    {
      key: 'arOutstanding',
      title: { ru: 'Неоплаченная AR', en: 'AR Outstanding', uk: 'Неоплачена AR' },
      format: 'currency',
      status: 'warning',
      linkToList: true,
    },
    {
      key: 'invoicesOverdue',
      title: { ru: 'Просроченных счетов', en: 'Overdue Invoices', uk: 'Прострочених рахунків' },
      format: 'number',
      status: 'critical',
      linkToList: true,
    },
    {
      key: 'paymentsReceived30d',
      title: { ru: 'Получено 30д', en: 'Received 30d', uk: 'Отримано 30д' },
      format: 'currency',
      status: 'ok',
      linkToList: true,
    },
    {
      key: 'glPostingPending',
      title: { ru: 'GL не проведено', en: 'GL Unposted', uk: 'GL не проведено' },
      format: 'number',
      status: 'warning',
      linkToList: true,
    },
  ],
  columns: [
    { key: 'invoiceNumber', header: { ru: '№ Счёта', en: 'Invoice #', uk: '№ Рахунку' } },
    { key: 'client', header: { ru: 'Клиент', en: 'Client', uk: 'Клієнт' } },
    { key: 'period', header: { ru: 'Период', en: 'Period', uk: 'Період' } },
    { key: 'amount', header: { ru: 'Сумма', en: 'Amount', uk: 'Сума' }, type: 'currency' },
    { key: 'dueDate', header: { ru: 'Срок', en: 'Due Date', uk: 'Термін' }, type: 'date' },
    { key: 'status', header: { ru: 'Статус', en: 'Status', uk: 'Статус' }, type: 'status' },
  ],
  actions: [
    { key: 'createContract', label: { ru: 'Создать договор', en: 'Create Contract', uk: 'Створити договір' }, variant: 'primary' },
    { key: 'createSchedule', label: { ru: 'Создать schedule', en: 'Create Schedule', uk: 'Створити schedule' }, variant: 'secondary' },
    { key: 'runFees', label: { ru: 'Запустить расчёт', en: 'Run Fees', uk: 'Запустити розрахунок' }, variant: 'secondary' },
    { key: 'generateInvoices', label: { ru: 'Сгенерировать счета', en: 'Generate Invoices', uk: 'Згенерувати рахунки' }, variant: 'ghost' },
    { key: 'submitApproval', label: { ru: 'На согласование', en: 'Submit Approval', uk: 'На погодження' }, variant: 'ghost' },
    { key: 'markPaid', label: { ru: 'Отметить оплату', en: 'Mark Paid', uk: 'Відмітити оплату' }, variant: 'ghost' },
  ],
};

export default feesConfig;
