// GL Posting Stub Engine
// Creates placeholder GL transaction drafts (not posted to GL)

export interface GLPostingStub {
  id: string;
  sourceModule: string;
  sourceRecordId: string;
  sourceType: 'corporate_action' | 'private_deal' | 'fund_event';
  transactionDate: string;
  description: string;
  entries: GLEntry[];
  status: 'draft' | 'pending_review' | 'approved' | 'posted' | 'rejected';
  currency: string;
  totalDebit: number;
  totalCredit: number;
  notes?: string;
  createdAt: string;
}

export interface GLEntry {
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  memo?: string;
}

// Account codes for common scenarios
const ACCOUNT_CODES = {
  CASH: '1000',
  INVESTMENTS_PUBLIC: '1100',
  INVESTMENTS_PRIVATE: '1200',
  DIVIDEND_INCOME: '4100',
  REALIZED_GAINS: '4200',
  UNREALIZED_GAINS: '4300',
  MANAGEMENT_FEES: '5100',
  CAPITAL_CONTRIBUTIONS: '3100',
  DISTRIBUTIONS_PAYABLE: '2100',
};

// Generate GL posting stub for corporate action
export function createCorporateActionPostingStub(
  action: {
    id: string;
    actionType: string;
    ticker: string;
    effectiveDate: string;
    detailsJson?: Record<string, unknown>;
    impactJson?: Record<string, unknown>;
  }
): Omit<GLPostingStub, 'id' | 'createdAt'> {
  const impact = action.impactJson || {};
  const details = action.detailsJson || {};
  const entries: GLEntry[] = [];

  switch (action.actionType) {
    case 'dividend':
      const dividendAmount = impact.estimatedCashImpact as number || 0;
      entries.push({
        accountCode: ACCOUNT_CODES.CASH,
        accountName: 'Cash',
        debit: dividendAmount,
        credit: 0,
        memo: `Dividend received - ${action.ticker}`,
      });
      entries.push({
        accountCode: ACCOUNT_CODES.DIVIDEND_INCOME,
        accountName: 'Dividend Income',
        debit: 0,
        credit: dividendAmount,
        memo: `Dividend income - ${action.ticker}`,
      });
      break;

    case 'split':
    case 'reverse_split':
      // No cash impact, memo entry only
      entries.push({
        accountCode: ACCOUNT_CODES.INVESTMENTS_PUBLIC,
        accountName: 'Public Investments',
        debit: 0,
        credit: 0,
        memo: `Stock ${action.actionType} - ${action.ticker} - Cost basis adjusted`,
      });
      break;

    case 'merger':
    case 'acquisition':
      const cashProceeds = impact.estimatedCashImpact as number || 0;
      const gain = Math.max(0, cashProceeds - (impact.costBasisAdjustment as number || 0));

      if (cashProceeds > 0) {
        entries.push({
          accountCode: ACCOUNT_CODES.CASH,
          accountName: 'Cash',
          debit: cashProceeds,
          credit: 0,
          memo: `Cash from ${action.actionType} - ${action.ticker}`,
        });
        entries.push({
          accountCode: ACCOUNT_CODES.INVESTMENTS_PUBLIC,
          accountName: 'Public Investments',
          debit: 0,
          credit: cashProceeds - gain,
          memo: `Disposition - ${action.ticker}`,
        });
        if (gain > 0) {
          entries.push({
            accountCode: ACCOUNT_CODES.REALIZED_GAINS,
            accountName: 'Realized Gains',
            debit: 0,
            credit: gain,
            memo: `Gain on ${action.actionType} - ${action.ticker}`,
          });
        }
      }
      break;
  }

  const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = entries.reduce((sum, e) => sum + e.credit, 0);

  return {
    sourceModule: '42-deals',
    sourceRecordId: action.id,
    sourceType: 'corporate_action',
    transactionDate: action.effectiveDate,
    description: `Corporate Action: ${action.actionType} - ${action.ticker}`,
    entries,
    status: 'draft',
    currency: 'USD',
    totalDebit,
    totalCredit,
    notes: 'Auto-generated stub - requires review before posting',
  };
}

// Generate GL posting stub for fund event
export function createFundEventPostingStub(
  event: {
    id: string;
    eventType: string;
    fundName: string;
    eventDate: string;
    amount: number;
    currency?: string;
  }
): Omit<GLPostingStub, 'id' | 'createdAt'> {
  const entries: GLEntry[] = [];
  const amount = event.amount || 0;

  switch (event.eventType) {
    case 'capital_call':
      entries.push({
        accountCode: ACCOUNT_CODES.INVESTMENTS_PRIVATE,
        accountName: 'Private Investments',
        debit: amount,
        credit: 0,
        memo: `Capital call - ${event.fundName}`,
      });
      entries.push({
        accountCode: ACCOUNT_CODES.CASH,
        accountName: 'Cash',
        debit: 0,
        credit: amount,
        memo: `Capital call payment - ${event.fundName}`,
      });
      break;

    case 'distribution':
      entries.push({
        accountCode: ACCOUNT_CODES.CASH,
        accountName: 'Cash',
        debit: amount,
        credit: 0,
        memo: `Distribution received - ${event.fundName}`,
      });
      entries.push({
        accountCode: ACCOUNT_CODES.INVESTMENTS_PRIVATE,
        accountName: 'Private Investments',
        debit: 0,
        credit: amount * 0.7, // Simplified: 70% return of capital
        memo: `Return of capital - ${event.fundName}`,
      });
      entries.push({
        accountCode: ACCOUNT_CODES.REALIZED_GAINS,
        accountName: 'Realized Gains',
        debit: 0,
        credit: amount * 0.3, // Simplified: 30% gain
        memo: `Distribution gain - ${event.fundName}`,
      });
      break;

    case 'nav_update':
      // Memo entry only - unrealized
      entries.push({
        accountCode: ACCOUNT_CODES.INVESTMENTS_PRIVATE,
        accountName: 'Private Investments',
        debit: 0,
        credit: 0,
        memo: `NAV update recorded - ${event.fundName}`,
      });
      break;
  }

  const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = entries.reduce((sum, e) => sum + e.credit, 0);

  return {
    sourceModule: '42-deals',
    sourceRecordId: event.id,
    sourceType: 'fund_event',
    transactionDate: event.eventDate,
    description: `Fund Event: ${event.eventType} - ${event.fundName}`,
    entries,
    status: 'draft',
    currency: event.currency || 'USD',
    totalDebit,
    totalCredit,
    notes: 'Auto-generated stub - requires review before posting',
  };
}

// Validate GL posting (debits = credits)
export function validatePosting(stub: GLPostingStub): { valid: boolean; error?: string } {
  const totalDebit = stub.entries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = stub.entries.reduce((sum, e) => sum + e.credit, 0);

  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    return {
      valid: false,
      error: `Posting out of balance: Debit ${totalDebit} != Credit ${totalCredit}`,
    };
  }

  return { valid: true };
}

export default {
  createCorporateActionPostingStub,
  createFundEventPostingStub,
  validatePosting,
  ACCOUNT_CODES,
};
