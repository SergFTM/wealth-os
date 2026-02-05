/**
 * Data Quality Reconciliation Engine
 * Runs reconciliation checks between data sources
 */

import { DqReconCheck, DqReconCheckCreateInput, ReconDetail } from '../schema/dqReconCheck';
import { DqReconType } from '../config';

export interface ReconRunResult {
  checks: Omit<DqReconCheck, 'id' | 'createdAt' | 'updatedAt'>[];
  breaks: number;
}

function sumByField(records: Record<string, unknown>[], field: string): number {
  return records.reduce((sum, r) => sum + (Number(r[field]) || 0), 0);
}

export function runBankVsLedgerRecon(
  bankTransactions: Record<string, unknown>[],
  ledgerTransactions: Record<string, unknown>[],
  scopeId: string = 'global',
  tolerance: number = 0.01
): Omit<DqReconCheck, 'id' | 'createdAt' | 'updatedAt'> {
  const bankTotal = sumByField(bankTransactions, 'amount');
  const ledgerTotal = sumByField(ledgerTransactions, 'amount');
  const delta = bankTotal - ledgerTotal;
  const totalBase = Math.max(Math.abs(bankTotal), Math.abs(ledgerTotal), 1);
  const deltaPct = (delta / totalBase) * 100;

  const isBreak = Math.abs(deltaPct) > tolerance * 100;

  const details: ReconDetail[] = [{
    leftSource: 'bankTransactions',
    rightSource: 'ledgerTransactions',
    leftValue: bankTotal,
    rightValue: ledgerTotal,
    field: 'total_amount',
  }];

  return {
    reconType: 'bank_ledger',
    scopeType: 'global',
    scopeId,
    status: isBreak ? 'break' : 'ok',
    deltaAmount: delta,
    deltaPct: Math.round(deltaPct * 100) / 100,
    currency: 'USD',
    details,
    tolerance,
    lastRunAt: new Date().toISOString(),
  };
}

export function runIborVsAborRecon(
  iborPositions: Record<string, unknown>[],
  aborPositions: Record<string, unknown>[],
  scopeId: string = 'global'
): Omit<DqReconCheck, 'id' | 'createdAt' | 'updatedAt'> {
  const iborTotal = sumByField(iborPositions, 'marketValue');
  const aborTotal = sumByField(aborPositions, 'marketValue');
  const delta = iborTotal - aborTotal;
  const totalBase = Math.max(Math.abs(iborTotal), Math.abs(aborTotal), 1);
  const deltaPct = (delta / totalBase) * 100;

  const iborCount = iborPositions.length;
  const aborCount = aborPositions.length;

  const isBreak = Math.abs(deltaPct) > 1 || Math.abs(iborCount - aborCount) > 0;

  const details: ReconDetail[] = [
    {
      leftSource: 'IBOR',
      rightSource: 'ABOR',
      leftValue: iborTotal,
      rightValue: aborTotal,
      field: 'total_market_value',
    },
    {
      leftSource: 'IBOR',
      rightSource: 'ABOR',
      leftValue: iborCount,
      rightValue: aborCount,
      field: 'positions_count',
    },
  ];

  return {
    reconType: 'ibor_abor',
    scopeType: 'global',
    scopeId,
    status: isBreak ? 'break' : 'ok',
    deltaAmount: delta,
    deltaPct: Math.round(deltaPct * 100) / 100,
    currency: 'USD',
    details,
    lastRunAt: new Date().toISOString(),
  };
}

export function runPositionsVsStatementsRecon(
  positions: Record<string, unknown>[],
  statements: Record<string, unknown>[],
  scopeId: string = 'global'
): Omit<DqReconCheck, 'id' | 'createdAt' | 'updatedAt'> {
  const positionMap = new Map<string, number>();
  for (const pos of positions) {
    const key = `${pos.securityId}|${pos.accountId}`;
    positionMap.set(key, (pos.marketValue as number) || 0);
  }

  let totalDelta = 0;
  const details: ReconDetail[] = [];

  for (const stmt of statements) {
    const key = `${stmt.securityId}|${stmt.accountId}`;
    const posValue = positionMap.get(key) || 0;
    const stmtValue = (stmt.marketValue as number) || 0;
    const diff = posValue - stmtValue;

    if (Math.abs(diff) > 0.01) {
      totalDelta += diff;
      details.push({
        leftSource: 'positions',
        rightSource: 'statements',
        leftValue: posValue,
        rightValue: stmtValue,
        field: 'marketValue',
        recordRef: key,
      });
    }
  }

  const isBreak = details.length > 0;

  return {
    reconType: 'positions_statements',
    scopeType: 'global',
    scopeId,
    status: isBreak ? 'break' : 'ok',
    deltaAmount: totalDelta,
    currency: 'USD',
    details: details.slice(0, 10), // Limit details
    lastRunAt: new Date().toISOString(),
  };
}

export function runAllReconChecks(
  dataByCollection: Record<string, Record<string, unknown>[]>
): ReconRunResult {
  const checks: Omit<DqReconCheck, 'id' | 'createdAt' | 'updatedAt'>[] = [];

  // Bank vs Ledger
  const bankTx = dataByCollection.bankTransactions || [];
  const ledgerTx = dataByCollection.glTransactions || [];
  if (bankTx.length > 0 || ledgerTx.length > 0) {
    checks.push(runBankVsLedgerRecon(bankTx, ledgerTx));
  }

  // IBOR vs ABOR (simulated with positions)
  const positions = dataByCollection.positions || [];
  if (positions.length > 0) {
    // Simulate ABOR as slightly different positions
    const aborPositions = positions.map(p => ({
      ...p,
      marketValue: (p.marketValue as number) * (1 + (Math.random() - 0.5) * 0.02),
    }));
    checks.push(runIborVsAborRecon(positions, aborPositions));
  }

  // Positions vs Statements
  const statements = dataByCollection.statements || [];
  if (positions.length > 0 && statements.length > 0) {
    checks.push(runPositionsVsStatementsRecon(positions, statements));
  }

  const breaks = checks.filter(c => c.status === 'break').length;

  return { checks, breaks };
}
