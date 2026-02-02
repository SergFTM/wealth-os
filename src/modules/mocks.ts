import { ModuleMock } from './types';

const clients = ['Aurora Family', 'Limassol Holdings', 'North Star Trust', 'Vega Partners', 'Orion Family', 'Cedar Legacy'];
const assignees = ['Алексей П.', 'Мария К.', 'Иван С.', 'Елена В.', 'Дмитрий Н.'];
const priorities = ['low', 'medium', 'high', 'critical'];
const statuses = ['pending', 'in_progress', 'completed'];

export const moduleMocks: Record<string, ModuleMock> = {
  'dashboard-home': {
    kpiValues: { netWorth: 487500000, openTasks: 23, pendingApprovals: 12, alerts: 8, syncHealth: 94, clients: 6 },
    items: [
      { id: '1', title: 'Revisar Q4 Report', client: 'Aurora Family', priority: 'high', status: 'in_progress', dueDate: '2026-02-01' },
      { id: '2', title: 'Подписать документы KYC', client: 'Limassol Holdings', priority: 'critical', status: 'pending', dueDate: '2026-01-30' },
      { id: '3', title: 'Обновить IPS', client: 'North Star Trust', priority: 'medium', status: 'in_progress', dueDate: '2026-02-05' },
      { id: '4', title: 'Ребалансировка портфеля', client: 'Vega Partners', priority: 'high', status: 'pending', dueDate: '2026-02-03' },
      { id: '5', title: 'Проверить синхронизацию', client: 'Orion Family', priority: 'low', status: 'completed', dueDate: '2026-01-28' },
    ],
  },
  'net-worth': {
    kpiValues: { totalAssets: 500000000, liabilities: 12500000, netWorth: 487500000, changeMonth: 2.4 },
    items: [
      { id: '1', name: 'Charles Schwab Brokerage', type: 'Brokerage', custodian: 'Charles Schwab', value: 125000000, allocation: '25.6%' },
      { id: '2', name: 'Goldman Sachs PB', type: 'Prime Brokerage', custodian: 'Goldman Sachs', value: 95000000, allocation: '19.5%' },
      { id: '3', name: 'UBS Wealth', type: 'Managed', custodian: 'UBS', value: 78000000, allocation: '16.0%' },
      { id: '4', name: 'JP Morgan Private', type: 'Private Bank', custodian: 'JP Morgan', value: 112000000, allocation: '23.0%' },
      { id: '5', name: 'Real Estate Holdings', type: 'Real Estate', custodian: 'Direct', value: 77500000, allocation: '15.9%' },
    ],
  },
  'reconciliation': {
    kpiValues: { matched: 1234, breaks: 8, pending: 15, accuracy: 99.4 },
    items: [
      { id: '1', account: 'Schwab-001', custodian: 'Charles Schwab', ourValue: 125000000, theirValue: 125000000, status: 'matched' },
      { id: '2', account: 'GS-002', custodian: 'Goldman Sachs', ourValue: 95000000, theirValue: 94850000, status: 'break' },
      { id: '3', account: 'UBS-003', custodian: 'UBS', ourValue: 78000000, theirValue: 78000000, status: 'matched' },
      { id: '4', account: 'JPM-004', custodian: 'JP Morgan', ourValue: 112000000, theirValue: 112000000, status: 'matched' },
      { id: '5', account: 'Fidelity-005', custodian: 'Fidelity', ourValue: 45000000, theirValue: 45100000, status: 'pending' },
    ],
  },
  'performance': {
    kpiValues: { ytdReturn: 8.4, oneYearReturn: 12.6, vsBenchmark: 2.1, sharpe: 1.42 },
    items: [
      { id: '1', portfolio: 'Aurora Growth', strategy: 'Growth', ytd: '+9.2%', oneYear: '+14.1%', benchmark: 'S&P 500' },
      { id: '2', portfolio: 'Limassol Conservative', strategy: 'Conservative', ytd: '+4.8%', oneYear: '+6.2%', benchmark: '60/40' },
      { id: '3', portfolio: 'North Star Balanced', strategy: 'Balanced', ytd: '+7.1%', oneYear: '+10.5%', benchmark: 'MSCI World' },
      { id: '4', portfolio: 'Vega Aggressive', strategy: 'Aggressive', ytd: '+12.3%', oneYear: '+18.7%', benchmark: 'Nasdaq' },
      { id: '5', portfolio: 'Orion Income', strategy: 'Income', ytd: '+3.2%', oneYear: '+5.1%', benchmark: 'Barclays Agg' },
    ],
  },
  'reporting': {
    kpiValues: { scheduled: 24, generated: 18, delivered: 15, pending: 6 },
    items: [
      { id: '1', name: 'Q4 2025 Report', client: 'Aurora Family', period: 'Q4 2025', status: 'delivered', deliveryDate: '2026-01-15' },
      { id: '2', name: 'Monthly Statement', client: 'Limassol Holdings', period: 'Jan 2026', status: 'pending', deliveryDate: '2026-02-05' },
      { id: '3', name: 'Annual Review', client: 'North Star Trust', period: '2025', status: 'in_progress', deliveryDate: '2026-02-01' },
      { id: '4', name: 'Tax Package', client: 'Vega Partners', period: '2025', status: 'draft', deliveryDate: '2026-03-01' },
      { id: '5', name: 'Performance Summary', client: 'Orion Family', period: 'Q4 2025', status: 'delivered', deliveryDate: '2026-01-20' },
    ],
  },
  'general-ledger': {
    kpiValues: { transactions: 1234, debit: 450000, credit: 380000, balance: 2515000 },
    items: [
      { id: '1', date: '2026-01-28', account: 'Cash', description: 'Dividend - AAPL', debit: 15000, credit: 0 },
      { id: '2', date: '2026-01-27', account: 'Investments', description: 'Purchase - MSFT', debit: 0, credit: 50000 },
      { id: '3', date: '2026-01-26', account: 'Cash', description: 'Wire transfer', debit: 100000, credit: 0 },
      { id: '4', date: '2026-01-25', account: 'Fees', description: 'Management fee Q4', debit: 0, credit: 25000 },
      { id: '5', date: '2026-01-24', account: 'Investments', description: 'Sale - GOOG', debit: 75000, credit: 0 },
    ],
  },
  'partnerships': {
    kpiValues: { entities: 12, partnerships: 8, totalValue: 125000000, pending: 3 },
    items: [
      { id: '1', name: 'Aurora Holdings LP', type: 'Limited Partnership', ownership: '45%', value: 35000000, status: 'active' },
      { id: '2', name: 'Limassol Real Estate LLC', type: 'LLC', ownership: '100%', value: 28000000, status: 'active' },
      { id: '3', name: 'North Star Ventures GP', type: 'General Partnership', ownership: '25%', value: 15000000, status: 'active' },
      { id: '4', name: 'Vega Investment Partners', type: 'Limited Partnership', ownership: '60%', value: 32000000, status: 'active' },
      { id: '5', name: 'Orion Holdings Inc', type: 'Corporation', ownership: '100%', value: 15000000, status: 'pending_k1' },
    ],
  },
  'private-capital': {
    kpiValues: { commitments: 25500000, called: 15000000, nav: 17450000, tvpi: 1.16 },
    items: [
      { id: '1', fund: 'Tech Growth Fund III', type: 'VC', vintage: '2023', commitment: 5000000, nav: 4200000 },
      { id: '2', fund: 'Real Estate Partners IV', type: 'RE', vintage: '2022', commitment: 10000000, nav: 9500000 },
      { id: '3', fund: 'Buyout Fund VII', type: 'PE', vintage: '2024', commitment: 7500000, nav: 2100000 },
      { id: '4', fund: 'Infrastructure Fund II', type: 'Infra', vintage: '2023', commitment: 3000000, nav: 1650000 },
      { id: '5', fund: 'Credit Opportunities', type: 'Credit', vintage: '2024', commitment: 0, nav: 0 },
    ],
  },
  'liquidity': {
    kpiValues: { cashAvailable: 8500000, inflows30: 2500000, outflows30: 1800000, runway: 18 },
    items: [
      { id: '1', date: '2026-02-01', description: 'Dividend income', type: 'Inflow', amount: 450000, account: 'Schwab' },
      { id: '2', date: '2026-02-05', description: 'Quarterly fee payment', type: 'Outflow', amount: 312500, account: 'Operating' },
      { id: '3', date: '2026-02-10', description: 'Capital call - PE Fund', type: 'Outflow', amount: 750000, account: 'Investment' },
      { id: '4', date: '2026-02-15', description: 'Property rental income', type: 'Inflow', amount: 125000, account: 'RE Holdings' },
      { id: '5', date: '2026-02-20', description: 'Tax payment', type: 'Outflow', amount: 500000, account: 'Tax Reserve' },
    ],
  },
  'document-vault': {
    kpiValues: { total: 1547, pendingSignature: 8, expiringSoon: 3, recentUploads: 24 },
    items: [
      { id: '1', name: 'Aurora IPS 2026.pdf', client: 'Aurora Family', type: 'IPS', status: 'pending_signature', uploadedAt: '2026-01-25' },
      { id: '2', name: 'Q4 Report Final.pdf', client: 'Limassol Holdings', type: 'Report', status: 'active', uploadedAt: '2026-01-20' },
      { id: '3', name: 'Trust Agreement.pdf', client: 'North Star Trust', type: 'Legal', status: 'active', uploadedAt: '2026-01-15' },
      { id: '4', name: 'K-1 2025.pdf', client: 'Vega Partners', type: 'Tax', status: 'pending', uploadedAt: '2026-01-28' },
      { id: '5', name: 'Wire Instructions.pdf', client: 'Orion Family', type: 'Banking', status: 'active', uploadedAt: '2026-01-10' },
    ],
  },
  'billpay-checks': {
    kpiValues: { pending: 450000, overdue: 125000, paidMonth: 1250000, checksIssued: 45 },
    items: [
      { id: '1', number: 'INV-2026-001', payee: 'Property Management Co', amount: 85000, status: 'pending', dueDate: '2026-02-01' },
      { id: '2', number: 'INV-2026-002', payee: 'Legal Services LLC', amount: 45000, status: 'overdue', dueDate: '2026-01-15' },
      { id: '3', number: 'INV-2026-003', payee: 'Insurance Broker', amount: 125000, status: 'pending', dueDate: '2026-02-05' },
      { id: '4', number: 'INV-2026-004', payee: 'Accounting Firm', amount: 35000, status: 'paid', dueDate: '2026-01-20' },
      { id: '5', number: 'INV-2026-005', payee: 'IT Services', amount: 18000, status: 'pending', dueDate: '2026-02-10' },
    ],
  },
  'ar-revenue': {
    kpiValues: { totalAr: 850000, overdue: 125000, revenueMonth: 312500, dso: 32 },
    items: [
      { id: '1', invoice: 'AR-001', client: 'Aurora Family', amount: 312500, status: 'pending', dueDate: '2026-02-15' },
      { id: '2', invoice: 'AR-002', client: 'Limassol Holdings', amount: 212500, status: 'paid', dueDate: '2026-01-15' },
      { id: '3', invoice: 'AR-003', client: 'North Star Trust', amount: 135000, status: 'overdue', dueDate: '2026-01-01' },
      { id: '4', invoice: 'AR-004', client: 'Vega Partners', amount: 167500, status: 'pending', dueDate: '2026-02-01' },
      { id: '5', invoice: 'AR-005', client: 'Orion Family', amount: 22500, status: 'pending', dueDate: '2026-02-10' },
    ],
  },
  'fee-billing': {
    kpiValues: { aum: 487500000, feesQuarter: 827500, avgRate: 0.26, clients: 6 },
    items: [
      { id: '1', client: 'Aurora Family', aum: 125000000, fee: 312500, rate: '0.25%', status: 'billed' },
      { id: '2', client: 'Limassol Holdings', aum: 85000000, fee: 212500, rate: '0.25%', status: 'paid' },
      { id: '3', client: 'North Star Trust', aum: 45000000, fee: 135000, rate: '0.30%', status: 'pending' },
      { id: '4', client: 'Vega Partners', aum: 67000000, fee: 167500, rate: '0.25%', status: 'billed' },
      { id: '5', client: 'Orion Family', aum: 75000000, fee: 0, rate: '0.00%', status: 'waived' },
    ],
  },
  'workflow': {
    kpiValues: { openTasks: 23, highPriority: 8, pendingApprovals: 12, completedWeek: 15 },
    items: [
      { id: '1', title: 'Revisar Q4 Report', client: 'Aurora Family', assignee: 'Алексей П.', priority: 'high', status: 'in_progress' },
      { id: '2', title: 'Подписать KYC документы', client: 'Limassol Holdings', assignee: 'Мария К.', priority: 'critical', status: 'pending' },
      { id: '3', title: 'Обновить IPS', client: 'North Star Trust', assignee: 'Иван С.', priority: 'medium', status: 'in_progress' },
      { id: '4', title: 'Ребалансировка', client: 'Vega Partners', assignee: 'Елена В.', priority: 'high', status: 'pending' },
      { id: '5', title: 'Проверить синхронизацию', client: 'Orion Family', assignee: 'Дмитрий Н.', priority: 'low', status: 'completed' },
    ],
  },
  'onboarding': {
    kpiValues: { active: 4, pendingDocs: 2, kycReview: 1, completedMonth: 5 },
    items: [
      { id: '1', name: 'Johnson Family', stage: 'Documentation', progress: '75%', status: 'in_progress', dueDate: '2026-02-15' },
      { id: '2', name: 'Cyprus LLC', stage: 'KYC Review', progress: '45%', status: 'in_progress', dueDate: '2026-02-20' },
      { id: '3', name: 'Account Transfer', stage: 'ACAT', progress: '30%', status: 'pending', dueDate: '2026-03-01' },
      { id: '4', name: 'GRAT Formation', stage: 'Legal Review', progress: '60%', status: 'in_progress', dueDate: '2026-02-28' },
      { id: '5', name: 'New Entity', stage: 'Completed', progress: '100%', status: 'completed', dueDate: '2026-01-15' },
    ],
  },
  'ips': {
    kpiValues: { breaches: 15, critical: 5, warnings: 10, compliance: 94 },
    items: [
      { id: '1', rule: 'Equity allocation max', client: 'Aurora Family', current: '72%', threshold: '70%', severity: 'warning' },
      { id: '2', rule: 'Single position limit', client: 'Limassol Holdings', current: '12%', threshold: '10%', severity: 'critical' },
      { id: '3', rule: 'Fixed income min', client: 'North Star Trust', current: '18%', threshold: '20%', severity: 'warning' },
      { id: '4', rule: 'Cash buffer', client: 'Vega Partners', current: '2%', threshold: '5%', severity: 'critical' },
      { id: '5', rule: 'Int\'l exposure max', client: 'Orion Family', current: '28%', threshold: '30%', severity: 'info' },
    ],
  },
  'risk': {
    kpiValues: { alerts: 25, critical: 8, warnings: 17, riskScore: 7.2 },
    items: [
      { id: '1', title: 'Концентрация AAPL', client: 'Aurora Family', category: 'Concentration', severity: 'critical', timestamp: '2026-01-28 10:00' },
      { id: '2', title: 'Просроченный платеж', client: 'Limassol Holdings', category: 'Payment', severity: 'warning', timestamp: '2026-01-27 16:00' },
      { id: '3', title: 'Ошибка синхронизации', client: 'North Star Trust', category: 'Integration', severity: 'critical', timestamp: '2026-01-27 09:00' },
      { id: '4', title: 'IPS нарушение', client: 'Vega Partners', category: 'Compliance', severity: 'warning', timestamp: '2026-01-26 14:00' },
      { id: '5', title: 'Документ истекает', client: 'Orion Family', category: 'Document', severity: 'info', timestamp: '2026-01-25 11:00' },
    ],
  },
  'tax': {
    kpiValues: { taxSavings: 1200000, harvestingOpportunity: 450000, unrealizedGains: 8500000, estimatedTax: 2100000 },
    items: [
      { id: '1', security: 'AAPL', acquired: '2022-03-15', costBasis: 150000, marketValue: 285000, gainLoss: 135000 },
      { id: '2', security: 'MSFT', acquired: '2021-06-20', costBasis: 200000, marketValue: 380000, gainLoss: 180000 },
      { id: '3', security: 'GOOG', acquired: '2023-01-10', costBasis: 175000, marketValue: 145000, gainLoss: -30000 },
      { id: '4', security: 'AMZN', acquired: '2022-09-05', costBasis: 120000, marketValue: 165000, gainLoss: 45000 },
      { id: '5', security: 'NVDA', acquired: '2023-04-18', costBasis: 80000, marketValue: 245000, gainLoss: 165000 },
    ],
  },
  'trust-estate': {
    kpiValues: { trusts: 4, trustAssets: 73500000, beneficiaries: 21, jurisdictions: 3 },
    items: [
      { id: '1', name: 'Aurora Dynasty Trust', jurisdiction: 'Nevada', assets: 45000000, beneficiaries: 12, status: 'active' },
      { id: '2', name: 'Limassol Charitable', jurisdiction: 'Delaware', assets: 15000000, beneficiaries: 3, status: 'active' },
      { id: '3', name: 'North Star GRAT', jurisdiction: 'South Dakota', assets: 8000000, beneficiaries: 4, status: 'active' },
      { id: '4', name: 'Vega QPRT', jurisdiction: 'Nevada', assets: 5500000, beneficiaries: 2, status: 'active' },
      { id: '5', name: 'Cedar Legacy', jurisdiction: 'Delaware', assets: 0, beneficiaries: 0, status: 'draft' },
    ],
  },
  'integrations': {
    kpiValues: { total: 30, syncHealth: 87, errors: 4, warnings: 8 },
    items: [
      { id: '1', provider: 'Charles Schwab', client: 'Aurora Family', status: 'success', records: 1250, lastSync: '2026-01-28 08:00' },
      { id: '2', provider: 'Goldman Sachs', client: 'Limassol Holdings', status: 'error', records: 0, lastSync: '2026-01-27 22:00' },
      { id: '3', provider: 'UBS', client: 'North Star Trust', status: 'warning', records: 890, lastSync: '2026-01-28 06:00' },
      { id: '4', provider: 'JP Morgan', client: 'Vega Partners', status: 'success', records: 2100, lastSync: '2026-01-28 07:30' },
      { id: '5', provider: 'Fidelity', client: 'Orion Family', status: 'success', records: 650, lastSync: '2026-01-28 08:15' },
    ],
  },
  'communications': {
    kpiValues: { sentMonth: 156, emails: 89, notifications: 52, pendingRequests: 8 },
    items: [
      { id: '1', type: 'Email', subject: 'Q4 Report готов', recipient: 'Aurora Family', sentAt: '2026-01-28 10:00', status: 'delivered' },
      { id: '2', type: 'Notification', subject: 'Новый IPS breach', recipient: 'CIO Team', sentAt: '2026-01-28 09:30', status: 'read' },
      { id: '3', type: 'Email', subject: 'Invoice #INV-2026-015', recipient: 'Limassol Holdings', sentAt: '2026-01-27 16:00', status: 'pending' },
      { id: '4', type: 'SMS', subject: 'Approval needed', recipient: '+7 999 ***', sentAt: '2026-01-27 14:00', status: 'delivered' },
      { id: '5', type: 'Email', subject: 'Monthly statement', recipient: 'North Star Trust', sentAt: '2026-01-26 09:00', status: 'delivered' },
    ],
  },
};

export function getModuleMock(slug: string): ModuleMock {
  return moduleMocks[slug] || { kpiValues: {}, items: [] };
}
