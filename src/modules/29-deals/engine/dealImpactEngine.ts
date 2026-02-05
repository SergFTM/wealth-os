/**
 * Deal Impact Engine
 * Computes impact on Net Worth, GL, and Performance
 */

// Simple UUID generator
function uuidv4(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export interface DealTransaction {
  id: string;
  dealId: string;
  txDate: string;
  txType: 'buy' | 'sell' | 'fee' | 'distribution' | 'call' | 'dividend';
  amount: number;
  currency: string;
  status: 'draft' | 'pending' | 'posted' | 'reversed';
  glRefId?: string;
}

export interface ImpactLine {
  id: string;
  sourceType: 'transaction' | 'corporate_action' | 'capital_event';
  sourceId: string;
  sourceRef: string;
  asOfDate: string;
  netWorthDelta: number;
  glDebit?: {
    accountCode: string;
    accountName: string;
    amount: number;
  };
  glCredit?: {
    accountCode: string;
    accountName: string;
    amount: number;
  };
  performanceTag?: string;
  status: 'planned' | 'posted';
}

export interface GlEntry {
  id: string;
  txDate: string;
  postDate: string;
  sourceType: string;
  sourceId: string;
  debitAccount: string;
  debitAmount: number;
  creditAccount: string;
  creditAmount: number;
  currency: string;
  description: string;
  status: 'draft' | 'posted';
}

// Account mapping for different transaction types
const TX_ACCOUNT_MAP: Record<string, { debit: string; credit: string; debitName: string; creditName: string }> = {
  buy: { debit: '1200', credit: '1100', debitName: 'Инвестиции', creditName: 'Денежные средства' },
  sell: { debit: '1100', credit: '1200', debitName: 'Денежные средства', creditName: 'Инвестиции' },
  fee: { debit: '5100', credit: '1100', debitName: 'Расходы на комиссии', creditName: 'Денежные средства' },
  distribution: { debit: '1100', credit: '4200', debitName: 'Денежные средства', creditName: 'Доход от распределений' },
  call: { debit: '1200', credit: '1100', debitName: 'Обязательства по капиталу', creditName: 'Денежные средства' },
  dividend: { debit: '1100', credit: '4100', debitName: 'Денежные средства', creditName: 'Дивидендный доход' }
};

/**
 * Compute impact lines for a transaction
 */
export function computeTransactionImpact(tx: DealTransaction, dealName: string): ImpactLine {
  const accounts = TX_ACCOUNT_MAP[tx.txType] || TX_ACCOUNT_MAP.buy;

  // Calculate net worth delta
  let netWorthDelta = 0;
  switch (tx.txType) {
    case 'buy':
    case 'call':
      netWorthDelta = 0; // Asset exchange, no net change
      break;
    case 'sell':
      // TODO: compute realized gain/loss
      netWorthDelta = 0;
      break;
    case 'fee':
      netWorthDelta = -tx.amount; // Expense reduces net worth
      break;
    case 'distribution':
    case 'dividend':
      netWorthDelta = tx.amount; // Income increases net worth
      break;
  }

  return {
    id: uuidv4(),
    sourceType: 'transaction',
    sourceId: tx.id,
    sourceRef: `TX-${dealName}`,
    asOfDate: tx.txDate,
    netWorthDelta,
    glDebit: {
      accountCode: accounts.debit,
      accountName: accounts.debitName,
      amount: tx.amount
    },
    glCredit: {
      accountCode: accounts.credit,
      accountName: accounts.creditName,
      amount: tx.amount
    },
    performanceTag: tx.txType === 'dividend' || tx.txType === 'distribution' ? 'income' : 'capital',
    status: tx.status === 'posted' ? 'posted' : 'planned'
  };
}

/**
 * Create GL entry from transaction
 */
export function createGlEntry(tx: DealTransaction, dealName: string): GlEntry {
  const accounts = TX_ACCOUNT_MAP[tx.txType] || TX_ACCOUNT_MAP.buy;
  const now = new Date().toISOString();

  return {
    id: uuidv4(),
    txDate: tx.txDate,
    postDate: now,
    sourceType: 'deal_transaction',
    sourceId: tx.id,
    debitAccount: accounts.debit,
    debitAmount: tx.amount,
    creditAccount: accounts.credit,
    creditAmount: tx.amount,
    currency: tx.currency,
    description: `${tx.txType.toUpperCase()} - ${dealName}`,
    status: 'posted'
  };
}

/**
 * Compute aggregate deal impact
 */
export function computeDealImpact(transactions: DealTransaction[], dealName: string): {
  totalInvested: number;
  totalDistributions: number;
  totalFees: number;
  netCashFlow: number;
  impactLines: ImpactLine[];
} {
  let totalInvested = 0;
  let totalDistributions = 0;
  let totalFees = 0;
  const impactLines: ImpactLine[] = [];

  for (const tx of transactions) {
    const impact = computeTransactionImpact(tx, dealName);
    impactLines.push(impact);

    switch (tx.txType) {
      case 'buy':
      case 'call':
        totalInvested += tx.amount;
        break;
      case 'sell':
        totalInvested -= tx.amount;
        break;
      case 'distribution':
      case 'dividend':
        totalDistributions += tx.amount;
        break;
      case 'fee':
        totalFees += tx.amount;
        break;
    }
  }

  return {
    totalInvested,
    totalDistributions,
    totalFees,
    netCashFlow: totalDistributions - totalInvested - totalFees,
    impactLines
  };
}

/**
 * Generate posting summary
 */
export function generatePostingSummary(impactLines: ImpactLine[]): {
  planned: number;
  posted: number;
  totalDebit: number;
  totalCredit: number;
} {
  let planned = 0;
  let posted = 0;
  let totalDebit = 0;
  let totalCredit = 0;

  for (const line of impactLines) {
    if (line.status === 'planned') planned++;
    else posted++;

    if (line.glDebit) totalDebit += line.glDebit.amount;
    if (line.glCredit) totalCredit += line.glCredit.amount;
  }

  return { planned, posted, totalDebit, totalCredit };
}

/**
 * Compute net worth delta from capital event
 */
export function computeCapitalEventImpact(
  eventType: 'capital_call' | 'distribution' | 'valuation' | 'funding_round',
  amount: number,
  vehicleName: string
): ImpactLine {
  let netWorthDelta = 0;
  let debit = { accountCode: '1200', accountName: 'Инвестиции', amount };
  let credit = { accountCode: '1100', accountName: 'Денежные средства', amount };

  switch (eventType) {
    case 'capital_call':
      netWorthDelta = 0; // Asset exchange
      debit = { accountCode: '1200', accountName: 'Инвестиции в фонды', amount };
      credit = { accountCode: '1100', accountName: 'Денежные средства', amount };
      break;
    case 'distribution':
      netWorthDelta = amount; // Return of capital + gains
      debit = { accountCode: '1100', accountName: 'Денежные средства', amount };
      credit = { accountCode: '4200', accountName: 'Распределения', amount };
      break;
    case 'valuation':
      netWorthDelta = amount; // Mark-to-market
      debit = { accountCode: '1200', accountName: 'Инвестиции', amount };
      credit = { accountCode: '4300', accountName: 'Нереализованная прибыль', amount };
      break;
    case 'funding_round':
      netWorthDelta = 0;
      break;
  }

  return {
    id: uuidv4(),
    sourceType: 'capital_event',
    sourceId: '',
    sourceRef: `CE-${vehicleName}`,
    asOfDate: new Date().toISOString(),
    netWorthDelta,
    glDebit: debit,
    glCredit: credit,
    performanceTag: eventType === 'distribution' ? 'income' : 'capital',
    status: 'planned'
  };
}
