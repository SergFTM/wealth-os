// Corporate Actions Engine
// Handles processing of corporate actions and their impact on positions

import { getCollection, createRecord, updateRecord } from '@/lib/apiClient';

export interface CorporateAction {
  id: string;
  clientId: string;
  ticker: string;
  securityName?: string;
  actionType: string;
  effectiveDate: string;
  status: string;
  detailsJson?: Record<string, unknown>;
  impactJson?: Record<string, unknown>;
  processedAt?: string;
  processedBy?: string;
}

export interface ImpactSummary {
  affectedPositions: number;
  affectedShares: number;
  estimatedCashImpact: number;
  estimatedTaxImpact: number;
  newShares?: number;
  costBasisAdjustment?: number;
}

// Calculate impact of corporate action on positions
export function calculateActionImpact(
  action: CorporateAction,
  positions: Array<{ ticker: string; shares: number; costBasis: number }>
): ImpactSummary {
  const affectedPositions = positions.filter(p => p.ticker === action.ticker);
  const totalShares = affectedPositions.reduce((sum, p) => sum + p.shares, 0);
  const totalCostBasis = affectedPositions.reduce((sum, p) => sum + p.costBasis, 0);

  let cashImpact = 0;
  let taxImpact = 0;
  let newShares = totalShares;
  let costBasisAdjustment = 0;

  const details = action.detailsJson || {};

  switch (action.actionType) {
    case 'dividend':
      cashImpact = totalShares * (details.rate as number || 0);
      taxImpact = cashImpact * 0.15; // Simplified qualified dividend rate
      break;

    case 'split':
      const splitRatio = parseFloat(details.ratio as string || '2:1');
      newShares = totalShares * splitRatio;
      costBasisAdjustment = totalCostBasis * (1 - 1 / splitRatio);
      break;

    case 'reverse_split':
      const reverseRatio = parseFloat(details.ratio as string || '1:10');
      newShares = Math.floor(totalShares / reverseRatio);
      const fractionalValue = (totalShares % reverseRatio) * (details.cashAmount as number || 0);
      cashImpact = fractionalValue;
      break;

    case 'merger':
    case 'acquisition':
      cashImpact = totalShares * (details.cashAmount as number || 0);
      newShares = Math.floor(totalShares * parseFloat(details.ratio as string || '1'));
      taxImpact = Math.max(0, cashImpact - totalCostBasis) * 0.20;
      break;

    case 'spin_off':
      costBasisAdjustment = totalCostBasis * (details.allocationPct as number || 0.1);
      break;

    case 'tender':
      // Assume partial tender
      const tenderPct = details.tenderPct as number || 0.5;
      cashImpact = totalShares * tenderPct * (details.price as number || 0);
      newShares = Math.floor(totalShares * (1 - tenderPct));
      break;
  }

  return {
    affectedPositions: affectedPositions.length,
    affectedShares: totalShares,
    estimatedCashImpact: Math.round(cashImpact * 100) / 100,
    estimatedTaxImpact: Math.round(taxImpact * 100) / 100,
    newShares,
    costBasisAdjustment: Math.round(costBasisAdjustment * 100) / 100,
  };
}

// Create a new corporate action
export async function createCorporateAction(
  data: Omit<CorporateAction, 'id'>
): Promise<CorporateAction | null> {
  return await createRecord<CorporateAction>('dlCorporateActions', {
    ...data,
    status: data.status || 'planned',
  });
}

// Mark corporate action as processed
export async function markActionProcessed(
  actionId: string,
  processedBy: string
): Promise<CorporateAction | null> {
  return await updateRecord<CorporateAction>('dlCorporateActions', actionId, {
    status: 'processed',
    processedAt: new Date().toISOString(),
    processedBy,
  });
}

// Generate impact summary text
export function generateImpactSummaryText(
  action: CorporateAction,
  impact: ImpactSummary
): string {
  const lines: string[] = [];

  lines.push(`Corporate Action: ${action.actionType.toUpperCase()}`);
  lines.push(`Security: ${action.ticker} - ${action.securityName || ''}`);
  lines.push(`Effective Date: ${action.effectiveDate}`);
  lines.push('');
  lines.push('Impact Summary:');
  lines.push(`- Affected Positions: ${impact.affectedPositions}`);
  lines.push(`- Affected Shares: ${impact.affectedShares.toLocaleString()}`);

  if (impact.estimatedCashImpact !== 0) {
    lines.push(`- Estimated Cash Impact: $${impact.estimatedCashImpact.toLocaleString()}`);
  }

  if (impact.estimatedTaxImpact !== 0) {
    lines.push(`- Estimated Tax Impact: $${impact.estimatedTaxImpact.toLocaleString()}`);
  }

  if (impact.newShares && impact.newShares !== impact.affectedShares) {
    lines.push(`- New Share Count: ${impact.newShares.toLocaleString()}`);
  }

  if (impact.costBasisAdjustment && impact.costBasisAdjustment !== 0) {
    lines.push(`- Cost Basis Adjustment: $${impact.costBasisAdjustment.toLocaleString()}`);
  }

  return lines.join('\n');
}

// Create GL posting stub (placeholder - not posted)
export async function createGLPostingStub(
  action: CorporateAction,
  impact: ImpactSummary
): Promise<string> {
  // Returns a placeholder posting ID
  // In production, this would create a draft GL transaction
  const stubId = `gl-stub-${action.id}-${Date.now()}`;

  console.log('GL Posting Stub created:', {
    id: stubId,
    action: action.actionType,
    ticker: action.ticker,
    cashImpact: impact.estimatedCashImpact,
    status: 'draft',
  });

  return stubId;
}

// Create tax lot notes (placeholder)
export async function createTaxLotNotes(
  action: CorporateAction,
  impact: ImpactSummary
): Promise<string[]> {
  // Returns placeholder tax lot note IDs
  // In production, this would create notes linked to affected tax lots
  const noteIds: string[] = [];

  if (impact.affectedPositions > 0) {
    for (let i = 0; i < Math.min(impact.affectedPositions, 5); i++) {
      noteIds.push(`tax-note-${action.id}-${i}`);
    }
  }

  console.log('Tax Lot Notes created:', {
    actionId: action.id,
    noteCount: noteIds.length,
    taxImpact: impact.estimatedTaxImpact,
  });

  return noteIds;
}

export default {
  calculateActionImpact,
  createCorporateAction,
  markActionProcessed,
  generateImpactSummaryText,
  createGLPostingStub,
  createTaxLotNotes,
};
