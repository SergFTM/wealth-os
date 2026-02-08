// Tax Lots Stub Engine
// Creates placeholder tax impact notes (links to Tax Center module 11)

export interface TaxLotNote {
  id: string;
  sourceModule: string;
  sourceRecordId: string;
  sourceType: 'corporate_action' | 'private_deal' | 'fund_event';
  taxLotId?: string;
  ticker?: string;
  securityName?: string;
  eventDate: string;
  noteType: 'cost_basis_adjustment' | 'holding_period' | 'wash_sale' | 'tax_character' | 'estimated_gain' | 'k1_expectation';
  description: string;
  impactJson?: Record<string, unknown>;
  status: 'pending_review' | 'reviewed' | 'applied';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

// Generate tax lot notes for corporate action
export function createCorporateActionTaxNotes(
  action: {
    id: string;
    actionType: string;
    ticker: string;
    securityName?: string;
    effectiveDate: string;
    detailsJson?: Record<string, unknown>;
    impactJson?: Record<string, unknown>;
  }
): Omit<TaxLotNote, 'id' | 'createdAt'>[] {
  const notes: Omit<TaxLotNote, 'id' | 'createdAt'>[] = [];
  const impact = action.impactJson || {};
  const details = action.detailsJson || {};

  switch (action.actionType) {
    case 'dividend':
      notes.push({
        sourceModule: '42-deals',
        sourceRecordId: action.id,
        sourceType: 'corporate_action',
        ticker: action.ticker,
        securityName: action.securityName,
        eventDate: action.effectiveDate,
        noteType: 'tax_character',
        description: `Dividend received: $${impact.estimatedCashImpact || 0}. Verify qualified vs ordinary dividend status for tax reporting.`,
        impactJson: {
          amount: impact.estimatedCashImpact,
          potentialQualified: true,
          estimatedTax: impact.estimatedTaxImpact,
        },
        status: 'pending_review',
      });
      break;

    case 'split':
    case 'reverse_split':
      notes.push({
        sourceModule: '42-deals',
        sourceRecordId: action.id,
        sourceType: 'corporate_action',
        ticker: action.ticker,
        securityName: action.securityName,
        eventDate: action.effectiveDate,
        noteType: 'cost_basis_adjustment',
        description: `Stock ${action.actionType}: Ratio ${details.ratio}. Cost basis per share requires adjustment. Total cost basis unchanged.`,
        impactJson: {
          ratio: details.ratio,
          originalShares: impact.affectedShares,
          newShares: impact.newShares,
        },
        status: 'pending_review',
      });
      break;

    case 'spin_off':
      notes.push({
        sourceModule: '42-deals',
        sourceRecordId: action.id,
        sourceType: 'corporate_action',
        ticker: action.ticker,
        securityName: action.securityName,
        eventDate: action.effectiveDate,
        noteType: 'cost_basis_adjustment',
        description: `Spin-off: Cost basis allocation required between parent and spin-off shares. Review IRS guidance for allocation percentage.`,
        impactJson: {
          allocationPct: details.allocationPct,
          costBasisAdjustment: impact.costBasisAdjustment,
        },
        status: 'pending_review',
      });
      notes.push({
        sourceModule: '42-deals',
        sourceRecordId: action.id,
        sourceType: 'corporate_action',
        ticker: action.ticker,
        eventDate: action.effectiveDate,
        noteType: 'holding_period',
        description: `Spin-off: Holding period for new shares tacks onto original holding period of parent shares.`,
        status: 'pending_review',
      });
      break;

    case 'merger':
    case 'acquisition':
      if ((impact.estimatedCashImpact as number) > 0) {
        notes.push({
          sourceModule: '42-deals',
          sourceRecordId: action.id,
          sourceType: 'corporate_action',
          ticker: action.ticker,
          securityName: action.securityName,
          eventDate: action.effectiveDate,
          noteType: 'estimated_gain',
          description: `${action.actionType}: Potential realized gain/loss. Review tax lot selection method (FIFO, specific ID, etc.) before processing.`,
          impactJson: {
            cashReceived: impact.estimatedCashImpact,
            estimatedGain: (impact.estimatedCashImpact as number) - ((impact.costBasisAdjustment as number) || 0),
            estimatedTax: impact.estimatedTaxImpact,
          },
          status: 'pending_review',
        });
      }
      if (details.ratio) {
        notes.push({
          sourceModule: '42-deals',
          sourceRecordId: action.id,
          sourceType: 'corporate_action',
          ticker: action.ticker,
          eventDate: action.effectiveDate,
          noteType: 'holding_period',
          description: `${action.actionType}: If tax-free reorganization, holding period carries over. Verify reorganization qualifies under IRC 368.`,
          status: 'pending_review',
        });
      }
      break;

    case 'tender':
      notes.push({
        sourceModule: '42-deals',
        sourceRecordId: action.id,
        sourceType: 'corporate_action',
        ticker: action.ticker,
        securityName: action.securityName,
        eventDate: action.effectiveDate,
        noteType: 'estimated_gain',
        description: `Tender offer: Partial disposition expected. Select specific tax lots for optimal tax outcome.`,
        impactJson: {
          tenderPct: details.tenderPct,
          estimatedProceeds: impact.estimatedCashImpact,
        },
        status: 'pending_review',
      });
      break;
  }

  return notes;
}

// Generate tax lot notes for private deal
export function createPrivateDealTaxNotes(
  deal: {
    id: string;
    name: string;
    dealType: string;
    closeDate?: string;
    amount?: number;
    termsJson?: Record<string, unknown>;
  }
): Omit<TaxLotNote, 'id' | 'createdAt'>[] {
  const notes: Omit<TaxLotNote, 'id' | 'createdAt'>[] = [];
  const terms = deal.termsJson || {};

  notes.push({
    sourceModule: '42-deals',
    sourceRecordId: deal.id,
    sourceType: 'private_deal',
    eventDate: deal.closeDate || new Date().toISOString().split('T')[0],
    noteType: 'k1_expectation',
    description: `Private deal "${deal.name}": Expect K-1 for tax year. Track partnership allocations of income, gains, losses, deductions.`,
    impactJson: {
      dealType: deal.dealType,
      amount: deal.amount,
      jurisdiction: terms.jurisdiction,
    },
    status: 'pending_review',
  });

  if (deal.dealType === 'fund_commitment' || deal.dealType === 'subscription') {
    notes.push({
      sourceModule: '42-deals',
      sourceRecordId: deal.id,
      sourceType: 'private_deal',
      eventDate: deal.closeDate || new Date().toISOString().split('T')[0],
      noteType: 'tax_character',
      description: `Fund commitment: Monitor for UBTI (unrelated business taxable income) if investing through tax-exempt entity.`,
      status: 'pending_review',
    });
  }

  return notes;
}

// Generate tax lot notes for fund event
export function createFundEventTaxNotes(
  event: {
    id: string;
    fundName: string;
    eventType: string;
    eventDate: string;
    amount: number;
    distributionDetailsJson?: Record<string, unknown>;
  }
): Omit<TaxLotNote, 'id' | 'createdAt'>[] {
  const notes: Omit<TaxLotNote, 'id' | 'createdAt'>[] = [];
  const distDetails = event.distributionDetailsJson || {};

  if (event.eventType === 'distribution') {
    notes.push({
      sourceModule: '42-deals',
      sourceRecordId: event.id,
      sourceType: 'fund_event',
      eventDate: event.eventDate,
      noteType: 'tax_character',
      description: `Distribution from ${event.fundName}: $${event.amount}. Review K-1 for breakdown of return of capital vs. gains vs. income.`,
      impactJson: {
        totalAmount: event.amount,
        returnOfCapital: distDetails.returnOfCapital,
        gains: distDetails.gains,
        income: distDetails.income,
      },
      status: 'pending_review',
    });

    if (distDetails.returnOfCapital) {
      notes.push({
        sourceModule: '42-deals',
        sourceRecordId: event.id,
        sourceType: 'fund_event',
        eventDate: event.eventDate,
        noteType: 'cost_basis_adjustment',
        description: `Return of capital: $${distDetails.returnOfCapital}. Reduces cost basis in fund investment. Track cumulative ROC.`,
        impactJson: {
          rocAmount: distDetails.returnOfCapital,
        },
        status: 'pending_review',
      });
    }
  }

  if (event.eventType === 'capital_call') {
    notes.push({
      sourceModule: '42-deals',
      sourceRecordId: event.id,
      sourceType: 'fund_event',
      eventDate: event.eventDate,
      noteType: 'cost_basis_adjustment',
      description: `Capital call: $${event.amount}. Increases cost basis in fund investment. Track acquisition date for holding period.`,
      impactJson: {
        callAmount: event.amount,
      },
      status: 'pending_review',
    });
  }

  return notes;
}

export default {
  createCorporateActionTaxNotes,
  createPrivateDealTaxNotes,
  createFundEventTaxNotes,
};
