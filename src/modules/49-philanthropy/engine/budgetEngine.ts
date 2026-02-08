/**
 * Budget Engine
 * Computes charitable giving budgets, allocations, and remaining amounts
 */

export interface Grant {
  id: string;
  entityId: string;
  programId?: string;
  stageKey: string;
  approvedAmount?: number;
  requestedAmount?: number;
  currency: string;
  createdAt: string;
}

export interface Payout {
  id: string;
  grantId: string;
  amount: number;
  currency: string;
  statusKey: string;
  payoutDate: string;
}

export interface Budget {
  id: string;
  entityId: string;
  year: number;
  budgetAmount: number;
  currency: string;
  committedAmount: number;
  paidAmount: number;
  remainingAmount: number;
  allocationsJson?: ProgramAllocation[];
}

export interface ProgramAllocation {
  programId: string;
  programName: string;
  allocated: number;
  committed: number;
  paid: number;
}

export interface BudgetSummary {
  entityId: string;
  year: number;
  budgetAmount: number;
  committedAmount: number;
  paidAmount: number;
  remainingAmount: number;
  utilizationPercent: number;
  allocations: ProgramAllocation[];
}

/**
 * Calculate committed amount for an entity/year
 * Committed = sum of approved grants (not yet fully paid)
 */
export function calculateCommitted(
  grants: Grant[],
  entityId: string,
  year: number
): number {
  return grants
    .filter(g => {
      const grantYear = new Date(g.createdAt).getFullYear();
      return (
        g.entityId === entityId &&
        grantYear === year &&
        ['approved', 'paid'].includes(g.stageKey)
      );
    })
    .reduce((sum, g) => sum + (g.approvedAmount || 0), 0);
}

/**
 * Calculate paid amount for an entity/year
 */
export function calculatePaid(
  payouts: Payout[],
  grants: Grant[],
  entityId: string,
  year: number
): number {
  const entityGrantIds = grants
    .filter(g => {
      const grantYear = new Date(g.createdAt).getFullYear();
      return g.entityId === entityId && grantYear === year;
    })
    .map(g => g.id);

  return payouts
    .filter(p => {
      const payoutYear = new Date(p.payoutDate).getFullYear();
      return (
        entityGrantIds.includes(p.grantId) &&
        payoutYear === year &&
        p.statusKey === 'confirmed'
      );
    })
    .reduce((sum, p) => sum + p.amount, 0);
}

/**
 * Compute budget summary for an entity/year
 */
export function computeBudgetSummary(
  budget: Budget,
  grants: Grant[],
  payouts: Payout[],
  programs: { id: string; name: string }[]
): BudgetSummary {
  const committedAmount = calculateCommitted(grants, budget.entityId, budget.year);
  const paidAmount = calculatePaid(payouts, grants, budget.entityId, budget.year);
  const remainingAmount = budget.budgetAmount - committedAmount;

  // Calculate allocations by program
  const allocations: ProgramAllocation[] = programs.map(program => {
    const programGrants = grants.filter(
      g =>
        g.entityId === budget.entityId &&
        g.programId === program.id &&
        new Date(g.createdAt).getFullYear() === budget.year
    );

    const committed = programGrants
      .filter(g => ['approved', 'paid'].includes(g.stageKey))
      .reduce((sum, g) => sum + (g.approvedAmount || 0), 0);

    const programGrantIds = programGrants.map(g => g.id);
    const paid = payouts
      .filter(p => programGrantIds.includes(p.grantId) && p.statusKey === 'confirmed')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      programId: program.id,
      programName: program.name,
      allocated: 0, // Would come from budget allocation settings
      committed,
      paid,
    };
  });

  const utilizationPercent =
    budget.budgetAmount > 0
      ? Math.round((committedAmount / budget.budgetAmount) * 100)
      : 0;

  return {
    entityId: budget.entityId,
    year: budget.year,
    budgetAmount: budget.budgetAmount,
    committedAmount,
    paidAmount,
    remainingAmount,
    utilizationPercent,
    allocations,
  };
}

/**
 * Get budget status indicator
 */
export function getBudgetStatus(
  utilizationPercent: number
): 'ok' | 'warning' | 'critical' {
  if (utilizationPercent >= 100) return 'critical';
  if (utilizationPercent >= 80) return 'warning';
  return 'ok';
}

/**
 * Format currency amount
 */
export function formatBudgetAmount(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get scheduled payouts for next N days
 */
export function getScheduledPayouts(
  payouts: Payout[],
  days: number = 30
): Payout[] {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);

  return payouts.filter(p => {
    if (p.statusKey !== 'scheduled') return false;
    const payoutDate = new Date(p.payoutDate);
    return payoutDate >= now && payoutDate <= futureDate;
  });
}

/**
 * Sum scheduled payouts for next N days
 */
export function sumScheduledPayouts(
  payouts: Payout[],
  days: number = 30
): number {
  return getScheduledPayouts(payouts, days).reduce((sum, p) => sum + p.amount, 0);
}
